<script>
  export let store;
  const { tooling } = store;

  let activeSkill = [null, null];

  const setActiveSkill = (skillName, skillWords) => () => {
    activeSkill = [skillName, skillWords];
  };

  // TODO make this not terrible
</script>

<div class="skill-container">
  <div class="container column">
    <div class="top justify-start">
      <div class="left">
        <div class="linked-ctas center limit-width" id="extras">
          <span>Tooling</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left column justify-center align-center">
        <div class="skills-container container center limit-width">
          {#each tooling as column}
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
      <div class="right align-center align-start skill-description-container">
        <div
          class="{activeSkill[0] ? 'skill-description' : 'no-skill'} limit-width
            center">
          {activeSkill[1] || '(please select a tool from the nearby panel).'}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .skill-description-container {
    min-height: 200px;
  }

  .skill-column {
    margin-right: 20px;
  }

  .skill {
    margin: 0;
    padding: 0;
    text-align: start;
    cursor: pointer;
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

  @media (max-width: 540px) {
    .skill-column {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 10px;
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

    .hilarious-misalign {
      transform: initial;
    }

    .frog {
      width: 50vh;
    }
  }
</style>
