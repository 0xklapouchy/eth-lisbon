import { waffle } from "hardhat";
import { expect } from "chai";

import Whitelist3MockArtifact from "../artifacts/contracts/mocks/Whitelist3Mock.sol/Whitelist3Mock.json";

import { Whitelist3Mock } from "../typechain";
import { Wallet, BigNumber } from "ethers";

import { latest, injectWhitelistData, duration } from "./utilities";

const { provider, deployContract } = waffle;

// Error codes
const Error_Timestamp: string = "Error_Timestamp()";

describe("Whitelist3 Module Tests", () => {
  const [deployer, user, signer] = provider.getWallets() as Wallet[];
  let whitelist3mock: Whitelist3Mock;
  let now: BigNumber;

  describe("getWhitelistedData function", () => {
    beforeEach(async () => {
      whitelist3mock = (await deployContract(deployer, Whitelist3MockArtifact, [])) as Whitelist3Mock;
      await whitelist3mock.addSigner(signer.address);
      now = await latest();
    });

    it("should work correctly", async () => {
      const id = "0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd";
      const timestamp = now.add(duration.minutes(5)).toNumber();

      const unsignedTx = await injectWhitelistData(
        await whitelist3mock.connect(user).populateTransaction.example(7777),
        id,
        timestamp,
        signer
      );

      await expect(user.sendTransaction(unsignedTx)).to.not.be.reverted;
    });

    it("should revert when timestamp to old", async () => {
      const id = "0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd";
      const timestamp = now.sub(duration.hours(9)).toNumber();

      const unsignedTx = await injectWhitelistData(
        await whitelist3mock.connect(user).populateTransaction.example(7777),
        id,
        timestamp,
        signer
      );

      await expect(user.sendTransaction(unsignedTx)).to.be.revertedWith(Error_Timestamp);
    });
  });
});
