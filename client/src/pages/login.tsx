import {
  Box,
  Center,
  Input,
  Text,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import React from "react";

const Login = () => {
  return (
    <Center position="absolute" top="50%" transform="translateY(-50%)">
      <Box borderWidth="1px" borderRadius="lg" padding="8">
        <FormControl size="sm">
          <Input type="password" placeholder="Slaptažodis" size="sm" />
          <Button colorScheme="teal" isFullWidth size="sm" marginTop="4">
            Prisijungti
          </Button>
        </FormControl>
      </Box>
    </Center>
  );
};

export default Login;
