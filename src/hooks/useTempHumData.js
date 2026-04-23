import { useEffect, useMemo, useState } from "react";
import { db } from "../config/firebase";
import { subscribePath } from "../utils/firebaseHelpers";
import { arForecastTemperature } from "../utils/forecast";
import { normalizeEntry, toArray } from "../utils/normalize";

const csvUrl = "/lpg_edge_ai_dataset_1000_correlated.csv";

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  if (!headerLine) return [];

  const headers = headerLine.split(",").map((h) => h.trim());
  return lines
    .filter(Boolean)
    .map((line) => line.split(","))
    .map((cells) =>
      headers.reduce((acc, h, idx) => {
        acc[h] = cells[idx]?.trim() ?? "";
        return acc;
      }, {}),
    );
}

export function useTempHumData() {
  const [latest, setLatest] = useState({});
  const [historyRows, setHistoryRows] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [csvRows, setCsvRows] = useState([]);

  useEffect(() => {
    fetch(csvUrl)
      .then((res) => res.text())
      .then((text) => setCsvRows(parseCsv(text)))
      .catch(() => setCsvRows([]));

    const unsubLatest = subscribePath(db, "TempnHumData/latest", (val) =>
      setLatest(val || {}),
    );
    const unsubHistory = subscribePath(db, "TempnHumData/history", (val) => {
      const rows = toArray(val)
        .map(normalizeEntry)
        .sort((a, b) => b.timestampMs - a.timestampMs);
      setHistoryRows(rows);
    });
    const unsubAnalytics = subscribePath(db, "analytics", (val) =>
      setAnalytics(val || {}),
    );

    return () => {
      unsubLatest();
      unsubHistory();
      unsubAnalytics();
    };
  }, []);

  const latest5 = useMemo(() => historyRows.slice(0, 5), [historyRows]);
  const liveTemp = Number(latest.temperature ?? latest5[0]?.temperature ?? 0);
  const liveHum = Number(latest.humidity ?? latest5[0]?.humidity ?? 0);

  const forecast = useMemo(() => {
    const cloudForecast = toArray(analytics?.forecast?.temperature?.future_points).map(
      (row, i) => ({
        step: row.step ?? i + 1,
        minute: (row.step ?? i + 1) * 10,
        time: row.time || `${(i + 1) * 10} min`,
        temperature: Number(row.value ?? row.temperature ?? 0),
      }),
    );

    return cloudForecast.length ? cloudForecast.slice(0, 6) : arForecastTemperature(historyRows, 6, 10, 3);
  }, [analytics, historyRows]);

  return {
    latest5,
    liveTemp,
    liveHum,
    forecast,
    correlation: analytics?.correlation || {},
    csvRows,
  };
}
