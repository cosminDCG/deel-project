const { Op } = require("sequelize");

const { sequelize, Profile, Contract, Job } = require("../models");
const { ContractTypes } = require("../constants/constants");
const {
  increaseProfileBalanceById,
  decreaseProfileBalanceById,
} = require("../services/profile.service");
const JobNotFoundError = require("../errors/JobNotFoundError");
const {
  JOB_NOT_FOUND_ERROR,
  LOW_BALANCE_ERROR,
  CONTRACTOR_NOT_FOUND_ERROR,
} = require("../constants/error-messages");
const LowBalanceError = require("../errors/LowBalanceError");
const ContractorNotFoundError = require("../errors/ContractorNotFoundError");

async function getAllUnpaidJobs(profileId) {
  return await Job.findAll({
    include: [
      {
        model: Contract,
        where: {
          status: ContractTypes.IN_PROGRESS,
          [Op.or]: [
            {
              ContractorId: profileId,
            },
            {
              ClientId: profileId,
            },
          ],
        },
      },
    ],
    where: {
      paid: null,
    },
  });
}

async function getJobById(id, profileId, t) {
  return await Job.findOne({
    include: [
      {
        model: Contract,
        where: {
          ClientId: profileId,
        },
      },
    ],
    where: {
      id,
      paid: null,
    },
    t,
    lock: true,
  });
}

async function findContractorByContractId(contractId, t) {
  return await Profile.findOne({
    include: {
      model: Contract,
      as: "Contractor",
      where: {
        id: contractId,
      },
    },
    t,
    lock: true,
  });
}

async function markJobAsPaid(id, t) {
  return await Job.update(
    {
      paid: true,
      paymentDate: new Date(),
    },
    { where: { id }, t, lock: true }
  );
}

async function payJob(id, profile) {
  return await sequelize.transaction(async (t) => {
    const job = await getJobById(id, profile.id, t);

    if (!job) {
      throw new JobNotFoundError(JOB_NOT_FOUND_ERROR);
    }

    if (profile.balance < job.price) {
      throw new LowBalanceError(LOW_BALANCE_ERROR);
    }

    const contractor = await findContractorByContractId(job.ContractId, t);

    if (!contractor) {
      throw new ContractorNotFoundError(CONTRACTOR_NOT_FOUND_ERROR);
    }

    await decreaseProfileBalanceById(profile.id, job.price, t);

    await markJobAsPaid(job.id, t);

    await increaseProfileBalanceById(profile.id, job.price, t);
  });
}

module.exports = {
  getAllUnpaidJobs,
  payJob,
};
