import { writable } from 'svelte/store'

// The above-the-fold sequence: the old surface fails, an agent is pointed at it, the
// surface it writes is the one you can then push waves around in. Phases are explicit so
// the scene and the panel can never disagree about what is on screen.

export const PHASE = {
  legacy: 'legacy',
  glitch: 'glitch',
  patching: 'patching',
  fixed: 'fixed'
}

// Which surface each phase actually renders. Keeping this as a lookup rather than a
// condition scattered around means adding a phase cannot silently render nothing.
export const SURFACE_FOR_PHASE = {
  [PHASE.legacy]: 'legacy',
  [PHASE.glitch]: 'glitch',
  [PHASE.patching]: 'glitch',
  [PHASE.fixed]: 'fixed'
}

const SESSION_KEY = 'watersim-incident-v1'
const PROMPT = 'please fix this make zero mistakes thank you'
const MAX_LOG_LINES = 7

const AGENT_LINES = [
  'reading src/lib/scene.js',
  'two sines and a prayer. noted.',
  'writing a height field — wave equation, ping-ponged',
  'pointer now injects along the swept segment, not as rings',
  'recompiling shader'
]

const SCRIPT = {
  glitchHoldMs: 900,
  panelMs: 1000,
  secondLogMs: 1550,
  typeStartMs: 2200,
  typeMinMs: 24,
  typeJitterMs: 52,
  promptHoldMs: 650,
  agentLineMs: 460,
  applyMs: 260,
  dismissMs: 2600
}

const initialState = {
  phase: PHASE.legacy,
  hardGlitch: false,
  panel: false,
  typed: '',
  log: [],
  played: false
}

const readSessionFlag = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch (err) {
    return false // private mode; the sequence simply plays again
  }
}

const writeSessionFlag = () => {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1')
  } catch (err) {
    // nothing to do; worst case the visitor sees the incident twice
  }
}

const clearSessionFlag = () => {
  try {
    window.sessionStorage.removeItem(SESSION_KEY)
  } catch (err) {
    // see above
  }
}

export const createIncident = ({ delayMs = 4200, enabled = true } = {}) => {
  const { subscribe, update, set } = writable(initialState)
  let timers = []

  const at = (ms, action) => timers.push(setTimeout(action, ms))

  const cancelTimers = () => {
    timers.forEach(clearTimeout)
    timers = []
  }

  const pushLog = (mark, text) => update((state) => ({
    ...state,
    log: state.log.concat([{ mark, text, key: `${state.log.length}-${mark}` }]).slice(-MAX_LOG_LINES)
  }))

  const finish = () => {
    cancelTimers()
    writeSessionFlag()
    set({ ...initialState, phase: PHASE.fixed, played: true, panel: false })
  }

  const applyFix = () => {
    cancelTimers()
    writeSessionFlag()
    update((state) => ({ ...state, phase: PHASE.fixed, hardGlitch: false, typed: '' }))
    pushLog('✓', 'done. zero mistakes.')
    at(SCRIPT.dismissMs, () => update((state) => ({ ...state, panel: false })))
  }

  const runAgent = () => {
    update((state) => ({ ...state, phase: PHASE.patching, typed: '' }))
    pushLog('>', PROMPT)
    AGENT_LINES.forEach((text, index) =>
      at(SCRIPT.agentLineMs * (index + 1), () => pushLog('◦', text))
    )
    at(SCRIPT.agentLineMs * (AGENT_LINES.length + 1) + SCRIPT.applyMs, applyFix)
  }

  const typePrompt = (count) => {
    update((state) => ({ ...state, typed: PROMPT.slice(0, count) }))
    if (count >= PROMPT.length) return at(SCRIPT.promptHoldMs, runAgent)
    at(SCRIPT.typeMinMs + Math.random() * SCRIPT.typeJitterMs, () => typePrompt(count + 1))
  }

  const play = () => {
    cancelTimers()
    set(initialState)
    at(delayMs, () => update((state) => ({
      ...state, phase: PHASE.glitch, hardGlitch: true
    })))
    at(delayMs + SCRIPT.glitchHoldMs, () =>
      update((state) => ({ ...state, hardGlitch: false })))
    at(delayMs + SCRIPT.panelMs, () => {
      update((state) => ({ ...state, panel: true }))
      pushLog('!', 'water surface: integrity check FAILED')
    })
    at(delayMs + SCRIPT.secondLogMs, () => pushLog('!', 'src/lib/scene.js:96 — vertexShader'))
    at(delayMs + SCRIPT.typeStartMs, () => typePrompt(0))
  }

  const start = () => {
    if (!enabled || readSessionFlag()) return finish()
    play()
  }

  const replay = () => {
    clearSessionFlag()
    play()
  }

  return {
    subscribe,
    start,
    replay,
    skip: finish,
    destroy: cancelTimers,
    prompt: PROMPT
  }
}
