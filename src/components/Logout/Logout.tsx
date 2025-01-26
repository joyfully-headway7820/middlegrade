import React from "react";
import styles from "./Logout.module.scss";
import { useCookies } from "react-cookie";
import { LogOut } from "lucide-react";

export default function Logout() {
  const [cookies, setCookies, removeCookie] = useCookies();

  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("username");
    removeCookie("password");
  };
  return (
    <button onClick={handleLogout} className={styles.logout}>
      <LogOut />
    </button>
  );
}
