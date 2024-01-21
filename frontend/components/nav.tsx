'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { contractObj } from './contractConnect'
import { LogIn } from 'lucide-react'
import { useAccount, useDisconnect } from 'wagmi'
import { useModal } from 'connectkit'
import { ethers, BigNumber } from "ethers";
import Link from 'next/link'

interface UserData {
  0: BigNumber; 
  1: BigNumber; 
  2: string;    
}

export function Nav() {
  const [userData, setUserData] = useState<UserData>([BigNumber.from(0), BigNumber.from(0), ""]);
  const { address, isConnected } = useAccount()
  const { setOpen } = useModal()
  const [isClient, setIsClient] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  async function checkUser() {
    try{
      const withSigner = contractObj();
      const user = await withSigner.registerdUserList(address);
      const userId = parseInt(user.userId._hex, 16);
      if(userId !== 0){
        setIsRegistered(true);
      }
    }catch(error){
      console.log(error);
    }
  }

  async function updateDetails() {
    try {
      const withSigner = contractObj();
      const userData = await withSigner.registerdUserList(address);
      setUserData(userData);
    } catch (error) {
      window.alert(error);
    }
  }

  useEffect(() => {
    setIsClient(true);
    updateDetails();  
  }, [address, isConnected])

  useEffect(() => {
    checkUser();
  }, [address, isConnected])


  async function connectWallet() {
    try {
      setOpen(true)
    } catch (err) {
      console.log('error:', err)
      setOpen(false)
    }
  }

  async function addUser() {
    try{
      const withSigner = contractObj();
      await withSigner.addUser();
      console.log("User has been added succesfully")  
    }catch(error){
      console.log(error);
    }  
  }

  return (
    <nav className='border-b p-4 pl-10 flex sm:flex-row sm:items-center flex-col'>
      <div className='flex flex-1 flex-row'>
        <Link href='/'>
          <h1 className='text-gray'>
            <span className='font-bold text-green-600'>Ad</span>
            Me
          </h1>
        </Link>
        {
         isClient && isConnected && isRegistered && (
            <Link href='/profile'>
              <p className='ml-4 text-muted-foreground'>Rewards</p>
            </Link>
          )
        }
        <Link href='/publications/1'>
          <p className='ml-4 text-muted-foreground'>Publications</p>
        </Link>
        <Link href='/Ad'>
          <p className='ml-4 text-muted-foreground'>Publish your Advert!</p>
        </Link>
      </div>
      <div className='mr-4'>
        <h2>Rewards Earned: {userData ? parseInt(userData[1]._hex, 16) : 0}</h2>
      </div>
      <div className='sm:hidden mt-3'>
        {
          isClient && !address && (
            <Button variant='outline' className='mr-3' onClick={connectWallet}>
              <LogIn className='mr-2' />
              Connect Wallet
            </Button>
          ) 
        }
        <ModeToggle />
      </div>
      <div className='mr-4 sm:flex items-center hidden '>
        {
           isClient && !address && (
            <Button variant='outline' className='mr-3' onClick={connectWallet}>
              <LogIn className='mr-2' />
              Connect Wallet
            </Button>
          )
        }
        {
          isClient && isConnected && !isRegistered && (
            <Button variant='outline' className='mr-3' onClick={addUser}>
              <LogIn className='mr-2' />
              Register with AdMe
            </Button>
          )
        }
        <ModeToggle />
      </div>
    </nav>
  )
}
