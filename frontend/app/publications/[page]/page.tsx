'use client'

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { contractObj } from "@/components/contractConnect";
import Ad from "@/components/ui/ad";
import Post from "@/components/ui/post";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { set } from "react-hook-form";


interface Ad {
  AD_ID: {
    _hex: string;
  };
  companyName: string;
  deposit: number;
  rewardPerUser: number;
  URL: string;
}

interface Post {
  _id: string;
  name: string;
  content: string;
  imageUrl: string;
}

export default function Publications({ params }) {
  const [ads, setAds] = useState<Ad[]>([]);  
  const [posts, setPosts] = useState<Post[]>([]);
  const { address, isConnected } = useAccount();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function checkUser() {
    try{
      setLoading(true);
      const withSigner = contractObj();
      const user = await withSigner.registerdUserList(address);
      const userId = parseInt(user.userId._hex, 16);
      console.log(userId);
      if(userId !== 0){
        setIsRegistered(true);
      }
      setLoading(false);
    }catch(error){
      console.log(error);
    }
  }

  async function fetchAds(start, end) {
    try {
      const withSigner = contractObj();
      const adsData = await withSigner.returnAds(start, end);
      // console.log(adsData);
      setAds(adsData);
    } catch (error) {
      console.error("Error fetching ads:", error);
      // Handle the error, e.g., show an error message to the user
    }
  }

  async function fetchPosts() {
    try {
      const res = await fetch("http://localhost:4000/user-posts");
      const userposts = await res.json();
      setPosts(userposts.slice(7 * (params.page - 1), (7 * (params.page - 1)) + 7));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

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
    fetchAds(params.page - 1, 1);
    fetchPosts();
  }, []);

  useEffect(() => {
    checkUser();
  }, [])

  return (
    <>
      {isConnected && isRegistered && (
        <>
        {posts.slice(0, 5).map((post) => (
          <Post post={post} key={post._id} />
        ))}
  
        {ads.map((ad) => (
          <Ad ad={ad} key={ad.AD_ID._hex} />
        ))}
  
        {posts.slice(5, 7).map((post) => (
          <Post post={post} key={post._id} />
        ))}
  
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`/publications/${parseInt(params.page) - 1}`} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/publications/${parseInt(params.page)}`}>{params.page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/publications/${parseInt(params.page) + 1}`}>
              {parseInt(params.page) + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/publications/${parseInt(params.page) + 2}`}>
                {parseInt(params.page) + 2}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={`/publications/${parseInt(params.page) + 1}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        </>
      )}

      {isConnected && !isRegistered && !loading && (
        <Suspense>
        <AlertDialog open={true}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Register to view Posts</AlertDialogTitle>
            <AlertDialogDescription>
              In order to get reward from Ads you have to register with AdMe to view Publications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <button onClick={() => {router.push('/')}}>Go Back</button>              
              </AlertDialogCancel>
            <AlertDialogAction>
              <button onClick={() => {
                addUser();
                router.refresh();
              }}>
                Register
              </button>              
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </Suspense>
      )}
      

    </>
  );
}
