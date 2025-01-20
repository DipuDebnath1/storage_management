### add .env file 
* LOCAL_API=http://localhost:5000
* DEVELOPMENT=localhost
* PORT=5000
* DATABASE_URL=
* ACCESS_TOKEN=
* RESET_TOKEN=
* PRIVET_FOLDER_TOKEN=
* SALTROUNDS=
* MAIL_PASS=
* MAIL_NAME=


## base postman API 
### local-api = http://localhost:5000/api

## API Endpoints

* **Auth**
    * **signup** - Signs up a new user.
    * **signin** - Signs in a user.
    * **Forget Password** - Sends a reset password link to the user's email.
    * **verifyResetPasswordVerificationCode** - Verifies the reset password verification code.
    * **ResetPassword** - Resets the user's password.
    * **Log Out User** - Logs out the user.
    * **SetPrivetFolderPIN** - Sets a PIN for a private folder.
    * **LoginprivetAccess** - Logs in to access private folders.
    * **LogoutPrivetAccess** - Logs out of private folders.
    * **removeFromPrivet** - Removes a file from a private folder.
* **Storage**
    * **Home**
        * **getStorageUsesDataInfo** - Gets storage usage data.
        * **getFileCategory** - Gets the file categories.
        * **recentFile** - Gets recent files.
    * **folder operation**
        * **create folder** - Creates a new folder.
        * **getAllFolder** - Gets all folders.
        * **delete folder** - Deletes a folder.
    * **file operation**
        * **fileUpload** - Uploads a file.
        * **getAll-Image** - Gets all images.
        * **get Pdf files** - Gets all PDF files.
        * **get notes** - Gets all notes.
        * **delete file** - Deletes a file.
        * **get Date Wise File** - Gets files for a specific date.
        * **file Rename** - Renames a file.
    * **Favorite opration**
        * **create favorite** - Creates a favorite item.
        * **get all favorite** - Gets all favorite items.
        * **remove favourite** - Removes a favorite item.
* **Privet**
    * **AddFileInPrivet** - Adds a file to a private folder.
    * **getFromPrrivet** - Gets all files from private folders.