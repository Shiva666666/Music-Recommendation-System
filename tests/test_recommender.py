# File: Desktop/Music-Recommendation-System/tests/test_recommender.py
import sys
import os
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from recommender import get_recommendations

def test_recommendation_output_not_empty():
    mood = "energetic"
    model = "random-forest"
    results = get_recommendations(mood, model)
    assert isinstance(results, list)
    assert len(results) > 0

def test_recommendation_structure():
    mood = "happy"
    model = "random-forest"
    results = get_recommendations(mood, model)
    assert len(results) <= 5  # Maximum 5 recommendations
    for item in results:
        assert isinstance(item, dict)
        assert "track_name" in item
        assert "artists" in item

def test_different_model_types():
    mood = "calm"
    models = ["random-forest", "knn", "svm", "deep-learning"]
    for model in models:
        results = get_recommendations(mood, model)
        assert isinstance(results, list)
        assert len(results) <= 5

def test_invalid_model_type():
    mood = "sad"
    with pytest.raises(ValueError) as exc_info:
        get_recommendations(mood, "invalid-model")
    assert "Unsupported model_type" in str(exc_info.value)

def test_empty_mood_results():
    # Test with a mood that doesn't exist in the dataset
    results = get_recommendations("non-existent-mood", "random-forest")
    assert isinstance(results, list)
    assert len(results) == 0

def test_consistent_output_fields():
    mood = "energetic"
    model = "deep-learning"
    results = get_recommendations(mood, model)
    required_fields = {"track_name", "artists"}
    for item in results:
        assert set(item.keys()) == required_fields
        assert all(isinstance(item[field], str) for field in required_fields)

def test_different_moods():
    moods = ["energetic", "calm", "happy", "sad"]
    model = "random-forest"
    for mood in moods:
        results = get_recommendations(mood, model)
        assert isinstance(results, list)
        if results:  # If mood exists in dataset
            assert len(results) <= 5

def test_recommendation_count():
    mood = "energetic"
    models = ["random-forest", "knn", "svm", "deep-learning"]
    for model in models:
        results = get_recommendations(mood, model)
        assert len(results) <= 5  # Should never exceed 5 recommendations
