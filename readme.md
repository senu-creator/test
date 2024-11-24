# Login and Registration System with File-Based Storage

## Functionality

1. **Registration**:
   - Users can register by providing a **username** and **password**.
   - The system checks if the username already exists in `register_notebook.txt`. If it exists, registration is blocked.
   - If the username is unique, it is saved in `register_notebook.txt` with the password.

2. **Login**:
   - Users can log in by entering their **username** and **password**.
   - The system checks if the credentials match with the ones stored in `register_notebook.txt`.
   - If valid, login is recorded in `login_notebook.txt` as "success".
   - If invalid, the system still shows "Login successful!", but the failed attempt is logged in `invalid_login_credentials.txt`.

3. **File Storage**:
   - All data is stored in text files:
     - `register_notebook.txt` stores usernames and passwords.
     - `login_notebook.txt` records login attempts (successful).
     - `invalid_login_credentials.txt` records failed login attempts.

---

## How to Run the Application

1. **Install Node.js**: [Download and install Node.js](https://nodejs.org/).

2. **Set up the Project**:
   - Create a project directory and navigate to it in your terminal.
   - Run `npm init -y` to initialize the project.
   - Install required dependencies with:
     ```bash
     npm install express body-parser ejs
     ```

3. **Create Required Files**:
   - Create the following files:
     - `app.js` (main server logic)
     - `views/login.ejs`, `views/register.ejs` (login and registration forms)
     - `register_notebook.txt`, `login_notebook.txt`, `invalid_login_credentials.txt` (data storage)

4. **Run the Application**:
   - Start the server by running:
     ```bash
     node app.js
     ```
   - The app will be available at [http://localhost:3000](http://localhost:3000).

---

## How to Test the Application

### 1. Test Registration
- Go to `http://localhost:3000/register`.
- Enter a **username** and **password**.
- If the **username** already exists, you’ll see "User already exists."
- If the registration is successful, the username and password will be saved in `register_notebook.txt`.

### 2. Test Login (Valid Credentials)
- Go to `http://localhost:3000`.
- Enter the **username** and **password** you registered with.
- The login will be successful, and the attempt will be recorded in `login_notebook.txt`.

### 3. Test Login (Invalid Credentials)
- Go to `http://localhost:3000`.
- Enter a **wrong username** or **password**.
- The login will still show "Login successful!" but the failed attempt will be logged in `invalid_login_credentials.txt`.

---

## Error Handling

- If any issues arise when reading or writing the files, an error message like "Error reading data. Please try again later" will be displayed.
- If the files contain invalid data (non-JSON format), the server will show an appropriate error.

