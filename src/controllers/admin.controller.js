var express = require("express");
var router = express.Router();

const {
  getBestProfessionInInterval,
  getBestClientsInInterval,
} = require("../services/admin.service");

router.get("/best-profession", async (req, res) => {
  const { start, end } = req.query;

  try {
    const bestProfession = await getBestProfessionInInterval(start, end);
    res.status(200).json(bestProfession);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/best-clients", async (req, res) => {
  const { start, end, limit } = req.query;

  const inputLimit = limit ? Number(limit) : undefined;

  try {
    const bestClients = await getBestClientsInInterval(start, end, inputLimit);
    return res.status(200).json(bestClients);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
