'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { LogIn } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useModal } from 'connectkit'
import Link from 'next/link'

export function Nav() {
  const { address, isConnected } = useAccount()
  const { setOpen } = useModal()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


  async function connectWallet() {
    try {
      setOpen(true)
    } catch (err) {
      console.log('error:', err)
      setOpen(false)
    }
  }

  return (
    <nav className='border-b p-4 pl-10 flex sm:flex-row sm:items-center flex-col'>
      <div className='flex flex-1 flex-row'>
        <Link href='/'>
          <h1 className='text-gray'>
            <span className='font-bold'>Ad</span>
            Me
          </h1>
        </Link>
        {
         isClient && isConnected && (
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
        <ModeToggle />
      </div>
    </nav>
  )
}
