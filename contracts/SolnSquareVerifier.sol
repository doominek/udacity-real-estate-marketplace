pragma solidity >=0.4.21 <0.6.0;

import "./Verifier.sol";
import "./ERC721Mintable.sol";


contract SolnSquareVerifier is DREMToken, Verifier {
    struct Solution {
        bytes32 key;
        uint256 tokenId;
        address submitter;
    }

    Solution[] private _solutions;

    mapping(bytes32 => bool) private _submittedSolutions;

    event SolutionAdded(uint256 indexed tokenId, address indexed submitter, bytes32 key);

    function _addSolution(uint256 tokenId, bytes32 key) internal {
        _solutions.push(Solution({key : key, tokenId : tokenId, submitter : msg.sender}));
        _submittedSolutions[key] = true;
        emit SolutionAdded(tokenId, msg.sender, key);
    }

    function _solutionKey(uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

    function _isNotSubmitted(bytes32 key) internal view returns (bool) {
        return !_submittedSolutions[key];
    }

    function mintNewToken(address to,
        uint256 tokenId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input) public {
        require(verifyTx(a, b, c, input), "Invalid solution");
        bytes32 key = _solutionKey(a, b, c, input);
        require(_isNotSubmitted(key), "Solution already submitted");

        _addSolution(tokenId, key);
        mint(to, tokenId);
    }
}



























