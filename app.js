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
    courses: ["My learning", "Choose a subject to start exploring. Official syllabus mapping is being built."],
    subjects: ["Subjects", "Subject libraries will be organized by your selected country and education level."],
    videos: ["Video library", "The video library will keep educational videos separate from written lessons."],
    "ai-tutor": ["AI study buddy", "AI tutoring will be connected to a secure server-side provider when configured."],
    careers: ["Career pathways", "Explore a direction that interests you. Career guidance will not change when you switch curriculum country."],
    streaks: ["My streaks", "Your activity below is saved locally on this device."]
  };
  function navigate(view) {
    const info = viewMessages[view] || viewMessages.dashboard;
    $("#breadcrumb-current").textContent = info[0];
    $$(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.view === view));
    $("#sidebar").classList.remove("open");
    if (view !== "dashboard") showToast(info[1]);
    if (view === "courses" || view === "subjects") $("#courses-heading").textContent = view === "subjects" ? "Explore subjects" : "Explore your learning";
    if (view === "videos" || view === "ai-tutor" || view === "careers" || view === "streaks") {
      const target = view === "careers" ? $(".career-card") : view === "streaks" ? $(".streak-card") : view === "videos" ? $(".course-grid") : $(".content-grid");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      $("#dashboard").scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
  $$(".course-open").forEach(button => button.addEventListener("click", () => {
    const course = button.dataset.course;
    if (!state.completedLessons.includes(course)) {
      state.completedLessons.push(course);
      saveState();
      renderActivity();
    }
    showToast(course + " selected. Verified lessons will be added as curriculum content is reviewed.");
  }));
  $("#country-select").value = state.selectedCountry || "Ghana";
  $("#country-select").addEventListener("change", event => {
    state.selectedCountry = event.target.value;
    saveState();
    showToast(event.target.value + " curriculum selected. Career pathways remain country-independent.");
    // Never imply a curriculum has been verified when its official mapping is not yet available.
    if (event.target.value !== "Ghana") showToast(event.target.value + " selected. Verified curriculum content for this country is not yet available.");
  });
  renderDate();
  renderActivity();
  checkApi();
})();