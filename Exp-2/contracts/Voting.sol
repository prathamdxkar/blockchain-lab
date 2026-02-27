// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Voting
 * @notice A simple on-chain voting contract that supports candidate registration,
 *         vote casting with double-vote protection, and winner determination.
 *
 * @dev  Experiment 2 — Develop and Establish Smart Contract and Chain Code
 *       Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 *
 * Capabilities:
 *   - Owner deploys the contract supplying an initial list of candidate names.
 *   - Owner can extend the candidate list after deployment via addCandidate().
 *   - Any address may cast exactly one vote for any valid candidate index.
 *   - Attempting to vote twice reverts with "Already voted".
 *   - Attempting to vote for a non-existent index reverts with "Invalid candidate index".
 *   - getCandidates() returns the full candidate array for off-chain enumeration.
 *   - getWinner() returns the candidate with the highest vote count.
 *
 * Security notes:
 *   - Checks-Effects-Interactions pattern applied in castVote().
 *   - onlyOwner modifier guards addCandidate().
 *   - No ETH is handled — no payable functions, no re-entrancy risk.
 */
contract Voting {
    // ─────────────────────────────────────────────────────────────────────────
    // Data Structures
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Represents a single candidate in the election.
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // State Variables
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Dynamic array of all registered candidates.
    Candidate[] public candidates;

    /// @notice Tracks which addresses have already cast a vote.
    mapping(address => bool) public hasVoted;

    /// @notice Address of the contract deployer — the election administrator.
    address public owner;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Emitted when a new candidate is added to the election.
    /// @param name The name of the newly added candidate.
    event CandidateAdded(string indexed name);

    /// @notice Emitted when a voter successfully casts their vote.
    /// @param candidateIndex Index of the candidate in the candidates array.
    /// @param voter          Address of the account that cast the vote.
    event VoteCast(uint256 indexed candidateIndex, address indexed voter);

    // ─────────────────────────────────────────────────────────────────────────
    // Modifiers
    // ─────────────────────────────────────────────────────────────────────────

    /// @dev Restricts a function to the contract owner only.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Deploys the Voting contract and populates the initial candidate list.
     * @dev    Each name in candidateNames is pushed as a Candidate with voteCount = 0.
     *         The deployer's address is stored as owner.
     * @param candidateNames  Array of candidate name strings for the election.
     */
    constructor(string[] memory candidateNames) {
        owner = msg.sender;
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({ name: candidateNames[i], voteCount: 0 }));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Owner Functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Registers a new candidate in the election.
     * @dev    Only callable by the owner. Emits CandidateAdded.
     * @param name  Name of the candidate to add.
     */
    function addCandidate(string memory name) external onlyOwner {
        candidates.push(Candidate({ name: name, voteCount: 0 }));
        emit CandidateAdded(name);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Voter Functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Casts a vote for the candidate at the given index.
     * @dev    Checks-Effects-Interactions:
     *           1. CHECK  — hasVoted guard (address has not voted before)
     *           2. CHECK  — bounds guard (candidateIndex is within array range)
     *           3. EFFECT — increment voteCount
     *           4. EFFECT — mark caller as having voted
     *           5. INTERACTION — emit VoteCast event
     *
     *         Reverts with "Already voted" if msg.sender has voted previously.
     *         Reverts with "Invalid candidate index" if candidateIndex is out of bounds.
     * @param candidateIndex  Zero-based index of the candidate to vote for.
     */
    function castVote(uint256 candidateIndex) external {
        // CHECK 1 — Double-vote guard (CDM-2: must be the first statement)
        require(!hasVoted[msg.sender], "Already voted");

        // CHECK 2 — Bounds guard
        require(candidateIndex < candidates.length, "Invalid candidate index");

        // EFFECT 1 — Register the vote
        candidates[candidateIndex].voteCount += 1;

        // EFFECT 2 — Mark voter as having cast their vote
        hasVoted[msg.sender] = true;

        // INTERACTION — Emit event
        emit VoteCast(candidateIndex, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // View Functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns the complete list of candidates with their current vote counts.
     * @dev    Returns memory copy of the candidates storage array.
     *         Suitable for off-chain enumeration in Truffle console or dApp front-ends.
     * @return Array of Candidate structs (name + voteCount) for all registered candidates.
     */
    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    /**
     * @notice Determines and returns the current election winner.
     * @dev    Iterates over the candidates array, tracking the index with the highest
     *         voteCount. If two candidates are tied, the one with the lower index wins
     *         (first-registered precedence — consistent with a simple linear scan).
     *
     *         Reverts with "No candidates registered" if the candidates array is empty.
     * @return winner  The Candidate struct (name + voteCount) of the leading candidate.
     */
    function getWinner() external view returns (Candidate memory winner) {
        require(candidates.length > 0, "No candidates registered");

        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }

        winner = candidates[winnerIndex];
    }
}
