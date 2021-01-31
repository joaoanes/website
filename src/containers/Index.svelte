<script>
  import AboveFold from "./AboveFold.svelte"
  import Header from "./Header.svelte"
  import HistoryPanel from "./HistoryPanel.svelte"
  import SkillPage from "./SkillPage.svelte"
  import ToolingPage from "./ToolingPage.svelte"
  import TalksPage from "./TalksPage.svelte"
  import PersonalWorkPage from "./PersonalWorkPage.svelte"
  import InterestsPage from "./InterestsPage.svelte"
  import CvPage from "./CVPage.svelte"

  export let store

  const { history } = store
  let dorkMode = false

  let toggleDorkMode = () => (dorkMode = !dorkMode)
</script>

<div class="name-container">
  <div class="toggler container align-end">
    <img
      on:click={toggleDorkMode}
      alt={'Toggle dark mode'}
      class="name dork-mode-toggler link with-cursor"
      width="50"
      height="50"
      style="display: {dorkMode ? 'block' : 'none'}"
      src="./sun.svg" />
    <img
      on:click={toggleDorkMode}
      alt={'Toggle dark mode'}
      class="name dork-mode-toggler link with-cursor"
      width="50"
      height="50"
      style="display: {dorkMode ? 'none' : 'block'}"
      src="./moon.svg" />
  </div>
</div>

<div class={dorkMode ? 'dork-mode' : ''}>
  <AboveFold {store} {dorkMode} />

  <Header />

  <SkillPage {store} />

  <div class="container">
    <div class="left">
      <span class="limit-width center linked-ctas" id="roles">Roles</span>
    </div>
  </div>

  {#each history as hist}
    <HistoryPanel history={hist} />
  {/each}

  <TalksPage {store} />

  <ToolingPage {store} />
  <PersonalWorkPage {store} />
  <InterestsPage {store} />
  <CvPage {store} />
</div>

<style>
  img {
    width: 50px;
    height: 50px;
    margin-right: 40px;
    margin-top: 10px;
  }

  .name-container {
    position: fixed;
    z-index: 10000;
  }
  .toggler {
    position: fixed;
    top: 5px;
    right: 0;
    cursor: pointer;
  }

  @media (max-width: 1280px) {
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      margin-top: 0px;
    }

    .name-container {
      position: sticky;
      top: 5px;
    }
  }
</style>
