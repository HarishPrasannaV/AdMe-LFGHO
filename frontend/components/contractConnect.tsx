"use client"

import { Contract, providers } from "ethers"
import { abi as contractAbi } from "@/components/abi"

declare global {
    interface Window {
      ethereum: any
    }
}

const provider = new providers.Web3Provider(window.ethereum);

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




    
