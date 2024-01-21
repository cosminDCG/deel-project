const { INVALID_DEPOSIT_ERROR } = require("../constants/error-messages");
const InvalidDepositError = require("../errors/InvalidDepositError");

function validateDeposit(amountToPay, depositAmount) {
  const maxDeposit = amountToPay * 0.25;

  if (depositAmount > maxDeposit) {
    throw new InvalidDepositError(INVALID_DEPOSIT_ERROR + maxDeposit);
  }
}

module.exports = {
  validateDeposit,
};
