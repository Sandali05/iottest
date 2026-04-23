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
  return (
    <Panel title="Next Hour Temperature Forecast">
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#666" strokeOpacity={0.3} vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#d4d4d8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#d4d4d8", fontSize: 12 }} />
            <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
