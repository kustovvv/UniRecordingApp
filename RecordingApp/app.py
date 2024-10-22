from flask import Flask, request, jsonify, url_for, render_template
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from gevent.pywsgi import WSGIServer
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

import logging

from Google import init_google_drive_service, search_and_download_from_drive, upload_to_drive, create_or_find_folder
from utilities import send_email, generate_confirmation_token, confirm_token, decode_recovery_token, \
                      generate_password_confirmation_token
from Airtable import fetch_medspa_airtable, update_medspa_password_airtable, add_new_medspa_airtable, \
                     update_medspa_is_email_confirmed, update_medspa_device_uid, update_medspa_drive_folder_id, \
                     update_medspa_is_logged_in, fetch_medspa_airtable_by_device_uid

file_handler = logging.FileHandler('flask_app.log')
file_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

app = Flask(__name__)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.DEBUG)

CORS(app, resources={r'/*': {'origins': '*'}})
load_dotenv()
app.config['MAX_CONTENT_LENGTH'] = 1000 * 1024 * 1024  # 1 GB limit
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)
bcrypt = Bcrypt(app)


@app.route("/")
def initial_page():
    return


@app.route("/signup", methods=["POST", "GET"])
def signup():
    if request.method == "POST":
        email = request.json.get("email")
        password = request.json.get("password")

        user = fetch_medspa_airtable(email=email)
        if user and user['fields']['is_email_confirmed'] != 'none':
            return jsonify({"error": "Email already exists"}), 409
        elif user:
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            update_medspa_password_airtable(user, hashed_password)
        else:
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            add_new_medspa_airtable(email, hashed_password)

        token = generate_confirmation_token(email)
        confirm_url = url_for('confirm_email', token=token, _external=True)
        html = render_template('activate.html', confirm_url=confirm_url)
        send_email(email, mail, html)

        return jsonify({"message": 'Success'})


@app.route('/confirm_email/<token>')
def confirm_email(token):
    email = confirm_token(token)
    if not email:
        return jsonify({"error": "The confirmation link is invalid or has expired."}), 400
    user = fetch_medspa_airtable(email=email)
    if user and user['fields']['is_email_confirmed'] == 'none':
        update_medspa_is_email_confirmed(user)
        return render_template('email_confirmed.html')
    else:
        return render_template('email_not_confirmed.html'), 400


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")
    device_uid = request.json.get("device_uid")

    user = fetch_medspa_airtable(email=email)

    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401

    if user['fields']['is_email_confirmed'] == 'none':
        return jsonify({"error": "Unauthorized"}), 400

    hashed_password = user['fields']['password']

    if isinstance(hashed_password, bytes):
        hashed_password = hashed_password.decode('utf-8')

    if not bcrypt.check_password_hash(hashed_password, password):
        return jsonify({"error": "Unauthorized"}), 401

    if user['fields']['device_uid'] == 'none' or user['fields']['device_uid'] != device_uid:
        update_medspa_device_uid(user, device_uid)

    if user['fields']['drive_folder_id'] == 'none':
        service = init_google_drive_service()
        parent_folder_id = os.getenv('PARENT_FOLDER_ID')
        folder_name = email
        drive_folder_id = create_or_find_folder(service, parent_folder_id, folder_name)

        update_medspa_drive_folder_id(user, drive_folder_id)

    update_medspa_is_logged_in(user, state='1')

    return jsonify({
        "id": "1",
        "email": email
    })


@app.route("/logout", methods=["POST"])
def logout():
    device_uid = request.json.get('device_uid')
    user = fetch_medspa_airtable_by_device_uid(device_uid=device_uid)
    update_medspa_is_logged_in(user, state='none')
    return jsonify({"message": "DB was updated"}), 200


@app.route("/check_login", methods=["POST"])
def check_login():
    device_uid = request.json.get('device_uid')
    user = fetch_medspa_airtable_by_device_uid(device_uid=device_uid)
    if user:
        if user['fields']['is_logged_in'] == '1':
            return jsonify({"message": "User is logged in"}), 200

    return jsonify({"message": "User is not logged in"}), 201


@app.route("/recovery", methods=["POST"])
def recovery():
    email = request.json.get("email")
    user = fetch_medspa_airtable(email=email)

    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401

    token = generate_password_confirmation_token(email)
    confirm_url = url_for('password_reset', token=token, _external=True)
    html = render_template('password_recovery.html', confirm_url=confirm_url)
    send_email(email, mail, html)

    return jsonify({"message": 'Success'})


@app.route("/password_reset", methods=["GET"])
def password_reset():
    token = request.args.get("token")
    return render_template('password_reset.html', token=token)


@app.route('/validate_token', methods=['POST'])
def validate_token():
    token = request.json.get('token')
    email = decode_recovery_token(token)
    if email:
        return jsonify({'email': email}), 200
    else:
        return jsonify({'error': 'Invalid or expired token'}), 400


@app.route('/apply_reset_password', methods=['POST'])
def reset_password():
    email = request.json.get("email")
    password = request.json.get("password")
    user = fetch_medspa_airtable(email=email)

    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    update_medspa_password_airtable(user, hashed_password)
    return jsonify({"message": "Password war reset successfully"}), 200


@app.route('/upload_files_to_google_drive', methods=['POST'])
def upload_files_to_google_drive():
    content_type = request.headers.get('Content-Type')

    if 'multipart/form-data' in content_type:
        service = init_google_drive_service()
        device_uid = request.form.get("device_uid")
        user = fetch_medspa_airtable_by_device_uid(device_uid=device_uid)

        folder_id = user['fields']['drive_folder_id']
        mtimes = json.loads(request.form.get('mtimes', '{}'))
        uploaded_files = request.files.getlist("audio_files")

        if uploaded_files:
            for file in uploaded_files:
                file_name = file.filename
                mtime = mtimes.get(file_name)
                file_path = os.path.join('audio_files', file_name)
                file.save(file_path)
                upload_to_drive(service, file_name, folder_id, mtime, file_path)
                os.remove(file_path)
            return jsonify({'message': 'Files uploaded successfully'}), 200
        else:
            return jsonify({'message': 'No files were uploaded'}), 400
    else:
        return jsonify({'message': 'Unsupported Media Type'}), 415


@app.route('/get_existing_files', methods=['POST'])
def get_existing_files():
    service = init_google_drive_service()
    device_uid = request.json.get('device_uid')
    user = fetch_medspa_airtable_by_device_uid(device_uid=device_uid)

    folder_id = user['fields']['drive_folder_id']
    files = search_and_download_from_drive(service, folder_id)
    if not files:
        files = ''
    return jsonify({'files': files}), 200


if __name__ == "__main__":
    print("Starting Flask server")
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    print("Server Started at port 5000")
    http_server.serve_forever()
