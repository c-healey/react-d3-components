import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Chart from "./Chart/Chart";

import Axis from "./Chart/Axis";
import Gradient from "./Chart/Gradient";
import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId,
} from "./Chart/utils";
import Bars from "./Chart/Bars";

const formatDate = d3.timeFormat("%-b %-d");
const gradientColors = ["#9980FA", "rgb(226, 222, 243)"];

const Timebar = ({ data, xAccessor, yAccessor, label }) => {
  const [ref, dimensions] = useChartDimensions();
  const gradientId = useUniqueId("Timebar-gradient");

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const numberOfThresholds = 9;
  const binsGenerator = d3
    .bin()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(xScale.ticks(numberOfThresholds));
  console.log("xScale.domain()", xScale.domain());
  const bins = binsGenerator(data);
  // bins.map((bin) =>
  //   console.log(bin.reduce((a, b) => (a += +b.temperature), 0) / bin.length)
  // );

  // const yAccessor = (d) => d.length;
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();
  console.log("yScale", yScale);
  const barPadding = 2;
  const xAccessorScaled = (d) => xScale(d.x0) + barPadding;
  const yAccessorScaled = (d) => yScale(yAccessor(d));
  const y0AccessorScaled = yScale(yScale.domain()[0]);
  const widthAccessorScaled = (d) => xScale(d.x1) - xScale(d.x0) - barPadding;
  const heightAccessorScaled = (d) =>
    dimensions.boundedHeight - yScale(yAccessor(d));

  const keyAccessor = (d, i) => i;
  return (
    <div className="Histogram" ref={ref}>
      <Chart dimensions={dimensions}>
        <defs>
          <Gradient id={gradientId} colors={gradientColors} x2="0" y2="100%" />
        </defs>
        <Axis dimension="x" scale={xScale} formatTick={formatDate} />
        <Axis dimension="y" scale={yScale} label={label} />
        <Bars
          data={bins}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          style={{ fill: `url(#${gradientId})` }}
        />
      </Chart>
    </div>
  );
};

Timebar.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string,
};

Timebar.defaultProps = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
};
export default Timebar;
