import { Suspense, useState, useEffect, useRef } from "react"
import Image from "next/image";
import { useInView, IntersectionOptions } from "react-intersection-observer";
import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";

export default function Ad({ ad }) {
    const [visibleTime, setVisibleTime] = useState(0);
    const [isComponentVisible, setIsComponentVisible] = useState(false);
    const startTimeRef = useRef(0);
    
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.75,
        rootMargin: "0px",
        root: null
    });

    useEffect(() => {
        if (inView) {
          if (!isComponentVisible) {
            // Component has become visible
            setIsComponentVisible(true);
            startTimeRef.current = Date.now();
          }
        } else {
          if (isComponentVisible) {
            // Component has become invisible
            setIsComponentVisible(false);
            setVisibleTime((prevVisibleTime) => prevVisibleTime + (Date.now() - startTimeRef.current));
            console.log(visibleTime);
            startTimeRef.current = 0;
          }
        }
      }, [inView, isComponentVisible]);

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
                {/* <Image 
                  src={ad.URL}
                  width={400}
                  height={400}
                  alt="image"
                /> */}
              </CardContent>
              {/* <CardFooter>
                <p>sdfsd</p>
              </CardFooter> */}
            </Card>
          </div>
    </Suspense>
  )
}
