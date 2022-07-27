import * as d3 from "d3";
import React from "react";
import { GradientBasic } from "./Gradient";
import { useUniqueId } from "./utils";

const Legend = ({
  title,
  subTitle,
  dimensions,
  colorScale,
  tickValues,
  colors,
  maxChange,
  children,
  ...props
}) => {
  const gradientId = useUniqueId("legend-gradient");
  const legendHeight = dimensions.legendHeight || "16";
  const legendWidth = dimensions.legendWidth || "120";
  const formatTick = d3.timeFormat("%b");
  let legendTickScale;
  if (tickValues && colorScale) {
    legendTickScale = d3
      .scaleLinear()
      .domain(colorScale.domain())
      .range([0, dimensions.legendWidth]);
  }

  return (
    <g
      className="Legend"
      transform={`translate(120, ${
        dimensions.width < 800
          ? dimensions.boundedHeight - 30
          : dimensions.boundedHeight * 0.5
      })`}
    >
      {title && (
        <text y={-23} className="legend-title">
          {title}
        </text>
      )}
      {subTitle && (
        <text y={-9} className="legend-byline">
          {subTitle}
        </text>
      )}
      <defs>
        <GradientBasic
          id={gradientId}
          colors={colors || ["indigo", "white", "darkgreen"]}
        />
      </defs>
      <rect
        // x={"-60"}
        height={legendHeight}
        width={legendWidth}
        style={{ fill: `url(#${gradientId})` }}
        {...props}
      ></rect>
      {tickValues && colorScale && (
        <React.Fragment>
          {tickValues.map((tick, i) => (
            <text
              key={`legend-tick-value-${i}`}
              className="legend-value"
              x={legendTickScale(tick)}
              y={-6}
            >
              {/* {d3.timeFormat("%b")} */}
              {formatTick(tick)}
            </text>
          ))}
          {tickValues.map((tick, i) => (
            <line
              key={`legend-tick-line-${i}`}
              className="legend-tick"
              x1={legendTickScale(tick)}
              x2={legendTickScale(tick)}
              y1={6}
            />
          ))}
        </React.Fragment>
      )}
      {maxChange && (
        <>
          <text
            className="legend-value"
            x={legendWidth / 2 + 10}
            y={legendHeight / 2}
          >{`${d3.format(".1f")(maxChange)}%`}</text>
          <text
            className="legend-value"
            x={-legendWidth / 2 - 10}
            y={legendHeight / 2}
            style={{ textAnchor: "end" }}
          >{`${d3.format(".1f")(-maxChange)}%`}</text>
        </>
      )}
      {children && children}
    </g>
  );
};
export default Legend;

//   const legendValueLeft = legendGroup
//     .append("text")
//     .attr("class", "legend-value")
//     .attr("x", -legendWidth / 2 - 10)
//     .attr("y", legendHeight / 2)
//     .text(`${d3.format(".1f")(-maxChange)}%`)
//     .style("text-anchor", "end");
