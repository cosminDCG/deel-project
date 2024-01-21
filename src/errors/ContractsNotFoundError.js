class ContractsNotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = ContractsNotFoundError;
