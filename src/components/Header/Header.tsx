import { NAV_ITEMS } from "@/config";
import Link from "next/link";
import { ConnectWallet } from "../ConnectWallet";

const Header = () => {
  return (
    <header className="flex justify-between items-center gap-2 p-4">
      <nav className="flex px-8 gap-12">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-blue hover:text-blue/30 cursor-pointer"
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <ConnectWallet />
    </header>
  );
};

export default Header;
