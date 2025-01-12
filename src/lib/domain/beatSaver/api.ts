import type { paths } from "$lib/types/BeatSaverTypes";
import { baseUrl } from "./common";

type Path = keyof paths;
type PathMethod<T extends Path> = keyof paths[T];
type RequestParams<
  P extends Path,
  M extends PathMethod<P>
> = paths[P][M] extends {
  parameters: any;
}
  ? paths[P][M]["parameters"]
  : undefined;
type ResponseType<
  P extends Path,
  M extends PathMethod<P>
> = paths[P][M] extends {
  responses: { 200: { schema: { [x: string]: any } } };
}
  ? paths[P][M]["responses"][200]["schema"]
  : undefined;

export const apiCall = async <P extends Path, M extends PathMethod<P>>(
  url: P,
  method: M,
  ...params: RequestParams<P, M> extends undefined ? [] : [RequestParams<P, M>]
): Promise<ResponseType<P, M>> => {
  const options: RequestInit = {
    method: method.toString(),
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (params.length > 0 && method === "GET" && 'path' in params[0]!) {
    for (const [key, value] of Object.entries(params[0].path)) {
      url = url.replace(`{${key}}`, encodeURIComponent(value as string)) as P;
    }
  }
  let fullUrl = `${baseUrl}${url}`;

  if (params.length > 0) {
    if (method === "GET") {
      const queryParams = new URLSearchParams(
        params[0] as Record<string, string>
      ).toString();
      fullUrl += `?${queryParams}` as P;
    } else {
      options.body = JSON.stringify(params[0]);
    }
  }

  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as ResponseType<P, M>;
};
