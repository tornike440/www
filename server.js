const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data.json');

// Login/Register
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  let user = users.find(u => u.username === username);

  if(user){
    if(user.password === password){
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } else {
    user = { username, password, points: 0 };
    users.push(user);
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    res.json({ success: true, user, message: "User registered" });
  }
});

// Update points
app.post('/update-points', (req, res) => {
  const { username, points } = req.body;
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  let user = users.find(u => u.username === username);

  if(user){
    user.points = points;
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: "User not found" });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
