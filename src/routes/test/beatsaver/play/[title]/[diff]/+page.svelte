<script lang="ts">
	import type { PageProps } from './$types';
    let { data }: PageProps = $props();
</script>

{#await data.data then data}
    {#each data.map._notes as note}
        {note._type}
    {/each}
{/await}