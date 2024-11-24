// Import necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();

// Set port
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Use body parser to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the notebook files exist and are properly initialized
const initializeNotebooks = () => {
  const loginNotebookPath = path.join(__dirname, 'login_notebook.txt');
  const registerNotebookPath = path.join(__dirname, 'register_notebook.txt');
  const invalidLoginPath = path.join(__dirname, 'invalid_login_credentials.txt');

  // Check and initialize login notebook
  if (!fs.existsSync(loginNotebookPath)) {
    fs.writeFileSync(loginNotebookPath, JSON.stringify([])); // Create an empty array if the file doesn't exist
  }

  // Check and initialize register notebook
  if (!fs.existsSync(registerNotebookPath)) {
    fs.writeFileSync(registerNotebookPath, JSON.stringify([])); // Create an empty array if the file doesn't exist
  }

  // Check and initialize invalid login credentials file
  if (!fs.existsSync(invalidLoginPath)) {
    fs.writeFileSync(invalidLoginPath, JSON.stringify([])); // Create an empty array if the file doesn't exist
  }
};

// Show the login form
app.get('/', (req, res) => {
  res.render('login');
});

// Show the register form
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle form submission (login or register)
app.post('/submit', (req, res) => {
  const { username, password, action } = req.body;

  // Define file paths for notebooks
  const loginNotebookPath = path.join(__dirname, 'login_notebook.txt');
  const registerNotebookPath = path.join(__dirname, 'register_notebook.txt');
  const invalidLoginPath = path.join(__dirname, 'invalid_login_credentials.txt');

  // Ensure the notebooks are initialized
  initializeNotebooks();

  if (action === 'register') {
    // Register the user
    fs.readFile(registerNotebookPath, 'utf8', (err, data) => {
      if (err) {
        return res.send('Error reading data. Please try again later.');
      }

      let registerData;
      try {
        registerData = data ? JSON.parse(data) : [];
      } catch (e) {
        return res.send('Error: The registration notebook contains invalid data.');
      }

      // Check if the user already exists
      const userExists = registerData.some(user => user.username === username);
      if (userExists) {
        return res.send('User already exists. <a href="/register">Try again</a>');
      }

      // Add the new user to the register data
      registerData.push({ username, password });

      // Save back to the file
      fs.writeFile(registerNotebookPath, JSON.stringify(registerData, null, 2), (err) => {
        if (err) {
          return res.send('Error saving data. Please try again later.');
        }
        res.send('Registration successful! Now you can <a href="/">Login</a>');
      });
    });
  } else if (action === 'login') {
    // Log in the user
    fs.readFile(registerNotebookPath, 'utf8', (err, data) => {
      if (err) {
        return res.send('Error reading data. Please try again later.');
      }

      let registerData;
      try {
        registerData = data ? JSON.parse(data) : [];
      } catch (e) {
        return res.send('Error: The registration notebook contains invalid data.');
      }

      // Check if the credentials match
      const user = registerData.find(user => user.username === username && user.password === password);

      // Log the login attempt into the login_notebook.txt
      const loginData = { username, password, status: user ? 'success' : 'failure' };

      fs.readFile(loginNotebookPath, 'utf8', (err, loginDataFile) => {
        let loginAttempts = [];
        if (!err) {
          try {
            loginAttempts = JSON.parse(loginDataFile);
          } catch (e) {
            // If the file is empty or corrupt, we'll start with an empty array
          }
        }
        loginAttempts.push(loginData);
        fs.writeFile(loginNotebookPath, JSON.stringify(loginAttempts, null, 2), (err) => {
          if (err) {
            return res.send('Error logging login attempt. Please try again later.');
          }

          // If login failed, save the invalid login to invalid_login_credentials.txt
          if (!user) {
            const invalidLoginData = { username, password, status: 'failure' };
            fs.readFile(invalidLoginPath, 'utf8', (err, invalidDataFile) => {
              let invalidLoginAttempts = [];
              if (!err) {
                try {
                  invalidLoginAttempts = JSON.parse(invalidDataFile);
                } catch (e) {
                  // If the file is empty or corrupt, we'll start with an empty array
                }
              }
              invalidLoginAttempts.push(invalidLoginData);
              fs.writeFile(invalidLoginPath, JSON.stringify(invalidLoginAttempts, null, 2), (err) => {
                if (err) {
                  return res.send('Error logging invalid login attempt. Please try again later.');
                }

                // Send the success message even if the login was invalid
                res.send('Login successful! Welcome back.');
              });
            });
          } else {
            // If login is successful, simply show the success message
            res.send('Login successful! Welcome back.');
          }
        });
      });
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
