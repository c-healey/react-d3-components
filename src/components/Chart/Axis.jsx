import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { dimensionsPropsType } from "./utils";
import { useDimensionsContext } from "./Chart";

const axisComponentsByDimension = {
  x: AxisHorizontal,
  y: AxisVertical,
  radial: AxisRadial,
};
const Axis = ({ dimension, ...props }) => {
  const dimensions = useDimensionsContext();
  const Component = axisComponentsByDimension[dimension];
  if (!Component) return null;

  return <Component dimensions={dimensions} {...props} />;
};

Axis.propTypes = {
  dimension: PropTypes.oneOf(["x", "y", "radial"]),
  dimensions: dimensionsPropsType,
  scale: PropTypes.func,
  label: PropTypes.string,
  formatTick: PropTypes.func,
};

Axis.defaultProps = {
  dimension: "x",
  scale: null,
  formatTick: d3.format(","),
};

export default Axis;

function AxisHorizontal({ dimensions, label, formatTick, scale, ...props }) {
  const numberOfTicks =
    dimensions.boundedWidth < 600
      ? dimensions.boundedWidth / 100
      : dimensions.boundedWidth / 250;

  const ticks = scale.ticks(numberOfTicks);

  return (
    <g
      className="Axis AxisHorizontal"
      transform={`translate(0, ${dimensions.boundedHeight})`}
      {...props}
    >
      <line className="Axis__line" x2={dimensions.boundedWidth} />

      {ticks.map((tick, i) => (
        <text
          key={tick}
          className="Axis__tick"
          transform={`translate(${scale(tick)}, 25)`}
        >
          {formatTick(tick)}
        </text>
      ))}

      {label && (
        <text
          className="Axis__label"
          transform={`translate(${dimensions.boundedWidth / 2}, 60)`}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function AxisVertical({ dimensions, label, formatTick, scale, ...props }) {
  const numberOfTicks = dimensions.boundedHeight / 70;

  const ticks = scale.ticks(numberOfTicks);

  return (
    <g className="Axis AxisVertical" {...props}>
      <line className="Axis__line" y2={dimensions.boundedHeight} />

      {ticks.map((tick, i) => (
        <text
          key={tick}
          className="Axis__tick"
          transform={`translate(-16, ${scale(tick)})`}
        >
          {formatTick(tick)}
        </text>
      ))}

      {label && (
        <text
          className="Axis__label"
          style={{
            transform: `translate(-56px, ${
              dimensions.boundedHeight / 2
            }px) rotate(-90deg)`,
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
function AxisRadial({ dimensions, label, formatTick, scale, ...props }) {
  const ticks = scale.ticks(4);
  const containsFreezing = scale.domain()[0] < 32;
  return (
    <g className="Axis AxisRadial grid-line" {...props}>
      <line className="Axis__line" y2={dimensions.boundedHeight} />
      {ticks.map((tick) => (
        <circle r={scale(tick)} key={tick} className="Axis__tick">
          {formatTick(tick)}
        </circle>
      ))}
      {ticks.map((d) => {
        if (!d) return null;
        return (
          <rect
            key={`rect-${d}`}
            y={-scale(d) - 10}
            width={40}
            height={20}
            fill="#f8f9fa"
          />
        );
      })}
      {ticks.map((d) => {
        if (!d) return null;
        return (
          <text
            key={`text-${d}`}
            x={4}
            y={-scale(d) + 2}
            className="tick-label-temperature"
          >{`${d3.format(".0f")(d)}°F`}</text>
        );
      })}
      {containsFreezing && <circle r={scale(32)} className="freezing-circle" />}
      {label && (
        <text
          className="Axis__label"
          style={{
            transform: `translate(-56px, ${
              dimensions.boundedHeight / 2
            }px) rotate(-90deg)`,
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
