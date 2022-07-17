import { useEffect, useState } from "react";

const CurrentLocation = ({ projection }) => {
  const [xy, setXy] = useState({ x: 0, y: 0 });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((myPosition) => {
      const [x, y] = projection([
        myPosition.coords.longitude,
        myPosition.coords.latitude,
      ]);
      setXy({ x: x, y: y });
    });
  }, []);

  return xy ? (
    <circle className="my-location" cx={xy.x} cy={xy.y} r={10} />
  ) : (
    <div></div>
  );
};
export default CurrentLocation;
