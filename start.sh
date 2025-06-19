#!/bin/bash

# Complete Deployment and Testing Script
# This script automates the entire deployment and testing process

set -e

echo "🎨 Celo Emoji NFT - Complete Deployment & Testing"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "packages" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Step 1: Setup and Balance Check
echo ""
echo "📋 Step 1: Checking setup and balance..."
./setup.sh

if [ $? -ne 0 ]; then
    echo "❌ Setup check failed. Please get test CELO first."
    exit 1
fi

# Step 2: Deploy Contract
echo ""
echo "🚀 Step 2: Deploying smart contract..."
./deploy.sh

if [ $? -ne 0 ]; then
    echo "❌ Contract deployment failed"
    exit 1
fi

# Step 3: Verify Deployment
echo ""
echo "✅ Step 3: Verifying deployment..."

CONTRACT_ADDRESS=""
if [ -f "packages/hardhat/deployments/emoji-nft-addresses.json" ]; then
    CONTRACT_ADDRESS=$(jq -r '.EmojiNFT' packages/hardhat/deployments/emoji-nft-addresses.json)
    echo "Contract deployed at: $CONTRACT_ADDRESS"
else
    echo "❌ Deployment file not found"
    exit 1
fi

# Step 4: Test Frontend Build
echo ""
echo "🏗️  Step 4: Testing frontend build..."
cd packages/react-app
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Step 5: Start Development Server
echo ""
echo "🌐 Step 5: Starting development server..."
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "📋 Deployment Summary:"
echo "- Contract Address: $CONTRACT_ADDRESS"
echo "- Network: Celo Alfajores Testnet"
echo "- Explorer: https://alfajores.celoscan.io/address/$CONTRACT_ADDRESS"
echo "- Frontend: Starting on http://localhost:3000"
echo ""
echo "🔗 Next Steps:"
echo "1. Frontend is starting automatically"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Connect your wallet (MetaMask/Valora)"
echo "4. Create an emoji translation"
echo "5. Mint your first NFT!"
echo ""
echo "📚 Documentation:"
echo "- README_NFT.md - Complete feature documentation"
echo "- DEPLOYMENT_GUIDE.md - Detailed deployment guide"
echo "- IMPLEMENTATION_STATUS.md - Technical implementation details"
echo ""
echo "🎨 Happy minting! 🚀"

# Start the development server
npm run dev
