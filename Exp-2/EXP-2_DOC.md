# Exp-2: To Develop and Establish Smart Contract and Chain Code

> **Status**: ✅ Complete — compiled, deployed (Truffle + Hardhat Ignition), 16/16 tests passing.
> **Solidity version used**: 0.8.21 · **Compiler**: solc 0.8.21+commit.d9974bed.Emscripten.clang
> **Tools**: Truffle v5.11.5 · Hardhat v2.28.6 · Ganache CLI v7.9.1 · Web3.js v1.10.0 · Node.js v24.13.1

---

## AIM

To Develop and Establish smart contract and chain code.

---

## THEORY

**Solidity**:
- High-level, statically-typed, contract-oriented programming language developed by the Ethereum Foundation; introduced in 2014, first stable release in 2015.
- Current stable version: **v0.8.34** (released 18 February 2026 — verified via [github.com/ethereum/solidity/releases](https://github.com/ethereum/solidity/releases/latest)).
- This project pins **v0.8.21** for compatibility with Truffle v5.11.5 and the Hardhat toolbox v5.
- Compiles to EVM (Ethereum Virtual Machine) bytecode and generates an ABI (Application Binary Interface) JSON via `solc`; Hardhat uses the `solc-js` Emscripten wrapper.
- Features used in this experiment: `struct`, `mapping(address => bool)`, `event` emission, `require` guards, custom `modifier`, parametrised `constructor`, `external`/`view` visibility specifiers.

**Smart Contract**:
- Self-executing program stored permanently on the Ethereum blockchain; code and state reside at a deterministic address derived from the deployer address and transaction nonce.
- Lifecycle: **Write** Solidity → **Compile** (`solc`/`npx hardhat compile`) → **Deploy** (migration/ignition script, pays gas fee) → **Interact** (ABI-encoded calls via Web3.js, ethers.js, or Truffle console).
- **ABI**: JSON descriptor of all public functions, events, and constructor parameters; consumed by client libraries to encode call data and decode return values.
- **Bytecode**: Binary EVM opcodes stored on-chain; executed by every node on each transaction.
- **Gas**: Computational fee paid by the transaction sender to incentivise miners/validators; `castVote()` in this contract uses ≈ 70 261 gas.

**Chaincode (Hyperledger Fabric)**:
- Chaincode is the Hyperledger Fabric equivalent of an Ethereum smart contract — business logic packaged as a Node.js, Go, or Java module deployed on Fabric peers.
- Current Hyperledger Fabric version: **v2.5.x** (LTS, actively maintained by the Linux Foundation as of February 2026).
- Lifecycle: `package` → `install` → `approve` → `commit` → `invoke`/`query` via the `peer chaincode` CLI.
- In this experiment, a Node.js skeleton chaincode (`chaincode/javascript/lib/voting.js`) mirrors the on-chain `Voting` contract logic in a permissioned-ledger context; full Fabric deployment is covered in Exp-5.

**Truffle Suite**:
- Installed version: **v5.11.5** (core: 5.11.5). End-to-end Ethereum development framework by ConsenSys.
- Provides `truffle compile`, `truffle migrate --network <name>`, `truffle exec <script>`, and an interactive `truffle console`.
- Migration scripts (prefixed `1_*.js`) deploy contracts in numerical order; deployment state is persisted to `build/contracts/*.json`.

**Hardhat**:
- Installed version: **v2.28.6**. Node.js-based Ethereum development environment.
- Built-in in-process Hardhat Network (chainId 31337); `npx hardhat compile` targets the `paris` EVM.
- Test runner: Mocha + Chai via `@nomicfoundation/hardhat-toolbox` v5.0.0.

**Key Concepts**:
- **Checks-Effects-Interactions (CEI)**: Security pattern applied in `castVote()` — all `require` guards execute before state changes, before event emission.
- **Double-vote guard (CDM-2)**: `require(!hasVoted[msg.sender], "Already voted")` is the first statement in `castVote()` preventing re-entry and ballot stuffing.
- **onlyOwner modifier**: Custom modifier ensuring only the contract deployer can call `addCandidate()`.
- **Event indexing**: `VoteCast(uint256 indexed candidateIndex, address indexed voter)` — indexed parameters allow efficient off-chain log filtering.

---

## IMPLEMENTATION

### CODE

**`contracts/Voting.sol`** (lines 1–52 — contract header, data structures, state variables, events, modifier):
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Voting
 * @notice A simple on-chain voting contract that supports candidate registration,
 *         vote casting with double-vote protection, and winner determination.
 * @dev  Experiment 2 — Develop and Establish Smart Contract and Chain Code
 *       Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */
contract Voting {
    /// @notice Represents a single candidate in the election.
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    /// @notice Dynamic array of all registered candidates.
    Candidate[] public candidates;

    /// @notice Tracks which addresses have already cast a vote.
    mapping(address => bool) public hasVoted;

    /// @notice Address of the contract deployer — the election administrator.
    address public owner;

    /// @notice Emitted when a new candidate is added to the election.
    event CandidateAdded(string indexed name);

    /// @notice Emitted when a voter successfully casts their vote.
    event VoteCast(uint256 indexed candidateIndex, address indexed voter);

    /// @dev Restricts a function to the contract owner only.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(string[] memory candidateNames) {
        owner = msg.sender;
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({ name: candidateNames[i], voteCount: 0 }));
        }
    }
}
```

**`contracts/Voting.sol`** (lines 108–145 — `castVote()` with CDM-2 double-vote guard):
```solidity
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
```

**`migrations/1_deploy_voting.js`** — Truffle migration script:
```javascript
const Voting = artifacts.require('Voting');

