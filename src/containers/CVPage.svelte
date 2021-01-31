<script>
  export let store

  const { cvCta, endQuote, email, emailCta, cvLink } = store
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
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class="cta skills-container container column center limit-width cv"
          href={cvLink}>
          <span>{cvCta}</span>
          <div class="download">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 375 374"
              style="enable-background:new 0 0 375 374;"
              xml:space="preserve">
              <g>
                <path
                  d="M255.46-0.49h-129.6c-31.85,0-57.77,25.92-57.77,57.77v94.12h25.05V57.28c0-18.04,14.68-32.72,32.72-32.72h105.83v64.63
                     c0,31.85,25.91,57.77,57.77,57.77h60.99V315.8c0,18.04-14.68,32.72-32.72,32.72H179.99v25.05h137.75
                     c31.85,0,57.77-25.92,57.77-57.77V119.55L255.46-0.49z M289.46,121.91c-18.04,0-32.72-14.68-32.72-32.72V36.21l85.7,85.7H289.46z" />
                <path
                  d="M152.38,176.84H53.82c-5.35,0-9.7,4.34-9.7,9.7v76.05H9.85c-3.97,0-7.55,2.43-9.01,6.12c-1.47,3.7-0.53,7.91,2.37,10.63
                     l93.25,87.8c1.87,1.76,4.26,2.64,6.65,2.64c2.39,0,4.78-0.88,6.65-2.64l93.25-87.8c2.89-2.73,3.83-6.94,2.37-10.63
                     c-1.47-3.69-5.04-6.12-9.01-6.12h-34.27v-76.05C162.08,181.19,157.74,176.84,152.38,176.84L152.38,176.84z" />
                <path
                  d="M206.05,90.97c0,5.24-4.25,9.49-9.49,9.49h-57.67c-5.24,0-9.49-4.25-9.49-9.49l0,0c0-5.24,4.25-9.49,9.49-9.49h57.67
                     C201.8,81.48,206.05,85.73,206.05,90.97L206.05,90.97z" />
                <path
                  d="M206.05,130.56c0,5.24-4.25,9.49-9.49,9.49h-57.67c-5.24,0-9.49-4.25-9.49-9.49l0,0c0-5.24,4.25-9.49,9.49-9.49h57.67
                     C201.8,121.06,206.05,125.31,206.05,130.56L206.05,130.56z" />
                <path
                  d="M318.04,223.07c0,5.69-4.61,10.3-10.3,10.3h-79.18c-5.69,0-10.3-4.61-10.3-10.3l0,0c0-5.69,4.61-10.3,10.3-10.3h79.18
                     C313.43,212.77,318.04,217.38,318.04,223.07L318.04,223.07z" />
                <path
                  d="M318.04,263.01c0,5.69-4.61,10.3-10.3,10.3h-79.18c-5.69,0-10.3-4.61-10.3-10.3l0,0c0-5.69,4.61-10.3,10.3-10.3h79.18
                     C313.43,252.71,318.04,257.32,318.04,263.01L318.04,263.01z" />
                <path
                  d="M318.04,302.95c0,5.69-4.61,10.3-10.3,10.3h-79.18c-5.69,0-10.3-4.61-10.3-10.3l0,0c0-5.69,4.61-10.3,10.3-10.3h79.18
                     C313.43,292.65,318.04,297.26,318.04,302.95L318.04,302.95z" />
              </g>
            </svg>
          </div>
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
    position: relative;
    top: -20px;
    width: 15vw;
    pointer-events: none;
  }

  .end {
    min-height: 100vh;
  }

  .cta {
    font-size: 20px;
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

  @media (max-width: 1280px) {
    .skill-container {
      margin-bottom: 20px;
    }

    .download {
      width: 65vw;
    }
  }
</style>
