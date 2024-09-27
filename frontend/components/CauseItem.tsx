import type { CauseResponse } from "@/routes/Cause";
import { calculatePercentage, convertTimestampToReadable } from "@/utils/helpers";
import { Link } from "react-router-dom";
import { Progress } from "./ui/progress";

function checkIfFinishedTime(deadline: number) {
  return new Date(deadline).valueOf() > new Date().valueOf();
}

interface CauseProps {
  cause: CauseResponse;
}
export default function CauseItem(props: CauseProps) {
  return (
    <Link className="border rounded overflow-hidden" to={`/cause/${props.cause.id}`}>
      <img
        className="aspect-video object-cover"
        src={`${import.meta.env.VITE_SUPABASE_IMAGE_ENDPOINT}${props.cause.image}`}
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
            <strong>{props.cause.total_funds_raised} APT</strong>
            <small className="text-neutral-500">{props.cause.goal}</small>
          </div>
          <Progress value={calculatePercentage(props.cause.total_funds_raised, props.cause.goal)} />
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
          <div className="mt-4 text-center text-neutral-400 font-bold text-xs">Finished</div>
        )}
      </div>
    </Link>
  );
}
