from googleapiclient.discovery import build, MediaFileUpload
from google.oauth2 import service_account


def init_google_drive_service():
    """
       Initializes the Google Drive service using credentials from a service account file.

       This function sets up the Google Drive API service, allowing for file operations like uploading.
       It uses a service account for authentication and requires the appropriate scopes to interact with Google Drive.

       Returns:
         - Google Drive service instance.
    """
    SCOPES = [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata"
    ]
    key_file = "keys/recordings-405714-8990ac058030.json"

    credentials = service_account.Credentials.from_service_account_file(key_file, scopes=SCOPES)
    service = build('drive', 'v3', credentials=credentials)
    print("Google drive service initialized")
    return service


def search_and_download_from_drive(service, folder_id):
    results = service.files().list(
        q="'{}' in parents and trashed=false".format(folder_id),
        pageSize=10,
        fields="nextPageToken, files(id, name, appProperties)").execute()
    items = results.get('files', [])
    return items


def upload_to_drive(service, file_name, folder_id, mtime, file_path):
    file_metadata = {
        'name': file_name,
        'parents': [folder_id],
        'appProperties': {
            'mtime': mtime,
        }
    }
    media = MediaFileUpload(file_path)
    service.files().create(body=file_metadata, media_body=media, fields='id').execute()


def create_or_find_folder(service, parent_folder_id, folder_name):
    query = f"name = '{folder_name}' and '{parent_folder_id}' in parents and mimeType = 'application/vnd.google-apps.folder'"
    response = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
    files = response.get('files', [])
    if files:
        return files[0]['id']
    else:
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': [parent_folder_id]
        }
        folder = service.files().create(body=file_metadata, fields='id').execute()
        return folder.get('id')
