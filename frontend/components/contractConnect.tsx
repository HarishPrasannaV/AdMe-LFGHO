"use client"

import { Contract, providers, Wallet } from "ethers"
import { abi as contractAbi } from "@/components/abi"

const provider = new providers.Web3Provider((window as any).ethereum);

export const contractObj = () => {
    // const signer = new Wallet(address, provider)
    const signer = provider.getSigner()

    const contract = new Contract(
        "0xF8d27EB83bF5fE9660E893654aD566C025cC88C5",
        contractAbi,
        signer
    );

    return contract
}




    
