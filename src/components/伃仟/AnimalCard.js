import { Card, Nav } from "react-bootstrap";

const AnimalCard = ({ animalData }) => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: "1", margin: "20px" }}>
                <img
                    src={animalData.album_file}
                    alt="無照片資料"
                    style={{
                        width: "300px"
                    }}
                />
            </div>
            <dvi style={{ flex: "1", textAlign: "left" }}>
                <h5 >編號 : {animalData.animal_id}</h5>
                {animalData.animal_sex === "M" ? (
                    <h5>性別 : 男生</h5>
                ) : animalData.animal_sex === "F" ? (
                    <h5>性別 : 女生</h5>
                ) : (
                    <h5>性別 : 未知</h5>
                )}
                <h5>顏色 : {animalData.animal_colour}</h5>
                <h5>更新時間 : {animalData.animal_update}</h5>
            </dvi>
        </div>
    );
};
export default AnimalCard;