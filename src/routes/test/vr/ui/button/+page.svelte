<script>
  import MyController from "$lib/components/MyController.svelte";
  import PlayButton from "$lib/components/PlayButton.svelte";
  import { XR } from "@threlte/xr";
</script>

<XR>
  <MyController />
</XR>
<PlayButton />
