import { create } from "zustand/react";

interface AuthorModalState {
  isOpen: boolean;

  toggleOpen: () => void;
}

const authorModalStore = create<AuthorModalState>((setState, getState) => ({
  isOpen: false,

  toggleOpen: () => setState({ isOpen: !getState().isOpen }),
}));

export default authorModalStore;
