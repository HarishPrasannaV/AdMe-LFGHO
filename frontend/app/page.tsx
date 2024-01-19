'use client'

import React, { useState, useEffect } from "react";
import { contractObj } from "@/components/contractConnect";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"



export default function joinAdMe() {

  async function addUser() {
    try{
      const withSigner = contractObj();
      await withSigner.addUser();
      console.log("User has been added succesfully")  
    }catch(error){
      window.alert(error);
    }
  
  }


  return (
<>
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
</>

  );
}
