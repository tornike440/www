const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    // Redirect to home.html with username in query string
    window.location.href = `home.html?user=${encodeURIComponent(data.user.username)}`;
  } else {
    message.textContent = data.message;
  }
});
