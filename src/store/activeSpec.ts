import { create } from "zustand/react";

interface ActiveSpecState {
  activeSpec: string;

  setActiveSpec: (state: string) => void;
}

const activeSpecStore = create<ActiveSpecState>((setState) => ({
  activeSpec: "Все предметы",

  setActiveSpec: (state) => setState({ activeSpec: state }),
}));

export default activeSpecStore;
