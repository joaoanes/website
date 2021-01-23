<script>
  import GenericSkillsPage from "../components/genericTwoColumnSelector/GenericSkillsPage.svelte";
  import SuperSkillButton from "../components/genericTwoColumnSelector/ArtSkillButton.svelte";
  import SuperSkillDesc from "../components/genericTwoColumnSelector/ArtSkillDesc.svelte";

  export let store;
  const { skills } = store;
</script>

<GenericSkillsPage
  content={skills}
  id="skills"
  title="Relevant skills"
  SkillButton={SuperSkillButton}
  SkillDesc={SuperSkillDesc} />
