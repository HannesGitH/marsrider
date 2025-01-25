<script lang="ts">
  import Fists from "$lib/components/Fists.svelte";
  import { Controller, XR } from "@threlte/xr";
  import type { PageProps } from "./$types";
  import Beats from "$lib/components/Beats.svelte";
  import { T } from "@threlte/core";
  import Platform from "$lib/components/Platform.svelte";
  import type { Data as ZipData } from "$lib/domain/beatSaver/parseZip";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import PlayButton from "$lib/components/PlayButton.svelte";
  let { data: fullData }: PageProps = $props();
  const { data: promisedData, title } = fullData;

  let loading = $state(true);
  let isPaused = $state(false as boolean);
  let data = $state(null as null | ZipData);
  let time = $state(0 as number);

  promisedData.then((d) => {
    // TODO on play increase time
    data = d;
    loading = false;
  });
</script>

{#if loading}
  <LoadingIndicator />
{/if}
{#if data}
  <PlayButton />
  <Beats notes={data.map._notes} currTime={time} />
{/if}

<XR>
  <Fists />
</XR>
<Platform />

<T.AmbientLight />
<T.DirectionalLight />
