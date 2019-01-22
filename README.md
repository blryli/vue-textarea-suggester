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

Vue.use(VueTextaSuggester)

// 或者直接使用script导入
<script src="https://unpkg.com/vue-textarea-suggester/dist/vue-textarea-suggester.js"></script>
```

#### 上手

```html
<textarea ref="textarea" class="textarea" rows="10" @input="input"></textarea>
<vue-textarea-suggester
  v-model="show"
  :target="target"
  :rules="rules"
  @check="check"
  ref="suggester"
/>
```

```js
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
```

### vue-form Attributes

|    参数    |    说明      |   类型     |可选值  |默认值|
| ---------  | ----------  | --------   |----  | ----- |
| target      | textarea DOM    | HTMLTextAreaElement     |-     | false    |
| value      | suggester 是否展示    | boolean     |-     | false    |
| rules      | 匹配规则  [{"symbol": "@", "data": [ { "label": "label" }]    | array       |-     | -     |
| minWidth | suggester 最小宽度 | string |-     | 180px  |

### vue-form Methods

|  方法名 |    说明                    |   参数      |
|-------- |------                      |------       |
|isShow  |检测 suggester 是否需要展示    |    -   |

### vue-form Events

|  方法名 |    说明                    |   回调参数      |
|-------- |------                      |------       |
|matched  |suggester 显示时触发    |    匹配到的符号 string   |
|check  |suggester 点击或回车选中item时触发    |    选中的对象 object   |
