<script>
  import { store } from "../lib/Store.svelte"
  import Index from "./Index.svelte"
</script>

<main>
  <Index {store} />
</main>
