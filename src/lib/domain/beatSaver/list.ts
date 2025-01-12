import { apiCall } from "./api";

apiCall("/maps/plays/{page}", "get", { path: { page: 0 } });
