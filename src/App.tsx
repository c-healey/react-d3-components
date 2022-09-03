import { Route, Routes } from "react-router-dom";
import { json } from "d3";
import Header from "./components/Header/Header";
import HistogramMain from "./components/Histogram/HistogramMain";
import HumidityMain from "./components/Humidity/HumidityMain";
import LollipopMain from "./components/Lollipop/LollipopMain";
import ScatterPlotMain from "./components/ScatterPlot/ScatterPlotMain";
import WeatherDashboard from "./components/WeatherDashboard/Weatherdashboard";

import "./App.scss";
import MapMain from "./components/Maps/MapMain";
import MarginalHistogramMain from "./components/MarginalHistogram/MarginalHistogramMain";
import { useEffect, useState } from "react";
import RadarWeatherMain from "./components/RadarWeather/RadarWeatherMain";
const App = () => {
  const [data, setData] = useState<any>();
  const getData = async () => {
    const result = await json("/my_weather_data.json");
    setData(result);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="App">
      <Header />
      <div className="App__charts">
        {/* <ScatterPlotMain /> */}
        <Routes>
          <Route
            path="/"
            element={<HumidityMain data={data ? data : undefined} />}
          />
          <Route path="/weather" element={<WeatherDashboard />} />
          <Route
            path="/histogram"
            element={<HistogramMain data={data ? data : undefined} />}
          />
          <Route
            path="/humidity"
            element={<HumidityMain data={data ? data : undefined} />}
          />
          <Route path="/radar" element={<RadarWeatherMain data={data} />} />
          <Route
            path="/marginal"
            element={<MarginalHistogramMain data={data} />}
          />
          <Route
            path="/scatter"
            element={<ScatterPlotMain data={data ? data : undefined} />}
          />
          <Route path="/lollipop" element={<LollipopMain />} />
          <Route path="/map" element={<MapMain />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
