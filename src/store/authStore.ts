import { create } from "zustand/react";

interface AuthStore {
  isLoggedIn: boolean;

  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const authStore = create<AuthStore>((setState, getState) => ({
  isLoggedIn: false,

  setIsLoggedIn: (isLoggedIn) => setState({ isLoggedIn: isLoggedIn }),
}));

export default authStore;
