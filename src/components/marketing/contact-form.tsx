"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TextareaField } from "@/components/forms/textarea-field";
import { TextField } from "@/components/forms/text-field";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email")
    .email("Enter a valid email address"),
  subject: z.string().trim().min(1, "Add a subject"),
  message: z.string().trim().min(10, "Write at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm({ to }: { to: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = handleSubmit((values) => {
    const body = `${values.message}\n\n— ${values.name} (${values.email})`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
    toast.success("Opening your email app…");
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
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
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit">Write email</Button>
        <p className="text-sm text-muted-foreground">
          This opens your email app with the message ready to send.
        </p>
      </div>
    </form>
  );
}
