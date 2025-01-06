<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { World , Debug} from "@threlte/rapier";
  import { VRButton } from "@threlte/xr";
</script>

<div>
  <Canvas>
    <World gravity={[0, 0, 0]}>
      <Debug />
      <slot />
    </World>
  </Canvas>
  <VRButton />
</div>

<style>
  div {
    height: 100%;
  }
</style>
