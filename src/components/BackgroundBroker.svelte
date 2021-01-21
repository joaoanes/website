<script>
  import { onMount } from "svelte";
  import { getGPUTier } from "detect-gpu";
  import ThreeJsBackground from "./ThreeJSBackground.svelte";
  export let dorkMode;

  let allowed = false;
  onMount(async () => {
    setTimeout(async () => {
      const gpuTier = await getGPUTier();
      allowed = gpuTier.tier >= 2;
    }, 1000);
  });
</script>

<div class="loader" style="opacity: {allowed ? 1 : 0}">
  {#if allowed}
    <ThreeJsBackground {dorkMode} />
  {/if}
</div>

<style>
  .loader {
    transition: opacity 3s;
  }
</style>
