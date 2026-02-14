// ─── État ───────────────────────────────────────────────────────────────────
const state = { name: '', playerClass: null, player: null };

// ─── Utilitaires ────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function getStoredUsername() { return localStorage.getItem('rpg_username'); }
function setStoredUsername(u) { localStorage.setItem('rpg_username', u); }
function clearStoredUsername() { localStorage.removeItem('rpg_username'); }

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

// ─── Écran 1 : Nom ───────────────────────────────────────────────────────────
const nameInput  = document.getElementById('name-input');
const nameError  = document.getElementById('name-error');
const btnNameNext = document.getElementById('btn-name-next');

btnNameNext.addEventListener('click', () => {
  const val = nameInput.value.trim();
  if (val.length < 3) { nameError.textContent = 'Au moins 3 caractères'; return; }
  if (val.length > 20) { nameError.textContent = 'Maximum 20 caractères'; return; }
  if (!/^[a-zA-Z0-9_-]+$/.test(val)) { nameError.textContent = 'Lettres, chiffres, - et _ uniquement'; return; }
  nameError.textContent = '';
  state.name = val;
  document.getElementById('display-name').textContent = val;
  showScreen('screen-class');
});

nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') btnNameNext.click(); });
nameInput.addEventListener('input', () => { nameError.textContent = ''; });

// ─── Écran 2 : Classe ────────────────────────────────────────────────────────
const btnClassNext = document.getElementById('btn-class-next');
const btnClassBack = document.getElementById('btn-class-back');

document.querySelectorAll('.class-card').forEach(card => {
  card.addEventListener('click', (e) => {
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.playerClass = card.dataset.class;
    btnClassNext.disabled = false;
  });
});

btnClassBack.addEventListener('click', () => showScreen('screen-name'));

btnClassNext.addEventListener('click', () => {
  if (!state.playerClass) return;
  renderConfirm();
  showScreen('screen-confirm');
});

// ─── Écran 3 : Confirmation ──────────────────────────────────────────────────
const btnConfirmBack   = document.getElementById('btn-confirm-back');
const btnConfirmCreate = document.getElementById('btn-confirm-create');
const createError      = document.getElementById('create-error');

const CLASS_STATS = {
  warrior: { hp: 120, energy: 60,  strength: 15, agility: 8  },
  mage:    { hp: 70,  energy: 120, strength: 6,  agility: 10 },
  archer:  { hp: 90,  energy: 90,  strength: 10, agility: 14 },
  rogue:   { hp: 80,  energy: 100, strength: 8,  agility: 16 },
};

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

btnConfirmBack.addEventListener('click', () => showScreen('screen-class'));

btnConfirmCreate.addEventListener('click', async () => {
  createError.textContent = '';
  btnConfirmCreate.disabled = true;
  btnConfirmCreate.textContent = 'Création en cours…';

  try {
    const res = await fetch('/api/players/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: state.name, player_class: state.playerClass }),
    });

    if (res.status === 409) {
      createError.textContent = 'Ce nom est déjà pris, choisissez-en un autre.';
      btnConfirmBack.click(); // retour à la sélection de classe
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
    btnConfirmCreate.disabled = false;
    btnConfirmCreate.textContent = 'Commencer l\'aventure ⚔️';
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

document.getElementById('btn-delete').addEventListener('click', async () => {
  if (!confirm(`Supprimer définitivement ${state.player.username} ? Cette action est irréversible.`)) return;
  clearStoredUsername();
  state.player = null;
  state.name = '';
  state.playerClass = null;
  document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('btn-class-next').disabled = true;
  nameInput.value = '';
  showScreen('screen-name');
});
