function pearson(x = [], y = []) {
  const n = Math.min(x.length, y.length);
  if (!n) return 0;

  const xMean = x.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const yMean = y.slice(0, n).reduce((s, v) => s + v, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i += 1) {
    const dx = x[i] - xMean;
    const dy = y[i] - yMean;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  return num / Math.sqrt((denX || 1) * (denY || 1));
}

export function computeCorrelationsFromCsvRows(rows = []) {
  const temp = rows.map((r) => Number(r.temperature ?? r.temp ?? 0));
  const humidity = rows.map((r) => Number(r.humidity ?? r.hum ?? 0));
  const gas = rows.map((r) => Number(r.gas_level ?? r.gas ?? 0));
  const fridgeDuration = rows.map((r) =>
    Number(r.fridge_door_open_duration ?? r.open_duration ?? 0),
  );

  return {
    temp_humidity: Number(pearson(temp, humidity).toFixed(3)),
    temp_gas: Number(pearson(temp, gas).toFixed(3)),
    humidity_gas: Number(pearson(humidity, gas).toFixed(3)),
    temp_fridge_duration: Number(pearson(temp, fridgeDuration).toFixed(3)),
  };
}
