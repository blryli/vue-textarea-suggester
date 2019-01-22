<template>
  <div
    v-show="value"
    class="suggester"
    :style="{'--minWidth': minWidth, 'display': value ? 'block' : 'none'}"
  >
    <ul>
      <li v-if="!data.length">
        <img width="18" src="../../assets/loading.gif" alt>
      </li>
      <li v-for="(d, i) in data" :key="i" :class="{active: i === activeIndex}" @click="enter(i)">
        <slot :data="d">
          <strong>{{d.label}}</strong>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
import { getCursorPos } from "./getCursorPos";
import { on, off } from "../../utils/dom";

export default {
  name: "vue-textarea-suggester",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    target: HTMLTextAreaElement,
    minWidth: {
      type: String,
      default: "180px"
    }
  },
  data() {
    return {
      startIndex: null,
      focusIndex: null,
      data: [],
      activeIndex: null
    };
  },
  watch: {
    value(val) {
      !val && (this.data = []);
    }
  },
  methods: {
    show(startIndex) {
      const elem = this.target;
      const p = getCursorPos.getInputPositon(elem, startIndex);
      const s = this.$el;
      s.style.top = p.bottom + "px";
      s.style.left = p.left + "px";
    },
    isShow(count) {
      if (!this.target) return;
      const val = this.target.value;
      this.focusIndex = getCursorPos._getFocus(this.target);
      if (count) {
        if (count === "-") {
          this.focusIndex = this.focusIndex > 0 ? this.focusIndex - 1 : 0;
        } else if (count === "+") {
          this.focusIndex =
            this.focusIndex < val.length ? this.focusIndex + 1 : val.length;
        }
      }
      for (let i = 0; i < this.rules.length; i++) {
        const rule = this.rules[i];
        const fristBlank = val.lastIndexOf(" ", this.focusIndex - 1);
        const fristEnter = val.lastIndexOf("\n", this.focusIndex - 1);
        const startIndex = (this.startIndex =
          fristBlank > fristEnter ? fristBlank + 1 : fristEnter + 1);
        const str = val.substring(startIndex, this.focusIndex);
        const strFrist = str.substring(0, 1);
        const strEnd = str.substring(1);
        if (
          strFrist &&
          strFrist === rule.symbol &&
          rule.data.find(d =>
            d.label.toLowerCase().includes(strEnd.toLowerCase())
          )
        ) {
          this.data = rule.data.filter(d =>
            d.label.toLowerCase().includes(strEnd.toLowerCase())
          );
          this.show(startIndex);
          this.activeIndex = 0;
          this.$emit("input", true);
          !this.value && this.$emit("matched", strFrist);
          return;
        }
      }
      this.$emit("input", false);
    },
    keyDown(e) {
      switch (e.key) {
        case "ArrowLeft":
          this.isShow("-");
          break;
        case "ArrowRight":
          this.isShow("+");
          break;
        case "ArrowUp":
          if (this.value) {
            e.preventDefault();
            this.activeIndex =
              this.activeIndex > 0
                ? this.activeIndex - 1
                : this.data.length - 1;
          }
          break;
        case "ArrowDown":
          if (this.value) {
            e.preventDefault();
            this.activeIndex =
              this.activeIndex < this.data.length - 1
                ? this.activeIndex + 1
                : 0;
          }
          break;
        case "Enter":
          if (this.value) {
            e.preventDefault();
            this.enter();
          }
          break;
        default:
          break;
      }
    },
    enter(index) {
      if (!this.value || !this.target) return;
      const val = this.target.value;
      const activeIndex = index !== undefined ? index : this.activeIndex;
      const obj = this.data[activeIndex];
      const startStr = val.slice(0, this.startIndex + 1);
      const endStr = val.slice(this.focusIndex);
      this.target.value = `${startStr}${obj.label} ${endStr}`;
      if (
        typeof this.target.selectionStart === "number" &&
        typeof this.target.selectionEnd === "number"
      ) {
        this.target.selectionStart = this.target.selectionEnd =
          startStr.length + obj.label.length + 1;
      } else {
        alert("Error: Browser version is too low");
      }
      this.target.focus();
      this.$emit("input", false);
      this.$emit("check", obj);
    },
    windowClick(e) {
      !e.target.contains(this.target) && this.$emit("input", false);
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        on(this.target, "keydown", this.keyDown);
        on(this.target, "click", this.isShow);
        on(window, "click", this.windowClick);
      }, 0);
    });
  },
  beforeDestroy() {
    off(this.target, "keydown", this.keyDown);
    off(this.target, "click", this.isShow);
    off(window, "click", this.windowClick);
  }
};
</script>

<style lang="scss" scoped>
.suggester {
  background: #fff;
  border: 1px solid #dfe2e5;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(27, 31, 35, 0.1);
  cursor: pointer;
  left: 0;
  min-width: var(--minWidth);
  position: absolute;
  top: 0;
  z-index: 1501;
  font-size: 14px;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    border-bottom: 1px solid #dfe2e5;
    display: block;
    font-weight: 600;
    padding: 5px 10px;
    &:hover,
    &.active,
    &[aria-selected="true"] {
      background: #0366d6;
      color: #fff;
      text-decoration: none;
    }
    small {
      font-weight: 400;
    }
  }
}
</style>
