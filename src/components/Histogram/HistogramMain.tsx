import { useEffect, useState } from "react";
import * as d3 from "d3";
// import "./styles.css";
import Histogram from "./Histogram";

const HistogramMain = () => {
  const [data, setData] = useState<any>();
  const metrics = [
    "temperatureMin",
    "temperatureMax",
    "cloudCover",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "windGust",
    "windSpeed",
    "visibility",
    "moonPhase",
  ];
  const getData = async () => {
    const result = await d3.json("./my_weather_data.json");

    setData(result);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {data &&
        metrics.map((metric: string, i: number) => {
          let metricAccessor = (d: any) => d[metric];
          return (
            <Histogram
              key={i}
              data={data}
              xAccessor={metricAccessor}
              label={metric}
            />
          );
        })}
    </>
  );
};

export default HistogramMain;
