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

  let currSound: HTMLAudioElement | null = null;
  const stopSound = () => {
    if (currSound) currSound.pause();
    currSound = null;
  };
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

{#snippet button({
  zipUrl: url,
  difficulty,
  name,
}: {
  zipUrl: string;
  difficulty?: string;
  name?: string;
})}
  {@const title:string = encodeURIComponent(name || "unknown")}
  {@const diff = encodeURIComponent(difficulty || "unknown")}
  <a
    href={`/test/beatsaver/play/${title}/${diff}?zip=${encodeURIComponent(url)}`}
    target="_blank"
  >
    <button>PlayTest</button>
  </a>
  <a
    href={`/vr/play/${title}/${diff}?zip=${encodeURIComponent(url)}`}
  >
    <button>PlayVr</button>
  </a>
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
            onmouseleave={stopSound}
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
                    <span>{diff.difficulty}</span><spacer></spacer>
                    {#if v.downloadURL}
                      {@render button({
                        zipUrl: v.downloadURL,
                        difficulty: diff.difficulty,
                        name: mapData.name,
                      })}
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}
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
