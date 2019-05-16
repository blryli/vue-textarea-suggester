# vue-textarea-suggester

> 外挂形式存在的suggester，可以与原生textarea或任何组件搭配使用。

### 演示

[github pages](https://blryli.github.io/vue-textarea-suggester/)

#### npm 安装

```js
npm install vue-textarea-suggester --save
```

#### 使用

```js
import VueTextaSuggester from 'vue-textarea-suggester'

import 'vue-textarea-suggester/dist/vue-textarea-suggester.css'

Vue.use(VueTextaSuggester)

// 或者直接使用script导入
<link src="https://unpkg.com/vue-textarea-suggester/dist/vue-textarea-suggester.css"></link>
<script src="https://unpkg.com/vue-textarea-suggester/dist/vue-textarea-suggester.min.js"></script>
```

#### 搭配 原生textarea

```html
<textarea ref="textarea" class="textarea" rows="10" @input="input"></textarea>
<vue-textarea-suggester
  v-model="extracts"
  :target="target"
  :rules="rules"
  @matched="matched"
  ref="suggester"
/>
```

```js
<script>
export default {
  name: "app",
  data() {
    return {
      target: null,
      extracts: [],
      rules: [
        {
          rule: /!/,
          data: [{ label: "aaaa" }, { label: "bbbb" }]
        },
        {
          rule: /@/,
          data: [{ label: "xxxx" }, { label: "yyyy" }]
        }
      ]
    };
  },
  methods: {
    input() {
      this.$refs.suggester.change();
    },
    matched(rule, query, row) {
      console.log(`rule ${JSON.stringify(rule)}`);
      console.log(`query ${JSON.stringify(query)}`);
      console.log(`row ${JSON.stringify(row)}`);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.target = this.$refs.textarea;
    });
  }
};
</script>
```

#### 搭配 md-editor2

> 安装 md-editor2

```js
import MdEditor2 from 'md-editor2'

import 'md-editor2/dist/css/index.css'

Vue.use(MdEditor2)
```

```html
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
/>
```

```js
<script>
export default {
  name: "app",
  data() {
    return {
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
          key: "number"
        },
        {
          rule: /!/,
          key: "type",
          enterAdd: ":",
          enterExtract: false
        },
        {
          rule: /@/,
          key: "person"
        }
      ]
    };
  },
  methods: {
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
      this.mdTarget = document.querySelector(".auto-textarea-input");
    });
  }
};
</script>
```

### vue-textarea-suggester Attributes

|    参数    |    说明      |   类型     |可选值  |默认值|
| ---------  | ----------  | --------   |----  | ----- |
| value      | 选中时提取的对象    | Array     |-     | []    |
| target      | 输入元素的dom    | HTMLTextAreaElement     |-     | -    |
| rules      | 匹配规则     | array       |-     | -     |
| debounce | 输入时防抖等待时间 | Number |-     | 300  |
| minWidth | suggester 最小宽度 | string |-     | 180px  |
| remote | 是否为远程远程匹配 | Boolean |-     | false  |
| loading | remote为true时，是否正在从远程获取数据 | Boolean |-     | false  |
| options | remote为true时，远程获取数据列表 | Array |-     | []  |

### rules Attributes

|    参数    |    说明      |   类型     |可选值  |默认值|
| ---------  | ----------  | --------   |----  | ----- |
| rule      | 匹配规则    | 正则     |-     | -    |
| enterAdd      | 选中item时 向末尾添加的字符    | string     |-     | 空格    |
| enterExtract      | 选中item时 是否提取内容     | array       |-     | true     |
| data      | 匹配规则成功时，suggester显示列表，remote为true时无效 | array       |-     | []    |

### vue-textarea-suggester Methods

|  方法名 |    说明                    |   参数      |
|-------- |------                      |------       |
|change  |触发匹配的方法    |    -   |

### vue-textarea-suggester Events

|  方法名 |    说明                    |   回调参数      |
|-------- |------                      |------       |
|matched  |匹配成功时触发    |    匹配规则对应的字符串，匹配内容，规则对象    |
|change  |suggester 选中item时触发    |    提取的集合    |
