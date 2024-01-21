class ContractorNotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = ContractorNotFoundError;
