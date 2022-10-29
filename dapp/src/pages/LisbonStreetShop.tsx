import React from "react";
import styled from "styled-components";
import { AccountButton } from "../components/account/AccountButton";
import { Container, MainContent, Section, SectionRow } from "../components/base/base";
import { BuyGreen } from "../components/Transactions/Forms";
import { Title } from "../typography/Title";

export function LisbonStreetShop() {
  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>Lisbon Street Shop</Title>
            <AccountButton />
          </SectionRow>
          <SectionRow></SectionRow>
          <SectionRow></SectionRow>
          <BuyGreen />
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
