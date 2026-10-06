import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-12 lg:size-16 shrink-0 items-center justify-center",
        className,
      )}
    >
      <svg
        viewBox="0 0 160 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-full"
      >
        {/* Movement lines */}
        <path
          d="M5 25H20"
          stroke="#D9A441"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M2 32H14"
          stroke="#D9A441"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M7 39H18"
          stroke="#D9A441"
          strokeWidth="3"
          strokeLinecap="round"
        />


        {/* Truck cargo body */}
        <path
          d="M28 27
             C28 23.7 30.7 21 34 21
             H91
             C94.3 21 97 23.7 97 27
             V59
             H28
             Z"
          className="fill-[#285C45] dark:fill-[#3C7359]"
        />

        {/* Cargo top highlight */}
        <path
          d="M35 28H87"
          stroke="#FFF9ED"
          strokeWidth="3"
          strokeLinecap="round"
          opacity=".85"
        />

        <path
          d="M35 35H75"
          stroke="#FFF9ED"
          strokeWidth="3"
          strokeLinecap="round"
          opacity=".35"
        />

        {/* Cabin */}
        <path
          d="M97 34
             H111
             C114 34 116.7 35.5 118.4 38
             L128 52
             V59
             H97
             Z"
          fill="#D9A441"
        />

        {/* Windshield */}
        <path
          d="M101 37H110
             C111.4 37 112.6 37.7 113.4 38.8
             L120 48H101V37Z"
          className="fill-[#173D2E] dark:fill-[#10291F]"
        />

        {/* Door line */}
        <path
          d="M97 35V58"
          stroke="#A97925"
          strokeWidth="1.5"
          opacity=".6"
        />

        {/* Door handle */}
        <path
          d="M104 51H109"
          stroke="#FFF9ED"
          strokeWidth="2"
          strokeLinecap="round"
          opacity=".8"
        />

        {/* Headlight */}
        <rect
          x="124"
          y="51"
          width="3"
          height="4"
          rx="1.2"
          fill="#FFF9ED"
        />

        {/* Front bumper */}
        <path
          d="M126 58H132"
          stroke="#173D2E"
          strokeWidth="3"
          strokeLinecap="round"
          className="dark:stroke-[#10291F]"
        />

        {/* Rear wheel */}
        <circle
          cx="49"
          cy="61"
          r="9"
          fill="#101814"
          className="dark:fill-[#0A0F0C]"
        />
        <circle
          cx="49"
          cy="61"
          r="4"
          fill="#E7E6DF"
        />

        {/* Front wheel */}
        <circle
          cx="111"
          cy="61"
          r="9"
          fill="#101814"
          className="dark:fill-[#0A0F0C]"
        />
        <circle
          cx="111"
          cy="61"
          r="4"
          fill="#E7E6DF"
        />

        {/* Small parcel accent */}
        <path
          d="M39 42L44 39L49 42L44 45L39 42Z"
          fill="#D9A441"
        />

        <path
          d="M39 42V47L44 50V45M49 42V47L44 50"
          stroke="#D9A441"
          strokeWidth="1.3"
          strokeLinejoin="round"
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
    <span
      className={cn(
        "inline-flex items-center gap-2 lg:gap-0",
        className,
      )}
    >
      <LogoMark />

      {showWordmark ? (
        <span className="font-display text-xl font-extrabold tracking-tight text-[#173D2E] dark:text-[#FFF9ED]">
          SwiftDrop
        </span>
      ) : (
        <span className="sr-only">SwiftDrop</span>
      )}
    </span>
  );
}