import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import HistogramMain from "./components/Histogram/HistogramMain";
import HumidityMain from "./components/Humidity/HumidityMain";
import LollipopMain from "./components/Lollipop/LollipopMain";
import ScatterPlotMain from "./components/ScatterPlot/ScatterPlotMain";
import WeatherDashboard from "./components/WeatherDashboard/Weatherdashboard";

import "./styles.css";
const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="App__charts">
        <Routes>
          <Route path="/" element={<WeatherDashboard />} />
          <Route path="/weather" element={<WeatherDashboard />} />
          <Route path="/histogram" element={<HistogramMain />} />
          <Route path="/humidity" element={<HumidityMain />} />
          <Route path="/scatter" element={<ScatterPlotMain />} />
          <Route path="/lollipop" element={<LollipopMain />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
