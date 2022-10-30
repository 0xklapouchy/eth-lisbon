import React from "react";
import { utils, Contract } from "ethers";
import { useEtherBalance, useEthers, useBlockMeta } from "@usedapp/core";
import { Web3Provider } from "@ethersproject/providers";

import { TransactionForm } from "./TransactionForm";
import { injectKycData } from "../../utils";

import { AgeCountryRestrictedShop } from "../../../../contracts/typechain/AgeCountryRestrictedShop";
import AgeCountryRestrictedShopAbi from "../../../../contracts/data/abi//AgeCountryRestrictedShop.json";

export const BuyForm = () => {
  const { account, library } = useEthers();
  const { timestamp } = useBlockMeta();
  const etherBalance = useEtherBalance(account);

  const shopAddress = "0x81Eb558A49A795E6147D3c86084C453f5a12A964";
  const shopInterface = new utils.Interface(AgeCountryRestrictedShopAbi);
  const contract = new Contract(shopAddress, shopInterface) as AgeCountryRestrictedShop;

  const buyGreen = async (greenAmount: string) => {
    const provider = library as Web3Provider;
    const signer = provider.getSigner();

    const blockTimestamp: number = Math.floor(timestamp?.getTime() / 1000);

    // should be taken from api
    const id = "0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd";
    const age = 22;
    const country = 1;
    const time = 1667066107;

    const unsignedTx = await injectKycData(
      await contract
        .connect(signer)
        .populateTransaction.buyItem(greenAmount, { value: utils.parseEther(greenAmount).div(100) }),
      id,
      age,
      country,
      time,
      blockTimestamp
    );

    await signer.sendTransaction(unsignedTx);
  };

  return <TransactionForm balance={etherBalance} send={buyGreen} title="Buy from street vendor" ticker="ETH" />;
};
