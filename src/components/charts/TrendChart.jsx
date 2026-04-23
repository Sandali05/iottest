import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import Panel from "../common/Panel";

export default function TrendChart({ data = [] }) {
  const points = data.slice().reverse().map((x) => ({
    time: x.timestamp,
    temperature: x.temperature,
    humidity: x.humidity,
  }));

  return (
    <Panel title="Temperature & Humidity Trend">
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points}>
            <CartesianGrid stroke="#666" strokeOpacity={0.3} vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis tick={{ fill: "#d4d4d8", fontSize: 12 }} />
            <Line type="monotone" dataKey="temperature" stroke="#fb923c" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="humidity" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
