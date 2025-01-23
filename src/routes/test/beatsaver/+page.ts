import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	return {
		page: parseInt(url.searchParams.get('page') || '0', 10)
	};
};