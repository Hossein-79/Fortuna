import { CodeIcon, GithubIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="px-5 py-7 flex justify-between items-center text-sm bg-slate-100">
      <div className="flex items-center">
        <CodeIcon className="w-4 h-4 mr-2" />
        Designed and developed by{" "}
        <Link to="https://github.com/almoloo>" className="text-emerald-500 mx-1">
          Ali
        </Link>
        {" and "}
        <Link to="https://github.com/hossein-79" className="text-emerald-500 mx-1">
          Hossein
        </Link>
      </div>
      <Link to="https://github.com/Hossein-79/Fortuna" className="text-neutral-500">
        <GithubIcon className="w-4 h-4" />
      </Link>
    </footer>
  );
}
