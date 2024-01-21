class NoJobsToPayError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = NoJobsToPayError;
