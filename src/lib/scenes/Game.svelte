<script lang="ts">
  import { XR, Controller, Hand } from "@threlte/xr";
  import { T } from "@threlte/core";
  import Fists from "../components/Fists.svelte";
  import Beats from "../components/Beats.svelte";
</script>

<XR>
  <Fists></Fists>
  <Beats></Beats>
  <Controller left/>
</XR>

<T.AmbientLight />
<T.DirectionalLight />
