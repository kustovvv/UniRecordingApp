from .page import Page


class LoginPage(Page):
    def __init__(self, driver):
        super().__init__(driver)
        self.driver = driver

    _enterEmail = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.EditText[1]"
    _enterPassword = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.EditText[2]"
    _verifyLoginPage = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.TextView[1]"
    _loginButton = """//android.view.ViewGroup[@content-desc="Login"]"""
    _verifySuccessfulLogin = """/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.TextView"""
    _verifyIncorrectEmailOrPassword = """/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.TextView"""
    _okButton = """/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button"""

    def click_login_button(self):
        return self.click_element(self._loginButton)

    def verify_login_page(self):
        return self.is_displayed(self._verifyLoginPage, timeout=25)

    def enter_email(self, email):
        return self.send_text(email, self._enterEmail)

    def enter_password(self, password):
        return self.send_text(password, self._enterPassword)

    def verify_successful_login(self):
        return self.is_displayed(self._verifySuccessfulLogin, timeout=25)

    def verify_incorrect_email_or_password(self):
        return self.is_displayed(self._verifyIncorrectEmailOrPassword, timeout=20)

    def click_ok_button(self):
        return self.click_element(self._okButton)
