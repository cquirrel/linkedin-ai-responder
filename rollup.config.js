import resolve from '@rollup/plugin-node-resolve'

import { chromeExtension } from 'rollup-plugin-chrome-extension'
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
    input: 'src/manifest.json',
    output: {
        dir: 'dist',
        format: 'esm',
    },
    plugins: [
        // always put chromeExtension() before other plugins
        chromeExtension(),
        // the plugins below are optional
        typescript(),
        resolve(),
        json(),
    ],
}