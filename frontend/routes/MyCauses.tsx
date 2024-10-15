import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CauseResponse } from "./Cause";
import { useEffect, useState } from "react";
import Heading from "@/components/Heading";
import { HeartCrackIcon, ListTodo } from "lucide-react";
import Loading from "@/components/Loading";
import CauseItem from "@/components/CauseItem";

const fetchCauses = async (address: string): Promise<CauseResponse[]> => {
  const cause = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-causes-by-userid?address=${address}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!cause.ok) {
    throw new Error("Failed to fetch causes");
  }

  const { data } = await cause.json();
  return data;
};

export default function MyCauses() {
  const { account } = useWallet();

  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<CauseResponse[] | null>(null);

  useEffect(() => {
    const fetchCauseData = async () => {
      if (!account) return;
      setFetchedData(await fetchCauses(account?.address!));
      setLoading(false);
    };

    if (!fetchedData && loading) {
      fetchCauseData();
    }
  }, [account]);

  return (
    <>
      <Heading
        title="My Causes"
        description="All the causes you have created"
        icon={<ListTodo className="w-7 h-7 text-neutral-500" />}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          {fetchedData && fetchedData?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-5">
              {fetchedData?.map((cause) => <CauseItem key={cause.id} cause={cause} />)}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-neutral-400 m-auto grow h-full">
              <HeartCrackIcon size={64} />
              <span className="mt-3">You have not created any causes</span>
            </div>
          )}
        </>
      )}
    </>
  );
}
