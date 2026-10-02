"use client";

import { Check } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function MockFrame({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <figure
      role="img"
      aria-label={label}
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <div
        aria-hidden="true"
        className="flex items-center gap-1.5 border-b border-border px-4 py-3"
      >
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-3 text-xs text-muted-foreground">{title}</span>
      </div>
      <div aria-hidden="true" className="p-4">
        {children}
      </div>
      <figcaption className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        Illustration
      </figcaption>
    </figure>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "info" | "success" | "warning";
  children: ReactNode;
}) {
  const styles = {
    info: "bg-info-soft text-info-fg",
    success: "bg-success-soft text-success-fg",
    warning: "bg-warning-soft text-warning-fg",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        styles[tone],
      )}
    >
      {children}
    </span>
  );
}

function CustomerMock() {
  const rows = [
    {
      id: "SD260902A1B2C3",
      route: "Dhaka → Bogra",
      status: <Pill tone="info">In transit</Pill>,
    },
    {
      id: "SD260901F4D5E6",
      route: "Dhaka → Khulna",
      status: <Pill tone="success">Delivered</Pill>,
    },
    {
      id: "SD260830B7C8D9",
      route: "Dhaka → Sylhet",
      status: <Pill tone="warning">Pending</Pill>,
    },
  ];
  return (
    <MockFrame
      label="Illustration of a customer's shipment list"
      title="My shipments"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-sm font-bold">Shipments</span>
        <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
          New shipment
        </span>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
          >
            <div>
              <p className="font-mono text-xs">{row.id}</p>
              <p className="text-xs text-muted-foreground">{row.route}</p>
            </div>
            {row.status}
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

function AgentMock() {
  return (
    <MockFrame
      label="Illustration of a delivery agent's job card"
      title="Deliveries"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-sm font-bold">Assigned to you</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success-fg">
          <span className="size-1.5 rounded-full bg-current" />
          Available
        </span>
      </div>
      <div className="space-y-3 rounded-lg border border-border p-3">
        <div>
          <p className="font-mono text-xs">SD260902A1B2C3</p>
          <p className="text-sm">Dhaka → Bogra</p>
          <p className="text-xs text-muted-foreground">Express · 2.5 kg</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
            Accept
          </span>
          <span className="rounded-md border border-input px-3 py-1.5 text-xs font-medium">
            Decline
          </span>
        </div>
      </div>
    </MockFrame>
  );
}

const BARS = [35, 50, 42, 60, 55, 70, 48, 66, 80, 62, 74, 90];

function AdminMock() {
  return (
    <MockFrame
      label="Illustration of an admin analytics chart"
      title="Analytics"
    >
      <p className="mb-3 font-display text-sm font-bold">Shipments over time</p>
      <div className="flex h-32 items-end gap-1.5 border-b border-border">
        {BARS.map((height, index) => (
          <m.div
            key={index}
            className="flex-1 origin-bottom rounded-t bg-primary/80"
            style={{ height: `${height}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
          />
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Pill tone="success">Delivered</Pill>
        <Pill tone="info">In transit</Pill>
        <Pill tone="warning">Pending</Pill>
      </div>
    </MockFrame>
  );
}

const TABS = [
  {
    id: "customers",
    label: "Customers",
    title: "Send parcels and keep an eye on them",
    points: [
      "Book a pickup with a guided, step-by-step form",
      "See the delivery charge before you pay",
      "Follow every status change on a timeline",
      "Cancel while a shipment is pending or confirmed",
    ],
    mock: <CustomerMock />,
  },
  {
    id: "agents",
    label: "Delivery agents",
    title: "Take jobs and move parcels along",
    points: [
      "Accept or decline assigned deliveries",
      "Only valid next steps are offered at each stage",
      "Switch between available and offline",
      "Follow your earnings and delivery performance",
    ],
    mock: <AgentMock />,
  },
  {
    id: "operations",
    label: "Operations",
    title: "Keep the whole network running",
    points: [
      "Search, filter and review every shipment",
      "Assign available agents to parcels",
      "Suspend or reactivate accounts",
      "Review analytics and an audit trail",
    ],
    mock: <AdminMock />,
  },
];

export function RolesShowcase() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS[active];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = TABS.length - 1;
    let next = active;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Workspaces"
        onKeyDown={onKeyDown}
        className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-border bg-card p-1"
      >
        {TABS.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={index === active}
            aria-controls={`panel-${item.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              index === active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid gap-10 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:grid-cols-2 lg:items-center"
          >
            <div>
              <h3 className="text-2xl font-extrabold">{tab.title}</h3>
              <ul className="mt-5 space-y-3">
                {tab.points.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <Check
                      className="mt-1 size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mx-auto w-full max-w-md">{tab.mock}</div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
