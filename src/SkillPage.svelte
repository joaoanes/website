<script>
  import PageContainer from "./PageContainer.svelte";
  export let store;
  const {
    name,
    title,
    subtitle,
    quote,
    description,
    lookingFor,
    history,
    skills,
  } = store;
  let activeSkill = [null, null];

  const setActiveSkill = (skillName, skillWords) => () => {
    activeSkill = [skillName, skillWords];
  };

  const designSkillActive = (skill) => skill === "design principles";
</script>

<div class="skill-container">
  <div class="container column">
    <div class="top justify-start">
      <div class="left">
        <div class="linked-ctas center limit-width" id="skills">
          Relevant skills
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left column justify-center align-center">
        <div class="skills-container container center limit-width">
          {#each skills as column}
            <div class="column container skill-column">
              {#each column as skillList}
                {#each Object.keys(skillList) as skill}
                  <button
                    class="skill {skill == activeSkill[0] ? 'selected' : ''}
                      {designSkillActive(activeSkill[0]) ? 'art' : ''}"
                    on:click={setActiveSkill(skill, skillList[skill])}>{skill}</button>
                {/each}
                <br />
              {/each}
            </div>
          {/each}
        </div>
      </div>
      <div class="right align-center align-start skill-description-container">
        {#if designSkillActive(activeSkill[0])}
          <div class="easter-egg">
            <img
              alt="Graphic design is my passion (ironically misaligned)"
              class="frog hilarious-misalign"
              src="./graphics.png" />
          </div>
        {:else}
          <div
            class="{activeSkill[0] ? 'skill-description' : 'no-skill'} limit-width
              center">
            {activeSkill[1] || '(please select a skill from the nearby panel).'}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .skill-description-container {
    min-height: 200px;
  }

  .skill-container {
    margin-bottom: 300px;
  }

  .skill-column {
    margin-right: 20px;
  }

  .skill {
    margin: 0;
    padding: 0;
    text-align: start;
  }

  .skill-description {
    font-family: "Exo2Italic";
    font-size: 24px;
  }

  .art {
    font-family: "Comic Sans MS", "Comic Sans", "Chalkboard SE", "Comic Neue",
      sans-serif;
  }

  .no-skill {
    color: #afafaf;
    font-family: "Exo2Italic";
  }

  .selected {
    background-color: #d4d4d4;
  }

  .easter-egg {
    position: absolute;
  }

  .frog {
    max-width: 500px;
  }

  .hilarious-misalign {
    transform: translateY(-140px) translateX(-130px);
  }

  @media (max-width: 540px) {
    .skill-column {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .skill {
      padding: 2px;
      margin-left: 10px;
      margin-right: 10px;
    }

    .skill-description {
      font-size: 20px;
    }

    .skill-container {
      margin-bottom: 20px;
    }
  }
</style>
