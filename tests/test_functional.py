import requests

def test_prediction_api():
    url = "http://127.0.0.1:5000/recommend"
    payload = {
        "mood": "happy",
        "model": "random-forest"
    }

    try:
        # Send POST request
        response = requests.post(url, json=payload)
        print("Status Code:", response.status_code)

        # Check HTTP status
        if response.status_code != 200:
            print("❌ API did not return 200 OK.")
            return

        # Get response as text
        response_text = response.text
        print("\nRaw Response Text:\n", response_text)

        # Basic validation by checking expected keywords in the text
        if "track_name" in response_text or "recommendations" in response_text:
            print(" Response contains expected keywords.")
        else:
            print(" Response received, but expected keywords not found.")

        print("\n Functional test completed .")

    except Exception as e:
        print(" Test encountered an error:", str(e))

if __name__ == "__main__":
    test_prediction_api()
