<script>
  import GenericSkillsPage from "../components/genericTwoColumnSelector/GenericSkillsPage.svelte";

  export let store;
  const { tooling } = store;
  const { preamble, rest } = tooling;
</script>

<GenericSkillsPage content={rest} title="Tooling" {preamble} />
