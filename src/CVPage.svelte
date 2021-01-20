<script>
  export let store;
  const { cvCta, endQuote, email, emailCta, cvLink } = store;
</script>

<div class="skill-container container column end">
  <div class="container column">
    <div class="top justify-start">
      <div class="left">
        <div class="linked-ctas center limit-width" id="cv">
          <span>CV</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left column justify-center align-center">
        <a class="skills-container container center limit-width cv">
          <a href={cvLink}>{cvCta}</a>
          <div class="download"><img src="./download.svg" /></div>
        </a>
      </div>
      <div class="right align-center align-start" />
    </div>
  </div>

  <div class="center column container footer align-center">
    <div class="ty">{endQuote}.</div>
    <a href={`mailto:${email}`} class="email">{emailCta}</a>
  </div>
</div>

<style>
  .cv {
    font-size: 30px;
  }

  .download {
    opacity: 0.1;
    position: absolute;
    width: 15vw;
    pointer-events: none;
  }

  .end {
    min-height: 100vh;
  }

  .skill-container {
    margin-bottom: 100px;
  }

  .ty {
    margin-bottom: 20px;
    text-align: center;
  }
  .footer {
    font-size: 30px;

    font-family: "Exo2Italic";
    flex-grow: 0;
    margin-bottom: 100px;
  }

  .email {
    font-size: 20px;
  }

  @media (max-width: 540px) {
    .skill-container {
      margin-bottom: 20px;
    }
  }
</style>
