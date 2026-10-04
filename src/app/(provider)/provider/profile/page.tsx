import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/page-heading";
import { ProfilePanel } from "@/components/profile/profile-panel";

export const metadata: Metadata = { title: "Profile" };

export default function ProviderProfilePage() {
  return (
    <>
      <PageHeading
        title="Profile"
        description="Manage your account and vehicle details."
      />
      <ProfilePanel />
    </>
  );
}
