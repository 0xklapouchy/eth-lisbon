import React from "react";
import { Sidebar, SidebarContainer, SidebarNav, SidebarLink, SidebarNavLinks, ToMain, ToMainBottom } from "./base/base";

export function NavBar() {
  return (
    <Sidebar>
      <SidebarContainer>
        <SidebarNav>
          <ToMain href="/">
            <span>Data3 - Oracle Injection</span>
            <ToMainBottom>Builded with useDapp</ToMainBottom>
          </ToMain>
          <SidebarNavLinks>
            <SidebarLink activeClassName="active-page" to="/lisbon-street-shop">
              {" "}
              Kyc3 - Module Example - Cronos{" "}
            </SidebarLink>
            <SidebarLink activeClassName="active-page" to="/eth-lisbon-nft">
              {" "}
              Whitelist3 - Module Example - Gnosis{" "}
            </SidebarLink>
          </SidebarNavLinks>
        </SidebarNav>
      </SidebarContainer>
    </Sidebar>
  );
}
