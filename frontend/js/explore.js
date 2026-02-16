// ─── État ─────────────────────────────────────────────────────────────────────
const state = {
  player: null,
  locations: [],
  visited: [],
  quests: [],
  selectedSlug: null,
  currentQuest: null,
};

// ─── Init ─────────────────────────────────────────────────────────────────────
(async function init() {
  const username = localStorage.getItem('rpg_username');
  if (!username) { window.location.href = '/create.html'; return; }

  const res = await fetch(`/api/players/${username}`);
  const data = await res.json();
  if (!data.exists) { window.location.href = '/create.html'; return; }

  state.player = data.player;
  updateHeader();

  await Promise.all([loadLocations(), loadVisits(), loadQuests()]);
  updateMap();
  updateJournal();
})();

function updateHeader() {
  const p = state.player;
  document.getElementById('hdr-hp').textContent = `❤️ ${p.hp}/${p.max_hp}`;
  document.getElementById('hdr-gold').textContent = `🪙 ${p.gold}`;
  document.getElementById('hdr-level').textContent = `Niv. ${p.level}`;
}

async function loadLocations() {
  const res = await fetch('/api/locations/all');
  state.locations = await res.json();
}

async function loadVisits() {
  const res = await fetch(`/api/locations/visits/${state.player.id}`);
  const data = await res.json();
  state.visited = data.visited;
}

async function loadQuests() {
  const res = await fetch(`/api/quests/${state.player.id}`);
  state.quests = await res.json();
}

// ─── Carte ────────────────────────────────────────────────────────────────────
function updateMap() {
  document.querySelectorAll('.map-zone').forEach(zone => {
    const slug = zone.dataset.slug;
    const minLevel = parseInt(zone.dataset.minlevel);
    zone.classList.remove('visited', 'locked', 'active-zone');

    if (state.player.level < minLevel) {
      zone.classList.add('locked');
    } else if (state.visited.includes(slug)) {
      zone.classList.add('visited');
    }

    zone.addEventListener('click', () => onZoneClick(slug, minLevel));
  });
}

function onZoneClick(slug, minLevel) {
  if (state.player.level < minLevel) {
    showTravelMessage(`Niveau ${minLevel} requis pour accéder à ce lieu.`, true);
    return;
  }

  state.selectedSlug = slug;
  const location = state.locations.find(l => l.slug === slug);
  if (!location) return;

  // Activer la zone visuellement
  document.querySelectorAll('.map-zone').forEach(z => z.classList.remove('active-zone'));
  document.querySelector(`[data-slug="${slug}"]`).classList.add('active-zone');

  showLocationPanel(location);
}

function showLocationPanel(location) {
  document.getElementById('panel-idle').classList.remove('active');
  document.getElementById('panel-location').classList.add('active');

  document.getElementById('loc-name').textContent = location.name;
  document.getElementById('loc-description').textContent = location.description;
  document.getElementById('loc-flavor').textContent = `"${location.flavor_text}"`;

  const badge = document.getElementById('loc-badge');
  badge.textContent = state.visited.includes(location.slug) ? '✓ Visité' : 'Non exploré';
  badge.style.borderColor = state.visited.includes(location.slug)
    ? 'rgba(46,204,113,0.4)' : 'rgba(201,168,76,0.3)';
  badge.style.color = state.visited.includes(location.slug) ? '#2ecc71' : '';

  // Ennemis
  const enemiesDiv = document.getElementById('loc-enemies');
  if (location.enemies && location.enemies.length > 0) {
    enemiesDiv.innerHTML = `<p class="enemies-title">⚔️ Ennemis</p>` +
      location.enemies.map(e =>
        `<span class="enemy-tag">${e.name} (HP: ${e.hp})</span>`
      ).join('');
  } else {
    enemiesDiv.innerHTML = `<p class="enemies-title" style="color:#2ecc71">✓ Zone paisible</p>`;
  }

  // Quête existante ?
  const quest = state.quests.find(q => q.location_slug === location.slug);
  const questPanel = document.getElementById('quest-panel');

  if (quest) {
    questPanel.style.display = 'block';
    document.getElementById('quest-title').textContent = quest.title;
    document.getElementById('quest-description').textContent = quest.description;
    document.getElementById('quest-xp').textContent = `+${quest.xp_reward} XP`;
    document.getElementById('quest-gold').textContent = `+${quest.gold_reward} 🪙`;

    const statusWrap = document.getElementById('quest-status-wrap');
    if (quest.status === 'completed') {
      statusWrap.innerHTML = `<span class="status-badge status-completed">✓ Complétée</span>`;
    } else {
      statusWrap.innerHTML = `
        <span class="status-badge status-active">En cours</span>
        <button class="btn-complete-quest" onclick="completeQuest(${quest.id})">
          Terminer la quête ✓
        </button>`;
    }
    state.currentQuest = quest;
  } else {
    questPanel.style.display = 'none';
    state.currentQuest = null;
  }

  document.getElementById('travel-message').textContent = '';
}

