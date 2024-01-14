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
    // Threshhold amount to allow for reward withdrawal
    uint256 public thresHold;

    struct Advert {
        uint256 AD_ID;
        address adAddress;
        string companyName;
        uint256 rewardBalance;
        uint256 rewardsPerUser;
        string URL;
        bool displayStatus;
    }

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

    constructor() Ownable(msg.sender) {
        // all Ids start at 1 so that we can check wether a user is registerd
        adCounter = 1;
        userCounter = 1;
        conversionFactor = 100;
        _owner = msg.sender;
        GHO = IGhoToken(0xc4bF5CbDaBE595361438F8c6a187bDc330539c60);
    }

    // function to mint rewards for advertisers
    function _mintRewards(uint256 _adId, uint256 _rewards) private {
        totalRewards += _rewards;
        adIdToAdvert[_adId].rewardBalance += _rewards;
    }

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
        uint _rewards;
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

    // Function to view advert
    function displayAdvert(uint256 _adId) public view returns (Advert memory) {
        return adIdToAdvert[_adId];
    }

    //Function to check the display status of an advert
    function checkAdStatus(uint256 _adId) public view returns (bool) {
        return adIdToAdvert[_adId].displayStatus;
    }

    // Function to update the threshold value
    function updateThresHold(uint256 _value) public onlyOwner {
        thresHold = _value;
    }

    // IDK how but have to modify the funtion so that users cant dispense rewards to themselves
    // Also have to make this function gasless so that users dont be paying gas everytime they see an ad
    function dispenseReward(uint256 _adId, uint256 _attention) internal {
        //attention should be between 0-100 and solidity supports only intergers
        require(_attention > 0);
        uint256 _rewards = (adIdToAdvert[_adId].rewardsPerUser * _attention) /
            100;
        require(checkAdStatus(_adId));
        adIdToAdvert[_adId].rewardBalance =
            adIdToAdvert[_adId].rewardBalance -
            _rewards;
        registerdUserList[msg.sender].rewardBalance =
            registerdUserList[msg.sender].rewardBalance +
            _rewards;
        updateAdStatus(_adId);
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
