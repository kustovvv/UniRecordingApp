import pytest
import time


@pytest.mark.test_recording_page
def test_recording_audio(recording_page_fixture):
    recording_page = recording_page_fixture
    assert recording_page.get_recording_time() == "00:00:00", "Failed to get recording time."
    assert recording_page.click_record_button(), "Failed to start recording."
    assert recording_page.check_time_change(should_change=True), "The recording time wasn't changed."
    assert recording_page.click_pause_button(), "Failed to pause recording."
    assert recording_page.check_time_change(should_change=False), "Time wasn't paused."
    assert recording_page.click_record_button(), "Failed to resume recording."
    assert recording_page.check_time_change(should_change=True), "Time wasn't resumed."
    assert recording_page.click_save_record_button(), "Failed to save recording."
    time.sleep(0.5)
    assert recording_page.get_recording_time() == "00:00:00", "Failed to get recording time."


@pytest.mark.test_recording_page
def test_show_recordings_list(recording_page_fixture):
    recording_page = recording_page_fixture
    assert recording_page.click_recordings_list_page(), "Failed to click recordings list page button."
    assert recording_page.verify_recordings_list_page(), "Failed to show recordings list page."
    assert recording_page.verify_no_recordings_message_is_displayed(), "No recordings message is not displayed."
    assert recording_page.count_elements_in_list() == 0, "Recordings list is not empty."
    assert recording_page.verify_upload_to_server_button() is False, "Upload to server button is displayed when list is empty."


def record_audio(recording_page_fixture):
    recording_page = recording_page_fixture
    recording_page.click_record_button()
    time.sleep(0.5)
    recording_page.click_save_record_button()
    recording_page.click_recordings_list_page()


@pytest.mark.test_recording_page
def test_update_recordings_list(recording_page_fixture):
    recording_page = recording_page_fixture
    record_audio(recording_page_fixture)
    assert recording_page.verify_no_recordings_message_is_displayed() is False, "No recordings message is displayed."
    assert recording_page.count_elements_in_list() == 1, "Recordings list wasn't updated"
    assert recording_page.verify_upload_to_server_button(), "Upload to server button is not displayed when list is not empty."
    assert recording_page.click_back_to_recording_page_button(), "Failed to click back to recording page button."
    assert recording_page.verify_recording_page(), "Recording page is not displayed."
    record_audio(recording_page_fixture)
    assert recording_page.count_elements_in_list() == 2, "Recordings list wasn't updated"
