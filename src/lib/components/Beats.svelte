<script lang="ts">
  import { Vector3 } from "three";
  import { T } from "@threlte/core";
  import { InstancedMesh, Instance, RoundedBoxGeometry } from "@threlte/extras";
  import { Collider, RigidBody } from "@threlte/rapier";
  import type { Note } from "$lib/domain/beatSaver/parseZip";
  import { theme } from "$lib/utils/theme.svelte";

  const { notes }: { notes: Note[] } = $props();
  const speed = 3;
  const offsetZ = 0;

  type Block = {
    position: Vector3;
    color: string;
  };

  const lineWidth = 0.5;
  const numCubes = notes.length;

  const cubes: Block[] = $derived(
    notes.map((note) => {
      const color = note._type === 0 ? theme.left : theme.right; 
      const x = (note._lineIndex - 1) * lineWidth;
      const y = note._lineLayer * lineWidth;
      const z = note._time * speed;
      return {
        color,
        position: new Vector3(x, y, -z),
      };
    })
  );

  const boxRadius = 0.1 * lineWidth;
  const boxSize = 0.6 * lineWidth;
  const offsetY = 0.5;
</script>

<InstancedMesh limit={numCubes}>
  <RoundedBoxGeometry radius={boxRadius} args={[boxSize, boxSize, boxSize]} />
  <T.MeshStandardMaterial roughness={0} metalness={0.8} />

  {#each cubes as { position, color }, index (index)}
    <T.Group
      position.x={position.x}
      position.y={position.y + offsetY}
      position.z={position.z - offsetZ}
    >
      <RigidBody linearVelocity={[0, 0, speed]}>
        <Collider
          shape="cuboid"
          mass={0.5}
          args={[boxSize / 2, boxSize / 2, boxSize / 2]}
        />
        <Instance {color} />
      </RigidBody>
    </T.Group>
  {/each}
</InstancedMesh>
