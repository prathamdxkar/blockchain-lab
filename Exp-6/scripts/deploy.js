// Hardhat 3 deployment script
// Usage: npx hardhat run scripts/deploy.js --network <network>

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    (await hre.ethers.provider.getBalance(deployer.address)).toString()
  );

  // ─── Deploy Counter ────────────────────────────────────────────────────────
  // Replace 'Counter' with your DApp contract name
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();

  await counter.waitForDeployment();

  const address = await counter.getAddress();
  console.log("Counter deployed to:", address);

  // ─── Post-deploy verification hint ────────────────────────────────────────
  if (hre.network.name !== "hardhat" && hre.network.name !== "anvil") {
    console.log(
      `\nVerify on Etherscan:\n  npx hardhat verify --network ${hre.network.name} ${address}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
