export function SunMark() {
  return (
    <svg
      viewBox="0 0 240 240"
      role="img"
      aria-label="Günəş və enerji axını işarəsi"
    >
      <circle cx="120" cy="120" r="45" fill="#E8A33D" />
      <circle
        cx="120"
        cy="120"
        r="76"
        fill="none"
        stroke="#B4552B"
        strokeWidth="2"
      />
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index * Math.PI) / 6;
        return (
          <line
            key={index}
            x1={120 + Math.cos(angle) * 88}
            y1={120 + Math.sin(angle) * 88}
            x2={120 + Math.cos(angle) * 108}
            y2={120 + Math.sin(angle) * 108}
            stroke="#182430"
            strokeWidth="3"
          />
        );
      })}
      <path d="M94 128h52l-14 19h-52z" fill="#3F8564" />
    </svg>
  );
}
