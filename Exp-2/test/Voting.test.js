/**
 * Voting Contract — Hardhat / Mocha / Chai Test Suite
 *
 * Covers all state-mutating and view functions of contracts/Voting.sol:
 *   ✓ TC-1  Initial state — 3 candidates, all voteCount = 0
 *   ✓ TC-2  castVote(0) increments Alice's voteCount to 1
 *   ✓ TC-3  Double castVote reverts with "Already voted"
 *   ✓ TC-4  castVote with out-of-bounds index reverts with "Invalid candidate index"
 *   ✓ TC-5  VoteCast event is emitted with correct candidateIndex and voter args
 *   ✓ TC-6  getWinner() returns the candidate with the highest vote count
 *   ✓ TC-7  addCandidate() appends a new candidate (owner only)
 *   ✓ TC-8  addCandidate() reverts when called by a non-owner address
 *
 * Run with: npx hardhat test
 * Or:       npm run test
 *
 * Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */

const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Voting", function () {
  // ─────────────────────────────────────────────────────────────────────────
  // Shared variables (re-initialised in beforeEach for test isolation)
  // ─────────────────────────────────────────────────────────────────────────
  let voting;
  let owner;
  let addr1;
  let addr2;

  // Initial candidate names used for all deployments
  const CANDIDATES = ["Alice", "Bob", "Charlie"];

  // ─────────────────────────────────────────────────────────────────────────
  // beforeEach — deploy a fresh Voting instance for every test case
  // ─────────────────────────────────────────────────────────────────────────
  beforeEach(async function () {
    // Retrieve test signers from the Hardhat in-process network
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a fresh contract before each test
    const VotingFactory = await ethers.getContractFactory("Voting");
    voting = await VotingFactory.deploy(CANDIDATES);
    await voting.waitForDeployment();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-1: Initial State
  // ─────────────────────────────────────────────────────────────────────────
  describe("Initial State", function () {
    it("TC-1: getCandidates() returns 3 candidates with voteCount 0", async function () {
      const candidates = await voting.getCandidates();

      expect(candidates.length).to.equal(3);

      expect(candidates[0].name).to.equal("Alice");
      expect(candidates[0].voteCount).to.equal(0n);

      expect(candidates[1].name).to.equal("Bob");
      expect(candidates[1].voteCount).to.equal(0n);

      expect(candidates[2].name).to.equal("Charlie");
      expect(candidates[2].voteCount).to.equal(0n);
    });

    it("TC-1b: owner is set to the deployer address", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-2: Successful Vote
  // ─────────────────────────────────────────────────────────────────────────
  describe("castVote — success path", function () {
    it("TC-2: castVote(0) increments Alice voteCount from 0 to 1", async function () {
      // Cast vote for candidate index 0 (Alice) from addr1
      await voting.connect(addr1).castVote(0);

      const candidates = await voting.getCandidates();
      expect(candidates[0].voteCount).to.equal(1n);

      // Bob and Charlie should remain at 0
      expect(candidates[1].voteCount).to.equal(0n);
      expect(candidates[2].voteCount).to.equal(0n);
    });

    it("TC-2b: hasVoted is true for addr1 after casting a vote", async function () {
      expect(await voting.hasVoted(addr1.address)).to.equal(false);

      await voting.connect(addr1).castVote(1);

      expect(await voting.hasVoted(addr1.address)).to.equal(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-3: Double-Vote Revert
  // ─────────────────────────────────────────────────────────────────────────
  describe("castVote — double-vote guard (CDM-2)", function () {
    it("TC-3: casting a second vote from the same address reverts with 'Already voted'", async function () {
      // First vote succeeds
      await voting.connect(addr1).castVote(0);

      // Second vote from the same address must revert
      await expect(
        voting.connect(addr1).castVote(0)
      ).to.be.revertedWith("Already voted");
    });

    it("TC-3b: two different addresses can each vote once", async function () {
      // addr1 votes for Alice, addr2 votes for Bob — both should succeed
      await voting.connect(addr1).castVote(0);
      await voting.connect(addr2).castVote(1);

      const candidates = await voting.getCandidates();
      expect(candidates[0].voteCount).to.equal(1n);
      expect(candidates[1].voteCount).to.equal(1n);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-4: Invalid Index Revert
  // ─────────────────────────────────────────────────────────────────────────
  describe("castVote — bounds guard", function () {
    it("TC-4: castVote with out-of-bounds index (99) reverts with 'Invalid candidate index'", async function () {
      await expect(
        voting.connect(addr1).castVote(99)
      ).to.be.revertedWith("Invalid candidate index");
    });

    it("TC-4b: castVote with index equal to candidates length reverts", async function () {
      // candidates.length is 3, so index 3 is out of bounds
      await expect(
        voting.connect(addr1).castVote(3)
      ).to.be.revertedWith("Invalid candidate index");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-5: VoteCast Event Emission
  // ─────────────────────────────────────────────────────────────────────────
  describe("VoteCast event", function () {
    it("TC-5: castVote(0) emits VoteCast with candidateIndex=0 and voter=addr1", async function () {
      await expect(voting.connect(addr1).castVote(0))
        .to.emit(voting, "VoteCast")
        .withArgs(0n, addr1.address);
    });

    it("TC-5b: castVote(2) emits VoteCast with candidateIndex=2 and voter=addr2", async function () {
      await expect(voting.connect(addr2).castVote(2))
        .to.emit(voting, "VoteCast")
        .withArgs(2n, addr2.address);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-6: getWinner
  // ─────────────────────────────────────────────────────────────────────────
  describe("getWinner()", function () {
    it("TC-6: returns Alice after addr1 and addr2 both vote for Alice (index 0)", async function () {
      await voting.connect(addr1).castVote(0);
      await voting.connect(addr2).castVote(0);

      const winner = await voting.getWinner();
      expect(winner.name).to.equal("Alice");
      expect(winner.voteCount).to.equal(2n);
    });

    it("TC-6b: returns Bob if Bob has the most votes", async function () {
      // addr1 votes Alice, addr2 votes Bob — both have 1 vote
      // First-registered precedence means Alice wins on tie at lower index
      // To make Bob win, we need Bob to have strictly more votes
      // Use owner to add a third voter then vote Bob twice
      const [, , , addr3] = await ethers.getSigners();

      await voting.connect(addr1).castVote(0); // Alice = 1
      await voting.connect(addr2).castVote(1); // Bob = 1
      await voting.connect(addr3).castVote(1); // Bob = 2

      const winner = await voting.getWinner();
      expect(winner.name).to.equal("Bob");
      expect(winner.voteCount).to.equal(2n);
    });

    it("TC-6c: getWinner reverts if no candidates registered", async function () {
      // Deploy a fresh Voting with no candidates
      const VotingFactory = await ethers.getContractFactory("Voting");
      const emptyVoting = await VotingFactory.deploy([]);
      await emptyVoting.waitForDeployment();

      await expect(emptyVoting.getWinner()).to.be.revertedWith(
        "No candidates registered"
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-7 & TC-8: addCandidate
  // ─────────────────────────────────────────────────────────────────────────
  describe("addCandidate()", function () {
    it("TC-7: owner can add a new candidate; getCandidates length increases to 4", async function () {
      await voting.connect(owner).addCandidate("Dave");

      const candidates = await voting.getCandidates();
      expect(candidates.length).to.equal(4);
      expect(candidates[3].name).to.equal("Dave");
      expect(candidates[3].voteCount).to.equal(0n);
    });

    it("TC-7b: addCandidate emits CandidateAdded event with the correct name", async function () {
      await expect(voting.connect(owner).addCandidate("Eve"))
        .to.emit(voting, "CandidateAdded")
        .withArgs("Eve");
    });

    it("TC-8: non-owner calling addCandidate reverts with 'Only owner can call this function'", async function () {
      await expect(
        voting.connect(addr1).addCandidate("Mallory")
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
});
