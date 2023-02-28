// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {PullPayment} from "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

struct G1Point {
    uint256 x;
    uint256 y;
}

struct DleqProof {
    uint256 f;
    uint256 e;
}

/// @notice A 32-byte encrypted ciphertext
struct Ciphertext {
    G1Point random;
    uint256 cipher;
    /// DLEQ part
    G1Point random2;
    DleqProof dleq;
}

struct Content {
    address contributor;
    string uri;
}

struct License {
    address licensee;
    uint256 contentId;
    LicenseType licenseType;
    uint256 price;
}
enum LicenseType {
    BASIC,
    PREMIUM
}

interface IEncryptionClient {
    /// @notice Callback to client contract when medusa posts a result
    /// @dev Implement in client contracts of medusa
    /// @param requestId The id of the original request
    /// @param _cipher the reencryption result
    function oracleResult(uint256 requestId, Ciphertext calldata _cipher)
        external;
}

interface IEncryptionOracle {
    /// @notice submit a ciphertext that can be retrieved at the given link and
    /// has been created by this encryptor address. The ciphertext proof is checked
    /// and if correct, being signalled to Medusa.
    function submitCiphertext(
        Ciphertext calldata _cipher,
        bytes calldata _link,
        address _encryptor
    ) external returns (uint256);

    /// @notice Request reencryption of a cipher text for a user
    /// @dev msg.sender must be The "owner" or submitter of the ciphertext or the oracle will not reply
    /// @param _cipherId the id of the ciphertext to reencrypt
    /// @param _publicKey the public key of the recipient
    /// @return the reencryption request id
    function requestReencryption(uint256 _cipherId, G1Point calldata _publicKey)
        external
        returns (uint256);

    function distributedKey() external view returns (G1Point memory);
}

error InvalidContent();
error InsufficentFunds();
error InvalidLicenseType();
error UnauthorizedContributor();
error CallbackNotAuthorized();

contract Artizen is IEncryptionClient, ReentrancyGuard, PullPayment {
    /// @notice The Encryption Oracle Instance
    IEncryptionOracle public oracle;

    uint256 BASIC_LICENSE_FEE = 0.01 ether;
    uint256 PREMIUM_LICENSE_FEE = 0.1 ether;
    uint256 CONTRIBUTORS_SHARE = 70;

    mapping(uint256 => Content) public contributions;
    address[] public contributors;

    event NewContribution(
        address indexed contributor,
        uint256 indexed contentId,
        string uri
    );
    event LicenseBought(
        address indexed licensee,
        uint256 indexed contentId,
        LicenseType licenseType,
        uint256 price,
        uint256 requestId
    );
    event ContentDecryption(
        uint256 indexed requestId,
        Ciphertext indexed cipher
    );

    modifier onlyOracle() {
        if (msg.sender != address(oracle)) {
            revert CallbackNotAuthorized();
        }
        _;
    }

    constructor(address _oracle) {
        oracle = IEncryptionOracle(_oracle);
    }

    function contribute(Ciphertext calldata cipher, string calldata uri)
        public
        nonReentrant
        returns (uint256)
    {
        //TODO check if msg.sender is an authorized contributor
        uint256 cipherId = oracle.submitCiphertext(
            cipher,
            bytes(uri),
            msg.sender
        );
        contributions[cipherId] = Content({contributor: msg.sender, uri: uri});
        emit NewContribution(msg.sender, cipherId, uri);
        return cipherId;
    }

    function buyLicense(
        uint256 cipherId,
        G1Point calldata buyerPublicKey,
        LicenseType licenseType
    ) external payable nonReentrant returns (uint256) {
        Content memory content = contributions[cipherId];

        if (content.contributor == address(0)) {
            revert InvalidContent();
        }

        uint256 price = 0;
        if (licenseType == LicenseType.BASIC) {
            price = BASIC_LICENSE_FEE;
        } else if (licenseType == LicenseType.PREMIUM) {
            price = PREMIUM_LICENSE_FEE;
        } else {
            revert InvalidContent();
        }

        if (msg.value < price) {
            revert InsufficentFunds();
        }
        uint256 contributorShare = calculateShare(CONTRIBUTORS_SHARE, price);
        uint256 platformShare = price - contributorShare;

        _asyncTransfer(content.contributor, contributorShare);
        _asyncTransfer(address(this), platformShare);

        uint256 requestId = oracle.requestReencryption(
            cipherId,
            buyerPublicKey
        );

        emit LicenseBought(msg.sender, cipherId, licenseType, price, requestId);
        return requestId;
    }

    function calculateShare(uint256 percentage, uint256 amount)
        public
        pure
        returns (uint256)
    {
        return (percentage * amount) / 100;
    }

    /// @inheritdoc IEncryptionClient
    function oracleResult(uint256 requestId, Ciphertext calldata cipher)
        external
        onlyOracle
    {
        emit ContentDecryption(requestId, cipher);
    }
}