module.exports = function (deployer) {
  // Deploy Voting with initial candidate list — matches constructor signature:
  //   constructor(string[] memory candidateNames)
  deployer.deploy(Voting, ['Alice', 'Bob', 'Charlie']);
};
```

**`test/Voting.test.js`** (lines 22–115 — setup + TC-2 vote success + TC-3 double-vote revert):
```javascript
const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Voting', function () {
  let voting, owner, addr1, addr2;
  const CANDIDATES = ['Alice', 'Bob', 'Charlie'];

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const VotingFactory = await ethers.getContractFactory('Voting');
    voting = await VotingFactory.deploy(CANDIDATES);
    await voting.waitForDeployment();
  });

  it('TC-2: castVote(0) increments Alice voteCount from 0 to 1', async function () {
    await voting.connect(addr1).castVote(0);
    const candidates = await voting.getCandidates();
    expect(candidates[0].voteCount).to.equal(1n);
    expect(candidates[1].voteCount).to.equal(0n);
  });

  it('TC-3: casting a second vote from the same address reverts with "Already voted"', async function () {
    await voting.connect(addr1).castVote(0);
    await expect(voting.connect(addr1).castVote(0))
      .to.be.revertedWith('Already voted');
  });

  it('TC-5: castVote(0) emits VoteCast with candidateIndex=0 and voter=addr1', async function () {
    await expect(voting.connect(addr1).castVote(0))
      .to.emit(voting, 'VoteCast')
      .withArgs(0n, addr1.address);
  });
});
```

**`hardhat.config.js`** — Solidity compiler + network configuration:
```javascript
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: {
    version: '0.8.21',
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat:    { chainId: 31337 },
    ganache:    { url: 'http://127.0.0.1:7545', chainId: 1337 },
    ganacheCli: { url: 'http://127.0.0.1:8545', chainId: 1337 },
  },
};
```

**`scripts/console-interaction.js`** (lines 23–68 — Web3.js on-chain interaction via `truffle exec`):
```javascript
const Voting = artifacts.require('Voting');

