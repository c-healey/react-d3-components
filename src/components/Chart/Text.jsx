const Text = ({ text, x, y, ...props }) => {
  return (
    <text
      {...props}
      className={`Text ${props.className ? props.className : ""}`}
      x={x}
      y={y}
    >
      {text}
    </text>
  );
};
export default Text;
