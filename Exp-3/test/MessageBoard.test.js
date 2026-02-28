// File: test/MessageBoard.test.js
// Hardhat test suite for MessageBoard.sol — Exp-3 (ITL801, University of Mumbai)
//
// Run with:  npx hardhat test
//
// Test coverage:
//   1. Constructor — messageCount initialised at zero
//   2. postMessage — emits MessagePosted event with correct args
//   3. postMessage — reverts on empty string input
//   4. getMessages — returns correct single message after one post
//   5. getMessages — returns two messages after two posts by same address
//   6. getTotalCount — increments with each post (single sender)
//   7. getTotalCount — increments across multiple senders
//   8. getMessages — returns empty array for address with no posts

"use strict";

const { expect }  = require("chai");
const { ethers }  = require("hardhat");

describe("MessageBoard", function () {

  // ─── Shared State ─────────────────────────────────────────────────────────

  let board;        // contract instance (refreshed per test)
  let owner;        // default signer (accounts[0])
  let addr1;        // secondary signer (accounts[1])
  let addr2;        // tertiary signer (accounts[2])

  // ─── beforeEach ───────────────────────────────────────────────────────────

  /**
   * Deploy a fresh MessageBoard contract before each test.
   * Using a fresh deploy per test (not per suite) guarantees full isolation —
   * state from one test cannot bleed into another.
   */
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MessageBoardFactory = await ethers.getContractFactory("MessageBoard");
    board = await MessageBoardFactory.deploy();
    await board.waitForDeployment();
  });

  // ─── Test: Constructor ────────────────────────────────────────────────────

  describe("Constructor", function () {

    it("1. initialises messageCount at zero", async function () {
      expect(await board.messageCount()).to.equal(0n);
    });

  });

  // ─── Test: postMessage ────────────────────────────────────────────────────

  describe("postMessage()", function () {

    it("2. emits MessagePosted event with correct sender and content", async function () {
      const content = "Hello, Sepolia!";
      const tx = board.connect(owner).postMessage(content);

      await expect(tx)
        .to.emit(board, "MessagePosted")
        .withArgs(owner.address, content, await getTimestampOf(tx));
    });

    it("3. reverts when content is an empty string", async function () {
      await expect(
        board.connect(owner).postMessage("")
      ).to.be.revertedWith("MessageBoard: content cannot be empty");
    });

    it("4. increments messageCount by 1 after a single post", async function () {
      await board.connect(owner).postMessage("First message");
      expect(await board.messageCount()).to.equal(1n);
    });

  });

  // ─── Test: getMessages ────────────────────────────────────────────────────

  describe("getMessages()", function () {

    it("5. returns array of length 1 with correct content after one post", async function () {
      const content = "My first on-chain message";
      await board.connect(addr1).postMessage(content);

      const messages = await board.getMessages(addr1.address);
      expect(messages.length).to.equal(1);
      expect(messages[0].content).to.equal(content);
      expect(messages[0].sender).to.equal(addr1.address);
    });

    it("6. returns two messages in order after two posts by the same address", async function () {
      await board.connect(addr1).postMessage("Message one");
      await board.connect(addr1).postMessage("Message two");

      const messages = await board.getMessages(addr1.address);
      expect(messages.length).to.equal(2);
      expect(messages[0].content).to.equal("Message one");
      expect(messages[1].content).to.equal("Message two");
    });

    it("7. returns empty array for an address that has never posted", async function () {
      const messages = await board.getMessages(addr2.address);
      expect(messages.length).to.equal(0);
    });

    it("8. does not mix messages between different senders", async function () {
      await board.connect(addr1).postMessage("From addr1");
      await board.connect(addr2).postMessage("From addr2");

      const msgsAddr1 = await board.getMessages(addr1.address);
      const msgsAddr2 = await board.getMessages(addr2.address);

      expect(msgsAddr1.length).to.equal(1);
      expect(msgsAddr1[0].content).to.equal("From addr1");
      expect(msgsAddr2.length).to.equal(1);
      expect(msgsAddr2[0].content).to.equal("From addr2");
    });

  });

  // ─── Test: getTotalCount ──────────────────────────────────────────────────

  describe("getTotalCount()", function () {

    it("9. returns zero before any posts", async function () {
      expect(await board.getTotalCount()).to.equal(0n);
    });

    it("10. increments correctly across multiple senders", async function () {
      await board.connect(owner).postMessage("Owner post");
      await board.connect(addr1).postMessage("addr1 post");
      await board.connect(addr2).postMessage("addr2 post");

      expect(await board.getTotalCount()).to.equal(3n);
    });

    it("11. messageCount and getTotalCount stay in sync", async function () {
      await board.connect(owner).postMessage("post A");
      await board.connect(owner).postMessage("post B");

      const count = await board.messageCount();
      const total = await board.getTotalCount();
      expect(count).to.equal(total);
      expect(total).to.equal(2n);
    });

  });

  // ─── Test: Timestamp ─────────────────────────────────────────────────────

  describe("Message timestamp", function () {

    it("12. timestamp on stored message is non-zero", async function () {
      await board.connect(owner).postMessage("Timestamp check");
      const messages = await board.getMessages(owner.address);
      expect(messages[0].timestamp).to.be.greaterThan(0n);
    });

  });

});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * @dev Helper to extract block.timestamp from a pending transaction.
 *      Used in the event emission test to match the on-chain timestamp.
 *      Awaits the tx, fetches the block, and returns the timestamp.
 * @param  txPromise A Promise resolving to a ContractTransaction.
 * @returns {Promise<bigint>} The block timestamp as a BigInt.
 */
async function getTimestampOf(txPromise) {
  const tx      = await txPromise;
  const receipt = await tx.wait();
  const block   = await ethers.provider.getBlock(receipt.blockNumber);
  return BigInt(block.timestamp);
}
