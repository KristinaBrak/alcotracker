import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { COOKIE_NAME, login, PASSWORD_HASH } from "../utils/auth";
import cookie from "cookie";

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = () => {
    console.log("submitting");

    const loggedIn = login(password);
    if (loggedIn) {
      setPassword("");

      setLoading(true);
      router.push("/");
    } else {
      setError("Neteisingas slaptažodis!");
    }
  };

  return (
    <Flex justify="center" marginTop="10rem">
      <Box
        borderWidth="1px"
        borderRadius="lg"
        padding="8"
        minW={{ base: "100%", sm: "400px" }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <FormControl size="sm" isInvalid={Boolean(error)} minW="100%">
            <Input
              type="password"
              size="sm"
              value={password}
              isInvalid={Boolean(error)}
              errorBorderColor="red.300"
              placeholder="Slaptažodis"
              onBlur={() => {
                setError("");
              }}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <FormErrorMessage>{error}</FormErrorMessage>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={loading}
              isFullWidth
              size="sm"
              marginTop="4"
            >
              Prisijungti
            </Button>
          </FormControl>
        </form>
      </Box>
    </Flex>
  );
};

export const getServerSideProps = async function({ req }) {
  const cookies = req.headers.cookie ?? "";
  const value = cookie.parse(cookies)[COOKIE_NAME];

  console.log(value);

  if (value === PASSWORD_HASH) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default Login;
