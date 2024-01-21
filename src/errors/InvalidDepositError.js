class InvalidDepositError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = InvalidDepositError;
