import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

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
