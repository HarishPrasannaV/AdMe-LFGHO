"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"

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
import { contractObj } from "@/components/contractConnect"

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
        const tx = await withSigner.addAdvert(BigInt(values.deposit), values.companyName, values.rewardPerUser, values.imageUrl);
        await tx.wait()
        console.log(tx)
        if(tx) {
          router.refresh()
        }
      }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
              <FormLabel>Deposity Tokens</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
                <Input placeholder="shadcn" {...field} type="number" />
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
                <Input placeholder="shadcn" {...field} />
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
