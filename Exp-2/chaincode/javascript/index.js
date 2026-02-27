'use strict';

/**
 * Hyperledger Fabric Chaincode Entry Point — Voting
 *
 * This file is the chaincode entry point that the Fabric peer discovers when
 * deploying the chaincode package. It requires the main contract class and
 * exports it as part of the `contracts` array so the Fabric shim can register
 * all exported contract classes automatically.
 *
 * @note  This is a CONCEPTUAL SKELETON for Experiment 2 (LO2).
 *        It mirrors the Voting.sol smart contract structure to demonstrate the
 *        parallel between Solidity (Ethereum) and chaincode (Hyperledger Fabric).
 *        Full deployment and execution on a live HLF network is covered in Exp-5.
 *
 * Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */

const VotingChaincode = require('./lib/Voting');

module.exports.contracts = [VotingChaincode];
