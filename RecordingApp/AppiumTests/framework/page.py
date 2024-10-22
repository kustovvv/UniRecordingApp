from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import ElementNotVisibleException, ElementNotSelectableException, NoSuchElementException
from appium.webdriver.common.appiumby import AppiumBy
from appium.webdriver.common.touch_action import TouchAction

from ..utils import custom_logger as cl


class Page:
    log = cl.custom_logger()

    def __init__(self, driver):
        self.driver = driver

    def get_element(self, locator_value, timeout=2, locator_type="xpath"):
        locator_type = locator_type.lower()
        element = self.wait_for_element(locator_value, locator_type, timeout)
        return element

    def get_elements(self, locator_value, timeout=2, locator_type="xpath"):
        locator_type = locator_type.lower()
        elements = self.wait_for_elements(locator_value, locator_type, timeout)
        return elements

    def wait_for_elements(self, locator_value, locator_type, timeout):
        locator_type = locator_type.lower()
        elements = None
        wait = WebDriverWait(self.driver, timeout, poll_frequency=1,
                             ignored_exceptions=[ElementNotVisibleException, ElementNotSelectableException,
                                                 NoSuchElementException])

        if locator_type == "xpath":
            elements = wait.until(lambda x: x.find_elements(AppiumBy.XPATH, f"{locator_value}"))
            self.log.info(
                "One or several elements with locator_type: " + locator_type + " with the locator_value: " + locator_value + " found")
            return elements
        else:
            self.log.info("Locator value " + locator_value + " not found")

        return elements

    def wait_for_element(self, locator_value, locator_type, timeout):
        locator_type = locator_type.lower()
        element = None
        wait = WebDriverWait(self.driver, timeout, poll_frequency=1,
                             ignored_exceptions=[ElementNotVisibleException, ElementNotSelectableException,
                                                 NoSuchElementException])

        if locator_type == "xpath":
            element = wait.until(lambda x: x.find_element(AppiumBy.XPATH, f"{locator_value}"))
            self.log.info(
                "Element with locator_type: " + locator_type + " with the locator_value: " + locator_value + " found")
            return element
        else:
            self.log.info("Locator value " + locator_value + " not found")

        return element

    def click_element(self, locator_value, timeout=5, locator_type="xpath"):
        try:
            element = self.get_element(locator_value, timeout=timeout, locator_type=locator_type)
            element.click()
            self.log.info(
                "Clicked on element with locator_type: " + locator_type + " with the locator_value: " + locator_value)
            return True
        except:
            self.log.info(
                "Unable to click on element with locator_type: " + locator_type + " with the locator_value: " + locator_value)
            return False

    def send_text(self, text, locator_value, locator_type="xpath"):
        try:
            element = self.get_element(locator_value, locator_type=locator_type)
            element.send_keys(text)
            self.log.info(
                "Send text on element with locator_type: " + locator_type + " with the locator_value: " + locator_value)
            return True
        except:
            self.log.info(
                "Unable to send text to element with locator_type: " + locator_type + " with the locator_value: " + locator_value)
            return False

    def is_displayed(self, locator_value, timeout=2, locator_type="xpath"):
        try:
            element = self.get_element(locator_value, timeout=timeout, locator_type=locator_type)
            element.is_displayed()
            self.log.info(
                "Element with locator_type: " + locator_type + " with the locator_value: " + locator_value + " is displayed")
            return True
        except:
            self.log.info(
                "Element with locator_type: " + locator_type + " with the locator_value: " + locator_value + " is not displayed")
            return False

    def get_element_text(self, locator_value, timeout, locator_type="xpath"):
        try:
            element = self.get_element(locator_value, timeout=timeout, locator_type=locator_type)
            text = element.get_attribute("text")
            self.log.info(
                 f"Element with locator_type:  + {locator_type} +  with the locator_value:  + {locator_value} + has this text:  {text}")
            return text
        except:
            return False

    def long_press_element(self, element, duration):
        try:
            action = TouchAction(self.driver)
            action.long_press(element, duration=duration).release().perform()
            self.log.info(f"Performed long press on element: {element}")
            return True
        except Exception as e:
            self.log.info(f"Failed to perform long press: {e}")
            return False
