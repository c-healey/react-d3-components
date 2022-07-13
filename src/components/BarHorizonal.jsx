import * as d3 from "d3";
import Axis from "./Chart/Axis";
import Bars from "./Chart/Bars";
import Chart from "./Chart/Chart";
import Text from "./Chart/Text";
import { useChartDimensions } from "./Chart/utils";

const BarHorizontal = ({ data, xAccessor, yAccessor, xLabel, Title = "" }) => {
  const [ref, dimensions] = useChartDimensions({ marginLeft: 150 });
  const barHeight = 20;
  const barPadding = 2.5;
  const sortedData = data
    .filter((d) => xAccessor(d) && xAccessor(d) >= 10)
    .sort((a, b) => +xAccessor(b) - +xAccessor(a));
  dimensions.height = sortedData.length * (barHeight + barPadding);
  console.log(dimensions.height);
  dimensions.boundedHeight =
    dimensions.height - dimensions.marginTop - dimensions.marginBottom;
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(sortedData, xAccessor)])
    .nice()
    .range([0, dimensions.boundedWidth]);

  return (
    <div className="BarHorizontal" ref={ref}>
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
        <Bars
          data={sortedData}
          keyAccessor={(d, i) => i}
          xAccessor={0}
          yAccessor={(d, i) => (i + 0.5) * barHeight}
          widthAccessor={(d, i) => xScale(xAccessor(d))}
          heightAccessor={barHeight - 1}
          //   style={{ fill: `url(#${gradientId})` }}
        />
      </Chart>
    </div>
  );
};
export default BarHorizontal;
