import axios from "axios";
import { serverAlias } from "../constants/constants.ts";

export async function monthScheduleQuery(
  token: string,
  monday: string,
  sunday: string,
) {
  const { data } = await axios.get(
    `${serverAlias}/schedule?monday=${monday}&sunday=${sunday}/`,
    {
      headers: {
        Authorization: token,
      },
    },
  );

  return data;
}
