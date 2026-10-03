"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormError } from "@/components/forms/form-error";
import { TextField } from "@/components/forms/text-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api/errors";
import { sendContactMessage } from "@/lib/contact";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email")
    .email("Enter a valid email address"),
  subject: z.string().trim().min(1, "Add a subject"),
  message: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters")
    .max(2000, "Keep your message under 2000 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

const mailtoHref = (to: string, values: ContactValues) =>
  `mailto:${to}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(
    `${values.message}\n\n— ${values.name} (${values.email})`,
  )}`;

export function ContactForm({ fallbackEmail }: { fallbackEmail?: string }) {
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    values: ContactValues;
    delivered: boolean;
  } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await sendContactMessage(values);
      setSubmitted({ values, delivered: result.delivered });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  if (submitted) {
    return (
      <div role="status" className="space-y-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CircleCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-lg font-bold">
              {submitted.delivered
                ? "Message sent"
                : "Demo only: nothing was sent"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {submitted.delivered
                ? "Thanks for getting in touch. We'll reply to the email address you provided."
                : "Your message passed validation, but this form isn't connected to a support inbox yet, so it wasn't delivered to anyone."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {!submitted.delivered && fallbackEmail ? (
            <a
              href={mailtoHref(fallbackEmail, submitted.values)}
              className={buttonVariants({ variant: "outline" })}
            >
              Email us instead
            </a>
          ) : null}
          <Button variant="ghost" onClick={() => setSubmitted(null)}>
            Edit message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError ? <FormError>{formError}</FormError> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Name"
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
      </div>
      <TextField
        label="Subject"
        error={errors.subject?.message}
        {...register("subject")}
      />
      <TextareaField
        label="Message"
        rows={6}
        error={errors.message?.message}
        {...register("message")}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : null}
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
