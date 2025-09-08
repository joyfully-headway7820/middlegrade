import styles from "./Logout.module.scss";
import { useCookies } from "react-cookie";
import { LogOut } from "lucide-react";
import authStore from "../../store/authStore.ts";

export default function Logout() {
  const [, , removeCookie] = useCookies();
  const { setIsLoggedIn } = authStore();

  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("username");
    removeCookie("password");
    setIsLoggedIn(false);
  };
  return (
    <button onClick={handleLogout} className={styles.logout}>
      <LogOut />
    </button>
  );
}
