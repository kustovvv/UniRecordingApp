# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Set the Credentials
Open `.env` and set next data:
1. _MAIL_USERNAME_ and _MAIL_PASSWORD_ - your real email credentials from which confirmation emails will be sent to users upon registration and password reset.
2. _PARENT_FOLDER_ID_ - your Google Drive folder in which all user folders with their records will be stored.
3. _AIRTABLE_APP_ID_, _AIRTABLE_TABLE_ID_ and _AIRTABLE_API_KEY_ - credentials from table in Airtable database.

## Step 2: Start the Flask Server

Run the `app.py` file.

## Step 3: Start the Metro Server

To start Metro, open a _new_ terminal from the _RecordingApp_ and run the following command:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 4: Start Recording Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _RecordingApp_. Run the following command to start with _Android_ or _iOS_:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see a logo and within a few seconds after connecting to the flask server you should see a registration/audio recording page depending on whether you have logged into the application before.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.
