import React from "react";
import styled from "styled-components";
import { Web3ModalButton } from "../components/account/Web3ModalButton";
import { Container, MainContent, Section, SectionRow } from "../components/base/base";
import { BuyForm } from "../components/Transactions/Forms";
import { Title } from "../typography/Title";

export function LisbonStreetShop() {
  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>ETHLisbon Street Shop</Title>
            <Web3ModalButton />
          </SectionRow>
          <SectionRow></SectionRow>
          <SectionRow></SectionRow>
          <BuyForm />
        </Section>
      </Container>
    </MainContent>
  );
}

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;
