const { Op } = require("sequelize");

const { sequelize, Profile, Contract, Job } = require("../models");
const { ProfileTypes } = require("../constants/constants");
const {
  validateDateInterval,
} = require("../validators/date-interval.validator");

const BestClientsNotFoundError = require("../errors/BestClientNotFoundError");
const BestProfessionNotFoundError = require("../errors/BestProfessionNotFoundError");
const {
  BEST_CLIENTS_NOT_FOUND_ERROR,
  BEST_PROFESSION_NOT_FOUND_ERROR,
} = require("../constants/error-messages");

async function getBestProfessionInInterval(start, end) {
  validateDateInterval(start, end);

  const bestProfession = await Profile.findOne({
    subQuery: false,
    where: {
      type: ProfileTypes.CONTRACTOR,
    },
    group: "profession",
    order: sequelize.literal("`Contractor.Jobs.paidAmount` DESC"),
    include: [
      {
        model: Contract,
        as: "Contractor",
        required: true,
        include: {
          model: Job,
          required: true,
          where: {
            paid: true,
            createdAt: {
              [Op.gte]: new Date(start).toISOString(),
              [Op.lte]: new Date(end).toISOString(),
            },
          },
          attributes: [
            "ContractId",
            [sequelize.fn("sum", sequelize.col("price")), "paidAmount"],
          ],
          group: "ContractId",
        },
      },
    ],
  });

  if (!bestProfession) {
    throw new BestProfessionNotFoundError(BEST_PROFESSION_NOT_FOUND_ERROR);
  }

  return {
    profession: bestProfession.profession,
    amount: bestProfession.Contractor[0].Jobs[0].dataValues.paidAmount,
  };
}

async function getBestClientsInInterval(start, end, limit = 2) {
  validateDateInterval(start, end);

  const bestClients = await Profile.findAll({
    limit,
    subQuery: false,
    where: {
      type: ProfileTypes.CLIENT,
    },
    group: "Profile.id",
    order: sequelize.literal("`Client.Jobs.totalAmount` DESC"),
    include: [
      {
        model: Contract,
        as: "Client",
        required: true,
        include: {
          model: Job,
          required: true,
          where: {
            paid: true,
            createdAt: {
              [Op.gte]: new Date(start).toISOString(),
              [Op.lte]: new Date(end).toISOString(),
            },
          },
          attributes: [
            "ContractId",
            [sequelize.fn("sum", sequelize.col("price")), "totalAmount"],
          ],
          group: "ContractId",
        },
      },
    ],
  });

  if (!bestClients.length) {
    throw new BestClientsNotFoundError(BEST_CLIENTS_NOT_FOUND_ERROR);
  }

  return bestClients.map((bc) => {
    return {
      id: bc.id,
      fullName: bc.fullName,
      paid: bc.Client[0].Jobs[0].dataValues.totalAmount,
    };
  });
}

module.exports = {
  getBestProfessionInInterval,
  getBestClientsInInterval,
};
