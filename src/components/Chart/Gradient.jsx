import React from "react";
import { range, interpolateYlOrRd } from "d3";
import PropTypes from "prop-types";

const Gradient = ({ id, colors, ...props }) => (
  <linearGradient
    id={id}
    gradientUnits="userSpaceOnUse"
    spreadMethod="pad"
    {...props}
  >
    {colors.map((color, i) => (
      <stop
        key={i}
        offset={`${(i * 100) / (colors.length - 1)}%`}
        stopColor={color}
      />
    ))}
  </linearGradient>
);
export const GradientBasic = ({ id, colors, ...props }) => (
  <linearGradient id={id} {...props}>
    {colors.map((color, i) => (
      <stop
        key={i}
        offset={`${(i * 100) / (colors.length - 1)}%`}
        stopColor={color}
      />
    ))}
  </linearGradient>
);

export const RadialGradient = ({ id, numberOfStops, ...props }) => {
  const gradientColorScale = interpolateYlOrRd;
  return (
    <radialGradient id={id} {...props}>
      {range(numberOfStops).forEach((i) => (
        <stop
          key={i}
          offset={`${(i * 100) / (numberOfStops - 1)}%`}
          stopColor={gradientColorScale(i / (numberOfStops - 1))}
        />
      ))}
    </radialGradient>
  );
};

Gradient.propTypes = {
  id: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
};

Gradient.defaultProps = {
  id: "Gradient",
  colors: [],
};

export default Gradient;
