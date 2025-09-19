const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if(!username || !password) return;

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    message.textContent = data.message;
    message.style.color = data.success ? 'green' : 'red';

    if(data.success) {
      // Save user info locally and redirect
      localStorage.setItem('user', JSON.stringify(data.user));
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1000);
    }
  } catch(err) {
    console.error(err);
    message.textContent = 'Server error';
  }
});
