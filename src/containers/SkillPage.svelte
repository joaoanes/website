<script>
  import GenericSkillsPage from "../components/genericTwoColumnSelector/GenericSkillsPage.svelte"
  import SuperSkillButton from "../components/genericTwoColumnSelector/ArtSkillButton.svelte"
  import SuperSkillDesc from "../components/genericTwoColumnSelector/ArtSkillDesc.svelte"
  import { onMount } from "svelte"

  export let store

  const { skills } = store

  onMount(() => {
    new Image().src = "./graphics.png"
  })
</script>

<GenericSkillsPage
  content={skills}
  id="skills"
  title="Relevant skills"
  preamble=""
  SkillButton={SuperSkillButton}
  SkillDesc={SuperSkillDesc} />
