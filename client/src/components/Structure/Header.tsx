import { Center, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
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
  const router = useRouter();
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
      <Head>
        <meta charSet="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Uzpylimas</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <Heading>{quote}</Heading>
    </Center>
  );
};

export default Header;
