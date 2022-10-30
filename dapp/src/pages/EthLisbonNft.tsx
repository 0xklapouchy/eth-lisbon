import React from "react";
import { utils, Contract } from "ethers";
import { formatEther } from "@ethersproject/units";
import { Web3Provider } from "@ethersproject/providers";
import { useEthers, useBlockMeta, useEtherBalance } from "@usedapp/core";
import { MainContent, Container, Section, SectionRow, ContentBlock, ContentRow } from "../components/base/base";
import { Label } from "../typography/Label";
import { TextInline } from "../typography/Text";
import { Title } from "../typography/Title";
import { Button } from "../components/base/Button";
import { Web3ModalButton } from "../components/account/Web3ModalButton";

import { NFTMintNoSiblings } from "../../../contracts/typechain/NFTMintNoSiblings";
import NFTMintNoSiblingsAbi from "../../../contracts/data/abi//NFTMintNoSiblings.json";

import { injectWhitelistData } from "../utils";

export function EthLisbonNft() {
  const { account, chainId, library } = useEthers();
  const { timestamp } = useBlockMeta();
  const userBalance = useEtherBalance(account);

  async function onMint() {
    const nftInterface = new utils.Interface(NFTMintNoSiblingsAbi);
    const nftAddress = "0xe4cf580B7a9Ed2e599D70f4e43a909f605940995";
    const contract = new Contract(nftAddress, nftInterface) as NFTMintNoSiblings;

    const provider = library as Web3Provider;

    try {
      const user = provider.getSigner();
      const blockTimestamp: number = Math.floor(timestamp?.getTime() / 1000);

      const id = "0x12ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabcd";
      const time = 1667066107;

      const unsignedTx = await injectWhitelistData(
        await contract.connect(user).populateTransaction.mint({ value: utils.parseEther("1").div(100) }),
        id,
        time,
        blockTimestamp
      );

      await user.sendTransaction(unsignedTx);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>ETHLisbon NFT Mint</Title>
            <Web3ModalButton />
          </SectionRow>
          <SectionRow></SectionRow>
          <SectionRow></SectionRow>
          <ContentBlock>
            <ContentRow>
              <Label>Active Chain ID:</Label> {chainId && account && <TextInline>{chainId}</TextInline>}
            </ContentRow>
            <ContentRow>
              <Label>Account:</Label> {account && <TextInline>{account}</TextInline>}
            </ContentRow>
            <ContentRow>
              <Label>Ether balance:</Label>
              {userBalance && (
                <Label>
                  <TextInline> {formatEther(userBalance)} </TextInline> <Label>ETH</Label>
                </Label>
              )}
            </ContentRow>
            {account && (
              <SectionRow style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={onMint}>Mint NFT</Button>
              </SectionRow>
            )}
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  );
}
