<script>
  export let talk;

  const { name, description, link, image, presentation } = talk;
</script>

<div class="skills-container container center limit-width">
  <div class="column container talk-column align-start justify-start">
    <div class="name">{name}</div>
    <div class="description">{description}</div>
    {#if presentation}
      <a class="presentation" href={presentation}>Presentation link +</a>
    {/if}
    {#if link}<a class="link" href={link}>Slides/info</a>{/if}
  </div>
</div>

<style>
  .name {
    font-size: 30px;
  }

  .description {
    font-family: "Exo2Italic";
  }

  .link {
    margin-top: 10px;
  }

  .presentation {
    margin-top: 10px;
  }

  .skills-container {
    min-height: 300px;
  }

  @media (max-width: 1280px) {
    .talk-column {
      flex-wrap: wrap;
      margin-bottom: 10px;
    }

    .name {
      font-size: 20px;
    }
  }
</style>
