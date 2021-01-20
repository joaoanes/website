<script>
  // export let store;
  import { store } from "./Store.svelte";
  const { name, title, subtitle, quote, description, lookingFor } = store;
</script>

<div class="page-container above-fold">
  <div class="left align-center">
    <div class="name-container limit-width">
      <h1 class="name">{name}</h1>
      <span class="title">{title}</span>
      <div class="divider" />
      <h3 class="subtitle">{subtitle}</h3>
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

<style>
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

  @media (max-width: 540px) {
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
    }

    .quote {
      margin-top: 10px;
    }

    .subtitle {
      display: none;
    }
  }
</style>
