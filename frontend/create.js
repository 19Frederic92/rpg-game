const state = { name: '', playerClass: null, player: null };

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function getStoredUsername() { return localStorage.getItem('rpg_username'); }
function setStoredUsername(u) { localStorage.setItem('rpg_username', u); }
function clearStoredUsername() { localStorage.removeItem('rpg_username'); }

const CLASS_STATS = {
  warrior: { hp: 120, energy: 60,  strength: 15, agility: 8  },
  mage:    { hp: 70,  energy: 120, strength: 6,  agility: 10 },
  archer:  { hp: 90,  energy: 90,  strength: 10, agility: 14 },
  rogue:   { hp: 80,  energy: 100, strength: 8,  agility: 16 },
};

// ─── Init ────────────────────────────────────────────────────────────────────
(async function init() {
  const stored = getStoredUsername();
  if (stored) {
    const res = await fetch(`/api/players/${stored}`);
    const data = await res.json();
    if (data.exists) {
      state.player = data.player;
      renderProfile(data.player);
      showScreen('screen-profile');
      return;
    }
  }
  showScreen('screen-name');
})();

// ─── Popup ───────────────────────────────────────────────────────────────────
function openClassPopup(playerClass) {
  const s = CLASS_STATS[playerClass];
  const overlay = document.getElementById('popup-overlay');

  document.getElementById('popup-puppet').innerHTML = getPuppetSVG(playerClass, 130);
  document.getElementById('popup-class-name').textContent = CLASS_LABELS[playerClass];
  document.getElementById('popup-class-label').textContent = {
    warrior: 'Maître du combat rapproché',
    mage:    'Tisseur d\'arcanes dévastateur',
    archer:  'Précision mortelle à distance',
    rogue:   'Rapide et insaisissable',
  }[playerClass];
  document.getElementById('popup-stats').innerHTML = `
    <div class="popup-stat"><span class="label">❤️ HP</span><span class="value">${s.hp}</span></div>
    <div class="popup-stat"><span class="label">⚡ Énergie</span><span class="value">${s.energy}</span></div>
    <div class="popup-stat"><span class="label">⚔️ Force</span><span class="value">${s.strength}</span></div>
    <div class="popup-stat"><span class="label">🏃 Agilité</span><span class="value">${s.agility}</span></div>
  `;

  overlay.classList.add('active');
  state.playerClass = playerClass;
}

function closePopup() {
  document.getElementById('popup-overlay').classList.remove('active');
}

document.getElementById('popup-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('popup-overlay')) closePopup();
});

document.getElementById('btn-popup-cancel').addEventListener('click', () => {
  state.playerClass = null;
  closePopup();
});

document.getElementById('btn-popup-confirm').addEventListener('click', () => {
  closePopup();
  renderConfirm();
  showScreen('screen-confirm');
});

// ─── Écran 1 : Nom ───────────────────────────────────────────────────────────
const nameInput   = document.getElementById('name-input');
const nameError   = document.getElementById('name-error');
const btnNameNext = document.getElementById('btn-name-next');

btnNameNext.addEventListener('click', async () => {
  const val = nameInput.value.trim();
  if (val.length < 3) { nameError.textContent = 'Au moins 3 caractères'; return; }
  if (val.length > 20) { nameError.textContent = 'Maximum 20 caractères'; return; }
  if (!/^[a-zA-Z0-9_-]+$/.test(val)) { nameError.textContent = 'Lettres, chiffres, - et _ uniquement'; return; }
  nameError.textContent = '';

  btnNameNext.disabled = true;
  btnNameNext.textContent = '...';

  try {
    const res = await fetch(`/api/players/${val}`);
    const data = await res.json();

    if (data.exists) {
      state.player = data.player;
      setStoredUsername(data.player.username);
      renderProfile(data.player);
      showScreen('screen-profile');
      return;
    }

    // Nouveau personnage
    state.name = val;
    document.getElementById('display-name').textContent = val;
    showScreen('screen-class');

  } catch(e) {
    nameError.textContent = 'Erreur de connexion au serveur.';
  } finally {
    btnNameNext.disabled = false;
    btnNameNext.textContent = 'Choisir ma classe →';
  }
});

nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') btnNameNext.click(); });
nameInput.addEventListener('input', () => { nameError.textContent = ''; });

// ─── Écran 2 : Classe ────────────────────────────────────────────────────────
document.getElementById('btn-class-back').addEventListener('click', () => showScreen('screen-name'));

document.querySelectorAll('.class-card').forEach(card => {
  card.addEventListener('click', () => openClassPopup(card.dataset.class));
});

// ─── Écran 3 : Confirmation ──────────────────────────────────────────────────
function renderConfirm() {
  document.getElementById('confirm-name').textContent = state.name;
  document.getElementById('confirm-class').textContent = CLASS_LABELS[state.playerClass];
  document.getElementById('confirm-puppet').innerHTML = getPuppetSVG(state.playerClass, 160);
  const s = CLASS_STATS[state.playerClass];
  document.getElementById('confirm-stats').innerHTML = `
    <div class="confirm-stat"><span class="label">❤️ HP</span><span class="value">${s.hp}</span></div>
    <div class="confirm-stat"><span class="label">⚡ Énergie</span><span class="value">${s.energy}</span></div>
    <div class="confirm-stat"><span class="label">⚔️ Force</span><span class="value">${s.strength}</span></div>
    <div class="confirm-stat"><span class="label">🏃 Agilité</span><span class="value">${s.agility}</span></div>
    <div class="confirm-stat"><span class="label">🪙 Or</span><span class="value">50</span></div>
  `;
}

document.getElementById('btn-confirm-back').addEventListener('click', () => showScreen('screen-class'));

document.getElementById('btn-confirm-create').addEventListener('click', async () => {
  const createError = document.getElementById('create-error');
  const btn = document.getElementById('btn-confirm-create');
  createError.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Création en cours…';

  try {
    const res = await fetch('/api/players/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: state.name, player_class: state.playerClass }),
    });
    if (res.status === 409) {
      createError.textContent = 'Ce nom est déjà pris.';
      showScreen('screen-name');
      return;
    }
    if (!res.ok) throw new Error('Erreur serveur');
    const player = await res.json();
    state.player = player;
    setStoredUsername(player.username);
    renderProfile(player);
    showScreen('screen-profile');
  } catch (e) {
    createError.textContent = 'Erreur de connexion au serveur.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Commencer l\'aventure ⚔️';
  }
});

// ─── Écran 4 : Profil ────────────────────────────────────────────────────────
function renderProfile(p) {
  document.getElementById('profile-puppet').innerHTML = getPuppetSVG(p.player_class, 180);
  document.getElementById('profile-username').textContent = p.username;
  document.getElementById('profile-class-badge').textContent = CLASS_LABELS[p.player_class];
  document.getElementById('profile-level').textContent = p.level;
  document.getElementById('profile-hp').textContent = `${p.hp} / ${p.max_hp}`;
  document.getElementById('profile-energy').textContent = `${p.energy} / ${p.max_energy}`;
  document.getElementById('profile-str').textContent = p.strength;
  document.getElementById('profile-agi').textContent = p.agility;
  document.getElementById('profile-gold').textContent = p.gold;
  const pct = Math.round((p.xp / p.xp_next_level) * 100);
  document.getElementById('xp-fill').style.width = pct + '%';
  document.getElementById('xp-label').textContent = `${p.xp} / ${p.xp_next_level} XP`;
}

document.getElementById('btn-play').addEventListener('click', () => {
  alert('Exploration — à venir dans l\'étape 3 ! 🗺️');
});

document.getElementById('btn-delete').addEventListener('click', () => {
  if (!confirm(`Supprimer définitivement ${state.player.username} ?`)) return;
  clearStoredUsername();
  state.player = null;
  state.name = '';
  state.playerClass = null;
  nameInput.value = '';
  showScreen('screen-name');
});