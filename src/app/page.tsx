import { RadarWorkbench } from "@/components/radar-workbench";
import { getStats, searchEmployers } from "@/lib/employers";

export default function Home() {
  return (
    <RadarWorkbench
      stats={getStats()}
      initialResults={searchEmployers({ pageSize: 24 })}
    />
  );
}
