import cookieCutter from "cookie-cutter";
import { news } from "../lib/news";

export const lastNewsToken = JSON.stringify(news[0].date);

export const NEWS_COOKIE = "alco-news";
export const updateNewsInfo = () => {
  const now = new Date();
  const yearAhead = new Date(now.setMonth(now.getMonth() + 12));
  cookieCutter.set(NEWS_COOKIE, lastNewsToken, { expires: yearAhead });
};
