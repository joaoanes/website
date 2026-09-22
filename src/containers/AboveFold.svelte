<script>
  import { onMount, onDestroy } from "svelte"
  import BackgroundBroker from "../components/BackgroundBroker.svelte"
  import AgentPanel from "../components/AgentPanel.svelte"
  import { createIncident, PHASE, SURFACE_FOR_PHASE } from "../lib/incident"
  // Live scene tuning. Compiled out entirely unless the build sets TUNE=1, and even then
  // only mounted with ?tune in the query string.
  import { SceneControls, TUNING_AVAILABLE } from "../components/tuning"

  export let dorkMode
  export let store
  export let headerElement = null

  const { name, title, subtitle, quote, description, lookingFor } = store

  const tuning =
    TUNING_AVAILABLE &&
    typeof window !== "undefined" &&
    window.location.search.includes("tune")
  let tunedOpacity = 0.26

  // Tuning jumps straight to the repaired surface; nobody wants to sit through the
  // incident on every reload while dragging sliders.
  const incident = createIncident({ enabled: !tuning })

  // The pointer host is the whole fold, not the canvas: the canvas sits behind the copy,
  // so events over the text would never reach it.
  let fold
  let statusbar

  // How far below the fold the scene has to reach for its bottom edge to land on the
  // header's bottom border: the status bar, then the header itself. Measured rather than
  // hardcoded because both change height at the mobile breakpoint, and offsetHeight is
  // used specifically because it is layout-based — the header is sticky, so anything
  // derived from its current on-screen position would be wrong the moment you scroll.
  let overhang = 0
  const measureOverhang = () => {
    overhang =
      (statusbar ? statusbar.offsetHeight : 0) +
      (headerElement ? headerElement.offsetHeight : 0)
  }

  onMount(() => {
    incident.start()
    measureOverhang()
    window.addEventListener("resize", measureOverhang)
    return () => window.removeEventListener("resize", measureOverhang)
  })
  onDestroy(incident.destroy)

  $: if (statusbar && headerElement) measureOverhang()

  $: surface = SURFACE_FOR_PHASE[$incident.phase]
  $: broken = $incident.phase === PHASE.glitch || $incident.phase === PHASE.patching
  $: fixed = $incident.phase === PHASE.fixed
  $: shaderLabel = fixed
    ? "shader: water.v2 — push it around!"
    : broken
    ? "shader: water.v1 — failing"
    : "shader: water.v1"
</script>

