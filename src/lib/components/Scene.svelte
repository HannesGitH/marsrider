<script lang="ts">
  import { XR, Controller, Hand } from "@threlte/xr";
  import { T } from "@threlte/core";
  import Fists from "./Fists.svelte";
</script>

<XR>
  <Fists></Fists>
  <Controller left/>
</XR>

<T.AmbientLight />
<T.DirectionalLight />
