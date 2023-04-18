import { Button } from "@/components";
import { useIncentiveRewards, useUserPoolPositions } from "@/hooks";
import { formatBigNumber } from "@/utils";
import { isAddress } from "ethers/lib/utils.js";
import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";

interface IProps {
  poolId: string;
  incentiveId: string;
}

const PositionsTable = dynamic(() => import("@/components/PositionsTable"), {
  ssr: false,
});

export const StakePage: NextPage<IProps> = ({ poolId, incentiveId }) => {
  const [userPoolPositions] = useUserPoolPositions(poolId);
  const { rewards, claimRewards, decimals, symbol } =
    useIncentiveRewards(incentiveId);
  return (
    <>
      <div className="flex w-full justify-between items-center">
        <h4 className="text-white text-xl font-semibold">
          Rewards Earned: {formatBigNumber(rewards, { decimals, precision: 6 })}{" "}
          {symbol}
        </h4>
        <Button onClick={claimRewards} disabled={!rewards?.gt(0)}>
          Claim Rewards
        </Button>
      </div>
      <PositionsTable data={userPoolPositions} incentiveId={incentiveId} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const poolId = context.params?.poolId;
  const incentiveId = context.params?.incentiveId;
  const notFound =
    typeof poolId !== "string" ||
    typeof incentiveId !== "string" ||
    !incentiveId ||
    !isAddress(poolId);
  if (notFound) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      poolId,
      incentiveId,
    },
  };
};

export default StakePage;
