<script>
  export let activeSkill;
</script>

<div
  class={`limit-width center ${activeSkill[0] ? 'skill-description' : 'no-skill'}`}>
  {activeSkill[1] || '(please select a skill from the nearby panel).'}
</div>

<style>
  .skill-description {
    font-family: "Exo2Italic";
  }

  .no-skill {
    color: #afafaf;
    font-family: "Exo2Italic";
  }
</style>
