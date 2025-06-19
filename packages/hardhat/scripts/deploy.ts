import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Get the contract factory
  const MiniPay = await ethers.getContractFactory("MiniPay");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the balance of the deployer
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");

  // Deploy the contract
  console.log("Deploying MiniPay contract...");
  const miniPay = await MiniPay.deploy(deployer.address);

  // Wait for the deployment to be confirmed
  await miniPay.waitForDeployment();

  const contractAddress = await miniPay.getAddress();
  console.log("MiniPay deployed to:", contractAddress);

  // Save the contract address to a file for frontend use
  const fs = require("fs");
  const contractAddresses = {
    MiniPay: contractAddress,
    deployer: deployer.address,
    network: "alfajores",
    deploymentTime: new Date().toISOString(),
  };

  // Create the deployments directory if it doesn't exist
  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save contract addresses
  fs.writeFileSync(
    `${deploymentsDir}/alfajores-addresses.json`,
    JSON.stringify(contractAddresses, null, 2)
  );

  console.log("Contract addresses saved to deployments/alfajores-addresses.json");

  // Verify the contract on Celoscan (optional but recommended)
  console.log("Waiting for block confirmations...");
  await miniPay.deploymentTransaction()?.wait(5);

  console.log("Deployment completed successfully!");
  console.log("Next steps:");
  console.log("1. Verify the contract on Celoscan if needed");
  console.log("2. Update the frontend with the new contract address");
  console.log("3. Test the contract functionality");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
