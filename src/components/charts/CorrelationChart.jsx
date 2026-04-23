import Panel from "../common/Panel";

export default function CorrelationChart({ correlation }) {
  const items = [
    ["Temp vs Humidity", correlation?.temp_humidity],
    ["Temp vs Gas", correlation?.temp_gas],
    ["Humidity vs Gas", correlation?.humidity_gas],
    ["Temp vs Fridge Duration", correlation?.temp_fridge_duration],
  ];

  return (
    <Panel title="Backend Correlation Summary">
      <ul className="corr-list">
        {items.map(([label, value]) => (
          <li key={label}>
            <span>{label}</span>
            <strong>{Number(value ?? 0).toFixed(3)}</strong>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
