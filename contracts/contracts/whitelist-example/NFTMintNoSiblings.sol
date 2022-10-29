// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../external/nft/ERC721A.sol";
import "../core/Whitelist3.sol";

contract NFTMintNoSiblings is Ownable, ERC721A, Whitelist3 {
    error Error_SaleNotStarted();
    error Error_MaxSupply();
    error Error_InsufficientValue();
    error Error_TransferFailed();
    error Error_Timestamp();
    error Error_Cooldown();

    event SingerUpdated(address indexed signer, bool isSigner);

    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant PRICE_PER_TOKEN = 0.01 ether;
    uint256 public constant COOLDOWN_TIME = 10 minutes;
    uint256 public immutable START_TIME;

    string private _baseTokenURI;
    mapping(bytes32 => uint256) public cooldown;

    constructor(uint256 startTime, address signer)
        ERC721A("ETHLisbon Hackathon", "ETHLisbon")
    {
        START_TIME = startTime;

        _signers[signer] = true;
        emit SingerUpdated(signer, true);
    }

    modifier onlyWhitelisted() {
        _validateWhitelist();
        _;
    }

    function mint() external payable onlyWhitelisted {
        if (START_TIME > block.timestamp) {
            revert Error_SaleNotStarted();
        }

        if (_totalMinted() >= MAX_SUPPLY) {
            revert Error_MaxSupply();
        }

        if (msg.value < PRICE_PER_TOKEN) {
            revert Error_InsufficientValue();
        }

        _mint(msg.sender, 1);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        if (!success) revert Error_TransferFailed();
    }

    function setSigner(address signer, bool isSinger) external onlyOwner {
        _signers[signer] = isSinger;
        emit SingerUpdated(signer, isSinger);
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function _validateWhitelist() private {
        Data.Whitelist memory whitelist = getWhitelistData();

        if (block.timestamp > whitelist.timestamp + 1 days) {
            revert Error_Timestamp();
        }

        if (cooldown[whitelist.id] + COOLDOWN_TIME > block.timestamp) {
            revert Error_Cooldown();
        }

        cooldown[whitelist.id] = block.timestamp;
    }
}
