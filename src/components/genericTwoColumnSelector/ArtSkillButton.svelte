<script>
  export let onclick, skill, activeSkill

  const designSkillActive = (skill) => skill === "design principles"
  let renderedSkill = skill

  const regex = /\[([^\]]+)\]/

  const textBetweenParenthesis = renderedSkill.match(regex)
  if (textBetweenParenthesis) {
    let matchedString = textBetweenParenthesis[1];
    renderedSkill = renderedSkill.replace(regex, `<span class="smaller-text">${matchedString}</span>`);
  }
</script>

<button
  class="skill {skill == activeSkill[0] ? 'selected' : ''}
    {designSkillActive(activeSkill[0]) ? 'art' : ''}"
  on:click={onclick}>{@html renderedSkill}</button>

  <style>
    :global(.smaller-text) {
      font-size: 10px;
    }
  </style>