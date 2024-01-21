const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const { getProfile } = require("./middleware/getProfile");

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

const contractController = require("./controllers/contract.controller");
const jobController = require("./controllers/job.controller");
const balanceController = require("./controllers/balance.controller");
const adminController = require("./controllers/admin.controller");

app.use("/contracts", contractController);
app.use("/jobs", jobController);
app.use("/balances", balanceController);
app.use("/admin", adminController);

module.exports = app;
