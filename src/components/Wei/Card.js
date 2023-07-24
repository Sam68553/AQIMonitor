import React, { Component } from "react";
import "./Card.css";
import Component1 from "./Component1";

const Card = ({ title, content }) => {
  return (
    <div className="card ">
      <div className="card-header">
        <h2>{title}</h2>
      </div>
      <div className="card-body">{content}</div>
    </div>
  );
};

export default Card;
