<script>
  import GenericButton from "./ArtSkillButton.svelte"
  import GenericDesc from "./SkillDesc.svelte"
  import TwoColumnContainer from "./TwoColumnContainer.svelte"

  export let title, content, preamble, id
  export let SkillButton = GenericButton
  export let SkillDesc = GenericDesc

  let activeSkill = [null, null]

  const setActiveSkill = (skillName, skillWords) => () => {
    activeSkill = [skillName, skillWords]
  }
</script>

<TwoColumnContainer {title} {preamble} {id}>
  <div slot="left" class="skills-container container center limit-width">
    {#each content as column}
      <div class="column container skill-column">
        {#each column as skillList}
          {#each Object.keys(skillList) as skill}
            <svelte:component
              this={SkillButton}
              {skill}
              {activeSkill}
              onclick={setActiveSkill(skill, skillList[skill])} />
          {/each}
          <br />
        {/each}
      </div>
    {/each}
  </div>
  <div
    slot="right"
    class="right-container container center skill-description-container">
    <svelte:component this={SkillDesc} {activeSkill} />
  </div>
</TwoColumnContainer>

<style>
  .right-container {
    width: 100%;
  }
  .skill-description-container {
    min-height: 200px;
  }


  @media (max-width: 1280px) {
    .skill-column {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 10px;
    }

    .skill-description-container {
      font-size: 20px;
    }

    .right-container {
      text-align: center;
    }
  }
</style>
