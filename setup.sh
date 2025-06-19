#!/bin/bash

# Pre-deployment Setup Script
# This script helps set up everything needed for deployment

set -e

echo "🚀 Celo Emoji NFT Pre-Deployment Setup"
echo "====================================="

# Get the current account address from private key
cd packages/hardhat

if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your PRIVATE_KEY"
    exit 1
fi

# Get the deployer address
DEPLOYER_ADDRESS=$(npx hardhat run --silent - <<'EOF'
const { ethers } = require("hardhat");
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(deployer.address);
}
main().catch(() => process.exit(1));
EOF
)

echo "📋 Deployer Address: $DEPLOYER_ADDRESS"

# Check balance
echo "💰 Current Balance:"
npx hardhat run --silent --network alfajores - <<EOF
const { ethers } = require("hardhat");
async function main() {
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Balance:", ethers.formatEther(balance), "CELO");
    
    // Check if balance is sufficient (need at least 0.1 CELO for deployment)
    const minBalance = ethers.parseEther("0.1");
    if (balance < minBalance) {
        console.log("❌ Insufficient balance for deployment");
        console.log("Need at least 0.1 CELO, have", ethers.formatEther(balance), "CELO");
        process.exit(1);
    } else {
        console.log("✅ Sufficient balance for deployment");
    }
}
main();
EOF

if [ $? -ne 0 ]; then
    echo ""
    echo "💸 GET TEST CELO:"
    echo "=================="
    echo "1. Go to: https://faucet.celo.org/alfajores"
    echo "2. Enter your address: $DEPLOYER_ADDRESS"
    echo "3. Click 'Get CELO' to receive test tokens"
    echo "4. Wait for the transaction to confirm"
    echo "5. Run this script again to check balance"
    echo ""
    echo "You can also use Discord faucet:"
    echo "Join: https://discord.com/invite/6yWMkgM"
    echo "Go to #faucet channel and type: /faucet $DEPLOYER_ADDRESS"
    exit 1
fi

echo ""
echo "🎯 READY FOR DEPLOYMENT!"
echo "========================"
echo "Your account has sufficient balance."
echo "Run the deployment script: ./deploy.sh"
