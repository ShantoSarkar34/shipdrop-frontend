"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormError } from "@/components/forms/form-error";
import { TextField } from "@/components/forms/text-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_LABEL } from "@/config/roles";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUpdateProfile } from "@/hooks/use-profile";
import type { ProfileField, UpdateProfileInput } from "@/lib/api/users";
import { applyServerErrors } from "@/lib/forms";
import type { Role, User } from "@/types/user";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  phone: z.string().trim(),
  defaultPickupAddress: z.string().trim(),
  vehicleType: z.string().trim(),
  licenseNumber: z.string().trim(),
});

type ProfileValues = z.infer<typeof profileSchema>;

// Only fields the backend accepts for each role. Anything else would be silently ignored.
const EDITABLE: Record<Role, readonly ProfileField[]> = {
  CUSTOMER: ["name", "phone", "defaultPickupAddress"],
  DELIVERY_AGENT: ["name", "phone", "vehicleType", "licenseNumber"],
  ADMIN: ["name", "phone"],
};

const toValues = (user: User): ProfileValues => ({
  name: user.name,
  phone: user.phone ?? "",
  defaultPickupAddress: user.customer?.defaultPickupAddress ?? "",
  vehicleType: user.deliveryAgent?.vehicleType ?? "",
  licenseNumber: user.deliveryAgent?.licenseNumber ?? "",
});

const formatDate = (iso: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(iso));
const titleCase = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

function AccountDetails({ user }: { user: User }) {
  const rows = [
    ["Email", user.email],
    ["Role", ROLE_LABEL[user.role]],
    ["Status", titleCase(user.status)],
    ["Member since", formatDate(user.createdAt)],
  ];
  return (
    <section aria-labelledby="account-heading" className="rounded-xl border border-border bg-card p-6">
      <h2 id="account-heading" className="text-lg font-bold">
        Account
      </h2>
      <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 font-medium wrap-break-word">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ProfileForm({ user }: { user: User }) {
  const mutation = useUpdateProfile();
  const [formError, setFormError] = useState<string | null>(null);
  const values = useMemo(() => toValues(user), [user]);
  const fields = EDITABLE[user.role];

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), values });

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    // Send only what changed. The backend rejects an empty update.
    const payload: UpdateProfileInput = {};
    for (const field of fields) {
      if (dirtyFields[field]) payload[field] = data[field];
    }
    mutation.mutate(payload, {
      onError: (error) => setFormError(applyServerErrors(error, setError, fields)),
    });
  });

  return (
    <section aria-labelledby="edit-heading" className="rounded-xl border border-border bg-card p-6">
      <h2 id="edit-heading" className="text-lg font-bold">
        Edit profile
      </h2>
      <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
        {formError ? <FormError>{formError}</FormError> : null}
        <TextField label="Full name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <TextField
          label="Phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        {user.role === "CUSTOMER" ? (
          <TextareaField
            label="Default pickup address"
            rows={3}
            error={errors.defaultPickupAddress?.message}
            {...register("defaultPickupAddress")}
          />
        ) : null}
        {user.role === "DELIVERY_AGENT" ? (
          <>
            <TextField label="Vehicle type" error={errors.vehicleType?.message} {...register("vehicleType")} />
            <TextField label="License number" error={errors.licenseNumber?.message} {...register("licenseNumber")} />
          </>
        ) : null}
        <Button type="submit" disabled={!isDirty || mutation.isPending}>
          {mutation.isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
          {mutation.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </section>
  );
}

export function ProfilePanel() {
  const { data: user } = useCurrentUser();

  if (!user) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading profile">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AccountDetails user={user} />
      <ProfileForm user={user} />
    </div>
  );
}