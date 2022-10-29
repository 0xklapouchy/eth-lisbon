// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "./Data.sol";
import "./Data3.sol";

contract Whitelist3 is Data3 {
    function getWhitelistData() public view returns (Data.Whitelist memory) {
        bytes calldata data = _getValidatedData();
        return Data.unpackWhitelist(data);
    }

    function getId() public view returns (bytes32) {
        return getWhitelistData().id;
    }

    function getTimestamp() public view returns (uint256) {
        return getWhitelistData().timestamp;
    }
}
