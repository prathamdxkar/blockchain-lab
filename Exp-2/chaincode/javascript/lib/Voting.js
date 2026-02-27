"use strict";

/**
 * @file  Voting.js — Hyperledger Fabric Chaincode (Conceptual Skeleton)
 *
 * @description
 *   This chaincode class mirrors the `Voting.sol` Solidity smart contract to
 *   demonstrate the structural and semantic parallel between:
 *
 *     Ethereum (Solidity)          ↔   Hyperledger Fabric (Chaincode)
 *     ──────────────────────────────────────────────────────────────────
 *     mapping(address => bool)     ↔   ctx.stub.getState(key) / putState(key, val)
 *     candidates[]                 ↔   World State key-value store
 *     castVote(candidateIndex)     ↔   castVote(ctx, candidateId)
 *     getCandidates()              ↔   getResults(ctx)
 *     event VoteCast(...)          ↔   ctx.stub.setEvent("VoteCast", payload)
 *
 * @note  CONCEPTUAL SKELETON ONLY — not deployable as-is in Exp-2.
 *        The `fabric-contract-api` package is referenced but NOT installed in
 *        Exp-2/node_modules. Running require("fabric-contract-api") here will
 *        fail intentionally — this is expected.
 *        Full HLF chaincode deployment is performed in Exp-5.
 *
 * Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */

const { Contract } = require("fabric-contract-api");

/**
 * VotingChaincode
 *
 * A Hyperledger Fabric smart contract that manages a simple election on the
 * permissioned ledger. Candidates are stored as key-value records in the
 * HLF World State. Voters are tracked in a separate namespace to prevent
 * double-voting.
 *
 * World State key conventions:
 *   - Candidate record : "CANDIDATE_{candidateId}"
 *     Value (JSON)      : { "id": string, "name": string, "voteCount": number }
 *   - Voter record      : "VOTER_{voterMSPId}_{voterCN}"
 *     Value (string)    : "1" (presence indicates the voter has cast a vote)
 */
class VotingChaincode extends Contract {
  /**
   * InitLedger
   *
   * Seeds the ledger with initial candidates. Analogous to the Voting.sol
   * constructor that accepts string[] memory candidateNames.
   *
   * In HLF, the constructor equivalent is the `Init` transaction, or a
   * dedicated `InitLedger` chaincode function called once after deployment.
   *
   * @param {Context} ctx  - Hyperledger Fabric transaction context
   */
  async InitLedger(ctx) {
    const initialCandidates = [
      { id: "0", name: "Alice", voteCount: 0 },
      { id: "1", name: "Bob", voteCount: 0 },
      { id: "2", name: "Charlie", voteCount: 0 },
    ];

    for (const candidate of initialCandidates) {
      const key = `CANDIDATE_${candidate.id}`;
      await ctx.stub.putState(key, Buffer.from(JSON.stringify(candidate)));
    }
  }

  /**
   * castVote
   *
   * Records a vote for the specified candidate in the World State.
   * Analogous to Voting.sol castVote(uint256 candidateIndex).
   *
   * Double-vote protection: checks VOTER_{identity} key before recording.
   * If the voter identity already exists in the World State, the transaction
   * reverts with an error (HLF error propagation rather than EVM revert).
   *
   * @param {Context} ctx         - HLF transaction context
   * @param {string}  candidateId - String ID of the candidate to vote for
   */
  async castVote(ctx, candidateId) {
    // ── Derive a unique voter identity key from the client MSP identity ──
    const clientID = ctx.clientIdentity.getID();
    const voterKey = `VOTER_${clientID}`;

    // CHECK 1 — Double-vote guard (mirrors hasVoted[msg.sender] in Voting.sol)
    const existingVote = await ctx.stub.getState(voterKey);
    if (existingVote && existingVote.length > 0) {
      throw new Error(`Voter ${clientID} has already cast a vote`);
    }

    // CHECK 2 — Candidate existence guard
    const candidateKey = `CANDIDATE_${candidateId}`;
    const candidateBytes = await ctx.stub.getState(candidateKey);
    if (!candidateBytes || candidateBytes.length === 0) {
      throw new Error(`Candidate ${candidateId} does not exist`);
    }

    // EFFECT 1 — Increment vote count in the candidate record
    const candidate = JSON.parse(candidateBytes.toString());
    candidate.voteCount += 1;
    await ctx.stub.putState(candidateKey, Buffer.from(JSON.stringify(candidate)));

    // EFFECT 2 — Mark identity as having voted
    await ctx.stub.putState(voterKey, Buffer.from("1"));

    // INTERACTION — Emit a chaincode event (analogous to Solidity event VoteCast)
    const eventPayload = Buffer.from(
      JSON.stringify({ candidateId, voter: clientID })
    );
    ctx.stub.setEvent("VoteCast", eventPayload);
  }

  /**
   * getResults
   *
   * Returns all candidate records from the World State as a JSON array.
   * Analogous to Voting.sol getCandidates() external view.
   *
   * Uses the StateByRange iterator to scan all keys with the "CANDIDATE_" prefix.
   *
   * @param {Context} ctx - HLF transaction context
   * @returns {string}    - JSON stringified array of candidate objects
   */
  async getResults(ctx) {
    const results = [];

    // Iterate over all keys in the range "CANDIDATE_" (prefix scan)
    const iterator = await ctx.stub.getStateByRange("CANDIDATE_", "CANDIDATE_~");

    let result = await iterator.next();
    while (!result.done) {
      const candidateJSON = result.value.value.toString("utf8");
      results.push(JSON.parse(candidateJSON));
      result = await iterator.next();
    }

    await iterator.close();
    return JSON.stringify(results);
  }

  /**
   * getWinner
   *
   * Determines the candidate with the highest vote count and returns them.
   * Analogous to Voting.sol getWinner() external view.
   *
   * @param {Context} ctx - HLF transaction context
   * @returns {string}    - JSON stringified winner candidate object
   */
  async getWinner(ctx) {
    const resultsJSON = await this.getResults(ctx);
    const candidates = JSON.parse(resultsJSON);

    if (candidates.length === 0) {
      throw new Error("No candidates registered");
    }

    let winner = candidates[0];
    for (const candidate of candidates) {
      if (candidate.voteCount > winner.voteCount) {
        winner = candidate;
      }
    }

    return JSON.stringify(winner);
  }
}

module.exports = VotingChaincode;
