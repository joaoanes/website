<script>
  import { onMount } from "svelte";

  import PageContainer from "./PageContainer.svelte";
  // export let store;
  export let history;
  let shownBlurbs = [];
  let currentTimeout;
  let unseenBlurbs = history.blurbs;

  function shuffleBlurbs() {
    unseenBlurbs = history.blurbs
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
    moreBlurbs();
  }

  function moreBlurbs() {
    if (unseenBlurbs.length === 0) {
      unseenBlurbs = null;
      clearTimeout(currentTimeout);
      currentTimeout = setTimeout(shuffleBlurbs, 2500);
      return;
    }
    shownBlurbs = unseenBlurbs.splice(0, 4);
  }

  onMount(() => {
    shuffleBlurbs();
  });
</script>

<div id={history.year} class="grow-h-container">
  <div class="history-container align-center">
    <div class="top">
      <div class="left align-end limit-width center">
        <span class="date">{history.date}</span>
        <span class="role">{history.role}</span>
      </div>
      <div
        class="right container horizontal align-start limit-width center
          justify-end">
        <div class="top">
          <span class="company">{history.companyName}</span>
        </div>
        <div class="bottom">
          <span class="location">{history.location}</span>
        </div>
      </div>
    </div>
    <div class="history-divider center" />
    <div class="bottom">
      <div class="left limit-width center align-start">
        <span class="what-do">{history.whatDo}</span>
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
  .endzone {
    font-weight: bold;
  }

  .blurbs {
    min-height: 300px;
  }

  .history-container {
    width: 100%;
    margin-bottom: 50px;
  }

  .bottom,
  .top {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .what-do {
    font-family: "Exo2Italic";
    font-size: 30px;
  }

  .location {
    font-size: 12px;
  }

  .date {
    font-size: 40px;
  }

  .role {
    font-size: 27px;
    line-height: 40px;
    margin-left: 20px;
  }

  .history-divider {
    height: 2px;
    width: 90%;
    background-color: black;
    margin-bottom: 50px;
    margin-top: 18px;
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
