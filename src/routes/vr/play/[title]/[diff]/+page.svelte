<script lang="ts">
  import Fists from "$lib/components/Fists.svelte";
  import { Controller, XR } from "@threlte/xr";
  import type { PageProps } from "./$types";
  import Beats from "$lib/components/Beats.svelte";
  import { T } from "@threlte/core";
  import Platform from "$lib/components/Platform.svelte";
  let { data }: PageProps = $props();
</script>

{#await data.data}
  loading
{:then data}
  <Beats notes={data.map._notes}/>
{/await}

<XR>
  <Fists />
</XR>
<Platform />

<T.AmbientLight />
<T.DirectionalLight />
