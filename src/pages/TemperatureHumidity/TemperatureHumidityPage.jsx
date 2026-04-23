import StatusBadge from "../../components/common/StatusBadge";
import SensorTable from "../../components/common/SensorTable";
import CorrelationChart from "../../components/charts/CorrelationChart";
import ForecastChart from "../../components/charts/ForecastChart";
import GaugeCard from "../../components/charts/GaugeCard";
import TrendChart from "../../components/charts/TrendChart";
import { useTempHumData } from "../../hooks/useTempHumData";
import { computeCorrelationsFromCsvRows } from "../../utils/correlation";

export default function TemperatureHumidityPage() {
  const { latest5, liveTemp, liveHum, forecast, correlation, csvRows } = useTempHumData();

  const csvCorrelation = computeCorrelationsFromCsvRows(csvRows);
  const mergedCorrelation = {
    ...csvCorrelation,
    ...correlation,
  };

  const risk = forecast[forecast.length - 1]?.temperature >= 38 ? "DANGER" : "SAFE";

  return (
    <div className="temp-page">
      <div className="title-row">
        <h1>Humidity and Temperature Monitoring</h1>
        <StatusBadge label={`System ${risk}`} tone={risk === "DANGER" ? "danger" : "ok"} />
      </div>

      <div className="grid gauges">
        <GaugeCard title="Humidity Meter" value={liveHum} unit="%" color="#22c55e" />
        <GaugeCard title="Temperature Meter" value={liveTemp} unit="°C" color="#f97316" />
        <ForecastChart data={forecast} />
      </div>

      <div className="grid mid-grid">
        <TrendChart data={latest5} />
        <CorrelationChart correlation={mergedCorrelation} />
      </div>

      <div className="panel">
        <h3 className="panel-title">Humidity and Temperature Sensor Live Data (latest 5 rows)</h3>
        <SensorTable rows={latest5} />
      </div>
    </div>
  );
}
