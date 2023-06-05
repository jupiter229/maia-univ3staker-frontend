import { IncentivesTable } from "@/components";
import { useIncentives } from "@/hooks";

export default function Home() {
  const [data] = useIncentives();
  console.log(data);
  return <IncentivesTable data={data} />;
}
