<script>
  import { chunk } from "lodash"
  export let store

  const { interests } = store
  const { preamble, rest } = interests
  const [interests1, interests2] = chunk(rest, Math.floor(rest.length / 2))
</script>

<div class="skill-container">
  <div class="container column">
    <div class="top justify-start">
      <div class="left">
        <div class="linked-ctas center column container limit-width">
          <span>Interests</span>
          <span class="preamble">{preamble}</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left column justify-center align-center">
        {#each interests1 as interest}
          <div class="interest">{interest}</div>
        {/each}
      </div>
      <div class="right column justify-center align-center">
        {#each interests2 as interest}
          <div class="interest">{interest}</div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .interest {
    margin: 5px;
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
