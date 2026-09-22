<script>
  import { onMount } from "svelte"
  import { getGPUTier } from "detect-gpu"

  export let dorkMode = false
  export let surface = "legacy"
  export let host = null
  export let opacityOverride = null

  let LoadedComponent = null
  let tier = 3

  // Deferred so GPU detection and the WebGL bundle never compete with first paint; the
  // detected tier then decides how much simulation the machine gets asked for.
  onMount(() => {
    const timer = setTimeout(async () => {
      const detected = await getGPUTier()
      if (detected.tier < 1) return
      tier = detected.tier
      LoadedComponent = (await import("./WaterBackground.svelte")).default
    }, 200)

    return () => clearTimeout(timer)
  })
</script>

<div class="loader" style="opacity: {LoadedComponent ? 1 : 0}">
  {#if LoadedComponent}
    <svelte:component
      this={LoadedComponent}
      {dorkMode}
      {surface}
      {host}
      {tier}
      {opacityOverride} />
  {/if}
</div>

<style>
  .loader {
    width: 100%;
    height: 100%;
    transition: opacity 3s;
  }
</style>
