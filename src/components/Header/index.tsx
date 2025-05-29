import styled from "./Header.module.scss";
import Logout from "../Logout";
import React from "react";
import { useCookies } from "react-cookie";

type TActiveTab = "stats" | "schedule";

type HeaderProps = {
  activeTab: TActiveTab;
  setActiveTab: (activeTab: TActiveTab) => void;
};

interface IUserData {}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const [cookies] = useCookies();
  const [userData, setUserData] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      const token = cookies.access_token;
    })();
  }, []);

  return (
    <header className={styled.header}>
      <div className={styled.header__left}>
        <h1
          className={`${styled.heading} ${activeTab === "stats" ? styled.active : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Статистика
        </h1>
        <div className={styled.header__separator} />
        <h2
          className={`${styled.heading} ${activeTab === "schedule" ? styled.active : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          Расписание
        </h2>
        <Logout />
      </div>
      <div className={styled.header__avatar}>
        <img
          className={styled.header__avatar__img}
          src="https://fs.top-academy.ru/api/v1/files/wUZOkcWYWQXNZ6YSdJh3PI9Zck60QBmd"
          alt="avatar"
        />
      </div>
    </header>
  );
};
