import { Suspense, useState, useEffect, useRef } from "react"
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


export default function Post({ post }) {
  return (
    <Suspense>
        <div 
            className="px-10 py-12 flex flex-col items-center"             
            data-ad-id={post.id}
          >
            <Card>
              <CardHeader>
                <CardTitle>{post.name}</CardTitle>
                <CardDescription>
                    <p className="text-left">{post.content}</p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image 
                  src={post.imageUrl}
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
