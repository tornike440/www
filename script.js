// Get currentUser from localStorage for persistence
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Login/Register (index.html)
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!username || !password) return alert("Enter username and password");

    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      currentUser = data.user;
      // Persist login
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      // Redirect to home page
      window.location.href = "home.html";
    } else {
      alert(data.message);
    }
  });
}

// Home page logic (home.html)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  if (!currentUser) {
    // Not logged in, redirect back to login
    window.location.href = "index.html";
  } else {
    document.getElementById('welcomeMsg').textContent = `Hello, ${currentUser.username}! Points: ${currentUser.points}`;
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}

// Complete Challenge
const completeBtn = document.getElementById('completeBtn');
if (completeBtn) {
  completeBtn.addEventListener('click', async () => {
    if (!currentUser) return alert("Login first");
    const res = await fetch("/update-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: currentUser.username, points: 10 })
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      document.getElementById('welcomeMsg').textContent = `Hello, ${currentUser.username}! Points: ${currentUser.points}`;
      showLeaderboard();
    }
  });
}

// Leaderboard
async function showLeaderboard() {
  const res = await fetch("/leaderboard");
  const leaderboard = await res.json();
  const list = document.getElementById("leaderboard");
  if (!list) return;
  list.innerHTML = "";
  leaderboard.forEach((user, i) => {
    const li = document.createElement("li");
    li.textContent = `${i+1}. ${user.username} — ${user.points} pts`;
    list.appendChild(li);
  });
}

// Refresh leaderboard every 5 seconds
setInterval(showLeaderboard, 5000);
showLeaderboard();
