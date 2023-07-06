import { useIncentive, useUserIncentivePositions } from "@/hooks";
import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";

interface IProps {
  incentiveId: string;
}

const PositionsTable = dynamic(() => import("@/components/PositionsTable"), {
  ssr: false,
});

export const StakePage: NextPage<IProps> = ({ incentiveId }) => {
  const [incentive] = useIncentive(incentiveId);
  const {
    positions: [userPoolPositions],
  } = useUserIncentivePositions(incentive);

  return <PositionsTable data={userPoolPositions} incentive={incentive} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const incentiveId = context.params?.incentiveId;
  const notFound = typeof incentiveId !== "string" || !incentiveId;
  if (notFound) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      incentiveId,
    },
  };
};

export default StakePage;
