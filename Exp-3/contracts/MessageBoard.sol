// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title  MessageBoard
 * @notice A simple on-chain message board where each address can post and
 *         retrieve its own messages. Deployed during Exp-3 (ITL801 — Blockchain
 *         Lab, University of Mumbai, BE IT SEM VIII, AY 2025-26).
 *
 * @dev    Demonstrates testnet deployment on Ethereum Sepolia via Hardhat
 *         Ignition, Etherscan verification, and Web3.js post-deploy interaction.
 *
 * Functions:
 *   - postMessage(string calldata content)           — stores a new message
 *   - getMessages(address user) view returns (...)  — returns all messages for a user
 *   - getTotalCount()            view returns (uint256) — returns global message count
 *
 * Events:
 *   - MessagePosted(address indexed sender, string content, uint256 timestamp)
 */
contract MessageBoard {

    // ─── Data Structures ──────────────────────────────────────────────────────

    /**
     * @dev Represents a single message posted by an address.
     */
    struct Message {
        string  content;    // The text of the message
        address sender;     // Address that posted it (redundant but useful for reads)
        uint256 timestamp;  // Block timestamp at the time of posting
    }

    // ─── State Variables ──────────────────────────────────────────────────────

    /// @dev Maps each address to the list of messages it has posted.
    mapping(address => Message[]) private _messages;

    /// @notice Total number of messages ever posted across all addresses.
    uint256 public messageCount;

    // ─── Events ───────────────────────────────────────────────────────────────

    /**
     * @notice Emitted whenever a new message is posted.
     * @param sender    Address that posted the message.
     * @param content   Text content of the message.
     * @param timestamp Block timestamp when the message was recorded.
     */
    event MessagePosted(
        address indexed sender,
        string          content,
        uint256         timestamp
    );

    // ─── Constructor ──────────────────────────────────────────────────────────

    /**
     * @dev Initialises messageCount to 0 (default for uint256, explicit for clarity).
     */
    constructor() {
        messageCount = 0;
    }

    // ─── Write Functions ──────────────────────────────────────────────────────

    /**
     * @notice Post a new message on the board.
     * @dev    Reverts if `content` is an empty string.
     *         Uses `calldata` for gas efficiency (no memory copy on external call).
     * @param  content The text content to store.
     */
    function postMessage(string calldata content) external {
        require(bytes(content).length > 0, "MessageBoard: content cannot be empty");

        // Checks-Effects-Interactions pattern:
        // 1. Check — already done via require above
        // 2. Effect — state update before any external interaction
        _messages[msg.sender].push(
            Message({
                content:   content,
                sender:    msg.sender,
                timestamp: block.timestamp
            })
        );
        messageCount += 1;

        // 3. Interact — emit after state change
        emit MessagePosted(msg.sender, content, block.timestamp);
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    /**
     * @notice Retrieve all messages posted by a given address.
     * @param  user The wallet address whose messages to retrieve.
     * @return      An array of Message structs in chronological order.
     */
    function getMessages(address user)
        external
        view
        returns (Message[] memory)
    {
        return _messages[user];
    }

    /**
     * @notice Returns the total number of messages posted by all senders.
     * @return The current value of `messageCount`.
     */
    function getTotalCount() external view returns (uint256) {
        return messageCount;
    }
}
