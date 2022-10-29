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

  describe("packWhitelist function", () => {
    it("should correctly pack whitelist data", async () => {
      expect(
        await whitelist3.packWhitelist("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd", 1666992943)
      ).to.be.equal(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd00000000000000000000000000000000000000000000000000000000635c4b2f"
      );
    });

    it("should correctly pack whitelist data with max values", async () => {
      expect(
        await whitelist3.packWhitelist("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 4294967295)
      ).to.be.equal(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000ffffffff"
      );
    });

    it("should revert when id != bytes32", async () => {
      await expect(whitelist3.packWhitelist("0xff", 1666992943)).to.be.reverted;
    });

    it("should revert when timestamp > uint32", async () => {
      await expect(
        whitelist3.packWhitelist("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd", 4294967296)
      ).to.be.reverted;
    });
  });
});
