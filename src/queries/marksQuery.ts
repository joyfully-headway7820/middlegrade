import axios from "axios";
import { serverAlias } from "../constants/constants.ts";
import { IMarkResponse } from "../@types";

export async function marksQuery(token: string): Promise<IMarkResponse[]> {
  const { data } = await axios.get(`${serverAlias}/marks/`, {
    headers: {
      Authorization: token,
    },
  });

  return data;
}
