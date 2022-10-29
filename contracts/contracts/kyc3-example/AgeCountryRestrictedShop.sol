// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../core/Kyc3.sol";

contract AgeCountryRestrictedShop is Ownable, Kyc3 {
    using SafeERC20 for IERC20;

    error Error_Age();
    error Error_Country();
    error Error_Timestamp();
    error Error_Value();

    uint256 public constant PRICE = 1e16;

    address public beneficiary;

    event ItemSold(address indexed purchaser, uint256 amount);
    event SignerAdded(address indexed signer);
    event BeneficiaryTransferred(
        address indexed previousBeneficiary,
        address indexed newBeneficiary
    );

    constructor(address[] memory signers, address beneficiary_) {
        uint256 length = signers.length;
        for (uint256 i = 0; i < length; ) {
            _signers[signers[i]] = true;
            emit SignerAdded(signers[i]);

            unchecked {
                i++;
            }
        }

        emit BeneficiaryTransferred(beneficiary, beneficiary_);
        beneficiary = beneficiary_;
    }

    modifier onlyAdultAndFromPortugal() {
        _validateKyc();
        _;
    }

    function buyItem(uint256 amount) external payable onlyAdultAndFromPortugal {
        if (msg.value < amount * PRICE) {
            revert Error_Value();
        }

        emit ItemSold(msg.sender, amount);
        payable(beneficiary).transfer(msg.value);
    }

    function addSigner(address signer) external onlyOwner {
        _signers[signer] = true;
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
