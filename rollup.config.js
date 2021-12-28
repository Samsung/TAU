import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import pkg from './package.json';

const extensions = ['.js', '.ts'];

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/one-elements.ts',
  plugins: [
    resolve({ extensions }),
    typescript(),
    !production && serve({open: true, openPage: '/examples/index.html', contentBase: ['./'], port: 8080})
  ],
  output: [
    {
      file: pkg.browser,
      format: 'umd',
      name: 'uc'
    },
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ]
}