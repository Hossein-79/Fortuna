import { Button } from "@/components/ui/button";
import { CalendarPlusIcon, ChevronDownIcon, GithubIcon, TicketIcon } from "lucide-react";
import { Link } from "react-router-dom";

function Divider() {
  return (
    <div className="relative border-t border-dashed my-5">
      <div className="flex items-center justify-center bg-white absolute w-10 h-10 rounded-full border border-dashed top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ChevronDownIcon className="w-6 h-6 text-neutral-300" />
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="container flex flex-col gap-24 mx-auto my-10">
      {/* ----- HERO ----- */}
      <section className="flex flex-col md:grid md:grid-cols-6 items-center gap-10">
        <div className="relative md:col-span-2 md:order-2 md:col-start-5">
          <img
            src="/hero.jpg"
            alt="Fortuna"
            className="absolute top-0 left-0 rounded-3xl shadow-2xl skew-x-3 skew-y-3 blur-xl"
          />
          <img src="/hero.jpg" alt="Fortuna" className="rounded-3xl shadow-2xl -skew-x-3 -skew-y-3 " />
        </div>
        <div className="md:col-span-3 md:order-1">
          <h2 className="text-4xl font-black mb-2">
            Empower Causes,
            <br />
            Win Rewards.
          </h2>
          <p className="text-neutral-500 leading-relaxed">
            Crowdfunding with a chance to win. Create causes, support meaningful projects, and enter decentralized
            lotteries—all on the blockchain.
          </p>
          <Button className="mt-5" variant="secondary" size="lg" asChild>
            <Link to="https://github.com/Hossein-79/Fortuna" target="_blank">
              <GithubIcon className="w-6 h-6 mr-2" />
              Follow development on GitHub
            </Link>
          </Button>
        </div>
      </section>
      <Divider />
      {/* ----- HOW IT WORKS ----- */}
      <section>
        <h3 className="text-2xl font-bold text-center mb-10">How Fortuna Works</h3>
        <div className="flex flex-col md:grid md:grid-cols-3 gap-5">
          {/* CREATE CAUSE */}
          <div className="flex flex-col items-center bg-slate-50 px-5 py-10 rounded-xl">
            <CalendarPlusIcon className="w-12 h-12 text-neutral-500 mb-3" />
            <h4 className="text-lg font-bold">Create a Cause</h4>
            <p className="mt-5 text-neutral-500 text-sm text-center">
              Easily set up a cause, provide details, set your funding goals, and choose a charity percentage. Your
              cause is ready to receive support and participation from the community.
            </p>
          </div>
          {/* CREATE CAUSE */}
          <div className="flex flex-col items-center bg-slate-50 px-5 py-10 rounded-xl">
            <TicketIcon className="w-12 h-12 text-neutral-500 mb-3" />
            <h4 className="text-lg font-bold">Buy Tickets & Support</h4>
            <p className="mt-5 text-neutral-500 text-sm text-center">
              Participants can buy lottery tickets to support causes they believe in. A portion of the proceeds goes to
              the cause, and they get a chance to win a prize.
            </p>
          </div>
          {/* CREATE CAUSE */}
          <div className="flex flex-col items-center bg-slate-50 px-5 py-10 rounded-xl">
            <CalendarPlusIcon className="w-12 h-12 text-neutral-500 mb-3" />
            <h4 className="text-lg font-bold">Win & Make an Impact</h4>
            <p className="mt-5 text-neutral-500 text-sm text-center">
              At the end of the campaign, a winner is drawn, receiving the majority of the funds, while a portion goes
              to the cause to help make it a reality.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
