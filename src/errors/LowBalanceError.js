class LowBalanceError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = LowBalanceError;
