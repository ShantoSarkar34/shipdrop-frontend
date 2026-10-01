"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/forms/form-error";
import { PasswordField, TextField } from "@/components/forms/text-field";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-auth";
import { applyServerErrors } from "@/lib/forms";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";

const FIELDS = ["email", "password"] as const;

export function LoginForm() {
  const login = useLogin();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    login.mutate(values, {
      onError: (error) =>
        setFormError(applyServerErrors(error, setError, FIELDS)),
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError ? <FormError>{formError}</FormError> : null}
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordField
        label="Password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : null}
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
