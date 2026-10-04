import type { Metadata } from "next";
import { AgentDashboard } from "@/components/deliveries/agent-dashboard";

export const metadata: Metadata = { title: "Agent dashboard" };

export default function ProviderDashboardPage() {
  return <AgentDashboard />;
}
