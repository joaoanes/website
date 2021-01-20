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
  <div class="right align-center">
    <div class="container justify-end limit-width center">
      <div on:click={scrollIntoView('skills')} class="link">Skills</div>
      <div on:click={scrollIntoView('roles')} class="link">Roles</div>
      <div on:click={scrollIntoView('extras')} class="link">Etc</div>
      <div on:click={scrollIntoView('cv')} class="link">
        CV <span class="pdf">(pdf)</span>
      </div>
    </div>
  </div>
</div>

<style>
  .pdf {
    font-size: 15px;
    line-height: 25px;
  }

  .link {
    max-height: 50px;
    display: flex;
    align-items: flex-end;
    outline: none;
    cursor: pointer;
  }

  .right div {
    font-size: 30px;
    margin-left: 20px;
    margin-bottom: 5px;
  }

  .right .container div:hover {
    text-decoration: underline;
  }

  .header {
    width: 100%;
    height: 80px;
    margin-left: auto;
    margin-right: auto;
    border-bottom: 2px solid black;
    font-size: 40px;
    font-family: "CascadiaCode";
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    position: sticky;
    top: 0;
    color: black;
    background-color: rgba(255, 255, 255, 0.98);
    margin-bottom: 200px;
  }

  .name-container {
    height: 400px;
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

  @media (max-width: 540px) {
    .header {
      height: 30px;
      margin-bottom: 100px;
      border-bottom: 1px solid black;
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

    .left,
    .right {
      width: 50%;
    }

    .left {
      margin-bottom: 0;
    }

    .pdf {
      font-size: 10px;
      line-height: 15px;
    }
  }
</style>
