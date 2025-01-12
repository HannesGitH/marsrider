<script lang="ts">
  import { XR, Controller, Hand, pointerControls } from "@threlte/xr";
  import { T } from "@threlte/core";
  import { HTML } from "@threlte/extras";
  pointerControls("right");
</script>

<XR foveation={0.3}>
  <Controller right />
</XR>

<T.Mesh position={[0, 0, 0]}>
  <HTML
  transform
  >
    <div>
      <a style="font-size: 2em; color: white;" href="/vr/game">Start</a>
    </div>
  </HTML>
</T.Mesh>

<T.AmbientLight />
<T.DirectionalLight />
