"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Info, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/forms/form-error";
import { TextField } from "@/components/forms/text-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { PayButton } from "@/components/payments/pay-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { OptionCards } from "@/components/shipments/create-shipment/option-cards";
import { ReviewStep } from "@/components/shipments/create-shipment/review-step";
import { Stepper } from "@/components/shipments/create-shipment/stepper";
import { Button, buttonVariants } from "@/components/ui/button";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { PARCEL_TYPES, SERVICE_TYPES } from "@/config/shipment-options";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCreateParcel } from "@/hooks/use-parcels";
import { getFieldErrors } from "@/lib/api/errors";
import type { CreatedParcel } from "@/lib/api/parcels";
import { formatMoney } from "@/lib/format";
import { applyServerErrors } from "@/lib/forms";
import {
  ALL_FIELDS,
  STEP_FIELDS,
  shipmentSchema,
  toCreateInput,
  type ShipmentValues,
} from "@/lib/validation/shipment";

const REVIEW_STEP = STEP_FIELDS.length;

const STEP_INTRO = [
  {
    title: "Sender and pickup",
    text: "Who is sending the parcel, and where should it be collected?",
  },
  {
    title: "Receiver and delivery",
    text: "Who is receiving the parcel, and where should it be delivered?",
  },
  { title: "Parcel details", text: "Tell us what you're sending." },
  { title: "Service", text: "Choose how you want it delivered." },
  {
    title: "Review your shipment",
    text: "Check the details, then create the shipment.",
  },
];

export function CreateShipmentWizard() {
  const { data: user } = useCurrentUser();
  const create = useCreateParcel();
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedParcel | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm<ShipmentValues>({
    resolver: zodResolver(shipmentSchema),
    // Sender details start from the profile, and can be changed for this shipment.
    defaultValues: {
      senderName: user?.name ?? "",
      senderPhone: user?.phone ?? "",
      pickupAddress: user?.customer?.defaultPickupAddress ?? "",
      pickupCity: "",
      receiverName: "",
      receiverPhone: "",
      deliveryAddress: "",
      deliveryCity: "",
      parcelType: PARCEL_TYPES[0]?.value ?? "",
      weightKg: "",
      serviceType: SERVICE_TYPES[0]?.value ?? "",
      notes: "",
    },
  });

  // After moving between steps (or finishing), put keyboard and screen reader focus on the new heading.
  useEffect(() => {
    if (moveFocus.current) {
      headingRef.current?.focus();
      moveFocus.current = false;
    }
  }, [step, created]);

  const goTo = (target: number) => {
    moveFocus.current = true;
    setFormError(null);
    setStep(target);
  };

  const next = async () => {
    const valid = await trigger([...STEP_FIELDS[step]], { shouldFocus: true });
    if (valid) goTo(step + 1);
  };

  const submit = handleSubmit((values) => {
    setFormError(null);
    create.mutate(toCreateInput(values), {
      onSuccess: (result) => {
        moveFocus.current = true;
        setCreated(result);
      },
      onError: (error) => {
        setFormError(applyServerErrors(error, setError, ALL_FIELDS));
        // Take the customer to the first step that has a field the backend rejected.
        const failing = Object.keys(getFieldErrors(error));
        const target = STEP_FIELDS.findIndex((fields) =>
          fields.some((field) => failing.includes(field)),
        );
        if (target >= 0) goTo(target);
      },
    });
  });

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Enter on an input step means "continue", never "create the shipment".
    if (step < REVIEW_STEP) {
      event.preventDefault();
      void next();
      return;
    }
    void submit(event);
  };

  if (created) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-border bg-card p-8 text-center"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success-fg">
          <CircleCheck className="size-7" aria-hidden="true" />
        </span>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-5 text-2xl font-extrabold tracking-tight outline-none"
        >
          Shipment created
        </h2>
        <dl className="mx-auto mt-6 grid max-w-xs gap-4 text-left text-sm">
          <div>
            <dt className="text-muted-foreground">Tracking ID</dt>
            <dd className="font-mono text-lg font-semibold">
              {created.trackingId}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Delivery charge</dt>
            <dd className="text-lg font-semibold">
              {formatMoney(created.deliveryCharge, PAYMENT_CURRENCY)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="mt-1">
              <StatusBadge status={created.status} />
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-muted-foreground">
          Pay now to continue, or pay later from the shipment page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <PayButton parcelId={created.id} />
          <Link
            href={`/dashboard/shipments/${created.id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            View shipment
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              reset();
              setCreated(null);
              goTo(0);
            }}
          >
            Create another
          </Button>
        </div>
      </div>
    );
  }

  const intro = STEP_INTRO[step];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <Stepper current={step} />

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-bold outline-none"
      >
        {intro.title}
      </h2>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{intro.text}</p>

      <form onSubmit={onFormSubmit} noValidate className="space-y-5">
        {formError ? <FormError>{formError}</FormError> : null}

        {step === 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Sender name"
                autoComplete="name"
                error={errors.senderName?.message}
                {...register("senderName")}
              />
              <TextField
                label="Sender phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                error={errors.senderPhone?.message}
                {...register("senderPhone")}
              />
            </div>
            <TextareaField
              label="Pickup address"
              rows={2}
              error={errors.pickupAddress?.message}
              {...register("pickupAddress")}
            />
            <TextField
              label="Pickup city"
              hint="Used to calculate the delivery charge, for example Dhaka."
              error={errors.pickupCity?.message}
              {...register("pickupCity")}
            />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Receiver name"
                error={errors.receiverName?.message}
                {...register("receiverName")}
              />
              <TextField
                label="Receiver phone"
                type="tel"
                inputMode="tel"
                error={errors.receiverPhone?.message}
                {...register("receiverPhone")}
              />
            </div>
            <TextareaField
              label="Delivery address"
              rows={2}
              error={errors.deliveryAddress?.message}
              {...register("deliveryAddress")}
            />
            <TextField
              label="Delivery city"
              hint="Used to calculate the delivery charge, for example Bogra."
              error={errors.deliveryCity?.message}
              {...register("deliveryCity")}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <OptionCards
              legend="Parcel type"
              options={PARCEL_TYPES}
              registration={register("parcelType")}
              error={errors.parcelType?.message}
            />
            <TextField
              label="Weight (kg)"
              inputMode="decimal"
              hint="For example 2.5"
              error={errors.weightKg?.message}
              {...register("weightKg")}
            />
            <TextareaField
              label="Notes (optional)"
              rows={3}
              error={errors.notes?.message}
              {...register("notes")}
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <OptionCards
              legend="Service"
              options={SERVICE_TYPES}
              registration={register("serviceType")}
              error={errors.serviceType?.message}
            />
            <div
              role="note"
              className="flex gap-3 rounded-lg bg-muted/60 p-4 text-sm text-muted-foreground"
            >
              <Info
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p>
                You don&apos;t set the price. SwiftDrop calculates the delivery
                charge from your shipment details and shows it as soon as the
                shipment is created, before you pay.
              </p>
            </div>
          </>
        ) : null}

        {step === REVIEW_STEP ? (
          <ReviewStep values={getValues()} onEdit={goTo} />
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo(step - 1)}
              disabled={create.isPending}
            >
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < REVIEW_STEP ? (
            <Button type="submit">Continue</Button>
          ) : (
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : null}
              {create.isPending ? "Creating shipment…" : "Create shipment"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
