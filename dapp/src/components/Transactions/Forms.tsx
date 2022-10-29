import React from "react";
import { utils, Contract } from "ethers";
import { useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";

import { TransactionForm } from "./TransactionForm";

import { AgeCountryRestrictedShop } from "../../../../contracts/typechain/AgeCountryRestrictedShop";
import AgeCountryRestrictedShopAbi from "../../../../contracts/data/abi//AgeCountryRestrictedShop.json";

const shopInterface = new utils.Interface(AgeCountryRestrictedShopAbi);
const shopAddress = "0xA243FEB70BaCF6cD77431269e68135cf470051b4";
const contract = new Contract(shopAddress, shopInterface) as AgeCountryRestrictedShop;

export const BuyGreen = () => {
  const { account } = useEthers();
  const etherBalance = useEtherBalance(account);

  const { state, send } = useContractFunction(contract, "buyItem", { transactionName: "Buy" });

  const buyGreen = (greenAmount: string) => {
    void send(greenAmount, { value: utils.parseEther(greenAmount).div(100) });
  };

  return <TransactionForm balance={etherBalance} send={buyGreen} title="Buy 🤪" ticker="ETH" transaction={state} />;
};
