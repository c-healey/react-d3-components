import Histogram from "./Histogram";

const HistogramMain: React.FC<{ data: Array<any> }> = ({ data }) => {
  // const [data, setData] = useState<any>();
  const metrics = [
    "temperatureMin",
    "temperatureMax",
    "cloudCover",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "windGust",
    "windSpeed",
    "visibility",
    "moonPhase",
  ];

  return (
    <>
      {data &&
        metrics.map((metric: string, i: number) => {
          let metricAccessor = (d: any) => d[metric];
          return (
            <Histogram
              key={i}
              data={data}
              xAccessor={metricAccessor}
              label={metric}
            />
          );
        })}
    </>
  );
};

export default HistogramMain;
