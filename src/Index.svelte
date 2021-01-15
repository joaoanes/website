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
<div class="header column">
  <div class="left align-center" />
  <div class="right align-center">
    <div class="container justify-end limit-width center">
      <a class="link" href="#skills">Skills</a>
      <a class="link" href="#roles">Roles</a>
    </div>
  </div>
  <div class="header-divider" />
</div>

<SkillPage {store} />

<div class="container">
  <div class="left">
    <span class="limit-width center roles" id="roles">Roles</span>
  </div>
</div>

{#each history as hist}
  <HistoryPanel history={hist} />
{/each}

<style>
  h1 {
    font-size: 80px;
  }

  .roles {
    font-size: 50px;
    margin-bottom: 75px;
  }

  .link {
    color: black;
    margin-left: 40px;
    font-size: 30px;
    font-weight: 400;
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

  .header-divider {
    width: 60%;
    background-color: black;
    height: 2px;
    margin-right: 50px;
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
    height: 80px;
    font-size: 40px;
    font-family: "CascadiaCode";
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    position: sticky;
    top: 0;
    color: black;
    background-color: rgba(255, 255, 255, 0.8);
    margin-bottom: 200px;
  }

  @media (max-width: 540px) {
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

    .roles {
      font-size: 30px;
      margin-bottom: 20px;
    }

    .header .container {
      flex-direction: row;
      align-items: flex-end;
    }

    .header .right {
      margin-bottom: 0px;
    }

    .header a {
      font-size: 20px;
      margin-bottom: 5px;
    }

    .quote {
      margin-top: 10px;
    }

    .subtitle {
      display: none;
    }

    .header-divider {
      margin-right: 35px;
    }
  }
</style>
