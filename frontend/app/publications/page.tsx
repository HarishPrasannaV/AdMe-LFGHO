'use client'

import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { contractObj } from "@/components/contractConnect";
import Ad from "@/components/ui/ad";

interface Ad {
  AD_ID: string;
  companyName: string;
  deposit: number;
  rewardPerUser: number;
  URL: string;
}

export default function Publications() {
  const [ads, setAds] = useState<Ad[]>([]);
  const { ref, inView, entry } = useInView({
    root: null,
    rootMargin: "0px",
    threshold: 0.75,
    onChange(inView, entry) {
      if (inView) {
        console.log(entry.target.getAttribute("data-ad-id"));
      }
    },
  })
  

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
    fetchAds(0, 3);
  }, []); // This will run the fetchAds function when the component mounts


  return (
    <>
      {ads.map((ad) => (
        <Ad ad={ad} />
      ))}
    </>
  );
}
