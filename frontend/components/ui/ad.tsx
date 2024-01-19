import { Suspense, useState, useEffect } from "react"
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

export default function Ad({ ad }) {
    const [totalVisibleTime, setTotalVisibleTime] = useState(0);
    const [userReward, setUserReward] = useState(0);

    let startTime;

    const { ref, inView, entry } = useInView({
        triggerOnce: false,
        root: null,
        rootMargin: "0px",
        threshold: 0.75,
        onChange: (inView, entry) => {
        
          if (inView) {
            startTime = new Date().getTime();
            console.log("View:",entry.target.getAttribute("data-ad-id"), startTime);
          }
          if (!inView) {
            const visibleTime = new Date().getTime() - startTime;
            setTotalVisibleTime(prevVisibleTime => prevVisibleTime + visibleTime);
            console.log("No View:",entry.target.getAttribute("data-ad-id"), visibleTime);
          }
        },
      })

  return (
    <Suspense fallback={<div>Loading...</div>} key={ad.AD_ID}>
          <div 
            className="px-10 py-12 flex flex-col items-center"             
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
  )
}
