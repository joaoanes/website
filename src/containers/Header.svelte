<script>
  const scrollIntoView = (id) => () =>
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
</script>

<div class="header">
  <div class="left justify-end">
    <div class="container justify-start limit-width center">
      <a href="/">
        <div class="name-container">
          <span class="name link">João Anes</span>
        </div>
      </a>
    </div>
  </div>
  <div class="right align-center no-cursor">
    <div class="container align-end limit-width center">
      <div on:click={scrollIntoView('skills')} class="link with-cursor">
        Skills
      </div>
      <div on:click={scrollIntoView('roles')} class="link with-cursor">
        Roles
      </div>
      <div on:click={scrollIntoView('extras')} class="link with-cursor">
        Etc
      </div>
      <div on:click={scrollIntoView('cv')} class="link with-cursor">CV</div>
    </div>
  </div>
</div>

<style>
  .link {
    max-height: 50px;
    display: flex;
    align-items: flex-end;
    outline: none;
    cursor: pointer;
    margin-right: 25px;
    margin-bottom: 10px;
  }

  .right .container div:hover {
    text-decoration: underline;
  }

  .header {
    width: 100%;
    height: 80px;
    margin-left: auto;
    margin-right: auto;
    font-size: 40px;
    font-family: "CascadiaCode";
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    position: sticky;
    top: 0;
    color: black;
    margin-bottom: 200px;
    clip-path: polygon(
      0% 0,
      100% 0%,
      100% 100%,
      0% 100%
    ); /* I'll give it to them, modern css is pretty great */
  }

  .name-container {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 0;
    margin-right: auto;
  }

  .name {
    position: sticky;
    top: 0;
    z-index: -1;
    padding-top: 25px;
    font-weight: bold;
  }

  @media (max-width: 1280px) {
    .header {
      height: 30px;
      margin-bottom: 250px;
    }

    .link {
      font-size: 12px;
      margin-bottom: 5px;
      margin-right: 10px;
    }

    .right .link {
      margin-bottom: 8px;
    }

    .header .container {
      flex-direction: row;
      align-items: flex-end;
    }

    .header .right {
      margin-bottom: 0px;
    }

    .header a {
      font-size: 15px;
      margin-bottom: 5px;
      margin-left: 10px;
    }

    .left {
      margin-bottom: 0;
    }
  }
</style>
