import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg",
        "bg-[#285C45] text-[#FFF9ED]",
        "dark:bg-[#FFF9ED] dark:text-[#173D2E]",
        className,
      )}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-full"
      >
        {/* Speed lines */}
        <path
          d="M4 10h5M3 13h4M5 16h4"
          stroke="#D9A441"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Road */}
        <path
          d="M4 25.5c6-2.5 18-2.5 24 0"
          stroke="#D9A441"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Road markings */}
        <path
          d="M9 25l2-.3M15 24.5l2-.1M21 24.7l2 .3"
          className="stroke-[#FFF9ED] dark:stroke-[#285C45]"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Delivery van body */}
        <path
          d="M8 12.5A1.5 1.5 0 0 1 9.5 11h10.8c.7 0 1.3.3 1.7.9l2.7 4.1c.2.3.3.7.3 1.1V21a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 21v-7A1.5 1.5 0 0 1 8 12.5Z"
          className="fill-[#FFF9ED] dark:fill-[#173D2E]"
        />

        {/* Cabin window */}
        <path
          d="M22 13h.3c.4 0 .8.2 1 .6l2 3.4h-4.8v-4Z"
          className="fill-[#285C45] dark:fill-[#FFF9ED]"
        />

        {/* Window divider */}
        <path
          d="M20.5 13v4"
          className="stroke-[#285C45] dark:stroke-[#FFF9ED]"
          strokeWidth="1"
        />

        {/* Parcel */}
        <path d="m11 14.2 2.2-1.2 2.2 1.2-2.2 1.2-2.2-1.2Z" fill="#D9A441" />
        <path
          d="M11 14.2v2.5l2.2 1.2v-2.5M15.4 14.2v2.5l-2.2 1.2"
          stroke="#D9A441"
          strokeWidth=".8"
          strokeLinejoin="round"
        />

        {/* Headlight */}
        <circle cx="25.2" cy="19" r="1" fill="#D9A441" />

        {/* Wheels */}
        <circle
          cx="10.5"
          cy="22"
          r="2.5"
          className="fill-[#173D2E] dark:fill-[#285C45]"
        />
        <circle
          cx="10.5"
          cy="22"
          r="1"
          className="fill-[#FFF9ED] dark:fill-[#FFF9ED]"
        />

        <circle
          cx="22.5"
          cy="22"
          r="2.5"
          className="fill-[#173D2E] dark:fill-[#285C45]"
        />
        <circle
          cx="22.5"
          cy="22"
          r="1"
          className="fill-[#FFF9ED] dark:fill-[#FFF9ED]"
        />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />

      {showWordmark ? (
        <span className="font-display text-lg font-extrabold tracking-tight text-[#173D2E] dark:text-[#FFF9ED]">
          SwiftDrop
        </span>
      ) : (
        <span className="sr-only">SwiftDrop</span>
      )}
    </span>
  );
}
