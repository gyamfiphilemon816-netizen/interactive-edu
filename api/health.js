// Vercel Node.js serverless function. Keep secrets out of client-side code.
module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({
    status: "ok",
    service: "gyamfi-learning-hub-api",
    timestamp: new Date().toISOString(),
    note: "Health check only; learning data APIs are not yet connected."
  });
};