import React from "react";
import { useCookies } from "react-cookie";
import { LoginForm } from "./components/LoginForm";
import Footer from "./components/Footer";
import authorModalStore from "./store/authorModal.ts";
import AboutModal from "./components/AboutModal";
import { Header } from "./components/Header";
import { Stats } from "./components/Stats";
import { Schedule } from "./components/Schedule";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { authQuery } from "./queries/authQuery.ts";
import authStore from "./store/authStore.ts";

function App() {
  const [cookies] = useCookies();
  const queryClient = new QueryClient();

  const { isLoggedIn, setIsLoggedIn } = authStore();

  const authMutation = useMutation({
    mutationFn: async () => {
      await authQuery(cookies.username, cookies.password);
    },
    onSuccess: () => {
      setIsLoggedIn(true);

      queryClient.invalidateQueries({ queryKey: ["marks", "exams"] });
    },
    onError: () => {
      setIsLoggedIn(false);
    },

    retry: false,
  });

  const [activeTab, setActiveTab] = React.useState<"stats" | "schedule">(
    "stats",
  );

  const [activeList, setActiveList] = React.useState<boolean>(false);
  const { isOpen } = authorModalStore();

  React.useEffect(() => {
    if (cookies.access_token) {
      setIsLoggedIn(true);
    } else {
      authMutation.mutate();
    }
  }, []);

  return (
    <div className="app" onClick={() => setActiveList(false)}>
      {isOpen && <AboutModal />}
      {isLoggedIn ? (
        <>
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "stats" ? (
            <Stats activeList={activeList} setActiveList={setActiveList} />
          ) : (
            <Schedule />
          )}
        </>
      ) : (
        <div className="app__login">
          <LoginForm />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
