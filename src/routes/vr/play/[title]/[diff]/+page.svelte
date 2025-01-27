<script lang="ts">
  export const ssr = false; 
  import * as EXTRA from "@threlte/extras";
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
  import { Tween } from "svelte/motion";
  import { quadInOut } from "svelte/easing";
  import { Audio } from "three";
  import { createSoundWithBuffer, MyAudio } from "$lib/utils/audio";
  let { data: fullData }: PageProps = $props();
  const { data: promisedData, title } = fullData;

  let loading = $state(true);
  let isPaused = $state(true);
  let data = $state(null as null | ZipData);
  let time = $state(0);

  let audio: MyAudio;

  promisedData.then(async (d) => {
    data = d;
    audio = await createSoundWithBuffer(d.soundTrack);
    loading = false;
  });

  const onPausePressed = async () => {
    if (!audio) return;
    const playing = await audio.togglePlayPause({ shouldPause: !isPaused });
    isPaused = !playing;
  };

  useTask((delta) => {
    if (!isPaused) time += delta;
  });

  const menuPositionTween = new Tween([0, 1, -1], {
    duration: 200,
    easing: quadInOut,
  });
  const menuRotationTween = new Tween([0, 0, 0], {
    duration: 300,
    easing: quadInOut,
  });

  $effect(() => {
    menuPositionTween.set(isPaused ? [0, 1, -1] : [-2, 1, -2]);
    menuRotationTween.set(isPaused ? [0, 0, 0] : [0, 1 / 2, 0]);
  });

  const menuPosition = $derived(
    menuPositionTween.current as [x: number, y: number, z: number]
  );
  const menuRotation = $derived(
    menuRotationTween.current as [x: number, y: number, z: number]
  );
</script>

{#if loading}
  <EXTRA.Text text={title} position={[0, 0.3, 0]} anchorX="center" />
  <LoadingIndicator />
{/if}
<XR>
  <MyController hidden={!isPaused} />
  <Fists />
</XR>
{#if data}
  <T.Group position={menuPosition} rotation={menuRotation}>
    <EXTRA.Text text={title} position={[0, 0.3, 0]} anchorX="center" />
    <PlayButton paused={isPaused} onPressed={onPausePressed} />
  </T.Group>
  <Beats
    notes={data.map._notes}
    currTime={(time * data.bpm) / 60 - data.beatOffset}
  />
{/if}
<Platform />

<T.AmbientLight />
<T.DirectionalLight />
