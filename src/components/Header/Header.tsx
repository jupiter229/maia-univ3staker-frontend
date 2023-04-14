import { MetaMask } from "@/config";
import { useWeb3 } from "@/hooks";
import { useConnect } from "wagmi";

const Header = () => {
  const { address } = useWeb3();
  const { connect } = useConnect();

  return (
    <header className="px-5 md:px-20 bg-white dark:bg-dark-mode-hard border-b border-transparent dark:border-dark-mode-border-soft">
      <div className="flex items-center relative justify-between py-7 flex-wrap">
        <div className="flex items-center gap-2 lg:gap-5">
          {!address && (
            <button onClick={() => connect({ connector: MetaMask })}>
              Connect
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
