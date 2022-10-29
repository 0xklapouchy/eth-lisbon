import { waffle } from "hardhat";
import { expect } from "chai";

import Kyc3Artifact from "../artifacts/contracts/core/Kyc3.sol/Kyc3.json";
import Kyc3MockArtifact from "../artifacts/contracts/mocks/Kyc3Mock.sol/Kyc3Mock.json";

import { Kyc3, Kyc3Mock } from "../typechain";
import { Wallet, utils, BigNumber } from "ethers";

import { latest } from "./utilities";

const { provider, deployContract } = waffle;

describe("Kyc3 Module Tests", () => {
  const [deployer, user, signer] = provider.getWallets() as Wallet[];
  let kyc3: Kyc3;
  let kyc3mock: Kyc3Mock;

  let now: BigNumber;

  beforeEach(async () => {
    kyc3 = (await deployContract(deployer, Kyc3Artifact, [])) as Kyc3;
    now = await latest();
  });

  describe("getKycData function", () => {
    beforeEach(async () => {
      kyc3mock = (await deployContract(deployer, Kyc3MockArtifact, [])) as Kyc3Mock;
      await kyc3mock.addSigner(signer.address);
    });

    it("should work", async () => {
      const data = utils.defaultAbiCoder.encode(
        ["bytes32", "uint8", "uint16", "uint32"],
        ["0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd", 22, 34, 1667096757]
      );
      const size = utils.defaultAbiCoder.encode(["uint8"], [4]).slice(64);
      const deadline = utils.defaultAbiCoder.encode(["uint32"], [now]).slice(58);

      const payload = data + size + deadline;
      const payloadHash = utils.keccak256(payload);

      const signature = await signer.signMessage(utils.arrayify(payloadHash));

      const unsignedTx = await kyc3mock
        .connect(user)
        .populateTransaction.example(100, "0x0000000000000000000000000000000000000009");

      unsignedTx.data = unsignedTx.data + payload.slice(2) + signature.slice(2);

      await user.sendTransaction(unsignedTx);
    });
  });
});
