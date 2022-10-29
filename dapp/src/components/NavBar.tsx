import React from "react";
import {
  Handshaking,
  Sidebar,
  SidebarContainer,
  SidebarLinkDescription,
  SidebarLink,
  SidebarNav,
  SidebarNavLinks,
  ToMain,
  ToMainBottom,
} from "./base/base";

export function NavBar() {
  return (
    <Sidebar>
      <SidebarContainer>
        <SidebarNav>
          <ToMain href="/">
            <span>Data3 - Oracle Injection</span>
            <ToMainBottom>Build with useDapp</ToMainBottom>
          </ToMain>
          <SidebarNavLinks>
            <SidebarLink activeClassName="active-page" to="/transactions">
              {" "}
              Kyc3 - Lisbon Shop - Cronos{" "}
            </SidebarLink>
            <SidebarLink activeClassName="active-page" to="/web3modal">
              {" "}
              Web3 Modal{" "}
            </SidebarLink>
            <SidebarLink activeClassName="active-page" to="/wallet-connect">
              {" "}
              WalletConnect example{" "}
            </SidebarLink>
          </SidebarNavLinks>
        </SidebarNav>
      </SidebarContainer>
    </Sidebar>
  );
}
