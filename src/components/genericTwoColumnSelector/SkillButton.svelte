<script>
  export let onclick, skill, activeSkill;
</script>

<button
  class="skill {skill == activeSkill[0] ? 'selected' : ''}"
  on:click={onclick}>{skill}</button>
