import { Suspense } from "react"
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Post({ post }) {
  return (
    <Suspense>
        <div 
            className="px-10 py-8 flex flex-col items-center"             
            data-ad-id={post.id}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-row">
                  <Avatar>
                    <AvatarImage src={post.imageUrl} />
                    <AvatarFallback>{post.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="ml-4 mt-2">{post.name}</CardTitle>
                </div>
                <CardDescription className="mt-4">
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
