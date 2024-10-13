import { TicketResponse } from "@/routes/MyTickets";
import { Link } from "react-router-dom";

interface TicketItemProps {
  ticket: TicketResponse;
}

export default function TicketItem({ ticket }: TicketItemProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-50 border rounded-xl p-3">
      <img
        className="w-full h-auto md:h-[100px] md:w-auto rounded-xl shrink-0"
        src={`${import.meta.env.VITE_SUPABASE_IMAGE_ENDPOINT}/${ticket.cause.image}`}
        alt={ticket.cause.title}
      />
      <div className="flex items-center justify-between grow">
        <div className="grow">
          <Link to={`/cause/${ticket.cause.id}`}>
            <h2 className="text-lg font-bold mb-1">{ticket.cause.title}</h2>
          </Link>
          <small className="text-neutral-500">
            Purchased at{" "}
            <time>
              {new Date(ticket.created_at).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </time>
          </small>
        </div>
        <div className="flex flex-col shrink-0 text-right">
          <span className="text-lg font-bold">{ticket.amount}</span>
          <small className="text-neutral-500">x {ticket.cause.ticket_price} APT</small>
        </div>
      </div>
    </div>
  );
}
