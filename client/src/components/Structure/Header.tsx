import { Center, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const quotes = [
  "Pylė, pila ir pils",
  "Užpylimas - ne naujiena",
  "Užpylė - visi realiai",
  "Per žinias rodo, kad užpylė",
  "Vyrai užtikrinti, pilti galėtų, kad ir kas dieną",
  "Pilt mes galim be pabaigos",
  "Nėra kas neužpylę",
  "O, pylėjai atėjo!",
  "Sinoptikai žada, kad bus pilama ir per ilgąjį savaitgalį",
];

const INTERVAL = 60 * 1000;

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const Header: React.FC = () => {
  const [quote, setQuote] = useState(quotes[getRandomInt(quotes.length - 1)]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuote(quotes[getRandomInt(quotes.length - 1)]);
    }, INTERVAL);

    return () => {
      clearTimeout(timeout);
    };
  }, [quote]);

  return (
    <Center h="80px" bg="teal.100">
      <Heading padding="10px" textAlign="center" size="lg">
        {quote}
      </Heading>
    </Center>
  );
};

export default Header;
