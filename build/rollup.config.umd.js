import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vue-textarea-suggester',
    file: 'dist/vue-textarea-suggester.umd.js',
    format: 'umd',
  },
})

export default config
