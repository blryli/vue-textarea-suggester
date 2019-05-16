<template>
  <div
    class="suggester"
    :style="{'--minWidth': minWidth, 'display': matchedStr ? 'block' : 'none'}"
  >
    <ul v-show="matchedStr" class="suggester-list">
      <li class="suggester-list-item" v-show="remote && loading">
        <img width="18" src="../../assets/loading.gif" alt>
      </li>
      <li
        class="suggester-list-item"
        v-for="(d, i) in data"
        :key="i"
        :class="{active: i === activeIndex}"
        @click="enter(i)"
      >
        <slot :data="d">
          <strong>{{d.label}}</strong>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
import { getCursorPos } from "./getCursorPos";
import { on, off, debounce } from "../../utils/dom";

export default {
  name: "vue-textarea-suggester",
  props: {
    value: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Array,
      default: () => []
    },
    target: HTMLTextAreaElement,
    minWidth: {
      type: String,
      default: "180px"
    },
    options: {
      type: Array,
      default: () => []
    },
    debounce: {
      type: Number,
      default: 300
    },
    loading: Boolean,
    remote: Boolean
  },
  data() {
    return {
      data: [],
      startIndex: null,
      focusIndex: null,
      activeIndex: null,
      matchedRule: {},
      matchedStr: null
    };
  },
  watch: {
    options(val) {
      this.remote && (this.data = val);
    }
  },
  created() {
    this.debouncedChange = debounce(this.debounce, this.change);
  },
  methods: {
    showPosition() {
      // !document.body.contains(this.$el) && document.body.appendChild(this.$el);
      this.activeIndex = 0;
      const pos = getCursorPos.getInputPositon(this.target, this.startIndex);
      this.$el.style.top = pos.bottom + "px";
      this.$el.style.left = pos.left + "px";
    },
    change(count) {
      if (!this.target) return;
      const value = this.target.value;
      this.focusIndex = getCursorPos._getFocus(this.target);
      if (count) {
        if (count === "-") {
          this.focusIndex = this.focusIndex > 0 ? this.focusIndex - 1 : 0;
        } else if (count === "+") {
          this.focusIndex =
            this.focusIndex < value.length ? this.focusIndex + 1 : value.length;
        }
      }
      // 确定起始点并截取字符串
      const fristBlank = value.lastIndexOf(" ", this.focusIndex - 1);
      const fristEnter = value.lastIndexOf("\n", this.focusIndex - 1);
      this.startIndex =
        fristBlank > fristEnter ? fristBlank + 1 : fristEnter + 1;
      const str = value.substring(this.startIndex, this.focusIndex);

      // 自下而上匹配规则
      this.matchedRule = this.rules.find(d => d.rule.exec(str));
      this.matchedStr =
        this.matchedRule && this.matchedRule.rule
          ? str.match(this.matchedRule.rule)[0]
          : null;
      if (this.matchedStr) {
        const query = str.substring(this.matchedStr.length);
        // 是否远程匹配
        if (this.remote) {
          this.data = [];
        } else {
          this.data = (this.matchedRule.data || []).filter(
            d => d.label && d.label.indexOf(query) > -1
          );
        }
        this.$emit("matched", this.matchedStr, query, this.matchedRule);
        this.showPosition();
        return;
      }
    },
    keyDown(e) {
      switch (e.key) {
        case "ArrowLeft":
          this.change("-");
          break;
        case "ArrowRight":
          this.change("+");
          break;
        case "ArrowUp":
          if (this.matchedStr) {
            e.preventDefault();
            this.activeIndex =
              this.activeIndex > 0
                ? this.activeIndex - 1
                : this.data.length - 1;
          }
          break;
        case "ArrowDown":
          if (this.matchedStr) {
            e.preventDefault();
            this.activeIndex =
              this.activeIndex < this.data.length - 1
                ? this.activeIndex + 1
                : 0;
          }
          break;
        case "Enter":
          if (this.matchedStr) {
            e.preventDefault();
            this.enter();
          }
          break;
        default:
          break;
      }
    },
    enter(index) {
      if (!this.matchedStr || !this.target) return;
      const value = this.target.value;
      const activeIndex = index !== undefined ? index : this.activeIndex;
      // 是否远程匹配
      const option = this.remote
        ? this.options[activeIndex]
        : this.data[activeIndex];
      const startStr = value.slice(0, this.startIndex);
      const endStr = value.slice(this.focusIndex);
      if (
        this.matchedRule.enterExtract !== false &&
        !this.value.find(
          d => d.rule === this.matchedStr && d.label === option.label
        )
      ) {
        const merge = this.value.concat([
          { rule: this.matchedStr, label: option.label }
        ]);
        this.$emit("input", merge);
        this.$emit("change", merge);
      }
      // 拼接字符串
      this.target.value = `${startStr}${this.matchedStr}${option.label}${this
        .matchedRule.enterAdd || " "}${endStr}`;
      if (
        typeof this.target.selectionStart === "number" &&
        typeof this.target.selectionEnd === "number"
      ) {
        this.target.selectionStart = this.target.selectionEnd =
          startStr.length + this.matchedStr.length + option.label.length + 1;
      } else {
        alert("Error: Browser version is too low");
      }
      this.matchedStr = null;
      this.target.focus();
      this.change()
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        on(this.target, "keydown", this.keyDown);
        on(this.target, "click", this.change);
      }, 100);
    });
  },
  beforeDestroy() {
    off(this.target, "keydown", this.keyDown);
    off(this.target, "click", this.change);
  }
};
</script>

<style lang="scss" scoped>
.suggester {
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(27, 31, 35, 0.1);
  cursor: pointer;
  left: 0;
  min-width: var(--minWidth);
  position: fixed;
  top: 0;
  z-index: 1501;
  font-size: 14px;
  .suggester-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .suggester-list-item {
    border: 1px solid #dfe2e5;
    display: block;
    font-weight: 600;
    padding: 5px 10px;
    &:not(:last-child) {
      border-bottom: 0;
    }
    &:hover,
    &.active,
    &[aria-selected="true"] {
      background: #0366d6;
      border-color: #0366d6;
      color: #fff;
      text-decoration: none;
    }
    small {
      font-weight: 400;
    }
  }
}
</style>
