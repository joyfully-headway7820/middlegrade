import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app: Express = express();
const jsonParser = bodyParser.json();
const port = 3000;

app.use(cors());
app.use(express.static("static"));

app.get("/", (req: Request, res: Response) => {
  res.send("ну и что тебе тут понадобилось?");
});

app.post("/auth", cors(), jsonParser, async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      "https://msapi.top-academy.ru/api/v2/auth/login",
      {
        username: req.body.username,
        password: req.body.password,
        application_key:
          "6a56a5df2667e65aab73ce76d1dd737f7d1faef9c52e8b8c55ac75f565d8e8a6",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://journal.top-academy.ru",
        },
      },
    );

    if (!response) {
      res.status(401).send("Unauthorized");
    }

    res.send(response.data.access_token);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.post("/marks", cors(), jsonParser, async (req: Request, res: Response) => {
  try {
    let token = req.body.token;

    if (!token) {
      token = await axios.post("http://localhost:3000/auth");
    }

    const response = await axios.get(
      "https://msapi.top-academy.ru/api/v2/progress/operations/student-visits",
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://journal.top-academy.ru",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/exams", cors(), jsonParser, async (req: Request, res: Response) => {
  try {
    let token = req.body.token;

    if (!token) {
      token = await axios.post("http://localhost:3000/auth");
    }

    const response = await axios.get(
      "https://msapi.top-academy.ru/api/v2/progress/operations/student-exams",
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://journal.top-academy.ru",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

/*
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

func main() {
	request, err := http.NewRequest("POST", "https://msapi.top-academy.ru/api/v2/auth/login", strings.NewReader(`{"username": "Uraza_wz57", "password": "kq3P0oU242", "application_key": "6a56a5df2667e65aab73ce76d1dd737f7d1faef9c52e8b8c55ac75f565d8e8a6"}`))

	request.Header.Add("Content-Type", "application/json")
	request.Header.Add("Referer", "https://journal.top-academy.ru")

	if err != nil {
		log.Fatal(err)
	}

	client := &http.Client{}
	response, err := client.Do(request)

	if err != nil {
		log.Fatal(err)
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(string(body))
	fmt.Println("It's working!")
}

 */