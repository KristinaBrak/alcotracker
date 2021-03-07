import { Box, Button, Center, FormControl, Input } from "@chakra-ui/react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export const passwordHash =
  "$2a$10$Y1OX20MhCEqwSXG8pjNVZudnaC.pg76WXUS.KckYewwrFUIFmmvDG";

const Login = () => {
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const localStPassword = localStorage.getItem("password-hash");
    if (localStPassword) {
      router.push("/");
    }
  }, []);

  const submit = () => {
    const isAuthenticated = bcrypt.compareSync(password, passwordHash);
    if (isAuthenticated) {
      localStorage.setItem("password-hash", passwordHash);
      setPassword(null);
      router.push("/");
    }
  };

  return (
    <Center
      position="absolute"
      top="90%"
      // transform="translateY(-50%.)"
      left="35%"
      bg="white"
    >
      <Box borderWidth="1px" borderRadius="lg" padding="8">
        <FormControl size="sm">
          <Input
            type="password"
            placeholder="Slaptažodis"
            size="sm"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submit();
              }
            }}
          />
          <Button
            colorScheme="teal"
            isFullWidth
            size="sm"
            marginTop="4"
            onClick={submit}
          >
            Prisijungti
          </Button>
        </FormControl>
      </Box>
    </Center>
  );
};

export default Login;
