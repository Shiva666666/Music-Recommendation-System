import requests

def test_prediction_api():
    url = "http://127.0.0.1:5000/recommend"
    payload = {
        "mood": "happy",
        "model": "random-forest"
    }

    try:
        response = requests.post(url, json=payload)
        print("Status Code:", response.status_code)

        if response.status_code != 200:
            print("❌ API did not return 200 OK.")
            return

        data = response.json()
        print("Raw response:", response.text)


        # Handle both dict or list response formats
        if isinstance(data, dict):
            if "recommendations" in data and isinstance(data["recommendations"], list):
                print("✅ Valid recommendations found.")
            else:
                print("⚠️ Response received, but recommendations key missing or not a list.")
        elif isinstance(data, list) and "track_name" in data[0]:
            print("✅ Track name found in list item.")
        else:
            print("⚠️ Unexpected response format.")

        print("✅ Functional test completed without errors.")

    except Exception as e:
        print("❌ Test encountered an error:", str(e))


if __name__ == "__main__":
    test_prediction_api()
