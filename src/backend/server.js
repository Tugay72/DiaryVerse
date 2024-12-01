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
    CREATE TABLE IF NOT EXISTS diaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      text TEXT,
      date TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table `diaries` is ready.');
    }
  });
});

// API to save a diary entry
app.post('/save-diary', (req, res) => {
    const { userId, text, date } = req.body;
  
    if (!userId || !text || !date) {
      return res.status(400).json({ error: 'User ID and text are required' });
    }
  
    const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    db.run("INSERT INTO diaries (user_id, text, date) VALUES (?, ?, ?)", [userId, text, formattedDate], function (err) {
      if (err) {
        console.error('Error inserting diary:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
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
  
  
  
  

// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
