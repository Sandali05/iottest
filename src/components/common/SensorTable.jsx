export default function SensorTable({ rows = [] }) {
  return (
    <table className="sensor-table">
      <thead>
        <tr>
          <th>timestamp</th>
          <th>temperature</th>
          <th>humidity</th>
          <th>status</th>
          <th>warning</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={`${row.timestamp}-${i}`}>
            <td>{row.timestamp}</td>
            <td>{row.temperature}</td>
            <td>{row.humidity}</td>
            <td>{row.status}</td>
            <td>{row.warning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
