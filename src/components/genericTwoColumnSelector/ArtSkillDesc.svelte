<script>
  export let activeSkill;

  const designSkillActive = (skill) => skill === "design principles";
</script>

{#if designSkillActive(activeSkill[0])}
  <div class="easter-egg">
    <img
      alt="Graphic design is my passion (ironically misaligned)"
      class="frog hilarious-misalign"
      src="./graphics.png" />
  </div>
{:else}
  <div
    class={`limit-width center ${activeSkill[0] ? 'skill-description' : 'no-skill'}`}>
    {activeSkill[1] || '(please select a skill from the nearby panel).'}
  </div>
{/if}

<style>
  .skill-description {
    font-family: "Exo2Italic";
  }

  .no-skill {
    color: #afafaf;
    font-family: "Exo2Italic";
  }
</style>
