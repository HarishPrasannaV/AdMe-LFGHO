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
    <Button type="button" onClick={addUser}>Join Us!</Button>
    </>
  );
}
