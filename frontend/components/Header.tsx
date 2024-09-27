import { Link } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";

export function Header() {
  return (
    <>
      <header className="flex items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <strong className="font-serif text-xl font-black bg-emerald-500 text-emerald-50 flex h-8 w-8 items-end justify-end rounded-sm px-1">
            F
          </strong>
          <span className="text-xl font-bold text-emerald-950">Fortuna</span>
        </Link>
        <nav>
          <WalletSelector />
        </nav>
      </header>
    </>
  );
}
