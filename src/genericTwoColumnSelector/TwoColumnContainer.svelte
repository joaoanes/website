<script>
  export let title = "temp";
  export let preamble;
  export let id;
</script>

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

  .skill-column {
    margin-right: 20px;
  }

  .skill {
    margin: 0;
    padding: 0;
    text-align: start;
    cursor: pointer;
  }

  .selected {
    background-color: #d4d4d4;
  }

  @media (max-width: 540px) {
    .skill-column {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 10px;
    }

    .skill {
      padding: 2px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
</style>
