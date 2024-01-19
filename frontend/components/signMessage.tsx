const { ethers } = require("hardhat");
const Web3 = require("web3");
const { Utils } = require("alchemy-sdk");

const PrivateKey = process.env.KEY;

const wallet = new ethers.Wallet(PrivateKey);

function getMessageHash(attention, nonce, adId, userId) {
  const packedData = Web3.eth.abi.encodeParameters(
    ["uint", "uint", "uint", "uint"],
    [attention, nonce, adId, userId]
  );

  return Web3.utils.keccak256(packedData);
}

// const adId = 1; // should be returned when displaying advert
// const userId = 2; // should read from contract
// const attention = 50;
// const nonce = 1; // should read from contract

export default function signMessage(attention, nonce, adId, userId) {
    const trxn_hash = Utils.arrayify(
        getMessageHash(attention, nonce, adId, userId)
      );

    const signat = wallet.signMessage(trxn_hash);
    return signat;
}

// const trxn_hash = Utils.arrayify(
//   getMessageHash(attention, nonce, adId, userId)
// );

// const signat = wallet.signMessage(trxn_hash);
// console.log(wallet.address);

// console.log(signat);