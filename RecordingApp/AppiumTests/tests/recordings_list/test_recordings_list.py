import pytest

from ...framework import recordings_list_page
from ..recording.test_recording import record_audio


@pytest.fixture(scope='function')
def recordings_list_page_fixture(driver):
    yield recordings_list_page.RecordingsListPage(driver)


@pytest.mark.recordings_list_page_tests
def test_delete_audio_from_list(recordings_list_page_fixture, recording_page_fixture):
    recordings_list_page = recordings_list_page_fixture
    recording_page = recording_page_fixture
    record_audio(recording_page_fixture)
    assert recording_page.count_elements_in_list() == 1, "Recordings list wasn't updated"
    assert recordings_list_page.long_press_record(), "Failed to long press recording."
    assert recordings_list_page.verify_modal_delete_button_popup(), "Modal delete button is not displayed."
    assert recordings_list_page.click_modal_delete_button(), "Failed to click modal delete button."
    assert recordings_list_page.verify_confirm_delete_alert(), "Confirm delete alert is not displayed."
    assert recordings_list_page.click_confirm_delete_button(), "Failed to click confirm delete recording button."
    assert recording_page.count_elements_in_list() == 0, "Recording wasn't deleted"
    assert recording_page.verify_no_recordings_message_is_displayed(), "No recordings message is not displayed."


@pytest.mark.rercordings_list_page_tests
def test_rename_audio(recordings_list_page_fixture, recording_page_fixture):
    recordings_list_page = recordings_list_page_fixture
    recording_page = recording_page_fixture
    record_audio(recording_page_fixture)
    new_name = 'New record 2'
    assert recordings_list_page.get_recordings_names()[0] == 'New record 1'
    assert recording_page.count_elements_in_list() == 1, "Recordings list wasn't updated"
    assert recordings_list_page.long_press_record(), "Failed to long press recording."
    assert recordings_list_page.verify_modal_delete_button_popup(), "Modal delete button is not displayed."
    assert recordings_list_page.verify_modal_rename_button_popup(), "Modal rename button is not displayed."
    assert recordings_list_page.click_modal_rename_button(), "Failed to click rename button."
    assert recordings_list_page.verify_rename_modal(), "Failed to display rename modal."
    assert recordings_list_page.enter_new_recording_name(new_name), "Failed to enter new name."
    assert recordings_list_page.click_confirm_rename_button(), "Failed to click confirm rename button."
    assert recordings_list_page.get_recordings_names()[0] == new_name


@pytest.mark.recordings_list_page_test
def test_upload_recordings_to_server(recordings_list_page_fixture, recording_page_fixture):
    recordings_list_page = recordings_list_page_fixture
    record_audio(recording_page_fixture)
    assert recordings_list_page.click_upload_to_server_button(), "Failed to click upload to server button."
    assert recordings_list_page.verify_alert_message(2), "Upload to server alert is not displayed."
    assert recordings_list_page.click_confirm_upload_to_server_button(), "Failed to click confirm upload button."
    assert recordings_list_page.verify_alert_message(20), "Upload confirmation alert is not displayed."
    assert recordings_list_page.get_amount_uploaded_recordings_to_server() == 1, "Incorrect upload amount."
    assert recordings_list_page.click_confirmation_upload_ok_button(), "Failed to click upload confirmation ok button."
    recordings_list_page.click_upload_to_server_button()
    recordings_list_page.click_confirm_upload_to_server_button()
    assert recordings_list_page.verify_alert_message(20), "Upload confirmation alert is not displayed."
    assert recordings_list_page.verify_all_files_up_to_date_message(), "Incorrect alert message."
    assert recordings_list_page.click_confirmation_upload_ok_button(), "Failed to click upload confirmation ok button."
