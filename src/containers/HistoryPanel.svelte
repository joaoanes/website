<script>
  import { onMount } from "svelte"
  export let history

  let shownBlurbs = []
  let currentTimeout
  let unseenBlurbs = history.blurbs

  function shuffleBlurbs() {
    unseenBlurbs = history.blurbs
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
    moreBlurbs()
  }

  function moreBlurbs() {
    if (unseenBlurbs.length === 0) {
      unseenBlurbs = null
      clearTimeout(currentTimeout)
      currentTimeout = setTimeout(shuffleBlurbs, 2500)
      return
    }
    shownBlurbs = unseenBlurbs.splice(0, 4)
  }

  onMount(() => {
    shuffleBlurbs()
  })

  const {
    year,
    date,
    role,
    companyName,
    companyLink,
    current,
    location,
    whatDo,
  } = history

  const roleParts = role.split(" - ")
  const mainRole = roleParts[0]
  const subRole = roleParts.length > 1 ? roleParts.slice(1).join(" - ") : null
</script>

<div id={year} class="grow-h-container">
  <div class="history-container align-center">
    <div class="top">
      <div class="left flex align-end">
        <div class="current-container">
          <span class="role">{mainRole}</span>
          {#if subRole}
            <span class="role-subtitle"> - {subRole}</span>
          {/if}
          {#if current}
            <span class="current">(current)</span>
          {/if}
        </div>
        <span class="date">{date}</span>
      </div>
      <div class="right-info">
        <div>
          <a href={companyLink}> <span class="company">{companyName}</span> </a>
        </div>
        <div><span class="location">{location}</span></div>
      </div>
    </div>
    <div class="history-divider center" />
    <div class="bottom">
      <div class="left limit-width center align-start">
        <span class="what-do">{whatDo}</span>
      </div>
      <div class="right limit-width center column blurbs">
        {#each shownBlurbs as blurb}<span class="blurb">{blurb}</span>{/each}
        {#if unseenBlurbs === null}
          <div class="blurb endzone">
            We ran out of words! Let's shuffle the deck...
          </div>
          <div class="loader-container">
            <div class="loader" />
          </div>
        {:else}
          <button class="more-button" on:click={moreBlurbs}>More</button>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .current-container {
    display: flex;
    align-items: baseline;
    white-space: nowrap;
  }

  .current {
    font-size: 12px;
    line-height: 1.1;
    margin-left: 6px;
  }

  .endzone {
    font-weight: bold;
  }

  .blurbs {
    min-height: 300px;
  }

  .history-container {
    width: 90%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50px;
  }

  .what-do {
    font-family: "Exo2Italic";
    font-size: 30px;
  }

  .location {
    font-size: 12px;
  }

  .role {
    font-size: 32px;
    line-height: 1.1;
  }

  .role-subtitle {
    font-size: 22px;
    font-family: "Exo2Italic";
    font-style: italic;
    line-height: 1.1;
  }

  .history-container .top {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
  }

  .history-container .top .left {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    flex: 1;
    min-width: 0;
    width: auto;
    max-width: none;
    margin-left: 0;
  }

  .history-container .top .right-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: auto;
    max-width: none;
    margin-left: 20px;
    flex-shrink: 0;
  }

  .date {
    font-size: 24px;
    line-height: 1.1;
    margin-left: auto;
    margin-right: 0;
    white-space: nowrap;
  }

  .history-divider {
    height: 2px;
    width: 100%;
    background-color: black;
    margin-bottom: 50px;
    margin-top: 18px;
  }

  @media (max-width: 1280px) {
    .current-container {
      flex-wrap: wrap;
      white-space: normal;
    }

    .date {
      line-height: 20px;
      margin-left: 0;
    }

    .history-divider {
      width: 100%;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .role {
      font-size: 24px;
    }

    .role-subtitle {
      font-size: 16px;
    }

    .history-container .top .left {
      max-width: 100%;
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
    }

    .history-container .top .right-info {
      align-items: flex-start;
      margin-left: 0;
    }

    .date {
      font-size: 20px;
      display: flex;
      margin-right: 0;
    }

    .what-do {
      font-size: 22px;
    }
  }

  .blurb {
    font-family: "SourceSansLight";
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .more-button {
    align-self: flex-end;
    margin-top: auto;
    margin-bottom: 0;
    cursor: pointer;
  }

  /* thank you Luke Haas https://projects.lukehaas.me/css-loaders/ */

  .loader-container {
    height: 70px;
  }

  .loader,
  .loader:before,
  .loader:after {
    background: #ffffff;
    -webkit-animation: load1 1s infinite ease-in-out;
    animation: load1 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
  }
  .loader {
    color: black;
    text-indent: -9999em;
    margin: 88px auto;
    position: relative;
    font-size: 11px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  .loader:before,
  .loader:after {
    position: absolute;
    top: 0;
    content: "";
  }
  .loader:before {
    left: -1.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .loader:after {
    left: 1.5em;
  }
  @-webkit-keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
  @keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
</style>