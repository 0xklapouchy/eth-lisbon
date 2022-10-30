import React from "react";
import ReactDOM from "react-dom";
import {
  Mainnet,
  DAppProvider,
  Config,
  Localhost,
  MetamaskConnector,
  Goerli,
  OptimismGoerli,
  Optimism,
  Cronos,
  Gnosis,
} from "@usedapp/core";
import { App } from "./App";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";
import { getDefaultProvider } from "@ethersproject/providers";

const readOnlyUrls: Config["readOnlyUrls"] = {
  [Mainnet.chainId]: process.env.MAINNET_URL || getDefaultProvider("mainnet"),
  [Goerli.chainId]: process.env.MAINNET_URL
    ? process.env.MAINNET_URL.replace("mainnet", "goerli")
    : getDefaultProvider("goerli"),
  [Optimism.chainId]: "https://mainnet.optimism.io",
  [OptimismGoerli.chainId]: "https://goerli.optimism.io",
  [Cronos.chainId]: "https://evm.cronos.org",
  [Gnosis.chainId]: "https://rpc.gnosischain.com",
};

if (process.env.LOCALHOST_URL) {
  readOnlyUrls[Localhost.chainId] = process.env.LOCALHOST_URL;
}

const infuraId = process.env.REACT_APP_INFURA;

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls,
  multicallVersion: 1 as const,
  fastMulticallEncoding: true,
  noMetamaskDeactivate: true,
  connectors: {
    metamask: new MetamaskConnector(),
    walletConnect: new WalletConnectConnector({ infuraId: infuraId }),
  },
};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
