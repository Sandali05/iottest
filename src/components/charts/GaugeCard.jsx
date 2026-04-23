import Panel from "../common/Panel";

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 180) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
}

export default function GaugeCard({ title, value, unit, color }) {
  const pct = Math.max(0, Math.min(100, Number(value)));
  const angle = (pct / 100) * 180;
  const needle = polarToCartesian(110, 100, 60, angle);

  return (
    <Panel title={title}>
      <svg className="semi-gauge" viewBox="0 0 220 120" role="img" aria-label={`${title} ${value}${unit}`}>
        <path d={arcPath(110, 100, 80, 0, 180)} className="g-track" />
        <path d={arcPath(110, 100, 80, 0, 60)} className="g-zone safe" />
        <path d={arcPath(110, 100, 80, 60, 120)} className="g-zone warn" />
        <path d={arcPath(110, 100, 80, 120, 180)} className="g-zone alert" />
        <path d={arcPath(110, 100, 80, 0, angle)} className="g-active" style={{ stroke: color }} />
        <line x1="110" y1="100" x2={needle.x} y2={needle.y} className="g-needle" />
        <circle cx="110" cy="100" r="5" fill="#f4f4f5" />
      </svg>
      <div className="gauge-value">
        {Math.round(value)}
        {unit}
      </div>
    </Panel>
  );
}
