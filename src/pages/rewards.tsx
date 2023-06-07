import { useIncentiveRewards, useUserStakedPositions } from "@/hooks";
import { NextPage } from "next";
import dynamic from "next/dynamic";

const PositionsTable = dynamic(() => import("@/components/PositionsTable"), {
  ssr: false,
});

export const RewardsPage: NextPage = () => {
  const [data] = useUserStakedPositions();

  const incentiveRewards = useIncentiveRewards(
    data?.map((p) => ({
      incentive: p.incentive,
      tokenId: p.tokenId,
    })) ?? []
  );

  return (
    <PositionsTable
      data={
        data === undefined
          ? undefined
          : data?.map((p, i) =>
              p === undefined
                ? null
                : {
                    ...p,
                    reward:
                      incentiveRewards === undefined ? 0 : incentiveRewards[i],
                  }
            )
      }
      title="My Staked Positions"
    />
  );
};

export default RewardsPage;
