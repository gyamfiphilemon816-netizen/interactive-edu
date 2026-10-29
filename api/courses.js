module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({ items: [
    { title: "Chemistry", level: "SHS · Ghana", category: "Science", icon: "fa-flask", description: "Topic-based chemistry learning and WASSCE preparation. Full verified lessons are not published yet." },
    { title: "Biology", level: "SHS · Ghana", category: "Life science", icon: "fa-dna", description: "Explore living systems and biological concepts. Full verified lessons are not published yet." },
    { title: "Core Mathematics", level: "SHS · Ghana", category: "Mathematics", icon: "fa-calculator", description: "Build problem-solving skills through guided practice. Full verified lessons are not published yet." }
  ]});
};
