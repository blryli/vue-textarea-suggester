<template>
  <div id="app">
    <h2>vue-textarea-suggester</h2>
    <p>外挂形式存在的suggester，可以与原生textarea或任何组件搭配使用。</p>
    <div class="box">
      <textarea ref="textarea" class="textarea" rows="10" @input="input"></textarea>
    </div>
    <vue-textarea-suggester
      v-model="show"
      :target="target"
      :rules="rules"
      @check="check"
      @matched="matched"
      ref="suggester"
    >
      <template slot-scope="{data}">
        <span>{{data.label}}</span>
        <small>{{data.chineseName}}</small>
      </template>
    </vue-textarea-suggester>
    <p>show: {{show}}</p>
    <p>rules: {{rules}}</p>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      show: false,
      target: null,
      rules: [
        {
          symbol: "@",
          data: [
            {
              label: "blryli"
            },
            {
              label: "dongqiang"
            }
          ]
        },
        {
          symbol: "#",
          data: [
            {
              label: "order001"
            },
            {
              label: "order002"
            }
          ]
        }
      ]
    };
  },
  methods: {
    input() {
      this.$refs.suggester.isShow();
    },
    matched(symbol) {
      console.log(`matched ${JSON.stringify(symbol)}`);
    },
    check(obj) {
      console.log(`check ${JSON.stringify(obj)}`);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.target = this.$refs.textarea;
    });
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}
.box{
  padding: 10px;
  border: 1px solid #ccc;
}
.textarea {
  width: 100%;
  border: 0;
  outline: 0 none;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  font-family: Menlo, "Ubuntu Mono", Consolas, "Courier New", "Microsoft Yahei",
    "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
}
</style>
