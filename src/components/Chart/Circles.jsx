import React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import { accessorPropsType } from "./utils";

const Circles = ({
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  radius,
  colorAccessor,
}) => {
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(data, colorAccessor))
    .range(["skyblue", "darkslategrey"]);
  return (
    <React.Fragment>
      {data.map((d, i) => (
        <circle
          className="Circles__circle"
          key={keyAccessor(d, i)}
          cx={xAccessor(d, i)}
          cy={yAccessor(d, i)}
          r={typeof radius == "function" ? radius(d) : radius}
          fill={colorAccessor ? colorScale(colorAccessor(d, i)) : null}
        />
      ))}
    </React.Fragment>
  );
};

Circles.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  radius: accessorPropsType,
};

Circles.defaultProps = {
  radius: 5,
};

export default Circles;
