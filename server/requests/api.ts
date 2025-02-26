import axios from "axios";

export default async function apiRequest(endpoint: string, token: string) {
  const response = await axios.get(
    `https://msapi.top-academy.ru/api/v2/${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        Referer: "https://journal.top-academy.ru",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