<div class="fold" bind:this={fold}>
  <div class="page-container above-fold">
    <div class="left align-center">
      <div class="name-container limit-width">
        <h1 class="name" class:jitter={$incident.hardGlitch}>{name}</h1>
        <span class="title">{title}</span>
        <div class="divider" />
        <h3 class="subtitle">{subtitle}</h3>
        {#if $incident.hardGlitch}
          <div class="fault">WebGL: vertex 137 resolved to NaN — surface lost</div>
        {/if}
      </div>
    </div>
    <div class="right align-center">
      <div class="name-container limit-width">
        <span class="quote">{quote}</span>
        <div class="description">
          {#each description as desc}<span>{desc}</span>{/each}
        </div>
        <span class="lookingFor">{lookingFor}</span>
      </div>
    </div>
  </div>

  {#if broken}
    <div class="scanlines" aria-hidden="true"><div class="beam" /></div>
  {/if}

  <div class="bg" style="bottom: {-overhang}px">
    <BackgroundBroker
      {dorkMode}
      {surface}
      host={fold}
      opacityOverride={tuning ? tunedOpacity : null} />
  </div>
</div>

<div class="statusbar" bind:this={statusbar}>
  <span>{shaderLabel}</span>
  <button type="button" class="replay" on:click={incident.replay}>replay incident</button>
</div>

{#if tuning}
  <svelte:component this={SceneControls} bind:opacity={tunedOpacity} />
{/if}

<AgentPanel
  phase={$incident.phase}
  panel={$incident.panel}
  typed={$incident.typed}
  log={$incident.log}
  onSkip={incident.skip} />

<style>
  /* Without this the absolutely positioned background resolves against the viewport and
     the water carries on rendering underneath the nav below the fold. */
  .fold {
    position: relative;
    /* Pushing the water is a drag gesture, and most of the fold is empty space where a
       drag should move water rather than lasso whitespace. The copy opts back in below,
       so anyone trying to select the bio still can. */
    user-select: none;
    -webkit-user-select: none;
  }

  .name,
  .title,
  .subtitle,
  .quote,
  .description,
  .lookingFor {
    user-select: text;
    -webkit-user-select: text;
  }

  /* Runs past the bottom of the fold, over the status bar and behind the header, so the
     scene's edge coincides with the header's bottom border instead of stopping short and
     leaving a white band. z-index 0 keeps it under both. */
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 0;
  }
  .above-fold {
    z-index: 100;
    position: relative;
  }

  h1 {
    font-size: 80px;
  }

  h3,
  h1 {
    margin: 0;
  }

  .quote {
    font-family: "Exo2Italic";
    font-weight: 300;
    margin-top: 85px;
    font-size: 24px;
  }

  h3 {
    font-weight: lighter;
  }

  .description {
    margin-top: 70px;
  }

  .title {
    font-size: 50px;
  }

  .name {
    font-size: 94px;
  }

  .lookingFor {
    margin-top: 20px;
  }

  .subtitle {
    margin-top: 40px;
    text-align: end;
    font-size: 20pt;
  }

  .name-container {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    flex-direction: column;
  }

  /* Only mounted while the surface is failing. A full-bleed blended layer left animating
     at zero opacity costs a composite every frame for nothing. */
  .scanlines {
    position: absolute;
    inset: 0;
    z-index: 50;
    pointer-events: none;
    overflow: hidden;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.11) 0 1px,
      rgba(0, 0, 0, 0) 1px 4px
    );
    mix-blend-mode: multiply;
  }

  .beam {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 14%;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.22) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    animation: hero-scan 1.4s linear infinite;
  }

  .jitter {
    animation: hero-jitter 0.18s steps(3) infinite;
  }

  .fault {
    margin-top: 16px;
    align-self: flex-start;
    font-size: 11px;
    letter-spacing: 0.06em;
    background: #f0e9d8;
    color: #0b0b0c;
    border: 1px solid currentColor;
    padding: 5px 8px;
  }

  .statusbar {
    position: relative;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 0 40px 40px;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0.55;
  }

  .replay {
    border: 0;
    border-bottom: 1px solid currentColor;
    background: transparent;
    padding: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }

  @keyframes hero-scan {
    from {
      transform: translateY(-120%);
    }
    to {
      transform: translateY(520%);
    }
  }

  @keyframes hero-jitter {
    0% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(-3px, 1px) skewX(-1.2deg);
    }
    40% {
      transform: translate(2px, -2px);
    }
    60% {
      transform: translate(-1px, 2px) skewX(0.8deg);
    }
    80% {
      transform: translate(3px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @media (max-width: 1280px) {
    .page-container {
      padding-bottom: 100px;
    }

    .name {
      margin-top: 30px;
      font-size: 40px;
    }

    .title {
      font-size: 23px;
    }

    .name-container * {
      margin-left: auto;
      margin-right: auto;
    }

    .subtitle {
      margin-top: 40px;
      text-align: end;
      font-size: 20px;
    }

    .description {
      font-size: 12px;
      margin-top: 20px;
      display: flex;
    }
    .description * {
      margin-left: 0;
      margin-right: 0;
    }

    .quote {
      margin-top: 10px;
    }

    .subtitle {
      display: none;
    }

    .statusbar {
      padding: 0 16px 24px;
      font-size: 9px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .beam,
    .jitter {
      animation: none;
    }
  }
</style>
