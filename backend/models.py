from enum import Enum
from config import db

# Багато-до-багатьох
user_task = db.Table('user_task',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True)
)

class TaskCategory(Enum):
    WORK = "Work"
    HOME = "Home"
    STUDY = "Study"
    OTHER = "Other"
class TaskStatus(Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELED = "Canceled"
    

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(200), nullable=True)
    tasks = db.relationship('Task', secondary=user_task, back_populates='users')

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phoneNumber": self.phone_number,
            "location": self.location,
            "tasks": [task.id for task in self.tasks]
        }

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date_assigned = db.Column(db.DateTime, nullable=True)
    date_due = db.Column(db.DateTime, nullable=True)

    users = db.relationship('User', secondary=user_task, back_populates='tasks')

    status = db.Column(db.Enum(TaskStatus), nullable=False, default=TaskStatus.PENDING)
    category = db.Column(db.Enum(TaskCategory), nullable=True)

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "dateAssigned": self.date_assigned,
            "dateDue": self.date_due,
            "users": [user.id for user in self.users],
            "status": self.status.value,  
            "category": self.category.value if self.category else None
        }
