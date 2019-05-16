import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name: 'vue-textarea-suggester',
    file: 'dist/vue-textarea-suggester.esm.js',
    format: 'es',
  },
})

export default config
