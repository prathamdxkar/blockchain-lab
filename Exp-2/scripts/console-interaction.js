/**
 * Truffle Exec Script — Voting Contract Console Interaction
 *
 * Replicates the Phase 6 / MET-2 console interaction steps from EXP-2_PLAN.md.
 * Run with: NODE_OPTIONS=--no-warnings truffle exec scripts/console-interaction.js --network development
 *
 * Demonstrates:
 *   1. Retrieve deployed Voting instance
 *   2. getCandidates() — verify initial state (3 candidates, voteCount = 0)
 *   3. castVote(0) — vote for Alice from accounts[0]
 *   4. castVote(1) — vote for Bob from accounts[1]
 *   5. getCandidates() — verify voteCount increments
 *   6. getWinner() — confirm Alice leads (or tie → first index wins)
 *   7. Attempt double vote from accounts[0] — expect revert
 *
 * Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */

'use strict';

// In truffle exec context, artifacts are injected via the global `artifacts` object.
const Voting = artifacts.require('Voting');

module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║   EXP-2 — Voting Contract Console Interaction (MET-2)   ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // ── Step 1: Retrieve deployed Voting instance ──────────────────────────
    console.log('Step 1 ── Retrieving deployed Voting instance...');
    const voting = await Voting.deployed();
    console.log(`  > Contract address : ${voting.address}`);
    console.log(`  > Deployer (owner)  : ${accounts[0]}`);
    console.log(`  > Voter 1 (addr1)   : ${accounts[1]}`);
    console.log(`  > Voter 2 (addr2)   : ${accounts[2]}\n`);

    // ── Step 2: getCandidates() — initial state ────────────────────────────
    console.log('Step 2 ── getCandidates() — initial state:');
    let candidates = await voting.getCandidates();
    candidates.forEach((c, i) => {
      console.log(`  [${i}] ${c.name} — voteCount: ${c.voteCount.toString()}`);
    });
    console.log();

    // ── Step 3: castVote(0) — Alice, from accounts[0] ─────────────────────
    console.log('Step 3 ── Casting vote for Alice (index 0) from accounts[0]...');
    const tx1 = await voting.castVote(0, { from: accounts[0] });
    console.log(`  > Transaction hash : ${tx1.tx}`);
    console.log(`  > Gas used         : ${tx1.receipt.gasUsed}\n`);

    // ── Step 4: castVote(1) — Bob, from accounts[1] ───────────────────────
    console.log('Step 4 ── Casting vote for Bob (index 1) from accounts[1]...');
    const tx2 = await voting.castVote(1, { from: accounts[1] });
    console.log(`  > Transaction hash : ${tx2.tx}`);
    console.log(`  > Gas used         : ${tx2.receipt.gasUsed}\n`);

    // ── Step 5: getCandidates() — after votes ─────────────────────────────
    console.log('Step 5 ── getCandidates() — after two votes:');
    candidates = await voting.getCandidates();
    candidates.forEach((c, i) => {
      console.log(`  [${i}] ${c.name} — voteCount: ${c.voteCount.toString()}`);
    });
    console.log();

    // ── Step 6: getWinner() ───────────────────────────────────────────────
    console.log('Step 6 ── getWinner():');
    const winner = await voting.getWinner();
    console.log(`  > Winner : ${winner.name} (voteCount: ${winner.voteCount.toString()})`);
    console.log(`  > Tie-break note: Alice wins on tie (first-registered precedence)\n`);

    // ── Step 7: Attempt double vote — expect revert ───────────────────────
    console.log('Step 7 ── Attempting double vote from accounts[0] (should revert)...');
    try {
      await voting.castVote(0, { from: accounts[0] });
      console.log('  > ERROR: Double vote did NOT revert — contract bug!\n');
    } catch (err) {
      if (err.message.includes('Already voted')) {
        console.log(
          `  > ✓ Correctly reverted: "${err.message.split('revert ')[1] || 'Already voted'}"\n`
        );
      } else {
        console.log(`  > Revert (unexpected message): ${err.message}\n`);
      }
    }

    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  All Phase 6 / MET-2 interaction steps completed ✓      ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    callback();
  } catch (error) {
    console.error('Console interaction script failed:', error);
    callback(error);
  }
};
