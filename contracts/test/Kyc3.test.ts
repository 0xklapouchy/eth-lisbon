import { waffle } from "hardhat";
import { expect } from "chai";

import Kyc3MockArtifact from "../artifacts/contracts/mocks/Kyc3Mock.sol/Kyc3Mock.json";

import { Kyc3Mock } from "../typechain";
import { Wallet, BigNumber } from "ethers";

import { latest, injectKycData, duration } from "./utilities";

const { provider, deployContract } = waffle;

// Error codes
const Error_Age: string = "Error_Age()";
const Error_Country: string = "Error_Country()";
const Error_Timestamp: string = "Error_Timestamp()";

describe("Kyc3 Module Tests", () => {
  const [deployer, user, signer] = provider.getWallets() as Wallet[];
  let kyc3mock: Kyc3Mock;
  let now: BigNumber;

  describe("getKycData function", () => {
    beforeEach(async () => {
      kyc3mock = (await deployContract(deployer, Kyc3MockArtifact, [])) as Kyc3Mock;
      await kyc3mock.addSigner(signer.address);
      now = await latest();
    });

    it("should work correctly", async () => {
      const id = "0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd";
      const age = 22;
      const country = 34;
      const timestamp = now.add(duration.minutes(5)).toNumber();

      const unsignedTx = await injectKycData(
        await kyc3mock.connect(user).populateTransaction.example(100, "0x0000000000000000000000000000000000000009"),
        id,
        age,
        country,
        timestamp,
        signer
      );

      await expect(user.sendTransaction(unsignedTx)).to.not.be.reverted;
    });

    it("should revert when age < 22", async () => {
      const id = "0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd";
      const age = 12;
      const country = 34;
      const timestamp = now.add(duration.minutes(5)).toNumber();

      const unsignedTx = await injectKycData(
        await kyc3mock.connect(user).populateTransaction.example(100, "0x0000000000000000000000000000000000000009"),
        id,
        age,
        country,
        timestamp,
        signer
      );

      await expect(user.sendTransaction(unsignedTx)).to.be.revertedWith(Error_Age);
    });

    it("should revert when country == 33", async () => {
      const id = "0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd";
      const age = 23;
      const country = 33;
      const timestamp = now.add(duration.minutes(5)).toNumber();

      const unsignedTx = await injectKycData(
        await kyc3mock.connect(user).populateTransaction.example(100, "0x0000000000000000000000000000000000000009"),
        id,
        age,
        country,
        timestamp,
        signer
      );

      await expect(user.sendTransaction(unsignedTx)).to.be.revertedWith(Error_Country);
    });

    it("should revert when timestamp to old", async () => {
      const id = "0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd";
      const age = 23;
      const country = 4;
      const timestamp = now.sub(duration.hours(6)).toNumber();

      const unsignedTx = await injectKycData(
        await kyc3mock.connect(user).populateTransaction.example(100, "0x0000000000000000000000000000000000000009"),
        id,
        age,
        country,
        timestamp,
        signer
      );

      await expect(user.sendTransaction(unsignedTx)).to.be.revertedWith(Error_Timestamp);
    });
  });
});
