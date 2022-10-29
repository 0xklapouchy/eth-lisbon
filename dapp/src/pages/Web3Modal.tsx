import React from "react";
import { formatEther } from "@ethersproject/units";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { Container, ContentBlock, ContentRow, MainContent, Section, SectionRow } from "../components/base/base";
import { Label } from "../typography/Label";
import { TextInline } from "../typography/Text";
import { Title } from "../typography/Title";
import { BuyGreen } from "../components/Transactions/Forms";

import { Web3ModalButton } from "../components/account/Web3ModalButton";

const STAKING_CONTRACT = "0x00000000219ab540356cBB839Cbe05303d7705Fa";

export function Web3Modal() {
  const { account } = useEthers();

  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>Web3Modal Usage Example</Title>
            <Web3ModalButton />
          </SectionRow>
          <BuyGreen />
        </Section>
      </Container>
    </MainContent>
  );
}
