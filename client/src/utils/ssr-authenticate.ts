import { COOKIE_NAME, PASSWORD_HASH } from "./auth";
import cookie from "cookie";
import { lastNewsToken, NEWS_COOKIE } from "./newsInfo";

export const authenticate = async function ({ req, res }) {
  const cookies = req.headers.cookie ?? "";
  const parsedCookies = cookie.parse(cookies);
  const value = parsedCookies[COOKIE_NAME];
  const newsCookie = parsedCookies[NEWS_COOKIE];

  const displayNews = newsCookie !== lastNewsToken;

  if (value !== PASSWORD_HASH) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: { displayNews } };
};
