import { ethers } from "ethers";
const Web3 = require("web3");
const { Utils } = require("alchemy-sdk");
require('dotenv').config({ path: "../.env.local" });

const PrivateKey = process.env.NEXT_PUBLIC_KEY;

const wallet = PrivateKey ? new ethers.Wallet(PrivateKey) : undefined;

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
      let signat;
    if (wallet) {
      signat = wallet.signMessage(trxn_hash);
      // console.log(signat);
      // Rest of the code...
    }
    return signat;
}



// function signMessage(attention, nonce, adId, userId) {
//   const trxn_hash = Utils.arrayify(
//       getMessageHash(attention, nonce, adId, userId)
//     );

//   const signat = wallet.signMessage(trxn_hash);
//   return signat;
// }

// signMessage(22, 0 , 1 ,2).then((resolvedValue) => {
//   console.log(resolvedValue);
// });





