const statusEl = document.getElementById('status-indicator');
const startBtn = document.getElementById('start-btn');

async function checkServer() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Server error');
    const data = await res.json();

    statusEl.className = 'status-ok';
    statusEl.innerHTML = '<span class="dot"></span> Serveur connecté';
    startBtn.disabled = false;

    console.log('API:', data.message);
  } catch (e) {
    statusEl.className = 'status-error';
    statusEl.innerHTML = '<span class="dot"></span> Serveur indisponible';
    // Retry dans 5s
    setTimeout(checkServer, 5000);
  }
}

startBtn.addEventListener('click', () => {
  window.location.href = '/create.html';
});

checkServer();
