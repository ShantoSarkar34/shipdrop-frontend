const ROUTE = "M 90 470 C 330 290, 500 540, 700 350 S 1020 120, 1110 170";
const PINS = [
  { x: 90, y: 470 },
  { x: 1110, y: 170 },
];

export function RouteAnimation() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full opacity-80"
    >
      <path
        d={ROUTE}
        fill="none"
        stroke="rgba(147,197,253,0.5)"
        strokeWidth="2"
        strokeDasharray="6 10"
        strokeLinecap="round"
        className="route-flow"
      />
      {PINS.map((pin) => (
        <g key={pin.x}>
          <circle cx={pin.x} cy={pin.y} r="6" fill="#93c5fd" />
          <circle
            cx={pin.x}
            cy={pin.y}
            r="6"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="2"
            className="route-pulse"
          >
            <animate
              attributeName="r"
              values="6;26"
              dur="2.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0"
              dur="2.6s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
      <g className="route-marker">
        <circle r="7" fill="#fbbf24">
          <animateMotion dur="10s" repeatCount="indefinite" path={ROUTE} />
        </circle>
      </g>
    </svg>
  );
}
