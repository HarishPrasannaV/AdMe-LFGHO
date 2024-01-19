import { Suspense, useState, useEffect, useRef } from "react"
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import signMessage from "@/components/signMessage";
import { contractObj } from "@/components/contractConnect";

// Function to claculate attentiion based on user time

function calculateAttention(adScreenTime) {
  const maxScreenTime = 6000; // Upper limit for ad screen time

  // Ensure adScreenTime doesn't exceed the maximum value
  const clampedScreenTime = Math.min(adScreenTime, maxScreenTime);
  const attentionPercentage = (clampedScreenTime / maxScreenTime) * 100;
  const roundedAttention = Math.round(attentionPercentage);

  return roundedAttention;
}

export default function Ad({ ad }) {
    const startTime = useRef(0);
    const endTime = useRef(0);
    const attention = useRef(0);

    const changeCount = useRef(0);

    const updateStartTime = (newValue) => {
      startTime.current = newValue;
    };
  
    const updateEndTime = (newValue) => {
      endTime.current = newValue;
    };

    const updateAttention = (newValue) => {
      attention.current = newValue;
    };

    const updateChangeCount = (newValue) => {
      changeCount.current = newValue;
    };


    
    const [ref, inView] = useInView({
        threshold: 0.75, // The Screen time count starts only when atleast 75% of the advert is displayed on screen
        rootMargin: "0px",
        root: null,
        onChange: (inView, entry) => {
            if(inView && changeCount.current === 0){
              updateStartTime(Date.now());
              updateChangeCount(1);
              console.log("Start Time:", startTime.current);

            }
            else if(!inView && changeCount.current ===1){
              updateEndTime(Date.now());
              updateChangeCount(69);
              console.log("End Time:", endTime.current);
              const attention = calculateAttention(endTime.current - startTime.current);
              updateAttention(attention);
              console.log("Attention:", attention);

            }
            
        }
    });


    return (
        <Suspense fallback={<div>Loading...</div>} key={ad.AD_ID}>
                    <div 
                        className="px-10 py-8 flex flex-col items-center"             
                        data-ad-id={ad.AD_ID}
            ref={ref}
          >
            <Card>
              <CardHeader>
                <CardTitle>{ad.companyName}</CardTitle>
                <CardDescription>Watch ad to get rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <Image 
                  src="https://images.unsplash.com/photo-1682687221006-b7fd60cf9dd0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8"
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
  )
}
