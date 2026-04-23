import Panel from "../common/Panel";

export default function GaugeCard({ title, value, unit, color }) {
  const numericValue = Number(value) || 0;
  const pct = Math.max(0, Math.min(100, numericValue));
  const angle = -90 + (pct / 100) * 180;

  return (
    <Panel title={title}>
      <div className="semi-gauge" style={{ "--gauge-color": color }}>
        <div className="semi-gauge-arc" />
        <div className="semi-gauge-needle" style={{ transform: `rotate(${angle}deg)` }} />
        <div className="semi-gauge-center" />
      </div>
      <div className="gauge-value">
        {Math.round(numericValue)}
        {unit}
      </div>
      <div className="gauge-label">flame_intensity (%)</div>
    </Panel>
  );
}
