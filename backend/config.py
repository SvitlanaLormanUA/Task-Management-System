from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS to allow requests only from localhost:5000
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5000"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task-management-syst.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
