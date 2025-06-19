#!/bin/bash

# Celo Emoji NFT Deployment Script
# This script helps deploy the contract and update the frontend configuration

set -e

echo "🎨 Celo Emoji NFT Deployment Script"
echo "=================================="

# Change to hardhat directory
cd packages/hardhat

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your PRIVATE_KEY"
    echo "You can copy from .env.template:"
    echo "cp .env.template .env"
    exit 1
fi

# Check if private key is set
if ! grep -q "PRIVATE_KEY=" .env || grep -q "PRIVATE_KEY=\"\"" .env || grep -q "PRIVATE_KEY=" .env | grep -q "your_private_key_here"; then
    echo "❌ Private key not configured!"
    echo "Please add your private key to the .env file"
    echo "PRIVATE_KEY=your_actual_private_key_here"
    exit 1
fi

echo "✅ Environment configured"

# Compile contracts
echo "📝 Compiling contracts..."
npx hardhat compile

if [ $? -eq 0 ]; then
    echo "✅ Contracts compiled successfully"
else
    echo "❌ Contract compilation failed"
    exit 1
fi

# Deploy to Alfajores
echo "🚀 Deploying EmojiNFT to Alfajores testnet..."
npx hardhat run scripts/deploy-emoji-nft.ts --network alfajores

if [ $? -eq 0 ]; then
    echo "✅ Contract deployed successfully"
else
    echo "❌ Contract deployment failed"
    exit 1
fi

# Check if deployment addresses file exists
if [ -f deployments/emoji-nft-addresses.json ]; then
    CONTRACT_ADDRESS=$(jq -r '.EmojiNFT' deployments/emoji-nft-addresses.json)
    echo "📋 Contract Address: $CONTRACT_ADDRESS"
    
    # Update frontend configuration
    echo "🔧 Updating frontend configuration..."
    
    FRONTEND_FILE="../react-app/contexts/useEmojiWeb3.ts"
    
    if [ -f "$FRONTEND_FILE" ]; then
        # Create backup
        cp "$FRONTEND_FILE" "$FRONTEND_FILE.backup"
        
        # Update the contract address
        sed -i "s/const EMOJI_NFT_CONTRACT = \"0x0000000000000000000000000000000000000000\";/const EMOJI_NFT_CONTRACT = \"$CONTRACT_ADDRESS\";/" "$FRONTEND_FILE"
        
        echo "✅ Frontend configuration updated"
        echo "📁 Backup created: $FRONTEND_FILE.backup"
    else
        echo "⚠️  Frontend file not found: $FRONTEND_FILE"
    fi
else
    echo "⚠️  Deployment addresses file not found"
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo "Contract Address: $CONTRACT_ADDRESS"
echo "Network: Alfajores Testnet"
echo "Explorer: https://alfajores.celoscan.io/address/$CONTRACT_ADDRESS"
echo ""
echo "Next Steps:"
echo "1. Start the frontend: cd packages/react-app && npm run dev"
echo "2. Connect your wallet to the app"
echo "3. Try minting some emoji NFTs!"
echo ""
echo "📚 For more information, check the DEPLOYMENT_GUIDE.md"
