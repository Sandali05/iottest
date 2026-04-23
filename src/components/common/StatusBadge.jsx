export default function StatusBadge({ label, tone = "ok" }) {
  return <span className={`status-badge ${tone}`}>{label}</span>;
}
