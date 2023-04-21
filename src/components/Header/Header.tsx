import { ConnectButton } from '@rainbow-me/rainbowkit';
const Header = () => {
  return (
    <header className="p-4">
      <div className="flex justify-end items-center gap-2">
        <ConnectButton accountStatus="address" />
      </div>
    </header>
  );
};

export default Header;
