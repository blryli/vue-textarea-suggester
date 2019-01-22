import Vue from 'vue';

const isServer = Vue.prototype.$isServer;

// 用来绑定事件的方法，它是一个自执行的函数，会根据是否运行于服务器和是否支持addEventListener来返回一个function
export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, function(e) { handler(e) }, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, function(e) { handler(e) })
      }
    }
  }
})()

// 解除绑定事件
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();
