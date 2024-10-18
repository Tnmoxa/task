import RootStore from "./RootStore";

export const rootStore = new RootStore();
export const accountStore = rootStore.accountStore;
export const messageStore = rootStore.messageStore;
