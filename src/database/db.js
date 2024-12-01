// src/database/db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./diary.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database opened');
  }
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS diaries (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, text TEXT, date TEXT, FOREIGN KEY(user_id) REFERENCES users(id))");
});

// Named exports
export const saveDiary = (userId, text) => {
  const date = new Date().toISOString();
  db.run("INSERT INTO diaries (user_id, text, date) VALUES (?, ?, ?)", [userId, text, date], function (err) {
    if (err) {
      console.error('Error saving diary:', err);
    } else {
      console.log('Diary saved with ID:', this.lastID);
    }
  });
};

export const getDiaries = (userId) => {
  db.all("SELECT * FROM diaries WHERE user_id = ?", [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching diaries:', err);
    } else {
      console.log('User Diaries:', rows);
    }
  });
};
