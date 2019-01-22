<template>
  <div id="app">
    <center>
      <h2>vue-textarea-suggester</h2>
      <p>外挂形式存在的suggester，可以与原生textarea或任何组件搭配使用。</p>
      <p>
        <a href="https://github.com/blryli/vue-textarea-suggester">文档</a>
      </p>
    </center>
    <h3>原生textarea</h3>
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
    />
    <h3>md-editor2</h3>
    <md-editor2
      ref="md"
      v-model="value"
      :toolbars="toolbars"
      :valueTecalculation="valueTecalculation"
      @change="change"
    />
    <vue-textarea-suggester
      v-model="mdShow"
      :target="mdTarget"
      :rules="rules"
      @check="check"
      @matched="matched"
      ref="mdSuggester"
    />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      show: false,
      target: null,
      mdShow: false,
      mdTarget: null,
      value: `## suggester 显示时\n- 响应键盘上下左右按钮事件\n- 回车或鼠标左键点击item触发选中\n@blryli `,
      toolbars: {
        preview: true, // 预览
        bold: true, // 粗体
        italic: true, // 斜体
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        subfield: true, // 单双栏模式
        fullscreen: true // 全屏编辑
      },
      valueTecalculation: params => {
        this.rules.forEach(da => {
          da.data.forEach(d => {
            const rep = `${da.symbol}${d.label}`;
            params = params.replace(
              new RegExp(rep, "g"),
              `[${da.symbol}${d.label}](/${d.label})`
            );
          });
        });
        return params;
      },
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
    change() {
      this.$refs.mdSuggester.isShow();
    },
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
      this.mdTarget = document.querySelector(".auto-textarea-input");
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
.box {
  padding: 10px;
  border: 1px solid #ddd;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, .1);
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
