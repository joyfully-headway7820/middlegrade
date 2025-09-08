import axios from "axios";
import { serverAlias } from "../constants/constants.ts";
import { IDataElement } from "../components/Stats";

export async function marksQuery(token: string): Promise<IDataElement[]> {
  const { data } = await axios.get(`${serverAlias}/marks/`, {
    headers: {
      Authorization: token,
    },
  });

  return data;
}
