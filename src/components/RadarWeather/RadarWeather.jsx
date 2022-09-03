import * as d3 from "d3";
import Axis from "../Chart/Axis";
import Chart from "../Chart/Chart";

import { RadialGradient } from "../Chart/Gradient";

import { useChartDimensions, useUniqueId } from "../Chart/utils";
import "./RadarWeather.scss";
const RadarWeather =
  // : React.FC<{
  //   data: any;
  //   temperatureMinAccessor: any;
  //   temperatureMaxAccessor: any;
  //   uvAccessor: any;
  //   precipitationProbabilityAccessor: any;
  //   precipitationTypeAccessor: any;
  //   cloudAccessor: any;
  //   dateParser: any;
  //   dateAccessor: Array<Date | number>;
  // }>
  ({
    data,
    temperatureMinAccessor,
    temperatureMaxAccessor,
    uvAccessor,
    precipitationProbabilityAccessor,
    precipitationTypeAccessor,
    cloudAccessor,
    dateParser,
    dateAccessor,
  }) => {
    const width = 600;
    const [ref, dimensions] = useChartDimensions({
      width: width,
      height: width,
      radius: width / 2,
      marginBottom: 120,
      marginTop: 220,
      marginRight: 120,
      marginleft: 120,
    });
    dimensions.boundedRadius =
      dimensions.radius - (dimensions.marginLeft + dimensions.marginRight) / 2;
    const getCoordinatesForAngle = (angle, offset = 1) => [
      Math.cos(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
      Math.sin(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
    ];
    const gradientId = useUniqueId("Radar-gradient");
    const numberOfStops = 10;
    const gradientColorScale = d3.interpolateYlOrRd;

    const angleScale = d3
      .scaleTime()
      .domain(d3.extent(data, dateAccessor))
      .range([0, Math.PI * 2]); // this is in radians

    const radiusScale = d3
      .scaleLinear()
      .domain(
        d3.extent([
          ...data.map(temperatureMaxAccessor),
          ...data.map(temperatureMinAccessor),
        ])
      )
      .range([0, dimensions.boundedRadius])
      .nice();

    const getXFromDataPoint = (d, offset = 1.4) =>
      getCoordinatesForAngle(angleScale(dateAccessor(d)), offset)[0];
    const getYFromDataPoint = (d, offset = 1.4) =>
      getCoordinatesForAngle(angleScale(dateAccessor(d)), offset)[1];

    // make sure to use a sqrt scale for circle areas
    const cloudRadiusScale = d3
      .scaleSqrt()
      .domain(d3.extent(data, cloudAccessor))
      .range([1, 10]);

    const precipitationRadiusScale = d3
      .scaleSqrt()
      .domain(d3.extent(data, precipitationProbabilityAccessor))
      .range([1, 8]);
    const precipitationTypes = ["rain", "sleet", "snow"];
    const precipitationTypeColorScale = d3
      .scaleOrdinal()
      .domain(precipitationTypes)
      .range(["#54a0ff", "#636e72", "#b2bec3"]);

    const temperatureColorScale = d3
      .scaleSequential()
      .domain(
        d3.extent([
          ...data.map(temperatureMaxAccessor),
          ...data.map(temperatureMinAccessor),
        ])
      )
      .interpolator(gradientColorScale);
    // peripherials
    const months = d3.timeMonths(...angleScale.domain());
    months.forEach((month) => {
      const angle = angleScale(month);
      const [x, y] = getCoordinatesForAngle(angle);
    });
    return (
      <div className="marginal-histogram mt-4" ref={ref}>
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
          <defs>
            <RadialGradient id={gradientId} numberOfStops={numberOfStops} />
          </defs>
          <Axis dimension="radial" label="label" scale={radiusScale} />
          {/* <circle r={radiusScale(32)} className="freezing-circle"} */}
        </Chart>
      </div>
    );
  };
export default RadarWeather;
