import axios from "axios";
import { serverAlias } from "../constants/constants.ts";

export async function authQuery(username: string, password: string) {
  const { token } = (
    await axios.post(`${serverAlias}/auth/`, {
      username,
      password,
    })
  ).data;

  return token;
}
