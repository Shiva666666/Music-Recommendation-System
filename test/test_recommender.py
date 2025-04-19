import unittest
from recommender import get_recommendations

class TestRecommender(unittest.TestCase):
    def test_return_type(self):
        result = get_recommendations("happy", "rf")
        self.assertIsInstance(result, list)

if __name__ == "__main__":
    unittest.main()
