import React from "react";
import { useCookies } from "react-cookie";
import { LoginForm } from "./components/LoginForm";
import Footer from "./components/Footer";
import authorModalStore from "./store/authorModal.ts";
import AboutModal from "./components/AboutModal";
import { Header } from "./components/Header";
import { Stats } from "./components/Stats";

function App() {
  const [cookies] = useCookies();

  const [activeTab, setActiveTab] = React.useState<"stats" | "schedule">(
    "stats",
  );

  const [activeList, setActiveList] = React.useState<boolean>(false);
  const { isOpen } = authorModalStore();

  return (
    <div className="app" onClick={() => setActiveList(false)}>
      {isOpen && <AboutModal />}
      {cookies.access_token ? (
        <>
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "stats" ? (
            <Stats activeList={activeList} setActiveList={setActiveList} />
          ) : (
            <></>
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
