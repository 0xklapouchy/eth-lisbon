// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

library Data {
    error Error_InvalidLength();

    struct Kyc {
        bytes32 id;
        uint8 age;
        uint16 country;
        uint32 timestamp;
    }

    function unpackKyc(bytes calldata data) internal pure returns (Kyc memory) {
        if (data.length != 128) {
            revert Error_InvalidLength();
        }

        return
            Kyc({
                id: bytes32(data[0:32]),
                age: uint8(bytes1(data[63:64])),
                country: uint16(bytes2(data[94:96])),
                timestamp: uint32(bytes4(data[124:128]))
            });
    }

    function packKyc(Kyc calldata kyc) internal pure returns (bytes memory) {
        return abi.encode(kyc.id, kyc.age, kyc.country, kyc.timestamp);
    }
}
