import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CSS/API.css"
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
    let deleteArray = ["pollutant", "o3_8hr", "pm10", "co_8hr", "pm2.5_avg", "pm10_avg", "so2_avg", "longitude",
        "latitude", "siteid"]

    let deleteAqiRecords = ["sitename", "county", "aqi", "status", "publishtime"]

    const handleCounty = () => {
        let tempCountyList = { ...countyList };
        aqiRecords?.forEach((item, index) => {

            Object.keys(item).forEach((key) => {
                if (deleteArray.includes(key)) {
                    delete item[key]
                    // console.log(key)
                }
            })

            if (tempCountyList[item.county] == undefined) {
                tempCountyList = { ...tempCountyList, [item.county]: [item] };
            } else {
                let temp = [...tempCountyList[item.county]];
                temp.push(item);
                tempCountyList[item.county] = temp;
            }
            // 當county undefined 時，將 county名 和其整包 item 加入
            // 當county 找得到的話，push item 進 temp(因已有當county名了，在此加入的item為同county下的不同Town item)
        });
        // console.log(tempCountyList)
        setCountyList(tempCountyList);
    };
    // let deleteAqiRecords = ["sitename","county", "aqi",]
    // const aqiRecordsCopy = { ...aqiRecords };
    // console.log(aqiRecordsCopy)
    // aqiRecordsCopy.forEach((item) => {

    //     Object.keys(item).forEach((key) => {
    //         if (deleteAqiRecords.includes(key)) {
    //             delete item[key]
    //             // console.log(key)
    //         }
    //     })
    // });

    const handleCity = (event) => {
        setCity(event.target.value);
        console.log(event.target)
    };
    const handleTownChange = (event) => {
        setTown(event.target.value.sitename);
        // value = item
        setAqiData(JSON.parse(event.target.value));
        // 將字串轉回物件
    };

    useEffect(() => {
        getAQIapiData();
    }, []);
    // 畫面載入時，先渲染一次

    useEffect(() => {
        handleCounty();
    }, [aqiRecords]);
    // 再選取資料時，重新渲染 aqiRecords(當 aqiRecords 的API端 資料有更新時，也更新此資料)

    console.log(aqiFields)

    return (
        <div class="container-fluid " style={{ padding: 0,marginTop:'0.5em' }}>

            <div class="clouds" style={{ position: 'sticky', top: '0' }} >
                <div class="animation">
                    <div class="cloud cloud1"></div>
                    <div class="cloud cloud2"></div>
                    <div class="cloud cloud3"></div>
                </div>

                {/* <div class="animation1" style={{ position: "absolute", top: '400px', zIndex: '1' }}>
                    <div class="cloud cloud1"></div>
                    <div class="cloud cloud2"></div>
                    <div class="cloud cloud3"></div>
                </div> */}
                
                <div className="btn-group " style={{ zIndex: 5,position: 'sticky', top: '0',margin:'auto',width:'100%' }}>
                <h1 style={{ position: "relative", zIndex: '5',width:'100%' }}>空氣品質指標(AQI)<span style={{ position: "absolute", zIndex: '5', fontSize: '20px', right: '5px' }}>資料發布時間:{aqiData?.publishtime}</span></h1>
                <br />
                    <div className="btn-group " style={{ position: 'relative', display: 'inline-flex', flexDirection: 'row' ,margin:'auto'}}>
                        <select className={`selectpicker btn btn-light`} value={city} onChange={handleCity} style={{backgroundColor: '#5d94a675', color:'#fff'}}>
                            <option value="">請選擇縣市</option>
                            {/* Object.keys() 將countyList物件 轉成陣列，取keys，為固定用法 */}
                            {Object.keys(countyList).map((item2) => {
                                return <option className={"option"} value={item2}>{item2}</option>;
                            })}
                        </select>
                        <select className={`selectpicker btn btn-light`} value={town} onChange={handleTownChange} style={{ borderTopRightRadius: '5px', borderBottomRightRadius: '5px' ,backgroundColor: '#5d94a675',color:'#fff'}}>
                            <option value="">請選擇鄉鎮</option>
                            {/* countyList[city] : countyList 的 city 陣列*/}
                            {countyList[city]?.map((data) => (
                                <option key={data.sitename} value={JSON.stringify(data)}>
                                    {/* stringify 將data轉成字串 */}
                                    {data.sitename}
                                </option>
                            ))}
                        </select>
                    </div>

                    <br />
                    <h2 style={(aqiData?.aqi < 40) ? { color: "green" } : { color: "red" }} ><b style={{textShadow:' 0.05em 0.05em 0.05em #555 '}}>AQI：{aqiData?.aqi}</b></h2>
                    <h2 style={{ color: '#fff',textShadow:' 0.1em 0.1em 0.05em #555 '}}><b>狀態：{aqiData?.status}</b></h2>
                    <h2 style={{ color: '#fff',textShadow:' 0.1em 0.1em 0.05em #555 ' }}><b>pm2.5： {aqiData?.["pm2.5"]} μg/m3</b></h2>
                </div>
            </div>



            <div class="clouds" style={{ width: '0%' ,height:'0%'}}>
                {/* <div class="animation">
                            <div class="cloud cloud1"></div>
                            <div class="cloud cloud2"></div>
                            <div class="cloud cloud3"></div>

                        </div> */}
            </div>

            <div style={{ position: "relative", width: '100%' }}>
                

                <div className="row" style={{ position: "inherit", zIndex: '-1' }}>
                    {aqiFields?.map((item) => {

                        if (!deleteArray.includes(item.id) && !deleteAqiRecords.includes(item.id)) {

                            return (


                                <div className={`card col-3 m-5 ${styles.cardBox} `} style={{ padding: '0%' }} key={item.id}>

                                    {/* <img className="card-img-top" src={item.imgSrc} /> */}
                                    <div className="card-body" style={{ backgroundColor: '#054c545c' }}>
                                        <div className={`card-title ${styles.itemName}`}><b>{item.info.label}</b></div>
                                        <div className={`card-text `}>{aqiData?.[item.id]}</div>
                                        <br />

                                    </div>
                                </div>
                                // {/* {item.info.label}:{aqiData?.[item.id]} */}
                                // {/* [item.id] : 取id的值 */}


                            );
                        }
                    })}
                </div>
            </div>


        </div>
    );
};
export default Component1;
