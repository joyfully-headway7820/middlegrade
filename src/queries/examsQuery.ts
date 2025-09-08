import axios from "axios";
import { serverAlias } from "../constants/constants.ts";

export async function examsQuery(token: string) {
  const { data } = await axios.get(`${serverAlias}/exams/`, {
    headers: {
      Authorization: token,
    },
  });

  return data;
}
