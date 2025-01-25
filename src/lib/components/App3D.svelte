<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { World, Debug } from "@threlte/rapier";
  import { ARButton, VRButton } from "@threlte/xr";
  const { debug = false, content }: { debug?: boolean; content: () => any } =
    $props();
</script>

<div>
  <Canvas>
    <World gravity={[0, 0, 0]}>
      {#if debug}
        <Debug />
      {/if}
      {@render content()}
    </World>
  </Canvas>
  <ARButton/>
</div>

<style>
  div {
    height: 100%;
  }
</style>
