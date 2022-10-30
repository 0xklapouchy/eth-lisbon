import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Page } from "./components/base/base";
import { NavBar } from "./components/NavBar";
import { GlobalStyle } from "./global/GlobalStyle";
import { LisbonStreetShop } from "./pages/LisbonStreetShop";
import { NotificationsList } from "./components/Transactions/History";
import { EthLisbonNft } from "./pages/EthLisbonNft";

export function App() {
  return (
    <Page>
      <GlobalStyle />
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/lisbon-street-shop" component={LisbonStreetShop} />
          <Route exact path="/eth-lisbon-nft" component={EthLisbonNft} />
          <Redirect exact from="/" to="/eth-lisbon-nft" />
        </Switch>
      </BrowserRouter>
      <NotificationsList />
    </Page>
  );
}
