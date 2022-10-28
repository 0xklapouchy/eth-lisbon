// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "./Data.sol";
import "./Data3.sol";

contract Kyc3 is Data3 {
    function getKycData() public view returns (Data.Kyc memory) {
        bytes calldata data = _getValidatedData();
        return Data.unpackKyc(data);
    }

    function getId() public view returns (bytes32) {
        return getKycData().id;
    }

    function getAge() public view returns (uint256) {
        return getKycData().age;
    }

    function getCountry() public view returns (uint256) {
        return getKycData().country;
    }

    function getTimestamp() public view returns (uint256) {
        return getKycData().timestamp;
    }

    function packKyc(
        bytes32 id,
        uint8 age,
        uint16 country,
        uint32 timestamp
    ) external pure returns (bytes memory) {
        return Data.packKyc(Data.Kyc(id, age, country, timestamp));
    }
}
