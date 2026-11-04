const STORAGE_KEY = "langplayer:v1";
const DEFAULT_SKIP_MINUTES = 3;
const JUMP_SECONDS = 10;
const MAX_PLAY_RETRIES = 2;
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
const playIconEl = document.getElementById("playIcon");

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
let retryAttempts = 0;
let autoplayWanted = false;
let lastFailedSrc = null;

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

async function loadCurrent(autoplay = true) {
  const eps = currentEpisodes();
  if (!eps.length) {
    logStatus("No episodes for " + currentLang().name);
    renderEpisodes([]);
    return;
  }
  if (state.episodeIndex >= eps.length) state.episodeIndex = 0;
  save();
  renderEpisodes(eps);
  playEpisode(state.episodeIndex, autoplay);
}

function playEpisode(index, autoplay = true) {
  const eps = currentEpisodes();
  if (!eps.length) return;
  if (index < 0 || index >= eps.length) index = 0;
  state.episodeIndex = index;
  retryAttempts = 0;
  autoplayWanted = autoplay;
  lastFailedSrc = null;
  save();
  const ep = eps[index];
  npLangEl.textContent = currentLang().name;
  npTitleEl.textContent = ep.title;
  npSourceEl.textContent = ep.source;
  audio.src = ep.audio;
  renderEpisodes(eps);
  updatePlayIcon();
  startProgressLoop();
  if (autoplay) {
    requestPlay();
  } else {
    logStatus("Ready — press play");
  }
}

function requestPlay() {
  if (!autoplayWanted) lastFailedSrc = null;
  autoplayWanted = true;
  audio.play().catch((e) => {
    if (e.name === "NotAllowedError") {
      autoplayWanted = false;
      logStatus("Press play to start (the browser blocked autoplay).");
      updatePlayIcon();
      return;
    }
    if (e.name === "AbortError") return;
    handlePlaybackFailure(e);
  });
}

function handlePlaybackFailure(reason) {
  const src = audio.currentSrc || audio.src;
  if (src && src === lastFailedSrc) return;
  lastFailedSrc = src;

  if (!autoplayWanted) {
    logStatus("Audio unavailable. Try another episode.");
    updatePlayIcon();
    return;
  }

  if (retryAttempts < MAX_PLAY_RETRIES) {
    retryAttempts++;
    logStatus("Playback failed. Retrying (" + retryAttempts + "/" + MAX_PLAY_RETRIES + ")…", true);
    const ep = currentEpisodes()[state.episodeIndex];
    if (!ep) {
      skipToNext();
      return;
    }
    const sep = ep.audio.indexOf("?") === -1 ? "?" : "&";
    audio.src = ep.audio + sep + "retry=" + retryAttempts + "&t=" + Date.now();
    requestPlay();
    return;
  }

  retryAttempts = 0;
  logStatus("Playback failed. Skipping to the next episode…");
  skipToNext();
}

function skipToNext() {
  const eps = currentEpisodes();
  if (eps.length > 1) {
    playEpisode((state.episodeIndex + 1) % eps.length, true);
  } else {
    advanceRing();
  }
}

function updatePlayIcon() {
  const playing = !audio.paused;
  playIconEl.src = playing ? "icons/pause.png" : "icons/play.png";
  playIconEl.alt = playing ? "Pause" : "Play";
  document.getElementById("btnPlay").setAttribute("aria-label", playing ? "Pause" : "Play");
}

function togglePlay() {
  if (audio.paused) {
    requestPlay();
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
  const currentCode = currentLang() ? currentLang().code : null;
  state.enabled[cb.value] = cb.checked;
  buildRing();

  const keepIndex = ring.findIndex((l) => l.code === currentCode);
  if (keepIndex >= 0) {
    state.langIndex = keepIndex;
    save();
    renderToggles();
    return;
  }

  state.langIndex = 0;
  state.episodeIndex = 0;
  save();
  renderToggles();
  if (ring.length > 0) loadCurrent(false);
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
  const playingIndex = audio.paused ? -1 : state.episodeIndex;
  list.forEach((ep, i) => {
    const isPlaying = i === playingIndex;
    const div = document.createElement("div");
    div.className = "episode-item" + (i === state.episodeIndex ? " active" : "");
    div.innerHTML =
      '<span class="ep-num">' + (i + 1) + ".</span>" +
      '<span class="ep-title">' + escapeHtml(ep.title) + "</span>" +
      '<span class="ep-dur">' + (ep.desc ? escapeHtml(truncate(ep.desc, 60)) : "") + "</span>" +
      '<button class="ep-play" aria-label="' + (isPlaying ? "Pause" : "Play") + ' episode">' +
      '<img src="icons/' + (isPlaying ? "pause" : "play") + '.png" alt="" /></button>';
    div.onclick = (e) => {
      if (e.target.closest("button")) {
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
  loadCurrent(false);
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
  retryAttempts = 0;
  autoplayWanted = true;
  lastFailedSrc = null;
  renderEpisodes(currentEpisodes());
  updatePlayIcon();
  startSkipTimer();
  logStatus("Playing", false);
});
audio.addEventListener("pause", () => {
  renderEpisodes(currentEpisodes());
  updatePlayIcon();
  clearSkipTimer();
});
audio.addEventListener("error", () => {
  handlePlaybackFailure(audio.error);
});

// Boot
(async () => {
  loadDefaults();
  await loadManifest();
  buildRing();
  renderToggles();
  renderSkip();
  await loadCurrent(false);
  initialized = true;
})();
