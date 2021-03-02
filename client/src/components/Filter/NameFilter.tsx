import React from "react";
import { Input } from "@chakra-ui/react";
interface Props {
  name: string;
  setName: (name: string) => void;
}

const NameFilter: React.FC<Props> = ({ name, setName }) => {
  return (
    <Input
      type="text"
      value={name}
      onChange={({ target }) => {
        setName(target.value);
      }}
      size="sm"
      placeholder={"Įveskite pavadinimą"}
    />
  );
};

export default NameFilter;
