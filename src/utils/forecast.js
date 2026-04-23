export function linearForecastTemperature(series = [], points = 6, stepMinutes = 10) {
  const base = series.slice().reverse();
  if (!base.length) return [];

  const rows = base.map((row, i) => ({ t: i + 1, y: Number(row.temperature ?? 0) }));
  const n = rows.length;

  const tAvg = rows.reduce((s, p) => s + p.t, 0) / n;
  const yAvg = rows.reduce((s, p) => s + p.y, 0) / n;
  const slope =
    rows.reduce((s, p) => s + (p.t - tAvg) * (p.y - yAvg), 0) /
    (rows.reduce((s, p) => s + (p.t - tAvg) ** 2, 0) || 1);

  const start = base[base.length - 1]?.timestampMs || Date.now();
  const lastTemp = rows[n - 1].y;

  return Array.from({ length: points }, (_, i) => {
    const step = i + 1;
    const minute = step * stepMinutes;
    return {
      step,
      time: new Date(start + minute * 60 * 1000).toLocaleTimeString(),
      temperature: Number((lastTemp + slope * step).toFixed(1)),
    };
  });
}
