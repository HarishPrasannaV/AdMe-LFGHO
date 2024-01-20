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

  // async function checkUser() {
  //   try{
  //     const withSigner = contractObj();
  //     const user = await withSigner.registerdUserList(address);
  //     const userId = parseInt(user.userId._hex, 16);
  //     console.log(userId);
  //     if(userId !== 0){
  //       setIsRegistered(true);
  //     }
  //   }catch(error){
  //     window.alert(error);
  //   }
  // }

  useEffect(() => {
    // checkUser();
  }, [address])


  return (
<>
  {/* {isConnected && !isRegistered && (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
    <h1 style={{ fontSize: "2em", fontWeight: "bold", color: "green" }}>Become a registered user</h1>
    <Button
      type="button"
      onClick={addUser}
      style={{
        fontSize: "1.5em",
        backgroundColor: "lightgreen",
        padding: "15px 30px",
        borderRadius: "5px",
        color: "white",
        cursor: "pointer",
        marginTop: "20px", 
      }}
    >
      Click to join us !
    </Button>
  </div>
  )} */}
</>

  );
}
