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

function resolveLatestRecord(rawLatest, rawHistory, rawRoot) {
  // 1) Direct latest object path
  const latestDirect = normalizeEntry(rawLatest || {});
  if (latestDirect.timestampMs) return latestDirect;

  // 2) Latest may be stored as pushed children under /latest
  const latestArray = toArray(rawLatest)
    .map(normalizeEntry)
    .sort((a, b) => b.timestampMs - a.timestampMs);
  if (latestArray[0]?.timestampMs) return latestArray[0];

  // 3) Fallback to first row of history
  const historyArray = toArray(rawHistory)
    .map(normalizeEntry)
    .sort((a, b) => b.timestampMs - a.timestampMs);
  if (historyArray[0]?.timestampMs) return historyArray[0];

  // 4) Some schemas store everything under /TempnHumData root
  const rootHistory = toArray(rawRoot?.history)
    .map(normalizeEntry)
    .sort((a, b) => b.timestampMs - a.timestampMs);
  if (rootHistory[0]?.timestampMs) return rootHistory[0];

  return normalizeEntry({});
}

function resolveHistoryRows(rawHistory, rawRoot) {
  const source = rawHistory ?? rawRoot?.history ?? rawRoot;
  return toArray(source)
    .map(normalizeEntry)
    .filter((x) => x.timestampMs)
    .sort((a, b) => b.timestampMs - a.timestampMs);
}

export function useTempHumData() {
  const [latest, setLatest] = useState(normalizeEntry({}));
  const [historyRows, setHistoryRows] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [csvRows, setCsvRows] = useState([]);
  const [rawLatest, setRawLatest] = useState(null);
  const [rawHistory, setRawHistory] = useState(null);
  const [rawRoot, setRawRoot] = useState(null);

  useEffect(() => {
    fetch(csvUrl)
      .then((res) => res.text())
      .then((text) => setCsvRows(parseCsv(text)))
      .catch(() => setCsvRows([]));

    const unsubLatest = subscribePath(db, "TempnHumData/latest", (val) => setRawLatest(val));
    const unsubHistory = subscribePath(db, "TempnHumData/history", (val) => setRawHistory(val));
    const unsubRoot = subscribePath(db, "TempnHumData", (val) => setRawRoot(val));
    const unsubAnalytics = subscribePath(db, "analytics", (val) => setAnalytics(val || {}));

    return () => {
      unsubLatest();
      unsubHistory();
      unsubRoot();
      unsubAnalytics();
    };
  }, []);

  useEffect(() => {
    setLatest(resolveLatestRecord(rawLatest, rawHistory, rawRoot));
    setHistoryRows(resolveHistoryRows(rawHistory, rawRoot));
  }, [rawLatest, rawHistory, rawRoot]);

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

    return cloudForecast.length
      ? cloudForecast.slice(0, 6)
      : arForecastTemperature(historyRows, 6, 10, 3);
  }, [analytics, historyRows]);

  return {
    latest,
    latest5,
    liveTemp,
    liveHum,
    forecast,
    correlation: analytics?.correlation || {},
    csvRows,
  };
}
