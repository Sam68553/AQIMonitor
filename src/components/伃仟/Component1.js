import { useEffect, useState } from "react";
import axios from "axios";
import AnimalCard from "./AnimalCard";
import { Nav } from "react-bootstrap";

const Component1 = () => {
  const [aqiData, setAqiData] = useState([]);
  const [selectList, setSelectList] = useState({});
  const [place, setPlace] = useState();
  const [kind, setKind] = useState();
  const [dataList, setDataList] = useState();

  let targetURL =
    "https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1";
  const getAQIapiData = () => {
    axios
      .get(targetURL)
      .then((res) => {
        setAqiData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelectList = () => {
    let tempSelectList = { ...selectList };
    aqiData?.forEach((item) => {
      if (tempSelectList[item.animal_place] == undefined) {
        tempSelectList = {
          ...tempSelectList,
          [item.animal_place]: {
            [item.animal_kind]: [item]
          }
        };
      } else {
        if (tempSelectList[item.animal_place][item.animal_kind] == undefined) {
          tempSelectList[item.animal_place] = {
            ...tempSelectList[item.animal_place],
            [item.animal_kind]: [item]
          };
        } else {
          tempSelectList[item.animal_place][item.animal_kind].push(item);
        }
      }
    });
    setSelectList(tempSelectList);
  };

  //----下拉選單
  const handlePlace = (event) => {
    setPlace(event.target.value);
  };
  const handleKindChange = (event) => {
    setKind(event.target.value.animal_kind);
    console.log(selectList[place][event.target.value]);
    setDataList(selectList[place][event.target.value]);
  };

  useEffect(() => {
    getAQIapiData();
  }, []);

  useEffect(() => {
    handleSelectList();
  }, [aqiData]);

  return (
    <div >
       <Nav style={{ alignItems: "center"}}>
       <div style={{ fontSize: "2.5rem", marginRight:"20px"}}>給浪浪一個家</div>
        <Nav.Item>
          <select value={place} onChange={handlePlace}>
            <option value="">請選擇收容所</option>
            {Object.keys(selectList).map((item2) => (
              <option key={item2} value={item2}>
                {item2}
              </option>
            ))}
          </select>
        </Nav.Item>
        <Nav.Item style={{marginLeft:"5px"}}>
          <select value={kind} onChange={handleKindChange}>
            <option value="">種類</option>
            {selectList[place] &&
              Object.keys(selectList[place]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>
        </Nav.Item>
      </Nav>
      <br />
      {dataList && dataList.map((item) => <AnimalCard animalData={item} />)}
    </div>
  );
};

export default Component1;
