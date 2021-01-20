<script>
  export let store;
  const { personalWork } = store;
  const { preamble, rest } = personalWork;
</script>

<div class="skill-container">
  <div class="container column">
    <div class="top justify-start">
      <div class="left">
        <div class="linked-ctas center column container limit-width">
          <span>Personal work</span>
          <span class="preamble">{preamble}</span>
        </div>
      </div>
    </div>
    {#each rest as { name, description, source, link, blurbs, negs }}
      <div class="bottom work">
        <div class="left column justify-start limit-width center align-start">
          <div class="name">{name}</div>
          <div class="description">{description}</div>
          <a class="source" href={source}>Source</a>
          {#if link}<a class="link" href={link}>Link</a>{/if}
        </div>
        <div
          class="right align-center align-start column
            skill-description-container">
          <div class="blurbs">
            {#each blurbs as blurb}
              <div class="blurb">{blurb}</div>
            {/each}
          </div>
          <div class="negs">
            {#each negs as neg}
              <div class="blurb neg">{neg}</div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .work {
    margin-bottom: 50px;
  }
  .skill-description-container {
    min-height: 200px;
  }

  .description {
    font-family: "Exo2Italic";
    font-size: 30px;
  }

  .name {
    font-size: 40px;
  }

  .blurb {
    font-family: "SourceSansLight";
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .source {
    margin-top: 50px;
  }

  .neg {
    color: rgb(163, 13, 15);
  }

  .preamble {
    font-size: 20px;
    font-family: "SourceSansLight";
  }

  @media (max-width: 540px) {
    .skill-container {
      margin-bottom: 20px;
    }
  }
</style>
