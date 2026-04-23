import DashboardLayout from "./layouts/DashboardLayout";
import TemperatureHumidityPage from "./pages/TemperatureHumidity/TemperatureHumidityPage";

export default function App() {
  return (
    <DashboardLayout>
      <TemperatureHumidityPage />
    </DashboardLayout>
  );
}
