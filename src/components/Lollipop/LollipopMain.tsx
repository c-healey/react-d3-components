import { useEffect, useState } from "react";
import { csv } from "d3";

import Lollipop from "./Lollipop";
const LollipopMain = () => {
  const [data, setData] = useState();
  const yAccessor = (d: any) => d.Country;

  const xAccessor = (d: any) => +d.Value;
  const getData = async () => {
    const result = await csv(
      "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv"
    );
    setData(result as any);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {data && (
        <Lollipop
          data={data}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          xLabel="Gun Sales (1000)"
          Title="Who Sells Guns"
          fill={"#69b3a2"}
          stroke={"#69b3a2"}
        />
      )}
    </>
  );
};
export default LollipopMain;
