'use client'

import React, { useState, useEffect, Suspense, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { contractObj } from "@/components/contractConnect";
import ViewTracker from "@/components/view-tracker";

interface Ad {
  AD_ID: string;
  companyName: string;
  deposit: number;
  rewardPerUser: number;
  URL: string;
}

export default function Publications() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [timers, setTimers] = useState<{ total: number, start: number | null }[]>([]);
  const cardRefs = useRef([] as React.MutableRefObject<HTMLDivElement>[]);

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


  useEffect(() => {
    const options = {
      root: null,
      // rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {        
        const id = entry.target.getAttribute('data-ad-id');
        const timer = timers[parseInt(id as string) - 1] || { total: 0, start: null };

        if (entry.isIntersecting) {
          timer.start = Date.now();
        } else if (timer.start) {
          timer.total += new Date().getTime() - timer.start;
          timer.start = null;
        }
        setTimers([...timers, timer])
        console.log(timers);
      })
    }, options);

    cardRefs.current.forEach(cardRef => {
      observer.observe(cardRef.current);
    });
      

      
  }, [ads]);


  return (
    <>
      {ads.map((ad) => (
        <Suspense fallback={<div>Loading...</div>} key={ad.AD_ID}>
          <div 
            className="px-10 py-12 flex flex-col items-center"             
            ref={cardRefs[ad.AD_ID]}
            data-ad-id={ad.AD_ID}
          >
            <Card>
              <CardHeader>
                <CardTitle>{ad.companyName}</CardTitle>
                <CardDescription>Watch ad to get rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <Image 
                  src={ad.URL}
                  width={400}
                  height={400}
                  alt="image"
                />
              </CardContent>
              {/* <CardFooter>
                <p>sdfsd</p>
              </CardFooter> */}
            </Card>
          </div>
        </Suspense>
      ))}
    </>
  );
}
