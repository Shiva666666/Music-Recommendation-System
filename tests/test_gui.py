from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

def test_gui():
    driver = None
    try:
        # Setup Chrome
        options = Options()
        options.add_argument("--start-maximized")
        driver = webdriver.Chrome(service=Service(), options=options)
        driver.get("http://127.0.0.1:5000/")

        time.sleep(1)

        # Login
        driver.find_element(By.NAME, "username").send_keys("lol")
        driver.find_element(By.NAME, "password").send_keys("lol")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()

        time.sleep(2)  # Wait for dashboard to load

        # Use the only <select> tag to pick a mood
        mood_dropdown = driver.find_element(By.TAG_NAME, "select")
        Select(mood_dropdown).select_by_visible_text("Happy")

        time.sleep(1)

        # Click the Random Forest model card
        model_card = driver.find_element(By.XPATH, "//div[contains(@class,'model-card') and contains(.,'Random Forest')]")
        model_card.click()

        time.sleep(2)

        # Verify result
        if "Recommendation" in driver.page_source or "track_name" in driver.page_source:
            print(" GUI Test Passed: Recommendation shown")
        else:
            print(" GUI Test Failed: No recommendation found")

    except Exception as e:
        print(f" GUI Test Failed with Exception: {e}")

    finally:
        driver.quit()

if __name__ == "__main__":
    test_gui()
