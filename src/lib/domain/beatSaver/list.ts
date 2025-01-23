import type { definitions } from "$lib/types/BeatSaverTypes";
import { apiCall } from "./api";

export type MapList = definitions["MapDetail"][];
export const getDefault = ({ page = 0 }: { page?: number }) =>
  apiCall("/maps/plays/{page}", "get", { path: { page } }).then(
    (v) => v.docs!
  );
