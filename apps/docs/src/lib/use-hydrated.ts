import { useSyncExternalStore } from "react";

const subscribe = () => () => false;
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export const useHydrated = (): boolean =>
  useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
