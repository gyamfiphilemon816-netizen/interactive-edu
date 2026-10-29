module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({ items: [
    { title: "Chemistry video lessons", category: "Chemistry", icon: "fa-flask", description: "A dedicated place for reviewed chemistry learning videos. Curated links will be added after review." },
    { title: "Biology video lessons", category: "Biology", icon: "fa-dna", description: "A dedicated place for biology videos with topic and level labels." },
    { title: "Mathematics walkthroughs", category: "Mathematics", icon: "fa-calculator", description: "A dedicated place for step-by-step mathematics videos and exam practice." }
  ]});
};
