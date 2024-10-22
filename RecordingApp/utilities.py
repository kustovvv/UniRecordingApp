from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer as Serializer
from flask import current_app


def generate_confirmation_token(email):
    serializer = Serializer(current_app.config['SECRET_KEY'], salt='email-confirm')
    return serializer.dumps(email, salt='email-confirm')


def generate_password_confirmation_token(email):
    serializer = Serializer(current_app.config['SECRET_KEY'], salt='password-recovery-salt')
    return serializer.dumps(email, salt='password-recovery-salt')


def confirm_token(token, expiration=3600):
    serializer = Serializer(current_app.config['SECRET_KEY'], salt='email-confirm')
    try:
        email = serializer.loads(
            token,
            salt='email-confirm',
            max_age=expiration
        )
    except Exception as e:
        print('Confirmation tokin failed: ', e)
        return False
    return email


def send_email(email, mail, html):
    subject = "Confirm your email"
    msg = Message(subject=subject, sender="noreply@demo.com", recipients=[email])
    msg.html = html
    mail.send(msg)


def decode_recovery_token(token):
    serializer = Serializer(current_app.config['SECRET_KEY'], salt='password-recovery-salt')
    try:
        data = serializer.loads(token)
        return data
    except Exception as e:
        print(f"Token decoding error: {e}")
        return None
