import React, { useState } from "react";
import { utils, Contract } from "ethers";
import { formatEther } from "@ethersproject/units";
import { Web3Provider } from "@ethersproject/providers";
import { useEtherBalance, useEthers, useBlockMeta } from "@usedapp/core";
import { Container, ContentBlock, ContentRow, MainContent, Section, SectionRow } from "../components/base/base";
import { Label } from "../typography/Label";
import { TextInline } from "../typography/Text";
import { Title } from "../typography/Title";
import { Button } from "../components/base/Button";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { AgeCountryRestrictedShop } from "../../../contracts/typechain/AgeCountryRestrictedShop";
import AgeCountryRestrictedShopAbi from "../../../contracts/data/abi//AgeCountryRestrictedShop.json";

import { injectKycData } from "../utils";

export function WalletConnect() {
  const { account, activate, chainId, deactivate, library } = useEthers();
  const [signedMessage, setSignedMessage] = useState("");

  async function onConnect() {
    const infuraId = process.env.REACT_APP_INFURA;
    try {
      const provider = new WalletConnectProvider({
        infuraId: infuraId,
      });
      await provider.enable();
      await activate(provider);
    } catch (error) {
      console.error(error);
    }
  }

  async function onDisconnect() {
    deactivate();
    localStorage.removeItem("walletconnect");
    setSignedMessage("");
  }

  async function onSign() {
    const shopInterface = new utils.Interface(AgeCountryRestrictedShopAbi);
    const shopAddress = "0x555d8eed2d10D5A8b9440B25925D62B62b039551";
    const contract = new Contract(shopAddress, shopInterface) as AgeCountryRestrictedShop;

    const msg = "I sign Wallet Connect test message on @usedapp";
    const provider = library as Web3Provider;
    try {
      const signer = provider.getSigner();
      const blockTimestamp: number = 1667071200; //Math.floor(timestamp?.getTime() / 1000);
      const id = "0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd";
      const age = 22;
      const country = 1;
      const timestamp = 1667066107;

      const unsignedTx = await injectKycData(
        await contract.connect(signer).populateTransaction.buyItem(1, { value: utils.parseEther("1").div(100) }),
        id,
        age,
        country,
        timestamp,
        blockTimestamp
      );

      await signer.sendTransaction(unsignedTx);

      console.log(unsignedTx);
    } catch (error) {
      console.error(error);
    }
  }

  const userBalance = useEtherBalance(account);

  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>WalletConnect Usage Example</Title>
            <Button onClick={account ? onDisconnect : onConnect}>{account ? "Disconnect" : "Connect"}</Button>
          </SectionRow>
          <ContentBlock>
            {chainId && account && (
              <ContentRow>
                <Label>Active Chain ID:</Label> <TextInline>{chainId}</TextInline>{" "}
              </ContentRow>
            )}
            {account && (
              <ContentRow>
                <Label>Account:</Label> <TextInline>{account}</TextInline>
              </ContentRow>
            )}
            {userBalance && (
              <ContentRow>
                <Label>Ether balance:</Label> <TextInline>{formatEther(userBalance)}</TextInline> <Label>ETH</Label>
              </ContentRow>
            )}
            {signedMessage && account && (
              <ContentRow>
                <Label>Signed message signature:</Label>{" "}
                <TextInline style={{ overflowWrap: "break-word" }}>{signedMessage}</TextInline>{" "}
              </ContentRow>
            )}
          </ContentBlock>
          {account && (
            <SectionRow style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={onSign}>Sign message</Button>
            </SectionRow>
          )}
        </Section>
      </Container>
    </MainContent>
  );
}
