module.exports = function handler(req, res) {
  const country = String((req.query && req.query.country) || "Ghana");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (country.toLowerCase() !== "ghana") {
    return res.status(200).json({ country, verified: false, items: [], message: "Official curriculum sources for this country have not yet been reviewed." });
  }
  return res.status(200).json({ country: "Ghana", verified: false, items: [
    { title: "Primary 1–6", level: "Basic education", icon: "fa-child", description: "Curriculum mapping is planned; official syllabus coverage is not yet verified." },
    { title: "JHS", level: "Junior high school", icon: "fa-school", description: "Official subject-by-subject syllabus mapping is being prepared." },
    { title: "SHS / WASSCE", level: "Senior high school", icon: "fa-graduation-cap", description: "WASSCE-aligned lessons will be published after source review." },
    { title: "University", level: "Higher education", icon: "fa-building-columns", description: "University-level resources will be added by subject and institution." }
  ], message: "Level roadmap only; not a verified syllabus." });
};
