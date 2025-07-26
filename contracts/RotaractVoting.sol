// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RotaractVoting {
    address public admin;

    struct Candidate {
        uint id;
        string name;
        string position;
        uint voteCount;
        bool active;
    }

    struct VoteInfo {
        string voterId;
        uint candidateId;
    }

    mapping(uint => Candidate) public candidates;
    mapping(bytes32 => bool) public validTokens;
    mapping(bytes32 => bool) public usedTokens;
    mapping(bytes32 => string) public tokenToVoterId;
    VoteInfo[] public votes;
    uint public candidatesCount;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Add a candidate with name and position
    function addCandidate(string memory _name, string memory _position) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _position, 0, true);
    }

    // Deactivate a candidate (soft delete)
    function removeCandidate(uint _id) public onlyAdmin {
        require(_id > 0 && _id <= candidatesCount, "Invalid candidate ID");
        candidates[_id].active = false;
    }

    // Add a unique voter token
    function addVoterToken(bytes32 token, string memory voterId) public onlyAdmin {
        require(!validTokens[token], "Token already exists");
        validTokens[token] = true;
        tokenToVoterId[token] = voterId;
    }

    // Vote using a valid token and candidate ID
    function vote(bytes32 token, uint candidateId) public {
        require(validTokens[token], "Invalid token");
        require(!usedTokens[token], "Token already used");
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate ID");
        require(candidates[candidateId].active, "Candidate not active");

        usedTokens[token] = true;
        string memory voterId = tokenToVoterId[token];
        candidates[candidateId].voteCount++;
        votes.push(VoteInfo(voterId, candidateId));
    }

    // Admin can view all votes (who voted for whom)
    function getAllVotes() public view onlyAdmin returns (VoteInfo[] memory) {
        return votes;
    }

    // Public can view all active candidates and their vote count
    function getResults() public view returns (Candidate[] memory) {
        uint activeCount = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].active) {
                activeCount++;
            }
        }

        Candidate[] memory result = new Candidate[](activeCount);
        uint index = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].active) {
                result[index] = candidates[i];
                index++;
            }
        }

        return result;
    }

    // Filter results by candidate position
    function getResultsByPosition(string memory _position) public view returns (Candidate[] memory) {
        uint count = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            if (
                candidates[i].active &&
                keccak256(bytes(candidates[i].position)) == keccak256(bytes(_position))
            ) {
                count++;
            }
        }

        Candidate[] memory filtered = new Candidate[](count);
        uint index = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            if (
                candidates[i].active &&
                keccak256(bytes(candidates[i].position)) == keccak256(bytes(_position))
            ) {
                filtered[index] = candidates[i];
                index++;
            }
        }

        return filtered;
    }
}
