const { Op } = require("sequelize");
const { ContractTypes } = require("../constants/constants");

const { CONTRACTS_NOT_FOUND_ERROR } = require("../constants/error-messages");
const ContractsNotFoundError = require("../errors/ContractsNotFoundError");
const { Contract, Job } = require("../models");

async function getContractById(profileId, contractId) {
  return await Contract.findOne({
    where: {
      id: contractId,
      [Op.or]: [
        {
          ContractorId: profileId,
        },
        {
          ClientId: profileId,
        },
      ],
    },
  });
}

async function getActiveContractsByUserId(profileId) {
  const contracts = await Contract.findAll({
    include: [
      {
        model: Job,
        as: "Jobs",
      },
    ],
    where: {
      status: {
        [Op.ne]: ContractTypes.TERMINATED,
      },
      [Op.or]: [
        {
          ContractorId: profileId,
        },
        { ClientId: profileId },
      ],
    },
  });

  if (!contracts.length) {
    throw new ContractsNotFoundError(CONTRACTS_NOT_FOUND_ERROR);
  }

  return contracts;
}

module.exports = {
  getContractById,
  getActiveContractsByUserId,
};
