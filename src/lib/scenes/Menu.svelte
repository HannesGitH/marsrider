<script lang="ts">
  import { XR, Controller, Hand } from "@threlte/xr";
  import { T } from "@threlte/core";
  import { pointerControls } from "@threlte/xr";
  import { HTML } from "@threlte/extras";
  pointerControls("right");
</script>

<XR>
  <Controller right />
</XR>
<T.Mesh position={[0, 0, -2]}>
  <HTML transform occlude>
    <div
      style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center;"
    >
      <a style="font-size: 2em; color: white;" href="/vr/game">Start</a>
    </div>
  </HTML>
</T.Mesh>

<T.AmbientLight />
<T.DirectionalLight />
