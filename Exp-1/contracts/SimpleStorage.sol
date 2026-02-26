// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title SimpleStorage
 * @notice Stores a single uint256 value on a local Ethereum blockchain.
 * @dev Experiment 1 — Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 *
 * Functions:
 *   set(uint256 value) — stores a non-zero value and emits DataStored
 *   get()              — returns the currently stored value
 *
 * Events:
 *   DataStored(uint256 indexed value, address indexed sender)
 */
contract SimpleStorage {
    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    /// @notice The single value stored on-chain by this contract.
    uint256 private storedData;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    /**
     * @notice Emitted whenever a new value is stored via set().
     * @param value  The new value that was stored (indexed for log filtering).
     * @param sender The address that called set() (indexed for log filtering).
     */
    event DataStored(uint256 indexed value, address indexed sender);

    // -------------------------------------------------------------------------
    // Functions
    // -------------------------------------------------------------------------

    /**
     * @notice Store a new value in the contract.
     * @dev Reverts if value is 0. Emits DataStored on successful storage.
     * @param value The uint256 value to store. Must be greater than 0.
     */
    function set(uint256 value) external {
        require(value > 0, "SimpleStorage: value must be greater than 0");
        storedData = value;
        emit DataStored(value, msg.sender);
    }

    /**
     * @notice Retrieve the currently stored value.
     * @return The uint256 value currently held in storedData.
     */
    function get() external view returns (uint256) {
        return storedData;
    }
}
