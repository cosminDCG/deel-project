const express = require("express");
const router = express.Router();

const { getProfile } = require("../middleware/getProfile");
const {
  getContractById,
  getActiveContractsByUserId,
} = require("../services/contract.service");

router.get("/:id", getProfile, async (req, res) => {
  const { id } = req.params;
  const userProfileId = req.profile.id;

  const contract = await getContractById(userProfileId, id);

  if (!contract) {
    return res.sendStatus(404);
  }

  res.json(contract);
});

router.get("/", getProfile, async (req, res) => {
  const userProfileId = req.profile.id;

  const contracts = await getActiveContractsByUserId(userProfileId);

  res.json(contracts);
});

module.exports = router;
