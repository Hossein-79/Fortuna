import CauseItem from "@/components/CauseItem";
import Heading from "@/components/Heading";
import Loading from "@/components/Loading";
import { CauseResponse } from "@/routes/Cause";
import { CompassIcon, HeartCrackIcon } from "lucide-react";
import { useEffect, useState } from "react";

const fetchCauses = async (): Promise<CauseResponse[]> => {
  const causes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-causes`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!causes.ok) {
    throw new Error("Failed to fetch causes");
  }

  const { data } = await causes.json();
  return data;
};

export default function Explore() {
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<CauseResponse[] | null>(null);

  useEffect(() => {
    const fetchCausesData = async () => {
      setFetchedData(await fetchCauses());
      setLoading(false);
    };

    if (!fetchedData && loading) {
      fetchCausesData();
    }
  }, []);

  return (
    <>
      <Heading
        title="Explore Causes"
        description="Discover and support causes"
        icon={<CompassIcon className="w-7 h-7 text-neutral-500" />}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          {fetchedData && fetchedData?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
              {fetchedData?.map((cause) => <CauseItem key={cause.id} cause={cause} />)}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-neutral-400 m-auto grow h-full">
              <HeartCrackIcon size={64} />
              <span className="mt-3">No causes found</span>
            </div>
          )}
        </>
      )}
    </>
  );
}
