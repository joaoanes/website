<script>
  import AboveFold from "./AboveFold.svelte";
  import Header from "./Header.svelte";
  import HistoryPanel from "./HistoryPanel.svelte";
  import SkillPage from "./SkillPage.svelte";
  // export let store;
  import { store } from "./Store.svelte";
  const { history } = store;
</script>

<AboveFold {store} />

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

<style>
</style>
