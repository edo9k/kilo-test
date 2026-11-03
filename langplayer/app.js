const STORAGE_KEY = "langplayer:v1";
const DEFAULT_SKIP_MINUTES = 3;
const JUMP_SECONDS = 10;
const MANIFEST_URL = "data/episodes.json";

const LANG_ORDER = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文 (Chinese)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "es", name: "Español (Spanish)" },
  { code: "fr", name: "Français (French)" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "pt", name: "Português (Portuguese)" },
  { code: "ru", name: "Русский (Russian)" },
  { code: "ur", name: "اردو (Urdu)" },
  { code: "ko", name: "한국어 (Korean)" },
  { code: "id", name: "Bahasa Indonesia (Indonesian)" },
  { code: "it", name: "Italiano (Italian)" },
];

const audio = document.getElementById("audio");
const statusEl = document.getElementById("status");
const npLangEl = document.getElementById("npLang");
const npTitleEl = document.getElementById("npTitle");
const npSourceEl = document.getElementById("npSource");
const progressEl = document.getElementById("progress");
const curTimeEl = document.getElementById("curTime");
const durTimeEl = document.getElementById("durTime");
const skipInfoEl = document.getElementById("skipInfo");
const episodeListEl = document.getElementById("episodeList");
const settingsBtn = document.getElementById("settingsBtn");
const closeSettings = document.getElementById("closeSettings");
const settingsPanel = document.getElementById("settingsPanel");
const langTogglesEl = document.getElementById("langToggles");
const skipRange = document.getElementById("skipRange");
const skipValEl = document.getElementById("skipVal");
const resetBtn = document.getElementById("resetBtn");

let state = {
  enabled: {},
  skipMinutes: DEFAULT_SKIP_MINUTES,
  langIndex: 0,
  episodeIndex: 0,
  history: [],
};

let ring = [];
let manifest = {};
let skipTimer = null;
let metadataTimer = null;
let initialized = false;

function logStatus(msg, loading = false) {
  statusEl.textContent = msg;
  statusEl.className = loading ? "status loading" : "status";
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadDefaults() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      state.enabled = parsed.enabled || {};
      state.skipMinutes = typeof parsed.skipMinutes === "number" ? parsed.skipMinutes : DEFAULT_SKIP_MINUTES;
      state.langIndex = typeof parsed.langIndex === "number" ? parsed.langIndex : 0;
      state.episodeIndex = typeof parsed.episodeIndex === "number" ? parsed.episodeIndex : 0;
      state.history = Array.isArray(parsed.history) ? parsed.history : [];
    } catch (e) {
      resetState();
    }
  } else {
    resetState();
  }
  LANG_ORDER.forEach((l) => {
    if (state.enabled[l.code] === undefined) state.enabled[l.code] = true;
  });
}

function resetState() {
  state.enabled = {};
  LANG_ORDER.forEach((l) => (state.enabled[l.code] = true));
  state.skipMinutes = DEFAULT_SKIP_MINUTES;
  state.langIndex = 0;
  state.episodeIndex = 0;
  state.history = [];
}

function buildRing() {
  ring = LANG_ORDER.filter(
    (l) => state.enabled[l.code] && manifest[l.code] && manifest[l.code].length > 0
  );
  if (ring.length === 0) {
    ring = LANG_ORDER.filter((l) => manifest[l.code] && manifest[l.code].length > 0);
    if (ring.length === 0) {
      ring = [...LANG_ORDER];
      LANG_ORDER.forEach((l) => (state.enabled[l.code] = true));
    }
  }
  if (state.langIndex >= ring.length) state.langIndex = 0;
  save();
}

function randomStart() {
  if (ring.length === 0) return;
  state.langIndex = Math.floor(Math.random() * ring.length);
  state.episodeIndex = 0;
  save();
}

function currentLang() {
  return ring[state.langIndex];
}

function currentEpisodes() {
  return manifest[currentLang().code] || [];
}

async function loadManifest() {
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    manifest = await res.json();
    if (!manifest || typeof manifest !== "object") manifest = {};
  } catch (e) {
    manifest = {};
    logStatus("No episode data. Run download_episodes.py first.", true);
  }
}

async function loadCurrent() {
  const eps = currentEpisodes();
  if (!eps.length) {
    logStatus("No episodes for " + currentLang().name);
    renderEpisodes([]);
    return;
  }
  if (state.episodeIndex >= eps.length) state.episodeIndex = 0;
  save();
  renderEpisodes(eps);
  playEpisode(state.episodeIndex);
}

function playEpisode(index) {
  const eps = currentEpisodes();
  if (!eps.length) return;
  state.episodeIndex = index;
  save();
  const ep = eps[index];
  npLangEl.textContent = currentLang().name;
  npTitleEl.textContent = escapeHtml(ep.title);
  npSourceEl.textContent = ep.source;
  document.getElementById("npArt").textContent = "&#127928;";
  audio.src = ep.audio;
  audio.play().catch((e) => {
    logStatus("Playback blocked: " + escapeHtml(e.message));
  });
  renderEpisodes(eps);
  startSkipTimer();
  startProgressLoop();
  logStatus("Playing", false);
}

function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
  renderEpisodes(currentEpisodes());
}

function advanceRing() {
  if (ring.length === 0) return;
  state.langIndex = (state.langIndex + 1) % ring.length;
  state.episodeIndex = 0;
  save();
  loadCurrent();
}

