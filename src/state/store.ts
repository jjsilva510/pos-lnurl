import { create } from "zustand";

interface State {}

interface Actions {}

const useStore = create<State & Actions>(() => ({}));

export default useStore;
