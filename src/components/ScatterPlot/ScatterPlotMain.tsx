import { useEffect, useState } from "react";
import * as d3 from "d3";

// import scatterplot from "./d3/scatterplot";
import ScatterPlot from "./ScatterPlot";
// import "./styles.css";
const ScatterPlotMain = () => {
  const [data, setData] = useState<any>();
  const getData = async () => {
    const result = await d3.json("/my_weather_data.json");
    setData(result);
  };
  useEffect(() => {
    getData();
  }, []);
  const xAccessor = (d: any) => d.dewPoint;
  const yAccessor = (d: any) => d.humidity;
  const colorAccessor = (d: any) => d.cloudCover;
  console.log(data);
  return (
    <>
      {data && (
        <ScatterPlot
          data={data}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          xLabel="Dew point (&deg;F)"
          yLabel="Relative humidity"
          colorAccessor={colorAccessor}
        />
      )}
    </>
  );
};

export default ScatterPlotMain;
