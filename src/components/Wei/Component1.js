import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
// targetURL使用的網址是範例，實際測試要搭配你的認證碼喔

const Component1 = () => {
  const [aqiRecords, setAqiRecords] = useState([]);
  const [aqiFields, setAqiFields] = useState();
  const [countyList, setCountyList] = useState({});
  const [city, setCity] = useState();
  const [town, setTown] = useState();
  const [aqiData, setAqiData] = useState();

  let targetURL =
    "https://data.epa.gov.tw/api/v2/aqx_p_432?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=ImportDate desc&format=JSON";
  const getAQIapiData = () => {
    axios
      .get(targetURL)
      .then((res) => {
        setAqiRecords(res.data.records);
        setAqiFields(res.data.fields);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCounty = () => {
    let tempCountyList = { ...countyList };
    aqiRecords?.forEach((item) => {
      if (tempCountyList[item.county] == undefined) {
        tempCountyList = { ...tempCountyList, [item.county]: [item] };
      } else {
        let temp = [...tempCountyList[item.county]];
        temp.push(item);
        tempCountyList[item.county] = temp;
      }
    });
    setCountyList(tempCountyList);
  };
  const handleCity = (event) => {
    setCity(event.target.value);
  };
  const handleTownChange = (event) => {
    setTown(event.target.value.sitename);
    setAqiData(JSON.parse(event.target.value));
  };
  useEffect(() => {
    getAQIapiData();
  }, []);

  useEffect(() => {
    handleCounty();
  }, [aqiRecords]);

  return (
    <div>
      <select value={city} onChange={handleCity}>
        <option value="">請選擇縣市</option>
        {Object.keys(countyList).map((item) => {
          return <option value={item}>{item}</option>;
        })}
      </select>
      <select value={town} onChange={handleTownChange}>
        <option value="">請選擇鄉鎮</option>
        {countyList[city]?.map((data) => (
          <option key={data.sitename} value={JSON.stringify(data)}>
            {data.sitename}
          </option>
        ))}
      </select>
      <br />
      {aqiData && (
        <Card
          title={`縣市: ${city}`}
          content={
            <>
              <h1>AQI:{aqiData?.aqi}</h1>
              <h2>狀態:{aqiData?.status}</h2>
              <h3>pm2.5:{aqiData?.["pm2.5"]}</h3>
              <hr />
              {aqiFields?.map((item) => {
                return (
                  <div>
                    {item.info.label}:{aqiData?.[item.id]}
                  </div>
                );
              })}
            </>
          }
        />
      )}
    </div>
  );
};
export default Component1;