// ─── Voyager ──────────────────────────────────────────────────────────────────
document.getElementById('btn-travel').addEventListener('click', async () => {
  if (!state.selectedSlug) return;
  const btn = document.getElementById('btn-travel');
  btn.disabled = true;
  btn.textContent = 'Voyage en cours...';

  try {
    const res = await fetch(`/api/locations/visit/${state.player.id}/${state.selectedSlug}`, {
      method: 'POST',
    });

    if (res.status === 403) {
      const err = await res.json();
      showTravelMessage(err.detail, true);
      return;
    }

    const data = await res.json();

    if (data.first_visit) {
      showTravelMessage(`Vous arrivez à ${data.location.name} pour la première fois !`);
      state.visited.push(state.selectedSlug);
      updateMap();
    } else {
      showTravelMessage(`Vous revenez à ${data.location.name}.`);
    }

    // Mettre à jour les données joueur
    state.player.xp = data.player_xp;
    state.player.gold = data.player_gold;
    state.player.level = data.player_level;
    updateHeader();

    // Afficher la quête déclenchée
    if (data.quest) {
      await loadQuests();
      showLocationPanel(state.locations.find(l => l.slug === state.selectedSlug));
      if (data.first_visit) {
        showTravelMessage(`Nouvelle quête déclenchée : "${data.quest.title}" !`);
      }
    }

    updateJournal();

  } catch (e) {
    showTravelMessage('Erreur de connexion.', true);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Voyager ici ⚔️';
  }
});

// ─── Compléter une quête ──────────────────────────────────────────────────────
window.completeQuest = async function(questId) {
  const res = await fetch(`/api/quests/${questId}/complete`, { method: 'POST' });
  if (!res.ok) return;
  const data = await res.json();

  state.player.xp = data.player_xp;
  state.player.gold = data.player_gold;
  state.player.level = data.player_level;
  updateHeader();

  await loadQuests();
  showLocationPanel(state.locations.find(l => l.slug === state.selectedSlug));
  showTravelMessage(`Quête complétée ! +${data.xp_gained} XP, +${data.gold_gained} 🪙`);
  updateJournal();
};

// ─── Journal ──────────────────────────────────────────────────────────────────
function updateJournal() {
  const list = document.getElementById('journal-list');
  if (state.quests.length === 0) {
    list.innerHTML = `<p class="journal-empty">Aucune quête pour l'instant. Explorez le monde !</p>`;
    return;
  }
  list.innerHTML = state.quests.map(q => `
    <div class="journal-item">
      <div class="j-title">${q.status === 'completed' ? '✓ ' : '◈ '}${q.title}</div>
      <div class="j-loc">${q.location_slug} — ${q.status === 'completed' ? 'Complétée' : 'En cours'}</div>
    </div>
  `).join('');
}

function showTravelMessage(msg, isError = false) {
  const el = document.getElementById('travel-message');
  el.textContent = msg;
  el.style.color = isError ? '#e74c3c' : 'var(--gold)';
}