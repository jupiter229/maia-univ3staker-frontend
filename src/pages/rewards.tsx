import { useUserStakedPositions } from "@/hooks";
import { NextPage } from "next";
import dynamic from "next/dynamic";

const PositionsTable = dynamic(() => import("@/components/PositionsTable"), {
  ssr: false,
});

export const RewardsPage: NextPage = () => {
  const [data] = useUserStakedPositions();

  return <PositionsTable data={data} title="My Deposited Positions" />;
};

export default RewardsPage;
