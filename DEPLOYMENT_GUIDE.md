# Step-by-Step Deployment Instructions

This guide will help you deploy the EmojiNFT smart contract to the Celo Alfajores testnet.

## Prerequisites

1. **Install a Web3 Wallet**: Install MetaMask or Valora wallet
2. **Add Celo Alfajores Network**: Add the Alfajores testnet to your wallet
3. **Get Test CELO**: Get some test CELO from the faucet

## Alfajores Testnet Configuration

- **Network Name**: Celo Alfajores Testnet
- **RPC URL**: https://alfajores-forno.celo-testnet.org
- **Chain ID**: 44787
- **Currency Symbol**: CELO
- **Block Explorer**: https://alfajores.celoscan.io

## Deployment Steps

### 1. Set Up Environment Variables

Create a `.env` file in the `packages/hardhat` directory:

```bash
# Your wallet's private key (DO NOT SHARE THIS!)
PRIVATE_KEY=your_private_key_here

# Optional: Celoscan API key for contract verification
CELOSCAN_API_KEY=your_celoscan_api_key_here
```

**Important**: Never commit your private key to version control!

### 2. Get Test CELO

1. Go to the [Celo Alfajores Faucet](https://faucet.celo.org/alfajores)
2. Enter your wallet address
3. Request test CELO tokens

### 3. Compile the Contracts

```bash
cd packages/hardhat
npx hardhat compile
```

### 4. Deploy the EmojiNFT Contract

```bash
npx hardhat run scripts/deploy-emoji-nft.ts --network alfajores
```

### 5. Update Frontend Configuration

After successful deployment:

1. Copy the deployed contract address from the console output
2. Update the `EMOJI_NFT_CONTRACT` address in `packages/react-app/contexts/useEmojiWeb3.ts`
3. Replace the placeholder address with your deployed contract address

### 6. Test the Application

```bash
cd packages/react-app
npm run dev
```

## Expected Output

After successful deployment, you should see:

```
EmojiNFT deployed to: 0x1234567890123456789012345678901234567890
Contract addresses saved to deployments/emoji-nft-addresses.json
```

## Troubleshooting

### "Insufficient Funds" Error
- Make sure you have enough test CELO in your wallet
- Visit the faucet to get more test tokens

### "Private Key Too Short" Error
- Ensure your private key is correctly formatted (64 characters)
- Make sure it starts with `0x` if needed

### "Network Connection" Error
- Check your internet connection
- Verify the RPC URL is correct

## Security Notes

- Never use your mainnet private key for testing
- Create a separate wallet for development
- Keep your private key secure and never share it
- The default private key in the config is for testing only

## Next Steps

After deployment:

1. **Verify Contract**: Optionally verify your contract on Celoscan
2. **Test Minting**: Try minting some emoji NFTs through the frontend
3. **Check Gallery**: View your minted NFTs in the gallery section

## Contract Features

The EmojiNFT contract includes:

- **Mint Price**: 0.001 CELO per NFT
- **Max Supply**: 10,000 NFTs
- **On-chain Metadata**: All metadata stored on-chain
- **SVG Generation**: Dynamic SVG images generated on-chain
- **Owner Functions**: Pause, unpause, and withdraw functions

## Frontend Features

The enhanced frontend includes:

- **Wallet Connection**: Connect MetaMask/Valora wallet
- **NFT Minting**: Mint emoji translations as NFTs
- **NFT Gallery**: View your minted NFTs
- **Contract Info**: Display contract statistics
- **Dark Mode**: Support for light/dark themes

Enjoy creating and minting your emoji NFTs! 🎉
