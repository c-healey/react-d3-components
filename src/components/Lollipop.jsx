import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Chart from "./Chart/Chart";
import Bars from "./Chart/Bars";
import Axis from "./Chart/Axis";
import Gradient from "./Chart/Gradient";
import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId,
} from "./Chart/utils";

import Circles from "./Chart/Circles";
import Text from "./Chart/Text";
import Line from "./Chart/Line";

const gradientColors = ["#9980FA", "rgb(226, 222, 243)"];
const Lollipop = ({ data, xAccessor, yAccessor, xLabel, Title = "" }) => {
  const gradientId = useUniqueId("Lollipop-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginLeft: 150,
  });
  const barHeight = 20;
  const barPadding = 2.5;
  const sortedData = data
    .filter((d) => xAccessor(d) && xAccessor(d) >= 20)
    .sort((a, b) => +xAccessor(b) - +xAccessor(a));
  dimensions.height = (sortedData.length + 1) * (barHeight + barPadding);
  console.log(dimensions.height);
  dimensions.boundedHeight =
    dimensions.height - dimensions.marginTop - dimensions.marginBottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(sortedData, xAccessor)])
    .nice()
    .range([0, dimensions.boundedWidth]);

  return (
    <div className="Lollipop" ref={ref}>
      <h1>{Title}</h1>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          label={xLabel}
        />
        {sortedData.map((d, i) => (
          <Text
            key={i}
            text={yAccessor(d)}
            x={-10}
            y={(i + barPadding / 2) * barHeight}
            style={{ textAnchor: "end" }}
          />
        ))}

        <Circles
          data={sortedData}
          keyAccessor={(d, i) => i}
          xAccessor={(d, i) => xScale(xAccessor(d))}
          yAccessor={(d, i) => (i + barPadding / 2) * barHeight}
        />
        <Line
          data={sortedData}
          startX={(d) => xScale(0)}
          endX={(d) => xScale(xAccessor(d))}
          startY={(d, i) => (i + barPadding / 2) * barHeight}
          endY={(d, i) => (i + barPadding / 2) * barHeight}
        />
      </Chart>
    </div>
  );
};

Lollipop.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
};

Lollipop.defaultProps = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
};
export default Lollipop;
