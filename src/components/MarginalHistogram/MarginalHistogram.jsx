import * as d3 from "d3";
import { useState } from "react";
import Axis from "../Chart/Axis";
import Chart from "../Chart/Chart";
import Circles from "../Chart/Circles";

import Legend from "../Chart/Legend";
import Line from "../Chart/Line";
import { useChartDimensions } from "../Chart/utils";

import "./MarginalHistogram.scss";
const MarginalHistogram = ({
  data,
  xAccessor,
  yAccessor,
  colorAccessor,
  colorScaleYear,
}) => {
  const [ref, dimensions] = useChartDimensions({
    width: d3.min([window.innerWidth * 0.75, window.innerHeight * 0.75]),
    height: d3.min([window.innerWidth * 0.75, window.innerHeight * 0.75]),
    marginBottom: 77,
    marginTop: 77,
    marginRight: 57,
    histogramMargin: 10,
    histogramHeight: 70,
    legendWidth: 250,
    legendHeight: 26,
  });
  const [minDate, setMinDate] = useState(new Date("1/1/2000"));
  const [maxDate, setMaxDate] = useState(new Date("12/31/2000"));
  const [hoverTopHistogramBins, setHoverTopHistogramBins] = useState([]);
  const [hoverRightHistogramBins, setHoverRightHistogramBins] = useState([]);
  const [hoveredDate, setHoveredDate] = useState();
  const [legendHovered, setLegendHovered] = useState(false);
  const temperaturesExtent = d3.extent([
    ...data.map(xAccessor),
    ...data.map(yAccessor),
  ]);
  const xScale = d3
    .scaleLinear()
    .domain(temperaturesExtent)
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(temperaturesExtent)
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const yAccessorScaled = (d) => yScale(yAccessor(d));
  const keyAccessor = (d, i) => i;

  const colorScale = d3
    .scaleSequential()
    .domain([
      d3.timeParse("%m/%d/%Y")(`1/1/${colorScaleYear}`),
      d3.timeParse("%m/%d/%Y")(`12/31/${colorScaleYear}`),
    ])
    .interpolator((d) => d3.interpolateRainbow(-d));
  const numberOfGradientStops = 10;
  const stops = d3
    .range(numberOfGradientStops)
    .map((i) => i / (numberOfGradientStops - 1));

  const colors = stops.map((d) => d3.interpolateRainbow(-d));
  const tickValues = [
    d3.timeParse("%m/%d/%Y")(`4/1/${colorScaleYear}`),
    d3.timeParse("%m/%d/%Y")(`7/1/${colorScaleYear}`),
    d3.timeParse("%m/%d/%Y")(`10/1/${colorScaleYear}`),
  ];
  const legendTickScale = d3
    .scaleLinear()
    .domain(colorScale.domain())
    .range([0, dimensions.legendWidth]);
  // ***********************************************************
  // top histogram
  const topHistogramGenerator = d3
    .bin()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(20);
  // play around with the number of thresholds

  const topHistogramBins = topHistogramGenerator(data);

  const topHistogramYScale = d3
    .scaleLinear()
    .domain(d3.extent(topHistogramBins, (d) => d.length))
    .range([dimensions.histogramHeight, 0]);

  // ***********************************************************
  // Right Histogram

  const rightHistogramGenerator = d3
    .bin()
    .domain(yScale.domain())
    .value(yAccessor)
    .thresholds(20);

  const rightHistogramBins = rightHistogramGenerator(data);

  const rightHistogramYScale = d3
    .scaleLinear()
    .domain(d3.extent(rightHistogramBins, (d) => d.length))
    .range([dimensions.histogramHeight, 0]);

  // 7. Set up interactions

  // create voronoi for tooltips
  const delaunay = d3.Delaunay.from(
    data,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  );
  const voronoiPolygons = delaunay.voronoi();
  voronoiPolygons.xmax = dimensions.boundedWidth;
  voronoiPolygons.ymax = dimensions.boundedHeight;

  function onVoronoiMouseEnter(e) {
    const datum = JSON.parse(e.target.dataset.datum);
    d3.select("#hover-el-group").style("opacity", 1);
    const x = xScale(xAccessor(datum));
    const y = yScale(yAccessor(datum));
    const dayDot = d3.select(".tooltip-dot");
    dayDot
      .attr("cx", (d) => x)
      .attr("cy", (d) => y)
      .attr("r", 7);

    const hoverLineThickness = 10;
    d3.select(".horizontal-line")
      .attr("x", x)
      .attr("y", y - hoverLineThickness / 2)
      .attr(
        "width",
        dimensions.boundedWidth +
          dimensions.histogramMargin +
          dimensions.histogramHeight -
          x
      )
      .attr("height", hoverLineThickness);
    d3.select(".verticle-line")
      .attr("x", x - hoverLineThickness / 2)
      .attr("y", -dimensions.histogramMargin - dimensions.histogramHeight)
      .attr("width", hoverLineThickness)
      .attr(
        "height",
        y + dimensions.histogramMargin + dimensions.histogramHeight
      );

    const formatTemperature = d3.format(".1f");
    const tooltip = d3.select("#tooltip");
    tooltip
      .select("#max-temperature")
      .text(formatTemperature(yAccessor(datum)));

    tooltip
      .select("#min-temperature")
      .text(formatTemperature(xAccessor(datum)));

    const dateParser = d3.timeParse("%Y-%m-%d");
    const formatDate = d3.timeFormat("%A, %B %-d, %Y");
    tooltip.select("#date").text(formatDate(dateParser(datum.date)));

    const tooltipX = xScale(xAccessor(datum)) + dimensions.marginLeft;
    const tooltipY = yScale(yAccessor(datum)) + dimensions.marginTop - 4; // bump up so it doesn't overlap with out hover circle

    tooltip.style(
      "transform",
      `translate(` +
        `calc( -50% + ${tooltipX}px),` +
        `calc(-100% + ${tooltipY}px)` +
        `)`
    );

    tooltip.style("opacity", 1);
  }
  const onVoronoiMouseLeave = () => {
    d3.select("#hover-el-group").style("opacity", 0);
    d3.select("#tooltip").style("opacity", 0);
  };
  const isDayWithinRange = (d) => {
    //   don't care about the year
    //     const [minDate, setMinDate] = useState(new Date("7/31/2000"));
    //   const [maxDate, setMaxDate] = useState(new Date("10/31/2000"));
    const date = new Date(d.date);
    const month = date.getMonth();
    const day = date.getDate();
    const minMonth = minDate.getMonth();
    const maxMonth = maxDate.getMonth();
    const minDay = minDate.getDate();
    const maxDay = maxDate.getDate();

    let result = false;

    if (month <= maxMonth && month >= minMonth) {
      //  its in the month range,
      //  is it in the day range check the outlying months
      result =
        month === minMonth && day >= minDay
          ? true
          : month > minMonth && month < maxMonth
          ? true
          : month === maxMonth && day <= maxDay
          ? true
          : false;
    }
    return result;
  };
  const formatLegendDate = d3.timeFormat("%b %d");
  const legendHighlightBarWidth = dimensions.legendWidth * 0.05;

  const onLegendMouseMove = (e) => {
    //  get the mouse position
    //  and dates based on mouse position
    const [x] = d3.pointer(e);
    const minDateToHighlight = new Date(
      legendTickScale.invert(x - legendHighlightBarWidth)
    );
    const maxDateToHighlight = new Date(
      legendTickScale.invert(x + legendHighlightBarWidth)
    );

    const barX = d3.median([
      0,
      x - legendHighlightBarWidth / 2,
      dimensions.legendWidth - legendHighlightBarWidth,
    ]);

    //  select elements to adjust attr dependant on mouse position
    d3.select(".legend-highlight-group").style(
      "transform",
      `translateX(${barX}px)`
    );
    //  select eleneds barried in legend not exposed outside components

    d3.selectAll(".legend-value").style("opacity", 0);
    d3.selectAll(".legend-tick").style("opacity", 0);

    //  set state
    setLegendHovered(true);
    setMinDate(minDateToHighlight);
    setMaxDate(maxDateToHighlight);

    const hoveredDates = data.filter(isDayWithinRange);
    setHoveredDate(d3.isoParse(legendTickScale.invert(x)));
    setHoverTopHistogramBins(topHistogramGenerator(hoveredDates));
    setHoverRightHistogramBins(rightHistogramGenerator(hoveredDates));
  };
  const onLegendMouseLeave = (e) => {
    setMinDate(new Date("1/1/2000"));
    setMaxDate(new Date("12/31/2000"));
    setLegendHovered(false);
    d3.selectAll(".legend-value").style("opacity", 1);
    d3.selectAll(".legend-tick").style("opacity", 1);
  };
  return (
    <div className="marginal-histogram chart500x50" ref={ref}>
      <div id="tooltip" className="tooltip">
        <div className="tooltip-date">
          <span id="date"></span>
        </div>
        <div className="tooltip-temperature">
          <span id="min-temperature"></span>&deg;F -
          <span id="max-temperature"></span>&deg;F
        </div>
      </div>
      <Chart dimensions={dimensions}>
        <rect
          x={0}
          y={0}
          width={dimensions.boundedWidth}
          height={dimensions.boundedHeight}
          className="bounds-background"
        />
        <g
          transform={`translate(0, ${
            -dimensions.histogramHeight - dimensions.histogramMargin
          })`}
        >
          <Line
            type={"area"}
            data={topHistogramBins}
            xAccessor={(d) => xScale((d.x0 + d.x1) / 2)}
            yAccessor={(d) => topHistogramYScale(d.length)}
            y0Accessor={dimensions.histogramHeight}
            interpolation={d3.curveBasis}
            className="histogram-area"
          />
          <Line
            type={"area"}
            data={hoverTopHistogramBins}
            xAccessor={(d) => xScale((d.x0 + d.x1) / 2)}
            yAccessor={(d) => topHistogramYScale(d.length)}
            y0Accessor={dimensions.histogramHeight}
            interpolation={d3.curveBasis}
            fill={colorScale(hoveredDate)}
            stroke={"white"}
            opacity={legendHovered ? 1 : 0}
          />
        </g>
        <g
          className="right-histogram"
          style={{
            transform: `translate(${
              dimensions.boundedWidth + dimensions.histogramMargin
            }px, -${dimensions.histogramHeight}px) rotate(90deg)`,
          }}
        >
          <Line
            type={"area"}
            data={rightHistogramBins}
            xAccessor={(d) => yScale((d.x0 + d.x1) / 2)}
            yAccessor={(d) => rightHistogramYScale(d.length)}
            y0Accessor={dimensions.histogramHeight}
            interpolation={d3.curveBasis}
            className="histogram-area"
          />
          <Line
            type={"area"}
            data={hoverRightHistogramBins}
            xAccessor={(d) => yScale((d.x0 + d.x1) / 2)}
            yAccessor={(d) => topHistogramYScale(d.length)}
            y0Accessor={dimensions.histogramHeight}
            interpolation={d3.curveBasis}
            fill={colorScale(hoveredDate)}
            stroke={"white"}
            opacity={legendHovered ? 1 : 0}
          />
        </g>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          label={"Temperature Min"}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={"Temperature Max"}
        />
        <Circles
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          opacity={(d) => (isDayWithinRange(d) ? 1 : 0.2)}
          colorScale={(d) => colorScale(colorAccessor(d))}
          radius={(d) => (isDayWithinRange(d) ? 4 : 2)}
        />

        {data.map((d, i) => (
          <path
            key={`voronoi${i}`}
            className="voronoi"
            d={voronoiPolygons.renderCell(i)}
            data-datum={JSON.stringify(d)}
            onMouseEnter={onVoronoiMouseEnter}
            onMouseLeave={onVoronoiMouseLeave}
          ></path>
        ))}
        <g id="hover-el-group">
          <circle className="tooltip-dot" />
          <rect className="hover-line horizontal-line" />
          <rect className="hover-line verticle-line" />
        </g>

        <Legend
          dimensions={dimensions}
          colors={colors}
          colorScale={colorScale}
          tickValues={tickValues}
          onMouseMove={(e) => onLegendMouseMove(e)}
          onMouseLeave={(e) => onLegendMouseLeave(e)}
        >
          <g className="legend-highlight-group" opacity={legendHovered ? 1 : 0}>
            <rect
              className="legend-highlight-bar"
              width={dimensions.legendWidth * 0.05}
              height={dimensions.legendHeight}
            ></rect>
            <text
              className="legend-highlight-text"
              x={(dimensions.legendWidth * 0.05) / 2}
              y={-6}
            >
              {[formatLegendDate(minDate), formatLegendDate(maxDate)].join(
                " - "
              )}
            </text>
          </g>
        </Legend>
      </Chart>
    </div>
  );
};
export default MarginalHistogram;