function formatTime(s) {
  if (!s || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ":" + String(sec).padStart(2, "0");
}

function renderToggles() {
  langTogglesEl.innerHTML = "";
  LANG_ORDER.forEach((l) => {
    const div = document.createElement("label");
    div.className = "lang-chip" + (state.enabled[l.code] ? " active" : "");
    div.innerHTML = '<input type="checkbox" value="' + l.code + '" ' + (state.enabled[l.code] ? "checked" : "") + ' />' + l.name;
    div.onclick = (e) => {
      if (e.target.tagName === "INPUT") return;
      const cb = div.querySelector('input');
      cb.checked = !cb.checked;
      handleToggle(cb);
    };
    div.querySelector("input").onchange = (e) => handleToggle(e.target);
    langTogglesEl.appendChild(div);
  });
}

function handleToggle(cb) {
  state.enabled[cb.value] = cb.checked;
  buildRing();
  renderToggles();
  save();
  if (ring.length > 0) {
    randomStart();
    loadCurrent();
  }
}

function renderSkip() {
  skipRange.value = state.skipMinutes;
  skipValEl.textContent = state.skipMinutes;
  skipInfoEl.textContent = state.skipMinutes + " min auto-skip";
}

function clearSkipTimer() {
  if (skipTimer) {
    clearTimeout(skipTimer);
    skipTimer = null;
  }
}

function startSkipTimer() {
  clearSkipTimer();
  if (state.skipMinutes <= 0) {
    skipInfoEl.textContent = "Auto-skip: off";
    return;
  }
  skipInfoEl.textContent = "Auto-skip in " + state.skipMinutes + " min";
  skipTimer = setTimeout(() => {
    skipInfoEl.textContent = "Skipping…";
    advanceRing();
  }, state.skipMinutes * 60 * 1000);
}

function updateProgress() {
  if (audio.duration) {
    progressEl.max = audio.duration;
    progressEl.value = audio.currentTime;
    curTimeEl.textContent = formatTime(audio.currentTime);
    durTimeEl.textContent = formatTime(audio.duration);
  }
}

function startProgressLoop() {
  if (metadataTimer) clearInterval(metadataTimer);
  metadataTimer = setInterval(() => {
    if (!audio.paused || !audio.ended) updateProgress();
  }, 1000);
}

function stopProgressLoop() {
  if (metadataTimer) {
    clearInterval(metadataTimer);
    metadataTimer = null;
  }
}

function renderEpisodes(list) {
  episodeListEl.innerHTML = "";
  if (!list || list.length === 0) {
    episodeListEl.innerHTML = '<div class="empty">No episodes available for this language.</div>';
    return;
  }
  list.forEach((ep, i) => {
    const div = document.createElement("div");
    div.className = "episode-item" + (i === state.episodeIndex ? " active" : "");
    div.innerHTML =
      '<span class="ep-num">' + (i + 1) + ".</span>" +
      '<span class="ep-title">' + escapeHtml(ep.title) + "</span>" +
      '<span class="ep-dur">' + (ep.desc ? truncate(ep.desc, 60) : "") + "</span>" +
      '<button class="ep-play" aria-label="Play episode">' + (i === state.episodeIndex && !audio.paused ? "⏸" : "▶") + "</button>";
    div.onclick = (e) => {
      if (e.target.tagName === "BUTTON") {
        if (i === state.episodeIndex) togglePlay();
        else playEpisode(i);
        return;
      }
      playEpisode(i);
    };
    episodeListEl.appendChild(div);
  });
}

function truncate(s, n) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// UI wiring
settingsBtn.onclick = () => settingsPanel.classList.add("open");
closeSettings.onclick = () => settingsPanel.classList.remove("open");
settingsPanel.onclick = (e) => {
  if (e.target === settingsPanel) settingsPanel.classList.remove("open");
};

skipRange.oninput = () => {
  skipValEl.textContent = skipRange.value;
};
skipRange.onchange = () => {
  state.skipMinutes = parseInt(skipRange.value, 10) || DEFAULT_SKIP_MINUTES;
  renderSkip();
  save();
  startSkipTimer();
};

resetBtn.onclick = () => {
  resetState();
  buildRing();
  renderToggles();
  renderSkip();
  save();
  randomStart();
  loadCurrent();
};

document.getElementById("btnPlay").onclick = togglePlay;
document.getElementById("btnPrev").onclick = () => {
  const eps = currentEpisodes();
  if (state.episodeIndex > 0 && eps.length) playEpisode(state.episodeIndex - 1);
  else advanceRing();
};
document.getElementById("btnNext").onclick = advanceRing;
document.getElementById("btnBack").onclick = () => {
  audio.currentTime = Math.max(0, audio.currentTime - JUMP_SECONDS);
};
document.getElementById("btnFwd").onclick = () => {
  audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + JUMP_SECONDS);
};

progressEl.onchange = () => {
  if (audio.duration) audio.currentTime = parseFloat(progressEl.value);
};

audio.addEventListener("loadedmetadata", () => {
  updateProgress();
  durTimeEl.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", () => {
  stopProgressLoop();
  clearSkipTimer();
  advanceRing();
});
audio.addEventListener("play", () => {
  renderEpisodes(currentEpisodes());
  startSkipTimer();
  logStatus("Playing", false);
});
audio.addEventListener("pause", () => {
  renderEpisodes(currentEpisodes());
  clearSkipTimer();
});
audio.addEventListener("error", () => {
  logStatus("Playback error. Trying next…");
  const eps = currentEpisodes();
  const nextIdx = (state.episodeIndex + 1) % eps.length;
  if (eps.length && nextIdx !== state.episodeIndex) {
    playEpisode(nextIdx);
  } else {
    advanceRing();
  }
});

// Boot
(async () => {
  loadDefaults();
  await loadManifest();
  buildRing();
  renderToggles();
  renderSkip();
  randomStart();
  await loadCurrent();
  initialized = true;
})();
