import { timeParse } from "d3";
import MarginalHistogram from "./MarginalHistogram";

const MarginalHistogramMain = ({ data }) => {
  const xAccessor = (d) => d.temperatureMin;
  const yAccessor = (d) => d.temperatureMax;
  const colorScaleYear = 2000;
  const parseDate = timeParse("%Y-%m-%d");
  const colorAccessor = (d) => parseDate(d.date).setYear(colorScaleYear);

  return (
    <>
      {data && (
        <MarginalHistogram
          data={data}
          yAccessor={yAccessor}
          xAccessor={xAccessor}
          colorAccessor={colorAccessor}
          colorScaleYear={colorScaleYear}
        />
      )}
    </>
  );
};
export default MarginalHistogramMain;
