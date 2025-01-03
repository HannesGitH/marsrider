<script lang="ts">
  let { isLoading = $bindable(true) } = $props();

  import * as THREE from "three";
  import { T, useLoader, useTask } from "@threlte/core";
  import { Collider, RigidBody } from "@threlte/rapier";
  import type { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
  import { Controller, Hand, useXR } from "@threlte/xr";
  import { OBJLoader } from "three/examples/jsm/Addons.js";

  const { isHandTracking } = useXR();

  const { load: loadObj } = useLoader(OBJLoader);
  const textureLoader = useLoader(THREE.TextureLoader);

  let rigidBodyLeft: RapierRigidBody | undefined = $state(undefined);
  let rigidBodyRight: RapierRigidBody = $state(undefined!);

  let fistEnvMap = $state(null as null | THREE.Texture);
  const fistEnvMapAsync = textureLoader.load("/assets/img/weapon2.jpg");
  $effect(() => {
    fistEnvMapAsync.then((obj) => {
      obj.mapping = THREE.EquirectangularReflectionMapping;
      fistEnvMap = obj;
    });
  });

  $effect(() => {
    isLoading = !leftFist && !rightFist && !fistEnvMap;
  });

  const materials = $derived({
    left: new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.8,
      color: "blue",
      transparent: true,
      envMap: fistEnvMap,
      side: THREE.DoubleSide,
      opacity: 0.8,
    }),
    right: new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.8,
      color: "red",
      transparent: true,
      envMap: fistEnvMap,
      side: THREE.DoubleSide,
      opacity: 0.8,
    }),
  });

  // left fist
  let leftFistRaw = $state(null as null | THREE.Object3D);
  const leftFistRawAsync = loadObj("/assets/3d/left_fist.obj");
  $effect(() => {
    leftFistRawAsync.then((obj) => {
      leftFistRaw = obj;
    });
  });

  const leftFist = $derived(
    !leftFistRaw
      ? null
      : (leftFistRaw.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = materials.left;
          }
        }),
        leftFistRaw)
  );

  // right fist
  let rightFistRaw = $state(null as null | THREE.Object3D);
  const rightFistRawAsync = loadObj("/assets/3d/right_fist.obj");
  $effect(() => {
    rightFistRawAsync.then((obj) => {
      rightFistRaw = obj;
    });
  });

  const rightFist = $derived(
    !rightFistRaw
      ? null
      : (rightFistRaw.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = materials.right;
          }
        }),
        rightFistRaw)
  );

  const fists: { left: THREE.Mesh; right: THREE.Mesh } = {
    left: undefined!,
    right: undefined!,
  };
  // const handSabers: { left: THREE.Mesh; right: THREE.Mesh } = {
  //   left: undefined!,
  //   right: undefined!,
  // };

  const v3 = new THREE.Vector3();
  const q = new THREE.Quaternion();

  useTask(() => {
    // const left = isHandTracking.current ? handSabers.left : sabers.left;
    // const right = isHandTracking.current ? handSabers.right : sabers.right;

    const { left, right } = fists;

    // console.log(left, right);
    //TODO: make hitbox align
    if (left) {
      rigidBodyLeft?.setTranslation(left.getWorldPosition(v3), true);
      rigidBodyLeft?.setRotation(left.getWorldQuaternion(q), true);
    }

    if (right) {
      rigidBodyRight.setTranslation(right.getWorldPosition(v3), true);
      rigidBodyRight.setRotation(right.getWorldQuaternion(q), true);
    }
  });
  const fistCollisionRadius = .1;
</script>

<Controller left>
  {#if leftFist}
    <T.Mesh oncreate={( ref ) => {fists.left = ref;}}>
      <T is={leftFist} />
    </T.Mesh>
  {/if}
</Controller>

<Controller right>
  {#if rightFist}
    <T.Mesh oncreate={( ref ) => {fists.right = ref;}}>
      <T is={rightFist} />
    </T.Mesh>
  {/if}
</Controller>

<RigidBody type="kinematicPosition" bind:rigidBody={rigidBodyLeft}>
  <Collider shape="ball" args={[fistCollisionRadius]} />
</RigidBody>

<RigidBody type="kinematicPosition" bind:rigidBody={rigidBodyRight}>
  <Collider shape="ball" args={[fistCollisionRadius]} />
</RigidBody>

<!-- 
<Hand left>
  <T.Mesh
    slot="wrist"
    rotation.x={Math.PI / 2}
    position.z={-saberLength / 2}
    on:create={({ ref }) => (handSabers.left = ref)}
  >
    <T.CylinderGeometry args={[saberRadius, saberRadius, saberLength]} />
    <T.MeshStandardMaterial roughness={0} color="red" />
  </T.Mesh>
</Hand>

<Hand right>
  <T.Mesh
    slot="wrist"
    rotation.x={Math.PI / 2}
    position.z={-saberLength / 2}
    on:create={({ ref }) => (handSabers.right = ref)}
  >
    <T.CylinderGeometry args={[saberRadius, saberRadius, saberLength]} />
    <T.MeshPhongMaterial color="red" />
  </T.Mesh>
</Hand> -->
