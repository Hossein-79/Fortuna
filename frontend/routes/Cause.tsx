import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { buyTicket } from "@/entry-functions/buyTicket";
import { calculatePercentage, convertTimestampToReadable } from "@/utils/helpers";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CopyIcon, InfoIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export interface CauseResponse {
  id: bigint;
  created_at: EpochTimeStamp;
  title: string;
  description: string;
  goal: number;
  deadline: EpochTimeStamp;
  charity_percentage: number;
  image: string;
  ticket_price: number;
  total_tickets_sold: number;
  total_funds_raised: number;
  created_by: string;
}

export interface UserResponse {
  created_at: string;
  name: string;
  bio: string;
  profile_picture: string;
  email: string;
  wallet_address: string;
}

const fetchCause = async (id: string): Promise<CauseResponse> => {
  const cause = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-cause?id=${id}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!cause.ok) {
    throw new Error("Failed to fetch cause");
  }

  const { data, tickets } = await cause.json();
  return { ...data, total_tickets_sold: tickets, total_funds_raised: tickets * data.ticket_price };
};

const fetchUser = async (wallet: string): Promise<UserResponse> => {
  const user = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user?wallet_address=${wallet}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!user.ok) {
    throw new Error("Failed to fetch user info");
  }

  const { data } = await user.json();
  return data;
};

export default function Cause() {
  const { toast } = useToast();
  const { account, signAndSubmitTransaction } = useWallet();
  const { id } = useParams<{ id: string; creator: string }>();

  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [fetchedData, setFetchedData] = useState<CauseResponse | null>(null);
  const [fetchedUserData, setFetchedUserData] = useState<UserResponse | null>(null);
  const [ticketAmount, setTicketAmount] = useState(1);

  useEffect(() => {
    const fetchCauseData = async () => {
      setFetchedData(await fetchCause(id!));
      setLoading(false);
    };

    if (!fetchedData && id && loading) {
      fetchCauseData();
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setFetchedUserData(await fetchUser(fetchedData?.created_by!));
      setLoadingUser(false);
    };

    if (!fetchedUserData && fetchedData?.created_by && loadingUser) {
      fetchUserData();
    }
  }, [fetchedData]);

  function handleCopyWalletAddress(address: string) {
    navigator.clipboard.writeText(address);
    toast({ description: `Wallet address copied to clipboard` });
  }

  function incrementTicketAmount() {
    setTicketAmount((prev) => prev + 1);
  }

  function decrementTicketAmount() {
    if (ticketAmount > 1) {
      setTicketAmount((prev) => prev - 1);
    }
  }

  async function handleBuyTicket(amount: number) {
    if (!account) {
      toast({ description: "Please connect your wallet" });
      return;
    }

    try {
      const transaction = await signAndSubmitTransaction(
        buyTicket({
          user: account.address!,
          amount,
          cause_id: Number(id),
          to_address: fetchedData?.created_by!,
        }),
      );
      console.log(transaction);

      const data = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/buy-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          cause_id: Number(id),
          user: account.address,
          amount: ticketAmount,
        }),
      });
      console.log("data", data);

      toast({ description: "Ticket bought successfully" });
      setTicketAmount(1);
    } catch (error) {
      toast({ description: "Failed to buy ticket" });
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <div className="md:grid md:grid-cols-6 gap-10">
      <div className="md:col-span-4 flex flex-col gap-4">
        <img
          className="aspect-video object-cover rounded-lg"
          src={`${import.meta.env.VITE_SUPABASE_IMAGE_ENDPOINT}/${fetchedData?.image}`}
          alt={fetchedData?.title}
        />
        <div>
          <h1 className="font-bold text-xl">{fetchedData?.title}</h1>
          <small className="text-neutral-500">
            Created at {new Date(fetchedData?.created_at!).toLocaleDateString()}
          </small>
        </div>
        <div className="text-neutral-600">{fetchedData?.description}</div>
      </div>
      <div className="md:col-span-2">
        {/* ----- RAISED & GOAL ----- */}
        <section>
          <div className="flex justify-between mb-2">
            <div className="flex flex-col items-start">
              <strong>{fetchedData?.total_funds_raised} APT</strong>
              <small>Raised</small>
            </div>
            <div className="flex flex-col items-end text-neutral-400">
              <strong>{fetchedData?.goal} APT</strong>
              <small>Goal</small>
            </div>
          </div>
          <Progress value={calculatePercentage(fetchedData?.total_funds_raised!, fetchedData?.goal!)} />
        </section>
        {/* ----- CREATOR CARD ----- */}
        <section className="border rounded-md mt-5">
          <div className="grid grid-cols-2 border-b">
            <div className="flex flex-col items-center justify-center border-r p-2">
              <strong>{fetchedData?.total_tickets_sold}</strong>
              <small className="text-xs text-neutral-400">
                Ticket{fetchedData?.total_tickets_sold === 1 ? "" : "s"} Sold
              </small>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <strong>{convertTimestampToReadable(fetchedData?.deadline!)}</strong>
              <small className="text-xs text-neutral-400">Remaining Time</small>
            </div>
          </div>
          <div className="flex items-center border-b px-2 py-3">
            <InfoIcon className="text-neutral-500 w-5 h-5 mr-1" />
            <p className="text-xs text-neutral-500">
              {fetchedData?.charity_percentage}% of the raised funds will be spent for the cause.
            </p>
          </div>
          {loadingUser ? (
            <div className="text-sm text-center text-neutral-400 p-2">Loading info...</div>
          ) : (
            <div className="flex items-center gap-2 p-2">
              <Avatar>
                <AvatarImage
                  src={`${import.meta.env.VITE_SUPABASE_IMAGE_ENDPOINT}${fetchedUserData?.profile_picture}`}
                />
                <AvatarFallback>{fetchedUserData?.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col grow">
                <strong className="text-sm">{fetchedUserData?.name}</strong>
                <small className="text-neutral-500 text-xs">Creator</small>
              </div>
              <Button
                variant="outline"
                size="icon"
                title="Copy Wallet Address"
                onClick={() => handleCopyWalletAddress(fetchedUserData?.wallet_address!)}
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>
        {/* ----- BUY TICKET ----- */}
        <section className="mt-5">
          <div className="flex gap-3 mb-3">
            <Button variant="icon" size="icon" onClick={decrementTicketAmount}>
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span className="flex justify-center items-center bg-slate-50 grow text-center rounded-full border">
              {ticketAmount}
            </span>
            <Button variant="icon" size="icon" onClick={incrementTicketAmount}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="green" className="w-full" size="lg" onClick={() => handleBuyTicket(ticketAmount)}>
            Buy {ticketAmount} Ticket{ticketAmount > 0 && "s"} ({fetchedData?.ticket_price! * ticketAmount} APT)
          </Button>
        </section>
      </div>
    </div>
  );
}
