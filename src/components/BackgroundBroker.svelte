<script>
  import ThreeJsBackground from "./ThreeJSBackground.svelte";
  export let dorkMode;

  let allowed = true;
</script>

{#if allowed}
  <ThreeJsBackground {dorkMode} />
{/if}
