import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Axis from "../Chart/Axis";
import Chart from "../Chart/Chart";
import Circles from "../Chart/Circles";
import LineA2B from "../Chart/LineA2B";
import Text from "../Chart/Text";
import { useChartDimensions, accessorPropsType } from "../Chart/utils";

import "./Lollipop.scss";
import Bars from "../Chart/Bars";
const Lollipop = ({
  data,
  xAccessor,
  yAccessor,
  xLabel,
  Title = "",
  bars = false,
  ...props
}) => {
  const [ref, dimensions] = useChartDimensions({
    marginLeft: 150,
  });
  const barHeight = 30;
  const barPadding = 2.5;
  const sortedData = data
    .filter((d) => xAccessor(d) && xAccessor(d) >= 20)
    .sort((a, b) => +xAccessor(b) - +xAccessor(a));
  dimensions.height = (sortedData.length + 1) * (barHeight + barPadding);

  dimensions.boundedHeight =
    dimensions.height - dimensions.marginTop - dimensions.marginBottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(sortedData, xAccessor)])
    .nice()
    .range([0, dimensions.boundedWidth]);

  return (
    <div className={`Lollipop ${bars ? "Bar" : ""}`} ref={ref}>
      {Title.length !== 0 && <h1>{Title}</h1>}
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
        {!bars && (
          <>
            <LineA2B
              data={sortedData}
              startX={(d) => xScale(0)}
              endX={(d) => xScale(xAccessor(d))}
              startY={(d, i) => (i + barPadding / 2) * barHeight}
              endY={(d, i) => (i + barPadding / 2) * barHeight}
              stroke={"#95a5a6"}
            />
            <Circles
              data={sortedData}
              keyAccessor={(d, i) => i}
              xAccessor={(d, i) => xScale(xAccessor(d))}
              yAccessor={(d, i) => (i + barPadding / 2) * barHeight}
              radius={8}
              stroke={"#95a5a6"}
              fill={"#69b3a2"}
            />
          </>
        )}
        {bars && (
          <Bars
            data={sortedData}
            keyAccessor={(d, i) => i}
            xAccessor={0}
            yAccessor={(d, i) => (i + 0.5) * barHeight}
            widthAccessor={(d, i) => xScale(xAccessor(d))}
            heightAccessor={barHeight - 1}
            {...props}
          />
        )}

        {sortedData.map((d, i) => (
          <Text
            key={i}
            className="annotation"
            text={xAccessor(d)}
            x={xScale(xAccessor(d)) + (i === 0 ? -12 : 12)}
            y={
              (i + barPadding / 2) * barHeight +
              (i === 0 && !bars ? -barHeight / 4 : bars ? -2 : 5)
            }
            style={{ textAnchor: i === 0 ? "end" : "start" }}
          />
        ))}
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
