import constate from "constate";
import { useGlobalState } from "@/hooks/useGlobalState";

export const [GlobalStateProvider, useGlobalStateContext] = constate(useGlobalState);