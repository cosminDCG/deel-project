class BestClientsNotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = BestClientsNotFoundError;
