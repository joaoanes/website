// The live tuning panel, as the rest of the app sees it.
//
// This indirection exists so the panel can be excluded at build time rather than merely
// hidden at runtime. rollup.config.js redirects imports of this module to tuning.stub.js
// unless TUNE=1 is set, which means the component never enters the bundle graph — no
// relying on tree-shaking to work out that a branch is dead.
export { default as SceneControls } from './SceneControls.svelte'

export const TUNING_AVAILABLE = true
