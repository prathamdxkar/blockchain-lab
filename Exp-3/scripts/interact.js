// File: scripts/interact.js
// Web3.js post-deploy interaction script for MessageBoard — Exp-3 (ITL801)
//
// Prerequisites:
//   1. MessageBoard is already deployed to Sepolia (via Phase 6).
//   2. Exp-3/.env contains ALCHEMY_API_KEY and PRIVATE_KEY.
//   3. Set CONTRACT_ADDRESS below to the address from Phase 6 deploy output.
//
// Run with:
//   node scripts/interact.js
//
// Expected output:
//   Deployer address : 0x<ADDR>
//   Sending postMessage("Hello from Web3.js on Sepolia!") ...
//   ✅ postMessage tx hash : 0x<TX_HASH>
//   Fetching messages for deployer ...
//   ✅ Messages returned: 1
//      [0] content   : "Hello from Web3.js on Sepolia!"
//          sender    : 0x<ADDR>
//          timestamp : <UNIX_SECONDS>
//   Total message count on contract: 1

"use strict";

require("dotenv").config();
const { Web3 } = require("web3");

// ─── Configuration ────────────────────────────────────────────────────────────

/**
 * @dev Replace this with the actual deployed contract address on Sepolia
 *      (obtained from Phase 6 — Hardhat Ignition deploy output).
 *
 * Example:
 *   const CONTRACT_ADDRESS = "0xABC123...";
 */
const CONTRACT_ADDRESS = process.env.MESSAGE_BOARD_ADDRESS || "";

// ─── Validation ───────────────────────────────────────────────────────────────

if (!process.env.ALCHEMY_API_KEY) {
  console.error("❌  ALCHEMY_API_KEY is not set in .env");
  process.exit(1);
}

if (!process.env.PRIVATE_KEY) {
  console.error("❌  PRIVATE_KEY is not set in .env");
  process.exit(1);
}

if (!CONTRACT_ADDRESS) {
  console.error(
    "❌  MESSAGE_BOARD_ADDRESS is not set.\n" +
    "    Either set it in .env or update CONTRACT_ADDRESS in this script.\n" +
    "    Run Phase 6 (Sepolia deploy) first to obtain the contract address."
  );
  process.exit(1);
}

// ─── ABI ──────────────────────────────────────────────────────────────────────

// Load ABI from Hardhat compilation artifact.
const artifact = require("../artifacts/contracts/MessageBoard.sol/MessageBoard.json");
const ABI = artifact.abi;

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Instantiate Web3 with Alchemy Sepolia RPC endpoint.
  const web3 = new Web3(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  );

  // 2. Load deployer account from private key and add to wallet.
  // Web3.js v4 requires a 0x-prefixed key. Normalise regardless of .env format.
  const rawKey = process.env.PRIVATE_KEY;
  const normalizedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const account = web3.eth.accounts.privateKeyToAccount(normalizedKey);
  web3.eth.accounts.wallet.add(account);
  const deployerAddress = account.address;

  console.log("\n──────────────────────────────────────────────────");
  console.log(" MessageBoard — Web3.js Interaction Script (Exp-3)");
  console.log("──────────────────────────────────────────────────");
  console.log(`Deployer address   : ${deployerAddress}`);
  console.log(`Contract address   : ${CONTRACT_ADDRESS}`);
  console.log(`Network            : Sepolia (Chain ID 11155111)`);
  console.log("──────────────────────────────────────────────────\n");

  // 3. Instantiate the contract.
  const board = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  // 4. Call postMessage (state-changing — sends a real on-chain transaction).
  const messageContent = "Hello from Web3.js on Sepolia!";
  console.log(`Sending postMessage("${messageContent}") ...`);

  const gasEstimate = await board.methods
    .postMessage(messageContent)
    .estimateGas({ from: deployerAddress });

  const receipt = await board.methods
    .postMessage(messageContent)
    .send({
      from:     deployerAddress,
      gas:      Math.ceil(Number(gasEstimate) * 1.2), // 20% buffer
    });

  console.log(`✅  postMessage tx hash : ${receipt.transactionHash}`);
  console.log(
    `    Block number       : ${receipt.blockNumber}\n`
  );

  // 5. Call getMessages (read-only — no transaction, no gas).
  console.log(`Fetching messages for deployer (${deployerAddress}) ...`);

  const messages = await board.methods.getMessages(deployerAddress).call();
  console.log(`✅  Messages returned: ${messages.length}`);

  messages.forEach((msg, idx) => {
    console.log(`   [${idx}] content   : "${msg.content}"`);
    console.log(`        sender    : ${msg.sender}`);
    console.log(`        timestamp : ${msg.timestamp}\n`);
  });

  // 6. Call getTotalCount (read-only).
  const totalCount = await board.methods.getTotalCount().call();
  console.log(`Total message count on contract: ${totalCount}`);
  console.log("──────────────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error("❌  Script failed:", err.message || err);
  process.exit(1);
});
