import Humidity from "./Humidity";
import { useEffect, useState } from "react";
import * as d3 from "d3";

function HumidityMain({ data }) {
  // const [data, setData] = useState();
  const [lineData, setLineData] = useState();
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => dateParser(d.date);
  const yAccessor = (d) => d.humidity;
  const downsampleData = (data, xAccessor, yAccessor) => {
    const weeks = d3.timeWeeks(
      xAccessor(data[0]),
      xAccessor(data[data.length - 1])
    );

    return weeks.map((week, index) => {
      const weekEnd = weeks[index + 1] || new Date();
      const days = data.filter(
        (d) => xAccessor(d) > week && xAccessor(d) <= weekEnd
      );
      return {
        date: d3.timeFormat("%Y-%m-%d")(week),
        humidity: d3.mean(days, yAccessor),
      };
    });
  };
  const getData = () => {
    // const result = await d3.json("./my_weather_data.json");

    // setData(result);
    const dataset = data?.sort((a, b) => xAccessor(a) - xAccessor(b));
    const downsampledData = downsampleData(dataset, xAccessor, yAccessor);

    setLineData(downsampledData);
  };

  useEffect(() => {
    if (data) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <>
      <h1>Humidity</h1>
      {data && lineData && (
        <Humidity
          data={data}
          lineData={lineData}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          yLabel="relative humidity"
        />
      )}
    </>
  );
}

export default HumidityMain;
