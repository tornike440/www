const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.static(__dirname));
app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Read users from JSON
  const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  let user = users.find(u => u.username === username);

  if(user) {
    if(user.password === password) {
      // Optional: Increase points by 1 on login
      user.points += 1;
      fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
      res.json({ success: true, message: 'Login successful! 🌱', user });
    } else {
      res.json({ success: false, message: 'Incorrect password' });
    }
  } else {
    // Register new user with points = 0
    user = { username, password, points: 0 };
    users.push(user);
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    res.json({ success: true, message: 'User registered! 🌱', user });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
