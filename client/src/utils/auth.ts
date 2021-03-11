import bcrypt from "bcryptjs";
import cookieCutter from "cookie-cutter";
export const COOKIE_NAME = "alco-pass";

export const PASSWORD_HASH =
  "$2a$10$Y1OX20MhCEqwSXG8pjNVZudnaC.pg76WXUS.KckYewwrFUIFmmvDG";

export const login = (password: string) => {
  const isAuthenticated = bcrypt.compareSync(password, PASSWORD_HASH);
  if (isAuthenticated) {
    cookieCutter.set(COOKIE_NAME, PASSWORD_HASH);
    return isAuthenticated;
  }
  return false;
};

export const logout = () => {
  cookieCutter.set(COOKIE_NAME, "");
  console.log("logout: ", cookieCutter.get(COOKIE_NAME));
};
