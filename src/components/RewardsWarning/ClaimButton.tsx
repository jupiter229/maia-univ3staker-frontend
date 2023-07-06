import { useClaimAccruedRewards } from "@/hooks";

interface IProps {
  tokens: string[];
}

export const WarningClaimButton: React.FC<IProps> = ({ tokens }) => {
  const onClaim = useClaimAccruedRewards();

  return (
    <div className="flex justify-center gap-4">
      <button
        className={`py-2 px-4 w-full max-w-[200px] bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded rounded-2xl disabled:opacity-40 disabled:hover:text-white`}
        onClick={() => onClaim(tokens)}
      >
        Claim Rewards
      </button>
    </div>
  );
};

export default WarningClaimButton;
