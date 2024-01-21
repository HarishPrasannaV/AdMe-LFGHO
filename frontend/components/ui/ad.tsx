'use client';
import { Suspense, useState, useEffect, useRef, use } from "react"
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useAccount } from "wagmi";
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
import { ethers, BigNumber } from "ethers";



// Function to claculate attentiion based on user time

function calculateAttention(adScreenTime) {
  const maxScreenTime = 6000; // Upper limit for ad screen time

  // Ensure adScreenTime doesn't exceed the maximum value
  const clampedScreenTime = Math.min(adScreenTime, maxScreenTime);
  const attentionPercentage = (clampedScreenTime / maxScreenTime) * 100;
  const roundedAttention = Math.round(attentionPercentage);

  return roundedAttention;
}

interface UserData {
  0: BigNumber; 
  1: BigNumber; 
  2: string;    
}

export default function Ad({ ad }) {
    let user, nonce;
    const startTime = useRef(0);
    const endTime = useRef(0);
    const attention = useRef(0);
    const [userData, setUserData] = useState<UserData>([BigNumber.from(0), BigNumber.from(0), ""]);
    const [userId, setUserId] = useState(0);
    const [userNonce, setUserNonce] = useState(0);   
    const { address } = useAccount() 

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

    const adId = parseInt(ad.AD_ID._hex, 16); // Getting the AD ID

    async function updateDetails() {
      try {
        const withSigner = contractObj();
        const userData = await withSigner.registerdUserList(address);
        
        setUserData(userData);

        user = parseInt(userData.userId._hex, 16)
        setUserId(parseInt(userData.userId._hex, 16)); // Setting the User ID
        const userNoncee = await withSigner.adUserInteraction(adId, userId);   
        nonce = parseInt(userNoncee._hex, 16);    
        setUserNonce(parseInt(userNoncee._hex, 16)); // Setting user nonce

      } catch (error) {
        console.log(error);
      }
    }

    useEffect(() => {
        updateDetails();
    }, [userNonce, userId])   

    async function callDispense(adId, attention, signat) {
        const withSigner = contractObj();
        await withSigner.dispenseReward(adId, attention, signat)
    }


    
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
              console.log(attention, userNonce, adId, userId);

              // THE MESSAGE SIGNING DOSENT WORK
              signMessage(attention, userNonce, adId, userId).then((resolvedValue) => {
                console.log(resolvedValue)
                callDispense(adId, attention, resolvedValue);
              });
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
            <Card className="border-2 border-green-600">
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
