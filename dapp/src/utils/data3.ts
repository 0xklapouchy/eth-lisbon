import { Wallet, utils, BigNumber, PopulatedTransaction } from "ethers";

export async function injectKycData(
  transaction: PopulatedTransaction,
  id: string,
  age: number,
  country: number,
  timestamp: number,
  blockTimestamp: number
): Promise<PopulatedTransaction> {
  const kycData = utils.defaultAbiCoder.encode(["bytes32", "uint8", "uint16", "uint32"], [id, age, country, timestamp]);
  const size = "04";

  return await _injectData(transaction, kycData, size, blockTimestamp);
}

export async function injectWhitelistData(
  transaction: PopulatedTransaction,
  id: string,
  timestamp: number,
  blockTimestamp: number
): Promise<PopulatedTransaction> {
  const kycData = utils.defaultAbiCoder.encode(["bytes32", "uint32"], [id, timestamp]);
  const size = "02";

  return await _injectData(transaction, kycData, size, blockTimestamp);
}

async function _injectData(
  transaction: PopulatedTransaction,
  data: string,
  size: string,
  blockTimestamp: number
): Promise<PopulatedTransaction> {
  const pk = process.env.REACT_APP_SIGNER;
  const signer: Wallet = new Wallet(pk);
  const deadline = BigNumber.from(blockTimestamp).add(600).toHexString();
  const payload = data + size + deadline.slice(2);
  const payloadHash = utils.keccak256(payload);
  const signature = await signer.signMessage(utils.arrayify(payloadHash));

  transaction.data = transaction.data + payload.slice(2) + signature.slice(2);

  return transaction;
}
