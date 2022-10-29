// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../core/Kyc3.sol";

contract AgeCountryRestrictedShop is Ownable, Kyc3 {
    error Error_Age();
    error Error_Country();
    error Error_Timestamp();
    error Error_InsufficientValue();
    error Error_TransferFailed();

    event ItemSold(address indexed purchaser, uint256 amount);
    event SingerUpdated(address indexed signer, bool isSigner);

    uint256 public constant PRICE = 0.01 ether;
    address public beneficiary;

    constructor(address signer) {
        _signers[signer] = true;
        emit SingerUpdated(signer, true);
    }

    modifier onlyAdultAndFromPortugal() {
        _validateKyc();
        _;
    }

    function buyItem(uint256 amount) external payable onlyAdultAndFromPortugal {
        if (msg.value < amount * PRICE) {
            revert Error_InsufficientValue();
        }

        emit ItemSold(msg.sender, amount);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        if (!success) revert Error_TransferFailed();
    }

    function setSigner(address signer, bool isSinger) external onlyOwner {
        _signers[signer] = isSinger;
        emit SingerUpdated(signer, isSinger);
    }

    function _validateKyc() private view {
        Data.Kyc memory kyc = getKycData();

        if (kyc.age < 18) {
            revert Error_Age();
        }

        uint256 numberOneCountryToHack = 1;

        if (kyc.country != numberOneCountryToHack) {
            revert Error_Country();
        }

        if (block.timestamp > kyc.timestamp + 1 days) {
            revert Error_Timestamp();
        }
    }
}