module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const voting = await Voting.deployed();
    console.log(`Contract address : ${voting.address}`);

    // Step 2 — getCandidates() initial state
    let candidates = await voting.getCandidates();
    candidates.forEach((c, i) =>
      console.log(`  [${i}] ${c.name} — voteCount: ${c.voteCount.toString()}`)
    );

    // Step 3 — castVote(0) from accounts[0]
    const tx1 = await voting.castVote(0, { from: accounts[0] });
    console.log(`  > tx hash: ${tx1.tx}  gas used: ${tx1.receipt.gasUsed}`);

    // Step 7 — attempt double vote (expects revert)
    try {
      await voting.castVote(0, { from: accounts[0] });
    } catch (e) {
      console.log(`  > Correctly reverted: "${e.message}"`);
    }
    callback();
  } catch (err) { callback(err); }
};
```

---

### OUTPUT

**Fig 2.1 — `truffle compile`: `Voting.sol` compiled successfully**

```text
$ npx truffle compile

Compiling your contracts...
===========================
> Compiling ./contracts/Voting.sol
> Artifacts written to .../Exp-2/build/contracts
> Compiled successfully using:
   - solc: 0.8.21+commit.d9974bed.Emscripten.clang
```

*Compiler: `solc v0.8.21+commit.d9974bed.Emscripten.clang` · Output: `build/contracts/Voting.json` (ABI + bytecode)*

---

**Fig 2.2 — `truffle migrate --reset --network development`: `Voting` deployed to Ganache**

```text
$ npx truffle migrate --reset --network development

Starting migrations...
======================
> Network name:    'development'
> Network id:      1772187041899
> Block gas limit: 30000000 (0x1c9c380)

1_deploy_voting.js
==================

   Deploying 'Voting'
   ------------------
   > transaction hash:    0xe8951b9dee5a856d4d89aa99135af3b616667c0a2e5c5da73c2f2cb3af0f08b7
   > Blocks: 0            Seconds: 0
   > contract address:    0x061F7EA4ca91203b6c79076B6b21B1914D6b28D7
   > block number:        5
   > block timestamp:     1772188060
   > account:             0xDdD534D72C460CC9833aFD0d918342e25f08B3db
   > balance:             999.990298471115498867
   > gas used:            1258877 (0x13357d)
   > gas price:           3.023721233 gwei
   > value sent:          0 ETH
   > total cost:          0.003806493114635341 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:     0.003806493114635341 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.003806493114635341 ETH
```

*Contract address: `0x061F7EA4ca91203b6c79076B6b21B1914D6b28D7` · Block: 5 · Gas used: 1 258 877 · Cost: 0.003806 ETH · Network: development (Ganache CLI port 7545)*

> 📸 **Fig 2.2.1** — Ganache GUI showing confirmed transaction and updated account balance.
> **Pending manual screenshot** — save as `screenshots/fig-2.2.1-ganache-tx.png`.

---

**Fig 2.3 — `npx hardhat test`: 16/16 test cases passing**

```text
$ npx hardhat test

Compiled 1 Solidity file successfully (evm target: paris).

  Voting
    Initial State
      ✔ TC-1:  getCandidates() returns 3 candidates with voteCount 0
      ✔ TC-1b: owner is set to the deployer address
    castVote — success path
      ✔ TC-2:  castVote(0) increments Alice voteCount from 0 to 1
      ✔ TC-2b: hasVoted is true for addr1 after casting a vote
    castVote — double-vote guard (CDM-2)
      ✔ TC-3:  casting a second vote from the same address reverts with 'Already voted'
      ✔ TC-3b: two different addresses can each vote once
    castVote — bounds guard
      ✔ TC-4:  castVote with out-of-bounds index (99) reverts with 'Invalid candidate index'
      ✔ TC-4b: castVote with index equal to candidates length reverts
    VoteCast event
      ✔ TC-5:  castVote(0) emits VoteCast with candidateIndex=0 and voter=addr1
      ✔ TC-5b: castVote(2) emits VoteCast with candidateIndex=2 and voter=addr2
    getWinner()
      ✔ TC-6:  returns Alice after addr1 and addr2 both vote for Alice (index 0)
      ✔ TC-6b: returns Bob if Bob has the most votes
      ✔ TC-6c: getWinner reverts if no candidates registered
    addCandidate()
      ✔ TC-7:  owner can add a new candidate; getCandidates length increases to 4
      ✔ TC-7b: addCandidate emits CandidateAdded event with the correct name
      ✔ TC-8:  non-owner calling addCandidate reverts with 'Only owner can call this function'

  16 passing (933ms)
