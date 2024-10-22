from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import ElementNotVisibleException, ElementNotSelectableException, NoSuchElementException
import time

from appium.webdriver.appium_service import AppiumService

appium_service = AppiumService()

desired_caps = {}
desired_caps['platformName'] = 'Android'
desired_caps['automationName'] = 'UiAutomator2'
desired_caps['platformVersion'] = '14'
desired_caps['deviceName'] = 'Pixel 8 Pro API 34'
desired_caps['app'] = \
    'C:/WorkingProjects/RecordingApp/recording-app/RecordingApp/android/app/build/outputs/apk/release/app-release.apk'
desired_caps['appPackage'] = 'com.recordingapp'
desired_caps['appActivity'] = 'com.recordingapp.MainActivity'

options = UiAutomator2Options().load_capabilities(desired_caps)
driver = webdriver.Remote('http://127.0.0.1:4723/wd/hub', options=options, direct_connection=True)

wait = WebDriverWait(driver, 25, poll_frequency=1, ignored_exceptions=[ElementNotVisibleException,
                                                                       ElementNotSelectableException,
                                                                       NoSuchElementException])
ele_id = wait.until(lambda x: x.find_element(AppiumBy.XPATH,
"/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/"
"android.widget.FrameLayout/android.widget.FrameLayout/android.widget.EditText[1]"
))
ele_id.click()

time.sleep(5)
driver.quit()
appium_service.stop()

