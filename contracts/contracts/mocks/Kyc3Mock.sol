// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "../core/Kyc3.sol";

contract Kyc3Mock is Kyc3 {
    error Error_Age();
    error Error_Country();
    error Error_Timestamp();

    bytes32 public id;
    uint256 public amount;
    address public to;

    function example(uint256 amount_, address to_) external {
        Data.Kyc memory kyc = getKycData();

        if (kyc.age < 21) {
            revert Error_Age();
        }

        if (kyc.country == 33) {
            revert Error_Country();
        }

        if (block.timestamp > kyc.timestamp + 6 hours) {
            revert Error_Timestamp();
        }

        id = kyc.id;
        amount = amount_;
        to = to_;
    }

    function addSigner(address signer) public {
        _signers[signer] = true;
    }
}
