<script>
  import { T } from "@threlte/core";
  import { Controller } from "@threlte/xr";
  let { hidden = false } = $props();
</script>

<Controller right>
  {#snippet pointerRay()}
    {#if !hidden}
      <T.Mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.95]}>
        <T.CylinderGeometry args={[0.001, 0.0001, 2]} />
        <T.MeshStandardMaterial color="white" opacity={0.5} />
      </T.Mesh>
    {/if}
  {/snippet}

  {#snippet pointerCursor()}
    <T.Group position={[0, 0, 0.0001]}>
      <T.Mesh>
        <T.RingGeometry args={[0.007, 0.01]} />
        <T.MeshStandardMaterial color="white" opacity={0.6} />
      </T.Mesh>
    </T.Group>
  {/snippet}
  {#if hidden}
    <T.Mesh></T.Mesh>
  {/if}
</Controller>
