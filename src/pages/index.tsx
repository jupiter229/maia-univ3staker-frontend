import { IncentivesTable } from "@/components";
import { useIncentives } from "@/hooks";

export default function Home() {
  const [data] = useIncentives();
  return <IncentivesTable data={data} />;
}
