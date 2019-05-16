<template>
  <div class="vue-loading vue-loading-spin" :style="style">
    <i v-for="(d, i) in number" :key="i" :style="dotStyle(i)"></i>
  </div>
</template>

<script>
export default {
  props: {
    number: {
      type: Number,
      default: 6
    },
    size: {
      type: Number,
      default: 20
    },
    dotWidth: {
      type: Number,
      default: 6
    },
    dotHeight: {
      type: Number,
      default: 6
    },
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  computed: {
    style() {
      return { width: `${this.size}px`, height: `${this.size}px` };
    },
    avd() {
      return 360 / this.number;
    },
    ahd() {
      return (this.avd * Math.PI) / 180;
    },
    radius() {
      return this.size / 2;
    }
  },
  methods: {
    dotStyle(index) {
      let style = {
        width: `${this.dotWidth}px`,
        height: `${this.dotHeight}px`,
        left: this.getLeft(index),
        top: this.getTop(index),
        animationDelay: `-${index * 0.1}s`,
        backgroundColor: this.color
      };
      return style;
    },
    getLeft(index) {
      return (
        Math.sin(this.ahd * index) * this.radius +
        (this.size - this.dotWidth) / 2 +
        "px"
      );
    },
    getTop(index) {
      return (
        Math.cos(this.ahd * index) * this.radius +
        (this.size - this.dotHeight) / 2 +
        "px"
      );
    }
  },
  mounted() {}
};
</script>
