import os
from dotenv import load_dotenv
from pyairtable import Api

load_dotenv()

AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY", default='None')
AIRTABLE_APP_ID = os.getenv("AIRTABLE_APP_ID", default='None')
AIRTABLE_TABLE_ID = os.getenv("AIRTABLE_TABLE_ID", default='None')


def load_airtable_table():
    """
        Creates and returns an instance of an Airtable table.

        Returns:
            Table: An instance of the specified Airtable table.
    """
    api = Api(AIRTABLE_API_KEY)
    return api.table(AIRTABLE_APP_ID, AIRTABLE_TABLE_ID)


def fetch_medspa_airtable(email):
    table = load_airtable_table()
    formula = f"{{email}} = '{email}'"
    all_fields = table.all(formula=formula)
    if all_fields:
        return all_fields[0]
    return None


def update_medspa_password_airtable(user, hashed_password):
    if user:
        unique_id = user['id']
        table = load_airtable_table()
        table.update(unique_id, {"password": str(hashed_password)})
        print('Airtable updated')
    else:
        print('No matching record found to update')


def add_new_medspa_airtable(email, hashed_password):
    try:
        table = load_airtable_table()
        table.create({"email": email, "password": hashed_password})
        print('New medspa has been added')
    except Exception as e:
        print('An error occured: ', e)


def update_medspa_is_email_confirmed(user):
    try:
        table = load_airtable_table()
        unique_id = user['id']
        table.update(unique_id, {"is_email_confirmed": '1'})
        print('Medspa is_email_confirmed field was updated')
    except Exception as e:
        print('An error occured: ', e)


def update_medspa_device_uid(user, device_uid):
    try:
        table = load_airtable_table()
        unique_id = user['id']
        table.update(unique_id, {"device_uid": device_uid})
        print('Medspa device_uid field was updated')
    except Exception as e:
        print('An error occured: ', e)


def update_medspa_drive_folder_id(user, drive_folder_id):
    try:
        table = load_airtable_table()
        unique_id = user['id']
        table.update(unique_id, {"drive_folder_id": drive_folder_id})
        print('Medspa drive_folder_id field was updated')
    except Exception as e:
        print('An error occured: ', e)


def update_medspa_is_logged_in(user, state):
    try:
        table = load_airtable_table()
        unique_id = user['id']
        table.update(unique_id, {"is_logged_in": state})
        print('Medspa is_logged_in field was updated')
    except Exception as e:
        print('An error occured: ', e)


def fetch_medspa_airtable_by_device_uid(device_uid):
    table = load_airtable_table()
    formula = f"{{device_uid}} = '{device_uid}'"
    all_fields = table.all(formula=formula)
    if all_fields:
        return all_fields[0]
    return None
