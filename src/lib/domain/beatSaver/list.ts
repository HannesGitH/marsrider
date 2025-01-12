import { baseUrl } from "./common";
import type { paths } from '$lib/types/BeatSaverTypes';

function getListPaginated(page: Number) {
    const path : paths = `/maps/plays/${page}`;
    return fetch(baseUrl + );
}