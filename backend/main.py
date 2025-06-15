from flask import request, jsonify, Response
from config import app, db
from models import User, Task, TaskCategory, TaskStatus, Note, Goal, Habit, GoalStatus, GoalPeriod, HabitStatus, \
    HabitDays
import bcrypt
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from datetime import timedelta
from dateutil.parser import parse 

# персоналізована сторінка?
@app.route("/", methods=["GET"])
@jwt_required() 
def enter_homepage():
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify("Welcome to the homepage! To personalize your experience, provide your User ID."), 200

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": f"Welcome, {user.name}!"}), 200


# --------------------------------------------User--------------------------------------------
@app.route("/signup", methods=["POST"])
def create_user():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415
    
    data = request.get_json()
    
    if not all([data.get("name"), data.get("email"), data.get("password")]):
        return jsonify({"error": "Name, email and password are required"}), 400

    try:
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "User already exists"}), 409

        hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())

        user = User(
            name=data["name"],
            email=data["email"],
            password=hashed_password.decode('utf-8'),
            phone_number=data.get("phoneNumber"),
            location=data.get("location")
        )
        
        db.session.add(user)
        db.session.commit()

        # Create tokens for the new user
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))  # Fixed: use create_refresh_token

        try:
            wrapper = app.config['SQLALCHEMY_ENGINE_OPTIONS']['creator']
            wrapper.sync()
        except Exception as e:
            print(f"Sync failed but user created locally: {e}")

        db.session.refresh(user)
        
        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_json()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"error": "Invalid password"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(minutes=30)  
    )

    refresh_token = create_refresh_token(
        identity=str(user.id),
        expires_delta=timedelta(days=7)
    )

    # Store refresh token in database (for logout functionality)
    user.refresh_token = refresh_token
    db.session.commit()
    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_json()
    }), 200


