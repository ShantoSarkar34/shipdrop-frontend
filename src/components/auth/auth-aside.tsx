import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function AuthAside() {
  return (
    <aside className="relative h-full min-h-[calc(100dvh-2rem)] overflow-hidden rounded-[2rem] bg-primary/95 text-primary-foreground lg:flex lg:flex-col">
      {/* Decorative route/map pattern */}
      <svg
        aria-hidden="true"
        viewBox="0 0 500 700"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 170C70 110 130 210 220 165C315 118 350 25 540 85"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M-60 470C65 405 115 520 220 470C325 420 355 325 550 385"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M120 -30C160 80 125 155 175 250C225 345 190 445 250 520C290 570 285 650 330 730"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      {/* Top-right delivery truck decoration */}
      <svg
        aria-hidden="true"
        viewBox="0 0 160 120"
        className="pointer-events-none absolute right-8 top-8 h-24 w-32 text-primary-foreground/15"
        fill="none"
      >
        <path d="M22 67V38C22 32 27 27 33 27H91V67H22Z" fill="currentColor" />
        <path d="M91 43H113L135 61V67H91V43Z" fill="currentColor" />
        <path
          d="M98 48H110L123 59H98V48Z"
          className="text-primary"
          fill="currentColor"
        />
        <circle cx="48" cy="72" r="11" fill="currentColor" />
        <circle cx="113" cy="72" r="11" fill="currentColor" />
        <circle
          cx="48"
          cy="72"
          r="4"
          className="text-primary"
          fill="currentColor"
        />
        <circle
          cx="113"
          cy="72"
          r="4"
          className="text-primary"
          fill="currentColor"
        />
        <path
          d="M15 68H137"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand */}
      <Link
        href="/"
        aria-label="SwiftDrop home"
        className="relative z-10 ml-10 mt-10 w-fit rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 xl:ml-14 xl:mt-12"
      >
        <Logo />
      </Link>

      {/* Main copy */}
      <div className="relative z-10 ml-10 mt-14 max-w-xl xl:ml-14 xl:mt-16">
        <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight xl:text-5xl">
          Move smarter.
          <br />
          <span className="text-harvest">Deliver better.</span>
        </h2>

        <p className="mt-5 max-w-md text-sm leading-6 text-primary-foreground/70 xl:text-base">
          Book parcels, track every delivery milestone, and manage your
          shipments from pickup to doorstep.
        </p>

        {/* Feature pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          <div className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-primary-foreground/80 backdrop-blur-sm">
            Live tracking
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-primary-foreground/80 backdrop-blur-sm">
            Secure payments
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-primary-foreground/80 backdrop-blur-sm">
            Reliable delivery
          </div>
        </div>
      </div>

      {/* Animated route illustration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 left-10 right-10 h-48 xl:left-14 xl:right-14"
      >
        <svg
          viewBox="0 0 520 180"
          className="h-full w-full overflow-visible"
          fill="none"
        >
          {/* Route */}
          <path
            d="M25 125C105 45 155 145 235 90C315 35 360 130 495 45"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="7 9"
            className="text-primary-foreground/25"
          />

          {/* Start point */}
          <circle cx="25" cy="125" r="7" className="fill-harvest" />

          <circle cx="25" cy="125" r="13" className="fill-harvest/15" />

          {/* Middle tracking points */}
          <circle
            cx="235"
            cy="90"
            r="5"
            className="fill-primary-foreground/60"
          />

          <circle
            cx="360"
            cy="111"
            r="5"
            className="fill-primary-foreground/40"
          />

          {/* Destination */}
          <circle cx="495" cy="45" r="7" className="fill-harvest" />

          <circle cx="495" cy="45" r="15" className="fill-harvest/15" />

          {/* Destination pin */}
          <path
            d="M495 72C495 72 480 55 480 47C480 38.7 486.7 32 495 32C503.3 32 510 38.7 510 47C510 55 495 72 495 72Z"
            className="fill-primary-foreground/15"
          />

          <circle cx="495" cy="47" r="5" className="fill-harvest" />

          {/* Package */}
          <g transform="translate(207 76)">
            <rect
              x="0"
              y="0"
              width="34"
              height="29"
              rx="4"
              className="fill-primary-foreground/90"
            />
            <path
              d="M0 8L17 16L34 8"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
            <path
              d="M17 16V29"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
            <path
              d="M8 4L17 9L26 4"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
          </g>
        </svg>
      </div>

      {/* Small motion lines */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 60"
        className="pointer-events-none absolute bottom-36 left-20 h-12 w-20 text-primary-foreground/25"
        fill="none"
      >
        <path
          d="M8 20H42"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 32H60"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M42 44H78"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Soft destination glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-4 size-48 rounded-full bg-harvest/10 blur-3xl xl:right-10 xl:size-56"
      />

      {/* Footer */}
      <p className="relative z-10 mt-auto ml-10 pb-8 text-xs text-primary-foreground/35 xl:ml-14">
        © {new Date().getFullYear()} SwiftDrop
      </p>
    </aside>
  );
}
