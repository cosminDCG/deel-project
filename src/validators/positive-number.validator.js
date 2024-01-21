const {
  INVALID_POSITIVE_NUMBER_ERROR,
} = require("../constants/error-messages");
const InvalidPositiveNumberError = require("../errors/InvalidPositiveNumberError");

function validatePositiveNumber(numberToValidate) {
  if (isNaN(numberToValidate) || numberToValidate <= 0) {
    throw new InvalidPositiveNumberError(INVALID_POSITIVE_NUMBER_ERROR);
  }
}

module.exports = {
  validatePositiveNumber,
};
