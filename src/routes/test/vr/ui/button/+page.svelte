<script>
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
import MyController from "$lib/components/MyController.svelte";
  import PlayButton from "$lib/components/PlayButton.svelte";
  import { T } from "@threlte/core";
  import { XR } from "@threlte/xr";
  import { AmbientLight } from "three";
</script>

<XR>
  <MyController />
</XR>
<LoadingIndicator />

<T.AmbientLight />
<T.DirectionalLight />
