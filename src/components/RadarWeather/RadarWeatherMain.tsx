import { timeParse } from "d3";
import RadarWeather from "./RadarWeather";

const RadarWeatherMain: React.FC<{ data: Array<any> }> = ({ data }) => {
  const temperatureMinAccessor = (d: any) => d.temperatureMin;
  const temperatureMaxAccessor = (d: any) => d.temperatureMax;
  const uvAccessor = (d: any) => d.uvIndex;
  const precipitationProbabilityAccessor = (d: any) => d.precipProbability;
  const precipitationTypeAccessor = (d: any) => d.precipType;
  const cloudAccessor = (d: any) => d.cloudCover;
  const dateParser = timeParse("%Y-%m-%d");
  const dateAccessor = (d: any) => dateParser(d.date);
  return (
    <div>
      {data && (
        <RadarWeather
          data={data}
          temperatureMinAccessor={temperatureMinAccessor}
          temperatureMaxAccessor={temperatureMaxAccessor}
          uvAccessor={uvAccessor}
          precipitationProbabilityAccessor={precipitationProbabilityAccessor}
          precipitationTypeAccessor={precipitationTypeAccessor}
          cloudAccessor={cloudAccessor}
          dateParser={dateParser}
          dateAccessor={dateAccessor}
        />
      )}
    </div>
  );
};
export default RadarWeatherMain;
