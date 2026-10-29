(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE_KEY = "gyamfi-learning-hub-v1";
  const todayKey = () => new Date().toISOString().slice(0, 10);
  const emptyState = () => ({ sessions: {}, completedLessons: [], selectedCountry: "Ghana" });
  let state = loadState();
  let toastTimer;

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return stored && typeof stored === "object" ? { ...emptyState(), ...stored } : emptyState();
    } catch { return emptyState(); }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { showToast("Progress could not be saved on this device."); }
  }
  function dateKey(date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }
  function recentDates(count = 7) {
    const dates = [];
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  }
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }
  function streakLength() {
    const active = new Set(Object.keys(state.sessions).filter(key => Number(state.sessions[key]) > 0));
    let cursor = new Date();
    if (!active.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let count = 0;
    while (active.has(dateKey(cursor)) && count < 3650) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }
  function renderActivity() {
    const dates = recentDates(7);
    const active = new Set(Object.keys(state.sessions).filter(key => Number(state.sessions[key]) > 0));
    const totalMinutes = Object.values(state.sessions).reduce((sum, value) => sum + (Number(value) || 0), 0);
    const streak = streakLength();
    const todayMinutes = Number(state.sessions[todayKey()] || 0);
    const percent = Math.min(100, Math.round(todayMinutes / 15 * 100));
    $("#study-minutes").textContent = totalMinutes;
    $("#streak-count").textContent = streak;
    $("#aside-streak").textContent = streak;
    $("#lesson-count").textContent = state.completedLessons.length;
    $("#goal-percent").textContent = percent;
    $("#goal-progress").style.width = percent + "%";
    $("#active-days").textContent = dates.filter(d => active.has(dateKey(d))).length + " / 7 days";
    const dayLetters = ["S", "M", "T", "W", "T", "F", "S"];
    $("#week-days").innerHTML = dates.map(date => {
      const key = dateKey(date), done = active.has(key), today = key === todayKey();
      return '<span class="day-chip' + (done ? " done" : "") + (today ? " today" : "") + '"><b>' + (done ? "✓" : dayLetters[date.getDay()]) + '</b>' + date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2) + '</span>';
    }).join("");
    $("#streak-week").innerHTML = dates.map(date => {
      const key = dateKey(date), done = active.has(key), today = key === todayKey();
      return '<span class="streak-day' + (done ? " done" : "") + (today ? " today" : "") + '"><b>' + (done ? "✓" : "·") + '</b>' + dayLetters[date.getDay()] + '</span>';
    }).join("");
  }
  function renderDate() {
    const now = new Date();
    $("#date-label").textContent = now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    $("#today-label").textContent = now.toLocaleDateString(undefined, { weekday: "long" }).toUpperCase() + " · YOUR LEARNING SPACE";
    $("#year").textContent = now.getFullYear();
  }
  async function checkApi() {
    const dot = $("#api-dot"), label = $("#api-status-text");
    try {
      const response = await fetch("/api/health", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Service unavailable");
      const result = await response.json();
      dot.className = "online";
      label.textContent = result.status === "ok" ? "API connected" : "API responded";
    } catch {
      dot.className = "offline";
      label.textContent = "API unavailable";
    }
  }
  const viewMessages = {
    dashboard: ["Dashboard", "You're back at your learning dashboard."],
    courses: ["My learning", "Explore available learning subjects."],
    subjects: ["Subjects", "Choose your curriculum and education level."],
    videos: ["Video library", "Educational videos are listed separately from written lessons."],
    "ai-tutor": ["AI study buddy", "Ask a question; AI replies require a configured provider."],
    careers: ["Career pathways", "Career guidance stays independent of your selected curriculum country."],
    streaks: ["My streaks", "Your activity is saved locally on this device."]
  };
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  async function renderFeature(view) {
    const panel = $("#feature-view");
    const icon = {"courses":"fa-book-open","subjects":"fa-flask","videos":"fa-circle-play","ai-tutor":"fa-robot","careers":"fa-compass","streaks":"fa-fire"}[view] || "fa-book";
    panel.innerHTML = '<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</div>';
    if (view === "ai-tutor") {
      panel.innerHTML = '<div class="feature-header"><h1><i class="fa-solid fa-robot"></i> AI study buddy</h1><p>Ask a study question in your own words. The AI provider is not configured yet, so this page will not pretend to generate AI answers.</p></div><div class="feature-card"><label for="tutor-question"><strong>Your question</strong></label><form class="tutor-form" id="tutor-form"><input id="tutor-question" required maxlength="1000" placeholder="e.g. Explain oxidation and reduction simply"><button class="feature-action" type="submit"><i class="fa-solid fa-paper-plane"></i> Ask tutor</button></form><div id="tutor-response" class="feature-response hidden"></div><p class="feature-meta">Next backend step: securely configure an AI provider key on Vercel, never in browser JavaScript.</p></div>';
      $("#tutor-form").addEventListener("submit", e => { e.preventDefault(); const response = $("#tutor-response"); response.classList.remove("hidden"); response.textContent = "AI tutor is not connected yet. Your question was not sent anywhere. Once a server-side AI provider is configured, this form can return tutor explanations."; });
      return;
    }
    let endpoint = ({courses:"/api/courses",subjects:"/api/curriculum?country="+encodeURIComponent($("#country-select").value),videos:"/api/videos",careers:"/api/careers"})[view];
    if (view === "streaks") {
      panel.innerHTML = '<div class="feature-header"><h1><i class="fa-solid '+icon+'"></i> My streaks</h1><p>Your study activity on this device.</p></div><div class="feature-grid"><article class="feature-card"><div class="feature-icon"><i class="fa-solid fa-clock"></i></div><h3>'+$("#study-minutes").textContent+' study minutes</h3><p>Total minutes logged on this device.</p></article><article class="feature-card"><div class="feature-icon"><i class="fa-solid fa-fire"></i></div><h3>'+$("#streak-count").textContent+' day streak</h3><p>Log a study session from the dashboard to track your effort.</p><button class="feature-action" id="log-session-feature">Log 15-minute session</button></article></div>';
      $("#log-session-feature").addEventListener("click", recordStudySession);
      return;
    }
    try {
      const response = await fetch(endpoint, {headers:{Accept:"application/json"}});
      if (!response.ok) throw new Error("Request failed");
      const result = await response.json();
      const items = Array.isArray(result) ? result : (result.items || []);
      const title = viewMessages[view][0];
      panel.innerHTML = '<div class="feature-header"><h1><i class="fa-solid '+icon+'"></i> '+escapeHtml(title)+'</h1><p>'+escapeHtml(view === "subjects" ? "Selected curriculum: "+$("#country-select").value+". Career pathways are not affected by this setting." : viewMessages[view][1])+'</p></div>' +
        (items.length ? '<div class="feature-grid">'+items.map(item => '<article class="feature-card"><div class="feature-icon"><i class="fa-solid '+escapeHtml(item.icon || icon)+'"></i></div><div class="feature-meta">'+escapeHtml(item.level || item.category || item.status || "")+'</div><h3>'+escapeHtml(item.title || item.name)+'</h3><p>'+escapeHtml(item.description || item.summary || "")+'</p>'+(item.url ? '<a class="feature-action" href="'+escapeHtml(item.url)+'" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open resource</a>' : '')+'</article>').join("")+'</div>' : '<div class="feature-empty">No published items are available yet. Verified syllabus content will be added only after its source is reviewed.</div>');
    } catch {
      panel.innerHTML = '<div class="feature-header"><h1><i class="fa-solid '+icon+'"></i> '+escapeHtml(viewMessages[view][0])+'</h1></div><div class="feature-empty">The backend could not be reached. Check your connection and try again.</div><button class="feature-action" id="retry-feature"><i class="fa-solid fa-rotate"></i> Try again</button>';
      $("#retry-feature").addEventListener("click", () => renderFeature(view));
    }
  }
  function navigate(view) {
    const info = viewMessages[view] || viewMessages.dashboard;
    $("#breadcrumb-current").textContent = info[0];
    $$(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.view === view));
    $("#sidebar").classList.remove("open");
    const dashboard = view === "dashboard";
    $("#dashboard-content").classList.toggle("hidden", !dashboard);
    $("#feature-view").classList.toggle("hidden", dashboard);
    if (dashboard) $("#dashboard").scrollIntoView({behavior:"smooth",block:"start"});
    else { renderFeature(view); $("#feature-view").scrollIntoView({behavior:"smooth",block:"start"}); }
  }
  function recordStudySession() {
    const key = todayKey();
    state.sessions[key] = (Number(state.sessions[key]) || 0) + 15;
    saveState();
    renderActivity();
    showToast("Nice work! 15 study minutes added to your progress.");
  }
  $("#study-session").addEventListener("click", recordStudySession);
  $("#menu-toggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $$(".nav-link, [data-view]").forEach(link => link.addEventListener("click", event => {
    const view = link.dataset.view;
    if (!view) return;
    event.preventDefault();
    navigate(view);
  }));
  $$(".course-open").forEach(button => button.addEventListener("click", () => { navigate("courses"); }));
  $("#country-select").value = state.selectedCountry || "Ghana";
  $("#country-select").addEventListener("change", event => {
    state.selectedCountry = event.target.value;
    saveState();
    showToast(event.target.value + " curriculum selected. Career pathways remain country-independent.");
    if (!$("#feature-view").classList.contains("hidden") && $("#breadcrumb-current").textContent === "Subjects") renderFeature("subjects");
  });
  renderDate();
  renderActivity();
  checkApi();
})();