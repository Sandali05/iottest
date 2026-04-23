import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import Panel from "../common/Panel";

export default function ForecastChart({ data = [] }) {
  const maxTemp = Math.max(...data.map((d) => Number(d.temperature || 0)), 0);
  const warning = maxTemp >= 38;

  return (
    <Panel title="Next Hour Temperature Forecast">
      <div className="forecast-grid">
        <div className="forecast-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#666" strokeOpacity={0.3} vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#d4d4d8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#d4d4d8", fontSize: 12 }} />
              <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="forecast-side">
          {data.map((row) => (
            <div key={row.step || row.time} className="forecast-row">
              <span>{row.minute || row.step * 10} min</span>
              <strong>{Number(row.temperature).toFixed(1)} °C</strong>
            </div>
          ))}
        </div>
      </div>

      <div className={`forecast-alert ${warning ? "warn" : "ok"}`}>
        {warning
          ? "Temperature may reach 38°C within next hour if current trend continues"
          : "Temperature forecast is within safe range for the next hour"}
      </div>
    </Panel>
  );
}
