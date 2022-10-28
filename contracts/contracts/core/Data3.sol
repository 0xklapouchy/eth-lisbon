// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

abstract contract Data3 {
    // -----------------------------------
    // Library usage
    // -----------------------------------

    using ECDSA for bytes32;

    // -----------------------------------
    // Errors
    // -----------------------------------

    error Error_InvalidSigner();
    error Error_Deadline();

    // -----------------------------------
    // Constants
    // -----------------------------------

    uint256 internal constant _MAX_DEADLINE = 10 * 60; // 10 minutes

    // -----------------------------------
    // Storage variables
    // -----------------------------------

    mapping(address => bool) internal _signers;

    // -----------------------------------
    // Constructor
    // -----------------------------------

    constructor(address[] memory signers) {
        uint256 length = signers.length;

        for (uint256 i = 0; i < length; ) {
            _signers[signers[i]] = true;

            unchecked {
                i++;
            }
        }
    }

    // -----------------------------------
    // Getters
    // -----------------------------------

    function getMaxDeadline() public pure returns (uint256) {
        return _MAX_DEADLINE;
    }

    // -----------------------------------
    // Internal functions
    // -----------------------------------

    function _getValidatedData() internal view returns (bytes calldata) {
        // calldata = original_calldata + attached_data + attached_data_size
        // + deadline + signature
        //
        // (attached_data_size * 32 bytes) + 1 bytes + 4 bytes + 65 bytes

        uint256 signatureOffset = msg.data.length - 65;
        uint256 deadlineOffset = signatureOffset - 4;
        uint256 sizeOffset = deadlineOffset - 1;

        uint32 deadline = uint32(
            bytes4(msg.data[deadlineOffset:deadlineOffset + 4])
        );

        _validateDeadline(deadline);

        uint8 size = uint8(bytes1(msg.data[sizeOffset:sizeOffset + 1]));

        // attached_data + attached_data_size + deadline
        uint256 signedDataLength = uint16(size) * 32 + 1 + 4;
        uint256 signedDataOffset = signatureOffset - signedDataLength;

        bytes calldata signedData = msg.data[signedDataOffset:signedDataOffset +
            signedDataLength];
        bytes calldata signature = msg.data[signatureOffset:];

        _validateSignature(signedData, signature);

        uint256 validatedDataLength = uint16(size) * 32;
        uint256 validateDataOffset = sizeOffset - validatedDataLength;

        return msg.data[validateDataOffset:validatedDataLength];
    }

    function _validateSignature(
        bytes calldata signedData,
        bytes calldata signature
    ) internal view {
        bytes32 hash = keccak256(signedData);
        bytes32 hashWithPrefix = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );

        address signer = hashWithPrefix.recover(signature);

        if (!_signers[signer]) {
            revert Error_InvalidSigner();
        }
    }

    function _validateDeadline(uint256 deadline) internal view {
        if (
            block.timestamp > deadline ||
            block.timestamp - deadline > _MAX_DEADLINE
        ) {
            revert Error_Deadline();
        }
    }
}
