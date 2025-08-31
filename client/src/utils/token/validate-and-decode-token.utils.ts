import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import type { AccessDecodedToken } from "src/types/auth.type";

export const validateAndDecodeToken = (accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  const decodedToken: AccessDecodedToken = jwtDecode(accessToken);

  const today = dayjs();
  const expDate = dayjs(decodedToken.exp);
  const isExpired = expDate.isBefore(today);

  if (!isExpired) {
    return null;
  }

  delete decodedToken.exp;
  delete decodedToken.iat;

  return decodedToken;
};
