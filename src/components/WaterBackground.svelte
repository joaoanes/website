<script>
  import { onMount, onDestroy } from "svelte"
  import { createScene } from "../lib/scene"

  export let dorkMode = false
  export let surface = "legacy"
  export let tier = 3
  // The hero region, not the canvas: the canvas sits behind the copy, so pointer events
  // over the text would never reach it.
  export let host = null
  export let opacityOverride = null

  let canvas
  let scene = null
  let mounted = false
  let failed = false

  const boot = () => {
    const [error, created] = createScene({ canvas, host, dorkMode, tier })
    if (error) {
      failed = true
      console.warn(`water scene unavailable: ${error}`)
      return
    }
    scene = created
    if (scene.simulationError) {
      console.warn(`water simulation unavailable, keeping legacy surface: ${scene.simulationError}`)
    }
  }

  onMount(() => {
    mounted = true
  })

  onDestroy(() => {
    if (scene) scene.destroy()
    scene = null
  })

  // Boots once both the canvas and the hero element exist, whichever lands last.
  $: if (mounted && canvas && host && !scene && !failed) boot()
  $: if (scene) scene.setDorkMode(dorkMode)
  $: if (scene) scene.setPhase(surface)

  // The repaired surface earns a shade more presence than the one that was failing, but
  // this is still a background: 0.15 is what the site has always used.
  const OPACITY = { legacy: 0.15, glitch: 0.3, fixed: 0.25 }
  $: opacity = opacityOverride ?? OPACITY[surface] ?? 0.15
</script>

<canvas bind:this={canvas} aria-hidden="true" style="opacity: {opacity}" />

<style>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    transition: opacity 0.7s ease;
  }
</style>
