'use client'

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchAds(params.page - 1, 1);
    fetchPosts();
  }, []); // This will run the fetchAds function when the component mounts

  return (
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
  );
}
