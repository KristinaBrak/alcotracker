import { COOKIE_NAME, PASSWORD_HASH } from "./auth";
import cookie from "cookie";

export const authenticate = async function ({ req, res }) {
  const cookies = req.headers.cookie ?? "";
  const value = cookie.parse(cookies)[COOKIE_NAME];

  if (value !== PASSWORD_HASH) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: {} };
};
