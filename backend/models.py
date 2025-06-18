from enum import Enum
from config import db
from sqlalchemy import CheckConstraint
# Багато-до-багатьох
user_task = db.Table('user_task',
                     db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
                     db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True)
                     )

user_goal = db.Table('user_goal',
                     db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
                     db.Column('goal_id', db.Integer, db.ForeignKey('goals.id'), primary_key=True)
                     )

user_habit = db.Table('user_habit',
                      db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
                      db.Column('habit_id', db.Integer, db.ForeignKey('habits.id'), primary_key=True)
                      )

user_note = db.Table('user_note',
                     db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
                     db.Column('note_id', db.Integer, db.ForeignKey('notes.id'), primary_key=True)
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


class HabitDays(Enum):
    SU = "Sunday"
    MO = "Monday"
    TU = "Tuesday"
    WE = "Wednesday"
    TH = "Thursday"
    FR = "Friday"
    SA = "Saturday"


class HabitStatus(Enum):
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELED = "Canceled"
    PLANNED = "Planned"


class GoalPeriod(Enum):
    MONTHLY = "Monthly"
    WEEKLY = "Weekly"
    YEARLY = "Yearly"
    FIVE_YEAR = "Five Year"


class GoalStatus(Enum):
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELED = "Canceled"
    PLANNED = "Planned"


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(200), nullable=True)
    refresh_token = db.Column(db.String(200), nullable=True)

    tasks = db.relationship('Task', secondary=user_task, back_populates='users')
    goals = db.relationship('Goal', secondary=user_goal, back_populates='users')
    habits = db.relationship('Habit', secondary=user_habit, back_populates='users')
    notes = db.relationship('Note', back_populates='user')  

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

    status = db.Column(db.String(20), CheckConstraint("status IN ('Pending', 'In Progress', 'Completed', 'Canceled')"), nullable=True)
    category = db.Column(db.String(20), nullable=True)

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "dateAssigned": self.date_assigned.isoformat() if self.date_assigned else None,
            "dateDue": self.date_due.isoformat() if self.date_due else None,
            "users": [user.id for user in self.users],
            "status": self.status,
            "category": self.category
        }


class Note(db.Model):
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=True)
    folder_id = db.Column(db.Integer, nullable=True) 
    date_created = db.Column(db.DateTime, nullable=True)
    date_updated = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='notes')

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "folder_id": self.folder_id,  # Додайте це
            "date_created": self.date_created.isoformat() if self.date_created else None,
            "date_updated": self.date_updated.isoformat() if self.date_updated else None,
            "user_id": self.user_id
        }

class Habit(db.Model):
    __tablename__ = 'habits'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    color = db.Column(db.String(8), nullable=False)
    status = db.Column(db.String(200), nullable=False, default='Planned')
    habit_days = db.Column(db.String(200), nullable=False)
    users = db.relationship('User', secondary='user_habit', back_populates='habits')

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "color": self.color,
            "users": [user.id for user in self.users],
            "status": self.status,
            "habitDays": self.habit_days
        }

class Goal(db.Model):
    __tablename__ = 'goals'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)

    users = db.relationship('User', secondary=user_goal, back_populates='goals')  # Fixed secondary table

    status = db.Column(db.Enum(GoalStatus), nullable=False, default=GoalStatus.PLANNED)
    period = db.Column(db.Enum(GoalPeriod), nullable=False, default=GoalPeriod.WEEKLY)

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "users": [user.id for user in self.users],
            "status": self.status.value,
            "goalPeriod": self.period.value
        }
