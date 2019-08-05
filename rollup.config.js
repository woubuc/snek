import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
	input: './src/index.ts',

	output: {
		file: 'app.js',
		format: 'iife',

		banner: '/* snek - made by @woubuc */',

		sourcemap: true,
	},

	plugins: [
		typescript(),
		terser(),
	],
}
