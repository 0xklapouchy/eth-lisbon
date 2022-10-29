// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "../core/Whitelist3.sol";

contract Whitelist3Mock is Whitelist3 {
    error Error_Timestamp();

    bytes32 public id;
    uint256 public amount;

    function example(uint256 amount_) external {
        if (block.timestamp > getTimestamp()) {
            revert Error_Timestamp();
        }

        id = getId();
        amount = amount_;
    }

    function addSigner(address signer) public {
        _signers[signer] = true;
    }
}
