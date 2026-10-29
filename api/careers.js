module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({ items: [
    { title: "Health and medicine", category: "Health sciences", icon: "fa-heart-pulse", description: "Explore biology, chemistry, communication, and patient-care skills." },
    { title: "Engineering and technology", category: "STEM", icon: "fa-gears", description: "Explore mathematics, physics, design, computing, and practical problem-solving." },
    { title: "Education", category: "Teaching and learning", icon: "fa-chalkboard-user", description: "Explore subject expertise, communication, lesson planning, and mentoring." },
    { title: "Business and finance", category: "Business", icon: "fa-chart-line", description: "Explore numeracy, economics, teamwork, planning, and decision-making." },
    { title: "Creative industries", category: "Arts and media", icon: "fa-palette", description: "Explore design, storytelling, digital media, and portfolio development." },
    { title: "Agriculture and environment", category: "Environment", icon: "fa-seedling", description: "Explore biology, sustainability, food systems, and environmental science." }
  ]});
};
