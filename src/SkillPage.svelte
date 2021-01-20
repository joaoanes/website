<script>
  import GenericSkillsPage from "./genericTwoColumnSelector/GenericSkillsPage.svelte";

  import SuperSkillButton from "./genericTwoColumnSelector/ArtSkillButton.svelte";
  import SuperSkillDesc from "./genericTwoColumnSelector/ArtSkillDesc.svelte";

  export let store;
  const { skills } = store;
</script>

<GenericSkillsPage
  content={skills}
  id="skills"
  title="Relevant skills"
  SkillButton={SuperSkillButton}
  SkillDesc={SuperSkillDesc} />
