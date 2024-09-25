import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/utils/supabaseClient";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profile_picture: string;
  wallet_address: string;
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  bio: z.string().max(160),
  profile_picture: z.instanceof(FileList).optional(),
  wallet_address: z.string().length(66),
});

async function fetchProfile(walletAddress: string): Promise<UserProfile> {
  const profileData = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user?wallet_address=${walletAddress}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!profileData.ok) {
    throw new Error("Failed to fetch user");
  }

  const json = await profileData.json();
  return json.data as UserProfile;
}

async function uploadProfilePicture(file: File) {
  const fileExtension = file.name.split(".").pop();
  // filename: current date + random string + file extension
  const fileName = `${Date.now()}${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const { data, error } = await supabase.storage.from("images").upload(fileName, file);

  if (error) {
    throw error;
  } else {
    return data;
  }
}

async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    let profileData = { ...values, profile_picture: undefined as string | undefined };

    if (values.profile_picture) {
      const uploadedProfilePicture = await uploadProfilePicture(values.profile_picture?.[0]);
      const profilePictureUrl = uploadedProfilePicture.path;
      profileData.profile_picture = profilePictureUrl;
    }

    const data = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/edit-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!data.ok) {
      throw new Error("Failed to update user");
    }

    console.log("User updated successfully", await data.json());
  } catch (error) {
    console.error("Failed to update user", error);
  }
}

export default function MyProfile() {
  const { account } = useWallet();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchedData, setFetchedData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setFetchedData(await fetchProfile(account?.address!));
    };

    if (account && !fetchedData) {
      fetchUserProfile();
    }
  }, [account]);

  useEffect(() => {
    if (fetchedData) {
      form.reset({ ...fetchedData, profile_picture: undefined });
      setLoading(false);
    }
  }, [fetchedData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const fileRef = form.register("profile_picture");

  return loading ? (
    <div>loading...</div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ----- WALLET ADDRESS ----- */}
        <FormField
          control={form.control}
          name="wallet_address"
          render={({ field }) => <Input type="hidden" placeholder="Wallet Address" {...field} />}
        />
        {/* ----- NAME ----- */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>Your name will be displayed on your profile.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ----- EMAIL ----- */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>Your email will be kept private.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ----- BIO ----- */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Bio" {...field} />
              </FormControl>
              <FormDescription>Write a short bio about yourself.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ----- PROFILE PICTURE ----- */}
        <FormField
          control={form.control}
          name="profile_picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input type="file" placeholder="Profile Picture" {...fileRef} />
              </FormControl>
              <FormDescription>Enter the URL of your profile picture.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
