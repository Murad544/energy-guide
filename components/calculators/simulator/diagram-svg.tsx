export function DiagramSvg({
  mode,
}: {
  mode: "onGrid" | "offGrid" | "hybrid";
}) {
  const batteryVisible = mode !== "onGrid";
  const gridVisible = mode !== "offGrid";
  return (
    <svg
      className="w-full"
      viewBox="0 0 760 250"
      role="img"
      aria-label="Günəş enerjisi sisteminin axın sxemi"
    >
      <defs>
        <marker
          id="arrow"
          markerHeight="8"
          markerWidth="8"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="#B4552B" />
        </marker>
      </defs>
      <path
        className="flow-line"
        d="M130 95H250M350 95H470M570 95H680"
        fill="none"
        markerEnd="url(#arrow)"
        stroke="#B4552B"
        strokeWidth="3"
      />
      {batteryVisible ? (
        <path
          className="flow-line"
          d="M300 130V190H470"
          fill="none"
          markerEnd="url(#arrow)"
          stroke="#3F8564"
          strokeWidth="3"
        />
      ) : null}
      {gridVisible ? (
        <path
          className="flow-line"
          d="M520 130V190H680"
          fill="none"
          markerEnd="url(#arrow)"
          stroke="#3F8564"
          strokeWidth="3"
        />
      ) : null}
      <g>
        <rect x="30" y="50" width="100" height="80" fill="#E8A33D" />
        <text x="80" y="94" textAnchor="middle">
          Panel
        </text>
      </g>
      <g>
        <rect
          x="250"
          y="50"
          width="100"
          height="80"
          fill="#F1ECDF"
          stroke="#182430"
        />
        <text x="300" y="94" textAnchor="middle">
          Nəzarətçi
        </text>
      </g>
      <g>
        <rect
          x="470"
          y="50"
          width="100"
          height="80"
          fill="#F1ECDF"
          stroke="#182430"
        />
        <text x="520" y="94" textAnchor="middle">
          İnverter
        </text>
      </g>
      <g>
        <rect x="680" y="50" width="60" height="80" fill="#3F8564" />
        <text x="710" y="94" textAnchor="middle" fill="white">
          Ev
        </text>
      </g>
      {batteryVisible ? (
        <g>
          <rect x="250" y="185" width="100" height="50" fill="#182430" />
          <text x="300" y="215" textAnchor="middle" fill="white">
            Batareya
          </text>
        </g>
      ) : null}
      {gridVisible ? (
        <g>
          <rect
            x="470"
            y="185"
            width="100"
            height="50"
            fill="#FAF7EF"
            stroke="#182430"
          />
          <text x="520" y="215" textAnchor="middle">
            Şəbəkə
          </text>
        </g>
      ) : null}
    </svg>
  );
}
