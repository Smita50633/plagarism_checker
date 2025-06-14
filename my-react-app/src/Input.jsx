// Input.js
import React, { useState } from "react";

const Input = (props) => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleAdd = () => {
    if (inputText.trim() !== "") {
      props.onAdd(inputText);
      setInputText(""); // Clear input after adding
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter the item"
        value={inputText}
        onChange={handleInputChange}
      />
      <button onClick={handleAdd}>Add</button>
    </>
  );
};

export default Input;
