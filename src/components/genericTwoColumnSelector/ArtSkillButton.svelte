<script>
  export let onclick, skill, activeSkill;

  const designSkillActive = (skill) => skill === "design principles";
</script>

<button
  class="skill {skill == activeSkill[0] ? 'selected' : ''}
    {designSkillActive(activeSkill[0]) ? 'art' : ''}"
  on:click={onclick}>{skill}</button>
