var express = require("express");
var router = express.Router();

const { depositMoney } = require("../services/profile.service");

router.post("/deposit/:userId", async (req, res) => {
  const { userId } = req.params;
  let { amount } = req.body;

  depositAmount = Number(amount);

  try {
    await depositMoney(userId, amount);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
