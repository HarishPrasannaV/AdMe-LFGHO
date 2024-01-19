const { ethers } = require("hardhat");
const Web3 = require("web3");
const { Utils } = require("alchemy-sdk");
require('dotenv').config({ path: "../.env" });

const PrivateKey = process.env.KEY;

const wallet = new ethers.Wallet(PrivateKey);

function getMessageHash(attention, nonce, adId, userId) {
  const packedData = Web3.eth.abi.encodeParameters(
    ["uint", "uint", "uint", "uint"],
    [attention, nonce, adId, userId]
  );

  return Web3.utils.keccak256(packedData);
}


export default function signMessage(attention, nonce, adId, userId) {
    const trxn_hash = Utils.arrayify(
        getMessageHash(attention, nonce, adId, userId)
      );

    const signat = wallet.signMessage(trxn_hash);
    return signat;
}


