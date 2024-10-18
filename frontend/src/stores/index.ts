import RootStore from "./RootStore";

export type { AccountStore } from "./AccountStore";

export const rootStore = new RootStore();
export const accountStore = rootStore.accountStore;
