import type { Metadata } from "next";
import { Suspense } from "react";
import { UsersList } from "@/components/admin/users-list";
import { PageHeading } from "@/components/layout/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <>
      <PageHeading
        title="Users"
        description="Review accounts, and suspend or reactivate them."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <UsersList />
      </Suspense>
    </>
  );
}
