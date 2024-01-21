"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import { contractObj } from "@/components/contractConnect"

const ghoFactor = BigInt(10 ** 18);


const formSchema = z.object({
    companyName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
    }),
    deposit: z.string(),
    rewardPerUser: z.coerce.number(),
    imageUrl: z.string().url()  
})

export default function ProfileForm() {
  const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            deposit: "",
            rewardPerUser: 0,
            imageUrl: ""
        },
      })
     
      async function onSubmit(values: z.infer<typeof formSchema>) {
        const withSigner = contractObj()
        const tx = await withSigner.addAdvert(BigInt(values.deposit) * ghoFactor, values.companyName, values.rewardPerUser, values.imageUrl);
        await tx.wait()
        console.log(tx)
        if(tx) {
          toast.success("Advert added successfully")
          router.refresh()
        }
      }

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10 ml-40 mr-40 border p-10">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Company..." {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deposit Tokens</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Number of tokens you want to deposit for Ad
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rewardPerUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward Per User</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} type="number" />
              </FormControl>
              <FormDescription>
                How many tokens per user?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image" {...field} />
              </FormControl>
              <FormDescription>
                URL for Ad Image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
