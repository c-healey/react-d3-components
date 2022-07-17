import React, { useEffect, useState } from "react";
import * as d3 from "d3";

import Map from "./Map";

function MapMain() {
  const [countryMetricData, setCountryMetricData] = useState({});
  const countryNameAccessor = (d) => d.properties["NAME"];
  const countryIdAccessor = (d) => d.properties["ADM0_A3_IS"];
  const metric = "Population growth (annual %)";
  // "Net migration";
  // "Population density (people per sq. km of land area)";
  const subTitle = "Percent change in 2017";
  // "As of 2017";
  const toolTipText = " immigrants";
  let metricDataByCountry = {};

  const getData = async () => {
    const dataset = await d3.csv("./data_bank_data.csv");

    dataset.forEach((item) => {
      if (item["Series Name"] !== metric) return;
      metricDataByCountry[item["Country Code"] || "err"] =
        item["2017 [YR2017]"] || 0;
      if (isNaN(+metricDataByCountry[item["Country Code"] || "err"])) {
        metricDataByCountry[item["Country Code"] || "err"] = 0;
      } else {
        metricDataByCountry[item["Country Code"] || "err"] =
          +metricDataByCountry[item["Country Code"] || "err"];
      }
      setCountryMetricData(metricDataByCountry);
    });
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!countryMetricData) return <div>Loading Metrics...</div>;

  return (
    <div className="App">
      <div className="App__charts">
        <Map
          metricDataByCountry={countryMetricData}
          countryNameAccessor={countryNameAccessor}
          countryIdAccessor={countryIdAccessor}
          metric={metric}
          subTitle={subTitle}
          toolTipText={toolTipText}
        ></Map>
      </div>
    </div>
  );
}

export default MapMain;
