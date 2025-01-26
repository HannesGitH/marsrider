<script>
  import { T, useTask } from "@threlte/core";
  import { RoundedBoxGeometry } from "@threlte/extras";
  import { MeshStandardMaterial } from "three";
  import fragmentShader from "$lib/shader/loading/fragment.glsl?raw";
  import vertexShader from "$lib/shader/loading/vertex.glsl?raw";

  let val = $state(0.5);
  let spentTime = $state(0.5);
  useTask((delta) => {
    spentTime += delta;
    val = Math.sin(spentTime * 2) * 0.5 + 0.5;
  });
  const uniforms = {
    uColVal1: {
      value: 1,
    },
    uTime: {
      value: 0,
    },
  };
</script>

<T.Mesh position={[0, 0, 0]} rotation={[0, spentTime, 0]}>
  <T.TorusKnotGeometry args={[0.5, 0.1 * val + 0.1]} />
  <T.ShaderMaterial
    {fragmentShader}
    {vertexShader}
    {uniforms}
    uniforms.uColVal1.value={val}
    uniforms.uTime.value={spentTime}
  />
</T.Mesh>
