from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import libsql_experimental as libsql
from dotenv import load_dotenv
import os
import sqlite3
from sqlalchemy.pool import StaticPool
from flask_jwt_extended import JWTManager
from datetime import timedelta
import threading

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",  # React dev server
    "http://localhost:5178"   # Vite dev server
])

# Turso configuration
url = os.getenv("DB_LINK")
auth_token = os.getenv("DB_AUTH_TOKEN")
local_db_path = "local.db"

class LibSQLWrapper:
    def __init__(self):
        self.local_db_path = local_db_path
        self.sync_url = url
        self.auth_token = auth_token
        self._lock = threading.Lock()
        self._setup_local_db()
    
    def _setup_local_db(self):
        """Initialize local database and sync from Turso"""
        try:
            # Create connection to Turso for syncing
            turso_conn = libsql.connect(
                database=self.local_db_path,
                sync_url=self.sync_url,
                auth_token=self.auth_token
            )
            
            # Initial sync to get latest data
            turso_conn.sync()
            turso_conn.close()
            
            print("Initial sync completed successfully")
            
        except Exception as e:
            print(f"Setup error: {e}")
            # Create local db if sync fails
            conn = sqlite3.connect(self.local_db_path)
            conn.close()
    
    def sync_to_turso(self):
        """Sync local changes to Turso"""
        with self._lock:
            try:
                turso_conn = libsql.connect(
                    database=self.local_db_path,
                    sync_url=self.sync_url,
                    auth_token=self.auth_token
                )
                turso_conn.sync()
                turso_conn.close()
                print("Sync to Turso completed")
                return True
            except Exception as e:
                print(f"Sync error: {e}")
                return False
    
    def __call__(self):
        """Return a new SQLite connection for SQLAlchemy"""
        return sqlite3.connect(
            self.local_db_path,
            check_same_thread=False,
            timeout=30
        )

# Initialize the wrapper
db_wrapper = LibSQLWrapper()

# Flask configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{local_db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': db_wrapper,
    'poolclass': StaticPool,
    'connect_args': {'check_same_thread': False}
}

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', '103ewihbjfrje')  # Use env var
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)

jwt = JWTManager(app)
db = SQLAlchemy(app)

def sync_after_commit():
    """Call this after important database operations"""
    try:
        db_wrapper.sync_to_turso()
    except Exception as e:
        print(f"Post-commit sync failed: {e}")

# Example usage in your routes:
