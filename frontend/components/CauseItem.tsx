import type { CauseResponse } from "@/routes/Cause";
import { calculatePercentage, convertTimestampToReadable } from "@/utils/helpers";
import { Link } from "react-router-dom";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { closeCause } from "@/entry-functions/closeCause";

function checkIfFinishedTime(deadline: number) {
  return new Date(deadline).valueOf() > new Date().valueOf();
}

export interface TicketResponse {
  id: number;
  created_at: EpochTimeStamp;
  user: string;
  amount: number;
  cause_id: number;
}

interface CauseProps {
  cause: CauseResponse;
}
export default function CauseItem(props: CauseProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [totalRaised, setTotalRaised] = useState(0);
  const [fetchedData, setFetchedData] = useState<TicketResponse[] | null>(null);
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-tickets-by-causeid?causeid=${props.cause.id}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!tickets.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const { data } = await tickets.json();
      setFetchedData(data);
    };

    if (!fetchedData && loading) {
      fetchTickets();
    }
  }, []);

  useEffect(() => {
    if (fetchedData) {
      const total = fetchedData.reduce((acc, ticket) => {
        return acc + ticket.amount;
      }, 0);
      setTotalRaised(total);
      setLoading(false);
    }
  }, [fetchedData]);

  async function handleDistributeCause(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!account) {
      toast({ description: "Please connect your wallet" });
      return;
    }

    setDistributing(true);
    try {
      const transaction = await signAndSubmitTransaction(
        closeCause({
          user: account.address!,
          cause_id: Number(props.cause.id),
          cause_addr: props.cause.created_by!,
        }),
      );
      console.log(transaction);
      toast({ description: "Cause closed and funds were distributed successfully." });
    } catch (error) {
      console.error(error);
      toast({ description: "Failed to distribute funds" });
    } finally {
      setDistributing(false);
    }
  }

  return (
    <Link className="border rounded overflow-hidden" to={`/cause/${props.cause.id}`}>
      <img
        className="aspect-video object-cover"
        src={`${import.meta.env.VITE_SUPABASE_IMAGE_ENDPOINT}/${props.cause.image}`}
        alt={props.cause.title}
      />
      <div className="flex flex-col gap-y-2 p-3">
        <h2 className="font-bold">{props.cause.title}</h2>
        <small className="block text-neutral-500 leading-snug">
          {props.cause.description.slice(0, 100)}
          {props.cause.description.length > 100 && "..."}
        </small>
      </div>
      <div className="bg-slate-50/50 p-3">
        <div>
          <div className="flex justify-between items-end px-1">
            <strong>{loading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : totalRaised} APT</strong>
            <small className="text-neutral-500">{props.cause.goal}</small>
          </div>
          {loading ? (
            <div className="flex items-center justify-center">
              <LoaderIcon className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <Progress value={calculatePercentage(totalRaised, props.cause.goal)} />
          )}
        </div>
        {checkIfFinishedTime(props.cause.deadline) ? (
          <div className="flex justify-between mt-4">
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">{convertTimestampToReadable(props.cause.deadline)}</span>
              <small className="text-xs text-neutral-400">Remaining Time</small>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium text-sm">{props.cause.ticket_price} APT</span>
              <small className="text-xs text-neutral-400">Per Ticket</small>
            </div>
          </div>
        ) : (
          <>
            {connected && account?.address === props.cause.created_by && props.cause.total_funds_raised > 0 ? (
              <Button className="w-full mt-4" variant="green" onClick={handleDistributeCause} disabled={distributing}>
                {distributing && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                Distribute Funds
              </Button>
            ) : (
              <div className="mt-4 text-center text-neutral-400 font-bold text-xs">Finished</div>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
