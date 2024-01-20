'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { contractObj } from "@/components/contractConnect";
import { Button } from "@/components/ui/button";
import { ethers, BigNumber } from "ethers";

interface UserData {
  0: BigNumber; 
  1: BigNumber; 
  2: string;    
}

export default function Rewards() {
  const [userData, setUserData] = useState<UserData>([BigNumber.from(0), BigNumber.from(0), ""]);
  const [address, setAddress] = useState("");
  const router = useRouter();

  async function updateDetails() {
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      const withSigner = contractObj();
      const userData = await withSigner.registerdUserList(address);
      setUserData(userData);
    } catch (error) {
      window.alert(error);
    }
  }

  

  async function dispenseRewards() {
    updateDetails();
    const withSigner = contractObj();
    const tx = await withSigner.withdrawRewards();
    await tx.wait()
    updateDetails();
    router.refresh()    
  }

  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      {/* <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2em", fontWeight: "bold", color: "green" }}>View Your Details Here</h1>
        <div>
          <p>User ID: {userData[0] ? parseInt(userData[0]._hex, 16) : 'N/A'}</p>
          <p>User Rewards: {userData[1] ? parseInt(userData[1]._hex, 16) : 'N/A'}</p>
          <p>User Address: {userData[2]}</p>
          <Button onClick={updateDetails}>View Details</Button>
        </div>
      </div> */}

      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2em", fontWeight: "bold", color: "red" }}>Withdraw Your Rewards:</h1>
        <div>
          <Button onClick={dispenseRewards} style={{ fontSize: "1.5em", backgroundColor: "red", color: "white", padding: "10px 20px", borderRadius: "5px" }}>Withdraw</Button>
        </div>
      </div>
    </div>
    </>

  );
}

