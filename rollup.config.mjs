import env from '@dotenv-run/rollup';
import resolve from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-ts';

const esm = [
  {
    dir: 'dist/esm',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
];

const nonEsm = [
  {
    file: 'dist/plugin.js',
    format: 'iife',
    name: 'capacitorAdapty',
    globals: {
      '@capacitor/core': 'capacitorExports',
    },
    sourcemap: true,
    inlineDynamicImports: true,
  },
  {
    file: 'dist/plugin.cjs.js',
    format: 'cjs',
    sourcemap: true,
    inlineDynamicImports: true,
  },
];

const baseConfig = {
  input: 'src/index.ts',
  plugins: [
    ts({
      transpiler: 'typescript',
    }),
    resolve(),
    env({ prefix: 'PUBLIC_', verbose: true, root: './' }),
  ],
  external: ['@capacitor/core'],
};

export default [
  {
    ...baseConfig,
    output: esm,
    external: [...baseConfig.external, 'tslib'],
  },
  {
    ...baseConfig,
    output: nonEsm,
  },
];
