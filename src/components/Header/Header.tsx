import { MetaMask } from "@/config";
import { useWeb3 } from "@/hooks";
import { getDisplayAddress } from "@/utils";
import { useConnect } from "wagmi";
import { Button } from "../Button";

const Header = () => {
  const { account } = useWeb3();
  const { connect } = useConnect();

  return (
    <header className="p-4">
      <div className="flex justify-end items-center gap-2">
        {account ? (
          <div className="px-6 py-2 rounded-2xl bg-blue/25 text-blue">
            {getDisplayAddress(account)}
          </div>
        ) : (
          <Button onClick={() => connect({ connector: MetaMask })}>
            Connect
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
