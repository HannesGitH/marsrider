<script lang="ts">
  import { XR, Controller, Hand } from "@threlte/xr";
  import { T } from "@threlte/core";
  import Fists from "./Fists.svelte";
  import Beats from "./Beats.svelte";
</script>

<XR>
  <Fists></Fists>
  <Beats></Beats>
  <Controller left/>
</XR>

<T.AmbientLight />
<T.DirectionalLight />
