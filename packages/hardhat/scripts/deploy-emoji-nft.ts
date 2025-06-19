import { ethers } from "hardhat";

async function main() {
  console.log("Starting EmojiNFT deployment...");

  // Get the contract factory
  const EmojiNFT = await ethers.getContractFactory("EmojiNFT");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the balance of the deployer
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");

  // Deploy the contract
  console.log("Deploying EmojiNFT contract...");
  const emojiNFT = await EmojiNFT.deploy(deployer.address);

  // Wait for the deployment to be confirmed
  await emojiNFT.waitForDeployment();

  const contractAddress = await emojiNFT.getAddress();
  console.log("EmojiNFT deployed to:", contractAddress);

  // Save the contract address to a file for frontend use
  const fs = require("fs");
  const contractAddresses = {
    EmojiNFT: contractAddress,
    deployer: deployer.address,
    network: "alfajores",
    deploymentTime: new Date().toISOString(),
    mintPrice: "0.001", // in CELO
    maxSupply: 10000,
  };

  // Create the deployments directory if it doesn't exist
  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save contract addresses
  fs.writeFileSync(
    `${deploymentsDir}/emoji-nft-addresses.json`,
    JSON.stringify(contractAddresses, null, 2)
  );

  console.log("Contract addresses saved to deployments/emoji-nft-addresses.json");

  // Test the contract by checking initial values
  console.log("Testing contract deployment...");
  const totalSupply = await emojiNFT.getTotalSupply();
  const mintPrice = await emojiNFT.mintPrice();
  const maxSupply = await emojiNFT.maxSupply();
  
  console.log("Initial total supply:", totalSupply.toString());
  console.log("Mint price:", ethers.formatEther(mintPrice), "CELO");
  console.log("Max supply:", maxSupply.toString());

  // Verify the contract on Celoscan (optional but recommended)
  console.log("Waiting for block confirmations...");
  await emojiNFT.deploymentTransaction()?.wait(5);

  console.log("EmojiNFT deployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Next steps:");
  console.log("1. Update the frontend with the new contract address");
  console.log("2. Test minting functionality");
  console.log("3. Verify the contract on Celoscan if needed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
