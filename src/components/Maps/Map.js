import { useEffect, useState } from "react";
// import PropTypes from "prop-types";
import * as d3 from "d3";

import Chart from "../Chart/Chart";

import {
  useChartDimensions,
  // accessorPropsType,
  // useUniqueId,
} from "../Chart/utils";
import Legend from "../Chart/Legend";
import CurrentLocation from "../Chart/Map/CurrentLocation";

import "./Map.scss";
const Map = ({
  metricDataByCountry,
  countryNameAccessor,
  countryIdAccessor,
  metric,
  subTitle,
  toolTipText,
}) => {
  const [mapData, setMapData] = useState();
  const [ref, dimensions] = useChartDimensions({
    width: window.innerWidth * 0.9,
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
  });

  const sphere = { type: "Sphere" };
  const projection = d3
    .geoEqualEarth()
    .fitWidth(dimensions.boundedWidth, sphere);

  const pathGenerator = d3.geoPath(projection);
  const [[,], [, y1]] = pathGenerator.bounds(sphere);

  dimensions.boundedHeight = y1;
  dimensions.height =
    dimensions.boundedHeight + dimensions.marginTop + dimensions.marginBottom;

  const metricValues = Object.values(metricDataByCountry);
  const metricValueExtent = d3.extent(metricValues);
  const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]]);
  const colorScale = d3
    .scaleLinear()
    .domain([-maxChange, 0, maxChange])
    .range(["indigo", "white", "darkgreen"]);
  const graticuleJson = d3.geoGraticule10();

  const getData = async () => {
    const result = await d3.json("./world-geojson.json");

    setMapData(result);
  };
  useEffect(() => {
    getData();
  }, []);
  const tooltip = d3.select("#tooltip");
  const onMouseEnter = (e, datum) => {
    tooltip.style("opacity", 1);
    const metricValue = metricDataByCountry[countryIdAccessor(datum)];
    const countryName = countryNameAccessor(datum);
    tooltip.select("#country").text(countryName);
    tooltip.select("#value").text(`${d3.format(",.2f")(metricValue || 0)}`);
    const [centerX, centerY] = pathGenerator.centroid(datum);
    const x = centerX + dimensions.marginLeft;
    const y = centerY + dimensions.marginTop;

    tooltip.style(
      "transform",
      `translate( calc( -10% + ${x}px), calc(-25% + ${y}px) )`
    );
  };
  const onMouseLeave = (e, datum) => {
    tooltip.style("opacity", 0);
  };
  return (
    <>
      <div id="tooltip" className="tooltip">
        <div className="tooltip-country" id="country"></div>
        <div className="tooltip-value">
          <span id="value"></span>
          {toolTipText}
        </div>
      </div>

      <div className="Map" ref={ref}>
        <Chart dimensions={dimensions}>
          <path className="earth" d={pathGenerator(sphere)}></path>
          <path className="graticule" d={pathGenerator(graticuleJson)}></path>
          {mapData &&
            mapData.features.map((item, i) => {
              return (
                <path
                  key={i}
                  className="country"
                  onMouseEnter={(e) => onMouseEnter(e, item)}
                  onMouseLeave={(e) => onMouseLeave(e, item)}
                  d={pathGenerator(item)}
                  fill={
                    !metricDataByCountry[countryIdAccessor(item)]
                      ? "#e2e6e9"
                      : colorScale(metricDataByCountry[countryIdAccessor(item)])
                  }
                ></path>
              );
            })}
          <Legend
            title={metric}
            subTitle={subTitle}
            dimensions={dimensions}
            colorScale={colorScale}
            maxChange={maxChange}
          ></Legend>
          <CurrentLocation projection={projection} />
        </Chart>
      </div>
    </>
  );
};
export default Map;
