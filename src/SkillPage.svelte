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
</script>

<style>
  .skills-cta {
    font-size: 50px;
    margin-bottom: 100px;
  }

  .skill-container {
    margin-bottom: 200px;
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
</style>

<div class="skill-container">
  <div class="container column">
    <div class="top justify-start">
      <div class="left">
        <div class="skills-cta center">Relevant skills</div>
      </div>
    </div>
    <div class="bottom">
      <div class="left column justify-center align-center">
        <div class="skills-container container center">
          {#each skills as column}
            <div class="column container skill-column">
              {#each column as skillList}
                {#each Object.keys(skillList) as skill}
                  <button
                    class="skill {skill == activeSkill[0] ? 'selected' : ''}"
                    on:click={setActiveSkill(skill, skillList[skill])}>{skill}</button>
                {/each}
                <br />
              {/each}
            </div>
          {/each}
        </div>
      </div>
      <div class="right align-center align-start">
        {#if activeSkill[0] === null}
          <div class="no-skill limit-width center">
            (please select a skill from the nearby panel).
          </div>
        {:else if activeSkill[0] === 'design principles'}
          <div class="easter-egg">
            <img
              alt="Graphic design is my passion (and then a little frog)"
              class="frog"
              src="./graphics.png" />
          </div>
        {:else}
          <div class="skill-description limit-width center">
            {activeSkill[1]}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
