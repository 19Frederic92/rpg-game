// Retourne le SVG du pantin selon la classe
window.getPuppetSVG = function(playerClass, size = 160) {
  const puppets = {
    warrior: `<svg viewBox="0 0 100 160" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="22" r="14" fill="#c8a96e" stroke="#7a5c2e" stroke-width="2"/>
      <circle cx="44" cy="20" r="2" fill="#5a3e1b"/><circle cx="56" cy="20" r="2" fill="#5a3e1b"/>
      <path d="M44 27 Q50 31 56 27" stroke="#5a3e1b" stroke-width="1.5" fill="none"/>
      <path d="M36 18 Q50 4 64 18 L62 22 Q50 10 38 22Z" fill="#7a5c2e" stroke="#5a3e1b" stroke-width="1"/>
      <rect x="34" y="17" width="6" height="3" rx="1" fill="#7a5c2e"/>
      <rect x="60" y="17" width="6" height="3" rx="1" fill="#7a5c2e"/>
      <rect x="36" y="38" width="28" height="32" rx="4" fill="#c8a96e" stroke="#7a5c2e" stroke-width="2"/>
      <rect x="38" y="40" width="24" height="28" rx="3" fill="#8b6914" stroke="#5a3e1b" stroke-width="1"/>
      <line x1="50" y1="40" x2="50" y2="68" stroke="#5a3e1b" stroke-width="1"/>
      <line x1="38" y1="52" x2="62" y2="52" stroke="#5a3e1b" stroke-width="1"/>
      <rect x="45" y="35" width="10" height="5" rx="2" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="20" y="38" width="14" height="8" rx="4" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="8" y="43" width="14" height="7" rx="3" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="2" y="35" width="4" height="24" rx="1" fill="#aaa" stroke="#666" stroke-width="1"/>
      <rect x="0" y="45" width="8" height="3" rx="1" fill="#8b6914"/>
      <rect x="66" y="38" width="14" height="8" rx="4" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="78" y="43" width="14" height="7" rx="3" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <path d="M88 37 Q98 42 98 52 Q98 60 88 65 Q78 60 78 52 Q78 42 88 37Z" fill="#8b6914" stroke="#5a3e1b" stroke-width="1.5"/>
      <rect x="36" y="68" width="12" height="28" rx="4" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="52" y="68" width="12" height="28" rx="4" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="34" y="92" width="14" height="8" rx="3" fill="#7a5c2e" stroke="#5a3e1b" stroke-width="1.5"/>
      <rect x="50" y="92" width="14" height="8" rx="3" fill="#7a5c2e" stroke="#5a3e1b" stroke-width="1.5"/>
      <circle cx="36" cy="38" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="64" cy="38" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="42" cy="68" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="58" cy="68" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
    </svg>`,

    mage: `<svg viewBox="0 0 100 160" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="22" r="14" fill="#c8a96e" stroke="#7a5c2e" stroke-width="2"/>
      <circle cx="44" cy="20" r="2" fill="#5a3e1b"/><circle cx="56" cy="20" r="2" fill="#5a3e1b"/>
      <path d="M44 27 Q50 31 56 27" stroke="#5a3e1b" stroke-width="1.5" fill="none"/>
      <path d="M30 20 L50 0 L70 20Z" fill="#2c1a6e" stroke="#1a0f40" stroke-width="1.5"/>
      <rect x="28" y="19" width="44" height="5" rx="2" fill="#3d2594" stroke="#1a0f40" stroke-width="1"/>
      <circle cx="50" cy="4" r="3" fill="#f0d080"/>
      <path d="M36 38 Q30 70 28 100 L72 100 Q70 70 64 38Z" fill="#2c1a6e" stroke="#1a0f40" stroke-width="2"/>
      <rect x="45" y="35" width="10" height="5" rx="2" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <text x="48" y="60" font-size="8" fill="#f0d080">✦</text>
      <text x="42" y="75" font-size="6" fill="#f0d080">✦</text>
      <rect x="22" y="38" width="13" height="7" rx="3" fill="#2c1a6e" stroke="#1a0f40" stroke-width="1.5"/>
      <rect x="10" y="42" width="13" height="7" rx="3" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="4" y="25" width="4" height="30" rx="1" fill="#7a5c2e" stroke="#5a3e1b" stroke-width="1"/>
      <circle cx="6" cy="23" r="6" fill="#7030e0" stroke="#4a20a0" stroke-width="1.5"/>
      <circle cx="6" cy="23" r="3" fill="#b080ff" opacity="0.8"/>
      <rect x="65" y="38" width="13" height="7" rx="3" fill="#2c1a6e" stroke="#1a0f40" stroke-width="1.5"/>
      <rect x="77" y="42" width="13" height="7" rx="3" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="38" y="96" width="10" height="8" rx="3" fill="#1a0f40" stroke="#0d0820" stroke-width="1.5"/>
      <rect x="52" y="96" width="10" height="8" rx="3" fill="#1a0f40" stroke="#0d0820" stroke-width="1.5"/>
      <circle cx="36" cy="38" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="64" cy="38" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
    </svg>`,

    archer: `<svg viewBox="0 0 100 160" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="22" r="14" fill="#c8a96e" stroke="#7a5c2e" stroke-width="2"/>
      <circle cx="44" cy="20" r="2" fill="#5a3e1b"/><circle cx="56" cy="20" r="2" fill="#5a3e1b"/>
      <path d="M44 27 Q50 31 56 27" stroke="#5a3e1b" stroke-width="1.5" fill="none"/>
      <path d="M36 16 Q50 6 64 16 Q64 28 50 30 Q36 28 36 16Z" fill="#2d5a1b" stroke="#1a3a10" stroke-width="1.5"/>
      <rect x="36" y="38" width="28" height="32" rx="4" fill="#c8a96e" stroke="#7a5c2e" stroke-width="2"/>
      <rect x="38" y="40" width="24" height="28" rx="3" fill="#4a7a2a" stroke="#2d5a1b" stroke-width="1"/>
      <rect x="45" y="35" width="10" height="5" rx="2" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="20" y="38" width="14" height="8" rx="4" fill="#4a7a2a" stroke="#2d5a1b" stroke-width="1.5"/>
      <rect x="8" y="42" width="13" height="7" rx="3" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <path d="M4 25 Q-4 50 4 75" stroke="#7a5c2e" stroke-width="3" fill="none"/>
      <line x1="4" y1="25" x2="4" y2="75" stroke="#c8a96e" stroke-width="1" stroke-dasharray="2,2"/>
      <rect x="66" y="38" width="14" height="8" rx="4" fill="#4a7a2a" stroke="#2d5a1b" stroke-width="1.5"/>
      <rect x="78" y="42" width="13" height="7" rx="3" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <line x1="70" y1="46" x2="98" y2="46" stroke="#7a5c2e" stroke-width="2"/>
      <polygon points="98,43 104,46 98,49" fill="#aaa"/>
      <rect x="36" y="68" width="12" height="28" rx="4" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="52" y="68" width="12" height="28" rx="4" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="34" y="92" width="14" height="8" rx="3" fill="#2d5a1b" stroke="#1a3a10" stroke-width="1.5"/>
      <rect x="50" y="92" width="14" height="8" rx="3" fill="#2d5a1b" stroke="#1a3a10" stroke-width="1.5"/>
      <circle cx="36" cy="38" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="64" cy="38" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="42" cy="68" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="58" cy="68" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
    </svg>`,

    rogue: `<svg viewBox="0 0 100 160" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="22" r="14" fill="#c8a96e" stroke="#7a5c2e" stroke-width="2"/>
      <rect x="38" y="19" width="24" height="8" rx="4" fill="#1a1a2e" stroke="#0d0d1a" stroke-width="1"/>
      <circle cx="44" cy="22" r="2.5" fill="#2a2a4e"/><circle cx="56" cy="22" r="2.5" fill="#2a2a4e"/>
      <path d="M44 29 Q50 33 56 29" stroke="#5a3e1b" stroke-width="1.5" fill="none"/>
      <path d="M34 14 Q50 2 66 14 Q68 24 64 28 Q50 32 36 28 Q32 24 34 14Z" fill="#1a1a2e" stroke="#0d0d1a" stroke-width="1.5" opacity="0.9"/>
      <rect x="36" y="38" width="28" height="32" rx="4" fill="#c8a96e" stroke="#7a5c2e" stroke-width="2"/>
      <rect x="38" y="40" width="24" height="28" rx="3" fill="#1a1a2e" stroke="#0d0d1a" stroke-width="1"/>
      <rect x="36" y="58" width="28" height="5" rx="1" fill="#4a3010" stroke="#2a1a08" stroke-width="1"/>
      <rect x="48" y="57" width="4" height="7" rx="1" fill="#c9a84c"/>
      <rect x="45" y="35" width="10" height="5" rx="2" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="20" y="38" width="14" height="8" rx="4" fill="#1a1a2e" stroke="#0d0d1a" stroke-width="1.5"/>
      <rect x="8" y="42" width="13" height="7" rx="3" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="2" y="40" width="3" height="18" rx="1" fill="#ccc" stroke="#999" stroke-width="1"/>
      <rect x="0" y="48" width="7" height="2" rx="1" fill="#c9a84c"/>
      <rect x="66" y="38" width="14" height="8" rx="4" fill="#1a1a2e" stroke="#0d0d1a" stroke-width="1.5"/>
      <rect x="78" y="42" width="13" height="7" rx="3" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.5"/>
      <rect x="95" y="40" width="3" height="18" rx="1" fill="#ccc" stroke="#999" stroke-width="1"/>
      <rect x="93" y="48" width="7" height="2" rx="1" fill="#c9a84c"/>
      <rect x="36" y="68" width="12" height="28" rx="4" fill="#1a1a2e" stroke="#0d0d1a" stroke-width="1.5"/>
      <rect x="52" y="68" width="12" height="28" rx="4" fill="#1a1a2e" stroke="#0d0d1a" stroke-width="1.5"/>
      <rect x="34" y="92" width="14" height="8" rx="3" fill="#0d0d1a" stroke="#000" stroke-width="1.5"/>
      <rect x="50" y="92" width="14" height="8" rx="3" fill="#0d0d1a" stroke="#000" stroke-width="1.5"/>
      <circle cx="36" cy="38" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="64" cy="38" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="42" cy="68" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
      <circle cx="58" cy="68" r="3" fill="#a07840" stroke="#7a5c2e" stroke-width="1"/>
    </svg>`
  };
  return puppets[playerClass] || puppets.warrior;
};

window.CLASS_LABELS = {
  warrior: 'Guerrier ⚔️',
  mage:    'Mage 🔮',
  archer:  'Archer 🏹',
  rogue:   'Voleur 🗡️',
};
