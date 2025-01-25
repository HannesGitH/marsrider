import { parseZip } from "$lib/domain/beatSaver/parseZip";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params, url, fetch }) => {
  const zipUrl = decodeURIComponent(url.searchParams.get("zip") || "0");
  return {
    title: params.title,
    data: parseZip(()=>fetch(zipUrl), { difficulty: params.diff as any }),
  };
};
