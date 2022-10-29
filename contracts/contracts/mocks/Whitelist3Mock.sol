// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "../core/Whitelist3.sol";

contract Whitelist3Mock is Whitelist3 {
    error Error_Timestamp();

    bytes32 public id;
    uint256 public amount;

    function example(uint256 amount_) external {
        Data.Whitelist memory whitelist = getWhitelistData();

        if (block.timestamp > whitelist.timestamp + 6 hours) {
            revert Error_Timestamp();
        }

        id = whitelist.id;
        amount = amount_;
    }

    function addSigner(address signer) public {
        _signers[signer] = true;
    }
}
