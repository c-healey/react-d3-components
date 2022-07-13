import * as d3 from "d3";
import { GradientBasic } from "./Gradient";
import { useUniqueId } from "./utils";

const Legend = ({ title, subTitle, dimensions, colorScale, maxChange }) => {
  const gradientId = useUniqueId("legend-gradient");
  const legendHeight = "16";
  const legendWidth = "120";
  return (
    <g
      transform={`translate(120, ${
        dimensions.width < 800
          ? dimensions.boundedHeight - 30
          : dimensions.boundedHeight * 0.5
      })`}
    >
      <text y={-23} className="legend-title">
        {title}
      </text>
      <text y={-9} className="legend-byline">
        {subTitle}
      </text>
      <defs>
        <GradientBasic
          id={gradientId}
          colors={["indigo", "white", "darkgreen"]}
        />
      </defs>
      <rect
        x={"-60"}
        height={legendHeight}
        width={legendWidth}
        style={{ fill: `url(#${gradientId})` }}
      ></rect>
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
