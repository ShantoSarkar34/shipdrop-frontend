"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/forms/form-error";
import { PasswordField, TextField } from "@/components/forms/text-field";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/use-auth";
import { applyServerErrors } from "@/lib/forms";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";

const FIELDS = ["name", "email", "phone", "password", "role"] as const;

const ROLE_OPTIONS = [
  {
    value: "CUSTOMER",
    title: "Send parcels",
    description: "Book deliveries and track them",
  },
  {
    value: "DELIVERY_AGENT",
    title: "Deliver parcels",
    description: "Take jobs and earn per delivery",
  },
] as const;

export function RegisterForm() {
  const registration = useRegister();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    registration.mutate(
      { ...values, phone: values.phone || undefined },
      {
        onError: (error) =>
          setFormError(applyServerErrors(error, setError, FIELDS)),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError ? <FormError>{formError}</FormError> : null}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">I want to</legend>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="relative flex cursor-pointer flex-col gap-0.5 rounded-lg border border-input p-3 transition-colors has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring"
            >
              <input
                type="radio"
                value={option.value}
                className="peer sr-only"
                {...register("role")}
              />
              <CircleCheck
                className="absolute top-2.5 right-2.5 size-4 text-primary opacity-0 peer-checked:opacity-100"
                aria-hidden="true"
              />
              <span className="pr-5 text-sm font-medium">{option.title}</span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </label>
          ))}
        </div>
        {errors.role?.message ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.role.message}
          </p>
        ) : null}
      </fieldset>

      <TextField
        label="Full name"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <PasswordField
        label="Password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={registration.isPending}
      >
        {registration.isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : null}
        {registration.isPending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
