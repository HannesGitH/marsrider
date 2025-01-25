<script lang="ts">
  import Fists from "$lib/components/Fists.svelte";
  import { Controller, XR } from "@threlte/xr";
  import type { PageProps } from "./$types";
  import Beats from "$lib/components/Beats.svelte";
  import { T } from "@threlte/core";
  let { data }: PageProps = $props();
</script>

{#await data.data}
  loading
{:then data}
  {#each data.map._notes as note}
    {note._type}
  {/each}
{/await}

<XR>
  <Fists></Fists>
  <Beats></Beats>
  <Controller left />
</XR>

<T.AmbientLight />
<T.DirectionalLight />
