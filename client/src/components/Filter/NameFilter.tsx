import React, { useState } from "react";

interface Props {
  setName: (name: string) => void;
}

const NameFilter: React.FC<Props> = ({ setName }) => {
  const [tempName, setTempName] = useState("");
  return (
    <div style={{ margin: "10px" }}>
      <input
        type="text"
        value={tempName}
        onChange={({ target }) => {
          setTempName(target.value);
        }}
        style={{ border: "1px solid black" }}
        placeholder="Enter name"
      />
      <button
        onClick={() => {
          setName(tempName);
        }}
      >
        Search
      </button>
    </div>
  );
};

export default NameFilter;
