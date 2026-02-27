/**
 * SimpleStorage.test.js — Hardhat + Mocha/Chai Test Suite
 *
 * Tests the SimpleStorage smart contract deployed to the in-process Hardhat
 * network (Chain ID 31337). Ganache CLI is NOT required for these tests.
 *
 * Test Cases:
 *   1. get() returns 0 on fresh deploy (default uint256)
 *   2. set(42) followed by get() returns 42
 *   3. set(0) reverts with the require error message
 *   4. set() emits DataStored event with correct value and sender arguments
 *
 * Run:
 *   npm run test
 *   # resolves to: npx hardhat test
 *
 * Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('SimpleStorage', function () {
  /**
   * @type {import("ethers").Contract}
   * Fresh SimpleStorage instance deployed before each test.
   */
  let simpleStorage;

  /**
   * @type {import("ethers").Signer}
   * The default deployer / first account from the Hardhat in-process network.
   */
  let owner;

  // ---------------------------------------------------------------------------
  // Setup — deploy a fresh contract instance before every test
  // ---------------------------------------------------------------------------

  beforeEach(async function () {
    // Retrieve the first signer (default deployer) from the in-process network.
    [owner] = await ethers.getSigners();

    // Deploy a fresh instance of SimpleStorage for every test case.
    const SimpleStorageFactory = await ethers.getContractFactory('SimpleStorage');
    simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.waitForDeployment();
  });

  // ---------------------------------------------------------------------------
  // Test 1 — Initial State
  // ---------------------------------------------------------------------------

  it('get() returns 0 on a fresh deploy (default uint256 value)', async function () {
    const initialValue = await simpleStorage.get();
    expect(initialValue).to.equal(0n); // uint256 default is 0; ethers v6 returns BigInt
  });

  // ---------------------------------------------------------------------------
  // Test 2 — set() → get() round-trip
  // ---------------------------------------------------------------------------

  it('set(42) stores 42 and get() returns 42', async function () {
    // Call set() with value 42
    const tx = await simpleStorage.set(42);
    await tx.wait();

    // Retrieve the stored value
    const storedValue = await simpleStorage.get();
    expect(storedValue).to.equal(42n);
  });

  // ---------------------------------------------------------------------------
  // Test 3 — Revert on zero value
  // ---------------------------------------------------------------------------

  it("set(0) reverts with 'SimpleStorage: value must be greater than 0'", async function () {
    await expect(simpleStorage.set(0)).to.be.revertedWith(
      'SimpleStorage: value must be greater than 0'
    );
  });

  // ---------------------------------------------------------------------------
  // Test 4 — Event emission
  // ---------------------------------------------------------------------------

  it('set() emits DataStored event with correct value and sender', async function () {
    const valueToStore = 99n;

    // The emit assertion checks event name, value argument, and sender argument.
    await expect(simpleStorage.connect(owner).set(valueToStore))
      .to.emit(simpleStorage, 'DataStored')
      .withArgs(valueToStore, owner.address);
  });
});
