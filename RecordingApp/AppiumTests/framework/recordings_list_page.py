from .page import Page
import time


class RecordingsListPage(Page):
    def __init__(self, driver):
        super().__init__(driver)
        self.driver = driver

    _modalFrame = """/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup"""
    _modalDeleteButton = """//android.view.ViewGroup[@content-desc="Delete"]/android.widget.TextView"""
    _modalRenameButton = """//android.view.ViewGroup[@content-desc="Rename"]/android.widget.TextView"""
    _verifyConfirmDeleteAlert = """/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.TextView"""
    _confirmDeleteButton = """/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[2]"""
    _verifyRenameModal = """/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView"""
    _enterNewName = """/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.EditText"""
    _confirmRenameButton = """//android.view.ViewGroup[@content-desc="Rename"]"""
    _general_button_xpath = "//android.view.ViewGroup[starts-with(@content-desc, 'New record ')]"
    _uploadToServerButton = """//android.view.ViewGroup[@content-desc="Upload files to server"]"""
    _confirmUploadToServerButton = """/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[2]"""
    _alertMessage= """/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.TextView"""
    _uploadConfirmationAlertMessage = """/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.TextView"""
    _uploadConfirmationAlertOkButton = """/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button"""

    def long_press_record(self):
        try:
            elements = self.get_elements(self._general_button_xpath)
            self.long_press_element(elements[0], 5)
            return True
        except:
            return False

    def verify_modal_delete_button_popup(self):
        return self.is_displayed(self._modalDeleteButton)

    def verify_modal_rename_button_popup(self):
        return self.is_displayed(self._modalRenameButton)

    def click_modal_delete_button(self):
        element = self.get_element(self._modalDeleteButton)
        return self.long_press_element(element, 100)

    def verify_confirm_delete_alert(self):
        return self.is_displayed(self._verifyConfirmDeleteAlert, timeout=20)

    def click_confirm_delete_button(self):
        return self.click_element(self._confirmDeleteButton)

    def get_recordings_list_amount(self):
        return self.get_elements(self._general_button_xpath)

    def click_modal_rename_button(self):
        element = self.get_element(self._modalRenameButton)
        return self.long_press_element(element, 100)

    def verify_rename_modal(self):
        return self.is_displayed(self._verifyRenameModal)

    def click_confirm_rename_button(self):
        return self.click_element(self._confirmRenameButton)

    def enter_new_recording_name(self, new_name):
        return self.send_text(new_name, self._enterNewName)

    def get_recordings_names(self):
        names = []
        try:
            elements = self.get_elements(self._general_button_xpath)
            for element in elements:
                try:
                    content_description = element.get_attribute('content-desc')
                    if content_description:
                        parts = content_description.split(',')
                        names.append(parts[0])
                    else:
                        print("Content description not available")
                except Exception as e:
                    print(e)
            return names
        except:
            return names

    def click_upload_to_server_button(self):
        return self.click_element(self._uploadToServerButton)

    def click_confirm_upload_to_server_button(self):
        return self.click_element(self._confirmUploadToServerButton)

    def verify_alert_message(self, timeout):
        return self.is_displayed(self._alertMessage, timeout=timeout)

    def get_amount_uploaded_recordings_to_server(self):
        try:
            element = self.get_element(self._uploadConfirmationAlertMessage)
            message_parts = element.text.split(' ')
            amount = int(message_parts[0])
            return amount
        except:
            return 0

    def verify_all_files_up_to_date_message(self):
        try:
            element = self.get_element(self._uploadConfirmationAlertMessage)
            return element.text == "All files are up to date."
        except:
            return False

    def click_confirmation_upload_ok_button(self):
        return self.click_element(self._uploadConfirmationAlertOkButton)
