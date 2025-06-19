# 🎨 Celo Emoji Translator with NFT Integration

A fun and interactive web application that translates text into emoji codes and allows users to mint their creations as NFTs on the Celo blockchain!

## ✨ Features

### 🔤 Emoji Translation
- Transform any text into creative emoji representations
- Support for letters, numbers, and special words
- Real-time translation as you type
- Dark/light mode support

### 🖼️ NFT Integration
- **Mint NFTs**: Convert your emoji translations into unique NFTs
- **On-chain Metadata**: All data stored directly on the blockchain
- **Dynamic SVG**: Beautiful SVG artwork generated on-chain
- **NFT Gallery**: View and manage your minted NFTs
- **Low Cost**: Only 0.001 CELO per mint

### 🌐 Web3 Features
- **Wallet Connection**: Connect MetaMask, Valora, or other Web3 wallets
- **Celo Network**: Built specifically for Celo blockchain
- **Real-time Balance**: View your CELO balance
- **Transaction History**: Track your minting transactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- A Web3 wallet (MetaMask, Valora, etc.)
- Test CELO tokens from the Alfajores faucet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd celo-emoji-translator
   ```

2. **Install dependencies**
   ```bash
   # Install hardhat dependencies
   cd packages/hardhat
   npm install
   
   # Install react-app dependencies
   cd ../react-app
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cd packages/hardhat
   cp .env.template .env
   # Edit .env and add your private key
   ```

4. **Deploy the smart contract**
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy-emoji-nft.ts --network alfajores
   ```

5. **Update frontend configuration**
   - Copy the deployed contract address
   - Update `EMOJI_NFT_CONTRACT` in `packages/react-app/contexts/useEmojiWeb3.ts`

6. **Start the development server**
   ```bash
   cd packages/react-app
   npm run dev
   ```

## 📱 How to Use

### 1. Create Emoji Translation
1. Type any message in the input field
2. Watch as it transforms into emojis in real-time
3. Use the emoji key to understand the translations

### 2. Connect Your Wallet
1. Click "Connect Wallet" button
2. Approve the connection in your wallet
3. View your address and balance

### 3. Mint NFT
1. Create an emoji translation you like
2. Click "Mint as NFT" button
3. Confirm the transaction in your wallet
4. Wait for confirmation

### 4. View Your Collection
1. Your minted NFTs appear in the gallery
2. View original text and emoji translation
3. See mint date and token ID

## 🏗️ Architecture

### Smart Contracts
- **EmojiNFT.sol**: Main NFT contract with minting and metadata
- **Features**: On-chain SVG generation, metadata storage, owner controls

### Frontend
- **Next.js**: React framework with TypeScript
- **Viem**: Modern Web3 library for Ethereum interactions
- **Tailwind CSS**: Utility-first CSS framework
- **Components**: Modular React components for Web3 integration

### Key Components
- `Web3Connection`: Handle wallet connections
- `EmojiNFTMinter`: Mint emoji translations as NFTs
- `EmojiNFTGallery`: Display user's NFT collection
- `useEmojiWeb3`: Custom hook for Web3 interactions

## 🔧 Smart Contract Details

### EmojiNFT Contract
```solidity
contract EmojiNFT is ERC721, ERC721URIStorage, ERC721Pausable, Ownable {
    uint256 public mintPrice = 0.001 ether;
    uint256 public maxSupply = 10000;
    
    function mintEmojiNFT(
        address to,
        string memory originalText,
        string memory emojiMessage
    ) public payable;
}
```

### Features
- **ERC721 Standard**: Full NFT compatibility
- **On-chain Metadata**: JSON metadata stored on blockchain
- **Dynamic SVG**: Generated artwork for each NFT
- **Pausable**: Owner can pause minting if needed
- **Burnable**: NFTs can be burned by owners

## 🎨 NFT Metadata Structure

Each NFT includes:
- **Original Text**: The text that was translated
- **Emoji Message**: The emoji translation
- **Creation Date**: When the NFT was minted
- **Length**: Character count of original text
- **Dynamic SVG**: Visual representation with Celo branding

## 🌍 Network Configuration

### Alfajores Testnet
- **RPC URL**: https://alfajores-forno.celo-testnet.org
- **Chain ID**: 44787
- **Explorer**: https://alfajores.celoscan.io
- **Faucet**: https://faucet.celo.org/alfajores

### Mainnet (Future)
- **RPC URL**: https://forno.celo.org
- **Chain ID**: 42220
- **Explorer**: https://celoscan.io

## 🔐 Security Features

- **Input Validation**: All inputs validated before minting
- **Reentrancy Protection**: Standard OpenZeppelin protections
- **Access Control**: Owner-only functions for contract management
- **Pausable**: Emergency stop functionality

## 🎯 Future Enhancements

- [ ] **IPFS Integration**: Store larger images on IPFS
- [ ] **Marketplace**: Built-in NFT trading functionality
- [ ] **Social Features**: Share and like emoji creations
- [ ] **Mobile App**: Native mobile application
- [ ] **Layer 2**: Optimize for lower gas costs
- [ ] **Gamification**: Rewards for creative translations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Celo Foundation**: For the amazing blockchain platform
- **OpenZeppelin**: For secure smart contract libraries
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Join the Celo Discord community
- Check the deployment guide for troubleshooting

---

Built with ❤️ for the Celo ecosystem! 🌱