```

*Hardhat v2.28.6 · Mocha + Chai · EVM target: paris · **16 tests, 0 failures** · Duration: 933 ms*

---

**Fig 2.4 — `truffle exec scripts/console-interaction.js --network development`: on-chain interaction (MET-2)**

```text
$ NODE_OPTIONS=--no-warnings truffle exec scripts/console-interaction.js --network development

Using network 'development'.

╔══════════════════════════════════════════════════════════╗
║   EXP-2 — Voting Contract Console Interaction (MET-2)   ║
╚══════════════════════════════════════════════════════════╝

Step 1 ── Retrieving deployed Voting instance...
  > Contract address : 0x061F7EA4ca91203b6c79076B6b21B1914D6b28D7
  > Deployer (owner)  : 0xDdD534D72C460CC9833aFD0d918342e25f08B3db
  > Voter 1 (addr1)   : 0x78941A14eC1c45b04F2B3aE08d1A39B4c187DB36
  > Voter 2 (addr2)   : 0x769c4a7Ea58505A73831B55E36C59CfD01d8d984

Step 2 ── getCandidates() — initial state:
  [0] Alice — voteCount: 0
  [1] Bob — voteCount: 0
  [2] Charlie — voteCount: 0

Step 3 ── Casting vote for Alice (index 0) from accounts[0]...
  > Transaction hash : 0x763cf70b...f99d3176
  > Gas used         : 70261

Step 4 ── Casting vote for Bob (index 1) from accounts[1]...
  > Transaction hash : 0x5facd764...29a2f15
  > Gas used         : 70273

Step 5 ── getCandidates() — after two votes:
  [0] Alice — voteCount: 1
  [1] Bob — voteCount: 1
  [2] Charlie — voteCount: 0

Step 6 ── getWinner():
  > Winner : Alice (voteCount: 1)
  > Tie-break note: Alice wins on tie (first-registered precedence)

Step 7 ── Attempting double vote from accounts[0] (should revert)...
  > ✓ Correctly reverted: "Already voted -- Reason given: Already voted."

╔══════════════════════════════════════════════════════════╗
║  All Phase 6 / MET-2 interaction steps completed ✓      ║
╚══════════════════════════════════════════════════════════╝
```

*Web3.js v1.10.0 · Truffle v5.11.5 · Ganache CLI v7.9.1 · Contract `0x061F7EA4...6b28D7` · All 7 MET-2 interaction steps verified*

---

## LAB OUTCOMES

**LO2** — Develop and test smart contract on Ethereum test networks.

---

## CONCLUSION

We have successfully developed and deployed a `Voting` smart contract on a local Ethereum blockchain using Solidity v0.8.21, Truffle v5.11.5 with Ganache CLI v7.9.1, and Hardhat v2.28.6 with an in-process Hardhat Network. This experiment demonstrated the complete smart contract lifecycle — from authoring a Solidity contract with candidate registration, vote casting (double-vote protection via the Checks-Effects-Interactions pattern), and winner determination, through compilation, migration, automated testing (16/16 Mocha + Chai tests passing), and on-chain interaction via a Web3.js `truffle exec` script. Through this experiment, Lab Outcome LO2 — Develop and test smart contract on Ethereum test networks — was achieved.
