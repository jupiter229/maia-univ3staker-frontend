import { useUserRewards } from "@/hooks/rewards";
import { useMemo } from "react";
import WarningClaimButton from "./ClaimButton";

const RewardsWarning = () => {
  const { rewards } = useUserRewards();

  const hasUnclaimedRewards = useMemo(() => {
    if (rewards.length === 0) return false;
    else return true;
  }, [rewards]);

  const tokens = useMemo(() => {
    return rewards.map((reward) => {
      return reward.token;
    });
  }, [rewards]);

  return (
    <>
      {hasUnclaimedRewards ? (
        <div className="flex mx-12 py-2 px-4 rounded bg-green-600 text-white">
          <svg
            className="flex-shrink-0 inline w-4 h-4 mr-3 align-middle my-auto"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="flex my-auto">
            <span className="font-medium">Unclaimed Rewards!</span>
            <p className="mx-2"> You have unclaimed rewards</p>
          </div>
          <div className="flex my-auto mx-3">
            <WarningClaimButton tokens={tokens}></WarningClaimButton>
          </div>
        </div>
      ) : undefined}
    </>
  );
};

export default RewardsWarning;
