'use client'

import React, { useState, useEffect } from "react";
import { contractObj } from "@/components/contractConnect";
import Ad from "@/components/ui/ad";
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
  AD_ID: string;
  companyName: string;
  deposit: number;
  rewardPerUser: number;
  URL: string;
}

export default function Publications({ params }) {
  const [ads, setAds] = useState<Ad[]>([]);  

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

  useEffect(() => {
    fetchAds(params.page - 1, 1);
  }, []); // This will run the fetchAds function when the component mounts


  return (
    <>
      {ads.map((ad) => (
        <Ad ad={ad} key={ad.AD_ID} />
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
