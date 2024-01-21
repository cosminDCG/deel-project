class JobNotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = JobNotFoundError;
