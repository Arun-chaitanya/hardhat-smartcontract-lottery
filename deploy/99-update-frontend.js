const { ethers, network } = require("hardhat");
const fs = require("fs");

require("dotenv").config();

const FRONT_END_ADDRESSES_FILE = "../nextjs-smartcontract-lottery/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery/constants/abi.json";
module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating frontend ...");
    updateContractAddress();
    updateContractAbi();
  }
};

async function updateContractAbi() {
  const raffle = ethers.getContract("Raffle");
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    (await raffle).interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddress() {
  const raffle = ethers.getContract("Raffle");
  const chainId = network.config.chainId.toString();
  const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8"));
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes((await raffle).address)) {
      currentAddresses[chainId].push((await raffle).address);
    }
  } else {
    currentAddresses[chainId] = [(await raffle).address];
  }
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

module.exports.tags = ["all", "frontend"];
