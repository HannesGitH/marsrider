<script lang="ts">
  import { T } from "@threlte/core";
  import { pointerControls } from "@threlte/xr";
  import { Root, Container, Text, Content } from "threlte-uikit";
  let { paused = $bindable(true), onPressed } : {paused: boolean, onPressed: () => void } = $props();

  pointerControls("right");
  const text = $derived((paused ? "Play" : "Pause").toUpperCase());

  let hover = $state(false);
  let active = $state(false);
  const zOffset = $derived(0 + (hover ? 0.01 : 0) + (active ? -0.04 : 0));
 
  // for some reason the click event gets fired twice
  let wasClicked = false;
  const onclick = () => {
    wasClicked = !wasClicked;
    if (wasClicked) return;
    paused = !paused; 
    onPressed(); 
  };
</script>

<T.Group position={[0, 0, 0 + zOffset]}>
  <Root>
    <Container
      backgroundColor="#030"
      borderBend={10}
      padding={3}
      hover={{ backgroundColor: "#032" }}
      active={{ backgroundColor: "#141" }}
      borderRadius={3}
      onHoverChange={(h) => (hover = h)}
      onActiveChange={(a) => (active = a)}
      onclick={onclick}
    >
      <Text text={text} color="white" fontSize={5} />
    </Container>
  </Root>
</T.Group>

<T.AmbientLight />
<T.DirectionalLight />
