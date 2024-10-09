import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCause } from "@/entry-functions/createCause";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { aptosClient } from "@/utils/aptosClient";
import { supabase } from "@/utils/supabaseClient";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { CommittedTransactionResponse } from "@aptos-labs/ts-sdk";

export interface Cause {
  id: bigint;
  title: string;
  description: string;
  goal: number;
  deadline: EpochTimeStamp;
  charity_percentage: number;
  image: string;
  ticket_price: number;
  created_by: string;
}

const formSchema = z.object({
  id: z.number(),
  title: z.string().min(2).max(50),
  description: z.string().max(500),
  goal: z.coerce.number().min(1),
  deadline: z.coerce.number(),
  charity_percentage: z.coerce.number().min(0).max(100),
  image: z.instanceof(FileList).optional(),
  ticket_price: z.coerce.number().min(0),
  created_by: z.string().length(66),
  total_funds_raised: z.number(),
  total_tickets_sold: z.number(),
});

async function uploadImage(file: File) {
  const fileExtension = file.name.split(".").pop();
  const fileName = `${Date.now()}${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const { data, error } = await supabase.storage.from("images").upload(fileName, file);

  if (error) {
    throw error;
  } else {
    return data;
  }
}

export default function Create() {
  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [isDeployed, setIsDeployed] = useState<CommittedTransactionResponse | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      created_by: account?.address ?? "",
      id: Math.floor(Math.random() * 100000000),
      title: "",
      description: "",
      deadline: Date.now(),
      goal: 0,
      charity_percentage: 0,
      image: undefined,
      ticket_price: 0,
      total_funds_raised: 0,
      total_tickets_sold: 0,
    },
  });

  useEffect(() => {
    if (account?.address) {
      form.setValue("created_by", account.address);
    }
  }, [account]);

  const fileRef = form.register("image");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!account?.address) return;
    if (submitting) return;
    setSubmitting(true);
    try {
      if (!isDeployed) {
        // ----- CREATE CAUSE ON CHAIN -----
        const committedCause = await signAndSubmitTransaction(
          createCause({
            user: values.created_by,
            title: values.title,
            charity_percentage: values.charity_percentage,
            goal: values.goal,
            ticket_price: values.ticket_price,
            cause_id: values.id,
          }),
        );
        console.log("🎈 commited:", committedCause);
        const executedCause = await aptosClient().waitForTransaction({
          transactionHash: committedCause.hash,
        });
        console.log("🎈 executed:", executedCause);
        setIsDeployed(executedCause);
      }

      // ----- UPLOAD IMAGE -----
      const uploadedImage = await uploadImage(values.image?.[0]!);
      const imageUrl = uploadedImage.path;

      // ----- CREATE CAUSE IN DATABASE -----
      const data = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-cause`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          deadline: new Date(values.deadline).toISOString(),
          image: imageUrl,
        }),
      });

      if (!data.ok) {
        throw new Error("Failed to create cause");
      }

      console.log("Cause created successfully", await data.json());
      toast({
        description: "Your cause has been created successfully.",
      });
    } catch (error) {
      console.error("Failed to create cause", error);
      toast({
        description: "Failed to create cause",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ----- WALLET ADDRESS ----- */}
        <FormField
          control={form.control}
          name="created_by"
          render={({ field }) => <Input type="hidden" {...field} />}
        />
        {/* ----- ID ----- */}
        <FormField control={form.control} name="id" render={({ field }) => <Input type="hidden" {...field} />} />
        {/* ----- TOTAL RAISED ----- */}
        <FormField
          control={form.control}
          name="total_funds_raised"
          render={({ field }) => <Input type="hidden" {...field} />}
        />
        {/* ----- TOTAL SOLD ----- */}
        <FormField
          control={form.control}
          name="total_tickets_sold"
          render={({ field }) => <Input type="hidden" {...field} />}
        />
        {/* ----- TITLE ----- */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>The title of your cause.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          disabled={submitting}
        />
        {/* ----- DESCRIPTION ----- */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>A brief description of your cause.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          disabled={submitting}
        />
        {/* ----- IMAGE ----- */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input type="file" {...fileRef} disabled={submitting} />
              </FormControl>
              <FormDescription>An image to represent your cause.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          disabled={submitting}
        />
        {/* ----- GOAL ----- */}
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Amount (APT)</FormLabel>
              <FormControl>
                <Input type="number" inputMode="decimal" placeholder="Goal" {...field} />
              </FormControl>
              <FormDescription>The amount you want to raise.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          disabled={submitting}
        />
        {/* ----- DEADLINE ----- */}
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>The deadline for your cause.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          disabled={submitting}
        />
        {/* ----- CHARITY PERCENTAGE ----- */}
        <FormField
          control={form.control}
          name="charity_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Charity Percentage</FormLabel>
              <FormControl>
                <Input type="number" inputMode="decimal" placeholder="Goal" {...field} />
              </FormControl>
              <FormDescription>The percentage of funds that will go to the cause.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          disabled={submitting}
        />
        {/* ----- TICKET PRICE ----- */}
        <FormField
          control={form.control}
          name="ticket_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Price (APT)</FormLabel>
              <FormControl>
                <Input type="number" inputMode="decimal" placeholder="Ticket Price" {...field} />
              </FormControl>
              <FormDescription>The price of each ticket for the lottery.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting}>
          {submitting && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
          Save
        </Button>
      </form>
    </Form>
  );
}
