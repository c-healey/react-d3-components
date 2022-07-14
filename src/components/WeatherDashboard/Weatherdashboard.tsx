import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { getTimelineData, getScatterData } from "../../utils/dummyData";

import Timeline from "../Timeline";
import ScatterPlot from "../ScatterPlot/ScatterPlot";
import Histogram from "../Histogram";

import "./styles.css";
const parseDate = d3.timeParse("%m/%d/%Y");
const dateAccessor = (d: any) => parseDate(d.date);
const temperatureAccessor = (d: any) => d.temperature;
const humidityAccessor = (d: any) => d.humidity;

const getData = () => ({
  timeline: getTimelineData(),
  scatter: getScatterData(),
});
const WeatherDashboard = () => {
  const [data, setData] = useState(getData());

  useInterval(() => {
    setData(getData());
  }, 4000);

  return (
    <>
      <h1>Weather Dashboard</h1>
      <Timeline
        data={data.timeline}
        xAccessor={dateAccessor}
        yAccessor={temperatureAccessor}
        label="Temperature"
      />

      <ScatterPlot
        data={data.scatter}
        xAccessor={humidityAccessor}
        yAccessor={temperatureAccessor}
        xLabel="Humidity"
        yLabel="Temperature"
        // colorAccessor={() => {}}
      />
      <Histogram
        data={data.scatter}
        xAccessor={humidityAccessor}
        label="Humidity"
      />
    </>
  );
};

function useInterval(callback: any, delay: any) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback?.current) (savedCallback.current as any)();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default WeatherDashboard;
