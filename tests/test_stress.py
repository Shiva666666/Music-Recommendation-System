import requests
import threading

success_count = 0
failure_count = 0
lock = threading.Lock()

def send_request(index):
    global success_count, failure_count
    url = "http://127.0.0.1:5000/recommend"
    payload = {"mood": "happy", "model": "random-forest"}
    try:
        response = requests.post(url, json=payload)
        with lock:
            if response.status_code == 200:
                success_count += 1
                print(f" Request {index} - Status: {response.status_code}")
            else:
                failure_count += 1
                print(f" Request {index} - Status: {response.status_code}")
    except Exception as e:
        with lock:
            failure_count += 1
            print(f" Request {index} - Error: {e}")

def test_stress():
    threads = []
    for i in range(50):  # simulate 50 concurrent users
        t = threading.Thread(target=send_request, args=(i+1,))
        t.start()
        threads.append(t)
    for t in threads:
        t.join()

    
    print(f" Successful requests: {success_count}")
    print(f" Failed requests: {failure_count}")
    if failure_count == 0:
        print(" Stress Testing Passed")
    else:
        print(" Stress Test Failed: Some  failed.")

if __name__ == "__main__":
    test_stress()
