import { getStats, searchEmployers } from "@/lib/employers";
import { EmployersClient } from "./employers-client";

export default function EmployersPage() {
  const stats = getStats();
  const initialResults = searchEmployers({ pageSize: 24 });
  return <EmployersClient stats={stats} initialResults={initialResults} />;
}
