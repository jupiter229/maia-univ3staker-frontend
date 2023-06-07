import { useIncentiveRewards, useUserIncentivePositions } from "@/hooks";
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
    incentive: incentive,
    positions: [userPoolPositions],
  } = useUserIncentivePositions(incentiveId);

  const incentiveRewards = useIncentiveRewards(
    userPoolPositions?.map((p) => ({
      incentive: incentive,
      tokenId: p.tokenId,
    })) ?? []
  );

  return (
    <PositionsTable
      data={
        userPoolPositions === undefined
          ? undefined
          : userPoolPositions?.map((p, i) =>
              p === undefined
                ? null
                : {
                    ...p,
                    reward:
                      incentiveRewards === undefined ? 0 : incentiveRewards[i],
                  }
            )
      }
      incentiveId={incentiveId}
      incentive={incentive}
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
