import { useEffect, useState } from "react";
import axios from "axios";
// targetURL使用的網址是範例，實際測試要搭配你的認證碼喔

const Component1 = () => {
  const [aqiRecords, setAqiRecords] = useState([]);
  const [aqiFields, setAqiFields] = useState();
  const [countyList, setCountyList] = useState({});
  const [city, setCity] = useState();
  const [town, setTown] = useState();
  const [aqiData, setAqiData] = useState();
  const [bgColor, setBgColor] = useState("");
  const [color, setColor] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);

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

    const cityData = countyList[event.target.value];
    if (cityData) {
      cityData.forEach((data) => {
        colorType(data);
        setAqiData(event.target.value);
      });
    }
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

  const colorType = (data) => {
    const aqiValue = data?.aqi;

    if (aqiValue <= 50) {
      setBgColor("#ACE1AF");
      setColor("black");
    } else if (aqiValue <= 100 && aqiValue > 50) {
      setBgColor("#efc64d");
      setColor("black");
    } else if (aqiValue <= 150 && aqiValue > 100) {
      setBgColor("#ffdb99");
      setColor("black");
    } else if (aqiValue <= 200 && aqiValue > 150) {
      setBgColor("#B7505B");
      setColor("black");
    } else if (aqiValue <= 300 && aqiValue > 200) {
      setBgColor("#614F8D");
      setColor("black");
    } else if (aqiValue > 300) {
      setBgColor("#362418");
      setColor("black");
    }
  };

  return (
    <div className="page-container" style={{ background: "#CCF4F4" }}>
      <div className="top-section" style={{ backgroundColor: "#CCF4F4" }}>
        <h1 className="display-1 text-center fw-bolder">空氣品質檢測</h1>
      </div>
      <div className="container">
        <div className="form-floating">
          <select
            value={city}
            onChange={handleCity}
            className="form-select fw-bolder"
          >
            <option selected className="fw-bolder">
              請選擇縣市
            </option>
            {Object.keys(countyList).map((item) => {
              return (
                <option value={item} className="fw-bolder">
                  {item}
                </option>
              );
            })}
          </select>
          <label for="floatingSelect">Select City</label>
        </div>
        {/* <select value={town} onChange={handleTownChange}>
        <option value="">請選擇鄉鎮</option>
        {countyList[city]?.map((data) => (
          <option key={data.sitename} value={JSON.stringify(data)}>
            {data.sitename}
          </option>
        ))}
      </select> */}
        <hr />
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
          {countyList[city]?.map((data, index) => {
            return (
              <div className="col mb-4" key={index}>
                <div className="card">
                  <div style={{ backgroundColor: bgColor, color: color }}>
                    <h2 className="card-title text-muted card-header fw-bolder">
                      測站名稱:{data?.sitename}
                    </h2>

                    <div className="card-body">
                      <h4>
                        <span className=" badge bg-secondary">
                          狀態: {data?.status}
                        </span>
                      </h4>
                      <h5 className="card-text">
                        {" "}
                        <span className=" badge bg-secondary font-monospace">
                          {" "}
                          AQI: {data?.aqi}
                        </span>
                      </h5>
                      <h5 className="card-text">
                        {" "}
                        <span className=" badge bg-secondary font-monospace">
                          {" "}
                          pm2.5: {data?.["pm2.5"]}
                        </span>
                      </h5>

                      <div className="accordion accordion-flush">
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#accordionContent${index}`}
                              aria-expanded={activeAccordion === index}
                            >
                              View More
                            </button>
                          </h2>
                          <div
                            id={`accordionContent${index}`}
                            className={`accordion-collapse collapse ${
                              activeAccordion === index ? "show" : ""
                            }`}
                            aria-labelledby={`accordionHeading${index}`}
                          >
                            <div className="accordion-body">
                              {aqiFields?.map((item) => {
                                return (
                                  <div key={item.id}>
                                    <ul className="list-group list-group-flush">
                                      <li className="list-group-item list-group-item-action fw-bolder">
                                        {item.info.label}: {data[item.id]}
                                      </li>
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bottom-section" style={{ backgroundColor: "#AAD6FF" }}>
          <hr />
        </div>

        {/* {aqiFields?.map((item) => {
        return (
          <div>
            {item.info.label}:{aqiData?.[item.id]}
          </div>
        );
      })} */}
      </div>
    </div>
  );
};
export default Component1;
