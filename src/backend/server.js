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
      password TEXT,
      total_diaries INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0
    );
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table `users` is ready.');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS diaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      text TEXT,
      date TEXT,
      mood TEXT,
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

  db.run(`
    CREATE TRIGGER IF NOT EXISTS increment_total_diaries
    AFTER INSERT ON diaries
    BEGIN
        UPDATE users
        SET total_diaries = total_diaries + 1
        WHERE user_id = NEW.user_id;
    END;
  `, (err) => {
    if (err) {
      console.error('Error creating increment trigger:', err.message);
    } else {
      console.log('Trigger `increment_total_diaries` is ready.');
    }
  });

  db.run(`
    CREATE TRIGGER IF NOT EXISTS decrement_total_diaries
    AFTER DELETE ON diaries
    BEGIN
        UPDATE users
        SET total_diaries = total_diaries - 1
        WHERE user_id = OLD.user_id;
    END;

  `, (err) => {
    if (err) {
      console.error('Error creating decrement trigger:', err.message);
    } else {
      console.log('Decrement `decrement_total_diaries` is ready.');
    }
  });
  

  
});

app.put('/save-user', (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
  
    // Check if the user already exists
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        console.error('Error checking user:', err.message);
        return res.status(500).json({ error: err.message });
      }
  
      if (row) {
        // User already exists
        return res.status(409).json({ error: 'User already exists' }); // 409 Conflict
      }
  
      // Insert new user if they don't exist
      db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        function (err) {
          if (err) {
            console.error('Error saving user:', err.message);
            return res.status(500).json({ error: err.message });
          }
  
          res.json({ userId: this.lastID });
        }
      );
    });
  });
  

app.get('/confirm-user', (req, res) => {
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

      const { password, ...userWithoutPassword } = row;
      res.json({ success: true, user: userWithoutPassword });
    }
  );
});

app.get('/get-user', (req, res) => {
  const {email} = req.query;

  if (!email){
    return res.status(400).json({error : 'Email required!'})
  }

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, row) => {
      if (err) {
        console.log('Error fetching user:', err.message);
        return res.status(500).json({error: err.message});
      }

      if (!row) {
        return res.status(400).json({error: 'User not found or incorrect credentials'})
      }

      const { password, ...userWithoutPassword } = row;
      res.json(userWithoutPassword);
    }
  )
})

app.patch('/change-password', (req, res) => {
  const { email, newPassword } = req.body; // Parse JSON body

  if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required!' });
  }

  db.run(
      'UPDATE users SET password = ? WHERE email = ?',
      [newPassword, email],
      function (err) {
          if (err) {
              console.error('Error updating password:', err.message);
              return res.status(500).json({ error: 'Internal server error' });
          }

          if (this.changes === 0) {
              return res.status(404).json({ error: 'User not found' });
          }

          console.log('Password updated successfully!');
          res.status(200).json({ message: 'Password updated successfully!' });
      }
  );
});

app.post('/save-diary', (req, res) => {
    const { userId, text, date, mood } = req.body;
  
    // Check if required fields are provided
    if (!userId || !text || !date) {
      return res.status(400).json({ error: 'User ID, text, and date are required' });
    }
  
    const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
  
    // Serialize the text if it is an object (assuming text is a rich-text format or object)
    const serializedText = JSON.stringify(text);
  
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
  
      // If no entry exists, insert the new diary entry
      db.run(
        "INSERT INTO diaries (user_id, text, date, mood) VALUES (?, ?, ?, ?)", 
        [userId, serializedText, formattedDate, mood],
        function (err) {
          if (err) {
            console.error('Error inserting diary:', err.message);
            return res.status(500).json({ error: err.message });
          }
  
          // Fetch the user's current streak and total diaries
          db.get("SELECT current_streak, total_diaries FROM users WHERE user_id = ?", [userId], (err, user) => {
            if (err || !user) {
              return res.status(500).json({ error: 'Error fetching user data' });
            }
  
            // Check if there is a diary for the previous day
            const previousDay = moment(formattedDate, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
            db.get(
              "SELECT * FROM diaries WHERE user_id = ? AND date = ?",
              [userId, previousDay],
              (err, prevDiary) => {
                if (err) {
                  return res.status(500).json({ error: 'Error checking previous day' });
                }
  
                // Calculate the new streak
                let newStreak = prevDiary ? user.current_streak + 1 : 1;
  
                // Update the user's streak and total diaries
                db.run(
                  "UPDATE users SET current_streak = ?, total_diaries = total_diaries + 1 WHERE user_id = ?",
                  [newStreak, userId],
                  (err) => {
                    if (err) {
                      console.error('Error updating streak:', err.message);
                      return res.status(500).json({ error: 'Error updating streak' });
                    }
  
                    // Return response with the new streak and diary ID
                    res.json({
                      message: 'Diary saved successfully',
                      streak: newStreak,
                      diaryId: this.lastID
                    });
                  }
                );
              }
            );
          });
        }
      );
    });
  });

  

app.get('/get-diaries/:userId/:date', (req, res) => {
    const { userId, date } = req.params;
  
    db.all("SELECT * FROM diaries WHERE user_id = ? AND date = ?", [userId, date], (err, rows) => {
      if (err) {
        console.error('Error fetching diaries:', err.message);
        return res.status(500).json({ error: 'Error fetching diary data' });
      }
  
      if (!rows || rows.length === 0) {
        return res.json({ message: 'No diary found for this date', diary: null });
      }
  
      // Return the diary data
      res.json({
        message: 'Diary fetched successfully',
        diary: rows[0]
      });
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
