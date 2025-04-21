# File: Desktop/Music-Recommendation-System/tests/test_routes.py
import sys
import os
import pytest
from flask import url_for
import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models import User, RecommendationLog

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['WTF_CSRF_ENABLED'] = False  # Disable CSRF for testing
    app.config['SECRET_KEY'] = 'test_secret_key'  # Add secret key for sessions

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

@pytest.fixture
def auth_client(client):
    """Client with a logged-in user"""
    password = 'testpass'
    password_hash = generate_password_hash(password)
    
    with app.app_context():
        user = User(
            username='testuser',
            email='test@example.com',
            password_hash=password_hash
        )
        db.session.add(user)
        db.session.commit()
        
        # Login
        client.post('/login', data={
            'username': 'testuser',
            'password': password  # Use unhashed password for login
        }, follow_redirects=True)
    return client

def test_home_redirect_if_not_logged_in(client):
    """Test that home page redirects to login if user is not authenticated"""
    response = client.get('/', follow_redirects=True)
    assert b'Login' in response.data

def test_register(client):
    """Test user registration"""
    response = client.post('/register', data={
        'username': 'newuser',
        'email': 'new@example.com',
        'password': 'password123'
    }, follow_redirects=True)
    assert b'Registration successful' in response.data
    
    with app.app_context():
        user = User.query.filter_by(username='newuser').first()
        assert user is not None
        assert user.email == 'new@example.com'
        assert check_password_hash(user.password_hash, 'password123')

def test_login_success(client):
    """Test successful login"""
    password = 'testpass'
    password_hash = generate_password_hash(password)
    
    # Create a test user
    with app.app_context():
        user = User(
            username='testuser',
            email='test@example.com',
            password_hash=password_hash
        )
        db.session.add(user)
        db.session.commit()

    response = client.post('/login', data={
        'username': 'testuser',
        'password': password  # Use unhashed password for login
    }, follow_redirects=True)
    assert b'Invalid credentials' not in response.data

def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    response = client.post('/login', data={
        'username': 'wronguser',
        'password': 'wrongpass'
    }, follow_redirects=True)
    assert b'Invalid credentials' in response.data

def test_logout(auth_client):
    """Test logout functionality"""
    response = auth_client.get('/logout', follow_redirects=True)
    assert b'Login' in response.data

def test_recommend_endpoint(auth_client):
    """Test the recommendation endpoint"""
    response = auth_client.post('/recommend', 
        json={
            'mood': 'happy',
            'model': 'random-forest'
        })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) <= 5

def test_recommend_unauthorized(client):
    """Test recommendation endpoint without authentication"""
    response = client.post('/recommend', 
        json={
            'mood': 'happy',
            'model': 'random-forest'
        })
    # Flask-Login redirects to login page instead of 401
    assert response.status_code == 302
    assert '/login' in response.location

def test_dashboard_with_recommendations(auth_client):
    """Test dashboard with existing recommendations"""
    with app.app_context():
        # Get the user ID
        user = User.query.filter_by(username='testuser').first()
        assert user is not None
        
        log = RecommendationLog(
            user_id=user.id,
            mood='happy',
            model_type='random-forest',
            results=str([{'track_name': 'Test Song', 'artists': 'Test Artist'}]),
            timestamp=datetime.utcnow()
        )
        db.session.add(log)
        db.session.commit()

    response = auth_client.get('/dashboard')
    assert response.status_code == 200
    assert b'Test Song' in response.data

def test_dashboard_no_recommendations(auth_client):
    """Test dashboard with no recommendations"""
    response = auth_client.get('/dashboard')
    assert response.status_code == 200
    assert b'N/A' in response.data

def test_duplicate_registration(client):
    """Test registration with existing username"""
    # First registration
    client.post('/register', data={
        'username': 'existinguser',
        'email': 'existing@example.com',
        'password': 'password123'
    })
    
    # Attempt duplicate registration
    response = client.post('/register', data={
        'username': 'existinguser',
        'email': 'another@example.com',
        'password': 'password123'
    }, follow_redirects=True)
    assert b'Username already exists' in response.data 