import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Page } from "./components/base/base";
import { NavBar } from "./components/NavBar";
import { GlobalStyle } from "./global/GlobalStyle";
import { Transactions } from "./pages/Transactions";
import { NotificationsList } from "./components/Transactions/History";
import { Web3Modal } from "./pages/Web3Modal";
import { WalletConnect } from "./pages/WalletConnect";

export function App() {
  return (
    <Page>
      <GlobalStyle />
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/transactions" component={Transactions} />
          <Route exact path="/web3modal" component={Web3Modal} />
          <Route exact path="/wallet-connect" component={WalletConnect} />
          <Redirect exact from="/" to="/transactions" />
        </Switch>
      </BrowserRouter>
      <NotificationsList />
    </Page>
  );
}
