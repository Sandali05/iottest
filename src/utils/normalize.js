export function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return Object.values(value);
}

export function normalizeEntry(entry = {}) {
  const rawTs =
    entry.timestamp ??
    entry.updated_at ??
    [entry.date, entry.time].filter(Boolean).join(" ");
  const parsed = Number(rawTs);
  const timestampMs = Number.isFinite(parsed) ? parsed : Date.parse(rawTs || "");

  return {
    timestamp: rawTs || "--",
    timestampMs: Number.isFinite(timestampMs) ? timestampMs : 0,
    temperature: Number(entry.temperature ?? entry.temp ?? 0),
    humidity: Number(entry.humidity ?? entry.hum ?? 0),
    status: String(entry.status || "normal"),
    warning: String(entry.warning || "--"),
    gasLevel: Number(entry.gas_level ?? entry.gas_value ?? entry.gas ?? 0),
    fridgeDuration: Number(
      entry.fridge_door_open_duration ?? entry.open_duration ?? 0,
    ),
  };
}
