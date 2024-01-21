const {
  getContractById,
  getActiveContractsByUserId,
} = require("./contract.service");
const { Op } = require("sequelize");

const { Contract, Job } = require("../models");
const { ContractTypes } = require("../constants/constants");

// mock the sequelize models with jest
jest.mock("../models", () => {
  return {
    Contract: {
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
    Job: {},
  };
});

describe("getContractById", () => {
  it("should call findOne method only once with parameters", async () => {
    jest.spyOn(Contract, "findOne");

    await getContractById(1, 1);

    expect(Contract.findOne).toHaveBeenCalledTimes(1);
    expect(Contract.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
        [Op.or]: [
          {
            ContractorId: 1,
          },
          {
            ClientId: 1,
          },
        ],
      },
    });
  });
});

describe("getActiveContractsByUserId", () => {
  it("should call findAll method only once with parameters", async () => {
    jest
      .spyOn(Contract, "findAll")
      .mockImplementation(() => Promise.resolve([{}]));

    await getActiveContractsByUserId(1);

    expect(Contract.findAll).toHaveBeenCalledTimes(1);
    expect(Contract.findAll).toHaveBeenCalledWith({
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
            ContractorId: 1,
          },
          {
            ClientId: 1,
          },
        ],
      },
    });
  });
});
