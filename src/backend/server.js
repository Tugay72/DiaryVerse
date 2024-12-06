const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');  // Add this line to import moment
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Create or open the SQLite database
const db = new sqlite3.Database('./src/database/diary.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Check if the `diaries` table exists, if not, create it
db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table `diaries` is ready.');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS diaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      text TEXT,
      date TEXT,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table `diaries` is ready.');
    }
  });
  
  
});

app.put('/save-user', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password],
    function (err) {
      if (err) {
        console.error('Error saving user:', err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({ userId: this.lastID }); // Return the ID of the inserted user
    }
  );
});

app.get('/get-user', (req, res) => {
  const { email, password } = req.query; // Use req.query for GET parameters

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Query to check if the user exists
  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        console.error('Error fetching user:', err.message);
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ error: 'User not found or incorrect credentials' });
      }

      res.json(row); // Return the user details
    }
  );
});


// API to save a diary entry
app.post('/save-diary', (req, res) => {
  const { userId, text, date } = req.body;

  if (!userId || !text || !date) {
    return res.status(400).json({ error: 'User ID, text, and date are required' });
  }

  const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');

  // Check if an entry already exists for the user and date
  db.get("SELECT * FROM diaries WHERE user_id = ? AND date = ?", [userId, formattedDate], (err, row) => {
    if (err) {
      console.error('Error querying database:', err.message);
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // Entry already exists
      return res.status(400).json({ error: 'Diary entry already exists for this date.' });
    }

    // If no entry exists, insert the new diary
    db.run(
      "INSERT INTO diaries (user_id, text, date) VALUES (?, ?, ?)", [userId, text, formattedDate],
      function (err) {
        if (err) {
          console.error('Error inserting diary:', err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
      }
    );
  });
});


// API to fetch diaries for a specific user and date
app.get('/get-diaries/:userId/:date', (req, res) => {
  const { userId, date } = req.params;

  db.all("SELECT * FROM diaries WHERE user_id = ? AND date = ?", [userId, date], (err, rows) => {
    if (err) {
      console.error('Error fetching diaries:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
  
  
// API to delete a diary entry
app.delete('/delete-diary/:userId/:date', (req, res) => {
  const { userId, date } = req.params;

  // Delete the diary entry for the specified userId and date
  db.run(
    "DELETE FROM diaries WHERE user_id = ? AND date = ?",
    [userId, date],
    function (err) {
      if (err) {
        console.error('Error deleting diary:', err.message);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Diary entry not found' });
      }

      res.json({ message: 'Diary deleted successfully' });
    }
  );
});


  

// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
