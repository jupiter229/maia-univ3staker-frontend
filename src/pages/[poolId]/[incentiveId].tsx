import { PositionsTable } from "@/components";
import { useStake, useUserPoolPositions } from "@/hooks";
import { isAddress } from "ethers/lib/utils.js";
import { GetServerSideProps, NextPage } from "next";

interface IProps {
  poolId: string;
  incentiveId: string;
}

export const StakePage: NextPage<IProps> = ({ poolId, incentiveId }) => {
  const [userPoolPositions] = useUserPoolPositions(poolId);
  const onStake = useStake(incentiveId);
  return (
    <>
      <h1>{incentiveId}</h1>
      <PositionsTable data={userPoolPositions} onStake={onStake} />
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
