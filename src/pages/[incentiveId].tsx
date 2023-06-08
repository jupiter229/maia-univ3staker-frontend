import { useUserIncentivePositions } from "@/hooks";
import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";

interface IProps {
  incentiveId: string;
}

const PositionsTable = dynamic(() => import("@/components/PositionsTable"), {
  ssr: false,
});

export const StakePage: NextPage<IProps> = ({ incentiveId }) => {
  const {
    positions: [userPoolPositions],
  } = useUserIncentivePositions(incentiveId);

  return (
    <PositionsTable
      data={userPoolPositions}
      incentiveId={incentiveId}
      incentive={
        userPoolPositions !== undefined && userPoolPositions.length > 0
          ? userPoolPositions[0].incentive ?? undefined
          : undefined
      }
    />
  );
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
