from .page import Page
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class RecordingPage(Page):
    def __init__(self, driver):
        super().__init__(driver)
        self.driver = driver

    _recordButton = """//android.view.ViewGroup[@content-desc=""]/android.widget.TextView"""
    _pauseButton = """//android.view.ViewGroup[@content-desc=""]/android.widget.TextView"""
    _recordingsListPageButton = """//android.view.ViewGroup[@content-desc=""]/android.widget.TextView"""
    _verifyRecordingPage = """/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.TextView"""
    _recordingTime = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.TextView[1]"
    _saveButton = """//android.view.ViewGroup[@content-desc=""]/android.widget.TextView"""
    _verifyRecordingsListPage = """/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.TextView"""
    _noRecordingsText = """/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.TextView"""
    _uploadToServerButton = """//android.view.ViewGroup[@content-desc="Upload files to server"]"""
    _general_button_xpath = "//android.view.ViewGroup[starts-with(@content-desc, 'New record ')]"
    _back_to_recording_page_button = """//android.view.ViewGroup[@content-desc=""]/android.widget.TextView"""

    def click_record_button(self):
        return self.click_element(self._recordButton, timeout=20)

    def click_pause_button(self):
        return self.click_element(self._pauseButton)

    def get_recording_time(self):
        return self.get_element_text(self._recordingTime, timeout=20)

    def click_save_record_button(self):
        return self.click_element(self._saveButton)

    def check_time_change(self, should_change=True):
        old_text = self.get_element_text(self._recordingTime, timeout=20)

        def check_text_changed(driver):
            current_text = self.get_element_text(self._recordingTime, timeout=20)
            if should_change:
                return current_text != old_text
            else:
                return current_text == old_text

        return WebDriverWait(self.driver, 10).until(check_text_changed)

    def click_recordings_list_page(self):
        return self.click_element(self._recordingsListPageButton, timeout=20)

    def verify_recordings_list_page(self):
        return self.is_displayed(self._verifyRecordingsListPage, timeout=5)

    def verify_no_recordings_message_is_displayed(self):
        return self.is_displayed(self._noRecordingsText)

    def verify_upload_to_server_button(self):
        return self.is_displayed(self._uploadToServerButton)

    def count_elements_in_list(self):
        try:
            elements = self.get_elements(self._general_button_xpath)
            return len(elements)
        except:
            return 0

    def click_back_to_recording_page_button(self):
        return self.click_element(self._back_to_recording_page_button)

    def verify_recording_page(self):
        return self.is_displayed(self._verifyRecordingPage)
