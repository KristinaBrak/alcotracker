import { Center, Heading } from "@chakra-ui/react";
import React from "react";

const quotes = [
  "Pylė, pila ir pils",
  "Užpylimas - ne nujiena",
  "Užpylė - visi realiai",
  "Per žinias rodo, kad užpylė",
  "Vyrai užtikrinti, pilti galėtų, kad ir kasdiena",
  "Pilt mes galim be pabaigos",
  "Nėra kas neužpylę",
  "O, pylėjai atėjo!",
  "Sinoptikai žada, kad bus pilama ir per ilgąjį savaitgalį",
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const Header: React.FC = () => {
  return (
    <Center w="100%" h="80px" bg="teal.100">
      <Heading>{quotes[getRandomInt(quotes.length - 1)]}</Heading>
    </Center>
  );
};

export default Header;
