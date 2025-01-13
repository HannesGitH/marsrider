import type { definitions } from "$lib/types/BeatSaverTypes";
import { apiCall } from "./api";

export type MapList = definitions["MapDetail"][];
export const getDefault = () =>
  apiCall("/maps/plays/{page}", "get", { path: { page: 1 } }).then(
    (v) => v.docs!
  );
