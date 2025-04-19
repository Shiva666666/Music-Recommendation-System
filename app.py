from flask import Flask, request, jsonify, render_template
from recommender import get_recommendations
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import json
from models import db, User, RecommendationLog
from auth_routes import auth # Explicit route functions
import ast

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recommendations.db'
app.config['SECRET_KEY'] = 'stoptweaking'  # Replace with your own secret key
app.register_blueprint(auth)
# Initialize database
db.init_app(app)

# Initialize LoginManager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'  # Must match the login function name exactly

# User loader
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# 🔐 Home - protected
@app.route("/")
@login_required
def home():
    return render_template("index.html")

# 🎧 Recommend API
@app.route("/recommend", methods=["POST"])
@login_required
def recommend():
    try:
        data = request.json
        mood = data.get("mood")
        model_type = data.get("model")

        recommendations = get_recommendations(mood, model_type)

        # Log new recommendation
        log = RecommendationLog(
            user_id=current_user.id,
            mood=mood,
            model_type=model_type,
            results=str(recommendations),
            timestamp=datetime.utcnow()
        )
        db.session.add(log)
        db.session.commit()

        # ✅ Keep only latest 5 logs for the user
        user_logs = RecommendationLog.query.filter_by(user_id=current_user.id)\
                                           .order_by(RecommendationLog.timestamp.desc())\
                                           .all()
        if len(user_logs) > 5:
            for old_log in user_logs[5:]:
                db.session.delete(old_log)
            db.session.commit()

        return jsonify(recommendations)

    except Exception as e:
        print("❌ Backend error:", e)
        return jsonify({"error": str(e)}), 500
    
    
@app.route("/dashboard")
@login_required
def dashboard():
    from collections import Counter

    user_id = current_user.id

    # Safely try fetching logs
    

    logs = RecommendationLog.query.filter_by(user_id=user_id).order_by(RecommendationLog.timestamp.desc()).all()

    # Defensive fallback if logs are None
    if logs is None:
        logs = []

    # Calculate stats
    total_recommendations = len(logs)

    moods = [log.mood for log in logs]
    models = [log.model_type for log in logs]

    mood_counts = dict(Counter(moods))
    model_counts = dict(Counter(models))

    favorite_model = max(model_counts, key=model_counts.get) if model_counts else "N/A"
    most_common_mood = max(mood_counts, key=mood_counts.get) if mood_counts else "N/A"

    # Optional: convert stringified JSON if needed
    for log in logs:
        if isinstance(log.results, str):
            import json
            try:
                log.results = ast.literal_eval(log.results)[:3]
            except Exception as e:
                log.results = []

    return render_template(
        "dashboard.html",
        total_recommendations=total_recommendations,
        favorite_model=favorite_model,
        most_common_mood=most_common_mood,
        mood_counts=mood_counts,
        logs=logs   # make sure this is passed
    )

# 🟢 Run app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
