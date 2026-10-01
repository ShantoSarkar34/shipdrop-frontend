import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const STEPS = ["Picked up", "In transit", "Out for delivery", "Delivered"];

export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-[#0b1020] text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_0%,rgba(59,130,246,0.35),transparent_70%)]"
      />
      <Link
        href="/"
        className="relative w-fit rounded-md focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
      >
        <Logo />
      </Link>

      <div className="relative max-w-md space-y-8">
        <div className="space-y-4">
          <h2 className="font-display text-4xl leading-tight font-extrabold">
            Every parcel, accounted for at every step.
          </h2>
          <p className="text-white/70">
            Book a pickup, follow each status change, and pay securely. Agents
            and operations teams work from the same live record.
          </p>
        </div>

        <ol
          aria-hidden="true"
          className="relative space-y-5 border-l border-white/20 pl-6"
        >
          {STEPS.map((step, index) => (
            <li key={step} className="relative text-sm text-white/80">
              <span
                className={`absolute top-1.5 -left-7.25 size-2.5 rounded-full ${
                  index === STEPS.length - 1 ? "bg-highlight" : "bg-white/60"
                }`}
              />
              {step}
            </li>
          ))}
        </ol>
      </div>

      <p className="relative text-xs text-white/50">
        © {new Date().getFullYear()} SwiftDrop
      </p>
    </aside>
  );
}
