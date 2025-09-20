const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data.json');

// Helpers to load and save users
function loadUsers() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// Login/Register
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = loadUsers();
  let user = users.find(u => u.username === username);

  if (user) {
    if (user.password === password) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } else {
    user = { username, password, points: 0 };
    users.push(user);
    saveUsers(users);
    res.json({ success: true, user, message: "User registered" });
  }
});

// Update points (increment)
app.post('/update-points', (req, res) => {
  const { username, points } = req.body; // points to add
  let users = loadUsers();
  let user = users.find(u => u.username === username);

  if (user) {
    user.points += points;
    saveUsers(users);
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: "User not found" });
  }
});

// Leaderboard
app.get('/leaderboard', (req, res) => {
  let users = loadUsers();
  users.sort((a, b) => b.points - a.points);
  res.json(users.slice(0, 10));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
