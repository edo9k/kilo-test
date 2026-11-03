const STORAGE_KEY = "langplayer:v1";
const DEFAULT_SKIP_MINUTES = 3;
const JUMP_SECONDS = 10;

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

const FEEDS = {
  en: [
    { name: "NPR News Now", url: "https://feeds.npr.org/1001/rss.xml" },
    { name: "BBC Global News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "AP News", url: "https://feeds.apnews.com/rss/apf-topnews" },
  ],
  zh: [
    { name: "BBC Chinese", url: "http://feeds.bbci.co.uk/chinese/rss.xml" },
    { name: "CGTN", url: "https://twitter.com/cgtnofficial/rss" },
  ],
  hi: [
    { name: "BBC Hindi", url: "http://feeds.bbci.co.uk/hindi/rss.xml" },
  ],
  es: [
    { name: "BBC Mundo", url: "http://feeds.bbci.co.uk/mundo/rss.xml" },
    { name: "CNN en Español", url: "https://rss.cnn.com/rss/cnn_espanol.rss" },
  ],
  fr: [
    { name: "BBC French", url: "http://feeds.bbci.co.uk/french/rss.xml" },
    { name: "RFI French", url: "https://www.rfi.fr/fr/rss" },
  ],
  ar: [
    { name: "BBC Arabic", url: "http://feeds.bbci.co.uk/arabic/rss.xml" },
  ],
  bn: [
    { name: "BBC Bengali", url: "http://feeds.bbci.co.uk/bengali/rss.xml" },
  ],
  pt: [
    { name: "BBC Portuguese", url: "http://feeds.bbci.co.uk/portuguese/rss.xml" },
  ],
  ru: [
    { name: "BBC Russian", url: "http://feeds.bbci.co.uk/russian/rss.xml" },
  ],
  ur: [
    { name: "BBC Urdu", url: "http://feeds.bbci.co.uk/urdu/rss.xml" },
  ],
  id: [
    { name: "BBC Indonesian", url: "http://feeds.bbci.co.uk/indonesian/rss.xml" },
  ],
  ko: [
    { name: "Yonhap News", url: "https://www.yna.co.kr/rss/news.xml" },
    { name: "Yonhap Politics", url: "https://www.yna.co.kr/rss/politics.xml" },
    { name: "Yonhap Economy", url: "https://www.yna.co.kr/rss/economy.xml" },
  ],
  it: [
    { name: "ANSA Notizie", url: "https://www.ansa.it/sito/ansait_rss.xml" },
    { name: "ANSA Ultima Ora", url: "https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml" },
    { name: "ANSA Europa", url: "https://www.ansa.it/europa/notizie/rss.xml" },
  ],
};

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
let episodes = [];
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
  // Default all enabled
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
  ring = LANG_ORDER.filter((l) => state.enabled[l.code]);
  if (ring.length === 0) {
    LANG_ORDER.forEach((l) => (state.enabled[l.code] = true));
    ring = [...LANG_ORDER];
    save();
  }
  // Clamp indices
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

function currentFeed() {
  const lang = currentLang();
  const feeds = FEEDS[lang.code] || [];
  return feeds.length ? feeds[0] : null;
}

function proxyUrl(url) {
  return "https://corsproxy.io/?url=" + encodeURIComponent(url);
}

async function fetchRSS(url) {
  let lastErr;
  const attempts = [url, proxyUrl(url)];
  for (const u of attempts) {
    try {
      const res = await fetch(u, { headers: { Accept: "application/xml, text/xml, */*" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      if (!text.trim()) throw new Error("Empty response");
      return text;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function parseRSS(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  const parseErr = doc.querySelector("parsererror");
  if (parseErr) throw new Error("Invalid XML");
  const items = doc.querySelectorAll("channel > item");
  const out = [];
  items.forEach((item) => {
    const enc = item.querySelector("enclosure");
    if (!enc) return;
    const url = enc.getAttribute("url");
    if (!url) return;
    const title = item.querySelector("title")?.textContent?.trim() || "Untitled";
    const desc = item.querySelector("description")?.textContent?.trim() || "";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() || "";
    const guid = item.querySelector("guid")?.textContent?.trim() || url;
    const img =
      item.querySelector("itunes\\:image")?.getAttribute("href") ||
      item.querySelector("itunes:image")?.getAttribute("href") ||
      doc.querySelector("channel > itunes\\:image")?.getAttribute("href") ||
      doc.querySelector("channel > itunes:image")?.getAttribute("href");
    out.push({ title, desc, url, pubDate, guid, image: img });
  });
  return out;
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
    episodeListEl.innerHTML = '<div class="empty">No episodes found for this language.</div>';
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

function setNowPlaying(ep) {
  npLangEl.textContent = currentLang().name;
  npTitleEl.textContent = escapeHtml(ep.title);
  npSourceEl.textContent = currentFeed().name;
  document.getElementById("npArt").textContent = "&#127928;";
}

async function loadCurrent() {
  const feed = currentFeed();
  if (!feed) {
    logStatus("No feed configured for " + currentLang().name);
    renderEpisodes([]);
    return;
  }
  logStatus("Loading " + currentLang().name + "…", true);
  try {
    const xml = await fetchRSS(feed.url);
    episodes = parseRSS(xml);
    if (episodes.length === 0) {
      logStatus("No audio episodes in feed");
      renderEpisodes([]);
      return;
    }
    // Clamp episode index
    if (state.episodeIndex >= episodes.length) state.episodeIndex = 0;
    save();
    renderEpisodes(episodes);
    playEpisode(state.episodeIndex);
  } catch (e) {
    logStatus("Failed to load feed: " + escapeHtml(e.message));
    renderEpisodes([]);
  }
}

function playEpisode(index) {
  if (!episodes.length) return;
  state.episodeIndex = index;
  save();
  const ep = episodes[index];
  setNowPlaying(ep);
  audio.src = ep.url;
  audio.play().catch((e) => {
    logStatus("Playback blocked: " + escapeHtml(e.message));
  });
  renderEpisodes(episodes);
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
  renderEpisodes(episodes);
}

function advanceRing() {
  if (ring.length === 0) return;
  state.langIndex = (state.langIndex + 1) % ring.length;
  state.episodeIndex = 0;
  save();
  loadCurrent();
}

function formatHMS(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const parts = [];
  if (h > 0) parts.push(h);
  parts.push(m);
  parts.push(String(sec).padStart(2, "0"));
  return parts.join(":");
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
  if (state.episodeIndex > 0) playEpisode(state.episodeIndex - 1);
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
  renderEpisodes(episodes);
  startSkipTimer();
  logStatus("Playing", false);
});
audio.addEventListener("pause", () => {
  renderEpisodes(episodes);
  clearSkipTimer();
});
audio.addEventListener("error", () => {
  logStatus("Playback error. Trying next…");
  const nextIdx = (state.episodeIndex + 1) % episodes.length;
  if (nextIdx !== state.episodeIndex) {
    playEpisode(nextIdx);
  } else {
    advanceRing();
  }
});

// Boot
loadDefaults();
buildRing();
renderToggles();
renderSkip();
randomStart();
loadCurrent();
initialized = true;
