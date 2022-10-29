import { waffle } from "hardhat";
import { expect } from "chai";

import Whitelist3Artifact from "../artifacts/contracts/core/Whitelist3.sol/Whitelist3.json";

import { Whitelist3 } from "../typechain";
import { Wallet } from "ethers";

const { provider, deployContract } = waffle;

describe("Whitelist3 Module Tests", () => {
  const [deployer] = provider.getWallets() as Wallet[];
  let whitelist3: Whitelist3;

  beforeEach(async () => {
    whitelist3 = (await deployContract(deployer, Whitelist3Artifact, [])) as Whitelist3;
  });

  describe("getWhitelistedData function", () => {});
});
