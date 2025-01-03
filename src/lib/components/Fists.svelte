<script lang="ts">
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

  const fistEnvMap_ = textureLoader.load("/assets/img/weapon2.jpg");
  const fistEnvMap = $derived(
    fistEnvMap_.then((obj) => {
      obj.mapping = THREE.EquirectangularReflectionMapping;
      return obj;
    })
  );

  $effect(() => {
    materials.then((p) => {
      console.log(p.left);
    });
  });

  const materials = $derived(
    fistEnvMap.then((envMap) => {
      return {
        left: new THREE.MeshStandardMaterial({
          roughness: 0.3,
          metalness: 0.8,
          color: "blue",
          transparent: true,
          envMap: envMap,
          // map: envMap,
        }),
      };
    })
  );

  const leftFistRaw = loadObj("/assets/3d/left_fist.obj");

  const leftFist = $derived(
    (async()=>{
      const mat = (await materials).left;
      // if (!mat) return;
      const obj = await leftFistRaw;
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = mat;
        }
      });
      return obj;
    })()
  );

  const fists: { left: THREE.Mesh; right: THREE.Mesh } = $state({
    left: undefined!,
    right: undefined!,
  });
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

    if (left) {
      rigidBodyLeft?.setTranslation(left.getWorldPosition(v3), true);
      rigidBodyLeft?.setRotation(left.getWorldQuaternion(q), true);
    }

    if (right) {
      rigidBodyRight.setTranslation(right.getWorldPosition(v3), true);
      rigidBodyRight.setRotation(right.getWorldQuaternion(q), true);
    }
  });

  const saberRadius = 0.02;
  const saberLength = 1.4;
</script>

<Controller left>
  {#await leftFist then lf}
    <T.Mesh on:create={({ ref }) => (fists.left = ref)}>
      <T is={lf} />
    </T.Mesh>
  {/await}
</Controller>

<Controller right>
  <T.Mesh
    rotation.x={Math.PI / 2}
    position.z={-saberLength / 2}
    on:create={({ ref }) => (fists.right = ref)}
  >
    <T.CylinderGeometry args={[saberRadius, saberRadius, saberLength]} />
    <T.MeshStandardMaterial roughness={0} color="red" />
  </T.Mesh>
</Controller>

<RigidBody type="kinematicPosition" bind:rigidBody={rigidBodyLeft}>
  <Collider shape="capsule" args={[saberLength / 2, saberRadius]} />
</RigidBody>

<RigidBody type="kinematicPosition" bind:rigidBody={rigidBodyRight}>
  <Collider shape="capsule" args={[saberLength / 2, saberRadius]} />
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
