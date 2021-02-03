<script>
  import { store } from "../lib/store"
  import Index from "./Index.svelte"

  import "../global.css"
  import "../windtail.css"
</script>

<main>
  <Index {store} />
</main>
