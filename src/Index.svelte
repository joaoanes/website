<script>
  import PageContainer from "./PageContainer.svelte";
  import HistoryPanel from "./HistoryPanel.svelte";
  import SkillPage from "./SkillPage.svelte";
  // export let store;
  import { store } from "./Store.svelte";
  const {
    name,
    title,
    subtitle,
    quote,
    description,
    lookingFor,
    history,
  } = store;
</script>

<style>
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

  .divider {
    height: 2px;
    width: 100%;
    background-color: black;
    margin-top: 40px;
  }

  .header {
    width: 100%;
    height: 60px;
    font-size: 40px;
    font-family: "CascadiaCode";
    display: flex;
    justify-content: center;
    background: repeating-linear-gradient(
      45deg,
      rgba(253, 229, 8, 0.4),
      rgba(253, 229, 8, 0.4),
      10px,
      rgba(0, 0, 0, 0.3) 10px,
      rgba(0, 0, 0, 0.3) 20px
    );
    position: sticky;
    top: 0;
    color: black;
    transform: translateY(20px);
  }
</style>

<div class="header">Under construction</div>
<PageContainer>
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
</PageContainer>

<SkillPage {store} />

{#each history as hist}
  <HistoryPanel history={hist} />
{/each}
