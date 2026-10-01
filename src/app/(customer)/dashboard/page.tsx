import type { Metadata } from "next";
import { SessionPreview } from "@/components/auth/session-preview";

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <SessionPreview />;
}