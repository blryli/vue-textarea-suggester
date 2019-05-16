import Vue from 'vue';

const isServer = Vue.prototype.$isServer;

// 用来绑定事件的方法，它是一个自执行的函数，会根据是否运行于服务器和是否支持addEventListener来返回一个function
export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, function (e) {
          handler(e)
        }, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, function (e) {
          handler(e)
        })
      }
    }
  }
})()

// 解除绑定事件
export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

export const debounce = function (delay, atBegin, callback) {
	return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
}

export const throttle = function ( delay, noTrailing, callback, debounceMode ) {
	var timeoutID;
	var cancelled = false;
  var lastExec = 0;
  
	function clearExistingTimeout () {
		if ( timeoutID ) {
			clearTimeout(timeoutID);
		}
	}

	// Function to cancel next exec
	function cancel () {
		clearExistingTimeout();
		cancelled = true;
	}

	// `noTrailing` defaults to falsy.
	if ( typeof noTrailing !== 'boolean' ) {
		debounceMode = callback;
		callback = noTrailing;
		noTrailing = undefined;
  }
  
	function wrapper () {

		var self = this;
		var elapsed = Date.now() - lastExec;
		var args = arguments;

		if (cancelled) {
			return;
		}

		function exec () {
			lastExec = Date.now();
			callback.apply(self, args);
		}

		function clear () {
			timeoutID = undefined;
		}

		if ( debounceMode && !timeoutID ) {
			exec();
		}

		clearExistingTimeout();

		if ( debounceMode === undefined && elapsed > delay ) {
			exec();
		} else if ( noTrailing !== true ) {
			timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
		}
	}

	wrapper.cancel = cancel;
	return wrapper;
}


