const express = require("express");
const router = express.Router();

const { getProfile } = require("../middleware/getProfile");
const { getAllUnpaidJobs, payJob } = require("../services/job.service");

router.get("/unpaid", getProfile, async (req, res) => {
  const userProfileId = req.profile.id;

  try {
    const unpaidJobs = await getAllUnpaidJobs(userProfileId);
    res.json(unpaidJobs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/:job_id/pay", getProfile, async (req, res) => {
  const { job_id } = req.params;
  const { profile } = req;

  try {
    await payJob(job_id, profile);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