@app.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({
            "valid": True,
            "user_id": current_user
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401
    
@app.route("/users/<email>", methods=["GET"])
def get_user_by_email(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify(user.to_json()), 200

@app.route("/users/<int:user_id>", methods=["PUT"])  
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    
    # Security check: users can only update their own profile
    if str(current_user_id) != str(user_id):
        return jsonify({"error": "Unauthorized"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.json

    name = data.get("name")
    if name:
        user.name = name

    email = data.get("email")
    if email:
        # Check if email is already taken by another user
        existing_user = User.query.filter_by(email=email).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({"error": "Email already exists"}), 409
        user.email = email

    password = data.get("password")
    if password:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user.password = hashed_password.decode('utf-8')

    phone_number = data.get("phoneNumber")
    if phone_number:
        user.phone_number = phone_number

    location = data.get("location")
    if location:
        user.location = location

    db.session.commit()

    return jsonify(user.to_json()), 200

@app.route('/logout', methods=['DELETE'])
@jwt_required(refresh=True)  
def logout():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user.refresh_token = None
    db.session.commit()
    
    return jsonify({"message": "Successfully logged out"}), 200

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)  
def refresh():
    current_user = get_jwt_identity()
    
    user = User.query.get(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    new_access_token = create_access_token(
        identity=str(current_user),
        expires_delta=timedelta(minutes=30)
    )
    
    return jsonify({"access_token": new_access_token}), 200

# --------------------------------------------Note--------------------------------------------
@app.route("/notes", methods=["PATCH"])
@jwt_required()
def update_note():
    data = request.json

    note_id = data.get("note_id")
    if not note_id:
        return jsonify({"error": "Note ID is required."}), 400

    try:
        note_id = int(note_id)
    except ValueError:
        return jsonify({"error": "Invalid Note ID. Note ID must be a number."}), 400

    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found."}), 404

    title = data.get("title")
    if title:
        note.title = title

    content = data.get("content")
    if content:
        note.content = content

    date_updated = data.get("dateUpdated")
    if date_updated:
        note.date_updated = date_updated

    db.session.commit()

    return jsonify(note.to_json()), 200


@app.route("/notes", methods=["GET"])
@jwt_required()
def get_user_notes():
    user_id = get_jwt_identity()  # Fixed: get from JWT instead of query params

    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    notes = user.notes
    return jsonify([note.to_json() for note in notes]), 200

@app.route("/notes/<int:note_id>", methods=["GET"])
@jwt_required()
def get_note(note_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found."}), 404

    return jsonify(note.to_json()), 200

@app.route("/notes", methods=["POST"])
@jwt_required()
def create_note():
    data = request.json

    user_id = get_jwt_identity()  # Fixed: get from JWT instead of request data
    if not user_id:
        return jsonify({"error": "User ID is required to create a note."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
        
    title = data.get("title")
    content = data.get("content")
    date_created = data.get("dateCreated")
    date_updated = data.get("dateUpdated")

    note = Note(
        title=title,
        content=content,
        date_created=date_created,
        date_updated=date_updated,
    )

    user.notes.append(note)  

    db.session.add(note)
    db.session.commit()

    return jsonify(note.to_json()), 201

@app.route("/notes/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found."}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted successfully."}), 200

@app.route("/notes/<int:note_id>", methods=["PUT"])
@jwt_required()
def update_note_by_id(note_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found."}), 404

    data = request.json

    title = data.get("title")
    if title:
        note.title = title

    content = data.get("content")
    if content:
        note.content = content

    date_updated = data.get("dateUpdated")
    if date_updated:
        note.date_updated = date_updated

    db.session.commit()

    return jsonify(note.to_json()), 200
# --------------------------------------------Task--------------------------------------------
@app.route("/tasks", methods=["GET"])
@jwt_required() 
def get_user_tasks():
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    tasks = user.tasks
    return jsonify([task.to_json() for task in tasks]), 200

@app.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    data = request.json

    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "User ID is required to create a task."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    title = data.get("title")
    if not title:
        return jsonify({"error": "Please provide a title for the task."}), 400

    description = data.get("description")
    date_assigned = data.get("dateAssigned")
    date_due = data.get("dateDue")
    status = data.get("status", "Pending")
    category = data.get("category")

    # Parse date strings into datetime objects
    def parse_date(date_str):
        if not date_str:
            return None
        try:
            return parse(date_str)
        except (ValueError, TypeError):
            return None

    parsed_date_assigned = parse_date(date_assigned)
    parsed_date_due = parse_date(date_due)

    # Ensure status is valid and convert to string
    try:
        status_enum = TaskStatus(status)
        status = status_enum.value
    except ValueError:
        return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in TaskStatus]}"}), 400

    # Ensure category is valid and convert to string
    category = None
    if category:
        try:
            category_enum = TaskCategory(category)
            category = category_enum.value
        except ValueError:
            return jsonify({"error": f"Invalid category. Valid categories are: {[c.value for c in TaskCategory]}"}), 400

    task = Task(
        title=title,
        description=description,
        date_assigned=parsed_date_assigned,
        date_due=parsed_date_due,
        status=status,
        category=category,
    )

    task.users.append(user)

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_json()), 201


@app.route("/tasks/status", methods=["GET"])
@jwt_required()
def get_tasks_by_status():
    status = request.args.get("status")

    if not status:
        return jsonify({"error": "Status is required."}), 400

    try:
        status_enum = TaskStatus(status)
    except ValueError:
        return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in TaskStatus]}"}), 400

    tasks = Task.query.filter_by(status=status_enum).all()
    return jsonify([task.to_json() for task in tasks]), 200


@app.route("/tasks/category", methods=["GET"])
@jwt_required()
def get_tasks_by_category():
    category = request.args.get("category")

    if not category:
        return jsonify({"error": "Category is required."}), 400

    try:
        category_enum = TaskCategory(category)
    except ValueError:
        return jsonify({"error": f"Invalid category. Valid categories are: {[c.value for c in TaskCategory]}"}), 400

    tasks = Task.query.filter_by(category=category_enum).all()
    return jsonify([task.to_json() for task in tasks]), 200


@app.route("/tasks/dateAssigned", methods=["GET"])
@jwt_required()
def get_tasks_by_date_assigned():
    date_assigned = request.args.get("dateAssigned")

    if not date_assigned:
        return jsonify({"error": "Date assigned is required."}), 400

    tasks = Task.query.filter_by(date_assigned=date_assigned).all()
    return jsonify([task.to_json() for task in tasks]), 200


@app.route("/tasks/dateDue", methods=["GET"])
@jwt_required()
def get_tasks_by_date_due():
    date_due = request.args.get("dateDue")

    if not date_due:
        return jsonify({"error": "Date due is required."}), 400

    tasks = Task.query.filter_by(date_due=date_due).all()
    return jsonify([task.to_json() for task in tasks]), 200


@app.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404

    data = request.json

    title = data.get("title")
    if title:
        task.title = title

    description = data.get("description")
    if description:
        task.description = description

    date_assigned = data.get("dateAssigned")
    if date_assigned:
        task.date_assigned = date_assigned

    date_due = data.get("dateDue")
    if date_due:
        task.date_due = date_due

    if 'status' in data:
            try:
                status = data['status']
                # If using TaskStatus enum
                if not isinstance(status, str) or status not in [s.value for s in TaskStatus]:
                    return jsonify({"error": "Invalid status value"}), 400
                task.status = status
            except ValueError:
                return jsonify({"error": "Invalid status value"}), 400
        
    category = data.get("category")
    if category:
        try:
            category_enum = TaskCategory(category)
        except ValueError:
            return jsonify({"error": f"Invalid category. Valid categories are: {[c.value for c in TaskCategory]}"}), 400
        task.category = category_enum

    db.session.commit()

    return jsonify(task.to_json()), 200


@app.route("/tasks/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404

    return jsonify(task.to_json()), 200


@app.route("/tasks/<int:task_id>/users", methods=["POST"])  
@jwt_required()
def assign_user_to_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404

    data = request.json
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    if user not in task.users:
        task.users.append(user)
        db.session.commit()

    return jsonify(task.to_json()), 200


@app.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully."}), 200


# --------------------------------------------Goal--------------------------------------------
@app.route("/goals", methods=["POST"])
@jwt_required()
def create_goal():
    data = request.json

    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({"error": "User ID is required to create a goal."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    title = data.get("title")
    if not title:
        return jsonify({"error": "Please provide a title for the goal."}), 400  # Fixed error message

    description = data.get("description")
    status = data.get("status", "PLANNED")
    period = data.get("period", "MONTHLY")

    try:
        status_enum = GoalStatus(status)
    except ValueError:
        return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in GoalStatus]}"}), 400

    if period:
        try:
            period_enum = GoalPeriod(period)
        except ValueError:
            return jsonify({"error": f"Invalid period. Valid periods are: {[c.value for c in GoalPeriod]}"}), 400

    goal = Goal(
        title=title,
        description=description,
        status=status_enum,
        period=period_enum
    )

    goal.users.append(user)

    db.session.add(goal)
    db.session.commit()

    return jsonify(goal.to_json()), 201


@app.route("/goals/status", methods=["GET"])
@jwt_required()
def get_goals_by_status():
    status = request.args.get("status")

    if not status:
        return jsonify({"error": "Status is required."}), 400

    try:
        status_enum = GoalStatus(status)
    except ValueError:
        return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in GoalStatus]}"}), 400

    goals = Goal.query.filter_by(status=status_enum).all()
    return jsonify([goal.to_json() for goal in goals]), 200


@app.route("/goals/period", methods=["GET"])
@jwt_required()
def get_goals_by_period():
    period = request.args.get("period")

    if not period:
        return jsonify({"error": "Period is required."}), 400

    try:
        period_enum = GoalPeriod(period)
    except ValueError:
        return jsonify({"error": f"Invalid period. Valid periods are: {[s.value for s in GoalPeriod]}"}), 400

    goals = Goal.query.filter_by(period=period_enum).all()  # Fixed: should filter by period, not status
    return jsonify([goal.to_json() for goal in goals]), 200


@app.route("/goals", methods=["GET"])
@jwt_required()
def get_user_goals():
    user_id = get_jwt_identity()  # Fixed: get from JWT instead of query params

    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    goals = user.goals
    return jsonify([goal.to_json() for goal in goals]), 200


@app.route("/goals/<int:goal_id>", methods=["PUT"])
@jwt_required()
def update_goal(goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return jsonify({"error": "Goal not found."}), 404
    data = request.json

    title = data.get("title")
    if title:
        goal.title = title

    description = data.get("description")
    if description:
        goal.description = description

    status = data.get("status")
    if status:
        try:
            status_enum = GoalStatus(status)
        except ValueError:
            return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in GoalStatus]}"}), 400
        goal.status = status_enum

    period = data.get("period")
    if period:
        try:
            period_enum = GoalPeriod(period)
        except ValueError:
            return jsonify({"error": f"Invalid period. Valid periods are: {[c.value for c in GoalPeriod]}"}), 400

        goal.period = period_enum

    db.session.commit()

    return jsonify(goal.to_json()), 200


@app.route("/goals/<int:goal_id>", methods=["GET"])
@jwt_required()
def get_goal(goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return jsonify({"error": "Goal not found."}), 404
    return jsonify(goal.to_json()), 200


@app.route("/goals/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def delete_goal(goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return jsonify({"error": "Goal not found."}), 404
    db.session.delete(goal)
    db.session.commit()
    return jsonify({"message": "Goal deleted successfully."}), 200


# --------------------------------------------Habit--------------------------------------------
@app.route("/habits", methods=["POST"])
@jwt_required()
def create_habit():
    data = request.json

    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "User ID is required to create a habit."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    title = data.get("title")
    if not title:
        return jsonify({"error": "Please provide a title for the habit."}), 400

    color = data.get("color")
    if not color:
        return jsonify({"error": "Please provide a color for the habit."}), 400

    status = data.get("status", "PLANNED")
    habit_days = data.get("habitDays", "MO")

    try:
        status_enum = HabitStatus(status)
    except ValueError:
        return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in HabitStatus]}"}), 400

    if habit_days:
        try:
            habit_days_enum = HabitDays(habit_days)
        except ValueError:
            return jsonify({"error": f"Invalid habit days. Valid habit days are: {[c.value for c in HabitDays]}"}), 400

    habit = Habit(
        title=title,
        status=status_enum,
        color=color,
        habit_days=habit_days_enum
    )

    habit.users.append(user)
    user.habits.append(habit) 
    db.session.add(habit)
    db.session.commit()

    return jsonify(habit.to_json()), 201


@app.route("/habits/status", methods=["GET"])
@jwt_required()
def get_habits_by_status():
    status = request.args.get("status")

    # for debugging purposes
    if not status:
        return jsonify({"error": "Status is required."}), 400

    try:
        status_enum = HabitStatus(status)
    except ValueError:
        return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in HabitStatus]}"}), 400

    habits = Habit.query.filter_by(status=status_enum).all()
    return jsonify([habit.to_json() for habit in habits]), 200


