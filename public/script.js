let currentUser = null;

// Login/Register
document.getElementById('loginBtn').addEventListener('click', async () => {
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
    window.location.href = "home.html";
  } else {
    alert(data.message);
  }
});

// Complete challenge
document.getElementById('completeBtn').addEventListener('click', async () => {
  if (!currentUser) return alert("Login first");
  const res = await fetch("/update-points", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentUser.username, points: 10 })
  });
  const data = await res.json();
  if (data.success) {
    currentUser = data.user;
    showLeaderboard();
  }
});

// Leaderboard
async function showLeaderboard() {
  const res = await fetch("/leaderboard");
  const leaderboard = await res.json();
  const list = document.getElementById("leaderboard");
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
