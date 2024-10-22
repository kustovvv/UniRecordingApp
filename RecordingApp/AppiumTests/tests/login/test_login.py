import pytest

from ...framework import login_page


@pytest.fixture(scope='function')
def user_login_fixture(driver):
    yield login_page.LoginPage(driver)


@pytest.mark.test_login_page
@pytest.mark.parametrize(
    "email, password, validity",
    [
        ('wrong_email', 'ddbs34212', None),  # Bad request
        ('zegorovskiy1355@gmail.com', 'wrong_password123', None),  # Bad request
        ('zegorovskiy1355@gmail.com', 'ddbs34212', True)
    ]
)
def test_user_login(user_login_fixture, email, password, validity):
    login_page = user_login_fixture
    assert login_page.verify_login_page(), "Login page did not load properly."
    assert login_page.enter_email(email), "Failed to enter email."
    assert login_page.enter_password(password), "Failed to enter password."
    assert login_page.click_login_button(), "Failed to click login button."
    if validity:
        assert login_page.verify_successful_login(), "Login failed."
    else:
        assert login_page.verify_incorrect_email_or_password(), "Error message is not displayed."
        assert login_page.click_ok_button(), "Failed to click OK button."