@app.route("/habits/days", methods=["GET"])
@jwt_required()
def get_habits_by_days():
    habit_days = request.args.get("habitDays")

    # for debugging purposes
    if not habit_days:
        return jsonify({"error": "Period is required."}), 400

    try:
        habit_days_enum = HabitDays(habit_days)
    except ValueError:
        return jsonify({"error": f"Invalid period. Valid periods are: {[s.value for s in HabitDays]}"}), 400

    habits = Habit.query.filter_by(status=habit_days_enum).all()
    return jsonify([habit.to_json() for habit in habits]), 200


@app.route("/habits", methods=["GET"])
@jwt_required()
def get_user_habits():
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    habits = user.habits
    return jsonify([h.to_json() for h in habits]), 200


@app.route("/habits/<int:habit_id>", methods=["GET"])
@jwt_required()
def get_habit(habits_id):
    habit = Habit.query.get(habits_id)
    if not habit:
        return jsonify({"error": "Habit not found."}), 404
    return jsonify(habit.to_json()), 200


@app.route("/habits/<int:habit_id>", methods=["DELETE"])
@jwt_required()
def delete_habit(habits_id):
    habit = Habit.query.get(habits_id)
    if not habit:
        return jsonify({"error": "Habit not found."}), 404
    db.session.delete(habit)
    db.session.commit()
    return jsonify({"message": "Habit deleted successfully."}), 200


@app.route("/habits/<int:habit_id>", methods=["PUT"])
@jwt_required()
def update_habit(habit_id):
    habit = Habit.query.get(habit_id)
    if not habit:
        return jsonify({"error": "Habit not found."}), 404
    data = request.json

    title = data.get("title")
    if title:
        habit.title = title

    color = data.get("color")
    if not color:
        return jsonify({"error": "Please provide a color for the habit."}), 400

    status = data.get("status")
    try:
        status_enum = HabitStatus(status)
    except ValueError:
        return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in HabitStatus]}"}), 400
    habit.status = status_enum

    habit_days = data.get("habitDays")
    if habit_days:
        try:
            habit_days_enum = HabitDays(habit_days)
        except ValueError:
            return jsonify({"error": f"Invalid habit days. Valid habit days are: {[c.value for c in HabitDays]}"}), 400
        habit.period = habit_days_enum

    db.session.commit()

    return jsonify(habit.to_json()), 200


# --------------------------------------------main--------------------------------------------

@app.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()

if __name__ == "__main__":
    with app.app_context():
        try:
            #sync_db()
            db.create_all()
        except Exception as e:
            print(f"Initialization error: {e}")
           # sync_db()
            db.create_all()
    app.run(debug=True)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()