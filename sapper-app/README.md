# sapper-app

This is a barebones [sapper](https://sapper.svelte.dev/) app that renders the `<App />` component from the root project.

# Why

In short, because it makes the first contenteful paint render as early as possible in the site rendering pipeline.

Sapper is an entire framework to build entire applications, with a node.js backend server. We're using it to [export](https://sapper.svelte.dev/docs#Exporting) a single-route application with no backend component (ignore what's in the scaffold) that, above all, _exports hydration-ready components_. This means that when browsers do the `GET / HTTP 2` dance, they actually get the site rendered as HTTP! This is great if the client doesn't support javascript (with limited interactibility, admittedly) or when loading the website in a potato/mobile phone so we don't have to wait 3 seconds for the browser to build the HTML we should've given it in the first place. It also ensures that for the first 500ms of rendering, the browser should have the css and basic HTML in place to do a render, instead of having to wait for the (small, sure) bundles of JS that eventually render HTML to load and execute.

[I just think that's neat.](https://i.redd.it/wgimxlypchy11.jpg)

# Running

`yarn dev` and `yarn build` do the expected, running a dev server and building the website. However

`yarn export` does the magic, and builds to `/__sapper__/export`. Just upload that to your static site host of choice and bask in 100 speed lighthouse indexes.
