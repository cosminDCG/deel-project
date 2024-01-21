const {
  MANDATORY_DATE_PARAMETERS_ERROR,
  INVALID_DATE_INTERVAL_ERROR,
} = require("../constants/error-messages");
const InvalidDateIntervalError = require("../errors/InvalidDateIntervalError");
const MandatoryDateParametersError = require("../errors/MandatoryDateParametersError");

function validateDateInterval(start, end) {
  if (!start || !end) {
    throw new MandatoryDateParametersError(MANDATORY_DATE_PARAMETERS_ERROR);
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate.getTime() > endDate.getTime()) {
    throw new InvalidDateIntervalError(INVALID_DATE_INTERVAL_ERROR);
  }
}

module.exports = {
  validateDateInterval,
};
