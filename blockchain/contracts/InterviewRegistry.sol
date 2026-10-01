// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title InterviewRegistry
/// @notice Tamper-evident audit trail for the ICP care-home interview study.
/// @dev Stores ONLY salted keccak256 hashes and timestamps – never interview
///      content, names or any other personal data. The salt lives off-chain
///      (Supabase) and is deleted when a participant withdraws, which makes the
///      remaining on-chain hash unlinkable.
contract InterviewRegistry {
    struct Interview {
        bytes32 consentHash;    // hash of consent text version + choices + salt
        uint64 consentAt;       // block timestamp of consent
        bytes32 transcriptHash; // hash of the anonymised answers + salt
        uint64 sealedAt;        // block timestamp of sealing (0 = open)
        bool withdrawn;         // participant withdrew; off-chain data deleted
    }

    address public owner;
    mapping(address => bool) public writers;
    mapping(bytes32 => Interview) private interviews;
    mapping(bytes32 => uint64) public reportAnchoredAt;

    uint256 public consentCount;
    uint256 public sealedCount;

    event WriterSet(address indexed writer, bool allowed);
    event ConsentRecorded(bytes32 indexed interviewId, bytes32 consentHash, uint64 timestamp);
    event InterviewSealed(bytes32 indexed interviewId, bytes32 transcriptHash, uint64 timestamp);
    event InterviewWithdrawn(bytes32 indexed interviewId, uint64 timestamp);
    event ReportAnchored(bytes32 indexed reportHash, address indexed researcher, string label, uint64 timestamp);

    error NotOwner();
    error NotWriter();
    error ZeroHash();
    error ConsentAlreadyRecorded();
    error NoConsent();
    error AlreadySealed();
    error AlreadyWithdrawn();
    error ReportAlreadyAnchored();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyWriter() {
        if (msg.sender != owner && !writers[msg.sender]) revert NotWriter();
        _;
    }

    constructor(address relayer) {
        owner = msg.sender;
        if (relayer != address(0)) {
            writers[relayer] = true;
            emit WriterSet(relayer, true);
        }
    }

    function setWriter(address writer, bool allowed) external onlyOwner {
        writers[writer] = allowed;
        emit WriterSet(writer, allowed);
    }

    /// @notice Step 1: consent is recorded BEFORE the first question is shown.
    function recordConsent(bytes32 interviewId, bytes32 consentHash) external onlyWriter {
        if (interviewId == bytes32(0) || consentHash == bytes32(0)) revert ZeroHash();
        Interview storage it = interviews[interviewId];
        if (it.consentAt != 0) revert ConsentAlreadyRecorded();
        it.consentHash = consentHash;
        it.consentAt = uint64(block.timestamp);
        consentCount++;
        emit ConsentRecorded(interviewId, consentHash, it.consentAt);
    }

    /// @notice Step 2: the finished, anonymised answer set is sealed once.
    function sealInterview(bytes32 interviewId, bytes32 transcriptHash) external onlyWriter {
        if (transcriptHash == bytes32(0)) revert ZeroHash();
        Interview storage it = interviews[interviewId];
        if (it.consentAt == 0) revert NoConsent();
        if (it.withdrawn) revert AlreadyWithdrawn();
        if (it.sealedAt != 0) revert AlreadySealed();
        it.transcriptHash = transcriptHash;
        it.sealedAt = uint64(block.timestamp);
        sealedCount++;
        emit InterviewSealed(interviewId, transcriptHash, it.sealedAt);
    }

    /// @notice A participant may withdraw at any time (before or after sealing).
    function markWithdrawn(bytes32 interviewId) external onlyWriter {
        Interview storage it = interviews[interviewId];
        if (it.consentAt == 0) revert NoConsent();
        if (it.withdrawn) revert AlreadyWithdrawn();
        it.withdrawn = true;
        emit InterviewWithdrawn(interviewId, uint64(block.timestamp));
    }

    /// @notice A researcher anchors the hash of an AI-generated analysis report
    ///         (called from the browser via MetaMask).
    function anchorReport(bytes32 reportHash, string calldata label) external onlyWriter {
        if (reportHash == bytes32(0)) revert ZeroHash();
        if (reportAnchoredAt[reportHash] != 0) revert ReportAlreadyAnchored();
        reportAnchoredAt[reportHash] = uint64(block.timestamp);
        emit ReportAnchored(reportHash, msg.sender, label, uint64(block.timestamp));
    }

    function getInterview(bytes32 interviewId) external view returns (Interview memory) {
        return interviews[interviewId];
    }
}
