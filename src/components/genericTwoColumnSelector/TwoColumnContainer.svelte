<script>
  export let title;
  export let preamble;
  export let id;
</script>

<!-- TODO -->
<!-- Without this weird hack, we get a "unexpected slot default" warning-->
<!-- https://github.com/sveltejs/svelte/issues/4546#issuecomment-749901403 -->
{#if false}
  <slot />
{/if}
<!-- Way to go, svelte. -->

<div>
  <div class="container column">
    <div class="top justify-start">
      <div class="left">
        <div class="linked-ctas center limit-width column container" {id}>
          <span>{title}</span>
          {#if preamble}<span class="preamble">{preamble}</span>{/if}
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left column justify-center align-center">
        <div class="container center limit-width">
          <slot name="left" />
        </div>
      </div>
      <div class="right align-center align-start right-container">
        <slot name="right" />
      </div>
    </div>
  </div>
</div>

<style>
  .right-container {
    min-height: 200px;
  }

  .preamble {
    font-size: 20px;
    font-family: "SourceSansLight";
  }
</style>
