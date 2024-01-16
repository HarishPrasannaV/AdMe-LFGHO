import { ChainlinkPlugin } from '@chainsafe/web3.js-chainlink-plugin';
import { Web3 } from 'web3';
import { abi as chainLinkAbi } from "./chain-link-abi";

const rpcURL = `https://mainnet.infura.io/${process.env.INFURA_ID}`;
const chainlinkPlugin = new ChainlinkPlugin();

const web3 = new Web3(rpcURL);
web3.registerPlugin(chainlinkPlugin);

const abi = chainLinkAbi;
const address = "0x0B9947867E1c8f03b3cD8442908a9b23F375a1cE";

export const contract = new web3.eth.Contract(abi, address)

