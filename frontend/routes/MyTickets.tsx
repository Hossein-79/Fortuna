import Heading from "@/components/Heading";
import Loading from "@/components/Loading";
import TicketItem from "@/components/TicketItem";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { HeartCrackIcon, TicketIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CauseResponse } from "./Cause";

export interface TicketResponse {
  id: number;
  created_at: EpochTimeStamp;
  user: string;
  amount: number;
  cause: CauseResponse;
}

const fetchTickets = async (address: string): Promise<TicketResponse[]> => {
  const cause = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-tickets-by-userid?address=${address}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!cause.ok) {
    throw new Error("Failed to fetch tickets");
  }

  const { data } = await cause.json();
  return data;
};

export default function MyTickets() {
  const { account } = useWallet();

  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<TicketResponse[] | null>(null);

  useEffect(() => {
    const fetchCauseData = async () => {
      if (!account) return;
      setFetchedData(await fetchTickets(account?.address!));
      setLoading(false);
    };

    if (!fetchedData && loading) {
      fetchCauseData();
    }
  }, [account]);

  return (
    <>
      <Heading
        title="My Tickets"
        description="All the tickets you have purchased"
        icon={<TicketIcon className="w-7 h-7 text-neutral-500" />}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          {fetchedData && fetchedData?.length > 0 ? (
            <div className="flex flex-col gap-5">
              {fetchedData?.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-neutral-400 m-auto grow h-full">
              <HeartCrackIcon size={64} />
              <span className="mt-3">You have not purchased any tickets</span>
            </div>
          )}
        </>
      )}
    </>
  );
}
