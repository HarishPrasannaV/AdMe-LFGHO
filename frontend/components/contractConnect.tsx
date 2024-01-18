import { Contract, providers, Wallet } from "ethers"
import { abi as contractAbi } from "@/components/abi"

const provider = new providers.Web3Provider(window.ethereum);

export const contractObj = (address) => {
    console.log(address)
    // const signer = new Wallet(address, provider)
    const signer = provider.getSigner()

    const contract = new Contract(
        "0xF8d27EB83bF5fE9660E893654aD566C025cC88C5",
        contractAbi,
        signer
    );

    return contract
}




    
