'use client'

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { contractObj } from "@/components/contractConnect";

interface Ad {
  AD_ID: string;
  companyName: string;
  deposit: number;
  rewardPerUser: number;
  URL: string;
}

export default function Publications() {
  const [ads, setAds] = useState<Ad[]>([]);

  async function fetchAds(start, end) {
    try {
      const withSigner = contractObj();
      const adsData = await withSigner.returnAds(start, end);
      console.log(adsData);
      setAds(adsData);
    } catch (error) {
      console.error("Error fetching ads:", error);
      // Handle the error, e.g., show an error message to the user
    }
  }

  useEffect(() => {
    fetchAds(0, 2);
  }, []); // This will run the fetchAds function when the component mounts

  return (
    <>
      {ads.map((ad) => (
        <div className="px-10 py-14 flex flex-col items-center" key={ad.AD_ID}>
          <Card>
            <CardHeader>
              <CardTitle>{ad.companyName}</CardTitle>
              {/* <CardDescription>sdsf</CardDescription> */}
            </CardHeader>
            <CardContent>
              <img 
                src={ad.URL}
                width={500}
                height={500}
                alt="image"
              />
              <p>{ad.URL}</p>
            </CardContent>
            <CardFooter>
              <p>sdfsd</p>
            </CardFooter>
          </Card>
        </div>
      ))}
    </>
  );
}
