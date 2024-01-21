const { Op } = require("sequelize");

const { sequelize, Profile, Contract, Job } = require("../models");
const { ContractTypes } = require("../constants/constants");
const { validateDeposit } = require("../validators/deposit.validator");
const {
  validatePositiveNumber,
} = require("../validators/positive-number.validator");
const NoJobsToPayError = require("../errors/NoJobsToPayError");
const { NO_JOBS_TO_PAY_ERROR } = require("../constants/error-messages");

async function increaseProfileBalanceById(id, amount, t) {
  return await Profile.increment("balance", {
    by: amount,
    where: { id },
    t,
    lock: true,
  });
}

async function decreaseProfileBalanceById(id, amount, t) {
  return await Profile.decrement("balance", {
    by: amount,
    where: { id },
    t,
    lock: true,
  });
}

async function getAmountToPayByUserId(id, t) {
  const amountToPay = await Job.findOne({
    include: {
      model: Contract,
      where: {
        ClientId: id,
        status: {
          [Op.ne]: ContractTypes.TERMINATED,
        },
      },
    },
    attributes: [[sequelize.fn("sum", sequelize.col("price")), "amountToPay"]],
    where: {
      paid: null,
    },
    t,
    lock: true,
  });

  if (!amountToPay) {
    throw new NoJobsToPayError(NO_JOBS_TO_PAY_ERROR);
  }

  return amountToPay.dataValues;
}

async function depositMoney(userId, amount) {
  validatePositiveNumber(amount);

  return await sequelize.transaction(async (t) => {
    const { amountToPay } = await getAmountToPayByUserId(userId, t);
    validateDeposit(amountToPay, amount);

    await increaseProfileBalanceById(userId, amount, t);
  });
}

module.exports = {
  decreaseProfileBalanceById,
  increaseProfileBalanceById,
  depositMoney,
};
