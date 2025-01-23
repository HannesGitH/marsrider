<script lang="ts">
  import type { PageProps } from "./$types";
  import {
    getDefault as getDefaultList,
    type MapList,
  } from "$lib/domain/beatSaver/list";
  import { onMount } from "svelte";

  let mapList: MapList = $state([]);
  let currPageOffset = $state(0);
  let isLoading = $state(false);

  let { data }: PageProps = $props();
  let page = $derived(data.page + currPageOffset);

  const appendCurrentPage = async () => {
    isLoading = true;
    const newList = await getDefaultList({ page })!;
    mapList = [...mapList, ...newList];
    isLoading = false;
  };

  onMount(async () => {
    await appendCurrentPage();
    onScroll();
  });

  const onScroll = async () => {
    if (isLoading) return;
    if (window.innerHeight * 1.6 + window.scrollY <= document.body.offsetHeight)
      return;

    currPageOffset += 1;
    await appendCurrentPage();
    if (document.body.offsetHeight <= window.innerHeight) {
      await onScroll();
      console.log({ off: document.body.offsetHeight, win: window.innerHeight });
    }
  };
</script>

<svelte:window onscroll={onScroll} />

<ul>
  {#each mapList as mapData}
    <li>
      {mapData.name}
    </li>
  {/each}
</ul>
{#if isLoading}
  <div class="loadingIndicator">Loading...</div>
{/if}
