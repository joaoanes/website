<script>
  // TEMPORARY. A live tuning panel for the water scene, shown only when the page is
  // loaded with ?tune in the query string, so it can sit in the tree without ever
  // reaching a real visitor. Delete this component and its two lines in AboveFold once
  // the values are locked in.
  import { sceneTuning, applySceneTuning } from "../lib/scene"

  export let onChange = applySceneTuning
  export let opacity = 0.26

  // [path, label, min, max, step]. Paths are into sceneTuning.
  const GROUPS = [
    {
      name: "camera",
      fields: [
        ["camera.pitch", "tilt below level", 0, 0.8, 0.005],
        ["camera.yaw", "yaw", -1.2, 1.2, 0.01],
        ["camera.roll", "roll", -0.3, 0.3, 0.005],
        ["camera.fov", "field of view", 25, 95, 1],
        ["camera.eyeHeight", "eye height", 0.3, 60, 0.1],
        ["camera.back", "pull back (m)", -10, 150, 0.5]
      ]
    },
    {
      name: "shore",
      fields: [
        ["shore.depth", "waterline distance", 0.8, 14, 0.1],
        ["shore.blend", "sand blend", 0.2, 20, 0.2],
        ["shore.curve", "base curve", 0, 3, 0.02],
        ["shore.headlandRise", "smirk rise", 0, 8, 0.05],
        ["shore.headlandAt", "smirk position", -20, 20, 0.5],
        ["shore.headlandWidth", "smirk width", 1, 20, 0.5]
      ]
    },
    {
      name: "seabed",
      fields: [
        ["shore.slope", "beach slope", 0.01, 0.3, 0.005],
        ["shore.barHeight", "sandbar height", 0, 3, 0.05],
        ["shore.barDistance", "sandbar distance", 2, 80, 1],
        ["shore.barWidth", "sandbar width", 2, 40, 0.5],
        ["shore.depthRef", "shoaling depth", 0.2, 8, 0.1],
        ["shore.shoalMax", "rear-up max", 1, 8, 0.1],
        ["shore.shoalPower", "rear-up rate", 0.1, 1.5, 0.05]
      ]
    },
    {
      name: "wave",
      fields: [
        ["wave.periodMs", "period (ms)", 2000, 20000, 250],
        ["wave.start", "born at", 20, 300, 5],
        ["wave.thickness", "crest thickness (m)", 3, 50, 0.5],
        ["wave.height", "crest height", 0, 4, 0.05],
        ["wave.breakerIndex", "breaker index", 0.2, 1.6, 0.02],
        ["wave.runout", "runout up sand", -20, 0, 0.5],
        ["wave.swashReach", "swash reach (m)", 0, 10, 0.1],
        ["wave.swashStart", "swash timing", 0.3, 0.95, 0.01],
        ["wave.backwashHeight", "backwash (m)", -3, 3, 0.05],
        ["wave.backwashStart", "backwash timing", 0.4, 0.98, 0.01],
        ["wave.backwashThickness", "backwash thick (m)", 2, 30, 0.5],
        ["wave.backwashOffset", "backwash start (m)", 0, 30, 0.5],
        ["wave.backwashReach", "backwash reach (m)", 5, 300, 5]
      ]
    },
    {
      name: "water",
      fields: [
        ["water.horizon", "see distance (m)", 30, 2500, 10],
        ["water.gridSize", "grid square (m)", 0.4, 20, 0.1],
        ["water.near", "near plane", 0.3, 8, 0.1],
        ["swell.height", "swell scale", 0, 3, 0.05],
        ["swell.chop", "surface texture", 0, 0.4, 0.005],
        ["swell.pointer", "pointer strength", 0, 6, 0.1]
      ]
    }
  ]

  const read = (path) => path.split(".").reduce((node, key) => node[key], sceneTuning)

  const write = (path, value) => {
    const keys = path.split(".")
    const last = keys.pop()
    keys.reduce((node, key) => node[key], sceneTuning)[last] = value
    onChange()
    // sceneTuning is mutated in place, so Svelte needs telling that it changed.
    values = values
  }

  // Mirrors the live values so the number readouts update.
  let values = Object.fromEntries(
    GROUPS.flatMap(({ fields }) => fields.map(([path]) => [path, read(path)]))
  )

  let collapsed = false
  let copied = false

  const round = (n) => Math.round(n * 10000) / 10000

  const snapshot = () =>
    JSON.stringify(
      {
        camera: { ...sceneTuning.camera },
        // far, fogDensity and spread are all derived at resize.
        water: {
          near: sceneTuning.water.near,
          nearHalfWidth: sceneTuning.water.nearHalfWidth,
          horizon: sceneTuning.water.horizon,
          gridSize: sceneTuning.water.gridSize
        },
        shore: { ...sceneTuning.shore },
        wave: { ...sceneTuning.wave },
        swell: { ...sceneTuning.swell },
        canvasOpacity: opacity
      },
      (key, value) => (typeof value === "number" ? round(value) : value),
      2
    )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snapshot())
      copied = true
      setTimeout(() => (copied = false), 1400)
    } catch (err) {
      console.log(snapshot())
      copied = true
      setTimeout(() => (copied = false), 1400)
    }
  }
</script>

<div class="panel" class:collapsed>
  <div class="bar">
    <span>scene tuning</span>
    <div class="actions">
      <button type="button" on:click={copy}>{copied ? "copied" : "copy"}</button>
      <button type="button" on:click={() => (collapsed = !collapsed)}>
        {collapsed ? "+" : "−"}
      </button>
    </div>
  </div>

  {#if !collapsed}
    <div class="body">
      <div class="group">
        <div class="group-name">canvas</div>
        <label>
          <span class="field">opacity</span>
          <input type="range" min="0" max="1" step="0.01" bind:value={opacity} />
          <span class="value">{round(opacity)}</span>
        </label>
      </div>

      {#each GROUPS as group (group.name)}
        <div class="group">
          <div class="group-name">{group.name}</div>
          {#each group.fields as [path, label, min, max, step] (path)}
            <label>
              <span class="field">{label}</span>
              <input
                type="range"
                {min}
                {max}
                {step}
                value={values[path]}
                on:input={(e) => {
                  values[path] = Number(e.target.value)
                  write(path, values[path])
                }} />
              <span class="value">{round(values[path])}</span>
            </label>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .panel {
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 200;
    width: 310px;
    max-height: calc(100vh - 24px);
    display: flex;
    flex-direction: column;
    background: #0b0b0c;
    color: #ededea;
    border: 1px solid #0b0b0c;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
    font-family: "CascadiaCode", ui-monospace, monospace;
    font-size: 10px;
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 9px;
    border-bottom: 1px solid #27272b;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    flex: 0 0 auto;
  }

  .actions {
    display: flex;
    gap: 6px;
  }

  button {
    border: 1px solid #3a3a3f;
    background: transparent;
    color: #ededea;
    font: inherit;
    padding: 2px 7px;
    cursor: pointer;
  }

  button:hover {
    background: #27272b;
  }

  .body {
    overflow-y: auto;
    padding: 4px 9px 9px;
  }

  .group-name {
    margin: 9px 0 4px;
    color: #77777a;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  label {
    display: grid;
    grid-template-columns: 96px 1fr 44px;
    align-items: center;
    gap: 7px;
    padding: 1px 0;
  }

  .field {
    color: #bdbdba;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .value {
    text-align: right;
    color: #ededea;
  }

  input[type="range"] {
    width: 100%;
    accent-color: #ededea;
    height: 14px;
  }
</style>
