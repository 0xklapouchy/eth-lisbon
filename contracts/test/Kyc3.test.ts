import { waffle } from "hardhat";
import { expect } from "chai";

import Kyc3Artifact from "../artifacts/contracts/core/Kyc3.sol/Kyc3.json";

import { Kyc3 } from "../typechain";
import { Wallet } from "ethers";

const { provider, deployContract } = waffle;

describe("Kyc3 Module Tests", () => {
  const [deployer] = provider.getWallets() as Wallet[];
  let kyc3: Kyc3;

  beforeEach(async () => {
    kyc3 = (await deployContract(deployer, Kyc3Artifact, [])) as Kyc3;
  });

  describe("packKyc function", () => {
    it("should correctly pack kyc data", async () => {
      expect(
        await kyc3.packKyc("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd", 15, 33, 1666992943)
      ).to.be.equal(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd000000000000000000000000000000000000000000000000000000000000000f000000000000000000000000000000000000000000000000000000000000002100000000000000000000000000000000000000000000000000000000635c4b2f"
      );
    });

    it("should correctly pack kyc data with max values", async () => {
      expect(
        await kyc3.packKyc("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 255, 65535, 4294967295)
      ).to.be.equal(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000ff000000000000000000000000000000000000000000000000000000000000ffff00000000000000000000000000000000000000000000000000000000ffffffff"
      );
    });

    it("should revert when id != bytes32", async () => {
      await expect(kyc3.packKyc("0xff", 15, 33, 1666992943)).to.be.reverted;
    });

    it("should revert when age > uint8", async () => {
      await expect(
        kyc3.packKyc("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd", 256, 33, 1666992943)
      ).to.be.reverted;
    });

    it("should revert when country > uint16", async () => {
      await expect(
        kyc3.packKyc("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd", 15, 65536, 1666992943)
      ).to.be.reverted;
    });

    it("should revert when timestamp > uint32", async () => {
      await expect(
        kyc3.packKyc("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd", 256, 33, 4294967296)
      ).to.be.reverted;
    });
  });
});
