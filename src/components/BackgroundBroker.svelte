<script>
  import { onMount } from "svelte";
  import { getGPUTier } from "detect-gpu";
  export let dorkMode;

  let LoadedComponent = null;
  onMount(async () => {
    setTimeout(async () => {
      const gpuTier = await getGPUTier();
      if (gpuTier.tier >= 1) {
        LoadedComponent = (await import("./ThreeJSBackground.svelte")).default;
      }
    }, 200);
  });
</script>

<div class="loader" style="opacity: {LoadedComponent ? 1 : 0}">
  {#if LoadedComponent}
    <svelte:component this={LoadedComponent} {dorkMode} />
  {/if}
</div>

<style>
  .loader {
    transition: opacity 3s;
  }
</style>
