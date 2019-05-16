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
      v-model="extracts"
      :target="target"
      :rules="rules"
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
      remote
      v-model="extracts"
      :target="mdTarget"
      :rules="rules"
      :options="options"
      :loading="loading"
      @matched="matched"
      ref="mdSuggester"
    ></vue-textarea-suggester>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      target: null,
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
      // 提取字段替换成需要的字段
      valueTecalculation: params => {
        this.extracts.forEach(d => {
          const rep = `${d.rule}${d.label}`;
          params = params.replace(
            new RegExp(rep, "g"),
            `[${d.rule}${d.label}](/${d.label})`
          );
        });
        return params;
      },
      loading: false,
      options: [],
      extracts: [],
      rules: [
        {
          rule: /![A-Za-z0-9]+:/,
          key: "number",
          data: [{ label: "11111" }, { label: "22222" }]
        },
        {
          rule: /!/,
          key: "type",
          enterAdd: ":",
          enterExtract: false,
          data: [{ label: "aaaa" }, { label: "bbbb" }]
        },
        {
          rule: /@/,
          key: "person",
          data: [{ label: "xxxx" }, { label: "yyyy" }]
        }
      ]
    };
  },
  methods: {
    input() {
      this.$refs.suggester.change();
    },
    change() {
      this.$refs.mdSuggester.debouncedChange();
    },
    matched(rule, query, row) {
      console.log(`rule ${JSON.stringify(rule)}`);
      console.log(`query ${JSON.stringify(query)}`);
      console.log(`row ${JSON.stringify(row)}`);
      if (row) {
        let list = [];
        switch (row.key) {
          case "type":
            list = [
              {
                label: "ASN"
              },
              {
                label: "TCL"
              },
              {
                label: "AOC"
              }
            ];
            break;
          case "number":
            list = [
              {
                label: "10001"
              },
              {
                label: "10002"
              },
              {
                label: "10003"
              }
            ];
            break;
          case "person":
            list = [
              {
                label: "lizhili"
              },
              {
                label: "dongqiang"
              },
              {
                label: "zhouqinmin"
              }
            ];
            break;

          default:
            list = [];
            break;
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 300);
      }
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
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
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
.p-40 {
  padding: 40px;
}
</style>
