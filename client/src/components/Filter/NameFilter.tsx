import React from "react";
import { Input } from "@chakra-ui/react";
interface Props {
  name: string;
  setName: (name: string) => void;
  firstRef?: React.MutableRefObject<undefined>;
}

const NameFilter: React.FC<Props> = ({ name, setName, firstRef }) => {
  return (
    <Input
      type="text"
      value={name}
      onChange={({ target }) => {
        setName(target.value);
      }}
      size="sm"
      placeholder={"Įveskite pavadinimą"}
      ref={firstRef}
    />
  );
};

export default NameFilter;
