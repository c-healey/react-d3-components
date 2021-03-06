const LineA2B = ({ data, startX, endX, startY, endY, ...props }) => {
  return data.map((d, i) => (
    <line
      key={i}
      {...props}
      className={`Line Line--type-line ${
        props.className ? props.className : ""
      }`}
      x1={startX(d)}
      x2={endX(d)}
      y1={startY(d, i)}
      y2={endY(d, i)}
    />
  ));
};

export default LineA2B;
