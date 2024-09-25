import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full grow m-auto">
      <LoaderIcon className="w-12 h-12 text-neutral-400 animate-spin" />
      <small className="text-neutral-300 mt-2">Loading</small>
    </div>
  );
}
