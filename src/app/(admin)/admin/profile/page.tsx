import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/page-heading";
import { ProfilePanel } from "@/components/profile/profile-panel";

export const metadata: Metadata = { title: "Profile" };

export default function AdminProfilePage() {
  return (
    <>
      <PageHeading title="Profile" description="Manage your account details." />
      <ProfilePanel />
    </>
  );
}
