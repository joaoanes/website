<script>
  import { PHASE } from "../lib/incident"

  export let phase = PHASE.legacy
  export let panel = false
  export let typed = ""
  export let log = []
  export let onSkip = () => {}

  $: fixed = phase === PHASE.fixed
  $: status = fixed ? "resolved" : phase === PHASE.patching ? "patching" : "incident"
  $: caretVisible = !fixed && phase !== PHASE.patching
</script>

<div class="panel" class:open={panel} aria-live="polite">
  <div class="frame">
    <div class="titlebar">
      <div class="identity">
        <span class="beacon" />
        <span>agent</span>
        <span class="muted">· water-sim</span>
      </div>
      <span class="status">{status}</span>
    </div>

    <div class="log">
      {#each log as line (line.key)}
        <div class="line">
          <span class="mark">{line.mark}</span>
          <span class="text">{line.text}</span>
        </div>
      {/each}
    </div>

    {#if fixed}
      <div class="diff">
        <div class="removed">- z + zOff * (sin(d)*sin(x) + cos(d)*cos(y))</div>
        <div class="added">+ h = 2h - h' + C*laplacian(h), impulse along drag</div>
      </div>
    {/if}

    <div class="prompt">
      <span class="mark">&gt;</span>
      <span class="typed">{typed}</span>
      {#if caretVisible}<span class="caret" />{/if}
    </div>

    <button class="skip" type="button" on:click={onSkip}>
      <span>once per session</span>
      <span>skip →</span>
    </button>
  </div>
</div>

<style>
  .panel {
    position: fixed;
    right: 20px;
    bottom: 20px;
    /* Above the fold's status bar, which is z-index 100 and shares this bottom-right
       corner — otherwise "replay incident" prints straight through the panel. */
    z-index: 120;
    width: min(430px, calc(100vw - 32px));
    transform: translateY(130%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.55s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.4s ease;
  }

  .panel.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .frame {
    background: #0b0b0c;
    color: #ededea;
    border: 1px solid #0b0b0c;
    box-shadow: 0 22px 44px rgba(0, 0, 0, 0.3);
    font-family: "CascadiaCode", ui-monospace, monospace;
    font-size: 12px;
    line-height: 1.55;
  }

  /* On the light page the border matches the fill and the drop shadow does the
     separating. In dork mode the page is black too, so without an edge of its own the
     panel stops reading as a card and just floats. */
  :global(.dork-mode) .frame {
    border-color: #3f3f45;
  }

  .titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    border-bottom: 1px solid #27272b;
  }

  .identity {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .beacon {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ededea;
    animation: panel-pulse 1.4s ease-in-out infinite;
  }

  .muted {
    color: #77777a;
  }

  .status {
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #9a9a9d;
  }

  .log {
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 86px;
  }

  .line {
    display: flex;
    gap: 9px;
    align-items: baseline;
  }

  .mark {
    color: #77777a;
    flex: 0 0 auto;
  }

  .text {
    color: #dcdcd8;
  }

  .diff {
    padding: 9px 12px;
    border-top: 1px solid #27272b;
    font-size: 10.5px;
    line-height: 1.8;
    white-space: nowrap;
    overflow: hidden;
  }

  .removed {
    color: #7a7a7d;
    text-decoration: line-through;
  }

  .added {
    color: #ededea;
  }

  .prompt {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 12px;
    border-top: 1px solid #27272b;
  }

  .typed {
    color: #ffffff;
  }

  .caret {
    width: 7px;
    height: 14px;
    background: #ffffff;
    animation: panel-blink 1s steps(1) infinite;
  }

  .skip {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    border: 0;
    border-top: 1px solid #27272b;
    background: transparent;
    font: inherit;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #77777a;
    cursor: pointer;
  }

  .skip:hover {
    color: #ededea;
  }

  @keyframes panel-pulse {
    0%,
    100% {
      opacity: 0.35;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes panel-blink {
    0%,
    48% {
      opacity: 1;
    }
    49%,
    100% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none;
    }
    .beacon,
    .caret {
      animation: none;
    }
  }

  @media (max-width: 720px) {
    .panel {
      right: 12px;
      bottom: 12px;
    }
  }
</style>
