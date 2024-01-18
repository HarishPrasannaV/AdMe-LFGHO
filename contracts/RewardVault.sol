// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IGhoToken.sol";

contract RewardVault is Ownable {
    IGhoToken public immutable GHO;
    address public _owner;
    // Total Amount of rewards in the Vault
    uint256 public totalRewards;
    // Factor to convert GHO to rewards
    uint256 public conversionFactor;
    // Threshold amount to allow for reward withdrawal
    uint256 public thresHold;
    // Corresponding address for ECDSA private key of the dApp
    address private interactionSigner =
        0x102a287271836796398747793Ef148f0Bf44b9b4;

    // Structure of the advertisement that is to be published
    struct Advert {
        uint256 AD_ID;
        address adAddress;
        string companyName;
        uint256 rewardBalance;
        uint256 rewardsPerUser;
        string URL;
        bool displayStatus;
    }

    // Structure of a registerd user
    struct User {
        uint256 userId;
        uint256 rewardBalance;
        address userAddress;
    }

    // to keep track of number of regiterd users and their mapping to Userid.
    uint256 private userCounter;
    mapping(address => User) public registerdUserList;
    // to keep track of published adverts and their mapping ot adId
    uint256 private adCounter;
    mapping(uint256 => Advert) public adIdToAdvert;
    // to keep track of user interaction with advert;
    mapping(uint256 => mapping(uint256 => uint256)) public adUserInteraction;

    Advert[] private adList; // array to keep track of all the adverts

    constructor() Ownable(msg.sender) {
        // all Ids start at 1 so that we can check wether a user is registerd
        //  THE DEPOSIT VALUE ENTERED IS DIVIDED BY 10^18, SO WE HAVE TO MULTIPLY BY IT TO CONVERT IT TO ACTUAL GHO VALUE
        // AND WE HAVE TO ACCOUNT FOR IT IN REWARDS CONVERSION
        adCounter = 1;
        userCounter = 1;
        conversionFactor = 100;
        thresHold = 100;
        _owner = msg.sender;
        GHO = IGhoToken(0xc4bF5CbDaBE595361438F8c6a187bDc330539c60);
    }

    // function to mint rewards for advertisers

    // ------------------------------------------------------------------------------------------------
    //                                       SIGNATURE VERIFICATION(BENINGING)
    // ------------------------------------------------------------------------------------------------
    function _mintRewards(uint256 _adId, uint256 _rewards) private {
        totalRewards += _rewards;
        adIdToAdvert[_adId].rewardBalance += _rewards;
    }

    function getMessageHash(
        uint _attention,
        uint _nonce,
        uint _adId,
        uint _userId
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_attention, _nonce, _adId, _userId));
    }

    function getEthSignedMessageHash(
        bytes32 _messageHash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    // Function to verify that the dispense rewards function is called by the dApp alone
    function verify(
        uint _attention,
        uint _nonce,
        uint _adId,
        uint _userId,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 messageHash = getMessageHash(
            _attention,
            _nonce,
            _adId,
            _userId
        );
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return
            recoverSigner(ethSignedMessageHash, signature) == interactionSigner;
    }

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    // ------------------------------------------------------------------------------------------------
    //                                       SIGNATURE VERIFICATION(END0
    // ------------------------------------------------------------------------------------------------

    // function to burn rewards when the user withdraws
    function _burnRewards(address _userAddress, uint _rewards) private {
        totalRewards -= _rewards;
        registerdUserList[_userAddress].rewardBalance -= _rewards;
    }

    // Have to implement them permits so that the GHO deposit can be completed in 1 Tx
    // https://www.youtube.com/watch?v=Sib9_yW_rLY

    function addAdvert(
        uint256 _deposit,
        string memory _companyName,
        uint256 _rewardsPerUser,
        string memory _URL
    ) external {
        //  THE DEPOSIT VALUE ENTERED IS DIVIDED BY 10^18, SO WE HAVE TO MULTIPLY BY IT TO CONVERT IT TO ACTUAL GHO VALUE

        uint _rewards;
        // The transaction myst be approved befor we can do this
        require(GHO.transferFrom(msg.sender, address(this), _deposit));
        _rewards = conversionFactor * _deposit;
        Advert memory ad = Advert(
            adCounter,
            msg.sender,
            _companyName,
            0,
            _rewardsPerUser,
            _URL,
            true
        );
        adIdToAdvert[adCounter] = ad;
        _mintRewards(adCounter, _rewards);
        adCounter = adCounter + 1;

        adList.push(ad);
    }

    function getRandomNumber(uint256 range) public view returns (uint256) {
        uint256 randomSeed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));
        return randomSeed % range;
    }

    // returns Ads
    function returnAds(uint256 start, uint256 num) external view returns (Advert[] memory) {
        require(start + num <= adList.length);

        Advert[] memory ret = new Advert[](num);

        for (uint256 i = 0; i < num; i++) 
        {
            ret[i] = adList[i + start];
        }

        return ret;
    }

    // adding a new user
    function addUser() external {
        // defualt uint value is 0 but we start the user count from 1
        require(
            registerdUserList[msg.sender].userId == 0,
            "User is already registerd"
        );
        uint _rewards = 0;
        User memory user = User(userCounter, _rewards, msg.sender);
        registerdUserList[msg.sender] = user;
        userCounter = userCounter + 1;
    }

    // Function to update the conversion factor
    function updateFactor(uint256 _factor) public onlyOwner {
        conversionFactor = _factor;
    }

    // function to set AD display status as false once the rewards run out
    function updateAdStatus(uint256 _adId) internal {
        if (
            adIdToAdvert[_adId].rewardBalance <
            adIdToAdvert[_adId].rewardsPerUser
        ) {
            adIdToAdvert[_adId].displayStatus = false;
        } else {
            adIdToAdvert[_adId].displayStatus = true;
        }
    }

    //Function to check the display status of an advert
    function checkAdStatus(uint256 _adId) public view returns (bool) {
        return adIdToAdvert[_adId].displayStatus;
    }

    // Function to update the threshold value
    function updateThresHold(uint256 _value) public onlyOwner {
        thresHold = _value;
    }

    // Have to make this function gasless so that users dont be paying gas everytime they see an ad
    function dispenseReward(
        uint256 _adId,
        uint256 _attention,
        bytes memory _signature
    ) public {
        //attention should be between 0-100 and solidity supports only intergers
        require(
            registerdUserList[msg.sender].userId != 0,
            "User is not registered"
        );
        require(_attention > 0);
        uint256 _rewards = (adIdToAdvert[_adId].rewardsPerUser * _attention) /
            100;
        require(checkAdStatus(_adId));
        // Verifing the signature of the application that called the function
        require(
            verify(
                _attention,
                adUserInteraction[_adId][registerdUserList[msg.sender].userId],
                _adId,
                registerdUserList[msg.sender].userId,
                _signature
            )
        );
        adIdToAdvert[_adId].rewardBalance =
            adIdToAdvert[_adId].rewardBalance -
            _rewards;
        registerdUserList[msg.sender].rewardBalance =
            registerdUserList[msg.sender].rewardBalance +
            _rewards;
        updateAdStatus(_adId);
        // Updataing the user interaction count with the advert to prevent Replay attacks
        adUserInteraction[_adId][registerdUserList[msg.sender].userId] =
            adUserInteraction[_adId][registerdUserList[msg.sender].userId] +
            1;
    }

    // function to withdraw the earnd rewards
    function withdrawRewards() public {
        uint256 _rewards = registerdUserList[msg.sender].rewardBalance;
        uint256 _amount = _rewards / conversionFactor;
        require(
            _rewards > thresHold,
            "The threshold limit hasn't been reached yet"
        );
        _burnRewards(msg.sender, _rewards);
        GHO.transfer(msg.sender, _amount);
    }
}
