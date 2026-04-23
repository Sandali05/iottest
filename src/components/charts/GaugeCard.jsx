import Panel from "../common/Panel";

export default function GaugeCard({ title, value, unit, color }) {
  const pct = Math.max(0, Math.min(100, Number(value)));

  return (
    <Panel title={title}>
      <div className="gauge-track">
        <div className="gauge-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="gauge-value">
        {Math.round(value)}
        {unit}
      </div>
    </Panel>
  );
}
