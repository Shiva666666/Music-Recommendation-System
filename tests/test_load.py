import requests
import time

def test_load():
    url = "http://127.0.0.1:5000/recommend"
    payload = {"mood": "relaxed", "model": "svm"}
    success_count = 0
    failure_count = 0

    for i in range(100):
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                success_count += 1
                print(f" Request {i+1} - Status: {response.status_code}")
            else:
                failure_count += 1
                print(f" Request {i+1} - Status: {response.status_code}")
        except Exception as e:
            failure_count += 1
            print(f" Request {i+1} - Error: {str(e)}")
        
        time.sleep(0.1) 

    
    print(f" Successful requests: {success_count}")
    print(f" Failed requests: {failure_count}")
    if failure_count == 0:
        print(" Load Test Passed")
    else:
        print(" Load Test Failed: Some requests failed.")

if __name__ == "__main__":
    test_load()
