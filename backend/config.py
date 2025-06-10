from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import libsql_experimental as libsql
from dotenv import load_dotenv
import os
import sqlite3
from sqlalchemy.pool import StaticPool
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from datetime import timedelta

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})


# Turso
url = os.getenv("DB_LINK")
auth_token = os.getenv("DB_AUTH_TOKEN")
local_db_path = "local.db"

class LibSQLWrapper:
    def __init__(self):
        self.conn = None
        self.turso_conn = None
        self._setup_connections()

    def _setup_connections(self):    
        self.turso_conn = libsql.connect(
            database=local_db_path,
            sync_url=url,
            auth_token=auth_token
        )
        self.turso_conn.sync()

        self.conn = sqlite3.connect(
            local_db_path,
            check_same_thread=False,
            timeout=30  
        )

    def sync(self):
        try:
            self.turso_conn.sync()
        except Exception as e:
            print(f"Sync error: {e}")
            # Reconnect if sync fails
            self._setup_connections()
            raise

    def __call__(self):
        return self.conn

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{local_db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': LibSQLWrapper(),
    'poolclass': StaticPool,
    'connect_args': {'check_same_thread': False}
}
app.config['JWT_SECRET_KEY'] = '103ewihbjfrje'  
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)
jwt = JWTManager(app)

db = SQLAlchemy(app)

def sync_db():
    conn = libsql.connect(local_db_path, sync_url=url, auth_token=auth_token)

    # Внесення змін у базу
    conn.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER);")
    conn.execute("INSERT INTO users(id) VALUES (1);")
    conn.commit()

    # Синхронізація з Turso
    try:
        conn.sync()
        print("Database synced successfully with Turso")
    except Exception as e:
        print(f"Sync failed: {e}")
