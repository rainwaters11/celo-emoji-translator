// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract EmojiNFT is
    ERC721,
    ERC721URIStorage,
    ERC721Pausable,
    Ownable,
    ERC721Burnable
{
    using Strings for uint256;

    uint256 private _nextTokenId;
    uint256 public mintPrice = 0.001 ether; // Small fee for minting
    uint256 public maxSupply = 10000;

    // Mapping to store emoji messages for each token
    mapping(uint256 => string) private _emojiMessages;
    mapping(uint256 => string) private _originalTexts;
    mapping(uint256 => uint256) private _mintTimestamps;

    event EmojiNFTMinted(
        address indexed to,
        uint256 indexed tokenId,
        string originalText,
        string emojiMessage
    );

    constructor(
        address initialOwner
    ) ERC721("Celo Emoji NFT", "CEMOJI") Ownable(initialOwner) {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
    }

    function mintEmojiNFT(
        address to,
        string memory originalText,
        string memory emojiMessage
    ) public payable {
        require(_nextTokenId < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        require(bytes(originalText).length > 0, "Original text cannot be empty");
        require(bytes(emojiMessage).length > 0, "Emoji message cannot be empty");

        uint256 tokenId = _nextTokenId++;
        
        // Store the emoji data
        _emojiMessages[tokenId] = emojiMessage;
        _originalTexts[tokenId] = originalText;
        _mintTimestamps[tokenId] = block.timestamp;

        _safeMint(to, tokenId);
        
        // Generate and set the token URI
        string memory uri = generateTokenURI(tokenId, originalText, emojiMessage);
        _setTokenURI(tokenId, uri);

        emit EmojiNFTMinted(to, tokenId, originalText, emojiMessage);
    }

    function generateTokenURI(
        uint256 tokenId,
        string memory originalText,
        string memory emojiMessage
    ) internal view returns (string memory) {
        // Create a simple on-chain metadata
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Celo Emoji #',
                        tokenId.toString(),
                        '", "description": "A unique emoji translation created on Celo blockchain", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(generateSVG(emojiMessage))),
                        '", "attributes": [{"trait_type": "Original Text", "value": "',
                        originalText,
                        '"}, {"trait_type": "Emoji Message", "value": "',
                        emojiMessage,
                        '"}, {"trait_type": "Length", "value": ',
                        Strings.toString(bytes(originalText).length),
                        '}, {"trait_type": "Mint Date", "value": ',
                        Strings.toString(_mintTimestamps[tokenId]),
                        '}]}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function generateSVG(string memory emojiMessage) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">',
                '<defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#059669;stop-opacity:1" /></linearGradient></defs>',
                '<rect width="100%" height="100%" fill="url(#grad1)"/>',
                '<rect x="25" y="25" width="450" height="450" rx="25" fill="white" fill-opacity="0.9"/>',
                '<text x="250" y="80" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif" font-size="24" text-anchor="middle" fill="#059669">Celo Emoji NFT</text>',
                '<foreignObject x="50" y="120" width="400" height="280">',
                '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 40px; text-align: center; word-wrap: break-word; padding: 20px; line-height: 1.2;">',
                emojiMessage,
                '</div></foreignObject>',
                '<text x="250" y="460" font-family="monospace" font-size="12" text-anchor="middle" fill="#6B7280">Minted on Celo Blockchain</text>',
                '</svg>'
            )
        );
    }

    // Public functions to get emoji data
    function getEmojiMessage(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _emojiMessages[tokenId];
    }

    function getOriginalText(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _originalTexts[tokenId];
    }

    function getMintTimestamp(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _mintTimestamps[tokenId];
    }

    function getNFTsByAddress(
        address owner
    ) public view returns (uint256[] memory) {
        uint256 totalNFTs = _nextTokenId;
        uint256[] memory ownedTokenIds = new uint256[](totalNFTs);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalNFTs; i++) {
            try ERC721(address(this)).ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    ownedTokenIds[currentIndex++] = i;
                }
            } catch Error(string memory /*reason*/) {
                // Token does not exist or lookup failed
                break;
            }
        }

        // Resize the array to return only owned tokens
        assembly {
            mstore(ownedTokenIds, currentIndex)
        }
        return ownedTokenIds;
    }

    function getTotalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    // Withdraw function for contract owner
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // The following functions are overrides required by Solidity.
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Pausable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
