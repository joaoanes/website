<script>
  import { chunk } from "lodash";
  import Talk from "../components/Talk.svelte";
  export let store;
  const { talks } = store;
  const { preamble, rest } = talks;
</script>

<div class="skill-container">
  <div class="container column">
    <div class="top justify-start">
      <div class="left">
        <div
          class="linked-ctas center limit-width column container"
          id="extras">
          <span>Talks</span>
          <span class="preamble">{preamble}</span>
        </div>
      </div>
      <div class="right" />
    </div>
    {#each chunk(rest, 2) as [talk1, talk2]}
      <div class="bottom">
        <div class="left column justify-center align-center">
          <Talk talk={talk1} />
        </div>
        <div class="right align-center align-start skill-description-container">
          <Talk talk={talk2} />
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .skill-description-container {
    min-height: 200px;
  }

  .preamble {
    font-size: 20px;
    font-family: "SourceSansLight";
  }

  @media (max-width: 1280px) {
    .skill-container {
      margin-bottom: 20px;
    }
  }
</style>
