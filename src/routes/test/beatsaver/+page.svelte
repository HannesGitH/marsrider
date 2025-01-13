<script lang="ts">
  import {
    getDefault as getDefaultList,
    type MapList,
  } from "$lib/domain/beatSaver/list";
  import { onMount } from "svelte";

  let initialData: MapList;

  onMount(async () => {
    initialData = await getDefaultList()!;
  });
</script>

{#await initialData}
  loading
{:then mapList}
  <ul>
    {#each mapList as mapData}
      <li>
        {mapData.curator?.email}
      </li>
    {/each}
  </ul>
{/await}
