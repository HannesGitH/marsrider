<script lang="ts">
	import type { PageProps } from './$types';
    let { data }: PageProps = $props();
    data.data.then(console.log);
</script>