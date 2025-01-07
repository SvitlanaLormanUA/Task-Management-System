from flask import Flask, request, jsonify
from config import app, db
from models import User, Task, TaskCategory, TaskStatus


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
    data = request.json
    
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Please provide name, email, and password."}), 400

    if User.query.filter_by(email=data.get("email")).first():
        return jsonify({"error": "User with this email already exists."}), 400

    user = User(**data)
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_json()), 201

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

    if not data.get("title"):
        return jsonify({"error": "Please provide a title for the task."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    task = Task(
        title=data["title"],
        description=data.get("description"),
        date_assigned=data.get("date_assigned"),
        date_due=data.get("date_due"),
        status=TaskStatus(data.get("status", "PENDING")),  # Default status
        category=TaskCategory(data.get("category")) if data.get("category") else None
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


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
