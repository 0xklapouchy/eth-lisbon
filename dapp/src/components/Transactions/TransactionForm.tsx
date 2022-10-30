import { formatEther } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import React, { useState } from "react";
import styled from "styled-components";
import { TextBold } from "../../typography/Text";
import { ContentBlock } from "../base/base";
import { Button } from "../base/Button";
import { BorderRad, Colors } from "../../global/styles";
import { BigNumber } from "ethers";

const formatter = new Intl.NumberFormat("en-us", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const formatBalance = (balance: BigNumber | undefined) =>
  formatter.format(parseFloat(formatEther(balance ?? BigNumber.from("0"))));

interface InputComponentProps {
  send: (value: string) => void;
  ticker: string;
}

const InputComponent = ({ ticker, send }: InputComponentProps) => {
  const { account } = useEthers();
  const [value, setValue] = useState("0");
  const [disabled, setDisabled] = useState(false);

  const onClick = () => {
    if (Number(value) > 0) {
      send(value);
    }
  };

  return (
    <InputRow>
      <Input
        id={`${ticker}Input`}
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        disabled={disabled}
      />
      <FormTicker>{ticker}</FormTicker>
      <SmallButton disabled={false} onClick={onClick}>
        Send
      </SmallButton>
    </InputRow>
  );
};

interface TransactionFormProps {
  balance: BigNumber | undefined;
  send: (value: string) => void;
  title: string;
  ticker: string;
}

export const TransactionForm = ({ balance, send, title, ticker }: TransactionFormProps) => (
  <SmallContentBlock>
    <TitleRow>
      <CellTitle>{title}</CellTitle>
      <BalanceWrapper>
        Your {ticker} balance: {formatBalance(balance)}
      </BalanceWrapper>
    </TitleRow>
    <LabelRow>
      <Label htmlFor={`${ticker}Input`}>How much? 0.01 ETH per 🤪</Label>
    </LabelRow>
    <InputComponent ticker={"🤪"} send={send} />
    <LabelRow></LabelRow>
  </SmallContentBlock>
);

const SmallButton = styled(Button)`
  display: flex;
  justify-content: center;
  min-width: 95px;
  height: unset;
  padding: 8px 24px;

  &:disabled {
    color: ${Colors.Gray["600"]};
    cursor: unset;
  }

  &:disabled:hover,
  &:disabled:focus {
    background-color: unset;
    color: unset;
  }
`;

const Input = styled.input`
  height: 100%;
  width: 120px;
  padding: 0 0 0 24px;
  border: 0;
  border-radius: ${BorderRad.m};
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: transparent auto 1px;
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px ${Colors.Black["900"]};
  }
`;

const CellTitle = styled(TextBold)`
  font-size: 18px;
`;

const InputRow = styled.div`
  display: flex;
  margin: 0 auto;
  color: ${Colors.Gray["600"]};
  align-items: center;
  border: ${Colors.Gray["300"]} 1px solid;
  border-radius: ${BorderRad.m};
  overflow: hidden;
`;

const FormTicker = styled.div`
  padding: 0 16px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px 0 24px 0;
`;

const Label = styled.label`
  font-weight: 700;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: ${Colors.Gray["300"]} 1px solid;
  padding: 16px;
`;

const BalanceWrapper = styled.div`
  color: ${Colors.Gray["600"]};
  font-size: 14px;
`;

const SmallContentBlock = styled(ContentBlock)`
  padding: 0;
`;
