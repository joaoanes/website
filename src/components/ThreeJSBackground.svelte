<script>
  import { afterUpdate } from "svelte";
  import { createScene, uniforms } from "../lib/scene";
  export let dorkMode;

  let el;

  afterUpdate(() => {
    createScene(el, dorkMode);
  });
</script>

<canvas bind:this={el} />

<style>
  canvas {
    width: 100%;
    height: 100%;
    opacity: 0.15;
  }
</style>
