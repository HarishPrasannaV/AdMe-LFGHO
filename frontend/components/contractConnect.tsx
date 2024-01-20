"use client"

import { Contract, providers, Wallet } from "ethers"
import { abi as contractAbi } from "@/components/abi"

const provider = new providers.Web3Provider((window as any).ethereum);

export const contractObj = () => {
    // const signer = new Wallet(address, provider)
    const signer = provider.getSigner()

    const contract = new Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDR || "",
        contractAbi,
        signer
    );

    return contract
}




    
