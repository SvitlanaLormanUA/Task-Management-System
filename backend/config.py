from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task-management-syst.db'

#це для того, щоб track всі зміни, які ми вносимо у бд
#воно памʼять їсть, тому, як то кажуть, for development puroposes, буде false, шоб життя легшим було
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db = SQLAlchemy(app)
