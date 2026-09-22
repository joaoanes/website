import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import path from 'path';

const production = !process.env.ROLLUP_WATCH;

// The scene tuning panel is a development tool. Rather than shipping it and hiding it
// behind a query string, imports of src/components/tuning are redirected to a stub unless
// TUNE=1 is set — so the panel, and the mutable tuning surface of src/lib/scene.js that
// only it uses, never enter the bundle graph. Use `npm run dev:tune` to get it back.
const tuningEnabled = process.env.TUNE === '1';

function tuningPanel() {
  return {
    name: 'tuning-panel',
    resolveId(source) {
      if (tuningEnabled) return null;
      if (source !== './tuning' && !source.endsWith('/tuning')) return null;
      return path.resolve('src/components/tuning.stub.js');
    }
  };
}

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default [
  {
    input: 'src/main.js',
    output:
    {
      sourcemap: true,
      format: 'esm',
      dir: 'public/build/nm/'
    },
    plugins: [
      svelte({
        emitCss: false,
        compilerOptions: {
          legacy: true,
          dev: !production
        }
      }),
      tuningPanel(),
      // The nomodule bundle never serves its own stylesheet (index.html links the module
      // build's bundle.css for both), but the plain `import "./global.css"` still has to
      // resolve to something or rollup tries to parse CSS as JavaScript.
      css({ output: 'bundle.css' }),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      commonjs(),
      production && terser(),
    ],
    watch: {
      clearScreen: false
    }
  },
  {
    input: 'src/main.js',
    output:
    {
      sourcemap: true,
      format: 'es',
      dir: 'public/build/'
    },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production
        }
      }),
      tuningPanel(),
      css({ output: 'bundle.css' }),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      commonjs(),

      production && terser(),
      !production && serve(),
      !production && livereload('public'),
    ],
    watch: {
      clearScreen: false
    }
  },
]
