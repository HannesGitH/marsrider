<script lang="ts">
  export const prerender = true
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

  let currSound: HTMLAudioElement | null = null;
  const playSound = async (url?: string) => {
    if (!url) return;
    if (currSound) currSound.pause();
    currSound = new Audio(url);
    await currSound.play();
  };
</script>

<svelte:window onscroll={onScroll} />

{#snippet figure(image: { src: string; caption: string })}
  <img src={image.src} alt={image.caption} width="100" height="100" />
{/snippet}

<ul>
  {#each mapList as mapData}
    <li class="mapListItem">
      <span>
        {mapData.name}
      </span>
      {#if mapData.versions}
        {#each mapData.versions as v}
          <div
            class="mapListDetails"
            role="button"
            onmouseenter={() => playSound(v.previewURL)}
            tabindex={0}
          >
            {@render figure({
              src: v.coverURL!,
              caption: `${mapData.name} cover`,
            })}
            {#if v.diffs}
              <ul>
                {#each v.diffs as diff}
                  <li>
                    <span>{diff.difficulty}</span>
                  </li>
                {/each}
              </ul>
            {/if}
            <spacer></spacer>
            <span>{v.downloadURL}</span>
          </div>
        {/each}
      {/if}
    </li>
  {/each}
</ul>
{#if isLoading}
  <div class="loadingIndicator">Loading...</div>
{/if}

<style>
  .mapListItem {
    padding: 1rem;
    border-bottom: 1px solid #ccc;
    list-style-type: none;
    .mapListDetails {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  spacer {
    flex-grow: 1;
  }

  .loadingIndicator {
    padding: 1rem;
    text-align: center;
  }
</style>
