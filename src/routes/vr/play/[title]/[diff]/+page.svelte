<script lang="ts">
  import Fists from "$lib/components/Fists.svelte";
  import { Controller, XR } from "@threlte/xr";
  import type { PageProps } from "./$types";
  import Beats from "$lib/components/Beats.svelte";
  import { T, useTask } from "@threlte/core";
  import Platform from "$lib/components/Platform.svelte";
  import type { Data as ZipData } from "$lib/domain/beatSaver/parseZip";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import PlayButton from "$lib/components/PlayButton.svelte";
  import MyController from "$lib/components/MyController.svelte";
  let { data: fullData }: PageProps = $props();
  const { data: promisedData, title } = fullData;

  let loading = $state(true);
  let isPaused = $state(true);
  let data = $state(null as null | ZipData);
  let time = $state(0);

  promisedData.then((d) => {
    data = d;
    loading = false;
  });

  useTask((delta) => {
    if (!isPaused) time += delta;
  });

  const menuPosition = $derived(
    (isPaused ? [0, 1, -1] : [-1, 1, -2]) as [x: number, y: number, z: number]
  );
  const menuRotation = $derived(
    (isPaused ? [0, 0, 0] : [0, 1 / 2, 0]) as [x: number, y: number, z: number]
  );
</script>

{#if loading}
  <LoadingIndicator />
{/if}
<XR>
  <MyController hidden={!isPaused} />
  <Fists />
</XR>
{#if data}
  <T.Group position={menuPosition} rotation={menuRotation}>
    <PlayButton bind:paused={isPaused} />
  </T.Group>
  <Beats notes={data.map._notes} currTime={time} />
{/if}
<Platform />

<T.AmbientLight />
<T.DirectionalLight />
