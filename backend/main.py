from flask import Flask, request, jsonify
from config import app, db
from models import User, Task, TaskCategory, TaskStatus

#TODO: додати функціонал для логіну / реєстрації / виходу з акаунта / зміни паролю

#персоналізована сторінка?
@app.route("/", methods=["GET"])
def enter_homepage():
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify("Welcome to the homepage! To personalize your experience, provide your User ID."), 200
    
    try:
        user_id = int(user_id)  
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"message": f"Welcome, {user.name}!", "user_id": user.id}), 200


@app.route("/users", methods=["POST"])
def create_user():
    name = request.json.get("name")
    email = request.json.get("email")
    password = request.json.get("password")
    phone_number = request.json.get("phoneNumber")
    location = request.json.get("location")

    # Check if the user with this email already exists
    if User.query.filter_by(email=email).first():  # Fixed the incorrect reference to 'data.get("email")'
        return jsonify({"error": "User with this email already exists."}), 400

    # Validate required fields
    if not name or not email or not password:
        phone_number = None
        location = None

    # Create the user
    user = User(name=name, email=email, password=password, phone_number=phone_number, location=location)
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_json()), 201
@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.to_json() for user in users]), 200

@app.route("/users/<int:task_id>", methods=["PUT"])
def update_user(task_id):
    user = User.query.get(task_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.json

    name = data.get("name")
    if name:
        user.name = name

    email = data.get("email")
    if email:
        user.email = email

    password = data.get("password")
    if password:
        user.password = password

    phone_number = data.get("phoneNumber")
    if phone_number:
        user.phone_number = phone_number

    location = data.get("location")
    if location:
        user.location = location

    db.session.commit()

    return jsonify(user.to_json()), 200

@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    for task in user.tasks:
        task.users.remove(user) #треба з assigned tasks видалити юзера, а таски лишаються неперепривʼязаними?
     
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully."}), 200

@app.route("/tasks", methods=["GET"])
def get_user_tasks():
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
    
    tasks = user.tasks
    return jsonify([task.to_json() for task in tasks]), 200


@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.json  

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required to create a task."}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID. User ID must be a number."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    title = data.get("title")
    if not title:
        return jsonify({"error": "Please provide a title for the task."}), 400


    description = data.get("description")
    date_assigned = data.get("dateAssigned")  
    date_due = data.get("dateDue")         
    status = data.get("status", "PENDING")   
    category = data.get("category")         


    try:
        status_enum = TaskStatus(status)
    except ValueError:
        return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in TaskStatus]}"}), 400

    category_enum = None
    if category:
        try:
            category_enum = TaskCategory(category)
        except ValueError:
            return jsonify({"error": f"Invalid category. Valid categories are: {[c.value for c in TaskCategory]}"}), 400
        
    task = Task(
        title=title,
        description=description,
        date_assigned=date_assigned,
        date_due=date_due,
        status=status_enum,
        category=category_enum,
    )


    task.users.append(user)

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_json()), 201

@app.route("/tasks/status", methods=["GET"])
def get_tasks_by_status():
    status = request.args.get("status")

    #for debugging purposes
    if not status:
        return jsonify({"error": "Status is required."}), 400

    try:
        status_enum = TaskStatus(status)
    except ValueError:
        return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in TaskStatus]}"}), 400

    tasks = Task.query.filter_by(status=status_enum).all()
    return jsonify([task.to_json() for task in tasks]), 200

@app.route("/tasks/category", methods=["GET"])
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
def get_tasks_by_date_assigned():
    date_assigned = request.args.get("dateAssigned")

    if not date_assigned:
        return jsonify({"error": "Date assigned is required."}), 400

    tasks = Task.query.filter_by(date_assigned=date_assigned).all()
    return jsonify([task.to_json() for task in tasks]), 200

@app.route("/tasks/dateDue", methods=["GET"])
def get_tasks_by_date_due():
    date_due = request.args.get("dateDue")

    if not date_due:
        return jsonify({"error": "Date due is required."}), 400

    tasks = Task.query.filter_by(date_due=date_due).all()
    return jsonify([task.to_json() for task in tasks]), 200


@app.route("/tasks/<int:task_id>", methods=["PUT"])
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

    status = data.get("status")
    if status:
        try:
            status_enum = TaskStatus(status)
        except ValueError:
            return jsonify({"error": f"Invalid status. Valid statuses are: {[s.value for s in TaskStatus]}"}), 400
        task.status = status_enum

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
def get_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404

    return jsonify(task.to_json()), 200

@app.route("/tasks/<int:task_id>/users", methods=["GET"])
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

    task.users.append(user)
    db.session.commit()

    return jsonify(task.to_json()), 200

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404
    
    for user in task.users:
        user.tasks.remove(task) #про всяк випадок? 

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully."}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
