'use client'

import React, { useState, useEffect } from "react";
import { contractObj } from "@/components/contractConnect";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";


export default function joinAdMe() {
  const { address, isConnected } = useAccount()
  const [isRegistered, setIsRegistered] = useState(false)

  async function addUser() {
    try{
      const withSigner = contractObj();
      await withSigner.addUser();
      console.log("User has been added succesfully")  
    }catch(error){
      window.alert(error);
    }  
  }

  useEffect(() => {
    // checkUser();
  }, [address])


  return (
    <>
      <div className="text-center m-32">
        <h1 className="text-8xl"><span className="font-bold text-green-600">Ad</span>Me</h1>
        <h1 className="mt-8 text-xl">Join us today and earn <span className="font-bold text-green-600">rewards</span> for your attention!</h1>
      </div>
    </>

  );
}
