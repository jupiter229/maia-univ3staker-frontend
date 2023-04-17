import { useIncentive, useStake, useUserPoolPositions } from "@/hooks";
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
  const onStake = useStake(incentiveId);
  const [incentive] = useIncentive(incentiveId);
  const hasExpired = incentive?.endTime * 1000 <= Date.now();
  return (
    <PositionsTable
      data={userPoolPositions}
      onStake={onStake}
      hasExpired={hasExpired}
    />
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
