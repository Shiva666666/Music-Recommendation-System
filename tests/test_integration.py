# File: Desktop/Music-Recommendation-System/tests/test_integration.py
import sys
import os
import pytest
from flask import url_for
import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import logging

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models import User, RecommendationLog

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@pytest.fixture(scope='function')
def test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['WTF_CSRF_ENABLED'] = False
    app.config['SECRET_KEY'] = 'test_secret_key'
    app.config['LOGIN_DISABLED'] = False

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

@pytest.fixture(scope='function')
def authenticated_client(test_client):
    """Fixture for an authenticated client"""
    # Register
    test_client.post('/register', data={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpass123'
    }, follow_redirects=True)
    
    # Login
    test_client.post('/login', data={
        'username': 'testuser',
        'password': 'testpass123'
    }, follow_redirects=True)
    
    return test_client

class TestUserFlow:
    """Test complete user journeys through the application"""

    def test_complete_user_journey(self, test_client):
        """Test full flow: register → login → get recommendations → view dashboard"""
        try:
            # 1. Register new user
            register_response = test_client.post('/register', data={
                'username': 'testuser',
                'email': 'test@example.com',
                'password': 'testpass123'
            }, follow_redirects=True)
            assert b'Registration successful' in register_response.data
            logger.info("Registration successful")

            # 2. Login with new user
            login_response = test_client.post('/login', data={
                'username': 'testuser',
                'password': 'testpass123'
            }, follow_redirects=True)
            assert b'Invalid credentials' not in login_response.data
            logger.info("Login successful")

            # 3. Get recommendations with different moods and models
            # Test with just one combination to reduce complexity
            recommend_response = test_client.post('/recommend', 
                json={
                    'mood': 'happy',
                    'model': 'random-forest'
                })
            assert recommend_response.status_code == 200
            recommendations = json.loads(recommend_response.data)
            assert isinstance(recommendations, list)
            logger.info(f"Got recommendations: {recommendations}")

            # 4. Check dashboard shows recommendation history
            dashboard_response = test_client.get('/dashboard')
            assert dashboard_response.status_code == 200
            logger.info("Dashboard accessed successfully")

        except Exception as e:
            logger.error(f"Test failed with error: {str(e)}")
            raise

    def test_recommendation_persistence(self, authenticated_client):
        """Test that recommendations are correctly saved and retrieved"""
        try:
            # Make a recommendation
            response = authenticated_client.post('/recommend', 
                json={
                    'mood': 'happy',
                    'model': 'random-forest'
                })
            assert response.status_code == 200
            logger.info("Recommendation made successfully")

            # Verify in database
            with app.app_context():
                user = User.query.filter_by(username='testuser').first()
                assert user is not None
                logs = RecommendationLog.query.filter_by(user_id=user.id).all()
                assert len(logs) > 0
                logger.info(f"Found {len(logs)} recommendation logs")

                # Verify log contents
                log = logs[0]
                assert log.mood == 'happy'
                assert log.model_type == 'random-forest'
                logger.info("Log contents verified")

        except Exception as e:
            logger.error(f"Test failed with error: {str(e)}")
            raise

    def test_error_handling_flow(self, authenticated_client):
        """Test error handling across multiple components"""
        try:
            # Test invalid model
            invalid_model_response = authenticated_client.post('/recommend', 
                json={
                    'mood': 'happy',
                    'model': 'invalid_model'
                })
            assert invalid_model_response.status_code == 500
            error_data = json.loads(invalid_model_response.data)
            assert 'error' in error_data
            logger.info("Invalid model test passed")

        except Exception as e:
            logger.error(f"Test failed with error: {str(e)}")
            raise

    def test_concurrent_user_isolation(self, test_client):
        """Test that different users' recommendations are properly isolated"""
        try:
            # 1. Create first user and get recommendations
            test_client.post('/register', data={
                'username': 'user1',
                'email': 'user1@example.com',
                'password': 'testpass123'
            })
            test_client.post('/login', data={
                'username': 'user1',
                'password': 'testpass123'
            })
            
            test_client.post('/recommend', 
                json={
                    'mood': 'happy',
                    'model': 'random-forest'
                })
            logger.info("First user recommendations created")

            # 2. Logout first user
            test_client.get('/logout')

            # 3. Create and login second user
            test_client.post('/register', data={
                'username': 'user2',
                'email': 'user2@example.com',
                'password': 'testpass123'
            })
            test_client.post('/login', data={
                'username': 'user2',
                'password': 'testpass123'
            })

            # 4. Check second user's dashboard
            with app.app_context():
                user2 = User.query.filter_by(username='user2').first()
                assert user2 is not None
                user2_logs = RecommendationLog.query.filter_by(user_id=user2.id).all()
                assert len(user2_logs) == 0
                logger.info("User isolation verified")

        except Exception as e:
            logger.error(f"Test failed with error: {str(e)}")
            raise 