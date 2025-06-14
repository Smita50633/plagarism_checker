// List.js
import React from "react";

const List = (props) => {
  return (
    <ol>
      {props.items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
};

export default List;
