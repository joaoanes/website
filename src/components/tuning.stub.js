// Stands in for tuning.js in any build without TUNE=1. Because nothing here imports
// SceneControls.svelte, neither it nor the tuning surface of src/lib/scene.js reaches the
// bundle. `svelte:component` renders nothing when handed null.
export const SceneControls = null

export const TUNING_AVAILABLE = false
