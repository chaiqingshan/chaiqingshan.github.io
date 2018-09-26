(function(e, t) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = t() : typeof define === "function" && define.amd ? define(t) : e.Ogma = t()
})(this, function() {
	"use strict";

	function e(value) {
		var e = this;
		var t = this.length;
		for (var r = 0; r < t; ++r) {
			e[r] = value
		}
		return this
	}
	function t(e, t) {
		if (this === null) {
			throw new TypeError("this is null or not defined")
		}
		var r = Object(this);
		var n = r.length >>> 0;
		var i = e >> 0;
		var o = i < 0 ? Math.max(n + i, 0) : Math.min(i, n);
		var s = t >> 0;
		var a = s < 0 ? Math.max(n + s, 0) : Math.min(s, n);
		var u = arguments[2];
		var l = u === undefined ? n : u >> 0;
		var d = l < 0 ? Math.max(n + l, 0) : Math.min(l, n);
		var f = Math.min(d - a, n - o);
		var h = 1;
		if (a < o && o < a + f) {
			h = -1;
			a += f - 1;
			o += f - 1
		}
		while (f > 0) {
			if (a in r) {
				r[o] = r[a]
			} else {
				delete r[o]
			}
			a += h;
			o += h;
			f--
		}
		return r
	}
	function r(e) {
		var t, r, n = Object(this),
			i = n.length >>> 0;
		if (i === 0) {
			return -1
		}
		t = i - 1;
		if (arguments.length > 1) {
			t = Number(arguments[1]);
			if (t !== t) {
				t = 0
			} else if (t !== 0 && t !== 1 / 0 && t !== -(1 / 0)) {
				t = (t > 0 || -1) * Math.floor(Math.abs(t))
			}
		}
		for (r = t >= 0 ? Math.min(t, i - 1) : i - Math.abs(t); r >= 0; r--) {
			if (r in n && n[r] === e) {
				return r
			}
		}
		return -1
	}
	var n = [Uint32Array, Uint16Array, Uint8Array, Int32Array, Int16Array, Int8Array, Float32Array, Float64Array, Array];
	var i = ["join", "slice", "reverse", "forEach", "map", "reduce", "indexOf", "sort", "filter", "every"];
	for (var o = 0, s = n.length; o < s; ++o) {
		var a = n[o].prototype;
		if (!a.fill) {
			a.fill = e
		}
		if (!a.copyWithin) {
			a.copyWithin = t
		}
		if (!a.lastIndexOf) {
			a.lastIndexOf = r
		}
		if (o < s - 1) {
			for (var u = 0, l = i.length; u < l; u++) {
				var d = i[u];
				if (!a[d]) {
					a[d] = Array.prototype[d]
				}
			}
		}
	}
	if (!ArrayBuffer.isView) {
		ArrayBuffer.isView = function(e) {
			for (var t = 0; t < n.length; ++t) {
				if (e instanceof n[t]) {
					return true
				}
			}
			return false
		}
	}
	if (!Float32Array.__proto__.from) {
		(function() {
			Float32Array.__proto__.from = function(e, t, r) {
				var n, i;
				var o = Int8Array.__proto__;
				if (typeof this !== "function") {
					throw new TypeError("# is not a constructor")
				}
				if (this.__proto__ !== o) {
					throw new TypeError("this is not a typed array.")
				}
				t = t ||
				function(e) {
					return e
				};
				if (typeof t !== "function") {
					throw new TypeError("specified argument is not a function")
				}
				e = Object(e);
				if (!e["length"]) {
					return new this(0)
				}
				var s = [];
				for (n = 0, i = e.length; n < i; n++) {
					s.push(e[n])
				}
				s = s.map(t, r);
				var a = new this(s.length);
				for (n = 0, i = a.length; n < i; n++) {
					a[n] = s[n]
				}
				return a
			}
		})()
	}
	var f = function(e, t) {
			for (t = this.length;~--t && (!(t in this) || this[t] !== e);) {}
			return t
		};
	Int8Array.prototype.lastIndexOf = Int8Array.prototype.lastIndexOf || f;
	Int16Array.prototype.lastIndexOf = Int16Array.prototype.lastIndexOf || f;
	Int32Array.prototype.lastIndexOf = Int32Array.prototype.lastIndexOf || f;
	Float32Array.prototype.lastIndexOf = Float32Array.prototype.lastIndexOf || f;
	Float64Array.prototype.lastIndexOf = Float64Array.prototype.lastIndexOf || f;
	if (!Math.log2) {
		Math.log2 = function(e) {
			return Math.log(e) / Math.log(2)
		}
	}
	if (!Number.isNaN) {
		Number.isNaN = function(value) {
			return typeof value === "number" && isNaN(value)
		}
	}
	var h = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};

	function c(e, t) {
		return t = {
			exports: {}
		}, e(t, t.exports), t.exports
	}(function(e) {
		var t = setTimeout;

		function r() {}
		function n(e, t) {
			return function() {
				e.apply(t, arguments)
			}
		}
		function i(e) {
			if (typeof this !== "object") {
				throw new TypeError("Promises must be constructed via new")
			}
			if (typeof e !== "function") {
				throw new TypeError("not a function")
			}
			this._state = 0;
			this._handled = false;
			this._value = undefined;
			this._deferreds = [];
			d(e, this)
		}
		function o(e, t) {
			while (e._state === 3) {
				e = e._value
			}
			if (e._state === 0) {
				e._deferreds.push(t);
				return
			}
			e._handled = true;
			i._immediateFn(function() {
				var r = e._state === 1 ? t.onFulfilled : t.onRejected;
				if (r === null) {
					(e._state === 1 ? s : a)(t.promise, e._value);
					return
				}
				var n;
				try {
					n = r(e._value)
				} catch (e) {
					a(t.promise, e);
					return
				}
				s(t.promise, n)
			})
		}
		function s(e, t) {
			try {
				if (t === e) {
					throw new TypeError("A promise cannot be resolved with itself.")
				}
				if (t && (typeof t === "object" || typeof t === "function")) {
					var r = t.then;
					if (t instanceof i) {
						e._state = 3;
						e._value = t;
						u(e);
						return
					} else if (typeof r === "function") {
						d(n(r, t), e);
						return
					}
				}
				e._state = 1;
				e._value = t;
				u(e)
			} catch (t) {
				a(e, t)
			}
		}
		function a(e, t) {
			e._state = 2;
			e._value = t;
			u(e)
		}
		function u(e) {
			if (e._state === 2 && e._deferreds.length === 0) {
				i._immediateFn(function() {
					if (!e._handled) {
						i._unhandledRejectionFn(e._value)
					}
				})
			}
			for (var t = 0, r = e._deferreds.length; t < r; t++) {
				o(e, e._deferreds[t])
			}
			e._deferreds = null
		}
		function l(e, t, r) {
			this.onFulfilled = typeof e === "function" ? e : null;
			this.onRejected = typeof t === "function" ? t : null;
			this.promise = r
		}
		function d(e, t) {
			var r = false;
			try {
				e(function(value) {
					if (r) {
						return
					}
					r = true;
					s(t, value)
				}, function(e) {
					if (r) {
						return
					}
					r = true;
					a(t, e)
				})
			} catch (e) {
				if (r) {
					return
				}
				r = true;
				a(t, e)
			}
		}
		i.prototype["catch"] = function(e) {
			return this.then(null, e)
		};
		i.prototype.then = function(e, t) {
			var n = new this.constructor(r);
			o(this, new l(e, t, n));
			return n
		};
		i.all = function(e) {
			var t = Array.prototype.slice.call(e);
			return new i(function(e, r) {
				if (t.length === 0) {
					return e([])
				}
				var n = t.length;

				function i(o, s) {
					try {
						if (s && (typeof s === "object" || typeof s === "function")) {
							var a = s.then;
							if (typeof a === "function") {
								a.call(s, function(e) {
									i(o, e)
								}, r);
								return
							}
						}
						t[o] = s;
						if (--n === 0) {
							e(t)
						}
					} catch (e) {
						r(e)
					}
				}
				for (var o = 0; o < t.length; o++) {
					i(o, t[o])
				}
			})
		};
		i.resolve = function(value) {
			if (value && typeof value === "object" && value.constructor === i) {
				return value
			}
			return new i(function(e) {
				e(value)
			})
		};
		i.reject = function(value) {
			return new i(function(e, t) {
				t(value)
			})
		};
		i.race = function(e) {
			return new i(function(t, r) {
				for (var n = 0, i = e.length; n < i; n++) {
					e[n].then(t, r)
				}
			})
		};
		i._immediateFn = typeof h.setImmediate === "function" &&
		function(e) {
			h.setImmediate(e)
		} ||
		function(e) {
			t(e, 0)
		};
		i._unhandledRejectionFn = function e(t) {
			if (typeof console !== "undefined" && console) {
				console.warn("Possible Unhandled Promise Rejection:", t)
			}
		};
		i._setImmediateFn = function e(t) {
			i._immediateFn = t
		};
		i._setUnhandledRejectionFn = function e(t) {
			i._unhandledRejectionFn = t
		};
		if (typeof h === "object" && !h.Promise) {
			h.exports = i
		}
		if (typeof window === "object" && !window.Promise) {
			window.Promise = i
		}
	})(h);
	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function(e, t) {
			var r = this.toString();
			if (typeof t !== "number" || !isFinite(t) || Math.floor(t) !== t || t > r.length) {
				t = r.length
			}
			t -= e.length;
			var n = r.lastIndexOf(e, t);
			return n !== -1 && n === t
		}
	}
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function(e, t) {
			return this.substr(t || 0, e.length) === e
		}
	}
	var p = 1;
	var g = function(e) {
			var t = this;
			if (e === void 0) e = {};
			if (this === undefined || this === null || this.constructor !== g) {
				return new g(e)
			}
			this._token = p++;
			this.modules = {};
			this.events = {};
			this.view = {};
			this.styles = {};
			this.parse = {};
			this.export = {};
			this.tools = {};
			for (var r = 0; r < v.length; ++r) {
				v[r](t, e)
			}
			for (var n = 0; n < y.length; ++n) {
				y[n](t, e)
			}
		};
	var v = [];
	var y = [];
	g.extend = function(e) {
		if (typeof e !== "function") {
			throw new TypeError("expected function")
		}
		v.push(e)
	};
	g.atInit = function(e) {
		if (typeof e !== "function") {
			throw new TypeError("expected function")
		}
		y.push(e)
	};
	var _ = function(e, t) {
			return e[t]
		};
	var m = function(e, t, value) {
			return e[t] = value
		};
	var x = {
		1: A(1),
		2: A(2),
		4: A(4),
		8: _,
		16: _,
		32: _,
		int8: _,
		float: _,
		any: _
	};
	var b = {
		1: w(1),
		2: w(2),
		4: w(4),
		8: m,
		16: m,
		32: m,
		int8: m,
		float: m,
		any: m
	};

	function A(e) {
		var t = "return (array[index / " + 8 / e + " | 0] >> ((index % " + 8 / e + ") * " + e + ")) & " + ((1 << e) - 1) + ";";
		return new Function("array", "index", t)
	}
	function w(e) {
		return new Function("array", "index", "value", "\n    var offset = (index % " + 8 / e + ") * " + e + ",\n        finalIndex = index / " + 8 / e + " | 0,\n        orMask = value << offset,\n        andMask = 255 - ((" + (Math.pow(2, e) - 1) + " - value) << offset);\n\n    array[finalIndex] = (array[finalIndex] & andMask) | orMask;")
	}
	var E = function e(t) {
			var r = t.storage,
				n = t.size || 0,
				i = t.
			default,
				o = Math.max(8, L(n + 1)),
				s = r === "resource" ? 1:
				r;
			if (i === undefined && r !== "any" && r !== "resource") {
				i = 0
			}
			this._storage = r;
			this._get = x[s];
			this._set = b[s];
			this._elementSize = s;
			this._nbElements = o;
			this._byName = undefined;
			this._byIndex = undefined;
			this._nextIndex = undefined;
			this._defaultValue = i;
			this._BASE_VALUE = r === "any" ? undefined : 0;
			this._methods = S;
			this._initialized = false;
			if (r === "resource") {
				this._methods = C;
				this._byName = {};
				this._byIndex = [];
				this._nextIndex = 1;
				this._byName[i] = 0;
				this._byIndex.push(i)
			}
		};
	E.prototype.get = function e() {
		return this._defaultValue
	};
	E.prototype.set = function e(t, value) {
		this._initialized = true;
		this._buffer = N(this._nbElements, this._elementSize);
		this.get = this._methods.get;
		this.set = this._methods.set;
		if (this._storage !== "resource" && this._defaultValue !== this._BASE_VALUE) {
			I(this, 0)
		}
		return this._methods.set.call(this, t, value)
	};
	E.prototype.increaseNbElements = function e(t) {
		var r = this;
		var n = L(t + 1);
		if (n <= this._nbElements) {
			return
		}
		if (this._initialized) {
			if (this._elementSize === "any") {
				for (var i = this._nbElements; i < n; ++i) {
					r._buffer.push(r._defaultValue)
				}
			} else {
				var o = N(n, this._elementSize);
				o.set(this._buffer);
				this._buffer = o;
				if (this._storage !== "resource" && this._defaultValue !== this._BASE_VALUE) {
					I(this, this._nbElements)
				}
			}
		}
		this._nbElements = n
	};
	E.prototype.increaseElementSize = function e() {
		var t = this._elementSize;
		if (typeof t !== "number" || t === 32) {
			throw new Error("Cannot increase size of elements")
		}
		var r = t * 2,
			n = x[r],
			i = b[r];
		if (this._initialized) {
			var o = this._nbElements,
				s = this._get,
				a = this._buffer,
				u = N(o, r);
			if (t >= 8) {
				u.set(a)
			} else {
				for (var l = 0; l < o; ++l) {
					i(u, l, s(a, l))
				}
			}
			this._buffer = u
		}
		this._elementSize = r;
		this._get = n;
		this._set = i
	};
	E.prototype.buffer = function e() {
		if (!this._buffer) {
			throw new Error("flexArray: buffer not instanciated")
		}
		return this._buffer
	};
	E.prototype.elementBitSize = function e() {
		return this._elementSize
	};
	E.prototype.capacity = function e() {
		return this._nbElements
	};
	E.prototype.byteSize = function e() {
		return this._nbElements * this._elementSize / 8
	};
	E.prototype.storage = function e() {
		return this._storage
	};
	E.prototype.getMultiple = function e(t, r) {
		var n = this;
		var i = t.length;
		if (r === undefined) {
			r = new Array(i)
		}
		for (var o = 0, s = i; o < s; ++o) {
			r[o] = n.get(t[o])
		}
		return r
	};
	E.prototype.setMultiple = function e(t, r) {
		var n = this;
		if (Array.isArray(r) || ArrayBuffer.isView(r)) {
			for (var i = 0, o = t.length; i < o; ++i) {
				n.set(t[i], r[i])
			}
		} else {
			for (var s = 0, a = t.length; s < a; ++s) {
				n.set(t[s], r)
			}
		}
	};
	E.prototype.reset = function e() {
		if (this._initialized) {
			I(this, 0)
		}
	};

	function I(e, t) {
		var value = e._storage === "resource" ? 0 : e._defaultValue;
		if (typeof e._elementSize !== "number" || e._elementSize >= 8) {
			e._buffer.fill(value, t)
		} else {
			var r = 8 / e._elementSize,
				n = 0;
			for (var i = 0; i < r; ++i) {
				n = n << e._elementSize;
				n += value
			}
			if (t === undefined) {
				e._buffer.fill(n)
			} else {
				var o = 8 - t % 8,
					s = t + o;
				for (var a = t; a < s; ++a) {
					e._set(e._buffer, a, value)
				}
				e._buffer.fill(n, s / 8)
			}
		}
	}
	var S = {
		get: function e(t) {
			return this._get(this._buffer, t)
		},
		set: function e(t, value) {
			this._set(this._buffer, t, value)
		}
	};
	var C = {
		get: function e(t) {
			return this._byIndex[this._get(this._buffer, t)]
		},
		set: function e(t, value) {
			var r = this._byName[value];
			if (r === undefined) {
				r = this._nextIndex++;
				this._byIndex.push(value);
				var n = T(this);
				if (n > this._elementSize) {
					this.increaseElementSize()
				}
				this._byName[value] = r
			}
			this._set(this._buffer, t, r)
		}
	};

	function T(e) {
		return Math.pow(2, Math.ceil(Math.log2(Math.log2(e._nextIndex))))
	}
	function L(e) {
		var t = 2;
		while (t < e) {
			t *= 2
		}
		return t
	}
	function N(e, t) {
		if (t === "any") {
			var r = new Array(e);
			return r
		} else if (t === "float") {
			return new Float32Array(e)
		} else if (t === "int8") {
			return new Int8Array(e)
		} else if (t === 32) {
			return new Uint32Array(e)
		} else if (t === 16) {
			return new Uint16Array(e)
		} else {
			return new Uint8Array(Math.ceil(e / 8 * t))
		}
	}
	var z = Array.isArray;
	var M = function e() {};
	M.prototype.on = function e(t, r) {
		if (typeof t !== "string") {
			throw new TypeError("Event name must be string")
		}
		if (typeof r !== "function") {
			throw new TypeError("Event handler must be function")
		}
		var n = this._events = this._events || {};
		var i = n[t] = n[t] || [];
		i.push(r);
		return this
	};
	M.prototype.off = function e(t, r) {
		if (typeof t !== "string") {
			throw new TypeError("Event name must be string")
		}
		var n = this._event = this._events || {};
		var i = n[t];
		if (z(i)) {
			if (typeof r !== "function") {
				n[t] = null
			} else {
				var o = i.indexOf(r);
				if (o !== -1) {
					i.splice(o, 1)
				}
				if (i.length === 0) {
					n[t] = null
				}
			}
		}
		return this
	};
	M.prototype.fire = function e(t) {
		var r = this;
		if (typeof t !== "string") {
			throw new TypeError("Event name must be string")
		}
		var n = this._event = this._events || {};
		var i = n[t],
			o;
		if (z(i)) {
			var s = Array.prototype.slice.call(arguments, 1);
			for (var a = 0; a < i.length; a++) {
				o = i[a];
				if (o) {
					o.apply(r, s)
				}
			}
		}
		return this
	};
	M.prototype.once = function e(t, r) {
		var n = this;
		var i = function() {
				r.apply(n, Array.prototype.slice.call(arguments, 0));
				n.off(t, i)
			};
		i.handler = r;
		return this.on(t, i)
	};
	M.prototype.hasListener = function e(t, r) {
		if (!t || !r) {
			return false
		}
		var n = this._events = this._events || {};
		var i = n[t];
		if (z(i)) {
			var o;
			for (var s = 0, a = i.length; s < a; s++) {
				o = i[s];
				if (o === r || o.handler === r) {
					return true
				}
			}
		}
		return false
	};
	M.prototype.getListeners = function e(t) {
		var r = this._events = this._events || {};
		return r[t]
	};
	M.mixin = function(e) {
		var t = typeof e === "function" ? e.prototype : e;
		var r = ["addEventListener", "removeEventListener", "addOneTimeEventListener", "dispatch", "on", "off", "once", "fire", "trigger"];
		for (var n = 0, i = r.length; n < i; n++) {
			var o = r[n];
			t[o] = M.prototype[o]
		}
		return e
	};
	M.prototype.addEventListener = M.prototype.on;
	M.prototype.removeEventListener = M.prototype.off;
	M.prototype.addOneTimeEventListener = M.prototype.once;
	M.prototype.trigger = M.prototype.dispatch = M.prototype.fire;
	var k = function() {
			var e = 0;
			return typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : function(t) {
				var r = Date.now();
				var n = Math.max(1, 16 - (r - e));
				var i = r + n;
				e = i;
				return setTimeout(function() {
					t(i)
				}, n)
			}
		}();
	var R = typeof cancelAnimationFrame !== "undefined" ? cancelAnimationFrame : function(e) {
			return clearTimeout(e)
		};

	function F(e, t) {
		return k(function(r) {
			e.call(t, r)
		})
	}
	function P(e) {
		if (e) {
			R(e)
		}
	}
	var D = null;
	if (typeof window !== "undefined" && typeof document !== "undefined") {
		var O = {
			opera: !! window.opr && !! window.opr.addons || !! window.opera || typeof navigator !== "undefined" && navigator.userAgent.indexOf(" OPR/") >= 0,
			firefox: typeof InstallTrigger !== "undefined",
			safari: Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0,
			ie: !! document.documentMode,
			edge: !document.documentMode && !! window.StyleMedia,
			chrome: !! window.chrome && !! window.chrome.webstore
		};
		for (var B in O) {
			if (O.hasOwnProperty(B) && O[B]) {
				D = B;
				break
			}
		}
	}
	if (!D && typeof global !== "undefined") {
		D = "node"
	}
	function U() {
		return D
	}
	function X(e) {
		var t = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		e = e.replace(t, function(e, t, r, n) {
			return t + t + r + r + n + n
		});
		var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
		if (r) {
			return [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255, 1]
		} else {
			return null
		}
	}
	function j(e) {
		var t = /^rgba?\(((?:\d*\.\d+)|(?:\d+))\s*,\s*((?:\d*\.\d+)|(?:\d+))\s*,\s*((?:\d*\.\d+)|(?:\d+))\s*(?:,\s*((?:\d*\.\d+)|(?:\d+)))?\)$/g;
		var r = t.exec(e);
		if (r) {
			return [parseInt(r[1]) / 255, parseInt(r[2]) / 255, parseInt(r[3]) / 255, r[4] === undefined ? 1 : parseFloat(r[4])]
		} else {
			return null
		}
	}
	function W(e) {
		if (e < 16) {
			return "0" + e.toString(16)
		} else {
			return e.toString(16)
		}
	}
	var G = [
		[0, 0, 0, 0]
	];
	var H = {};
	var Y = 1;

	function V(e, t) {
		if (!t) {
			return 0
		}
		H[e] = Y++;
		G.push(t);
		return Y - 1
	}
	function q(e) {
		var t = 0;
		if (typeof e === "string") {
			t = H[e];
			if (t === undefined) {
				if (e.charAt(0) === "#") {
					t = V(e, X(e))
				} else {
					t = V(e, j(e))
				}
			}
		}
		return t ? G[t] : null
	}
	var Z = ["AliceBlue", "#F0F8FF", "AntiqueWhite", "#FAEBD7", "Aqua", "#00FFFF", "Aquamarine", "#7FFFD4", "Azure", "#F0FFFF", "Beige", "#F5F5DC", "Bisque", "#FFE4C4", "Black", "#000000", "BlanchedAlmond", "#FFEBCD", "Blue", "#0000FF", "BlueViolet", "#8A2BE2", "Brown", "#A52A2A", "BurlyWood", "#DEB887", "CadetBlue", "#5F9EA0", "Chartreuse", "#7FFF00", "Chocolate", "#D2691E", "Coral", "#FF7F50", "CornflowerBlue", "#6495ED", "Cornsilk", "#FFF8DC", "Crimson", "#DC143C", "Cyan", "#00FFFF", "DarkBlue", "#00008B", "DarkCyan", "#008B8B", "DarkGoldenRod", "#B8860B", "DarkGray", "#A9A9A9", "DarkGrey", "#A9A9A9", "DarkGreen", "#006400", "DarkKhaki", "#BDB76B", "DarkMagenta", "#8B008B", "DarkOliveGreen", "#556B2F", "DarkOrange", "#FF8C00", "DarkOrchid", "#9932CC", "DarkRed", "#8B0000", "DarkSalmon", "#E9967A", "DarkSeaGreen", "#8FBC8F", "DarkSlateBlue", "#483D8B", "DarkSlateGray", "#2F4F4F", "DarkSlateGrey", "#2F4F4F", "DarkTurquoise", "#00CED1", "DarkViolet", "#9400D3", "DeepPink", "#FF1493", "DeepSkyBlue", "#00BFFF", "DimGray", "#696969", "DimGrey", "#696969", "DodgerBlue", "#1E90FF", "FireBrick", "#B22222", "FloralWhite", "#FFFAF0", "ForestGreen", "#228B22", "Fuchsia", "#FF00FF", "Gainsboro", "#DCDCDC", "GhostWhite", "#F8F8FF", "Gold", "#FFD700", "GoldenRod", "#DAA520", "Gray", "#808080", "Grey", "#808080", "Green", "#008000", "GreenYellow", "#ADFF2F", "HoneyDew", "#F0FFF0", "HotPink", "#FF69B4", "IndianRed", "#CD5C5C", "Indigo", "#4B0082", "Ivory", "#FFFFF0", "Khaki", "#F0E68C", "Lavender", "#E6E6FA", "LavenderBlush", "#FFF0F5", "LawnGreen", "#7CFC00", "LemonChiffon", "#FFFACD", "LightBlue", "#ADD8E6", "LightCoral", "#F08080", "LightCyan", "#E0FFFF", "LightGoldenRodYellow", "#FAFAD2", "LightGray", "#D3D3D3", "LightGrey", "#D3D3D3", "LightGreen", "#90EE90", "LightPink", "#FFB6C1", "LightSalmon", "#FFA07A", "LightSeaGreen", "#20B2AA", "LightSkyBlue", "#87CEFA", "LightSlateGray", "#778899", "LightSlateGrey", "#778899", "LightSteelBlue", "#B0C4DE", "LightYellow", "#FFFFE0", "Lime", "#00FF00", "LimeGreen", "#32CD32", "Linen", "#FAF0E6", "Magenta", "#FF00FF", "Maroon", "#800000", "MediumAquaMarine", "#66CDAA", "MediumBlue", "#0000CD", "MediumOrchid", "#BA55D3", "MediumPurple", "#9370DB", "MediumSeaGreen", "#3CB371", "MediumSlateBlue", "#7B68EE", "MediumSpringGreen", "#00FA9A", "MediumTurquoise", "#48D1CC", "MediumVioletRed", "#C71585", "MidnightBlue", "#191970", "MintCream", "#F5FFFA", "MistyRose", "#FFE4E1", "Moccasin", "#FFE4B5", "NavajoWhite", "#FFDEAD", "Navy", "#000080", "OldLace", "#FDF5E6", "Olive", "#808000", "OliveDrab", "#6B8E23", "Orange", "#FFA500", "OrangeRed", "#FF4500", "Orchid", "#DA70D6", "PaleGoldenRod", "#EEE8AA", "PaleGreen", "#98FB98", "PaleTurquoise", "#AFEEEE", "PaleVioletRed", "#DB7093", "PapayaWhip", "#FFEFD5", "PeachPuff", "#FFDAB9", "Peru", "#CD853F", "Pink", "#FFC0CB", "Plum", "#DDA0DD", "PowderBlue", "#B0E0E6", "Purple", "#800080", "RebeccaPurple", "#663399", "Red", "#FF0000", "RosyBrown", "#BC8F8F", "RoyalBlue", "#4169E1", "SaddleBrown", "#8B4513", "Salmon", "#FA8072", "SandyBrown", "#F4A460", "SeaGreen", "#2E8B57", "SeaShell", "#FFF5EE", "Sienna", "#A0522D", "Silver", "#C0C0C0", "SkyBlue", "#87CEEB", "SlateBlue", "#6A5ACD", "SlateGray", "#708090", "SlateGrey", "#708090", "Snow", "#FFFAFA", "SpringGreen", "#00FF7F", "SteelBlue", "#4682B4", "Tan", "#D2B48C", "Teal", "#008080", "Thistle", "#D8BFD8", "Tomato", "#FF6347", "Turquoise", "#40E0D0", "Violet", "#EE82EE", "Wheat", "#F5DEB3", "White", "#FFFFFF", "WhiteSmoke", "#F5F5F5", "Yellow", "#FFFF00", "YellowGreen", "#9ACD32"];
	for (var Q = 0; Q < Z.length; Q += 2) {
		var J = Z[Q].toLowerCase(),
			value = Z[Q + 1];
		V(J, X(value))
	}
	function K(e) {
		var t = q(e);
		return "#" + W(t[0]) + W(t[1]) + W(t[2])
	}
	g.libraries = Object.create(null);
	var $ = {};
	var ee = {};
	var te = function() {
			return null
		};
	if (typeof global === "object") {
		$ = global
	}
	if (typeof window === "object") {
		ee = window
	}
	if (typeof module === "object" && typeof module.require === "function") {
		te = function(e) {
			try {
				return module.require(e)
			} catch (e) {
				return null
			}
		}
	} else if (typeof $.require === "function") {
		te = function(e) {
			try {
				return $.require(e)
			} catch (e) {
				return null
			}
		}
	}
	function re(e, t) {
		var r = t.globalVarName;
		var n = t.fallback;
		var i = t.throwOnError;
		if (i === void 0) i = true;
		var o = null;
		if (!o && e) {
			o = g.libraries[e]
		}
		if (!o && r) {
			o = g.libraries[r]
		}
		if (!o && e) {
			o = te(e)
		}
		if (!o && r) {
			o = ee[r]
		}
		if (!o && r) {
			o = $[r]
		}
		if (!o && typeof n === "function") {
			o = n()
		}
		if (!o && n) {
			o = n
		}
		if (!o && i) {
			var s = 'unable to find module "' + e + '"' + (r ? " or global variable " + r : "") + "; make sure one of these statements is true:\n";
			s += "- require('" + e + "') returns the right library\n";
			s += "- Ogma.libraries['" + e + "'] is set to the right library\n";
			if (r) {
				s += "- window['" + r + "'] is set to the right library"
			}
			throw new Error(s)
		}
		return o
	}
	var ne = typeof performance !== "undefined" && performance.now ?
	function() {
		return performance.now() | 0
	} : function() {
		return Date.now()
	};

	function ie() {
		return ne()
	}
	function oe() {
		var e = new Date;
		var t = e.getDate();
		var r = e.getMonth() + 1;
		var n = e.getFullYear();
		if (t < 10) {
			t = "0" + t
		}
		if (r < 10) {
			r = "0" + r
		}
		return n + "-" + r + "-" + t
	}
	function se() {
		var e = new Date;
		return "[" + ae((e.getUTCHours() - (e.getTimezoneOffset() / 60 | 0)) % 24) + ":" + ae(e.getUTCMinutes()) + ":" + ae(e.getUTCSeconds()) + ":" + ae(e.getUTCMilliseconds(), 3) + "]"
	}
	function ae(e, t) {
		t = t || 2;
		var r = Math.pow(10, t - 1),
			n = e;
		while (r > 1) {
			if (e < r) {
				n = "0" + n
			}
			r /= 10
		}
		return n
	}
	function ue() {
		var e = null;
		return {
			fire: function(t, r) {
				if (e) {
					clearTimeout(e);
					e = null
				}
				e = setTimeout(function() {
					e = null;
					t()
				}, r)
			},
			stop: function() {
				if (e) {
					clearTimeout(e);
					e = null
				}
			}
		}
	}
	function le(e, value, t) {
		var r = Math.abs(value - e[0]),
			n = 0;
		for (var i = 1; i < e.length; ++i) {
			var o = Math.abs(value - e[i]);
			if (o < r) {
				r = o;
				n = i
			}
		}
		return t ? n : e[n]
	}
	function de(e) {
		return fe(Math.log(e) / Math.LN2)
	}
	function fe(e) {
		return typeof e === "number" && e % 1 === 0
	}
	function he(e, t, r) {
		if (r === 1) {
			return [e]
		}
		var n = (t - e) / (r - 1),
			i = new Array(r);
		for (var o = 0; o < r; ++o) {
			i[o] = e + n * o
		}
		return i
	}
	var ce = 100;

	function pe(e, t, r, n, i) {
		var o = e(r) <= e(n),
			s = r,
			a = n;
		for (var u = 0; u < ce; ++u) {
			var l = (s + a) / 2,
				value = e(l),
				d = Math.abs(value - t);
			if (d <= i) {
				return l
			}
			if (value < t) {
				if (o) {
					s = l
				} else {
					a = l
				}
			} else {
				if (o) {
					a = l
				} else {
					s = l
				}
			}
		}
		return l
	}
	function ge(e, t, r) {
		var value = t;
		while (value < e || value < r) {
			value *= t
		}
		return value
	}
	function ve() {
		var e = 0;
		return function() {
			return ++e
		}
	}
	function ye(e) {
		var t = typeof e;
		if (t === "string") {
			return e
		} else if (t === "function" || t === "number" || t === "boolean") {
			return e.toString()
		} else if (e === null) {
			return "null"
		} else if (e === undefined) {
			return "undefined"
		} else {
			return JSON.stringify(e)
		}
	}
	function _e(e) {
		if (typeof e === "string") {
			return e.split(".")
		} else if (Array.isArray(e)) {
			for (var t = 0; t < e.length; ++t) {
				if (typeof e[t] !== "string") {
					throw new TypeError(e[t] + " is not a string")
				}
			}
			return e.slice()
		} else {
			throw new TypeError('invalid property path "' + e + '": expected string or array of strings')
		}
	}
	function me(e, t, r) {
		var n, i, o, s;
		if (t === 0) {
			return function() {
				e.apply(r, arguments)
			}
		}
		s = function() {
			n = false;
			if (i) {
				o.apply(r, i);
				i = false
			}
		};
		o = function() {
			var o;
			if (n) {
				i = arguments
			} else {
				o = e.apply(r, arguments);
				setTimeout(s, t);
				n = true
			}
			return o
		};
		return o
	}
	function xe(e) {
		var t = e.toString();
		return t.substring(t.indexOf("{") + 1, t.lastIndexOf("}"))
	}
	var be = /^[+-]?(?:\d+|\d*[.,]\d+)(e\d+)?$/;

	function Ae(e) {
		if (typeof e === "number") {
			return isFinite(e) ? e : NaN
		} else if (typeof e === "string") {
			return be.test(e) ? parseFloat(e) : NaN
		} else {
			return NaN
		}
	}
	function we(e) {
		return !isNaN(Ae(e))
	}
	var Ee = function(e) {
			return typeof e === "boolean" || e === 0 || e === 1
		};
	var Ie = function(e) {
			return typeof e === "number" && isFinite(e)
		};
	var Se = function(e) {
			return typeof e === "number" && isFinite(e) && e >= 0
		};
	var Ce = function(e) {
			return typeof e === "number" && isFinite(e) && e > 0
		};
	var Te = function(e) {
			return typeof e === "string"
		};
	var Le = function(e) {
			return e === null || typeof e === "string" || typeof e === "number"
		};
	var Ne = function(e) {
			return q(e) !== null
		};
	var ze = function(e) {
			return e === null || q(e) !== null
		};
	var Me = function(e) {
			return new Function("x", "return " + e.map(function(e) {
				return "(x === " + e + ")"
			}).join("||"))
		};

	function ke(e) {
		return e !== null && typeof e === "object" && !Ke(e) && !(e instanceof RegExp) && (typeof HTMLElement === "undefined" || !(e instanceof HTMLElement))
	}
	function Re() {
		return se()
	}
	function Fe(e) {
		console.log(Re() + " " + e)
	}
	function Pe(e) {
		console.info(Re() + " " + e)
	}
	function De(e) {
		console.warn(Re() + " " + e)
	}
	function Oe(e) {
		console.error(Re() + " " + e)
	}
	function Be(e, t) {
		return e === undefined ? t : e
	}
	function Ue(e, t) {
		var r = Object.keys(e);
		for (var n = 0, i = r.length; n < i; ++n) {
			var o = r[n];
			t(e[o], o)
		}
	}
	function Xe(e, t) {
		return rt(e, t)
	}
	function je(e, t, r) {
		return nt(e, t, r)
	}
	function We(e, t) {
		if (!t) {
			return {
				nodes: e ? new e : Object.create(null),
				edges: e ? new e : Object.create(null),
				fetch: function(e) {
					return e ? this.nodes : this.edges
				}
			}
		} else {
			return {
				nodes: e,
				edges: t,
				fetch: function(e) {
					return e ? this.nodes : this.edges
				}
			}
		}
	}
	function Ge(e) {
		return ut(e)
	}
	function He(e) {
		var t = Object.keys(e),
			r = new Array(t.length);
		for (var n = 0; n < t.length; ++n) {
			r[n] = e[t[n]]
		}
		return r
	}
	function Ye(value, e, t) {
		return Tt(value, e, t)
	}
	function Ve(e) {
		var t = arguments;
		var r, n, i, o;
		for (r = 1, i = arguments.length; r < i; r++) {
			o = t[r];
			for (n in o) {
				e[n] = o[n]
			}
		}
		return e
	}
	function qe(e, t, value, r) {
		if (t in e) {
			throw new Error(r + " " + t + " already exists")
		}
		e[t] = value
	}
	function Ze(e, t, r) {
		if (Array.isArray(e)) {
			var n = e.indexOf(t);
			if (n === -1) {
				throw new Error(r + " " + t + " does not exist")
			}
			return n
		} else {
			if (!(t in e)) {
				throw new Error(r + " " + t + " does not exist")
			}
			return e[t]
		}
	}
	function Qe(e) {
		return e === undefined ? "undefined" : JSON.stringify(e)
	}
	function Je(e) {
		return Object.keys(e)
	}
	function Ke(value) {
		return Array.isArray(value) || ArrayBuffer.isView(value)
	}
	function $e(e, t) {
		return ft(e, t)
	}
	function et(e, t) {
		var r = Object.keys(t);
		for (var n = 0; n < r.length; ++n) {
			var i = r[n];
			e[i] = t[i]
		}
		return e
	}
	function tt(e) {
		return wt(e)
	}
	function rt(e, t, r) {
		if (Array.isArray(e)) {
			e.forEach(t, r)
		} else if (ke(e)) {
			var n = Object.keys(e);
			if (r) {
				for (var i = 0; i < n.length; ++i) {
					var o = n[i];
					t.call(r, e[o], o)
				}
			} else {
				for (i = 0; i < n.length; ++i) {
					o = n[i];
					t(e[o], o)
				}
			}
		} else {
			throw new Error("forEach: invalid argument " + JSON.stringify(e))
		}
	}
	function nt(e, t, r) {
		var value = r;
		Object.keys(e).forEach(function(r) {
			value = t(value, e[r])
		});
		return value
	}
	function it(e, t) {
		if (Array.isArray(e)) {
			return e.map(t)
		} else if (ke(e)) {
			var r = {},
				n = Object.keys(e);
			for (var i = 0; i < n.length; ++i) {
				var o = n[i];
				r[o] = t(e[o])
			}
			return r
		} else {
			throw new Error("map: invalid argument " + JSON.stringify(e))
		}
	}
	function ot(e, t) {
		var r = Object.keys(t);
		for (var n = 0, i = r.length; n < i; ++n) {
			var o = r[n];
			t[o] = e[o]
		}
		return t
	}
	function st(e) {
		var t = {};
		rt(e, function(value, e) {
			t[e] = value
		});
		return t
	}
	function at(e) {
		if (e === undefined) {
			return "undefined"
		} else {
			return JSON.stringify(e)
		}
	}
	function ut(e) {
		if (Array.isArray(e)) {
			t = new Array(e.length);
			for (n = 0; n < e.length; ++n) {
				t[n] = ut(e[n])
			}
			return t
		} else if (e !== null && e !== undefined && e.constructor === Object) {
			var t = {},
				r = Object.keys(e);
			for (var n = 0; n < r.length; ++n) {
				var i = r[n];
				t[i] = ut(e[i])
			}
			return t
		} else {
			return e
		}
	}
	function lt(e, t) {
		rt(t, function(t, value) {
			if (typeof value === "object" && value !== null) {
				if (typeof e[t] !== "object" || e[t] === null) {
					e[t] = {}
				}
				lt(e[t], value)
			} else {
				e[t] = value
			}
		})
	}
	function dt(e, t) {
		t.forEach(function(t) {
			if (e.indexOf(t) === -1) {
				e.push(t)
			}
		})
	}
	function ft(e, t) {
		if (typeof t === "string") {
			if (t.indexOf(".") === -1) {
				return e === null || e === undefined ? undefined : e[t]
			}
			var r = t.indexOf(".");
			while (e && r !== -1) {
				e = e[t.substr(0, r)];
				t = t.substr(r + 1);
				r = t.indexOf(".")
			}
			return e ? e[t] : undefined
		} else {
			for (var n = 0, i = t.length; n < i; ++n) {
				if (!e) {
					return undefined
				}
				e = e[t[n]]
			}
			return e
		}
	}
	function ht(e, t) {
		var r = t.indexOf(".");
		while (e && r !== -1) {
			e = e[t.substr(0, r)];
			t = t.substr(r + 1);
			r = t.indexOf(".")
		}
		return !!e && e.hasOwnProperty(t)
	}
	function ct(e, t, value) {
		var r = t.indexOf(".");
		while (r !== -1) {
			var n = t.substr(0, r),
				i = e[n];
			if (!i) {
				i = {};
				e[n] = i
			}
			t = t.substr(r + 1);
			r = t.indexOf(".");
			e = i
		}
		e[t] = value
	}
	var pt = function() {};

	function gt(e, t, r, n) {
		var i = t.indexOf(".");
		while (i !== -1) {
			var o = t.substr(0, i),
				s = e[o];
			if (!s) {
				s = {};
				e[o] = s
			}
			t = t.substr(i + 1);
			i = t.indexOf(".");
			e = s
		}
		var a = e[t];
		Object.defineProperty(e, t, {
			get: r ||
			function() {
				return a
			},
			set: n || pt,
			configurable: true
		})
	}
	function vt(e, t) {
		var r = t.indexOf("."),
			n = t;
		while (e && r !== -1) {
			e = e[t.substr(0, r)];
			t = t.substr(r + 1);
			r = t.indexOf(".")
		}
		if (!e) {
			throw new Error('No property "' + n + '" exist.')
		}
		var value = e[t];
		Object.defineProperty(e, t, {
			value: value,
			configurable: true
		})
	}
	function yt() {
		var e = arguments;
		var t = arguments.reduce(function(e, value) {
			return e + (value ? value.length : 0)
		}, 0),
			r = new Array(t),
			n = 0;
		for (var i = 0; i < arguments; ++i) {
			if (e[i]) {
				for (var o = 0; o < arguments[i].length; ++o) {
					r[n] = e[i][o];
					++n
				}
			}
		}
		return r
	}
	function _t(e) {
		var t = [];
		for (var r = 0, n = e.length; r < n; ++r) {
			var i = e[r];
			if (t.indexOf(i) === -1) {
				t.push(i)
			}
		}
		return t
	}
	function mt(e, t) {
		rt(t, function(t, r) {
			Object.defineProperty(e, r, {
				enumerable: true,
				get: t
			})
		})
	}
	var xt = function() {};
	var bt = /\{\s*\[native code\]\s*\}/;

	function At(e) {
		return typeof e === "string" && !bt.test("" + e)
	}
	function wt(e) {
		if (typeof e === "object") {
			var t = e.constructor;
			if (At(t)) {
				var r = Object.keys(t.prototype);
				for (var n = 0; n < r.length; ++n) {
					var i = r[n];
					if (typeof t.prototype[i] === "function") {
						e[i] = xt
					}
				}
			}
		}
	}
	function Et(e, t, r) {
		if (r === void 0) r = ".";
		if (!t) {
			t = function(e) {
				return !ke(e)
			}
		}
		var n = {},
			i = Object.keys(e);
		var o = function(o) {
				var s = i[o],
					value = e[s];
				if (!t(value)) {
					var a = Et(value, t);
					Ue(a, function(e, t) {
						n["" + s + r + t] = e
					})
				} else {
					n[s] = value
				}
			};
		for (var s = 0; s < i.length; ++s) o(s);
		return n
	}
	function It(e, t, value) {
		var r = t.split(".");
		for (var n = 0; n < r.length - 1; ++n) {
			var i = r[n],
				o = e[i];
			if (!o) {
				o = {};
				e[i] = o
			}
			e = o
		}
		e[r[r.length - 1]] = value
	}
	function St(e) {
		var t = {},
			r = Object.keys(e);
		for (var n = 0; n < r.length; ++n) {
			var i = r[n];
			It(t, i, e[i])
		}
		return t
	}
	function Ct(e, t, r) {
		if (r === void 0) r = [];
		var n = Object.keys(e);
		for (var i = 0; i < n.length; ++i) {
			var o = n[i],
				value = e[o],
				s = t ? t + o : o;
			if (typeof value !== "object" || value === null || Array.isArray(value)) {
				r.push(s)
			} else {
				Ct(value, s + ".", r)
			}
		}
		return r
	}
	function Tt(value, e, t) {
		if (value === undefined) {
			return Ge(e)
		}
		if (!ke(value) && t) {
			value = {};
			value[t] = value
		}
		if (ke(e)) {
			var r = {};
			for (var n in e) {
				var i = e[n],
					o = value[n];
				if (ke(i)) {
					r[n] = Tt(o, i)
				} else if (o === undefined) {
					r[n] = Ge(i)
				} else {
					r[n] = o
				}
			}
			return r
		} else {
			return value
		}
	}
	var Lt = re("xmldom", {
		throwOnError: false
	});
	var Nt = re("canvas", {
		throwOnError: false
	});
	var zt = null;
	var Mt = null;
	var kt = null;
	if (typeof XMLSerializer !== "undefined") {
		zt = XMLSerializer
	} else if (Lt) {
		zt = Lt.XMLSerializer
	}
	if (typeof document !== "undefined") {
		Mt = document
	} else if (Lt) {
		Mt = (new Lt.DOMImplementation).createDocument()
	}
	function Rt() {
		if (Mt) {
			return Mt
		} else {
			throw new Error('unable to use "document"; if you use Node JS install the "xmldom" package')
		}
	}
	function Ft() {
		if (Mt) {
			return Mt.implementation.createDocument("", "", null)
		} else {
			throw new Error('unable to create XML document; if you use Node JS install the "xmldom" package')
		}
	}
	function Pt(e) {
		if (zt) {
			return (new zt).serializeToString(e)
		} else {
			throw new Error('unable to instantiate XMLSerializer; if you use Node JS install the "xmldom" package')
		}
	}
	var Dt = 40;
	var Ot = 40;
	if (Nt) {
		kt = function(e, t) {
			if (e === void 0) e = Dt;
			if (t === void 0) t = Ot;
			var r = new Nt(e, t);
			r.style = {};
			return r
		}
	} else if (typeof document !== "undefined") {
		kt = function(e, t) {
			if (e === void 0) e = Dt;
			if (t === void 0) t = Ot;
			var r = document.createElement("canvas");
			Vt(r, e, t);
			return r
		}
	} else {
		kt = function(e, t) {
			if (e === void 0) e = Dt;
			if (t === void 0) t = Ot;
			return {
				__dummy: true,
				__context: new Bt,
				style: {},
				width: e,
				height: t,
				getContext: function e() {
					return this.__context
				},
				toDataURL: function e() {
					return "data:image/png;base64,"
				}
			}
		}
	}
	var Bt = function e() {};
	Bt.prototype.fill = function e() {};
	Bt.prototype.stroke = function e() {};
	Bt.prototype.clearRect = function e() {};
	Bt.prototype.fillRect = function e() {};
	Bt.prototype.strokeRect = function e() {};
	Bt.prototype.beginPath = function e() {};
	Bt.prototype.closePath = function e() {};
	Bt.prototype.moveTo = function e() {};
	Bt.prototype.lineTo = function e() {};
	Bt.prototype.arc = function e() {};
	Bt.prototype.measureText = function e(t) {
		return {
			width: t.length * 1.6
		}
	};
	Bt.prototype.drawImage = function e() {};

	function Ut() {
		return typeof window !== "undefined" && window.devicePixelRatio || 1
	}
	function Xt(e) {
		var t = ";base64,",
			r, n, i;
		if (e.indexOf(t) === -1) {
			r = e.split(",");
			n = r[0].split(":")[1];
			i = decodeURIComponent(r[1]);
			return Wt(i, n)
		}
		r = e.split(t);
		n = r[0].split(":")[1];
		i = window.atob(r[1]);
		var o = i.length;
		var s = new Uint8Array(o);
		for (var a = 0; a < o; ++a) {
			s[a] = i.charCodeAt(a)
		}
		return Wt([s], n)
	}
	function jt(e, t) {
		this.data = e;
		this.type = t
	}
	function Wt(e, t) {
		if (typeof Blob !== "undefined") {
			return new Blob(e, {
				type: t
			})
		} else {
			return new jt(e, t)
		}
	}
	function Gt(e) {
		if (typeof Blob !== "undefined") {
			return e instanceof Blob || e instanceof jt
		} else {
			return e instanceof jt
		}
	}
	function Ht(e, t, r) {
		if (typeof window === "undefined" || window["__OGMA_HEADLESS"]) {
			return e
		}
		var n = null,
			i = null,
			o = null;
		if (window.Blob) {
			if (r === "blob") {
				n = e
			} else if (r === "dataURL") {
				n = Ogma.utils.dataUrlToBlob(e)
			} else {
				n = Ogma.utils.createBlob([e], "text/xml")
			}
			i = window.URL.createObjectURL(n)
		} else {
			o = "data:text/xml;charset=UTF-8," + encodeURIComponent('<?xml version="1.0" encoding="UTF-8"?>') + encodeURIComponent(e)
		}
		if (navigator.msSaveBlob) {
			navigator.msSaveBlob(n, t)
		} else if (navigator.msSaveOrOpenBlob) {
			navigator.msSaveOrOpenBlob(n, t)
		} else {
			var s = document.createElement("a");
			s.setAttribute("href", window.Blob ? i : o);
			s.setAttribute("download", t);
			document.body.appendChild(s);
			s.click();
			document.body.removeChild(s)
		}
		if (i) {
			setTimeout(function() {
				window.URL.revokeObjectURL(i)
			}, 0)
		}
		return e
	}
	function Yt(e, t, r, n) {
		var i = document.createElement("div");
		document.body.appendChild(i);
		i.style.fontFamily = t;
		i.style.fontSize = r + "px";
		i.style.fontStyle = n === "italic" ? "italic" : "normal";
		i.style.fontWeight = n === "bold" ? "bold" : "normal";
		i.innerHTML = e;
		var o = i.offsetWidth;
		i.parentElement.removeChild(i);
		return o
	}
	function Vt(e, t, r) {
		var n = Ut();
		e.style.width = t + "px";
		e.style.height = r + "px";
		e.width = t * n;
		e.height = r * n
	}
	function qt(e, t, r, n, i) {
		var o = Rt().createElement(t);
		if (r) {
			rt(r, function(value, e) {
				if (value !== undefined) {
					o.setAttribute(e, value)
				}
			})
		}
		if (typeof n !== "undefined" || i) {
			if (Object.prototype.toString.call(n) === "[object Object]") {
				n = JSON.stringify(n)
			}
			var s = document.createTextNode(n);
			o.appendChild(s)
		}
		e.appendChild(o);
		return o
	}
	function Zt(e, t) {
		rt(t, function(value, t) {
			if (value !== undefined) {
				e.setAttribute(t, value)
			}
		})
	}
	function Qt(e, t) {
		var r = Rt().createElementNS("http://www.w3.org/2000/svg", e);
		if (!r.style) {
			r.style = {}
		}
		if (t) {
			Zt(r, t)
		}
		return r
	}
	function Jt(e, t, r, n) {
		n = n || 0;
		var i = ie();
		var o = n === 0 ? r : function(e) {
				var t = ie();
				if (t - i > n) {
					r(e);
					i = t
				}
			};
		e.addEventListener(t, o);
		return {
			listener: o,
			elt: e,
			eventName: t
		}
	}
	function Kt(e) {
		e.elt.removeEventListener(e.eventName, e.listener)
	}
	function $t(e, t) {
		if (typeof Image === "undefined") {
			t(null)
		} else {
			var r = new Image;
			r.src = e;
			r.onload = function() {
				t(r)
			};
			r.onerror = function() {
				t(null)
			}
		}
	}
	function er(e) {
		if (e.indexOf("http://") === 0 || e.indexOf("https://") === 0) {
			return e
		}
		var t = window.location.origin,
			r = window.location.pathname,
			n = r.lastIndexOf("/");
		if (n === -1) {
			t += "/" + e
		} else {
			t += r.substr(0, n) + "/" + e
		}
		return t
	}
	function tr(e) {
		return new Promise(function(t, r) {
			var n = new XMLHttpRequest;
			n.open("GET", er(e), true);
			n.onreadystatechange = function() {
				if (n.readyState === 4) {
					if (n.status === 200) {
						t(n.responseText)
					} else {
						r(n.status)
					}
				}
			};
			n.onerror = function(e) {
				r(e)
			};
			n.send()
		})
	}
	function rr(e) {
		return typeof HTMLElement !== "undefined" ? e instanceof HTMLElement : false
	}
	var nr = function e() {
			this.list = new Int32Array(8);
			this.size = 0;
			this.capacity = this.list.length
		};
	nr.prototype.add = function e(t) {
		if (this.size === this.capacity) {
			var r = new Int32Array(this.capacity * 2);
			r.set(this.list);
			this.list = r;
			this.capacity = this.list.length
		}
		this.list[this.size] = t;
		this.size += 1
	};
	nr.prototype.addIfMissing = function e(t) {
		if (!this.has(t)) {
			this.add(t);
			return true
		}
		return false
	};
	nr.prototype.remove = function e(t) {
		if (this.size === 0) {
			return false
		}
		var r = this.list.lastIndexOf(t, this.size - 1);
		if (r !== -1) {
			this.size -= 1;
			this.list[r] = this.list[this.size];
			return true
		}
		return false
	};
	nr.prototype.has = function e(t) {
		return this.size !== 0 && this.list.lastIndexOf(t, this.size - 1) !== -1
	};
	nr.prototype.clear = function e() {
		this.size = 0
	};
	nr.prototype.pop = function e() {
		this.size -= 1;
		return this.list[this.size]
	};
	var ir = {};

	function or(e) {
		return typeof e === "number" && isNaN(e)
	}
	var sr = function e() {
			this._keys = [];
			this._values = []
		};
	sr.prototype.set = function e(t, value) {
		var r = this._getIndex(t);
		if (r === -1) {
			this._keys.push(t.slice());
			this._values.push(value);
			return true
		} else {
			this._values[r] = value;
			return false
		}
	};
	sr.prototype.get = function e(t) {
		var r = this._getIndex(t);
		return r === -1 ? undefined : this._values[r]
	};
	sr.prototype.has = function e(t) {
		return this._getIndex(t) !== -1
	};
	sr.prototype.delete = function e(t) {
		var r = this._getIndex(t);
		if (r !== -1) {
			this._keys.splice(r, 1);
			this._values.splice(r, 1);
			return true
		} else {
			return false
		}
	};
	sr.prototype.keys = function e() {
		return this._keys.map(function(e) {
			return e.slice()
		})
	};
	sr.prototype.values = function e() {
		return this._values.slice()
	};
	sr.prototype._getIndex = function e(t) {
		var r = this;
		for (var n = 0; n < this._keys.length; ++n) {
			var i = r._keys[n];
			if (i.length === t.length) {
				var o = true;
				for (var s = 0; s < t.length; ++s) {
					var a = i[s],
						u = t[s];
					if (a !== u && (!or(a) || !or(u))) {
						o = false;
						break
					}
				}
				if (o) {
					return n
				}
			}
		}
		return -1
	};
	var ar = function e() {
			this.clear()
		};
	var ur = {
		size: {}
	};
	ar.prototype.clear = function e() {
		this._keys = [];
		this._values = [];
		this._arrays = new sr;
		this._size = 0
	};
	ur.size.get = function() {
		return this._size
	};
	ar.prototype.delete = function e(t) {
		if (Ke(t)) {
			if (this._arrays.delete(t)) {
				this._size -= 1;
				return true
			} else {
				return false
			}
		} else {
			var r = lr(this, t);
			if (r === -1) {
				return false
			} else {
				this._keys.splice(r, 1);
				this._values.splice(r, 1);
				this._size -= 1;
				return true
			}
		}
	};
	ar.prototype.get = function e(t) {
		if (Ke(t)) {
			return this._arrays.get(t)
		} else {
			var r = lr(this, t),
				value = r === -1 ? undefined : this._values[r];
			return value
		}
	};
	ar.prototype.has = function e(t) {
		return Ke(t) ? lr(this, t) !== -1 : this._arrays.has(t)
	};
	ar.prototype.set = function e(t, value) {
		if (Ke(t)) {
			if (this._arrays.set(t, value)) {
				this._size += 1
			}
		} else {
			var r = lr(this, t);
			if (r === -1) {
				this._size += 1;
				this._keys.push(or(t) ? ir : t);
				this._values.push(value)
			} else {
				this._values[r] = value
			}
		}
		return this
	};
	ar.prototype.keys = function e() {
		var e = this._keys.slice();
		for (var t = 0; t < e.length; ++t) {
			if (e[t] === ir) {
				e[t] = NaN
			}
		}
		return e.concat(this._arrays.keys())
	};
	ar.prototype.values = function e() {
		return this._values.slice().concat(this._arrays.values())
	};
	Object.defineProperties(ar.prototype, ur);

	function lr(e, t) {
		if (or(t)) {
			return e._keys.indexOf(ir)
		} else {
			return e._keys.indexOf(t)
		}
	}
	var dr = function e() {
			this._map = new Map;
			this._arrays = new sr
		};
	var fr = {
		size: {}
	};
	dr.prototype.clear = function e() {
		this._arrays = new sr;
		return this._map.clear()
	};
	dr.prototype.delete = function e(t) {
		return Ke(t) ? this._arrays.delete(t) : this._map.delete(t)
	};
	dr.prototype.get = function e(t) {
		return Ke(t) ? this._arrays.get(t) : this._map.get(t)
	};
	dr.prototype.set = function e(t, value) {
		if (Ke(t)) {
			this._arrays.set(t, value)
		} else {
			this._map.set(t, value)
		}
		return this
	};
	dr.prototype.keys = function e() {
		return Array.from(this._map.keys()).concat(this._arrays.keys())
	};
	dr.prototype.values = function e() {
		return Array.from(this._map.values()).concat(this._arrays.values())
	};
	fr.size.get = function() {
		return this._map.size + this._arrays._keys.length
	};
	Object.defineProperties(dr.prototype, fr);
	var hr = ar;
	if (typeof Map !== "undefined" && typeof Map.prototype.keys !== "undefined" && typeof Map.prototype.values !== "undefined") {
		try {
			(new Map).keys().next();
			(new Map).values().next();
			hr = dr
		} catch (e) {}
	}
	var cr = hr;
	var pr = 8;
	var gr = function e(t) {
			this._constructor = t;
			this._array = new t(pr);
			this._capacity = pr;
			this.length = 0
		};
	gr.prototype.reserve = function e(t) {
		if (this._capacity < t) {
			t = Math.pow(2, Math.ceil(Math.log2(t + 1)));
			var r = new this._constructor(t);
			r.set(this._array);
			this._capacity = t;
			this._array = r
		}
	};
	gr.prototype.has = function e(value) {
		var t = vr(this._array, value, 0, this.length);
		return t < this.length && this._array[t] === value
	};
	gr.prototype.add = function e(value) {
		var t = vr(this._array, value, 0, this.length),
			r = t < this.length && this._array[t] === value;
		if (!r) {
			if (this.length === this._capacity) {
				this.reserve(this.length + 1)
			}
			this._array.copyWithin(t + 1, t, this.length);
			this._array[t] = value;
			this.length += 1
		}
		return !r
	};
	gr.prototype.remove = function e(value) {
		var t = vr(this._array, value, 0, this.length),
			r = t < this.length && this._array[t] === value;
		if (r) {
			this._array.copyWithin(t, t + 1, this.length);
			this.length -= 1
		}
		return r
	};
	gr.prototype.removeByPosition = function e(t) {
		if (t >= this.length) {
			return false
		}
		this._array.copyWithin(t, t + 1, this.length);
		this.length -= 1;
		return true
	};
	gr.prototype.get = function e(t) {
		return this._array[t]
	};
	gr.prototype.clear = function e() {
		this.length = 0
	};
	gr.prototype.slice = function e() {
		return this._array.slice(0, this.length)
	};

	function vr(e, t, r, n) {
		if (r === n) {
			return r
		} else {
			var i = r + ((n - r) / 2 | 0),
				value = e[i],
				o = t - value;
			if (o === 0) {
				return i
			} else if (o < 0) {
				return vr(e, t, r, i)
			} else {
				return vr(e, t, i + 1, n)
			}
		}
	}
	function yr(e, t, r, n, i, o) {
		o = o || {};
		var s = distance(e, t, r, n),
			a = (r - e) / s,
			u = (n - t) / s,
			l = .5 * i * -u,
			d = .5 * i * a;
		o.x1 = e - l;
		o.y1 = t - d;
		o.x2 = e + l;
		o.y2 = t + d;
		return o
	}
	function _r(e, t, r, n, i, o, s) {
		var a = distance(r, n, i, o),
			u = (i - r) / a * (s / 2),
			l = (o - n) / a * (s / 2),
			d = r + l,
			f = n - u,
			h = r - l,
			c = n + u,
			p = i - l,
			g = o + u,
			v = i + l,
			y = o - u;
		var _ = e - d,
			m = t - f,
			x = h - d,
			b = c - f,
			A = v - d,
			w = y - f;
		var E = _ * x + m * b,
			I = x * x + b * b,
			S = _ * A + m * w,
			C = A * A + w * w;
		return 0 < E && E < I && 0 < S && S < C
	}
	function mr(e, t, r, n, i, o) {
		var s = i - r,
			a = o - n;
		return Math.abs(a * e - s * t + i * n + i * o) / Math.sqrt(s * s + a * a)
	}
	function xr(e, t, r, n, i, o) {
		var s = i - r,
			a = o - n,
			u = a / s,
			l = n - u * r,
			d, f;
		if (s === 0) {
			d = r;
			f = t
		} else {
			d = (s * e + a * t - l * a) / (s + u * a);
			f = u * d + l
		}
		return {
			x: d - e,
			y: f - t
		}
	}
	function br(e, t, r, n, i) {
		if (i && (Ar(e, r) || Ar(e, n) || Ar(t, r) || Ar(t, n))) {
			return false
		}
		var o = (e.y - r.y) * (n.x - r.x) - (e.x - r.x) * (n.y - r.y),
			s = (t.x - e.x) * (n.y - r.y) - (t.y - e.y) * (n.x - r.x);
		if (s === 0) {
			return false
		}
		var a = o / s;
		o = (e.y - r.y) * (t.x - e.x) - (e.x - r.x) * (t.y - e.y);
		var u = o / s;
		return !(a <= 0 || a >= 1 || u <= 0 || u >= 1)
	}
	function Ar(e, t) {
		return e.x === t.x && e.y === t.y
	}
	function wr(e, t, r, n) {
		console.log("zuo biao $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
		console.log(e)
		return Math.atan2(n - t, r - e)
	}
	function Er(e, t, r, n, i, o) {
		o = o || {};
		var s = distance(e, t, r, n),
			a = (r - e) / s,
			u = (n - t) / s;
		o.x = i * -u;
		o.y = i * a;
		return o
	}
	function Ir(e, t, r, n, i, o) {
		o = o || {};
		var s = distance(e, t, r, n);
		o.x = (r - e) / s * i;
		o.y = (n - t) / s * i;
		return o
	}
	function Sr(e, t, r, n, i, o) {
		return e >= r && e <= i && t >= n && t <= o
	}
	function Cr(e, t, r, n, i, o, s, a) {
		var u, l, d, f;
		var h = (a - o) * (r - e) - (s - i) * (n - t);
		if (h == 0) {
			return null
		}
		u = t - o;
		l = e - i;
		d = (s - i) * u - (a - o) * l;
		f = (r - e) * u - (n - t) * l;
		u = d / h;
		l = f / h;
		return {
			x: e + u * (r - e),
			y: t + u * (n - t)
		}
	}
	function Tr(e, t, r, n, i, o, s, a) {
		var u;
		var l = [];
		u = Cr(e, t, r, n, i, o, i, a);
		if (u) {
			l.push(u)
		}
		u = Cr(e, t, r, n, i, a, s, a);
		if (u) {
			l.push(u)
		}
		u = Cr(e, t, r, n, s, a, s, o);
		if (u) {
			l.push(u)
		}
		u = Cr(e, t, r, n, s, o, i, o);
		if (u) {
			l.push(u)
		}
		return l
	}
	function Lr(e, t, r, n, i) {
		var o = i[0];
		var s = i[1];
		var a = i[2];
		var u = i[3];
		var l = 0,
			d = 1;
		var f = r - e,
			h = n - t;
		var c, p, g;
		for (var v = 0; v < 4; v++) {
			if (v === 0) {
				c = -f;
				p = -(o - e)
			}
			if (v === 1) {
				c = f;
				p = s - e
			}
			if (v === 2) {
				c = -h;
				p = -(a - t)
			}
			if (v === 3) {
				c = h;
				p = u - t
			}
			g = p / c;
			if (c === 0 && p < 0) {
				return null
			}
			if (c < 0) {
				if (g > d) {
					return null
				} else if (g > l) {
					l = g
				}
			} else if (c > 0) {
				if (g < l) {
					return null
				} else if (g < d) {
					d = g
				}
			}
		}
		return [[e + l * f, t + l * h], [e + d * f, t + d * h]]
	}
	function Nr(e, t, r, n, i, o, s, a) {
		var u, l, d, f, h, c = {
			x: null,
			y: null,
			onLine1: false,
			onLine2: false
		};
		u = (a - o) * (r - e) - (s - i) * (n - t);
		if (u === 0) {
			return c
		}
		l = t - o;
		d = e - i;
		f = (s - i) * l - (a - o) * d;
		h = (r - e) * l - (n - t) * d;
		l = f / u;
		d = h / u;
		c.x = e + l * (r - e);
		c.y = t + l * (n - t);
		if (l > 0 && l < 1) {
			c.onLine1 = true
		}
		if (d > 0 && d < 1) {
			c.onLine2 = true
		}
		return c
	}
	function zr(e, t, r, n, i, o) {
		o = o || {};
		var s = Math.cos(i),
			a = Math.sin(i),
			u = e - r,
			l = t - n;
		o.x = s * u - a * l + r;
		o.y = a * u + s * l + n;
		return o
	}
	function distance(e, t, r, n) {
		return Math.sqrt((e - r) * (e - r) + (t - n) * (t - n))
	}
	function Mr(e, t, r, n) {
		var i = e - r;
		var o = t - n;
		return i * i + o * o
	}
	function kr(e, t, r, n, i, o) {
		return e - r >= n - o && e + r >= n + o && t - r >= i - o && t + r >= i + o
	}
	function Rr(e, t) {
		return (e.y - t.y) / (e.x - t.x)
	}
	function Fr(e, t, r) {
		var n = wr(e.x, e.y, t.x, t.y) - wr(r.x, r.y, t.x, t.y);
		if (n < 0) {
			n += 2 * Math.PI
		}
		return n
	}
	function Pr(e, t, r, n, i, o) {
		o = o || {};
		var s = distance(e, t, r, n);
		if (s === 0) {
			o.x = i;
			o.y = 0
		} else {
			var a = i / distance(e, t, r, n);
			o.x = (r - e) * a;
			o.y = (n - t) * a
		}
		return o
	}
	var Dr = ["x", "y", "ax", "ay", "zx", "zy", "ox", "oy"];

	function Or() {
		this.x = 0;
		this.y = 0;
		this.ax = 0;
		this.ay = 0;
		this.zx = 0;
		this.zy = 0;
		this.ox = 0;
		this.oy = 0
	}
	Or.prototype.reset = function() {
		var e = this;
		for (var t = 0; t < Dr.length; ++t) {
			e[Dr[t]] = 0
		}
		return this
	};
	Or.prototype.add = function(e) {
		var t = this;
		for (var r = 0; r < Dr.length; ++r) {
			var n = Dr[r];
			t[n] += e[n]
		}
		return this
	};
	Or.prototype.mergeCoordinates = function() {
		return {
			x: this.x + this.zx + this.ax + this.ox,
			y: this.y + this.zy + this.ay + this.oy
		}
	};
	Or.prototype.set = function(e) {
		var t = this;
		if (e instanceof Or) {
			for (var r = 0; r < Dr.length; ++r) {
				var n = Dr[r];
				t[n] = e[n]
			}
		} else {
			rt(e, function(value, e) {
				this[e] = value
			}, this)
		}
		return this
	};
	Or.prototype.setAll = function(e, t, r, n, i, o, s, a) {
		this.x = e;
		this.y = t;
		this.ax = i;
		this.ay = o;
		this.zx = r;
		this.zy = n;
		this.ox = s;
		this.oy = a;
		return this
	};
	Or.prototype.setXY = function(e, t) {
		this.x = e;
		this.y = t;
		return this
	};
	Or.prototype.setZXY = function(e, t) {
		this.zx = e;
		this.zy = t;
		return this
	};
	Or.prototype.setAXY = function(e, t) {
		this.ax = e;
		this.ay = t;
		return this
	};
	Or.prototype.setOXY = function(e, t) {
		this.ox = e;
		this.oy = t;
		return this
	};
	Or.prototype.addXY = function(e, t) {
		this.x += e;
		this.y += t;
		return this
	};
	Or.prototype.addZXY = function(e, t) {
		this.zx += e;
		this.zy += t;
		return this
	};
	Or.prototype.addOXY = function(e, t) {
		this.ox += e;
		this.oy += t;
		return this
	};
	Or.prototype.clone = function() {
		return (new Or).setAll(this.x, this.y, this.zx, this.zy, this.ax, this.ay, this.ox, this.oy)
	};

	function Br(e, t, r, n, i, o) {
		var s = e,
			a = t;
		r.x = s.x - a.x;
		r.y = s.y - a.y;
		r.ax = s.ax - a.ax;
		r.ay = s.ay - a.ay;
		r.zx = s.zx - a.zx;
		r.zy = s.zy - a.zy;
		r.ox = s.ox - a.ox;
		r.oy = s.oy - a.oy;
		n.x = s.x + a.x;
		n.y = s.y - a.y;
		n.ax = s.ax + a.ax;
		n.ay = s.ay - a.ay;
		n.zx = s.zx + a.zx;
		n.zy = s.zy - a.zy;
		n.ox = s.ox + a.ox;
		n.oy = s.oy - a.oy;
		i.x = s.x + a.x;
		i.y = s.y + a.y;
		i.ax = s.ax + a.ax;
		i.ay = s.ay + a.ay;
		i.zx = s.zx + a.zx;
		i.zy = s.zy + a.zy;
		i.ox = s.ox + a.ox;
		i.oy = s.oy + a.oy;
		o.x = s.x - a.x;
		o.y = s.y + a.y;
		o.ax = s.ax - a.ax;
		o.ay = s.ay + a.ay;
		o.zx = s.zx - a.zx;
		o.zy = s.zy + a.zy;
		o.ox = s.ox - a.ox;
		o.oy = s.oy + a.oy
	}
	var Ur = {
		x: 0,
		y: 0
	};

	function Xr(e, t, r, n, i, o, s, a) {
		Pr(e.x, e.y, t.x, t.y, .5, Ur);
		i.x = e.x - Ur.y * r;
		i.y = e.y + Ur.x * r;
		i.ax = e.ax - Ur.y * n;
		i.ay = e.ay + Ur.x * n;
		i.zx = e.zx;
		i.zy = e.zy;
		i.ox = e.ox;
		i.oy = e.oy;
		o.x = e.x + Ur.y * r;
		o.y = e.y - Ur.x * r;
		o.ax = e.ax + Ur.y * n;
		o.ay = e.ay - Ur.x * n;
		o.zx = e.zx;
		o.zy = e.zy;
		o.ox = e.ox;
		o.oy = e.oy;
		a.x = t.x - Ur.y * r;
		a.y = t.y + Ur.x * r;
		a.ax = t.ax - Ur.y * n;
		a.ay = t.ay + Ur.x * n;
		a.zx = t.zx;
		a.zy = t.zy;
		a.ox = t.ox;
		a.oy = t.oy;
		s.x = t.x + Ur.y * r;
		s.y = t.y - Ur.x * r;
		s.ax = t.ax + Ur.y * n;
		s.ay = t.ay - Ur.x * n;
		s.zx = t.zx;
		s.zy = t.zy;
		s.ox = t.ox;
		s.oy = t.oy
	}
	function jr(e) {
		var t = this;
		Array.call(this);
		Object.defineProperty(this, "__internalCounter", {
			value: {},
			writable: true
		});
		for (var r = 0; r < e; ++r) {
			t.push(new Or)
		}
		for (r = 0; r < Dr.length; ++r) {
			Wr(t, Dr[r])
		}
		for (r = 0; r < Gr.length; ++r) {
			t.__internalCounter[Gr[r]] = 0
		}
	}
	jr.prototype = Object.create(Array.prototype);
	jr.prototype.constructor = jr;

	function Wr(e, t) {
		Object.defineProperty(e, t, {
			get: function() {
				var e = this;
				var r = new Array(this.length);
				for (var n = 0; n < this.length; ++n) {
					r[n] = e[n][t]
				}
				return r
			},
			set: function(value) {
				var e = this;
				for (var r = 0; r < this.length; ++r) {
					e[r][t] = value
				}
			},
			enumerable: false
		})
	}
	var Gr = ["setXY", "setZXY", "setAXY", "setOXY"];
	jr.prototype.reset = function() {
		var e = this;
		for (var t = 0; t < Gr.length; ++t) {
			e.__internalCounter[Gr[t]] = 0
		}
		for (t = 0; t < this.length; ++t) {
			e[t].reset()
		}
		return this
	};
	for (var Hr = 0; Hr < Gr.length; ++Hr) {
		Yr(Gr[Hr])
	}
	function Yr(e) {
		jr.prototype[e] = function(t, r) {
			this[this.__internalCounter[e]][e](t, r);
			this.__internalCounter[e] += 1;
			if (this.__internalCounter[e] === this.length) {
				this.__internalCounter[e] = 0
			}
			return this
		}
	}
	jr.prototype.mergeCoordinates = function() {
		var e = this;
		var t = [];
		for (var r = 0; r < this.length; ++r) {
			t.push(e[r].mergeCoordinates())
		}
		return t
	};
	jr.prototype.getXYList = function() {
		var e = this;
		var t = new Array(this.length);
		for (var r = 0; r < this.length; ++r) {
			t[r] = {
				x: e[r].x,
				y: e[r].y
			}
		}
		return t
	};
	var Vr = [];
	var qr = [RegExp, Date];
	if (typeof HTMLElement !== "undefined") {
		Vr.push(HTMLElement)
	}
	function Zr(e, t) {
		for (var r = 0; r < t.length; ++r) {
			if (e instanceof t[r]) {
				return true
			}
		}
		return false
	}
	var Qr = function(e) {
			return typeof e !== "object" || e === null || Ke(e) || Zr(e, qr)
		};

	function Jr(e, t, r, n) {
		if (t === void 0) t = Qr;
		if (r === void 0) r = [];
		if (n === void 0) n = [];
		if (Zr(e, Vr)) {
			return
		}
		if (t(e)) {
			r.push({
				path: n.slice(),
				value: e
			})
		} else {
			var i = Object.keys(e);
			for (var o = 0; o < i.length; ++o) {
				var s = i[o],
					a = n.slice();
				a.push(s);
				Jr(e[s], t, r, a)
			}
		}
		return r
	}
	var Kr = function e() {
			this._keys = [];
			this._values = [];
			this._size = 0;
			this._cachedPath = [];
			this._cachedIndex = -1
		};
	var $r = {
		size: {}
	};
	$r.size.get = function() {
		return this._size
	};
	Kr.prototype.set = function e(t, value) {
		var r = en(this, t);
		if (r !== -1) {
			this._values = value
		} else {
			if (tn(this._cachedPath, t)) {
				this._cachedIndex = this._keys.length
			}
			this._keys.push(t);
			this._values.push(value);
			this._size += 1
		}
	};
	Kr.prototype.get = function e(t) {
		var r = en(this, t);
		if (r !== -1) {
			return this._values[r]
		} else {
			return undefined
		}
	};
	Kr.prototype.has = function e(t) {
		return en(this, t) !== -1
	};
	Kr.prototype.keys = function e() {
		return this._keys.slice()
	};
	Object.defineProperties(Kr.prototype, $r);

	function en(e, t) {
		if (tn(t, e._cachedPath)) {
			return e._cachedIndex
		}
		e._cachedPath = t.slice();
		for (var r = 0; r < e._keys.length; ++r) {
			if (tn(e._keys[r], t)) {
				e._cachedIndex = r;
				return r
			}
		}
		e._cachedIndex = -1;
		return -1
	}
	function tn(e, t) {
		if (e.length !== t.length) {
			return false
		}
		for (var r = 0; r < e.length; ++r) {
			if (e[r] !== t[r]) {
				return false
			}
		}
		return true
	}
	function rn(e, t, r, n, i, o, s, a, u) {
		if (s === 0) {
			return e.rectangle(t, {
				x: r + i / 2,
				y: n + o / 2
			}, {
				zx: i / 2,
				zy: o / 2
			}, a, u)
		} else {
			var l = e.updateComposite(t, 7);
			l[0] = e.quadrilateral(l[0], {
				x: r,
				y: n + s - 1
			}, {
				x: r + i,
				y: n + s - 1
			}, {
				x: r + i,
				y: n + o - s + 1
			}, {
				x: r,
				y: n + o - s + 1
			}, a, u);
			l[1] = e.quadrilateral(l[1], {
				x: r + s,
				y: n
			}, {
				x: r + i - s,
				y: n
			}, {
				x: r + i - s,
				y: n + s
			}, {
				x: r + s,
				y: n + s
			}, a, u);
			l[2] = e.quadrilateral(l[2], {
				x: r + s,
				y: n + o - s
			}, {
				x: r + i - s,
				y: n + o - s
			}, {
				x: r + i - s,
				y: n + o
			}, {
				x: r + s,
				y: n + o
			}, a, u);
			l[3] = e.circle(l[3], {
				x: r + s,
				y: n + s
			}, 0, s, a, u);
			l[4] = e.circle(l[4], {
				x: r + i - s,
				y: n + s
			}, 0, s, a, u);
			l[5] = e.circle(l[5], {
				x: r + s,
				y: n + o - s
			}, 0, s, a, u);
			l[6] = e.circle(l[6], {
				x: r + i - s,
				y: n + o - s
			}, 0, s, a, u);
			return e.composite(t, l)
		}
	}
	var nn = 50;

	function on(e, t, r, n, i, o, s, a) {
		var u = e.updateComposite(t, nn),
			l = Math.PI * 2 / nn,
			d = o / 2,
			f = l,
			h = {
				x: r,
				y: n,
				zx: i,
				zy: 0
			},
			c = {
				x: r,
				y: n,
				zx: i,
				zy: 0,
				ox: d,
				oy: 0
			};
		for (var p = 0; p < nn; ++p) {
			var g = Math.cos(f),
				v = Math.sin(f),
				y = {
					x: r,
					y: n,
					zx: g * i,
					zy: v * i
				},
				_ = {
					x: r,
					y: n,
					zx: g * i,
					zy: v * i,
					ox: g * d,
					oy: v * d
				};
			u[p] = e.quadrilateral(u[p], h, y, _, c, s, a);
			h = y;
			c = _;
			f += l
		}
		return e.composite(t, u)
	}
	var sn = function e(t) {
			this.size = 0;
			this.totalSize = 0;
			this.exists = [];
			this.attributes = {
				exists: this.exists
			};
			this._attributesList = [this.exists];
			this._availableIndexes = [];
			this._nbAvailableIndexes = 0;
			if (t) {
				this.addAttributes(t)
			}
		};
	sn.prototype.addAttribute = function e(t) {
		if (this.attributes[t]) {
			throw new Error("Attribute " + t + " already exists.")
		}
		this.attributes[t] = [];
		this._attributesList.push(this.attributes[t])
	};
	sn.prototype.addAttributes = function e(t) {
		var r = this;
		rt(t, function(e, t) {
			r.addAttribute(t, e)
		})
	};
	sn.prototype.reserve = function e(t) {};
	sn.prototype.addElement = function e() {
		var t = this;
		var r;
		if (this._nbAvailableIndexes === 0) {
			r = this.size;
			this.totalSize += 1;
			for (var n = 0; n < this._attributesList.length; ++n) {
				t._attributesList[n].push(0)
			}
		} else {
			this._nbAvailableIndexes -= 1;
			r = this._availableIndexes[this._nbAvailableIndexes];
			for (n = 0; n < this._attributesList.length; ++n) {
				t._attributesList[n][r] = 0
			}
		}
		this.exists[r] = 1;
		this.size += 1;
		return r
	};
	sn.prototype.removeElement = function e(t) {
		if (this.size > 0 && this.exists[t]) {
			this.exists[t] = 0;
			this.size -= 1;
			this._availableIndexes[this._nbAvailableIndexes] = t;
			this._nbAvailableIndexes += 1;
			return true
		}
		return false
	};
	sn.prototype.clear = function e() {
		var t = this;
		this.size = 0;
		this._nbAvailableIndexes = 0;
		for (var r = 0; r < this._attributesList.length; ++r) {
			t._attributesList[r].fill(0)
		}
	};
	sn.prototype.filter = function e(t) {
		var r = this.attributes.exists,
			n = this.attributes[t];
		if (!n) {
			throw new Error("attribute " + t + " does not exist")
		}
		var i = new Array(this.size),
			o = 0;
		for (var s = 0, a = this.totalSize; s < a; ++s) {
			if (r[o]) {
				i[o] = n[s];
				o += 1
			}
		}
		return i
	};
	sn.prototype.getIndexList = function e() {
		var t = this.attributes.exists,
			r = new Array(this.size),
			n = 0;
		for (var i = 0, o = this.totalSize; i < o; ++i) {
			if (t[n]) {
				r[n] = i;
				n += 1
			}
		}
		return r
	};
	sn.prototype.remove = sn.prototype.removeElement;
	sn.prototype.add = sn.prototype.addElement;
	var an = function e(t) {
			this._isNode = t;
			this._name = t ? "node" : "edge";
			this._nextIndex = 1;
			this._freeIndexes = [];
			this._idToIndex = Object.create(null);
			this._indexToId = [undefined];
			this._size = 0;
			this._flexArrays = [];
			this._defaultValues = [];
			this._flexArraysByName = {};
			this._indexes = []
		};
	an.prototype.addElements = function e(t) {
		var r = this;
		var n = [];
		for (var i = 0, o = t.length; i < o; ++i) {
			var s = t[i],
				a = r._idToIndex[s];
			if (a === undefined) {
				a = ln(r);
				r._idToIndex[s] = a;
				r._indexToId[a] = s
			}
			n.push(a)
		}
		this._size += t.length;
		for (var u = 0; u < this._flexArrays.length; ++u) {
			r._flexArrays[u].increaseNbElements(r._size)
		}
		this._indexes = this.getAllIndexes();
		return n
	};
	an.prototype.removeElements = function e(t) {
		var r = this;
		for (var n = 0, i = t.length; n < i; ++n) {
			var o = t[n],
				s = r._indexToId[o];
			if (s !== undefined) {
				delete r._idToIndex[s];
				un(r, o);
				r._size -= 1
			}
		}
		for (var a = 0; a < this._flexArrays.length; ++a) {
			var u = r._flexArrays[a],
				l = r._defaultValues[a];
			for (var d = 0, f = t.length; d < f; ++d) {
				u.set(t[d], l)
			}
		}
		this._indexes = this.getAllIndexes()
	};
	an.prototype.filterIds = function e(t) {
		var r = this;
		var n = Object.create(null),
			i = [];
		for (var o = 0, s = t.length; o < s; ++o) {
			var a = t[o];
			if (a in r._idToIndex && !(a in n)) {
				n[a] = 0;
				i.push(r._idToIndex[a])
			}
		}
		return i
	};
	an.prototype.clear = function e() {
		var t = this;
		this._idToIndex = Object.create(null);
		this._indexToId = [undefined];
		this._size = 0;
		this._nextIndex = 1;
		this._freeIndexes = [];
		this._indexes = [];
		for (var r = 0; r < this._flexArrays.length; ++r) {
			t._flexArrays[r].reset()
		}
	};
	an.prototype.has = function e(t) {
		return this._indexToId[t] !== undefined
	};
	an.prototype.hasId = function e(t) {
		return t in this._idToIndex
	};
	an.prototype.getIndex = function e(t, r) {
		if (r === void 0) r = false;
		var n = this._idToIndex[t];
		if (n === undefined && r) {
			throw new Error(this._name + ' id "' + t + '" not found')
		}
		return n
	};
	an.prototype.indexList = function e(t) {
		var r = this;
		var n = new Array(t.length);
		for (var i = 0, o = t.length; i < o; ++i) {
			var s = r._idToIndex[t[i]];
			if (s === undefined) {
				throw new Error(r._name + ' id "' + t[i] + '" not found')
			}
			n[i] = s
		}
		return n
	};
	an.prototype.getAllIndexes = function e() {
		var t = this;
		var r = this._nextIndex,
			n = this._freeIndexes.length,
			i = new Array(r);
		for (var o = 0; o < r; ++o) {
			i[o] = o
		}
		for (var s = 0; s < n; ++s) {
			var a = t._freeIndexes[s];
			for (var u = a; i[u] !== a; --u) {}
			i.splice(u, 1)
		}
		i.shift();
		return i
	};
	an.prototype.allIndexes = function e() {
		return this._indexes
	};
	an.prototype.createFlexArray = function e(t) {
		var r = t.name;
		if (r && this._flexArraysByName[r]) {
			throw new Error(this._name + ' flexArray "' + r + '" already exists')
		}
		var n = t.
	default;
		if (n === undefined && t.storage !== "any" && t.storage !== "resource") {
			n = 0
		}
		var i = this._nextIndex;
		var o = new E({
			storage: t.storage,
			size: i,
		default:
			n
		});
		this._flexArrays.push(o);
		this._defaultValues.push(t.
	default);
		if (r) {
			this._flexArraysByName[r] = o
		}
		return o
	};
	an.prototype.removeFlexArray = function e(t) {
		if (typeof t === "string") {
			var r = t;
			t = this._flexArraysByName[r];
			delete this._flexArraysByName[r]
		}
		var n = this._flexArrays.indexOf(t);
		if (n !== -1) {
			this._flexArrays.splice(n, 1);
			this._defaultValues.splice(n, 1)
		}
	};
	an.prototype.getFlexArray = function e(t) {
		return this._flexArraysByName[t] || null
	};
	an.prototype.getId = function e(t) {
		return this._indexToId[t]
	};
	an.prototype.getIdList = function e(t, r) {
		var n = this;
		if (!r) {
			r = new Array(t.length)
		}
		for (var i = 0; i < t.length; ++i) {
			r[i] = n._indexToId[t[i]]
		}
		return r
	};

	function un(e, t) {
		e._indexToId[t] = undefined;
		e._freeIndexes.push(t)
	}
	function ln(e) {
		var t;
		if (e._freeIndexes.length) {
			t = e._freeIndexes.pop()
		} else {
			t = e._nextIndex++
		}
		return t
	}
	var dn = 8;
	var fn = function e() {
			this._BIG_LIST = new Uint8Array([-1])[0];
			this._MAX_LIST_SIZE = 8;
			this._capacity = dn;
			this._buffer = new Uint32Array(this._capacity * this._MAX_LIST_SIZE);
			this._sizes = new Uint8Array(this._capacity);
			this._bigLists = [];
			this._nextIndex = 0;
			this._constList = new Array(this._MAX_LIST_SIZE)
		};
	fn.prototype.addEntry = function e(t) {
		if (t === undefined) {
			t = this._nextIndex++
		}
		if (t >= this._capacity) {
			this._expand(t + 1)
		}
		this._sizes[t] = 0;
		return t
	};
	fn.prototype.get = function e(t) {
		var r = this;
		var n = this._sizes[t],
			i = this._MAX_LIST_SIZE * t;
		if (n <= this._MAX_LIST_SIZE) {
			this._constList.length = n;
			for (var o = 0, s = n; o < s; ++o) {
				r._constList[o] = r._buffer[i + o]
			}
			return this._constList
		} else if (n === this._BIG_LIST) {
			var a = this._buffer[i];
			return this._bigLists[a]
		}
	};
	fn.prototype.size = function e(t) {
		var e = this._sizes[t];
		return e <= this._MAX_LIST_SIZE ? e : this._bigLists[this._buffer[t * this._MAX_LIST_SIZE]].length
	};
	fn.prototype.sizes = function e(t) {
		var e = this._sizes;
		var r = this._bigLists;
		var n = this._buffer;
		var i = this._MAX_LIST_SIZE;
		var o = t.length;
		var s = new Array(o);
		for (var a = 0; a < o; a++) {
			var u = t[a];
			var l = e[u];
			s[a] = l <= i ? l : r[n[u * i]].length
		}
		return s
	};
	fn.prototype.addTo = function e(t, value) {
		var r = this;
		var n = this._sizes[t],
			i = t * this._MAX_LIST_SIZE;
		if (n < this._MAX_LIST_SIZE) {
			this._buffer[i + n] = value;
			this._sizes[t] = n + 1
		} else if (n === this._BIG_LIST) {
			var o = this._buffer[i];
			this._bigLists[o].push(value)
		} else {
			var s = new Array(this._MAX_LIST_SIZE);
			for (var a = 0; a < this._MAX_LIST_SIZE; ++a) {
				s[a] = r._buffer[i + a]
			}
			s.push(value);
			this._bigLists.push(s);
			this._sizes[t] = this._BIG_LIST;
			this._buffer[i] = this._bigLists.length - 1
		}
	};
	fn.prototype.removeFrom = function e(t, value) {
		this.removeFromAndGetSize(t, value)
	};
	fn.prototype.removeFromAndGetSize = function e(t, value) {
		var r = this;
		var n = this._sizes[t],
			i = this._MAX_LIST_SIZE * t;
		if (n <= this._MAX_LIST_SIZE) {
			for (var o = i, s = i + n; o < s; ++o) {
				if (r._buffer[o] === value) {
					n -= 1;
					r._buffer[o] = r._buffer[s - 1];
					r._sizes[t] = n;
					return n
				}
			}
		} else if (n === this._BIG_LIST) {
			var a = this._buffer[i],
				u = this._bigLists[a],
				l = u.indexOf(value);
			if (l !== -1) {
				u.splice(l, 1);
				return u.length
			}
		}
		throw new Error('topology: Table: "removeFrom" failed, should not happen')
	};
	fn.prototype.reserve = function e(t) {
		if (this._capacity < t) {
			this._expand(t)
		}
	};
	fn.prototype._expand = function e(t) {
		this._capacity = Math.pow(2, Math.ceil(Math.log2(t)));
		this._buffer = hn(this._buffer, this._capacity * this._MAX_LIST_SIZE);
		this._sizes = hn(this._sizes, this._capacity)
	};

	function hn(e, t) {
		var r = new e.constructor(t);
		r.set(e);
		return r
	}
	var cn = function e(t, r) {
			this._graph = t;
			this._onUpdate = r;
			this._nodesToUpdate = this._graph._createIndexSet(true);
			this._edgesToUpdate = this._graph._createIndexSet(false);
			this._updateAll = false;
			this._timeout = null
		};
	cn.prototype.updateAll = function e() {
		this._updateAll = true;
		gn(this)
	};
	cn.prototype.updateNodes = function e(t) {
		this._nodesToUpdate.addMultiple(t);
		this._edgesToUpdate.addMultiple(this._graph._collectAdjacentEdges(t));
		gn(this)
	};
	cn.prototype.updateEdges = function e(t) {
		this._edgesToUpdate.addMultiple(t);
		gn(this)
	};

	function pn(e) {
		var t, r;
		if (e._updateAll) {
			t = e._graph._allIndexes(true).slice();
			r = e._graph._allIndexes(false).slice();
			e._nodesToUpdate.clear();
			e._edgesToUpdate.clear();
			e._updateAll = false
		} else {
			t = e._nodesToUpdate.clear();
			r = e._edgesToUpdate.clear()
		}
		e._timeout = null;
		e._onUpdate({
			nodes: t,
			edges: r
		})
	}
	function gn(e) {
		if (!e._timeout) {
			e._timeout = setTimeout(pn, 0, e)
		}
	}
	var vn = re("webworker-threads", {
		throwOnError: false
	});
	var yn = null;
	if (vn) {
		yn = vn.Worker
	}
	function _n(e) {
		if (yn) {
			return bn(e)
		} else if (typeof URL === "undefined" || navigator.appVersion.indexOf("MSIE 10") !== -1) {
			return xn(e)
		} else {
			return mn(e)
		}
	}
	function mn(e) {
		try {
			var t = new Blob([e], {
				type: "application/javascript"
			}),
				r = URL.createObjectURL(t),
				n = new Worker(r);
			return n
		} catch (t) {
			return new An(e)
		}
	}
	function xn(e) {
		return new An(e)
	}
	function bn(e) {
		return new yn(new Function(e))
	}
	var An = function e(t) {
			this._f = new Function("self", t);
			this._main = true;
			this._listeners = [];
			this._terminated = false;
			this._otherSide = new wn(this);
			this._f(this._otherSide)
		};
	An.prototype.terminate = function e() {
		this._terminated = false;
		this._otherSide._terminated = true
	};
	An.prototype.addEventListener = En;
	An.prototype.postMessage = In;
	var wn = function e(t) {
			this._main = false;
			this._listeners = [];
			this._terminated = false;
			this._otherSide = t
		};
	wn.prototype.addEventListener = En;
	wn.prototype.postMessage = In;

	function En(e, t) {
		this._listeners.push(t)
	}
	function In(e) {
		setTimeout(Sn, 0, this._otherSide, {
			data: e
		})
	}
	function Sn(e, t) {
		if (e._terminated) {
			return
		}
		for (var r = 0; r < e._listeners.length; ++r) {
			e._listeners[r](t)
		}
	}
	var Cn = {
		FlexArray: E,
		EventTarget: M,
		requestAnimFrame: F,
		cancelAnimFrame: P,
		getBrowser: U,
		parseColor: q,
		colorToHexa: K,
		createXmlDocument: Ft,
		serializeXMLDocument: Pt,
		get createCanvas() {
			return kt
		},
		getPixelRatio: Ut,
		dataUrlToBlob: Xt,
		createBlob: Wt,
		isBlob: Gt,
		promptDownload: Ht,
		computeTextWidth: Yt,
		resizeElement: Vt,
		createAndAppend: qt,
		setAttributes: Zt,
		createSvgElement: Qt,
		bindEvt: Jt,
		unbindEvt: Kt,
		getImage: $t,
		fetch: tr,
		isHTMLElement: rr,
		getClosestValue: le,
		isPowerOfTwo: de,
		isInteger: fe,
		computeRange: he,
		findFunctionParameter: pe,
		getUpperPowerOf: ge,
		createCounter: ve,
		convertToString: ye,
		toPropertyPath: _e,
		throttle: me,
		getFunctionBody: xe,
		convertToFloat: Ae,
		isParsableNumber: we,
		forEach: rt,
		reduce: nt,
		map: it,
		merge: ot,
		shallowCopy: st,
		stringify: at,
		deepCopy: ut,
		updateObject: lt,
		extendList: dt,
		propertyAccess: ft,
		hasProperty: ht,
		setPathValue: ct,
		bindProperty: gt,
		unbindProperty: vt,
		concat: yt,
		removeDuplicates: _t,
		setReadOnly: mt,
		isNotNative: At,
		kill: wt,
		flatten: Et,
		setProperty: It,
		unflatten: St,
		getFlattenedKeys: Ct,
		getOptions: Tt,
		Position: Or,
		PositionList: jr,
		rectangleFromCenterAndDimensions: Br,
		lineFromBoundaries: Xr,
		PathMap: Kr,
		objToValueList: Jr,
		roundedRect: rn,
		circleStroke: on,
		smartRequire: re,
		now: ie,
		getDate: oe,
		getTime: se,
		createDelayer: ue,
		isBool: Ee,
		isNumber: Ie,
		isPositive: Se,
		isStrictPositive: Ce,
		isString: Te,
		isText: Le,
		isColor: Ne,
		isOptionalColor: ze,
		isEnum: Me,
		createWorker: _n
	};

	function circleCircleIntersection(e, t, r, n, i, o) {
		var s, a, u, l, d, f, h;
		var c, p;
		a = n - e;
		u = i - t;
		l = Math.sqrt(a * a + u * u);
		if (l > r + o) {
			return null
		}
		if (l < Math.abs(r - o)) {
			return null
		}
		s = (r * r - o * o + l * l) / (2 * l);
		c = e + a * s / l;
		p = t + u * s / l;
		d = Math.sqrt(r * r - s * s);
		f = -u * (d / l);
		h = a * (d / l);
		return [[c + f, p + h], [c - f, p - h]]
	}
	function circleSortCompare(e, t, r, n, i, o) {
		if (e - i >= 0 && r - i < 0) {
			return 1
		}
		if (e - i < 0 && r - i >= 0) {
			return -1
		}
		if (e - i === 0 && r - i === 0) {
			return t - n >= 0 || n - o >= 0 ? t - n : n - t
		}
		var s = (e - i) * (n - o) - (r - i) * (t - o);
		if (s < 0) {
			return 1
		}
		if (s > 0) {
			return -1
		}
		var a = (e - i) * (e - i) + (t - o) * (t - o);
		var u = (r - i) * (r - i) + (n - o) * (n - o);
		return a - u
	}
	function Tn(e, t, r) {
		var n = e[2];
		var i = Math.abs(e[0] - t),
			o = Math.abs(e[1] - r);
		if (i + o <= n) {
			return true
		}
		if (i > n || o > n) {
			return false
		}
		return Math.sqrt(i * i + o * o) < n + 1e-12
	}
	function Ln(e, t, r, n) {
		var i = e[0] - t,
			o = e[1] - r,
			s = e[2] - n;
		return i * i + o * o < s * s + 1e-6
	}
	function Nn(e, t) {
		var r = Math.max(t.minX, Math.min(t.maxX, e[0]));
		var n = Math.max(t.minY, Math.min(t.maxY, e[1]));
		var i = e[0] - r;
		var o = e[1] - n;
		var s = i * i + o * o;
		return s < e[2] * e[2]
	}
	function zn(e, t, r, n, i, o) {
		return 1 / 2 * (-n * i + t * (-r + i) + e * (n - o) + r * o)
	}
	function Mn(e, t, r, n, i, o, s, a) {
		var u = zn(r, n, i, o, s, a);
		var l = 1 / (2 * u) * (n * s - r * a + (a - n) * e + (r - s) * t);
		var d = 1 / (2 * u) * (r * o - n * i + (n - o) * e + (i - r) * t);
		return l > 0 && d > 0 && 1 - l - d > 0
	}
	function kn(e, t, r, n, i, o) {
		var s = distance(r, n, i, o),
			a = distance(e, t, i, o),
			u = distance(e, t, r, n),
			l = s + a + u;
		if (l === 0) {
			return {
				x: e,
				y: t
			}
		} else {
			return {
				x: (s * e + a * r + u * i) / l,
				y: (s * t + a * n + u * o) / l
			}
		}
	}
	function Rn(e, t, r, n, i, o) {
		return {
			x: (e + r + i) / 3,
			y: (t + n + o) / 3
		}
	}
	function Fn(e, t, r, n, i, o) {
		return e >= r && e <= i && t >= n && t <= o
	}
	function Pn(e, t, r, n) {
		if (n === undefined) {
			n = r.length
		}
		var i = n - 1,
			o = false;
		for (var s = 0; s < n; ++s) {
			if ((r[s].y < t && r[i].y >= t || r[i].y < t && r[s].y >= t) && (r[s].x <= e || r[i].x <= e)) {
				o ^= r[s].x + (t - r[s].y) / (r[i].y - r[s].y) * (r[i].x - r[s].x) < e
			}
			i = s
		}
		return o
	}
	function Dn(e, t) {
		if (e < 0) {
			e += t
		} else if (e >= t) {
			e -= t
		}
		return e
	}
	function On(e) {
		for (var t = 0; t < e.length; ++t) {
			if (Bn(e, t)) {
				return t
			}
		}
		return 0
	}
	function Bn(e, t) {
		var r = Dn(t - 1, e.length),
			n = Dn(t + 1, e.length),
			i = Fr(e[r], e[t], e[n]);
		if (i > Math.PI) {
			return false
		}
		for (var o = 0; o < e.length; ++o) {
			if (o === t || o === r || o === n) {
				continue
			}
			if (Mn(e[o].x, e[o].y, e[r].x, e[r].y, e[n].x, e[n].y, e[t].x, e[t].y)) {
				return false
			}
		}
		return true
	}
	function Un(e) {
		if (e.length === 3) {
			return [[e[0].index, e[1].index, e[2].index]]
		}
		var t = On(e),
			r = [e[Dn(t - 1, e.length)].index, e[t].index, e[Dn(t + 1, e.length)].index];
		e.splice(t, 1);
		var n = Un(e);
		n.push(r);
		return n
	}
	function Xn(e) {
		var t = e.length,
			r = (t - 2) * Math.PI,
			n = 0;
		for (var i = 0; i < t; ++i) {
			var o = Fr(e[Dn(i - 1, t)], e[i], e[Dn(i + 1, t)]);
			n += o
		}
		var s = e.slice();
		for (i = 0; i < s.length; ++i) {
			s[i].index = i
		}
		if (n - 1e-4 > r) {
			s.reverse()
		}
		return Un(s)
	}
	function jn(e, t, r, n, i, o, s) {
		s = s || {};
		s.x = (e + r) / i + (n - t) / o;
		s.y = (t + n) / i + (e - r) / o;
		return s
	}
	function Wn(e, t, r, n, i, o, s, a) {
		a = a || {};
		a.x = (1 - e) * (1 - e) * t + 2 * (1 - e) * e * o + e * e * n;
		a.y = (1 - e) * (1 - e) * r + 2 * (1 - e) * e * s + e * e * i;
		return a
	}
	function Gn(e, t, r, n, i, o, s, a, u) {
		var l = distance(r, n, i, o);
		if (Math.abs(e - r) > l || Math.abs(t - n) > l) {
			return false
		}
		var d = distance(e, t, r, n),
			f = distance(e, t, i, o),
			h = .5,
			c = d < f ? -.01 : .01,
			p = .001,
			g = 100;
		Wn(h, r, n, i, o, s, a, qn);
		var v = distance(e, t, qn.x, qn.y),
			y;
		while (g-- > 0 && h >= 0 && h <= 1 && v > u && (c > p || c < -p)) {
			y = v;
			Wn(h, r, n, i, o, s, a, qn);
			v = distance(e, t, qn.x, qn.y);
			if (v > y) {
				c = -c / 2;
				h += c
			} else if (h + c < 0 || h + c > 1) {
				c = c / 2;
				v = y
			} else {
				h += c
			}
		}
		return v < u
	}
	var Hn = 7;

	function Yn(e, t, r, n) {
		n = n || {};
		n.x1 = e - r * Hn;
		n.y1 = t;
		n.x2 = e;
		n.y2 = t + r * Hn;
		return n
	}
	function Vn(e, t, r, n, i, o, s, a, u, l) {
		l = l || {};
		var d = (1 - e) * (1 - e) * (1 - e),
			f = 3 * e * (1 - e) * (1 - e),
			h = 3 * e * e * (1 - e),
			c = e * e * e;
		l.x = d * t + f * o + h * a + c * n;
		l.y = d * r + f * s + h * u + c * i;
		return l
	}
	var qn = {};

	function Zn(e, t, r, n, i, o, s, a, u, l, d) {
		var f = distance(r, n, s, a);
		if (Math.abs(e - r) > f || Math.abs(t - n) > f) {
			return false
		}
		var h = distance(e, t, r, n),
			c = distance(e, t, i, o),
			p = .5,
			g = h < c ? -.01 : .01,
			v = .001,
			y = 100,
			_ = Vn(p, r, n, i, o, s, a, u, l),
			m = distance(e, t, _.x, _.y),
			x;
		while (y-- > 0 && p >= 0 && p <= 1 && m > d && (g > v || g < -v)) {
			x = m;
			Vn(p, r, n, i, o, s, a, u, l, _);
			m = distance(e, t, _.x, _.y);
			if (m > x) {
				g = -g / 2;
				p += g
			} else if (p + g < 0 || p + g > 1) {
				g = g / 2;
				m = x
			} else {
				p += g
			}
		}
		return m < d
	}
	function Qn(e, t, r, n, i, o) {
		var s = Math.sqrt,
			a = Math.log,
			u = e - 2 * r + i,
			l = t - 2 * n + o,
			d = 2 * r - 2 * e,
			f = 2 * n - 2 * t,
			h = 4 * (u * u + l * l),
			c = 4 * (u * d + l * f),
			p = d * d + f * f,
			g = 2 * s(h + c + p),
			v = s(h),
			y = 2 * h * v,
			_ = 2 * s(p),
			m = c / v;
		return (y * g + v * c * (g - _) + (4 * p * h - c * c) * a((2 * v + m + g) / (m + _))) / (4 * y)
	}
	var Jn = 100;
	var Kn = 1 / Jn;
	var $n = {};

	function ei(e, t, r, n, i, o, s, a) {
		var u = 0,
			l = e,
			d = t;
		for (var f = Kn; f <= 1; f += Kn) {
			Vn(f, e, t, s, a, r, n, i, o, $n);
			u += distance(l, d, $n.x, $n.y);
			l = $n.x;
			d = $n.y
		}
		return u
	}
	var ti = {
		circleCircleIntersection: circleCircleIntersection,
		circleSortCompare: circleSortCompare,
		circleContainsPoint: Tn,
		circleContainsCircle: Ln,
		circleIntersectsBox: Nn,
		lineFromPoint: yr,
		isPointInLine: _r,
		distanceFromLine: mr,
		vectorToLine: xr,
		twoSegmentsIntersect: br,
		lineAngle: wr,
		orthogonal: Er,
		normalize: Ir,
		isPointInsideRectangle: Sr,
		segmentIntersection: Cr,
		lineRectangleIntersection: Tr,
		clipLine: Lr,
		lineIntersection: Nr,
		unitVector: Pr,
		rotate: zr,
		distance: distance,
		squaredDistance: Mr,
		squareContainsSquare: kr,
		slope: Rr,
		angle: Fr,
		isPointInTriangle: Mn,
		incenter: kn,
		centroid: Rn,
		isPointInRectangle: Fn,
		isPointInPolygon: Pn,
		triangulatePolygon: Xn,
		getQuadraticControlPoints: jn,
		getPointOnQuadraticCurve: Wn,
		isPointOnQuadraticCurve: Gn,
		SELF_LOOP_SIZE_MULTIPLIER: Hn,
		getSelfLoopControlPoints: Yn,
		getPointOnBezierCurve: Vn,
		isPointOnBezierCurve: Zn,
		quadraticCurveLength: Qn,
		cubicCurveLength: ei
	};

	function weightedStress(e, t, r, n, i, o) {
		var s = 0,
			a, u, l, d, f, h;
		for (l = 0; l < n; l++) {
			for (d = 0; d < n; d++) {
				var c = o[l],
					p = o[d];
				if (c !== p) {
					u = e[c][p];
					u *= i;
					a = 1 / (u * u);
					if (a) {
						f = t[c] - t[p];
						h = r[c] - r[p];
						s += a * Math.pow(u - Math.sqrt(f * f + h * h), 2)
					}
				}
			}
		}
		return s
	}
	function distanceStress(e, t, r, n, i, o, s) {
		var a = 0,
			u, l, d, f, h, c;
		if (i === -1) {
			return 0
		}
		for (u = 0; u < n; u++) {
			for (l = 0; l < n; l++) {
				var p = s[u],
					g = s[l];
				if (p !== g && (p === i || g === i)) {
					d = e[p][g];
					d *= o;
					f = 1 / (d * d);
					if (f) {
						h = t[p] - t[g];
						c = r[p] - r[g];
						a += f * Math.pow(d - Math.sqrt(h * h + c * c), 2)
					}
				}
			}
		}
		return a
	}
	function constrainedStress(e, t, r, n, i, o, s, a) {
		s = s || 0;
		var weightedStress = 0;
		var distanceStress = 0;
		var u, l, d, f, h, c, p;
		for (u = 0; u < n; u++) {
			for (l = 0; l < n; l++) {
				var g = a[u],
					v = a[l];
				if (g !== v) {
					d = e[g][v];
					d *= o;
					f = 1 / (d * d);
					if (f) {
						h = t[g] - t[v];
						c = r[g] - r[v];
						p = f * Math.pow(d - Math.sqrt(h * h + c * c), 2);
						weightedStress += p;
						if (g === i || v === i) {
							distanceStress += p
						}
					}
				}
			}
		}
		return (1 - s) * weightedStress + s * distanceStress
	}
	function stressMinimizationStep(e, t, r, n, i, o, s, a, u) {
		var l = t,
			d = r;
		var f = 1e-6;
		s = s || 0;
		i = typeof i === "undefined" ? -1 : i;
		if (i === -1) {
			s = 0
		}
		var h, c, p, g, v;
		var y = t[i],
			_ = r[i];
		for (var m = 0; m < n; m++) {
			var x = a[m];
			var b = u(e[i][m]);
			var A = s / (b * b);
			if (b === 0) {
				continue
			}
			var w = 0,
				E = 0,
				I = 0,
				S;
			var C = t[x],
				T = r[x];
			for (S = 0; S < n; S++) {
				var L = a[S],
					N, z, M, k, R;
				if (L !== x) {
					N = e[x][L] * o;
					z = 1 / (N * N);
					M = t[L];
					k = r[L];
					if (z !== 0) {
						c = C - M;
						p = T - k;
						g = c * c + p * p;
						R = g < f ? 0 : 1 / Math.sqrt(g);
						E += (1 - s) * z * (M + N * (C - M) * R);
						I += (1 - s) * z * (k + N * (T - k) * R)
					}
					w += z
				}
			}
			h = (1 - s) * w + A;
			if (h !== 0) {
				c = C - y;
				p = T - _;
				g = c * c + p * p;
				g = g < f ? 0 : 1 / Math.sqrt(g);
				v = b === 0 ? 0 : A * (b * g);
				l[x] = (E + v * t[x]) / h;
				d[x] = (I + v * r[x]) / h
			}
		}
		return {
			X: l,
			Y: d
		}
	}
	function stressMinimizationStepGeneral(e, t, r, n, i, o, s, a) {
		var u = t,
			l = r;
		var d = 1e-6;
		s = s || 0;
		i = typeof i === "undefined" ? -1 : i;
		if (i === -1) {
			s = 0
		}
		var f;
		for (var h = 0; h < n; h++) {
			var c = a[h];
			var p = 0,
				g = 0,
				v = 0,
				y, _;
			var m = t[c],
				x = r[c];
			var b, A, w;
			for (y = 0; y < n; y++) {
				var E = a[y],
					I, S, C, T, L;
				var N = 0;
				if (E !== c) {
					_ = e[c][E] * o;
					I = 1 / (_ * _);
					if (c === i || E === i) {
						N = I
					}
					L = (1 - s) * I + s * N;
					p += L;
					if (I !== 0) {
						S = t[E];
						C = r[E];
						b = m - S;
						A = x - C;
						w = b * b + A * A;
						if (w > d) {
							T = 1 / Math.sqrt(w)
						}
						g += L * (S + _ * (m - S) * T);
						v += L * (C + _ * (x - C) * T)
					}
				}
			}
			f = p;
			if (f !== 0) {
				u[c] = g / f;
				l[c] = v / f
			}
		}
		return {
			X: u,
			Y: l
		}
	}
	function minHeap(e, t, r, n) {
		if (e === void 0) e = function(e, t) {
			return e - t
		};
		if (t === void 0) t = [];
		if (r === void 0) r = {};
		if (n === void 0) n = function(e) {
			return e
		};
		var i = t.length;

		function o(o) {
			while (true) {
				var s = 2 * o + 1;
				var a = s + 1;
				var u = o;
				if (s < i && e(t[s], t[u]) < 0) {
					u = s
				}
				if (a < i && e(t[a], t[u]) < 0) {
					u = a
				}
				if (u === o) {
					return o
				}
				var l = t[u];
				t[u] = t[o];
				t[o] = l;
				r[n(t[u])] = u;
				r[n(l)] = o;
				o = u
			}
		}
		var s = {
			heapify: o,
			pop: function e() {
				if (i <= 0) {
					return undefined
				}
				if (i === 1) {
					i--;
					return t[0]
				}
				var r = t[0];
				t[0] = t[i - 1];
				i--;
				o(0);
				return r
			},
			decreaseKey: function i(o, value) {
				if (value !== undefined) {
					t[o] = value;
					r[n(value)] = o
				}
				while (o > 0) {
					var s = o - 1 >> 1;
					if (e(t[s], t[o]) > 0) {
						var a = t[o];
						t[o] = t[s];
						t[s] = a;
						r[n(t[o])] = o;
						r[n(a)] = s;
						o = s
					} else {
						break
					}
				}
				return o
			},
			min: function e() {
				return t[0]
			},
			remove: function e(t) {
				this.decreaseKey(t, Number.NEGATIVE_INFINITY);
				return this.pop()
			},
			push: function o(s) {
				i++;
				var a = i - 1;
				t[a] = s;
				while (a > 0) {
					var u = a - 1 >> 1;
					if (e(t[u], t[a]) > 0) {
						var l = t[a];
						t[a] = t[u];
						t[u] = l;
						r[n(t[a])] = a;
						r[n(l)] = u;
						a = u
					} else {
						break
					}
				}
				return a
			},
			empty: function e() {
				return i <= 0
			},
			toArray: function e() {
				return t.slice(0, i)
			}
		};
		Object.defineProperty(s, "keys", {
			get: function() {
				return r
			},
			enumerable: true
		});
		Object.defineProperty(s, "size", {
			get: function() {
				return i
			},
			enumerable: true
		});
		return s
	}
	function bellmanFord(e) {
		var t = e.sources;
		var r = e.targets;
		var n = e.weights;
		var i = e.source;
		var o = e.target;
		var s = e.undirected;
		if (s === void 0) s = false;
		var a = e.indexes;
		var u = e.N;
		u = a ? a.length : u;
		if (!isFinite(u) || u === 0) {
			throw new Error("Invalid number of nodes " + u)
		}
		var l = new Float32Array(u);
		var d = new Int32Array(u);
		var f = {};
		var h = Number.POSITIVE_INFINITY;
		var c, p, g, v, y, _, m;
		var x, b, A, w;
		if (!n) {
			for (c = 0, n = new Uint8Array(u); c < u; c++) {
				n[c] = 1
			}
		}
		if (!a) {
			for (c = 0, a = new Uint32Array(u); c < u; c++) {
				a[c] = c + 1
			}
		}
		for (c = 0; c < u; c++) {
			l[c] = h;
			d[c] = -1;
			f[a[c]] = c
		}
		l[f[i]] = 0;
		for (c = 1, p = u; c <= p; c++) {
			w = false;
			for (g = 0, v = n.length; g < v; g++) {
				x = t[g];
				b = r[g];
				_ = f[x];
				m = f[b];
				if (_ !== undefined && m !== undefined) {
					A = n[g];
					y = l[_] + A;
					if (l[_] !== h && y < l[m]) {
						l[m] = y;
						d[m] = x;
						w = true
					}
					if (s) {
						y = l[m] + A;
						if (l[m] !== h && y < l[_]) {
							l[_] = y;
							d[_] = b;
							w = true
						}
					}
				}
			}
			if (!w) {
				break
			}
		}
		if (w) {
			for (c = 0, p = n.length; c < p; c++) {
				x = t[c];
				b = r[c];
				_ = f[x];
				m = f[b];
				if (_ !== undefined && m !== undefined) {
					A = n[c];
					if (l[_] + A < l[m]) {
						return null
					}
				}
			}
		}
		var E = null;
		var I = null;
		if (o !== undefined) {
			var S = f[o];
			if (S !== undefined && l[S] !== h) {
				for (c = o, E = []; c !== -1; c = d[f[c]]) {
					E.push(c)
				}
				E = E.reverse();
				I = l[S]
			}
		}
		return {
			distances: l,
			path: E,
			pathLength: I
		}
	}
	function dijkstra(e, t, r, n, i, o, s) {
		var a = n ? n.length : e.length;
		var u = new Float32Array(a);
		var l = new Int32Array(a);
		var d = new Uint32Array(a);
		var f = Number.POSITIVE_INFINITY;
		var h = {};
		var c, p;
		if (a === 0) {
			return {
				distances: u,
				path: null,
				pathLength: null
			}
		}
		if (!n) {
			for (c = 0, n = new Uint32Array(a); c < a; c++) {
				n[c] = c + 1
			}
		}
		if (!i) {
			for (c = 0, i = {}; c < a; c++) {
				i[n[c]] = c
			}
		}
		for (c = 0; c < a; c++) {
			u[c] = f;
			l[c] = -1;
			d[c] = h[c] = c
		}
		var g = minHeap(function(e, t) {
			return u[e] - u[t]
		}, d, h);
		u[i[t]] = 0;
		g.decreaseKey(h[i[t]]);
		while (g.size !== 0) {
			var v = g.pop();
			var y = u[v];
			var _ = e[v];
			if (y === f) {
				break
			}
			for (c = 0, p = _.nodes.length; c < p; c++) {
				var m = _.nodes[c];
				var x = o ? 1 : s ? s(n[v], m) : _.weights[c];
				var b = i[m];
				if (b === undefined) {
					continue
				}
				var A = y + x;
				if (A < u[b]) {
					u[b] = A;
					l[b] = v;
					g.decreaseKey(h[b])
				}
			}
		}
		var w = null;
		var E = null;
		if (r !== undefined) {
			var I = i[r];
			if (u[I] !== f) {
				for (c = I, w = []; c !== -1; c = l[c]) {
					w.push(n[c])
				}
				w = w.reverse();
				E = u[r]
			}
		}
		return {
			distances: u,
			path: w,
			pathLength: E
		}
	}
	function johnson(e) {
		var t = e.sources;
		var r = e.targets;
		var n = e.weights;
		var i = e.indexes;
		var o = e.adjacency;
		var s = e.undirected;
		var a = e.ignoreWeights;
		var u = Number.POSITIVE_INFINITY;
		var l = i ? i.length : o.length;
		var d, f, h, c, p, g;
		if (!i) {
			for (d = 0, i = new Uint32Array(l); d < l; d++) {
				i[d] = d + 1
			}
		}
		var v = new Array(l);
		var y = {};
		for (d = 0; d < l; d++) {
			v[d] = new Float32Array(l);
			for (h = 0; h < l; h++) {
				v[d][h] = d === h ? 0 : u
			}
			y[i[d]] = d
		}
		var _ = l;
		var m = n.length;
		t = t.slice();
		r = r.slice();
		n = n.slice();
		for (d = 0; d < l; d++) {
			t[m + d] = _;
			r[m + d] = i[d];
			n[m + d] = 0;
			if (a) {
				n[d] = 1
			}
		}
		var x = bellmanFord({
			sources: t,
			targets: r,
			weights: n,
			undirected: s,
			N: l + 1,
			source: _
		});
		if (x === null) {
			throw new Error("Graph has negative weight loops")
		}
		c = x.distances;
		for (d = 0, f = n.length; d < f; d++) {
			p = y[t[d]];
			g = y[r[d]];
			if (p !== undefined && g !== undefined) {
				n[d] = n[d] + c[p] - c[g]
			}
		}
		t = t.slice(0, m);
		r = r.slice(0, m);
		n = n.slice(0, m);
		for (d = 0; d < l; d++) {
			var b = i[d];
			p = y[b];
			c = dijkstra(o, b, undefined, i, y, a).distances;
			for (h = 0; h < l; h++) {
				v[d][h] = d === h ? 0 : c[h]
			}
		}
		return v
	}
	var ri = c(function(e) {
		(function() {
			"use strict";

			function t(e) {
				if (!(this instanceof t)) {
					return new t(e)
				}
				this.points = e || []
			}
			t.prototype = {
				triangulate: function() {
					var e = this.points;
					e.sort(function(e, t) {
						if (e[0] === t[0]) {
							return e[1] - t[1]
						}
						return e[0] - t[0]
					});
					for (var t = e.length - 1; t >= 1; t--) {
						if (e[t][0] === e[t - 1][0] && e[t][1] === e[t - 1][1]) {
							e.splice(t, 1)
						}
					}
					if (e.length < 2) {
						return {}
					}
					var r = h(e).le;
					var n = [];
					var o = 0;
					var s = [r];
					while (i(r.onext.dest, r)) {
						r = r.onext
					}
					var a = r;
					do {
						s.push(a.sym);
						a.mark = true;
						a = a.lnext
					} while (a !== r);
					do {
						var u = s[o++];
						if (!u.mark) {
							a = u;
							do {
								n.push(a.orig);
								if (!a.sym.mark) {
									s.push(a.sym)
								}
								a.mark = true;
								a = a.lnext
							} while (a != u)
						}
					} while (o < s.length);
					return n
				}
			};

			function r(e, t, r) {
				return (t[0] - e[0]) * (r[1] - e[1]) - (t[1] - e[1]) * (r[0] - e[0]) > 0
			}
			function n(e, t) {
				return r(e, t.dest, t.orig)
			}
			function i(e, t) {
				return r(e, t.orig, t.dest)
			}
			function o(e, t) {
				return n(e.dest, t)
			}
			function s(e, t, r, n) {
				if (e[0] === n[0] && e[1] === n[1] || t[0] === n[0] && t[1] === n[1] || r[0] === n[0] && r[1] === n[1]) {
					return false
				}
				var i = e[0] * e[0] + e[1] * e[1],
					o = t[0] * t[0] + t[1] * t[1],
					s = r[0] * r[0] + r[1] * r[1],
					a = n[0] * n[0] + n[1] * n[1];
				var u = s - a,
					l = r[1] - n[1],
					d = r[1] * a - s * n[1],
					f = r[0] - n[0],
					h = r[0] * a - s * n[0],
					c = r[0] * n[1] - r[1] * n[0];
				return e[0] * (t[1] * u - o * l + d) - e[1] * (t[0] * u - o * f + h) + i * (t[0] * l - t[1] * f + c) - t[0] * d + t[1] * h - o * c > 1
			}
			function a(e, t, r) {
				this.onext = e;
				this.rot = t;
				this.orig = r;
				this.mark = false
			}
			a.prototype = {
				get sym() {
					return this.rot.rot
				}, get dest() {
					return this.sym.orig
				}, get rotSym() {
					return this.rot.sym
				}, get oprev() {
					return this.rot.onext.rot
				}, get dprev() {
					return this.rotSym.onext.rotSym
				}, get lnext() {
					return this.rotSym.onext.rot
				}, get lprev() {
					return this.onext.sym
				}, get rprev() {
					return this.sym.onext
				}
			};

			function u(e, t) {
				var r = new a(null, null, e),
					n = new a(null, null, null),
					i = new a(null, null, t),
					o = new a(null, null, null);
				r.onext = r;
				i.onext = i;
				n.onext = o;
				o.onext = n;
				r.rot = n;
				n.rot = i;
				i.rot = o;
				o.rot = r;
				return r
			}
			function l(e, t) {
				var r = e.onext.rot,
					n = t.onext.rot;
				var i = e.onext,
					o = n.onext,
					s = r.onext;
				e.onext = t.onext;
				t.onext = i;
				r.onext = o;
				n.onext = s
			}
			function d(e, t) {
				var r = u(e.dest, t.orig);
				l(r, e.lnext);
				l(r.sym, t);
				return r
			}
			function f(e) {
				l(e, e.oprev);
				l(e.sym, e.sym.oprev)
			}
			function h(e) {
				var t, a, c, p;
				if (e.length === 2) {
					t = u(e[0], e[1]);
					return {
						le: t,
						re: t.sym
					}
				} else if (e.length === 3) {
					t = u(e[0], e[1]);
					a = u(e[1], e[2]);
					l(t.sym, a);
					if (r(e[0], e[1], e[2])) {
						c = d(a, t);
						return {
							le: t,
							re: a.sym
						}
					} else if (r(e[0], e[2], e[1])) {
						c = d(a, t);
						return {
							le: c.sym,
							re: c
						}
					} else {
						return {
							le: t,
							re: a.sym
						}
					}
				} else {
					var g = Math.ceil(e.length / 2);
					var v = h(e.slice(0, g));
					var y = h(e.slice(g));
					var _ = v.le,
						m = v.re,
						x = y.le,
						b = y.re;
					do {
						if (i(x.orig, m)) {
							m = m.lnext
						} else if (n(m.orig, x)) {
							x = x.rprev
						} else {
							break
						}
					} while (true);
					var A = d(x.sym, m);
					if (m.orig === _.orig) {
						_ = A.sym
					}
					if (x.orig === b.orig) {
						b = A
					}
					do {
						var w = A.sym.onext;
						if (o(w, A)) {
							while (s(A.dest, A.orig, w.dest, w.onext.dest)) {
								p = w.onext;
								f(w);
								w = p
							}
						}
						var E = A.oprev;
						if (o(E, A)) {
							while (s(A.dest, A.orig, E.dest, E.oprev.dest)) {
								p = E.oprev;
								f(E);
								E = p
							}
						}
						if (!o(w, A) && !o(E, A)) {
							break
						}
						if (!o(w, A) || o(E, A) && s(w.dest, w.orig, E.orig, E.dest)) {
							A = d(E, A.sym)
						} else {
							A = d(A.sym, w.sym)
						}
					} while (true);
					return {
						le: _,
						re: b
					}
				}
			}
			t.prototype.ccw = r;
			t.prototype.rightOf = n;
			t.prototype.leftOf = i;
			t.prototype.inCircle = s;
			if (typeof undefined === "function" && undefined.amd) {
				undefined("Delaunay", function() {
					return t
				})
			} else {
				e.exports = t
			}
		})()
	});

	function ni(e, t, r) {
		return (t[0] - e[0]) * (r[1] - e[1]) - (t[1] - e[1]) * (r[0] - e[0])
	}
	function ii(e) {
		var t = e.length,
			r = [0, 1],
			n = 2;
		for (var i = 2; i < t; i++) {
			while (n > 1 && ni(e[r[n - 2]], e[r[n - 1]], e[i]) <= 0) {
				--n
			}
			r[n++] = i
		}
		return r.slice(0, n)
	}
	function oi(e) {
		var t = e.length,
			r;
		if (t < 3) {
			return null
		}
		var n = new Array(t);
		var i = new Array(t);
		for (r = 0; r < t; r++) {
			n[r] = [+e[r][0], +e[r][1], r]
		}
		n.sort(function(e, t) {
			return e[0] - t[0] || e[1] - t[1]
		});
		for (r = 0; r < t; r++) {
			i[r] = [n[r][0], -n[r][1]]
		}
		var o = ii(n),
			s = ii(i);
		var a = s[0] === o[0],
			u = s[s.length - 1] === o[o.length - 1],
			l = [];
		for (r = o.length - 1; r >= 0; --r) {
			l.push(e[n[o[r]][2]])
		}
		for (r = +a; r < s.length - u; r++) {
			l.push(e[n[s[r]][2]])
		}
		return l
	}
	function si(e, t, r, n, convexhull) {
		if (t === void 0) t = 1;
		if (r === void 0) r = 0;
		if (!n || !convexhull) {
			e = e.map(function(e) {
				return [e.x, e.y]
			});
			n = new ri(e.slice()).triangulate();
			convexhull = oi(e)
		}
		var i = r * r;
		var o = [],
			s = {},
			a, u, l, d, f;
		for (l = 0, d = n.length; l < d; l += 3) {
			u = di(n[l], n[l + 1], n[l + 2]);
			if (ai(convexhull, u)) {
				f = li(n[l], n[l + 1], n[l + 2]);
				if (f > i) {
					o.push(l);
					s[l] = f
				}
			}
		}
		if (o.length === 0) {
			return o
		}
		o.sort(function(e, t) {
			return s[e] - s[t]
		});
		var h = o[0];
		var c = s[h];
		var p = [];
		for (l = 0, d = o.length; l < d; l++) {
			a = o[l];
			f = s[a];
			if (f > c && f > i) {
				h = a;
				c = f;
				p.push(h);
				if (p.length > t) {
					p.shift()
				}
			}
		}
		return p.map(function(e) {
			return ui(n[e], n[e + 1], n[e + 2])
		})
	}
	function ai(e, t) {
		var r = e.length;
		var n = e[r - 1];
		var i = t[0];
		var o = t[1];
		var s = n[0];
		var a = n[1];
		var u, l;
		var d = false;
		for (var f = 0; f < r; f++) {
			n = e[f], u = n[0], l = n[1];
			if (l > o !== a > o && i < (s - u) * (o - l) / (a - l) + u) {
				d = !d
			}
			s = u, a = l
		}
		return d
	}
	function ui(e, t, r) {
		var n = arguments;
		var i = di(e, t, r);
		var o = 0;
		for (var s = 0; s < 3; s++) {
			var a = n[s];
			var u = a[0] - i[0];
			var l = a[1] - i[1];
			var d = Math.sqrt(u * u + l * l);
			if (d > o) {
				o = d
			}
		}
		return i.concat(o)
	}
	function li(e, t, r) {
		var n = di(e, t, r);
		var i = n[0];
		var o = n[1];
		var s = e[0];
		var a = e[1];
		var u = i - s;
		var l = o - a;
		return u * u + l * l
	}
	function di(e, t, r) {
		var n = [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2];
		var i = [(t[0] + r[0]) / 2, (t[1] + r[1]) / 2];
		var o = -1 / ((t[1] - e[1]) / (t[0] - e[0]));
		var s = -1 / ((r[1] - t[1]) / (r[0] - t[0]));
		var a = n[1] - o * n[0];
		var u = i[1] - s * i[0];
		var l = (a - u) / (s - o);
		return [l, o * l + a]
	}
	function minDisk(e, t, r, n) {
		if (!n) {
			n = new Uint32Array(e.length);
			for (var i = 0, o = e.length; i < o; i++) {
				n[i] = i
			}
		}
		function s(e) {
			for (var t = e.length - 1; t >= 0; t--) {
				var r = Math.floor(Math.random() * (t + 1));
				r = Math.max(Math.min(r, t), 0);
				var n = e[t];
				e[t] = e[r];
				e[r] = n
			}
			return e
		}
		function a(e, t, r, n, i, o, s) {
			var a = null;
			var u = t.length;
			var l, d, f;
			if (u === 1) {
				l = t[0];
				a = [r[l], n[l], i[l] || 0]
			} else if (u === 2) {
				l = t[0];
				d = t[1];
				a = o(r[l], n[l], r[d], n[d], i[l], i[d])
			} else if (u === 3) {
				l = t[0];
				d = t[1];
				f = t[2];
				a = s(r[l], n[l], r[d], n[d], r[f], n[f], i[l], i[d], i[f])
			}
			return a
		}
		function u(e, t, r, n, i, o, s, l, d) {
			var f = null;
			if (r === 0 || t.length === 3) {
				f = a(e, t, n, i, o, l, d)
			} else {
				var h = e[r - 1];
				f = u(e, t, r - 1, n, i, o, s, l, d);
				if (f === null || !s(f, n[h], i[h], o[h])) {
					t.push(h);
					f = u(e, t, r - 1, n, i, o, s, l, d);
					t.pop()
				}
			}
			return f
		}
		function l(e, t, r, n) {
			var i = e - r,
				o = t - n;
			return [(e + r) / 2, (t + n) / 2, Math.sqrt(i * i + o * o) / 2]
		}
		function d(e, t, r, n, i, o) {
			var s = r - e;
			var a = n - t;
			var u = o - i;
			var l = Math.sqrt(s * s + a * a);
			return [(e + r + s / l * u) / 2, (t + n + a / l * u) / 2, (l + i + o) / 2]
		}
		function f(e, t, r, n, i, o, s, a, u) {
			var l = 2 * (e - r),
				d = 2 * (t - n),
				f = 2 * (a - s);
			var h = e * e + t * t - s * s - r * r - n * n + a * a;
			var c = 2 * (e - i),
				p = 2 * (t - o),
				g = 2 * (u - s);
			var v = e * e + t * t - s * s - i * i - o * o + u * u;
			var y = c * d - l * p,
				_ = (d * v - p * h) / y - e,
				m = (p * f - d * g) / y,
				x = (c * h - l * v) / y - t,
				b = (l * g - c * f) / y;
			var A = m * m + b * b - 1,
				w = 2 * (_ * m + x * b + s),
				E = _ * _ + x * x - s * s,
				I = (-w - Math.sqrt(w * w - 4 * A * E)) / (2 * A);
			return [_ + m * I + e, x + b * I + t, I]
		}
		function h(e, t, r, n, i, o) {
			var s = (e * (n - o) + r * (o - t) + i * (t - n)) * 2;
			if (s === 0) {
				return null
			}
			var a = ((e * e + t * t) * (n - o) + (r * r + n * n) * (o - t) + (i * i + o * o) * (t - n)) / s;
			var u = ((e * e + t * t) * (i - r) + (r * r + n * n) * (e - i) + (i * i + o * o) * (r - e)) / s;
			var l = a - e,
				d = u - t;
			return [a, u, Math.sqrt(l * l + d * d)]
		}
		n = s(n);
		var c = r ? d : l;
		var p = r ? f : h;
		var g = r ? Ln : Tn;
		r = r || [];
		return u(n, [], n.length, e, t, r, g, c, p)
	}
	function removeRadialOverlap(e) {
		var t = e.X;
		var r = e.Y;
		var n = e.sizes;
		var i = e.indexes;
		var o = e.R;
		var s = e.center;
		var a = e.gap;
		if (a === void 0) a = 0;
		var u = e.epsilon;
		if (u === void 0) u = .001;
		var l = e.maxLoops;
		if (l === void 0) l = 5;
		var d = e.inPlace;
		if (d === void 0) d = true;
		var f = i.length;
		var h = f;
		var c = s[0],
			p = s[1];
		if (!d) {
			t = t.slice();
			r = r.slice()
		}
		var g = circleCircleIntersection;
		var v = circleSortCompare;
		var y = i.slice().sort(function(e, n) {
			return v(t[e], r[e], t[n], r[n], c, p)
		});
		var _ = y[f - 1];
		var m = t[_],
			x = r[_];
		var b, A, w, E, I, S;
		for (var C = 0, T = false; C < h - 1; C++) {
			var L = C % f,
				N = (C + 1) % f;
			if (C === -1) {
				L = f - 1;
				N = 0
			}
			L = y[L];
			N = y[N];
			b = t[L];
			A = r[L];
			w = t[N];
			E = r[N];
			var z = n[L],
				M = n[N];
			var k = z + M + a;
			var R = v(b, A, w, E, c, p);
			if (R === -1 && T) {
				R = 1
			}
			if (k > o) {
				continue
			}
			if (R === 1 || k - distance(b, A, w, E) > u) {
				var F = g(c, p, o, b, A, k);
				if (F) {
					F = F[0];
					T = w > c && F[0] < c;
					w = t[N] = F[0];
					E = r[N] = F[1]
				}
			} else {
				T = false
			}
			if (C % f === f - 2) {
				var P = y[f - 1],
					D = y[0];
				if (r[P] > p && r[D] > p && t[P] - n[P] < t[D] + n[P]) {
					I = 0;
					h = Math.min(f * l, h + f);
					while (r[y[P]] > p && r[y[0]] > p && t[y[P]] < t[y[0]] && ++I < f) {
						y.unshift(y.pop())
					}
				}
			}
		}
		b = m - c;
		A = x - p, w = t[_] - c;
		E = r[_] - p;
		var O = b === w ? 0 : Math.abs(Math.acos((b * w + A * E) / (Math.sqrt(b * b + A * A) * Math.sqrt(w * w + E * E))));
		if (O !== 0) {
			var B = Math.sin(-O);
			var U = Math.cos(-O);
			var X;
			for (C = 0; C < f; C++) {
				X = y[C];
				I = t[X] - c;
				S = r[X] - p;
				t[X] = I * U - S * B + c;
				r[X] = I * B + S * U + p
			}
		}
		return {
			X: t,
			Y: r
		}
	}
	function circlePack(e) {
		var t = e.X;
		var r = e.Y;
		var n = e.R;
		var i = e.center;
		var o = e.maxSteps;
		if (o === void 0) o = 1e3;
		var s = e.padding;
		if (s === void 0) s = 5;
		var a = e.epsilon;
		if (a === void 0) a = 1e-5;
		var u = e.damping;
		if (u === void 0) u = 2;
		var l = e.pinned;
		var d = e.indexes;
		var f = e.onUpdate;
		var h = e.pushSmallerOut;
		if (h === void 0) h = true;
		var c = d ? d.length : t.length;
		var p = d;
		var g;
		if (!isFinite(l)) {
			l = -1
		}
		if (p === undefined) {
			p = new Uint32Array(c);
			for (g = 0; g < c; g++) {
				p[g] = g
			}
		} else {
			p = d
		}
		if (l !== -1) {
			i = [t[l], r[l]]
		} else if (!i) {
			var v = 0,
				y = 0;
			for (g = 0; g < c; g++) {
				v += t[p[g]];
				y += r[p[g]]
			}
			i = [v / c, y / c]
		}
		var _ = function(e) {
				return --e * e * e + 1
			};
		var m = function(e, t) {
				var r = e - i[0];
				var n = t - i[1];
				return r * r + n * n
			};
		var x = -Infinity,
			b = Infinity;
		p.sort(function(e, i) {
			var o = n[e],
				s = n[i];
			x = Math.max(x, o, s);
			b = Math.min(b, o, s);
			return s * m(t[i], r[i]) - o * m(t[e], r[e])
		});

		function A(e, o) {
			var a = 0;
			var d, f, g, v, y, _;
			for (d = 0; d < c - 1; d++) {
				for (f = d + 1; f < c; f++) {
					if (d === f) {
						continue
					}
					g = p[d];
					v = p[f];
					var m = t[g],
						A = r[g],
						w = n[g];
					var E = t[v],
						I = r[v],
						S = n[v];
					var C = E - m;
					var T = I - A;
					var L = w + S + s;
					var N = C * C + T * T;
					if (N < L * L - e) {
						var z = (L - Math.sqrt(N)) * o;
						var M = 1 / N;
						var k = C * M * z;
						var R = T * M * z;
						_ = k * k + R * R;
						if (v !== l) {
							y = w / b;
							a += _ * y;
							t[v] += k * y;
							r[v] += R * y
						}
						if (g !== l) {
							y = S / b;
							a += _ * y;
							t[g] -= k * y;
							r[g] -= R * y
						}
					}
				}
			}
			var F = e * u * (1 - o);
			var P = i[0],
				D = i[1],
				O, B;
			for (d = 0; d < c; d++) {
				g = p[d];
				if (g !== l) {
					O = t[g];
					B = r[g];
					L = n[g];
					y = L / x;
					var U = h ? F * y : F;
					k = (O - P) * U;
					R = (B - D) * U;
					_ = k * k + R * R;
					a += _;
					t[g] -= k;
					r[g] -= R
				}
			}
			return a
		}
		var w = 0,
			E = 0;
		var I = _(1 / c);
		for (g = 0; g < o; g++) {
			w = A(I, _((g + 1) / o));
			if (f) {
				setTimeout(function() {
					return f(t, r)
				})
			}
			if (Math.abs(w - E) < a) {
				break
			}
			E = w
		}
		return {
			X: t,
			Y: r
		}
	}
	var fi = {
		minHeap: minHeap,
		bellmanFord: bellmanFord,
		dijkstra: dijkstra,
		johnson: johnson,
		largestEmptyCircle: si,
		minDisk: minDisk,
		removeRadialOverlap: removeRadialOverlap,
		convexhull: oi,
		circlePack: circlePack,
		weightedStress: weightedStress,
		distanceStress: distanceStress,
		constrainedStress: constrainedStress,
		stressMinimizationStep: stressMinimizationStep,
		stressMinimizationStepGeneral: stressMinimizationStepGeneral
	};
	var hi = function() {
			var e = 0;
			return typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : function(t) {
				var r = Date.now();
				var n = Math.max(1, 16 - (r - e));
				var i = r + n;
				e = i;
				return setTimeout(function() {
					t(i)
				}, n)
			}
		}();
	var ci = function e(t) {
			var r = this;
			this.renderFunction = t;
			this._animationFrame = function(e) {
				r._newFrame(e)
			};
			this._delayBetweenFrames = 0;
			this._time = 0;
			this._inFrame = false;
			this._mustRefresh = false;
			this._updateTimeCounter = true;
			this._nextFrame = [];
			this._nbFrames = 0;
			this._totalElapsed = 0
		};
	ci.prototype.kill = function e() {
		tt(this);
		this._nextFrame = undefined
	};
	ci.prototype.setFpsLimit = function e(t) {
		this._delayBetweenFrames = t ? 1e3 / t : 0
	};
	ci.prototype.requestNewFrame = function e() {
		if (this._inFrame) {
			this._mustRefresh = true;
			this._updateTimeCounter = true
		} else if (!this._requestDone) {
			this._requestDone = true;
			hi(this._animationFrame)
		}
	};
	ci.prototype.atNextFrame = function e(t) {
		this._nextFrame.push(t)
	};
	ci.prototype._newFrame = function e(t) {
		var r = t - this._time;
		if (r < this._delayBetweenFrames) {
			hi(this._animationFrame);
			return
		}
		this._inFrame = true;
		this._mustRefresh = false;
		this._time = t;
		this.renderFunction(this._updateTimeCounter ? r : 0);
		if (this._nextFrame.length) {
			var n = this._nextFrame;
			this._nextFrame = [];
			for (var i = 0; i < n.length; ++i) {
				n[i]()
			}
		}
		if (this._mustRefresh) {
			hi(this._animationFrame)
		} else {
			this._inFrame = false;
			this._requestDone = false;
			this._updateTimeCounter = false
		}
	};
	var pi = typeof Image !== "undefined" ? Image : function() {};
	var gi = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAACAASURBVHic7N15fBXV3T/wzzkzd4/sayCExLpbV1Q2ta5V29rN2qd92j5VZHvU2j79VWVRBEHRx2pVfIAAam3d2qqtWrW1FkVxw71uWEkCWdgDhNx1Zs75/XGTAAKaZOZO7r35vP/yD/3OeXknM98553u+ByAiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIi8p7o7gEQUdfoTEbrdBo6lQLSaeiMBaRTUFu3QW/fDrV9O3RTEwBANW4AUqkOxxaDBkCUlEAYBsTQoRCRMOTgwRCxKBAMQYRDQDAIEYkAoRCkYfBZQlRg+EdLVCBUU5N2qmug6urhNDZCNTRCNzVBbdkCvbUJatt26G3bcjoGYZoQA/pD9O0L2bcvxKCBkAMHQg4ZDGPECIiyYTDKyyGjUT5biPIc/0iJ8oi2ba137IDe2gRnw0Y4n3wCtaYa9vsfQjU1QScTQCoFnc4Att3dw20ngkEgHIYIh4FoFMawUhhfPgLmgQdCHlgJ2b8/RP9+ELEYhJR87hDlAf4hEnUj7ThaZzJw/v0p7Hffg/Pue3DWroWqa4DauBFQqruH6JoIhSCHD4McPhzGIQfBOOooBI45CmLIkOwSAxMCom7BPzwin+mdO7Wzrg7Op2tgvb4K9quvQW3cBGQy0JkMoHV3DzF3DAMiFAIiYRgVlQicPA7m0V+GHDkSxvBhEIEAn0lEPuEfG1GOacvSemcLnDVrYK14Edbrq6DX1cPZuBFwnO4eXrcTkUh2hqCyAsFTTkHgpBMghg6BiEQgWFxIlDP84yLKEdXUpO33P4S9ahUyf3sWzpo1gNJFMa2fK8IwgFAI5oknIHjGaTCPOxbGlw6ECIf5rCLyGP+oiDyildJ6+w441dXI/PVpWKvegK6rh9q+vbuHVpgMA3LwIBgVFQiccTqCp50KMXgQZCzG5xaRB/iHROSSVkqrtetg/fN5pP/xD9ir3gQsq7uHVXRk374wT/sKgmechsD4sZB9+vD5ReQC/4CIukArpVVTE5wPP0LmL0+2FvJthOaLP+dESQzGyJEInHk6guecDTliBGcFiLqAfzREnaS2bNHpvz6NzJNPwXnn3WzlPnUL2b8/zLGjEfredxE46UTWChB1Av9YiDpA27Z21lTDevYfSD/2Fzj1DZ1qrUs5JATEAQfAPOZohL73HZgnnQRj8CA+24i+AP9IiD6HymS0alyPzAMPIv3U36AaGljFn8dEIADzmKMQ+O53EDrvnLbzDPicI9oH/mEQ7Yf94Uc6/dAfkH7iSegdzdyzX0BEMAg5shzh//oRAud8FcaAAXzWEX0G/yiIdqMtSzvr6pB++A+w/vYsnLXrirszX5ET4TCMI49A6MILEDz7LIjevdh6mKgV/xCIWjkNDTr9xF+Ruue30Bs2dvdwyEPCMGAcezTCky5B8JSTISIRPvuox+MfAfV4assWnXn+BaTv/R3sj1f3jD38gQBEIAAA0FoDmUyPWOKQvXvDHDsa4Yt/CuPII3hsMfVovPmpx1KOo+2XX0FqyTLYK1+BzqPjdbtK9OmdPXp34ECIaARy4EDANCEHDwJaX/gAslPhsZLsP2sNtW0b9O67GnY0QzU3Q6dS0Js2QycSUJs3Q28ojl4Hsl8/BL75dYQvvgjmiDI+B6lH4o1PPZL96Rqdvu/3yDz5FFRTU2Gs87dudxN9+0D06gU5cACMipEwKiqyh+mUDoWIRLNf96EgIA0gGACEhAgFO7X2rSxLw7azOx5aZwd0xgIyaaht26Ea10M1NMBZ/Un2n5uaoHc0Q382kchnpgGjogKRSy6GefZZMPr15fOQehTe8NSjqJa4zjz1NFJL74bz70/zd0ufEICUENEojIMPgnnUkZAHHQxjxHDIoUMhBw2C7HVAXvz9aqW02rwFevNmOA2NULW1sD9eDfudd6EbGrMzK0rlbZIlwmEExo9D+NIpMI85mkWC1GPwRqceQTuOtlevRmrRElh/ezY/v1JDQcjBQ2AMHwbjsENhnjAK5lFHQhxwABAMQgQ79xXfXbTjaJ3OAJkM1PoNsN96C9aqN6FqauDUN0A3NeVf4iUl5KCBCP/0Jwhd8B3IgQPz/v8zkVu8yanoqZ07debxJ5FcvAS6rh46T14+wjSBSBjG8OEwR58Ec+xoGOXlMEqHQhyQH1/3XtFKab1lC1Tjetgfr4b1wouw334Hevv2bDKWL7MDponAuLGIXnEZ5JePhAwGi+p3INodb24qavana3Ty9gWw/vZ36HS6u4cDABC9e8M87FCYxx4D87SvwPzyERChUI/qWKdsW2PHDlgrX84mAx98CPXpmrwpMBR9+iB86RSE/+NCyF69eszvQj0Lb2wqSiqR1NY/lyN5511wPl7dvYNpLd4zyoYjcMbpCJx6CmRFOWTfvgUxpZ9r2rK02rgJ9r/eR+bvz8J5402oTZu7fZlGhMMIfOUURH/5C4jKCkjT7PG/FRUX3tBUdNSWLTq5ZBlS990PJBLdOhajtBTmqScjcMZpCIwfDxnhaXVfxGlo1Nby5cg8+xzs19+A7s7fUAgY5eWI/PIKBM87F4JJABUR3sxUNLRta/uDD5G87XZYL73cbQ19RK9eMA45GMHzzkHg5PGQw4ZBRtl5rrNU0zbtfLoGmaeehrXiRai6+m47eln064fwf1yI0E9+BGPoEP6WVBR4I1PRSD36Z5287XaouvpuKSoTkQiC55yNwNfPQ+DEE/Nmm14xcGrXauullUg/8hjst97unkFIicCpJyN27QwYlZX8bang8Samgqe2b9ep+36P1N33Qm/b7u/FhYAsLUVg7BiEvn8BjMMPg4zF+HeVA9pxtG5qQmb5C8g8/iTsd96B3tni7yCkhFExEtFrZ8AcNxYyEOBvTQWLNy8VNKexUSf+91Zk/vKEv73spYTo0wehb5+P4DfPh3HE4SwS85FqbtbWK68hff+DsFf5Xycg+vdH5IrLELrwAkgeLEQFyuzuARB1hVZKOx+vRvwXv4L1+ipfG8vIAf0R+OrZCP/kRzAqKyC4V9x3bVvzVEtcWy++hPT9D8B6bVW2bbEP9NatSN54M3R9A5ymJm3068d7gAoOEwAqOMq2tf3Kq4jPngfnk0/8We8XAqIkhuBZZyL4g//ItuYNs6K/u8mS7HKLatqmM8ufR+re+7LbPn1IBHQyieS998HZsAHOpk3aGDSI9wMVFCYAVFC0bWvr2ecQv24O1IaN/lzUNGEefxwiEy9G4JSTIUIhPujzjGw9yEc1Nen0gw8j/cBDcBoac58cZjLIPPkU9KbNcKprtFFZwXuDCgZvVioYOpXSqfsfQmrBXVBN23J/QcOAUT4CoZ/+BMGvng1jyGD+vRQAbVnaWbMGqfvuh/XU01B+FIYKAfP44xGd9iuYxx7To7o6UuHiTUoFQaVSOnP/Q0jceht0Szz3FwwGEf7B9xG66CcwK/hVV4iUZWn7xZeQXLAQ9tvv+FInYhxYidjNNyIw6njeM5T3eJNS3lM7d+rk7Xci9cBDQDzH1d6mCfPooxCZOhmBcWMgolH+jRQ4tXGjTj38R6QfeCi7bJTjZQGjsgKRK3+JwFlncmcI5TXWAFBeU/GETt5yK1L3Pwjk+DAf2asXgj/6IcI/+U8YQ4fywV0k5ODBQtm2Dowfi9SChcgsfyGnswFOdQ0S185GNF9OOCTaDz7kKG+p5mad/M2dSP/u/ty2gJUS5qGHIPyzyxA8/Sss8itizubNOv3b3yP98B+gNm3O6bXk0KGIXjsDofPO4f1EeYk3JuUlFU/o5K9vQ/r+B3N6KpyIxRA471xEL/9viLLhkDydr+hpx9HWiheR/M0dsP/1QU4bSGWTgOkInH0WlwMo73AJgPKO2rlTJ2+5FenfP5DTL385dAjCUyYhfOEFXOvvQdoq9O2GBp389W+Q+evTQI6STLV+PRKz5iAqeHtR/uFdSXlFpVI69X+LkFy0JHdr/q37+qO/+BnMUcdDsJ97j6Wam3X6kT8jtXAx1KZNOSsQNMpHIDZvDsyxY7hFkPIGb0TKGzqV0un7H0L817fmrNpfhEIInv8NhH9xOcxhw3j/U3ZJ4PU3kLzhRtjvvZ+z63CLIOUb3oiUF7Rt6/RDf0Tixvk52+cvevdGeNIEhH/yo/Ze8kRt7E/+rRM3/xr2CytytvRkHHkESm65CeZhh/L+o27Hm5C6nVZKZ55bjsS0GVCbt+TkGnLQIESvm4ngmWdChHh4D+2bs3WrTt21CKl778tNcaAQMI87FiV33gaDM1DUzVgESN3OevV1JObMzc3LXwgYhxyM6Ixp2cY+XH+lz2H07y9Uc7MW/fshveRuqG0et5zWGvZbbyMx7yaoLVu0HDCA9yN1GyYA1K3sf3+qW674H6h1dd4HFwLmiaNQMmcW5MEHQ3CLH3WA7NVLaMvSctBAJG/+tff9ArRG5m9/h+zfDyqR0JI7UKibMAGgbuNs3Kjj02bC+fAj74MLgcBZZyA242oYI0fyAUudIgIBoR1Hi3AYyVtug1O71tsL2DbSf/gT5PBhUKmU5tHS1B2YAFC3UDt26MT8W2A9v8L7rVemieB55yI64yoYQ4bwwUpdIgxDKMfRcuBAxGfOgvPvTz2Nr1MpJBcuhiwd6mlcoo6S3T0A6pnSf3oU6Ucfy0mhVfDcryJ23TV8+ZNr0jBEYPRJIjZ3NuSIMs/j623bkfj1b2B/8CEPDiDfMQEgXynH0eln/6FTi5d43n1NBAIInv8NRKdfDdm/H1/+5BnzhFEo+d/5MA4+yPPYau06xGfPhbOujkkA+YpLAOQrtXYtkjfeDLVxk+exA+eeg+h1M2H078+XP3mqbfeI9epruuVXV3tbtKoU7NdeR3JRFbRta8EzA8gnnAEg36jmZp285Tdwqmu8DWyaCH7ja4hOu5Ivf8qp9pmAg77keezM408i/Yc/QVsWZwLIF5wBIF+odFqnlt6NzD+e87zoL3jeuYhddw2n/Snn9pgJuGo6lIe7A/TOnUjedkdOlhmI9oUzAOQL+9XXkKpa5u0BP0IgcMp4RH71P3z5k6+ME0Yhes0MyMGDPI2rNm1C8tbboTZv5iwA5RwTAMo5u75Bp25fAL19u3dBhUDghOMRu+5amCPK+PInX0nDEMHTTkV0xtWQAwd6GttetQqpe+6DSiaZBFBOcQmAckqlUjp50y2w3nnX07jySwciMv1qGAdW8uVP3UIYhlCWpcMbNiJ5y22eHSCkMxZS994H8/jjPIlHtD9MAChntFI689QzSD/8R0/3+4v+/RGbdhXMo4/yLOZnacvSasuW7FbFWAyyf3+eI1BAVCql9ZYt0JYF0as3ZN8+OWkFLQMBoVriWjc1IXXPfdAeLXHpeBzJOxbArl2rzZHlvO8oJ5gAUM449Q1ILaqCjnt3vK/odQCiM65C4NSTc9bbX8UTOvW7B5C697dQdfUwDj8M0WlX5uJSlAMqntCpZfcgfc9voZq2wTzpRER/fnnOridLYkLt3KmdjZuQeewvnsW13/sXMr9/AMpxtGTySTnABIByQluWjl9/A2wv+/ybJkI/+iFCX/86crVXWsUTOrVkGZKLqoBkEgDgvP8BEtfMRubFl3RgzOicXZvc29fvZ7/8CuIbNub095MHHCCcmlqt1tXBfuttb3a6KIX0nx6BeeIo97GI9oFFgJQT1ksrYf35ce+m/oVA8IzTEZk8CSIUzMkLWCeSOlW1BMmFi9tfHm2c6mrEr5wG6+VXc3Fp8kB3/35GxUgRnTkdcsgQz2Kq7TuQXFgFZ/0GFgSS55gAkOechkadXLAQurnZs5jm4YchMu1XkH165+bLP5HQyaqlSC3af4ti1bge8VmzkXlxpdaOwwdyHsmX38885ihEfvlziJKYNwG1hv3ue0g/+hgU7znyGBMA8lz68SfgvPMutEcNf0TfPgj/8ucwKypy8/JvievUkruRWrwE+gvOJ1DVNUhcPQPWy69AK8UHch7Ip99PSCmCXzsXoe99FzA9WmF1HKR//yCcf73vTTyiVkwAyFP2x6t15r77oW3bm4DBAMIXX4TgKSd7E+8zVCKhk0vvRvKOBdCJRIf+G6e+HomZs5gE5IF8/P1kNCoiv7gC5gnerd2r9euRWrwEqrmZ9xt5hgkAeUbF4zp1971wNmzwJqAQCJ5+GkI//TFEIOD5179qietk1TKkq5YCnUxYnNq1SMy4FtbKl8HlgO6Rz7+f7N1bRP/fLyDLhnsTUGtYzy2HvfIVb+IRgQkAech+4y2k//I4oJQn8YyyMkT+5woYvXp5//JPZLeKpe68q8vbFJ3atYhfNYOFgd2gEH6/wKjjRXjCRRCG4Uk8nU4juXgJnKZtTDjJE0wAyBOqpUWnlt4NpLxphCIiEYQvnQJ54IGexNtdtlp8GVKLqjr95fhZqqEB8WuvQ2bFS1rbNh/MPiik3y/07W8i8I2veZYE2B9+hMwTT4L3GnmBCQC5ppXS1nPL4bz1ljcBpUTw/K8j9M3zIT3es63iCZ1cXIXUwsUdXjP+wpjVNYhfNQ3WK5wJyLVC+/1knz4i+rPLICtGehMwnUb67nvhNDR6E496NCYA5JrasgWpu++FavGm459x0JcQnjgBIhL2/OWfbRLzxdXinY7duB6Ja+cg8+JLWvHrLCcK9feTFSMRvuRiIBDwJJ5TuxaZP/yRtSfkGhMAcs16bjlsrw77EQKhn/4Y5kFf8vTlr5XSmaefQapq6X73ibvlVFcjfvUM2KwJ8JyKJ3RqaWuHvxz+fomZ10HXN3gaV0gpguedg+Dpp3kWM/PXZ+DU1HoWj3omJgDkimps1On7H/QmmBAInvtVhM4715t4u9EtLbCe+6en5xLsi6pvXVNmsyDPqETrl/+ChXt1+POas3YtrNde9zyu7N1bhCZfAjlsmCfxnLVrkfnTI9CWxXuMuowJAHWZdhydfvrvsD9e7Uk8OWQwQhMuguzTx/Oqf620Z8e1fhFVU4vE9JmwVr7CaVqX2pr8JBcvAfz4/bTO2XUCxx6D0PcvAKQHj12lkP7jo3DWrHEfi3osJgDUZap5Z/b0M8vyJF7oW+cjOOr4nHT7kweUIHjaV4BIJBfh9+Ksq0N8+kxuEXShbatf8vY7AY8K/r6IHD4M5okn5CS2kFKELvgOzMMO9SSe2rYNmT8/wSSTuowJAHWJUkpbTz0N5+OPPYlnHnIwgt+/0JNY+yIMQwS//S1EpkwCwuGcXWd3qq4e8WtmIbOChYGdpeIJnapqXfP36kCpLyArKxCbPw/GgZW5u8bQoQhNuAiipMR9MMdB+pm/wVlT7T4W9Ug8Dpi6RG/egvQf/gTtwde/CIcR/MH3YZSP8GBk+ydjUaHiCQ2tkMpBJfm+qJpaxKfNQGz+vJxfq1i0F/zdtdCfaX8AsrQUsTmzEDx5fE6PehZSCm1ZOvPkU7D+udx1PFVTi8xTz3gwMuqJOANAXWKvegOOR2v/xpePROjCCyCkzOnDF8gmAeFJExGeOhkiGs315QBkCwPbtpixgcvna9/qt7DKt5e/UVmB2M03IDBmtC/XE4GAiEy4CLJPb0/iZZ78K5wtW3hfUacxAaAuST/woDdf0LEYIhf/FDIWy/nLv002CZiA8JRJ3p3Y9gX8OI++0GU7/C1BcuHinFf7t5HDhyF6/XUInjxeCI+bTn0e47hjEDjzTE8KAtXadcg8+mcPRkU9DRMA6rTMiyu188GHnsQKjj4R5tgxnsTqDBmNivCEixC+/FKImEdnt38BP86jL1QqkdDJqqVILVqSs33+nyXLyxGbPw/m6JN8ud4e145GRfinP4bo08d1LJ3JIPPM3+Fs3MR7ijqFCQB1ikokdfrRx6Cad7qOJSIRhH74A8g+vX378tqdLImJyKQJCE26xLeZgFyfR1+I2rb6pRb7U5cBZF/+JTfMQWDcWM/bTXd4DIccjNA3vgYI95e33/sX7Lff8WBU1JMwAaBO0fX12U53Hpz4Z44dA3OsP+uu+yOjURG55GJEfnaZbzUBuT6PvpCoREInl96N5B0LPOvt/0Xk8GGIzZsNc+wYX+pO9juOYFAEv/NtyCGD3QezLGSe+CsUZ5aoE5gAUKdkXlgBtWGD6ziiVy+EfvB9yGi02x7AbWRJTIQnXozw5IlAKOTLNXN9Hn0hUC1xnaxahnTVUten+nWUUVmB2E03wBwzultf/m3Mww9F4CunehLLfvNNqE8+8SQW9QxMAKjDVDyuM48/6Uks84jDEchRw5WukNGoiEy6BJGp/vUJyPV59PmsrclP6s67ct6euY0sLUV0ziwEx48T3TXt/1kiGBSh730XwoPEU23ajMzf/8GjgqnDmABQh9mvr4Kzbp37QIaB4Pe+A9m7V148hNuIaESEJ01EZOpk3zoG5vo8+nyUrfZfhtSiKt++/KXPW/06wzjkYATO/ar7WgDHgfXccqitW70ZGBU9JgDUISqZ1NbyF6B3NLuOZR56iGfTnl6TsagIT5yQnQkIBn25Zi7Po883Kp7QycVVSC1c7O+af2uTHz+3+nWULCkRoe9+G6JXL9ex7Pc/gP3hRx6MinoCJgDUIXrzFmT+uTx7WIobponQBd+B6O1NE5RckLGoCF8yAZFLpwJ+NQvK4Xn0+aK9yY9PXRgBwKgYidj8eXn55b8787jjYB5ysPtAjgPrqWd6bF0JdQ4TAOoQ6623oerqXccxhg+DefpXum3rVUe1NQuKTJkEGIYv13SqqxG/ekZ2l0WRaW/vu6jKv33+ZWWIzp2dt1/+u5MlMRH87rc9iWW/9TacxvWexKLixgSAvpC2bW397VlPYpmjT4IxIrc9/73S1iwocsXl/s0E1LfWBBRRsyCVaP3yX7DQvw5/ZWUoufH6vP/y311gzGgYI0e6jqMaGmG/+577AVHRYwJAX0jVN8D+yINT/0IhhM7/el5sv+qoti2CkckT/asJqKlFYvpMWCtfKfip3LYmP8nFS/zr7V8xErH5c7P7/A2jcO61IYMROP1U1+2BdTIJe+XL0KlUQd87lHtMAOgLWe++B93Y6DpO4NijYXixzukzGW0tDLxsqm+7A5x1dYhPn1nQWwTbtvolb78T8LHgL3r9dQiOHycK6eUPACIUEoGzzvLkkCDruX9CbdvuwaiomDEBoM+lkkltv7QSOp12FUcEg9nK/759PRqZv9oLA6f41ydA1dUjfs0sZFYUXmGgiid0qqp1zd9xfLmmrKwoiIK/zxMYdRzkgQe6jqO2bIX9xpsejIiKGRMA+nwtLbBWvOg+Tt++CJx1JmSBfZXtrn2L4JSJEH4lATW1iE+bAbuAtgi2F/zdtdC/L//S0rze6tdRIhgUoW98zX0gpWA9/0KPbzVNn8+fE1CoYFlvvQ29xX1jkcAxR8OoGOk6TneTsahQ8YSGkNnDa3x4wan6hvYtgoExo5HPL7hdW/2q/Fvzr6xAdM6sgv7y351x3LGQAwZAbdnS9SBaw/7wI0/adlPx4gwAfS47W4jmOk7g3LMLqiDr87RtEQxPmeTbKYJOdTXiV07L65qAbIe/JUguXOxftX/bmn+Bf/nvzqisgHn0Ua7jqLp6qHV1HoyIihUTANovZ2uTtj/40HXzH1lWBvPIIz0aVX5o2yIYvvxSiFjMl2uqxvWIz5qdl1sEVSKhk1VLkVq0xL99/uXliM2fB3P0Sb5czy8yFhPmV05xfT6A3rkT9rvvcRmA9osJAO2XrvfmC8I8+CDIoUM8GFF+kSUxEZk0AaFJl/g2E6Cqa5C4ekZeHSXcttUvtdi/Dn+yvBwlN8xBYNzYvG8q1RXB8eOAqPsdJ9ZLL3tydDcVJyYAtF/2Rx9Dbd7sLkgwAHP0SZAlJUX3kAZaTxG85GJEfnYZhE/Ngpz6eiRmzsqLJEAlEjq59G4k71jgb2//ebOz+/wLqKdEZ8iy4TCPOMJ1HOf9D6A2ufwbpqLFBID2STuOtla94X76PxZD4NSTPRpVfmprFhSePBHw4FjXjnBq1yIx41pYK1/utmZBqiWuk1XLkK5a6tupfkZlBWI33QBzzOiiffkDgAgEROC0U12fEKiSSdhvcjsg7Rt3AdC+KQX7rbddh5EVFTAqKzwYUH6T0ajQiaSGVkj6tA7u1K5F/KoZiN10Q86v9VnZ9r53I3XnXf4d6VtaiuicWQiOH1e0L/7dmUd9GbJ3L6jtO7oeJJ2G/ab7v2MqTpwBoH2y11R7s/1v/FjfDtPpbiIaEeFJExGZOtm3joGqofXsgBUvae1Ts6Bstf8ypBZV+ffyr6xA7OYbrJaLnAAAIABJREFUimarX0fIESMg3Z6boRRUdTVUc3Ne1ItQfmECQPvkrHoTcNn9D8EgjGOOKeqp2s9qbxY0dZJ/ZwdU1yB+1TRYPjQLUvGETi6uQmrhYn/X/IugyU9nyUEDISsrIFwuAzg1tawDoH1iAkB70Y6j7Q8+ACzLVRxjWCmMEWUejapwtLcNvnSqf6cINq5vbxaUq7bBu5r8+Fftnz3Yp7Db+3aVkFIERh0P7fJwILVhI7TbYl4qSqwBoL3oHc1wamqhXW4fksOGQQ4r9WhUhUXGokIlEhpCZA/D8aEfvlNdjfjVMxC7cZ7nsdvb+y6q8m+ff1kZonNn95g1/30xjj8OQkpXzbh0JgPno9UejoqKBWcAaC96x3bojRvdBRECxuGHQUajPfbh3dYsKHLF5f7NBNS31gR42CwoW/C3DMkFC/3r8FdWhpIbr++RX/67M0pLIT0oorU/9uA4byo6TABoL2rLVqgGl8f/Sglz1HHeDKiAtW0RjEye6F9NQE0tEtNnwsq2cXaVBLQ1+UkuXuJfb/+KkYjNn5vd518k7aO7SoRDCIw63nUc5/0PoPKkcRTlDy4B0F6cunpolw97EQjAOOQQj0ZU2GS07QAhILmwypevaGddHeLTZ7paDmjb6ufXEgawW2//Hjztv4dgEMbhh2X7AbjoyaG2bYdmISB9BmcAaC/OavfrhWJEGWSfPh6Mpji0FwZOmQT4dZRwXT3i18xCZkXnCwNVPKFTVa1r/n69/CsremzB3/4IKYUsGw5RUuIqjk4moKqrPRoVFQvOANBe1KfuHxSBo49yfZhJsWk/SlgrpHyqpFc1tYhPm4HY/I7PBLQX/N210Ldpf1la2r7Vz5cLFhA5fBhk/35wdu7sepBUGk7tWu8GRUWBMwC0B21Z2q6tdR3HOPQQIBhwP6Aikz1KeCLCUyf7dnaAqm9o3yL4Rc2C2rf6Lazyb82/Bzb56Qw5eDDQu7erGDqVgrN2XbefHUH5hQkA7UFt2gS4bfASiUCWj+jxBVz7k00CJiA8ZZJvpwg61dWIXzkN1sv7bxaU7fC3BMmFi/2r9m9b8+9hTX46Q5aUCGPYMHdBtIbauNF9cy8qKkwAaA9O7Vpolw9/0asXjEGDPBpRcWrbIhi+/FKIWMyXa6rG9YjPmr3PLYIqkdDJqqVI+XSOAZA90jc2fx7M0Sf5cr1CZhxykOsYqr4BqqXFg9FQsWANAO1Bb9joeupXHlAC0b+/RyMqXrIklm0WBPh2qI6qrkHi6hmIzp8LrZQWUoq2rX6pxf51+JPl5Si5YU5RH+nrJVkx0nUMvXkLkOIMAO3CBID24Gza7DoBEL16MQHoIBmNCtUS10IIpBZV+dJf36mvR2LmLETnzYFqadHJpT6f6jd8GGLzZvPl3wnGyJGuY6itW6G5BEC7YQJA7ZRSOnnjzdCWuxeBHDIYMhLmg72D2mcCtEby/xb5sk7r1K5FYtpMGCeMgvXM3317+RuVFYhefx3M0Sfx5d8Jom9fyH59oZq2dTmG3rnTtwOcqDAwAaBdEkn3LYAByCFDPBhMzyKjUaETSQ2tkPRpHd5ZVwdnXV3Or9NGlpYiOmcWm/x0gQgGIQcOdJUAAICq8+/3pvzHBIB2sTJQ29w9YABADGUC0BUiGmntGCizDXh8qsT3g6ysQGzOLG716yIRDEIMHAis/sRVHLVxk0cjomLABIDaadt2vQMAAIzSoR6MpmdqbxYkkD18x6e9+Lkkhw9jkx+3QkGIQQNdh9HxuAeDoWLBBIDa6WTKky8EMdD9g6on29UxENlDeAp43daoGIno9dfxy9+tQADSg8Ja5eOSD+U/9gGgXZQCXBYAAoDBBMC1tmZBkSmTAMPo7uF0iSwrQ3TubDb58YAMBoXs19d9IMtyH4OKBmcAaJd0GmrrVlchxAEHQBfoCyvftG0RBJCtCSigmQBZVoaSG6+HyS9/75SUZDtHutix4TSu93BAVOiYANAuynHfA6BPb4gAzwDwyh5bBH08nMcNo2IkonNnwxwzmu2gPSR79c6er+Fmy6ZPjZ6oMDABoHY64356UEQigOTKkpdkdLfCwIX5vTugvbc/t/p5L2C6/9tSCtqytAgE+PsQEwDaRW3Y4DqG6N8fgqcAem6PwsCFi/PyS45b/XJL9OsLEQpBt3S9kl+nUlDbt3s4KipkTACondsOgAAgpATPG82NXUmAQmqRf337O0KWlnKrX44Jw4AQLv++tIZ2HK+GRAWOCQBRAdnVJ0BmD+/Jg8JAo7ICUX75ExUcJgDkKREIQLAGIKdkLJotDBQCyTsW+NbHf59j4Zo/UcFiAkDeGjQQCAa7exRFr22LoNYa6aql3dLhTZaXZ0/1G32S79fuicTgQdkiWyKPMAEgbxkGIPgx6If2LYKOg9QdC/y99tAhiM29DoFxY3mqn18ME5r/p8lDnKslIiLqgZgAkLccB9DcB+AH1RLXyaplSC+7x/9rr9+AxDXXwVr5MrTj8Af3g2ND8P80eYgJAHlr0+aC6FZX6FQioVPL7kHqzru67YQ3p3Yt4lfNgPXyq91y/Z5Gb9zkyWmdRG2YAJCntGVBK9XdwyhqOpHUqaplSC2q6tYdAACgGhoQv/Y6ZFa8pLVt8/uUqIAwASAqICqe0MnFVUgtXJwXPQAAQFXXIH7VNFivcCaAqJAwAaB2IuB+U4hWCixUzg0VT+jUkmVI5lkXQABQjeuRuHYOMi++pBVnAnJCa+2+vkYICIObvyiLCQC1k0OGuI6ht2z15FAh2pOKJ3Rq6bLsscB59vJv41RXI371DNisCcgJ3bQNKp12FUOEw5B9ens0Iip0TAConReH+OhUEmANgKdUovXLf8HCvD4JEABUfWtNwIsrNXcHeCydyR7Z7YaU4EmA1IYJAO0iDfdd/HY0Q1ucAfCKaonr1JK7kVy8pGB2V6iaWiSmz4S18hVuEfSQat4BuJ1di4S9GQwVBSYAtEsoBNm/v6sQqrkZgqeNeaJtq1/y9juBPCn46yhnXR3i02dyi6CXWlpc7/owhg71aDBUDJgA0C5SAh4UAjqbNnswmJ5NxRM6VdW65l+gCZWqq0f8mlnIrGBhoFsqk9GqaZv7QAH3y3xUPJgAUDsRCUMOHuQ6jt7CBMCN9oK/uxYW3Jf/Z6maWsSnzYDNLYLuWBbU1q2uw8gRZR4MhooFEwBqJ0zTk9PGnMb1HoymZ2rf6rewqmDW/L+Iqm9o3yLIZkFdlM5AezCzJkpKPBgMFQsmALRLIAjZt6/rMHr9Bg8G0/NkO/wtQXLh4ryv9u8sp7oa8SunsSagi3QmA73ZfQIgBw30YDRULJgA0C7RCMTgwa7DqA1MADpLJRI6WbUUqUVLfNvnL8vKEPrutyFiMV+upxrXIz5rNrcIdoHOZKC8SAC4BEC7YQJA7aSUQvTr57ojoFq/ASqZ5AO+g9q2+qUW+9fhT5aXo2T+XETnzEJo0iWA6U93OFVdg8TVM2C9/Aq0UrxHOkhv2wa3RYDigAMgIlGPRkTFgD0haQ/GoIHZXgBW17cb6Z07obc2eTiq4pX98l+G1J13+Xawjxw+DLF5s2GOHQMhpVAtcS2EQGpRlS/nCzj19UjMnIXovDnQSmkhJRvTfAGnttZ1DDloIESYfQBoF84A0B7EkMGumwGpnTuht27xaETFS7XEdbJqGdJVS317+RuVFYjddAPMMaPR9uKVJTERnngxwpMnAqGQL+NwatciMeNaWCtfZrOgDlA1ta5jiIEDgLA/vy8VBs4A0B6MkeUQkQj0tu1dD7KjGWrDRu8GVYSy7X3v9vfLv7QU0TmzEBw/bq8vbhmNCp1IamiFpE91CE7tWsSvmoHYTTfk/FqFzln9b9cx5NChEFEuAdAunAGgPchBgwCXDwmdSsFZV8cvu/3IVvsvQ2pRlX8v/8oKxG6+AYExo/f774hoRIQnTURk6mTAg+2gHaEaWs8OWMEtgvujWlq009DgLogQkEMGcwmA9sAEgPYgAgFhjhzpOo6z+hOeCrgPKp7QycVVSC1c7Mt6O9C65j9nFoInjxfCND93vV3GoiI8cQIiUye5Pxeig1R1DeJXTYPFZkH7pDZuBHbscBckFIIxYgRYb0G7YwJAe5FfqnQdw3rnPcDl0aXFpr3JzyL/qv2NipGIzZ/3uV/+nyVjURG+ZAIil051PRvUUapxfXuzILYN3pOqb4ByWVQrIhEYI8s9GhEVCyYAtBfjkENcx9B1dVDbXdQRFJn29r6Lqnzd5x+dO7tDX/57/bexqAhPmoDIlEmAYeRqiHtwqqsRv3oGbDYLaqeV0qquHrqlxVUcEY1AVrpP7Km4sAiQ9mKUDYcIBqHdtKK1bTirV3s3qAKmEq0H+9y10Lf2vrKsDCU3Xg+zE1/+e8WIRoVqiWsA2cTFhyULVd9aE/DiSh0YOxrCMHr2lHUmA+fDjwDtblJE9unDLoC0F84A0F7kgP6Qw0pdxdCOA3vVWx6NqHC1NflJLl7i28s/O+0/N7vP3+ULtG2LYGTyRP9qAmpqkZg+E9bKV3p8IalOpWG98abrOMaRR3D9n/bCBID2Inr3cd8SWGs4H30Ilei5HQFVIqFTy+5B8vY7fTvVTw4fhuj11yE4fpzw6utZRlsLAy+b6tvuAGddHeLTZ/b4swOcxkao6hrXcczDDvVgNFRsmADQXkTvXjAqRkJId7eHqm+Ecrt9qUCpeOu0/6IqwHF8uaasrOh0wV+HY7cVBk6ZBPi0lUzV1SN+zSxkVvTcwkDnzbeglXIVQ4RCMA51X9dDxYcJAO1FGIYwjzgCCARcxVHr18NZV+fRqApHe8HfXQv9+/IvLe3wVr8uX6Nti+CUib7tJ1c1tYhPmwG7B24R1Epp6403IVwmAHLwIIiBXP+nvbEIkPbJOOH4bFtYF1v5dDoN5513elS/911b/ar8W/OvrEB0zqycfPl/loxFhYonNITMHl7kU2Fg2xbBwJjRyFWCk2/Ups1Q1TXQLgsAjYqRLACkfeIMAO2TeWAlxID+ruNYL62E9mkKvLtlO/wtQXLhYiCZ9OWa7Wv+Ofzy3+uarVsEw1Mm+XaKoFNdjfiV03pUTYBatw5q3Tp3QaSErKyE7NWrRyRN1DlMAGjfpIR53LGuw6iaWk+KmPJd9lS/pUj51EcfyB7pG5s/D+bok3y53h7XjkZFeMJFCF9+KUQs5ss1VeN6xGfNRubFlbon7A6w3/sX1I5mVzFEKATzePd/x1ScmADQPgnDEIETRgHC3YeDjidgvbDCo1Hlp7atfqnF/nX4k+XlKLlhDgLjxkJ205S4LImJyKQJCE26xLeZAFVdg8TVM2C9/Aq0UkWbBGjL0tbyF1zv/0ck0i0JIhUGJgC0X+Zhh0K6LB7SmQzsV1+Damkpyoe1SiR0cundSN6xwN/e/vNmZ/f5d3NthYxGReSSixH52WW+nTTn1NcjMXNWUScBqq4e9gcfuI4TOOpIyL59PRgRFSMmALRfYvhwyBFlruPYn/wbav0GD0aUX1RLXCerliFdtdS3U/2MygrEbroB5pjR3f7yb9PWLCg8eWK2cNQHTu1aJGZcC2vly0XZLCjz0kog4b6OxBw7FnC5nZeKF+8M2i+jfz9hHnG462UAVVcP+1/vezSq/NDW5Cd1513Q8bgv15SlpYjOmYXg+HGiu6b990dGoyIy6ZLsKYI+bRF0atciftWMoisMVPG4tp9fAe3yMC1RUgLz6C/nTaJI+YcJAH0uc9wYCA8Og7Ge+XvRfKllq/2XIbWoyrcvf1lZgdjNN/iy1a+rRDQiwpMmIjJ1sm8dA1VD69kBK17SukiaBTnVNbDffc91HFle5skMHhUv9gGgzxU47liIAf2hN2x0Fcd65x04NbXeDKobqXhCJxdXIeXjkb5y+LD2Jj++XNCFXX0CgOQCfw4/UtU1iF81DbGbb8z5tfzgvPU21JYtruOYhx3mvqU3FTXOANDnKylB4JST3cdp2gbr7/8o6KKtXU1+/Hv5Zw/2yU1731xpbxt86VTAp8JA1bi+vVlQIbcN1pmMTj/xV/eBDAOB074C2dNPU6TPxQSAPpeMRIQ5fhyEy+IubVmwnn8BuqnJo5H5q72976Iq//b5l5UhOne2r01+vNLWLCgyZRLgwRJSRzjV1YhfPQN2AdcEWG+8BbVmjes4on8/mKOO82BEVMyYANAXChx9FESpu+OBAcB+9z04qz/xYET+UonWL/8FC/3r8FdWhpIbry+oL//PamsWFLnicv9mAupbawIKsFmQTqe19eyzUNt3uI4VPOtMiN59PBgVFTMmAPSF5PBhnhwnqlMppB9/sqCWAdqa/CQXL/Gvt3/FSMTmz83u8y/wKdy2LYKRyROBYNCXa6qaWiSmz4S18pWCKjxVGzbC+ucLgNvT/yIRmGPHQEbCBX3vUO4xAaAvJExTBL56liex7Fdfg7PWZX9zn7Rt9Uvefqd/p/q19fYfP04U+su/jYy2niJ42VTfdgc46+oQnz6zoLYIWq+8Cqe21nUcOXwYzKOPcj8gKnpMAKhDAscdC1k23HUc1dAI+5/P5/2XmYondKqqdc3fp8OMZGVFwRX8dVR7YeAU//oEqLp6xK+ZhcyK/C8MVC1xnXnkMU9imcceA6N0qCexqLgxAaAOEQMHIHj6ae7PBrAspB95FGrbdo9G5r32gr+7Fvr35V9a2r7Vr9AK/jpKxlpnAqZMhPArCaipRXzaDNiv5PdMgL1qFeyPV7sPZBgInHdOwS8dkT+YAFCHyEhEBE47FaJ3L9ex7I9Xw3r+BQ9G5b32rX4Lq/xb8y+AJj9eye4OmIjw1Mm+nR2g6hvatwjmY7Mg1dKi04/9BbrZ3cl/AGAeeSTMww/3YFTUEzABoA4zTzwBxogR7gM5DjJ/egRqx468ehhnO/wtQXLhYv+q/dvW/Iv4y/+z2rYIhqdM8u0UQae6GvErp+VlTYCz+hNYz/zdfSDDQOCM0yD793Mfi3oEJgDUYTIWE8Hzv+5JLPuDj2C9/oYnsbygEgmdrFqK1KIl/u3zLy9HbP68Hnlca9sWwfDll0LEYr5cUzWuR3zW7LzaIqgzGZ3+4yOu+/4DgBw0CMGzz0RPSSTJPSYA1CnBU0+BHDLEdRzd3Iz0gw9BJxLd/iBu2+qXWuxje9/ycpTcMAeBcWORbwf7+EWWxERk0gSEJl3i20yAqq5B4uoZeXOUsP3hx54th5nHHwfj4IM8iUU9AxMA6hQxfDjMsaM9OWLUevlVWC+/4sGouk4lEjq59G4k71gA7eNWv9i82dl9/j38pDYZjYrIJRcj8rPLfKsJcOrrkZg5q9uTAJXJ6Myjj0G5PGcDABAIIHj+11j8R53CBIA6RUYjIvSdb0P2OsB9sFQK6QcegtrePbUAqiWuk1XLkK5a6tupfkZlBWI33QBzzOge//Jv09YsKDx5IuCy5XRHObVrkZhxLayVL3fbllS1+hOkn/groN1f3jzqyzCPOcaDUVFPwgSAOi148jhhHOFBpbHWsF59HXY3zAK0NflJ3XkXdDzuyzVlaSmic2YhOH6c6KnT/vsjo1ERmXQJIlP96xPg1K5F/KoZ3VIYqBIJnbr3d9Db3W+HFaEgguecDWPwIN5T1ClMAKhLQj/8gSd7uXU8juSye6Dicd++wrLV/suQWlTl25e/7EFb/bpKRCMiPGkiIlMn+9YxUDW0nh2wwt8tgs5b78D6xz9ct/0FADliBILf+ZYHo6KehgkAdYl5wigYhx7iSSzn/Q+QfvhPvqzHqnhCJxdXIbVwsb9r/kXe5Mcr7c2Cpk7y7+yA6hrEr5oGy6dmQdqydHLZPZ4c+gMAwa9/DcaAAbyvqNOYAFCXiIEDELrwAohAwHUsnUoh89DDcNau9WBk+9fe5GeRf9X+2YN9irO9b660tw2+dKp/pwg2rm9vFpTLtsFaKZ1+/EnYr6/yJJ6sGIngeed4Eot6HiYA1CVSShE471wYh7o/JRAA7NWfIPPQHz2JtS/acXTmsT9ne/v7tdWvrAzRubP55d8Fbc2CIlMmAYbhyzWd6mrEr54BtaY6Z9dQ69cjvewe6JYW98EMA8FzvwqjssJ9LOqRmABQl8leByD47W8CHswCAED6L48j88abOfn6UjtbkFn+vH8d/srKUHLj9fzyd6GtWVDkisv9mwmob/Ds6/yztFI6/adHYX/0sSfxRN++CF3wXTb+oS7zp/sGFSVhGEI1NurMY3+G/a/3XcfTGzchveweqG3btezbx9OHmpACwqc1ZaNiJKJzZ2e3+nFftiuyJCZUIqGhdfZwJj/OZ8jRfWK9/Q7SD//Jk8I/SInID/8DckSZ+1jUY3EGgFyRpaUi9J8/8CSWVgqZp/+G9FNPexJvd6KkBIEzTs9529n23v7jxwm+/L0ho62FgZdNzfnuADmyHIHRJ3oeV+3YodOLl0I1NHgSzxhZjuC3zocMBHiPUZdxBoBcC5xxGsxjjob9zrvug2mN9L2/g/3vT7V50Jc8e7gJKYWKJ7Sqb8ge9pODOgBZWYHYnFmc9s8BGYsKFU9oaOT895PDhnkaVyul0w//EZl/LvcsZvC8cyFHlnsWj3omJgDkmhwwAOGLf4rE9JlQLe6b6jifforUkmXQyZQWkbBnScCul4hCyuOdALK0tH2rn2dBaQ+F+vupmlqklt4NWJYn8WT5CAQvvIDLS+QaEwByTUgpVEuLNo47DmrFi+4DKoXM40/CPO5YaMfRXj7o2l8iQmYP//GgF4BRWYEov/x9UWi/n9q+XcdnzYGqqfUmYCiE8ISLYAwr9SYe9WhMAMgTsqREZF54UVuvvw6k3B9tqpNJpO5aCPPYoz0Y3Z5kLJotLBMCyTsWuOoGuPuav4dDpM9RSL9f+rG/wHrir9CO40k88/DDEDr/66z8J08wASDPmKOOQ+ib5yP9x0c8qXR26uqRvPV2qJ07tTzgAE8feDIaFaolrrXWSFct7dJ5ALK8PHuq3+iTvBwadUAh/H7WG2/qlp//0rOXvwiFEJk8EbJvX778yRNMAMgzMhYT9sertf3iSjiNje4Dao3Mc8th3HMftGVp4XHFc/sWMwCpO+/q1JekLC9HyQ1zeKRvN8rn30/t2KF3Tr4Uqq7ek3hCiGyx7bixnsQjApgAkMfMQw8RiYWLdeqW26C9OGjHspC+514Yhx/mPtY+tH1JCiGQWlTVoTVlOXxY9suRL/9ul4+/n0okdPLmW2CvesOzmKJ0KMJTJkH28nYmjHo2JgDkudC3vgl7+QuwX18F7cFZ56ppG5K3/gZ2Ta02K0Z6/gDco9nM/y0C0vuvYTAqKxC9/jqYo0/iyz9P5NPvp5XS6Uceyy6DeXXSpGEg9J8/gHnkEd7EI2rFBIA8ZwwdIjLLn9fxj1dD7/DmxDPnw4+QvPEmqO3btezjbZdAIPslqRNJDa2QXLRkn/vMZWkponNmseAvD+XL72e/8x6Sv/4NtAfbYduYRx+F0He/zW1/5DkmAJQTgfHjEPjW+Uj//gHAiyIorWE9tzx7kl86rUUo5PnDUEQj7VvMkouq9jg3gE1+8l93/372mmod/9XVUBs2eBZT9OmNyNRJMIYM4cufPMcEgHJCBALCXlennbfe9uScAADQto3M/Q/C+NKB0Latc7EVqm2fuejVC6l7fwtVVw/z8MMQmXYlv/wLQHufgICJ9D2/hWrahsBJJyJ8xWUIjj4pZ7+f2rlTx6fNhP3mW94FlRLh712AwBmnexeTaDd8oFHOaKV05qlnEL9yWpe2ae2PHDAAsfnzYJ5xGmSO1uG1ZWm1ZQt0MgVZUgLRvx+nYAuISqW02rwZwnaA3r0g+/TJWc2Gaonr1J0LkLrnPujPqT/oLPOYYxC7/dcwR5bzvqOc4AwA5YyQUqhUSoe+/z2kfvs7b5YCAKgtW5C4YT5i/ft5Em9fvN5ySP6SYe9aSH8eZVk6ffe9SN39W2gPTyoUsSjCP/tvvvwpp3gaIOWUDIdFaMJFCBzjbUc/p6YWiRtugr2m2v02A6Iu0I6jraeeRmrJ3Z6+/BEIIPzT/0Jg7BjvYhLtAxMAyjlz+DARvuIyiD59vAuqNew33kRi1hw4dXVMAshXynF0ZvkLSMybD7V5s6exAyedgPBF/wUZifDrn3KKCQD5whx9EsKTJkCEQt4F1RrWSyuRuPlWqK1bmQSQb5xVbyBx/TyojZs8jSsGDkTkF1dADhzAlz/lHGsAyBcyFBKquVk7H3yEzFNPAx40CAKQbRf81NMQWsNpbNRGaSkfnJQz2nG0veoNxGfOgqpd62lsUVKC6C+vgHn0UZ7GJdofJgDkG9mrl7Crq7Xz8cdw1lR7F9i2kX7iSWgh4GzZqo0B/ZkEUE7Yq95Ay6+uhlpX53ns4LfOR+h7F/CkP/INlwDIV7K8HJFpV0IOHuR57MzTzyAxey6cxkYuB5CntONo69XXdPya67x/+QsB86QTEZk8kS9/8hVnAMhXsnUvfXLZPTpx86/32bK1yywLmcefgNAaautWLftzJoC8kcsvf2PkSMRmzYQxooz3K/mKCQB1i9AF34HzaTXSD//Bs/4AbdJPPwNICWf9Bm0MZQtV6jrlONppW/PPwctf9O2LyC9/DvOIw3mfku+YAFC3kL17C2fjRq02boD1z+e9KwoEsjUBjz8BHW+BvWaNNg88kA9X6jTtODrz1NNI3nIbHI8L/gBAhMMIT52EwFlneh6bqCOYAFC3MQYPFva/P9UtGzbC+eBDb4Nrjcxzy6Gad8L+6GMtDzk4Z22Dqfhoy9KZx/6MxE23QG3ydp8/AMA0EbrwAoR//CPIsPcHWxF1BIsAqVuZB31JRGdOhxxR5n1wrbNrt1f8EvZLL0M7DosD6Qup5madrFqKxNz5uXn5C4HQV89G+GeXQUbZ7Ie6D28+6nZaKZ15bjkS02ZAbd6Sk2vIQQMRnXUj5WH+AAANpElEQVQNgmedgVwcJUzFwdm6VafuWoTUvfd5XpsCIFvxf9yxiN1xG8zhw3gfUrfiEgB1OyGl0Lat9c+vQOLG+dAt3p0c2EZt2oz49Gug1q6Fam7WslcvPnxpD/Yn/9bxq2bAfmFFbl7+AIwvH4nY/HkwSofmJD5RZzABoLwgTFPoVEojnUb817cC8YTn19A7diB5+wI4NbVwGhq1MYxdA6l9jz9afvH/4Lz/Qc6uIysrEZs1E+bBB/G+o7zABIDyhgiHhUqltNqxHalFSzw9W72NTqeRfuzPUOvqYL3yqjZGHQ/Jo397LNXcrFP33Y/UwkW5We9vJUeUoeT6WTCPPSZn1yDqLCYAlFdkOCzUzp1a72xB+vcPeHvMahvbgfXa63B+8f8QnjIJKp7QMhZlEtDD2A0NOjF7LtJPPuVtQ6rPkIMGITr9agTGj+M9RnmFCQDlHXnAAULFExpCIH3/g9A5ejir9RuQvPkWOB98BHvtOm2Wj+ADugfQjqOtFS8i/t+Xw/7XBzlb7wcAWToU0WtmIHjWGTm7BlFXMQGgvCRjUaGamzUApH93f25mAgDoeAKZRx6F/f77SD/9jA6cfhokdwkULWfzZp247Q5kHv5DTqf8gd1e/uecDcEeFJSHmABQ3pK9emVnArTOzgTkoCYAALTjwPnwI8SvnI7wj38IZ/16bQwdygd2EVG2rdW//oXEVdORWf4CoFROrycHDeLLn/Ieb0zKe2rnTp28/U6kHngoJ7sD9mAaMI8+GpGpk2GOGwMZZW1AoVMbN+rUw39E+oGHoDZs9Lbt9D7IipGIXvWrbM8Jnu5HeYw3JxUElUrpzP0PIXHrbTnpE7CXYBDhH3wf4Yv+C0bFSP6dFCBlWdp+aSUSd/4fnLffyflXP5Dd6lfyv/MRGHUc7xnKe7xJqWDoVEqn7n8IyTsXQG/bnvsLGgaM8nKEL/oJAmefBWPIYP69FABtWdpZswap++5H5qmn/blXhIA56nhEr/4VzGOPgWg99poon/EmpYKibVtn/v4PJGZfn53O9YEwTZijjkd4wkUwTz2ZRYJ5TDU16dSDDyPzwENwGhpzPt0PAJASgRNPQOzGuTAqK3hvUMHgzUoFR9m2dl57HfHZ8+B88ok/D3khIGIxBM86E6H//AHMo47kmQJ5xGnapu3nX0Dynt9Crf4kZwWjnyVCQQS+ejai10yHHDCABX9UUHizUkHSSmnn49VIzJ4L6/VVvqzvthH9+yN4ztkI//g/IQ+shAwG+XfUTVRLXFsvvoT0/Q/Afv0N3178ACAiEYR+/J8IT50Eo18/3gNUcHjTUkFzGht18n9vRfovT+S0octepITo0wfBb52P8Le/CeOIw7nu6yPV3KztV19H8vcPwFn1BnQix7tDPkMO6I/Izy5D8MILICM80pcKE29cKnhq+3aduu/3SN19rz8FX7sTArJ0KAJjxyB04QUwjjgcMhbj31UOaMfRqqkJ9vMrkP7LE7DfeQd6Z4u/g5ASRsVIRK+dgcC4sRA8R4IKGG9eKhrpR/+sE7fdDlVX709dwGeISASBc85G6Otfg3niKPDIYe/YtWu1/dJKpB95DPZbb3fPIKRE4NRTELt2Bov9qCjwJqaioW1bOx98iMRtt8N66WXAsrplHKJXLxiHHITgeecgeMopEKWlkFFOE3eW2rZdO//+FOmnnoa14kXouvqctYT+IrJfP4T+40KEfvIjGEOH8LekosAbmYqO2rJFp5YsQ/K++wGf14Y/S5aWInDqyQiecTrM8WO5XtwBTkOjtpYvR+bZ57KFfd39G44sR/SXP0fwvHPZ2Y+KCm9mKko6kdSZfy7//+3d+Y9e11kH8O+97zpeYo+X8R5vwaVKHDtVcJWtiZuqREgIEaVQ8QPQVkJAJZD4S5AqJEQLFRWgwk+FbNRWBKUbrZPShJDG9RJiZ7yMx2M7bjMz77zvvfzwBimN0uCQ2DOe+Xx+G2k0urpznufce895npPpL/xZBi8fnd+LKYoUK1em3LY17YcPpvXgx9LYtTNZvTqlsrHUc3N1dX4i/f98Mb1Dh9N/9rnUExeu2ymQ16rodtN66MGM/Mkfp7F7l8mfRceAZlHrHz9Rv/GnX0j/0OEbWiL2bopVq9L88IfSvOuutD5+MM07bk867SVVRVD1+3WuXEnv299J/9++lf6L/5Xq+InU87Rs83bF6OqM/OHvp/Pp30x5y8ol839haTGwWfSqq1fr3j8+num/+NJwHfkG9gx4V81mim435bataX30QJr33pPGju0pN29KuXJxTTp1VdXV5GSqM2fTf/lo5r7xzfT/44epL19OZmbmZdPmOylarTTvvScjf/T5NO/cm0KPBxYxg5sloR4M6v7Ro5n58y9m7uuH5/3z8jtqt9PYtDHFli1pfvgX0zpwdxp37k2xYkWKTid1q3VTLBnUg0Fdz/aSXi/V2XPp/+AHmTvyXKpXXkk1fibVxYs3tHHTNSmKlBvG0v2d3077sV9PY2xswd9neL8McpaU6ic/rXtPPZ2ZL/1VBseOL7yJ6H8VRYpGIxkZSfNDe9LYe3sae/aksW1bik0bU46tXzBlhnVV1dWFyVQXLqQaH0/136+m//LRDJ5/IdVr46n7/eF9XiBv+W9XdLtp3n9vRj7/B2nu36edL0uGgc6SNDh+op75yt+k98RTqaamFuzk9DPKcvg1YHR1ylWrUq5fl3LHjjR27kixdUsamzalWLYsabVStNtJo5Gi3U5dJEWn854mtrrXq+t+f3hfZnupq0HSm0t6s6kuXU515mwG4+MZHP1x6jNnh/fw9auppqYW5teVd9JsprFzR7qf+0xaj3wyjdFR+ZAlxYBnyaoGg7r/ne9m5ot/mf63vzt8U73JFatWpVy3NuXYWDLSTbl+fdJqpVy/bvhQ8JbfK5avGP5QV8MJ/C2bJAcXp5KfvpF6dib1xETq6ZlUExdSnzu3YDbqvR/FmtF0fu1X0/nsZ9K8dZs8yJJk4LPkVZOT9dy/fiPTX/5KBkd/PG8NhG6oVitpNZMkRYphhcSNPEthnhS33JLWffek+9nfTWPvHfoysKQZ/PCmwfh43Xv8yUx/+a9Tnzs/35fDB6ks0/zIXen+3ufSeuD+lMuWyX0seYIA3qKem6sHp05n9qt/n97XD6c6dfrm2B/AOyq63TTuuD2d33gsrU9+IuWqVTb5wZsEAvwc/Zd+VM9+9R8y+/gTqa+8viQ+kS8WRbud8hduS/e3Pj3c4LdunVwHbyMo4F1UvV5dnTmb2b/9u/SePpRqfHzhlg6StJpp7tuX9mOPpvMrjwyrJpZQh0V4LwQGXIO6368HJ06md+hwel/7p2F9+81S7rbYFUWKlSvS3L8/nU89muaBA2ls3CC3wf9BkMB7VE1O1r0nn87sE09l8MPn5+2IWpJizZq07rs3nU89mtZHD6ToduU0uEaCBf4f6qqqq6mpDF76UWa/9ngG3/t+qvPnF0WN/EJXrFiRxo7taX/i42k98sspb92WcvlyuQzeI0ED71NdVXX16qn0nvmXzD3zTOaOPLc0egncYOWa0TQPPpTWwYfSfuD+lKtXyV/wPggg+IDUVVVXly6nOnkys08+ncGzz2Vw6nTqK1fm+9JuTo1Gyg1jaezcmdbDB9M6+GDKDRu87cMHRCDBdVJNTdX9F19K/8iRzP7zoVQnXxlWEKgi+LmKRiPpdtP8pbvTfvhgGh/Zn8bu21KOWNuHD5qgguusnpur66s/yeD48cx981uZ+/6RVK+eTjUxobdAknS7KbduSXP37rQ+9kCaB+5OuXlTipERJXxwHQkuuMHqq1frwanT6R87nsGRZzP3799LdX4i6fWGFQWLufPgmycUFstGUu7aldb996W57840dm5PsXlzynZbToIbRLDBPKoHg7ru9VIdO57+8y+k//wLGbx6KtXp11KdP78olguKTifl1q0pt21JY8+eNO/cm+b+fSk3bhg+EGjNC/NC4MECUvf7dXX5cuqLU6nOnc/g2LFUJ06m/+JLqaemUk2/kczMpJ7tJQvp+OJWK+XISNLtJsuXpbF5cxp7b09j1640btudYu2alGvXpli+3IQPC4RAhJtENTVV90+cTP3aeKozZ1JNXBj2HpicTHVxKtWly6kvXbq+F9Fsply3NsXoaMrR0ZRj61OsX59y48Y0tm9LuXVrGttvTeG0PVjwBCncpOp+v870dOqZ2dSzM0lvLvXsbKrJi6lfv/IzDwTV+NnUM9PX/LfLsbEUK1ckRZFy8+YUIyMpN4ylWL4s6XRSdDpJuz3cqNfp2KwHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXIP/AaA9WKQrVaF9AAAAAElFTkSuQmCC";
	var vi = new pi;
	vi.src = gi;
	var yi = function e(t) {
			this.images = {};
			this.crossOrigin = t;
			this._whenReady = null;
			this._nbLoaded = 0;
			this._nbToLoad = 0
		};
	yi.prototype.whenReady = function e(t) {
		if (this._nbLoaded === this._nbToLoad) {
			t()
		} else {
			this._whenReady = t
		}
	};
	yi.prototype.use = function e(t, r, n) {
		var i = this;
		var o = this.images[t];
		if (o) {
			if (n) {
				return
			}
			if (o.loaded) {
				r(o.content)
			} else {
				o.onLoad.push(r)
			}
		} else {
			this._nbToLoad += 1;
			var s = new pi;
			o = {
				content: s,
				loaded: false,
				onLoad: [r]
			};
			o.content.crossOrigin = this.crossOrigin;
			o.content.src = t;
			o.content.onload = function() {
				o.loaded = true;
				o.onLoad.forEach(function(e) {
					e(o.content)
				});
				o.onLoad = undefined;
				i._nbLoaded += 1;
				if (i._nbLoaded === i._nbToLoad && i._whenReady) {
					i._whenReady();
					i._whenReady = null
				}
			};
			o.content.onerror = function() {
				if (!i.images[t]) {
					i.images[t].content = vi;
					o.loaded = true;
					o.onLoad.forEach(function(e) {
						e(o.content)
					});
					o.onLoad = undefined
				}
				i._nbLoaded += 1;
				if (i._nbLoaded === i._nbToLoad && i._whenReady) {
					i._whenReady();
					i._whenReady = null
				}
			};
			this.images[t] = o
		}
	};
	yi.prototype.kill = function e() {
		tt(this);
		this.images = undefined
	};
	yi.prototype.getErrorImage = function e() {
		return vi
	};
	yi.prototype.getImage = function e(t) {
		var r = this.images[t];
		if (r && r.loaded) {
			return r.content
		} else {
			return null
		}
	};
	var _i = function e(t, r, n, i) {
			var o = this;
			this.width = t;
			this.height = r;
			this.animationsEnabled = true;
			this.animationMode = false;
			this.animationDuration = 0;
			this.animationEndDate = 0;
			this.defaultFont = i.defaultFont;
			this._visibilityConditionTolerance = 0;
			this.shadowsEnabled = false;
			this.shadowOffsetY = 0;
			this.shadowBlur = 0;
			this.semanticLayers = n;
			this.options = i;
			this.noRefresh = i.noRefresh;
			this.now = ie();
			this._dummyDom = {
				style: {},
				addEventListener: function() {}
			};
			var s = function(e) {
					if (i.onRender) {
						i.onRender(e)
					}
					o.currentTime = ie();
					o.render(e);
					if (o.currentTime <= o.animationEndDate) {
						o.refresh()
					}
				};
			this.frameManager = new ci(s, i.debug);
			this.imageManager = new yi(i.imgCrossOrigin);
			this.DEFAULT_LAYER = {
				camera: {
					x: 0,
					y: 0,
					zoom: 1,
					angle: 0
				}
			}
		};
	_i.prototype.setFpsLimit = function e(t) {
		this.frameManager.setFpsLimit(t)
	};
	_i.prototype.reloadFonts = function e() {};
	_i.prototype.kill = function e() {};
	_i.prototype.whenImagesLoaded = function e(t) {
		this.imageManager.whenReady(t)
	};
	_i.prototype.setOffset = function e(t) {
		this._offset = t
	};
	_i.prototype.animate = function e(t, r) {
		this.currentTime = ie();
		this.animationMode = true;
		this.animationDuration = t;
		if (this.currentTime + t > this.animationEndDate) {
			this.animationEndDate = this.currentTime + t
		}
		r();
		this.animationMode = false
	};
	_i.prototype.setAnimationsEnabled = function e(value) {
		this.animationsEnabled = !! value
	};
	_i.prototype.setVisibilityConditionTolerance = function e(value) {
		this._visibilityConditionTolerance = value
	};
	_i.prototype.getSemanticLayer = function e(t) {
		if (t === undefined) {
			return this.DEFAULT_LAYER
		}
		var r = this.semanticLayers[t];
		if (!r) {
			throw new Error('sub-layer "' + t + '" does not exist')
		}
		return r
	};
	_i.prototype.refresh = function e() {
		if (!this.noRefresh) {
			this.frameManager.requestNewFrame()
		}
	};
	_i.prototype.atNextFrame = function e(t) {
		this.frameManager.atNextFrame(t);
		this.refresh()
	};
	_i.prototype.wrappedUpdate = function e(t, r, n) {
		var i = this.updateComposite(t, r);
		for (var o = 0; o < i.length; ++o) {
			i[o] = n(i[o], o)
		}
		return this.composite(t, i)
	};
	_i.prototype.hide = function e(t) {
		return this.setDepth(t, -1)
	};
	_i.prototype.clear = function e() {};
	_i.prototype.domElement = function e() {
		return this._dummyDom
	};
	_i.prototype.resize = function e(t, r) {};
	_i.prototype.delete = function e(t) {};
	_i.prototype.updateComposite = function e(t, r) {
		return []
	};
	_i.prototype.composite = function e(t, r) {};
	_i.prototype.setDepth = function e(t, r) {};
	_i.prototype.setSymbolicSize = function e(t, r) {};
	_i.prototype.setColor = function e(t, r) {};
	_i.prototype.setVisibilityCondition1 = function e(t, r, n, i) {};
	_i.prototype.setVisibilityCondition2 = function e(t, r, n, i) {};
	_i.prototype.setBackgroundColor = function e(t) {};
	_i.prototype.circle = function e(t, r, n, i, o, s, a, u) {};
	_i.prototype.triangle = function e(t, r, n, i, o, s, a, u) {};
	_i.prototype.rectangle = function e(t, r, n, i, o, s, a, u) {};
	_i.prototype.quadrilateral = function e(t, r, n, i, o, s, a, u, l, d) {};
	_i.prototype.polygon = function e(t, r, n, i, o, s) {};
	_i.prototype.line = function e(t, r, n, i, o, s, a, u, l) {};
	_i.prototype.quadraticCurve = function e(t, r, n, i, o, s, a, u, l, d) {};
	_i.prototype.cubicCurve = function e(t, r, n, i, o, s, a, u, l, d, f) {};
	_i.prototype.image = function e(t, r, n, i, o, s, a, u, l) {};
	_i.prototype.text = function e(t, r, n, i, o, s, a, u, l, d, f, h, c, p) {};
	_i.prototype.textWidth = function e(t, r, n, i) {};
	_i.prototype.render = function e(t) {};
	var mi = 22;
	var xi = 1 / Math.pow(2, mi);
	var bi = 16;
	var Ai = 4;
	var wi = Math.pow(2, mi - Ai);
	var Ei = wi / 6 * 5 * xi;
	var Ii = wi * xi;
	var Si = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") !== null : false;
	var Ci = 2 * Math.PI;
	var Ti = Math.PI / 2;
	var Li = Math.PI;
	var Ni = new Array(128);
	var zi = kt().getContext("2d");
	var Mi = null;
	var ki = null;
	var Ri = null;
	var Fi = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

	function Pi(e) {
		for (var t = 0; t < e.length; ++t) {
			if (Fi.indexOf(e.charAt(t)) === -1) {
				return false
			}
		}
		return true
	}
	function Di(e) {
		return typeof e === "number" && e % 1 === 0 && e >= 0 && e !== 4294967295
	}
	var Oi = function(e) {
			function t(t, r, n, i) {
				var o = this;
				if (i === void 0) i = {};
				e.call(this, t, r, n, i);
				this._parseColor = q;
				this._enableImages = true;
				this.canvas = kt(t, r);
				this.ctx = this.canvas.getContext("2d");
				this.backgroundColor = i.backgroundColor;
				this.canvas.style.position = "absolute";
				this.canvas.style.top = "0px";
				this.canvas.style.left = "0px";
				this.atomicShapes = [];
				this.nbAtomicShapes = 0;
				this.shapes = new sn({
					type: Int8Array,
					components: Array,
					info: Array,
					prevInfo: Array,
					depth: Float32Array,
					semanticLayer: Array,
					symbolicSize: Float32Array,
					threshold: Float32Array,
					animationDuration: Float32Array,
					creationDate: Int32Array,
					visibilityCondition1: Array,
					visibilityCondition2: Array
				});
				this._refresh = function() {
					return o.refresh()
				}
			}
			if (e) t.__proto__ = e;
			t.prototype = Object.create(e && e.prototype);
			t.prototype.constructor = t;
			t.prototype.setImagesEnabled = function e(value) {
				this._enableImages = !! value
			};
			t.prototype.clear = function e() {
				this.shapes.clear();
				this.shapes.attributes.type.fill(qi.DELETED);
				this.atomicShapes = [];
				this.nbAtomicShapes = 0
			};
			t.prototype.domElement = function e() {
				return this.canvas
			};
			t.prototype.resize = function e(t, r) {
				Vt(this.canvas, t, r);
				this.refresh();
				this.width = t;
				this.height = r
			};
			t.prototype.delete = function e(t) {
				var r = this;
				var n = this.shapes.attributes;
				if (!Di(t) || n.type[t] === qi.DELETED) {
					return -1
				}
				if (n.type[t] === qi.COMPOSITE) {
					var i = n.components[t];
					for (var o = 0; o < i.length; ++o) {
						r.delete(i[o])
					}
				} else {
					Qi(this, t)
				}
				n.type[t] = qi.DELETED;
				this.shapes.remove(t);
				return -1
			};
			t.prototype.updateComposite = function e(t, r) {
				var n = this;
				var i = this.shapes.attributes,
					o = i.type[t];
				if (!Di(t) || o === qi.DELETED) {
					return []
				}
				var s = i.components[t];
				if (o !== qi.COMPOSITE) {
					Qi(this, t);
					i.type[t] = qi.COMPOSITE;
					return []
				} else if (s.length !== r) {
					for (var a = 0; a < s.length; ++a) {
						n.delete(s[a])
					}
					return []
				}
				return s
			};
			t.prototype.composite = function e(t, r) {
				var n = this.shapes.attributes;
				if (Di(t) && n.type[t] === qi.COMPOSITE) {
					var i = n.components[t];
					if (i !== r) {
						n.components[t] = r
					}
					return t
				} else {
					var o = this.shapes.add();
					n.type[o] = qi.COMPOSITE;
					n.components[o] = r;
					return o
				}
			};
			t.prototype.setDepth = function e(t, r) {
				Vi(this, t, "depth", r, Hi);
				this.refresh()
			};
			t.prototype.setColor = function e(t, r) {
				Vi(this, t, "color", r);
				this.refresh()
			};
			t.prototype.setVisibilityCondition1 = function e(t, r, n, i, o) {
				Vi(this, t, "visibilityCondition1", r ? [n, i, o] : null)
			};
			t.prototype.setVisibilityCondition2 = function e(t, r, n, i, o) {
				Vi(this, t, "visibilityCondition2", r ? [n, i, o] : null)
			};
			t.prototype.triangle = function e(t, r, n, i, o, s, a, u, l) {
				return Ji(this, t, qi.POLYGON, [o, undefined, Yi(this, r), Yi(this, n), Yi(this, i)], s, a, u, l)
			};
			t.prototype.circle = function e(t, r, n, i, o, s, a, u, l) {
				return Ji(this, t, qi.CIRCLE, [o, Yi(this, r), n, i], s, a, u, l)
			};
			t.prototype.rectangle = function e(t, r, n, i, o, s, a, u, l) {
				Br(r, n, Bi, Ui, Xi, ji);
				return this.quadrilateral(t, Bi, Ui, Xi, ji, i, o, s, a, u, l)
			};
			t.prototype.quadrilateral = function e(t, r, n, i, o, s, a, u, l, d, f) {
				return Ji(this, t, qi.POLYGON, [s, Gi(f), Yi(this, r), Yi(this, n), Yi(this, i), Yi(this, o)], a, u, l, d)
			};
			t.prototype.polygon = function e(t, r, n, i, o, s, a) {
				var u = this;
				var l = new Array(r.length + 2);
				l[0] = n;
				for (var d = 0; d < r.length; ++d) {
					l[d + 2] = Yi(u, r[d])
				}
				return Ji(this, t, qi.POLYGON, l, i, o, s, a)
			};
			t.prototype.line = function e(t, r, n, i, o, s, a, u, l, d) {
				return Ji(this, t, qi.LINE, [s, i, o, Yi(this, r), Yi(this, n)], a, u, l, d)
			};
			t.prototype.quadraticCurve = function e(t, r, n, i, o, s, a, u, l, d, f) {
				return Ji(this, t, qi.QUADRATIC, [a, o, s, Yi(this, r), Yi(this, n), Yi(this, i)], u, l, d, f)
			};
			t.prototype.cubicCurve = function e(t, r, n, i, o, s, a, u, l, d, f, h) {
				return Ji(this, t, qi.CUBIC, [u, s, a, Yi(this, r), Yi(this, n), Yi(this, i), Yi(this, o)], l, d, f, h)
			};
			t.prototype.image = function e(t, r, n, i, o, s, a, u, l, d) {
				this.imageManager.use(i, this._refresh, true);
				return Ji(this, t, qi.IMAGE, [i, Yi(this, r), Yi(this, n), o, s], a, u, l, d)
			};
			t.prototype.text = function e(t, r, n, i, o, s, a, u, l, d, f, h, c, p, g) {
				return Ji(this, t, qi.TEXT, [a, n, Yi(this, r), o, s, i, u, l, d, Gi(g)], f, h, c, p)
			};
			t.prototype.textWidth = function e(t, r, n, i) {
				if (r !== ki || n !== Mi || i !== Ri) {
					zi.font = (i === "italic" || i === "bold" ? i + " " : "") + n + "px " + r;
					Mi = n;
					ki = r;
					Ri = i
				}
				return zi.measureText(t).width
			};
			t.prototype.stopAnimations = function e() {
				this.shapes.attributes.animationDuration.fill(0);
				this._refresh()
			};
			t.prototype.setBackgroundColor = function e(t) {
				this.options.backgroundColor = t
			};
			t.prototype.render = function e(t) {
				var r = this;
				var n = Ut(),
					i = this.shapes.attributes,
					o = this.atomicShapes,
					s = this.nbAtomicShapes,
					a = this.ctx,
					u = this.width,
					l = this.height,
					d = 0,
					f = 0,
					h = 0,
					c = null,
					p = null,
					g = null,
					v = null,
					y = null,
					_ = -1,
					m = Ni,
					x = 0,
					b = null,
					A = false,
					w = 0,
					E = 0,
					I = "black",
					S = this._parseColor,
					C = -1,
					T = this.animationsEnabled,
					L = this.currentTime,
					N = this._visibilityConditionTolerance,
					z = this._enableImages;
				a.clearRect(0, 0, u * n, l * n);
				if (this.options.backgroundColor) {
					a.fillStyle = this.options.backgroundColor;
					a.fillRect(0, 0, u * n, l * n)
				}
				function M(e, t, r) {
					var i = te[e],
						o = C !== -1 ? re[e] : undefined,
						s, a, u = t !== undefined ? te[t] : undefined,
						l, h;
					if (!u) {
						s = (i.x - W) * Y + i.ax;
						a = (i.y - G) * Y + i.ay;
						d = V * s + q * a + i.zx * Y + i.ox;
						f = -q * s + V * a + i.zy * Y + i.oy;
						if (o) {
							s = (o.x - W) * Y + o.ax;
							a = (o.y - G) * Y + o.ay;
							l = V * s + q * a + o.zx * Y + o.ox;
							h = -q * s + V * a + o.zy * Y + o.oy;
							d = l + (d - l) * C;
							f = h + (f - h) * C
						}
					} else {
						E = 0;
						var c, p, g = Math.abs(u.size) * Y;
						if (u.ratio === -1) {
							c = u.textWidth;
							p = u.textHeight
						} else {
							c = u.textWidth * Y;
							p = u.textHeight * Y
						}
						if (u.length > -99999 && u.length * Y < c) {
							w = 0
						} else {
							w = H - u.angle;
							var v = u.size >= 0 ? -1 : 1;
							if (u.length >= -99999) {
								if (w < -Ti) {
									w += Li;
									if (w < -Ti) {
										w += Li
									}
								} else if (w > Ti) {
									w -= Li;
									if (w > Ti) {
										w -= Li
									}
								}
							}
							E = v * ((p + g) / 2 + u.strokeSize)
						}
						s = (i.x - W) * Y;
						a = (i.y - G) * Y;
						var y = V * s + q * a,
							_ = -q * s + V * a;
						if (r) {
							E += i.oy;
							if (o) {
								s = (o.x - W) * Y;
								a = (o.y - G) * Y;
								var m = V * s + q * a,
									x = -q * s + V * a;
								d = m + (y - m) * C;
								f = x + (_ - x) * C
							} else {
								d = y;
								f = _
							}
						} else {
							var b = Math.cos(w),
								A = Math.sin(w),
								I = i.ox + i.zx * Y,
								S = i.oy + i.zy * Y + E;
							d = b * I + A * S + y;
							f = -A * I + b * S + _;
							if (o) {
								s = (o.x - W) * Y;
								a = (o.y - G) * Y;
								m = V * s + q * a;
								x = -q * s + V * a;
								l = b * I + A * S + m;
								h = -A * I + b * S + x;
								d = l + (d - l) * C;
								f = h + (f - h) * C
							}
						}
					}
					d = d * n | 0;
					f = f * n | 0
				}
				function k() {
					if (re && C !== -1) {
						h = (re[2] + (te[2] - re[2]) * C) * Y + (re[3] + (te[3] - re[3]) * C)
					} else {
						h = te[2] * Y + te[3]
					}
					h = h * n | 0
				}
				function R() {
					if (!re || C === -1) {
						I = te[0]
					} else {
						var e = S(re[0]),
							t = S(te[0]);
						if (e === t) {
							I = te[0]
						} else {
							var r = e[0] + (t[0] - e[0]) * C,
								n = e[1] + (t[1] - e[1]) * C,
								i = e[2] + (t[2] - e[2]) * C,
								o = e[3] + (t[3] - e[3]) * C;
							I = "rgba(" + (r * 255 | 0) + ", " + (n * 255 | 0) + ", " + (i * 255 | 0) + ", " + o + ")"
						}
					}
				}
				function F() {
					var e = L - i.creationDate[O];
					C = re && T && e < i.animationDuration[O] ? e / i.animationDuration[O] : -1
				}
				function P(e) {
					if (!e) {
						return true
					}
					var t = (e[0] - W) * Y;
					var r = (e[1] - G) * Y;
					d = V * t + q * r;
					f = -q * t + V * r;
					h = e[2] * Y;
					return d + h > -N && f + h > -N && d - h < u + N && f - h < l + N
				}
				for (var D = 0; D < s; ++D) {
					var O = o[D],
						B = i.semanticLayer[O],
						U = i.symbolicSize[O],
						X = i.threshold[O],
						j = B.camera,
						W = j.x,
						G = j.y,
						H = j.angle,
						Y = j.zoom,
						V = Math.cos(H),
						q = Math.sin(H);
					if (B.disabled || U !== -1 && U * B.camera.zoom < X) {
						continue
					}
					var Z = i.visibilityCondition1[O],
						Q = i.visibilityCondition2[O];
					if (!P(Z) && !P(Q)) {
						continue
					}
					if (B.defineClipSpace) {
						var J = i.depth[O];
						if (_ !== J || b !== B) {
							_ = J;
							b = B;
							x = 1;
							m[0] = O
						} else {
							m[x] = O;
							x += 1
						}
					} else if (B.useClipSpace && i.depth[O] === _ && i.type[O] !== qi.TEXT) {
						Y = i.semanticLayer[O].camera.zoom;
						A = true;
						a.save();
						a.beginPath();
						for (ne = 0; ne < x; ++ne) {
							var K = m[ne];
							ee = i.type[K];
							te = i.info[K];
							re = i.prevInfo[K];
							F();
							if (ee === qi.POLYGON) {
								for (var $ = 2; $ < te.length; ++$) {
									M($);
									a[$ === 2 ? "moveTo" : "lineTo"](d, f)
								}
								a.closePath()
							} else if (ee === qi.CIRCLE) {
								M(1);
								h = (te[2] * Y + te[3]) * n;
								a.arc(d, f, h, 0, Ci)
							}
						}
						a.clip()
					}
					var ee = i.type[O],
						te = i.info[O],
						re = i.prevInfo[O];
					F();
					if (ee === qi.POLYGON || ee === qi.TEXT || ee === qi.CIRCLE) {
						R();
						a.fillStyle = I;
						a.strokeStyle = I;
						a.lineWidth = .08 * n
					} else if (ee === qi.LINE || ee === qi.QUADRATIC || ee === qi.CUBIC) {
						R();
						a.strokeStyle = I;
						a.lineWidth = (te[1] * Y + te[2]) * n
					}
					a.beginPath();
					if (ee === qi.POLYGON) {
						for (var ne = 2; ne < te.length; ++ne) {
							M(ne, 1);
							if (ne === 1) {
								a.moveTo(d, f)
							} else {
								a.lineTo(d, f)
							}
						}
						a.closePath();
						a.fill();
						a.stroke()
					} else if (ee === qi.CIRCLE) {
						M(1);
						k();
						a.arc(d, f, h, 0, Ci);
						a.fill()
					} else if (ee === qi.LINE) {
						M(3);
						a.moveTo(d, f);
						M(4);
						a.lineTo(d, f);
						a.stroke()
					} else if (ee === qi.QUADRATIC) {
						M(3);
						a.moveTo(d, f);
						M(4);
						var ie = d,
							oe = f;
						M(5);
						a.quadraticCurveTo(ie, oe, d, f);
						a.stroke()
					} else if (ee === qi.CUBIC) {
						M(3);
						a.moveTo(d, f);
						M(4);
						var se = d,
							ae = f;
						M(5);
						var ue = d,
							le = f;
						M(6);
						a.bezierCurveTo(se, ae, ue, le, d, f);
						a.stroke()
					} else if (ee === qi.TEXT) {
						var de = te[3],
							fe = te[4],
							he = te[5],
							ce = te[6],
							pe = te[7],
							ge = te[8],
							ve = (de * Y + fe) * n,
							ye = te[1];
						if (he === "FontAwesome" && Pi(ye)) {
							he = r.defaultFont
						}
						if (ve !== p || he !== c || ce !== g) {
							var _e = (ce === "italic" || ce === "bold" ? ce + " " : "") + ve + "px " + he;
							a.font = _e;
							p = ve;
							c = he;
							g = ce
						}
						if (pe !== v) {
							a.textAlign = pe;
							v = pe
						}
						if (ge !== y) {
							a.textBaseline = ge;
							y = ge
						}
						M(2, 9, true);
						if (te[9]) {
							a.save();
							a.translate(d, f);
							a.rotate(-w);
							a.fillText(ye, 0, E * n);
							a.restore()
						} else {
							a.fillText(ye, d, f)
						}
					} else if (ee === qi.IMAGE && z) {
						var me = r.imageManager.getImage(te[0]),
							xe = te[3],
							be = te[4],
							Ae = te[2];
						if (me) {
							M(1);
							var we = ((Ae.zx + Ae.x) * Y + Ae.ox) * n,
								Ee = ((Ae.zy + Ae.y) * Y + Ae.oy) * n;
							if (xe) {
								a.drawImage(me, d - we, f - Ee, we * 2, Ee * 2)
							} else {
								a.save();
								a.beginPath();
								a.rect(d - we, f - Ee, we * 2, Ee * 2);
								a.clip();
								if (!be) {
									a.drawImage(me, d - me.width / 2, f - me.height / 2, me.width, me.height)
								} else {
									var Ie = 0,
										Se = 0,
										Ce = d - we,
										Te = f - Ee;
									d -= me.width / 2;
									while (d > Ce) {
										d -= me.width;
										Ie += 1
									}
									f -= me.height / 2;
									while (f > Te) {
										f -= me.height;
										Se += 1
									}
									var Le = f;
									Ie = Ie * 2 + 1;
									Se = Se * 2 + 1;
									for (ne = 0; ne < Ie; ++ne) {
										for ($ = 0; $ < Se; ++$) {
											a.drawImage(me, d, f, me.width, me.height);
											f += me.height
										}
										f = Le;
										d += me.width
									}
								}
								a.restore()
							}
						}
					}
					if (A) {
						A = false;
						a.restore()
					}
				}
			};
			return t
		}(_i);
	Oi.available = Si;
	var Bi = new Or;
	var Ui = new Or;
	var Xi = new Or;
	var ji = new Or;
	var Wi = ["textWidth", "textHeight", "angle", "length", "size", "strokeSize", "ratio"];

	function Gi(e) {
		if (!e) {
			return undefined
		}
		var t = {};
		for (var r = 0; r < Wi.length; ++r) {
			var n = Wi[r];
			t[n] = e[n]
		}
		return t
	}
	function Hi(e, t) {
		Qi(e, t);
		Zi(e, t)
	}
	function Yi(e, t) {
		var r = e._offset,
			n = {
				x: t.x,
				y: t.y,
				zx: t.zx,
				zy: t.zy,
				ax: t.ax,
				ay: t.ay,
				ox: t.ox,
				oy: t.oy
			};
		if (r) {
			n.x += r.x;
			n.y += r.y;
			n.zx += r.zx;
			n.zy += r.zy;
			n.ax += r.ax;
			n.ay += r.ay;
			n.ox += r.ox;
			n.oy += r.oy
		}
		return n
	}
	function Vi(e, t, r, value, n) {
		var i = e.shapes.attributes;
		if (Di(t) && i.type[t] !== qi.DELETED) {
			if (i.type[t] === qi.COMPOSITE) {
				var o = i.components[t];
				for (var s = 0; s < o.length; ++s) {
					Vi(e, o[s], r, value, n)
				}
			} else {
				if (r === "depth" && i.semanticLayer[t].transparency) {
					value -= xi
				}
				i[r][t] = value;
				if (n) {
					n(e, t)
				}
			}
		}
	}
	var qi = {
		DELETED: -1,
		COMPOSITE: 0,
		POLYGON: 1,
		CIRCLE: 2,
		IMAGE: 3,
		TEXT: 4,
		LINE: 5,
		QUADRATIC: 6,
		CUBIC: 7
	};

	function Zi(e, t) {
		var r = e.shapes.attributes,
			n = e.atomicShapes,
			i = e.atomicShapes.length,
			o = r.depth[t],
			s = r.semanticLayer[t],
			a = s.level;
		if (o < 0) {
			return
		}
		for (var u = 0; u < i; ++u) {
			var l = n[u],
				d = r.depth[l],
				f = r.semanticLayer[l],
				h = f.level;
			if (o < d || o === d && a < h) {
				break
			}
		}
		if (u === i) {
			n.push(t)
		} else {
			n.splice(u, 0, t)
		}
		e.nbAtomicShapes += 1;
		e.refresh()
	}
	function Qi(e, t) {
		var r = e.atomicShapes.lastIndexOf(t, e.nbAtomicShapes - 1);
		if (e.nbAtomicShapes > 0 && r !== -1) {
			e.atomicShapes.splice(r, 1);
			e.nbAtomicShapes -= 1
		}
	}
	function Ji(e, t, r, n, i, o, s, a) {
		if (s === undefined) {
			s = -1
		}
		if (a === undefined) {
			a = 0
		}
		var u = e.shapes.attributes,
			l = true;
		if (!Di(t) || u.type[t] === qi.DELETED) {
			t = e.shapes.add()
		} else if (u.type[t] === qi.COMPOSITE) {
			var d = u.components[t];
			for (var f = 0; f < d.length; ++f) {
				e.delete(d[f])
			}
		} else {
			l = false
		}
		var h = e.getSemanticLayer(i);
		if (l || o !== undefined) {
			o = Be(o, 1);
			if (h.transparency) {
				o -= xi
			}
			u.depth[t] = o
		}
		u.components[t] = undefined;
		if (e.animationMode) {
			if (!u.prevInfo[t] || u.creationDate[t] + u.animationDuration[t] < e.currentTime) {
				u.prevInfo[t] = l ? undefined : u.info[t];
				u.creationDate[t] = e.currentTime;
				u.animationDuration[t] = e.animationDuration
			}
		} else {
			u.prevInfo[t] = undefined;
			u.creationDate[t] = e.currentTime;
			u.animationDuration[t] = 0
		}
		u.info[t] = n;
		u.visibilityCondition1[t] = null;
		u.visibilityCondition2[t] = null;
		u.type[t] = r;
		u.semanticLayer[t] = h;
		u.symbolicSize[t] = s;
		u.threshold[t] = a;
		if (l) {
			Zi(e, t)
		} else {
			Hi(e, t)
		}
		return t
	}
	var Ki = {
		DELETED: -1,
		COMPOSITE: 0,
		POLYGON: 1,
		CIRCLE: 2,
		IMAGE: 3,
		TEXT: 4,
		LINE: 5,
		QUADRATIC: 6,
		CUBIC: 7,
		DUPLICATE_IMG: 8
	};
	var $i = ["g", "polygon", "circle", "image", "text", "line", "path", "path", "rect"];
	var eo = new Or;
	var to = new Or;
	var ro = new Or;
	var no = new Or;
	var io = kt().getContext("2d");
	var oo = null;
	var so = null;
	var ao = null;
	var uo = Math.PI / 2;
	var lo = Math.PI;
	var fo = 180 / lo;
	var ho = new Array(128);
	var co = {
		left: "start",
		right: "end",
		center: "middle"
	};
	var po = {
		top: "hanging",
		bottom: "baseline",
		middle: "central"
	};
	var go = function(e) {
			function t(t, r, n, i) {
				var o = this;
				if (i === void 0) i = {};
				e.call(this, t, r, n, i);
				this._parseColor = q;
				this.svg = Qt("svg");
				this.svg.style.userSelect = "none";
				this.svg.style.webkitUserSelect = "none";
				this.svg.style.MozUserSelect = "none";
				this.defs = Qt("defs");
				this.svg.appendChild(this.defs);
				this.resize(t, r);
				this.shapes = new sn({
					dom: Array,
					components: Array,
					type: Int8Array,
					semanticLayer: Array,
					depth: Float32Array,
					symbolicSize: Float32Array,
					threshold: Float32Array,
					info: Array,
					prevInfo: Array,
					animationDuration: Float32Array,
					creationDate: Int32Array,
					visibilityCondition1: Array,
					visibilityCondition2: Array
				});
				this._refresh = function() {
					return o.refresh()
				}
			}
			if (e) t.__proto__ = e;
			t.prototype = Object.create(e && e.prototype);
			t.prototype.constructor = t;
			t.prototype.clear = function e() {
				var t = this;
				this.shapes.clear();
				this.shapes.attributes.type.fill(Ki.DELETED);
				while (this.svg.firstChild) {
					t.svg.removeChild(t.svg.firstChild)
				}
				while (this.defs.firstChild) {
					t.defs.removeChild(t.defs.firstChild)
				}
				this.svg.appendChild(this.defs)
			};
			t.prototype.domElement = function e() {
				return this.svg
			};
			t.prototype.resize = function e(t, r) {
				this.width = t;
				this.height = r;
				bo(this.svg, 0, 0, t, r);
				this.svg.setAttribute("width", t);
				this.svg.setAttribute("height", r)
			};
			t.prototype.delete = function e(t, r) {
				var n = this;
				var i = this.shapes.attributes;
				if (!Ao(t) || i.type[t] === Ki.DELETED) {
					return -1
				}
				if (i.type[t] === Ki.COMPOSITE) {
					var o = i.components[t];
					for (var s = 0; s < o.length; ++s) {
						n.delete(o[s])
					}
				} else {
					Io(this, t)
				}
				if (!r) {
					this.shapes.remove(t);
					i.type[t] = Ki.DELETED
				}
				return -1
			};
			t.prototype.updateComposite = function e(t, r) {
				var n = this;
				var i = this.shapes.attributes,
					o = i.type[t];
				if (!Ao(t)) {
					return []
				}
				var s = i.components[t];
				if (o !== Ki.COMPOSITE) {
					Io(this, i.dom[t]);
					i.type[t] = Ki.COMPOSITE;
					return []
				} else if (s.length !== r) {
					for (var a = 0; a < s.length; ++a) {
						n.delete(s[a])
					}
					return []
				}
				return s
			};
			t.prototype.composite = function e(t, r) {
				var n = this.shapes.attributes;
				if (Ao(t) && n.type[t] === Ki.COMPOSITE) {
					var i = n.components[t];
					if (i !== r) {
						n.components[t] = r
					}
					return t
				} else {
					var o = this.shapes.add();
					n.type[o] = Ki.COMPOSITE;
					n.components[o] = r;
					return o
				}
			};
			t.prototype.setDepth = function e(t, r) {
				Co(this, t, "depth", r, So)
			};
			t.prototype.setColor = function e(t, r) {
				Co(this, t, "color", r)
			};
			t.prototype.setVisibilityCondition1 = function e(t, r, n, i, o) {
				Co(this, t, "visibilityCondition1", r ? [n, i, o] : null)
			};
			t.prototype.setVisibilityCondition2 = function e(t, r, n, i, o) {
				Co(this, t, "visibilityCondition2", r ? [n, i, o] : null)
			};
			t.prototype.triangle = function e(t, r, n, i, o, s, a, u, l) {
				return wo(this, t, Ki.POLYGON, [o, undefined, xo(this, r), xo(this, n), xo(this, i)], s, a, u, l)
			};
			t.prototype.circle = function e(t, r, n, i, o, s, a, u, l) {
				return wo(this, t, Ki.CIRCLE, [o, xo(this, r), n, i], s, a, u, l)
			};
			t.prototype.rectangle = function e(t, r, n, i, o, s, a, u, l) {
				Br(r, n, eo, to, ro, no);
				return this.quadrilateral(t, eo, to, ro, no, i, o, s, a, u, l)
			};
			t.prototype.quadrilateral = function e(t, r, n, i, o, s, a, u, l, d, f) {
				return wo(this, t, Ki.POLYGON, [s, mo(f), xo(this, r), xo(this, n), xo(this, i), xo(this, o)], a, u, l, d)
			};
			t.prototype.polygon = function e(t, r, n, i, o, s, a) {
				var u = new Array(r.length + 2);
				u[0] = n;
				for (var l = 0; l < r.length; ++l) {
					u[l + 2] = r[l].clone()
				}
				return wo(this, t, Ki.POLYGON, u, i, o, s, a)
			};
			t.prototype.line = function e(t, r, n, i, o, s, a, u, l, d) {
				return wo(this, t, Ki.LINE, [s, i, o, xo(this, r), xo(this, n)], a, u, l, d)
			};
			t.prototype.quadraticCurve = function e(t, r, n, i, o, s, a, u, l, d, f) {
				return wo(this, t, Ki.QUADRATIC, [a, o, s, xo(this, r), xo(this, n), xo(this, i)], u, l, d, f)
			};
			t.prototype.cubicCurve = function e(t, r, n, i, o, s, a, u, l, d, f, h) {
				return wo(this, t, Ki.CUBIC, [u, s, a, xo(this, r), xo(this, n), xo(this, i), xo(this, o)], l, d, f, h)
			};
			t.prototype.image = function e(t, r, n, i, o, s, a, u, l, d) {
				this.imageManager.use(i, this._refresh, true);
				var f = !o && s ? Ki.DUPLICATE_IMG : Ki.IMAGE;
				return wo(this, t, f, [i, xo(this, r), xo(this, n), o, s], a, u, l, d)
			};
			t.prototype.text = function e(t, r, n, i, o, s, a, u, l, d, f, h, c, p, g) {
				return wo(this, t, Ki.TEXT, [a, n, xo(this, r), o, s, i, u, l, d, mo(g)], f, h, c, p)
			};
			t.prototype.textWidth = function e(t, r, n, i) {
				if (r !== so || n !== oo || i !== ao) {
					io.font = (i === "italic" || i === "bold" ? i + " " : "") + n + "px " + r;
					oo = n;
					so = r;
					ao = i
				}
				return io.measureText(t).width
			};
			t.prototype.stopAnimations = function e() {
				this.shapes.attributes.animationDuration.fill(0);
				this._refresh()
			};
			t.prototype.setBackgroundColor = function e(t) {
				this.options.backgroundColor = t
			};
			t.prototype.render = function e(t) {
				var r = this;
				var n = this.shapes.attributes,
					i = this.svg.childNodes,
					o = i.length,
					s = this.width,
					a = this.height,
					u = 0,
					l = 0,
					d = 0,
					f = "",
					h = -1,
					c = ho,
					p = 0,
					g = false,
					v = null,
					y = 0,
					_ = 0,
					m = "black",
					x = this._parseColor,
					b, A = -1,
					w = this.animationsEnabled,
					E = this.currentTime,
					I = this._visibilityConditionTolerance;
				this.svg.style.background = this.options.backgroundColor;

				function S(e, t, r) {
					var n = $[e],
						i = A !== -1 ? ee[e] : undefined,
						o, s, a = t !== undefined ? $[t] : undefined,
						d, f;
					if (!a) {
						o = (n.x - B) * j + n.ax;
						s = (n.y - U) * j + n.ay;
						u = W * o + G * s + n.zx * j + n.ox;
						l = -G * o + W * s + n.zy * j + n.oy;
						if (i) {
							o = (i.x - B) * j + i.ax;
							s = (i.y - U) * j + i.ay;
							d = W * o + G * s + i.zx * j + i.ox;
							f = -G * o + W * s + i.zy * j + i.oy;
							u = d + (u - d) * A;
							l = f + (l - f) * A
						}
					} else {
						_ = 0;
						var h, c, p = Math.abs(a.size) * j;
						if (a.ratio === -1) {
							h = a.textWidth;
							c = a.textHeight
						} else {
							h = a.textWidth * j;
							c = a.textHeight * j
						}
						if (a.length > -99999 && a.length * j < h) {
							y = 0
						} else {
							y = X - a.angle;
							var g = a.size >= 0 ? -1 : 1;
							if (a.length >= -99999) {
								if (y < -uo) {
									y += lo;
									if (y < -uo) {
										y += lo
									}
								} else if (y > uo) {
									y -= lo;
									if (y > uo) {
										y -= lo
									}
								}
							}
							_ = g * ((c + p) / 2 + a.strokeSize)
						}
						o = (n.x - B) * j;
						s = (n.y - U) * j;
						var v = W * o + G * s,
							m = -G * o + W * s;
						if (r) {
							_ += n.oy;
							if (i) {
								o = (i.x - B) * j;
								s = (i.y - U) * j;
								var x = W * o + G * s,
									b = -G * o + W * s;
								u = x + (v - x) * A;
								l = b + (m - b) * A
							} else {
								u = v;
								l = m
							}
						} else {
							var w = Math.cos(y),
								E = Math.sin(y),
								I = n.ox + n.zx * j,
								S = n.oy + n.zy * j + _;
							u = w * I + E * S + v;
							l = -E * I + w * S + m;
							if (i) {
								o = (i.x - B) * j;
								s = (i.y - U) * j;
								x = W * o + G * s;
								b = -G * o + W * s;
								d = w * I + E * S + x;
								f = -E * I + w * S + b;
								u = d + (u - d) * A;
								l = f + (l - f) * A
							}
						}
					}
					u = u | 0;
					l = l | 0
				}
				function C() {
					if (ee && A !== -1) {
						d = (ee[2] + ($[2] - ee[2]) * A) * j + (ee[3] + ($[3] - ee[3]) * A)
					} else {
						d = $[2] * j + $[3]
					}
					d = d | 0
				}
				function T() {
					if (ee && A !== -1) {
						d = (ee[1] + ($[1] - ee[1]) * A) * j + (ee[2] + ($[2] - ee[2]) * A)
					} else {
						d = $[1] * j + $[2]
					}
					d = d | 0
				}
				function L() {
					if (!ee || A === -1) {
						m = $[0]
					} else {
						var e = x(ee[0]),
							t = x($[0]);
						if (e === t) {
							m = $[0]
						} else {
							var r = e[0] + (t[0] - e[0]) * A,
								n = e[1] + (t[1] - e[1]) * A,
								i = e[2] + (t[2] - e[2]) * A,
								o = e[3] + (t[3] - e[3]) * A;
							m = "rgba(" + (r * 255 | 0) + ", " + (n * 255 | 0) + ", " + (i * 255 | 0) + ", " + o + ")"
						}
					}
				}
				function N() {
					var e = E - n.creationDate[R];
					A = ee && w && e < n.animationDuration[R] ? e / n.animationDuration[R] : -1
				}
				function z(e) {
					if (!e) {
						return true
					}
					var t = (e[0] - B) * j;
					var r = (e[1] - U) * j;
					u = W * t + G * r;
					l = -G * t + W * r;
					d = e[2] * j;
					return u + d > -I && l + d > -I && u - d < s + I && l - d < a + I
				}
				while (this.defs.firstChild) {
					r.defs.removeChild(r.defs.firstChild)
				}
				for (var M = 1; M < o; ++M) {
					var k = i[M],
						R = k.__index__,
						F = n.semanticLayer[R],
						P = n.symbolicSize[R],
						D = n.threshold[R],
						O = F.camera,
						B = O.x,
						U = O.y,
						X = O.angle,
						j = O.zoom,
						W = Math.cos(X),
						G = Math.sin(X);
					if (F.disabled || P !== -1 && P * F.camera.zoom < D) {
						k.setAttribute("visibility", "hidden");
						continue
					} else {
						k.setAttribute("visibility", "visible")
					}
					var H = n.visibilityCondition1[R],
						Y = n.visibilityCondition2[R];
					if (!z(H) && !z(Y)) {
						k.setAttribute("visibility", "hidden");
						continue
					} else {
						k.setAttribute("visibility", "visible")
					}
					if (F.defineClipSpace) {
						f = n.depth[R];
						if (h !== f || v !== F) {
							h = f;
							p = 1;
							v = F;
							c[0] = R
						} else {
							c[p] = R;
							p += 1
						}
					} else if (F.useClipSpace && n.depth[R] === h) {
						j = n.semanticLayer[R].camera.zoom;
						g = true;
						b = Qt("clipPath");
						b.setAttribute("id", R);
						r.defs.appendChild(b);
						for (re = 0; re < p; ++re) {
							var V = c[re];
							K = n.type[V];
							$ = n.info[V];
							ee = n.prevInfo[V];
							N();
							if (K === Ki.POLYGON) {
								var q = Qt("polygon"),
									Z = "";
								for (var Q = 2; Q < $.length; ++Q) {
									S(Q, 1);
									Z += u + "," + l + " "
								}
								q.setAttribute("points", Z);
								b.appendChild(q)
							} else if (K === Ki.CIRCLE) {
								var J = Qt("circle");
								S(1);
								C();
								J.setAttribute("cx", u);
								J.setAttribute("cy", l);
								J.setAttribute("r", d);
								b.appendChild(J)
							}
						}
					}
					var K = n.type[R],
						$ = n.info[R],
						ee = n.prevInfo[R];
					N();
					if (K !== Ki.IMAGE) {
						L()
					}
					if (K === Ki.POLYGON) {
						var te = "";
						for (var re = 2; re < $.length; ++re) {
							S(re, 1);
							te += u + "," + l + " "
						}
						k.setAttribute("points", te);
						k.setAttribute("fill", m)
					} else if (K === Ki.CIRCLE) {
						S(1);
						C();
						k.setAttribute("cx", u);
						k.setAttribute("cy", l);
						k.setAttribute("r", d);
						k.setAttribute("fill", m)
					} else if (K === Ki.LINE) {
						T();
						S(3);
						k.setAttribute("x1", u);
						k.setAttribute("y1", l);
						S(4);
						k.setAttribute("x2", u);
						k.setAttribute("y2", l);
						k.setAttribute("stroke", m);
						k.setAttribute("stroke-width", d)
					} else if (K === Ki.QUADRATIC) {
						T();
						f = "";
						S(3);
						f += "M " + u + " " + l;
						S(4);
						f += " Q " + u + " " + l;
						S(5);
						f += " " + u + " " + l;
						k.setAttribute("d", f);
						k.setAttribute("stroke", m);
						k.setAttribute("stroke-width", d);
						k.setAttribute("fill", "none")
					} else if (K === Ki.CUBIC) {
						T();
						f = "";
						S(3);
						f += "M " + u + " " + l;
						S(4);
						f += " C " + u + " " + l;
						S(5);
						f += " " + u + " " + l;
						S(6);
						f += " " + u + " " + l;
						k.setAttribute("d", f);
						k.setAttribute("stroke", m);
						k.setAttribute("stroke-width", d);
						k.setAttribute("fill", "none")
					} else if (K === Ki.TEXT) {
						var ne = $[3],
							ie = $[4],
							oe = $[5],
							se = $[6],
							ae = $[7],
							ue = $[8],
							le = ne * j + ie,
							de = $[1];
						if (oe === "FontAwesome" && yo(de)) {
							oe = r.defaultFont
						}
						S(2, 9, true);
						k.setAttribute("x", u);
						k.setAttribute("y", l);
						k.setAttribute("text-anchor", co[ae]);
						k.setAttribute("fill", m);
						k.setAttribute("font-size", le);
						k.setAttribute("font-family", oe);
						k.setAttribute("alignment-baseline", po[ue]);
						k.setAttribute("font-weight", se === "bold" ? "bold" : "normal");
						k.setAttribute("font-style", se === "italic" ? "italic" : "normal");
						if (k.firstChild) {
							k.firstChild.nodeValue = de
						} else {
							k.appendChild(document.createTextNode(de))
						}
						if ($[9]) {
							k.setAttribute("transform", "rotate(" + (-fo * y | 0) + " " + u + " " + l + ") translate(0 " + _ + ")")
						}
					} else if (K === Ki.IMAGE) {
						var fe = r.imageManager.getImage($[0]),
							he = $[3],
							ce = $[2],
							pe = (ce.zx + ce.x) * j + ce.ox,
							ge = (ce.zy + ce.y) * j + ce.oy;
						if (!fe) {
							continue
						}
						S(1);
						if (he) {
							k.setAttribute("x", u - pe);
							k.setAttribute("y", l - ge);
							k.setAttribute("width", pe * 2);
							k.setAttribute("height", ge * 2);
							k.setAttribute("preserveAspectRatio", "none");
							k.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", $[0])
						} else {
							k.setAttribute("x", u - fe.width / 2);
							k.setAttribute("y", l - fe.height / 2);
							k.setAttribute("width", fe.width);
							k.setAttribute("height", fe.height);
							k.setAttribute("preserveAspectRatio", "none");
							k.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", $[0])
						}
					} else if (K === Ki.DUPLICATE_IMG) {
						fe = r.imageManager.getImage($[0]);
						ce = $[2];
						pe = ce.zx * j + ce.ox;
						ge = ce.zy * j + ce.oy;
						if (!fe) {
							continue
						}
						S(1);
						var ve = Qt("pattern"),
							ye = Qt("image"),
							_e = "img_" + R;
						ve.setAttribute("id", _e);
						ve.setAttribute("patternUnits", "userSpaceOnUse");
						ve.setAttribute("x", u - pe);
						ve.setAttribute("y", l - ge);
						ve.setAttribute("width", fe.width);
						ve.setAttribute("height", fe.height);
						ye.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", $[0]);
						ye.setAttribute("x", 0);
						ye.setAttribute("y", 0);
						ye.setAttribute("width", fe.width);
						ye.setAttribute("height", fe.height);
						ve.appendChild(ye);
						r.defs.appendChild(ve);
						k.setAttribute("x", u - pe);
						k.setAttribute("y", l - ge);
						k.setAttribute("width", pe * 2);
						k.setAttribute("height", ge * 2);
						k.setAttribute("fill", "url(#" + _e + ")")
					}
					if (g) {
						k.setAttribute("clip-path", "url(#" + R + ")");
						g = false
					} else {
						k.removeAttribute("clip-path")
					}
				}
			};
			return t
		}(_i);
	go.available = true;
	var vo = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

	function yo(e) {
		for (var t = 0; t < e.length; ++t) {
			if (vo.indexOf(e.charAt(t)) === -1) {
				return false
			}
		}
		return true
	}
	var _o = ["textWidth", "textHeight", "angle", "length", "size", "strokeSize", "ratio"];

	function mo(e) {
		if (!e) {
			return undefined
		}
		var t = {};
		for (var r = 0; r < _o.length; ++r) {
			var n = _o[r];
			t[n] = e[n]
		}
		return t
	}
	function xo(e, t) {
		var r = e._offset,
			n = {
				x: t.x,
				y: t.y,
				zx: t.zx,
				zy: t.zy,
				ax: t.ax,
				ay: t.ay,
				ox: t.ox,
				oy: t.oy
			};
		if (r) {
			n.x += r.x;
			n.y += r.y;
			n.zx += r.zx;
			n.zy += r.zy;
			n.ax += r.ax;
			n.ay += r.ay;
			n.ox += r.ox;
			n.oy += r.oy
		}
		return n
	}
	function bo(e, t, r, n, i) {
		e.setAttribute("viewBox", t + " " + r + " " + n + " " + i)
	}
	function Ao(e) {
		return typeof e === "number" && e % 1 === 0 && e >= 0 && e !== 4294967295
	}
	function wo(e, t, r, n, i, o, s, a) {
		if (s === undefined) {
			s = -1
		}
		if (a === undefined) {
			a = 0
		}
		if (o === undefined) {
			o = 1
		}
		var u = e.getSemanticLayer(i),
			l = e.shapes.attributes,
			d = true,
			f;
		if (!Ao(t)) {
			t = e.shapes.add()
		} else if (l.type[t] !== r) {
			e.delete(t, true)
		} else {
			d = false
		}
		if (u.transparency) {
			o -= xi
		}
		if (e.animationMode) {
			if (!l.prevInfo[t] || l.creationDate[t] + l.animationDuration[t] < e.currentTime) {
				l.prevInfo[t] = d ? undefined : l.info[t];
				l.creationDate[t] = e.currentTime;
				l.animationDuration[t] = e.animationDuration
			}
		} else {
			l.prevInfo[t] = undefined;
			l.creationDate[t] = e.currentTime;
			l.animationDuration[t] = 0
		}
		l.info[t] = n;
		l.type[t] = r;
		l.semanticLayer[t] = u;
		l.depth[t] = o;
		l.symbolicSize[t] = s;
		l.threshold[t] = a;
		l.visibilityCondition1[t] = null;
		l.visibilityCondition2[t] = null;
		if (d) {
			f = Qt($i[r]);
			f.__index__ = t;
			l.dom[t] = f;
			Eo(e, t)
		} else {
			So(e, t)
		}
		return t
	}
	function Eo(e, t) {
		var r = e.shapes.attributes,
			n = e.svg.childNodes,
			i = r.dom[t],
			o = r.depth[t],
			s = r.semanticLayer[t].level;
		if (o === 0) {
			return
		}
		for (var a = 1; a < n.length; ++a) {
			var u = n[a],
				l = u.__index__,
				d = r.depth[l],
				f = r.semanticLayer[l].level;
			if (o < d || o === d && s < f) {
				break
			}
		}
		if (a === n.length) {
			e.svg.appendChild(i)
		} else {
			e.svg.insertBefore(i, n[a])
		}
		e.refresh()
	}
	function Io(e, t) {
		var r = e.shapes.attributes.dom[t];
		if (r.parentNode === e.svg) {
			e.svg.removeChild(r)
		}
	}
	function So(e, t) {
		Io(e, t);
		Eo(e, t)
	}
	function Co(e, t, r, value, n) {
		var i = e.shapes.attributes;
		if (Ao(t)) {
			if (i.type[t] === Ki.COMPOSITE) {
				var o = i.components[t];
				for (var s = 0; s < o.length; ++s) {
					Co(e, o[s], r, value, n)
				}
			} else {
				if (i.semanticLayer[t].transparency) {
					value -= xi
				}
				i[r][t] = value;
				if (n) {
					n(e, t)
				}
				e.refresh()
			}
		}
	}
	var To = {};
	var Lo = {
		depth: "float",
		symbolicSize: "vec2",
		animation: "vec3",
		absolutePosition: "vec4",
		angleOffset: "vec4",
		zoomOffset: "vec4",
		offset: "vec4",
		visibilityCondition1: "vec4",
		visibilityCondition2: "vec4"
	};
	var No = {
		depth: "float",
		symbolicSize: "vec2",
		animation: "vec3",
		absolutePosition: "vec4",
		zoomOffset: "vec4",
		offset: "vec4",
		textDimensions: "vec3",
		lineInfo: "vec4",
		visibilityCondition1: "vec4",
		visibilityCondition2: "vec4"
	};
	var zo = {
		screenSize: "vec2",
		camPosition: "vec2",
		cosCamAngle: "float",
		sinCamAngle: "float",
		camAngle: "float",
		animationMode: "int",
		camZoom: "float",
		currentTime: "float",
		textureMultiplier: "float",
		vcMargin: "float",
		pixelRatio: "float"
	};
	var Mo = {
		texture: "sampler2D"
	};
	var ko = {
		textureCoords: "vec2"
	};
	var Ro = {
		vTextureCoords: "vec2"
	};
	var Fo = {
		bigTexture: "sampler2D",
		smallTexture: "sampler2D"
	};
	var Po = {
		textureCoords: "vec2"
	};
	var Do = {
		vTextureCoords: "vec2"
	};
	var Oo = {
		color: "vec4",
		prevColor: "vec4"
	};
	var Bo = {
		vColor: "vec4"
	};
	var Uo = ["float interpolate(in float start, in float end, in float ratio) {", "  return start + (end - start) * ratio;", "}", "vec2 interpolate(in vec2 start, in vec2 end, in float ratio) {", "  return start + (end - start) * ratio;", "}", "vec3 interpolate(in vec3 start, in vec3 end, in float ratio) {", "  return start + (end - start) * ratio;", "}", "vec4 interpolate(in vec4 start, in vec4 end, in float ratio) {", "  return start + (end - start) * ratio;", "}"];
	var Xo = ["vec2 rotate(in vec2 v, in float cosAngle, in float sinAngle) {", "  return vec2(cosAngle * v.x + sinAngle * v.y, -sinAngle * v.x + cosAngle * v.y);", "}"];
	var jo = ["bool isSelfLoop(in vec4 lineInfo) {", "  return lineInfo.y < -99999.0;", "}"];
	var Wo = ["vec2 computePositionOnScreen(in vec2 absoluteCoords, in vec2 camPos, in float zoom, in float cosAngle, in float sinAngle) {", "  vec2 tmp = (absoluteCoords - camPos) * zoom;", "  return vec2(", "    cosAngle * tmp.x + sinAngle * tmp.y,", "    -sinAngle * tmp.x + cosAngle * tmp.y", "  );", "}"];
	var Go = ["bool checkVisibilityCondition(in vec4 condition, in vec2 screenDimensions, in vec2 camPos, in float zoom, in float cosAngle, in float sinAngle) {", "  if (condition.w == 0.0) return true;", "  vec2 posOnScreen = computePositionOnScreen(condition.xy, camPos, zoom, cosAngle, sinAngle);", "  float radiusOnScreen = zoom * condition.z;", "  return posOnScreen.x - radiusOnScreen - vcMargin < screenDimensions.x && posOnScreen.x + radiusOnScreen + vcMargin > 0.0 && posOnScreen.y - radiusOnScreen - vcMargin < screenDimensions.y && posOnScreen.y + radiusOnScreen + vcMargin > 0.0;", "}"];
	var Ho = [Uo, Xo, Wo, Go];

	function Yo() {
		return ["vec2 positionOnCamera, _position, _angleOffset, _zoomOffset, _offset;", "float symSize = symbolicSize.x, symSizeThreshold = symbolicSize.y;", "bool thresholdPassed = symSize < 0.0 || (symSize * camZoom) > symSizeThreshold;", "if (!thresholdPassed || depth < 0.0) {", "  gl_Position = vec4(-1.0, -1.0, 1.0, 1.0);", "  return;", "}", "vec2 vcScreenSize = screenSize / textureMultiplier / pixelRatio;", "if (!checkVisibilityCondition(visibilityCondition1, vcScreenSize, camPosition, camZoom, cosCamAngle, sinCamAngle) && !checkVisibilityCondition(visibilityCondition2, vcScreenSize, camPosition, camZoom, cosCamAngle, sinCamAngle)) {;", "  gl_Position = vec4(-1.0, -1.0, 1.0, 1.0);", "  return;", "}", "float animationRatio = 2.0;", "if (animationMode == 1 && animation.x > 0.5) animationRatio = (currentTime - animation.y) / animation.z;", "if (animationRatio >= 1.0) {", "  _position = absolutePosition.xy;", "  _angleOffset = angleOffset.xy;", "  _zoomOffset = zoomOffset.xy;", "  _offset = offset.xy;", "} else {", "  _position = interpolate(absolutePosition.zw, absolutePosition.xy, animationRatio);", "  _angleOffset = interpolate(angleOffset.zw, angleOffset.xy, animationRatio);", "  _zoomOffset = interpolate(zoomOffset.zw, zoomOffset.xy, animationRatio);", "  _offset = interpolate(offset.zw, offset.xy, animationRatio);", "}", "vec2 tmp = ((_position - camPosition) * camZoom + _angleOffset);", "vec2 refPoint = vec2(", "  cosCamAngle * tmp.x + sinCamAngle * tmp.y,", "  -sinCamAngle * tmp.x + cosCamAngle * tmp.y", ");", "positionOnCamera = (refPoint + _zoomOffset * camZoom + _offset) * pixelRatio;", Vo()]
	}
	function Vo() {
		return ["vec2 clipSpace = (positionOnCamera * textureMultiplier / screenSize) * 2.0 - 1.0;", "gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 1.0 - depth, 1.0);"]
	}
	function qo() {
		return ["  const float PI = 3.1415926535897932384626433832795;", "  const float PI_2 = PI / 2.0;", "  float symSize = symbolicSize.x, symSizeThreshold = symbolicSize.y;", "  bool thresholdPassed = symSize < 0.0 || (symSize * camZoom) > symSizeThreshold;", "  if (!thresholdPassed || depth < 0.0) {", "    gl_Position = vec4(-1.0, -1.0, 1.0, 1.0);", "    return;", "  }", "  vec2 vcScreenSize = screenSize / textureMultiplier / pixelRatio;", "  if (!checkVisibilityCondition(visibilityCondition1, vcScreenSize, camPosition, camZoom, cosCamAngle, sinCamAngle) && !checkVisibilityCondition(visibilityCondition2, vcScreenSize, camPosition, camZoom, cosCamAngle, sinCamAngle)) {", "    gl_Position = vec4(-1.0, -1.0, 1.0, 1.0);", "    return;", "  }", "  float absoluteEdgeLength = lineInfo.y * camZoom;", "  float absoluteEdgeSize = abs(lineInfo.z) * camZoom;", "  float textWidth, textHeight;", "  if (textDimensions.z < 0.0) {", "    textWidth = textDimensions.x;", "    textHeight = textDimensions.y;", "  } else {", "    textWidth = camZoom * textDimensions.x;", "    textHeight = camZoom * textDimensions.y;", "  }", "  float cosToUse, sinToUse, s = 1.0;", "  vec2 additionalOffset, _position, _zoomOffset, _offset;", "  if (!isSelfLoop(lineInfo) && absoluteEdgeLength < textWidth) {", "    cosToUse = 1.0;", "    sinToUse = 0.0;", "    additionalOffset = vec2(0.0, 0.0);", "  } else {", "    float v = (textHeight + absoluteEdgeSize + lineInfo.w) / -2.0;", "    float angleToUse = camAngle - lineInfo.x;", "    if (!isSelfLoop(lineInfo)) {", "      if (angleToUse < -PI_2) { angleToUse += PI; if (angleToUse < -PI_2) { angleToUse += PI; } }", "      else if (angleToUse > PI_2) { angleToUse -= PI; if (angleToUse > PI_2) { angleToUse -= PI; } }", "    } else if (angleToUse > -PI_2 && angleToUse < PI_2) {", "      v = - v + absoluteEdgeSize * 2.0;", "    } else {", "      if (angleToUse < -PI_2) { angleToUse += PI; if (angleToUse < -PI_2) { angleToUse += PI; } }", "      else if (angleToUse > PI_2) { angleToUse -= PI; if (angleToUse > PI_2) { angleToUse -= PI; } }", "    }", "    additionalOffset = vec2(0.0, v * (lineInfo.z >= 0.0 ? 1.0 : -1.0));", "    cosToUse = cos(angleToUse);", "    sinToUse = sin(angleToUse);", "  }", "  float animationRatio = 2.0;", "  if (animationMode == 1 && animation.x > 0.5) animationRatio = (currentTime - animation.y) / animation.z;", "  if (animationRatio > 1.0) {", "    _position = absolutePosition.xy;", "    _zoomOffset = zoomOffset.xy * camZoom;", "    _offset = offset.xy + additionalOffset;", "  } else {", "    _position = interpolate(absolutePosition.zw, absolutePosition.xy, animationRatio);", "    _zoomOffset = interpolate(zoomOffset.zw, zoomOffset.xy, animationRatio) * camZoom;", "    _offset = interpolate(offset.zw, offset.xy, animationRatio) + additionalOffset;", "  }", "  vec2 center, positionOnCamera;", "  center = rotate((_position - camPosition) * camZoom, cosCamAngle, sinCamAngle);", "  positionOnCamera = floor(center + rotate(_zoomOffset + _offset, cosToUse, sinToUse)) * pixelRatio;", "  positionOnCamera = floor(positionOnCamera);", "  vec2 clipSpace = (positionOnCamera * textureMultiplier / screenSize) * 2.0 - 1.0;", "  gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 1.0 - depth, 1.0);"]
	}
	function Zo() {
		return ["vTextureCoords = textureCoords;", $o()]
	}
	function Qo() {
		return ["vec4 textureColor = texture2D(bigTexture, vTextureCoords);", "float alpha = textureColor.a;", "vec3 rgb = vColor.rgb;", "gl_FragColor = vec4(rgb, alpha) + vColor;"]
	}
	var Jo = {
		circleMultiplier: "vec2"
	};
	var Ko = {
		vMultiplier: "vec2"
	};
	To.polygon = {
		uniforms: zo,
		attributes: [Lo, Oo],
		varyings: Bo,
		functions: Ho,
		vertex: [Yo(), $o()],
		fragment: ["gl_FragColor = vColor;"]
	};
	To.circle = {
		uniforms: zo,
		attributes: [Lo, Oo, Jo],
		varyings: [Bo, Ko],
		functions: Ho,
		vertex: [Yo(), $o(), "vMultiplier = circleMultiplier;"],
		fragment: ["const vec3 black = vec3(0.0, 0.0, 0.0);", "float d = length(vMultiplier);", "if (d <= 1.0) {", "  gl_FragColor = vColor;", "} else {", "  discard;", "}"]
	};
	To.image = {
		uniforms: [zo, Mo],
		attributes: [Lo, ko],
		varyings: [Ro],
		functions: Ho,
		vertex: [Yo(), "vTextureCoords = textureCoords;"],
		fragment: ["gl_FragColor = texture2D(texture, vTextureCoords);"]
	};
	To.nonScaledImage = {
		uniforms: [zo, Mo,
		{
			textureDimensions: "vec2"
		}],
		attributes: [Lo, ko,
		{
			textureBox: "vec2",
			duplicate: "float"
		}],
		varyings: [Ro,
		{
			vDuplicateTexture: "float"
		}],
		functions: Ho,
		vertex: [Yo(), "float offsetW = ((textureBox.x * camZoom) / (textureDimensions.x * 2.0)) + 0.5;", "float offsetH = ((textureBox.y * camZoom) / (textureDimensions.y * 2.0)) + 0.5;", "vTextureCoords = vec2(", "  textureCoords.x == 1.0 ? offsetW : 1.0 - offsetW,", "  textureCoords.y == 1.0 ? offsetH : 1.0 - offsetH", ");", "vDuplicateTexture = duplicate;"],
		fragment: ["if (vDuplicateTexture == 0.0 && (vTextureCoords.x < 0.0 || vTextureCoords.x > 1.0 || vTextureCoords.y < 0.0 || vTextureCoords.y > 1.0)) {", "  discard;", "} else {", "  gl_FragColor = texture2D(texture, vTextureCoords);", "}"]
	};
	To.text = {
		uniforms: [zo, Fo],
		attributes: [Lo, Po, Oo],
		varyings: [Do, Bo],
		functions: Ho,
		vertex: [Yo(), Zo()],
		fragment: [Qo()]
	};
	To.lineText = {
		uniforms: [zo, Fo],
		attributes: [No, Po, Oo],
		varyings: [Do, Bo],
		functions: [Ho, jo],
		vertex: [qo(), Zo()],
		fragment: [Qo()]
	};
	To.linePolygon = {
		uniforms: [zo],
		attributes: [No, Oo],
		varyings: [Bo],
		functions: [Ho, jo],
		vertex: [qo(), $o()],
		fragment: ["gl_FragColor = vColor;"]
	};

	function $o() {
		return ["vec4 selectedColor = color;", "if (animationRatio < 1.0) {", "  selectedColor = interpolate(prevColor, color, animationRatio);", "}", "vColor = selectedColor;"]
	}
	var es = {
		texture: "sampler2D",
		screenTextureRatio: "vec2"
	};
	var ts = {
		positionOnScreen: "vec2"
	};
	var rs = {
		vTextureCoords: "vec2"
	};
	To.antialias = {
		uniforms: [es],
		attributes: [ts],
		varyings: [rs],
		functions: [],
		vertex: ["float coordX, coordY;", "float difRatioX = (1.0 - screenTextureRatio.x) / 2.0;", "float difRatioY = (1.0 - screenTextureRatio.y) / 2.0;", "if (positionOnScreen.x == -1.0) coordX = 0.0; else coordX = screenTextureRatio.x;", "if (positionOnScreen.y == -1.0) coordY = 0.0; else coordY = screenTextureRatio.y;", "vTextureCoords = vec2(coordX, coordY);", "gl_Position = vec4(positionOnScreen, 0.0, 1.0);"],
		fragment: ["gl_FragColor = texture2D(texture, vTextureCoords);"]
	};
	var ns = "□";
	var is = 32;
	var os = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 _";
	var ss = function e(t, r, n, i, o) {
			if (t === "FontAwesome") {
				o = 128
			}
			this.fontFamily = t;
			this.fontStyle = r;
			this.updateTexture = n;
			this.defaultFont = i;
			this.characterResolution = o;
			this.textureRatio = is;
			us(this, r, t);
			if (t === "FontAwesome") {
				this.charList = ""
			} else {
				this.charList = os
			}
			this.mustUpdate = false;
			this.reload();
			this.updateIfNecessary();
			this.missingCharacter = this.get(ns)
		};
	ss.prototype.get = function e(t) {
		var r = this.charMap[t];
		if (!r) {
			r = fs(this, t);
			if (!r) {
				this.charMap[t] = this.missingCharacter;
				console.warn('Cannot create texture for character "' + t + '": BitMap font (' + this.fontFamily + ") [" + this.fontStyle + "] full.");
				return this.missingCharacter
			}
			this.mustUpdate = true
		}
		return r
	};
	ss.prototype.updateIfNecessary = function e() {
		if (this.mustUpdate) {
			this.bigTexture = this.updateTexture(this.canvas, this.bigTexture);
			this.mustUpdate = false
		}
	};
	ss.prototype.reload = function e() {
		var t = this;
		this.nextX = 0;
		this.nextY = 0;
		this.charMap = {};
		this.full = false;
		as(this);
		var r = this.charList;
		this.charList = "";
		for (var n = 0; n < r.length; ++n) {
			fs(t, r[n])
		}
		this.mustUpdate = true
	};

	function as(e) {
		e.ctx.clearRect(0, 0, e.textureSize, e.textureSize)
	}
	function us(e, t, r) {
		e.textureSize = ge(e.characterResolution * e.textureRatio, 2);
		e.canvas = document.createElement("canvas");
		e.canvas.width = e.textureSize;
		e.canvas.height = e.textureSize;
		e.ctx = e.canvas.getContext("2d");
		e.ctx.textBaseline = "middle";
		e.ctx.textAlign = e.fontFamily === "FontAwesome" ? "center" : "left";
		ls(e.ctx, r, t, e.characterResolution);
		e.ctx.fillStyle = "black"
	}
	function ls(e, t, r, n) {
		e.font = (r === "italic" || r === "bold" ? r + " " : "") + n + "px " + t
	}
	function ds(e) {
		return os.indexOf(e) !== -1
	}
	function fs(e, t) {
		if (e.full) {
			return null
		}
		if (e.fontFamily === "FontAwesome") {
			if (ds(t)) {
				ls(e.ctx, e.defaultFont, e.fontStyle, e.characterResolution)
			} else {
				ls(e.ctx, e.fontFamily, e.fontStyle, e.characterResolution)
			}
		}
		var r = e.fontFamily === "FontAwesome" && !ds(t) ? e.characterResolution * 1.2 : e.ctx.measureText(t).width,
			n = e.characterResolution;
		if (e.nextX + r > e.textureSize) {
			e.nextX = 0;
			e.nextY += n + 5;
			if (e.nextY + 5 >= e.textureSize) {
				e.full = true;
				return null
			}
		}
		var i = e.fontFamily === "FontAwesome" ? r / 2 : 0;
		e.ctx.fillText(t, e.nextX + i, e.nextY + n / 2);
		var o = {
			x1: e.nextX / e.textureSize,
			y1: e.nextY / e.textureSize,
			x2: (e.nextX + r) / e.textureSize,
			y2: (e.nextY + n) / e.textureSize,
			ratio: r / n
		};
		e.nextX += r;
		e.charMap[t] = o;
		e.charList += t;
		return o
	}
	var hs = function e(t, r, n, i) {
			var o = this;
			var s = Object.keys(i);
			for (var a = 0; a < s.length; ++a) {
				var u = s[a],
					l = i[u],
					d = new cs(t, r, n, u, l);
				o[u] = d
			}
		};
	var cs = function e(t, r, n, i, o) {
			var s = t.getUniformLocation(n, i);
			if (s === -1) {
				throw new Error("program " + r + ": uniform location " + i + " should not be -1")
			}
			switch (o) {
			case "vec4":
				this.set = function(e, r, n, i) {
					t.uniform4f(s, e, r, n, i)
				};
				break;
			case "vec3":
				this.set = function(e, r, n) {
					t.uniform3f(s, e, r, n)
				};
				break;
			case "vec2":
				this.set = function(e, r) {
					t.uniform2f(s, e, r)
				};
				break;
			case "float":
				this.set = function(e) {
					t.uniform1f(s, e)
				};
				break;
			default:
				this.set = function(e) {
					t.uniform1i(s, e)
				};
				break
			}
		};
	var ps = 256;
	var gs = {
		float: 1,
		vec2: 2,
		vec3: 3,
		vec4: 4
	};
	var vs = function e(t, r, n, i) {
			var o = this;
			this._gl = t;
			this._glprogram = n;
			this.programName = r;
			this._capacity = ps;
			this._attributeList = Object.keys(i);
			this._pointSize = 0;
			for (var s = 0; s < this._attributeList.length; ++s) {
				var a = o._attributeList[s],
					u = gs[i[a]],
					l = t.getAttribLocation(n, a);
				if (!u) {
					throw new Error("attribute " + a + " has invalid type " + i[a])
				}
				if (l === -1) {
					throw new Error("program " + r + ": attribute location " + a + " should not be -1")
				}
				o[a] = new _s(t, a, u, l, ps, a);
				o._pointSize += u
			}
			this._availableOffsets = new nr;
			this._nbTriangles = 0
		};
	vs.prototype.draw = function e() {
		var t = this;
		if (this._nbTriangles === 0) {
			return
		}
		var r = this._gl;
		for (var n = 0; n < this._attributeList.length; ++n) {
			var i = t._attributeList[n];
			As(t[i])
		}
		r.drawArrays(r.TRIANGLES, 0, this._nbTriangles * 3)
	};
	vs.prototype.add = function e() {
		var t = this;
		var r;
		if (this._availableOffsets.size > 0) {
			r = this._availableOffsets.pop()
		} else {
			if (this._nbTriangles === this._capacity) {
				this._capacity = this._capacity * 1.5 | 0;
				for (var n = 0; n < this._attributeList.length; ++n) {
					var i = t._attributeList[n];
					bs(t[i], t._capacity)
				}
			}
			r = this._nbTriangles;
			this._nbTriangles += 1
		}
		return r
	};
	vs.prototype.remove = function e(t) {
		if (!this._availableOffsets.has(t)) {
			this._availableOffsets.add(t);
			this.depth.set1x1(t, -1);
			return true
		}
		return false
	};
	vs.prototype.clear = function e() {
		this._nbTriangles = 0;
		this._availableOffsets.clear()
	};
	var ys = 0;
	var _s = function e(t, r, n, i, o, s) {
			this._location = i;
			this._id = ys++;
			this._gl = t;
			this._size = n;
			this._glBuffer = t.createBuffer();
			this._eltBuffer = new Float32Array(n * 3);
			this._nbToUpdate = 0;
			this._name = s;
			this._bufferAll = true;
			this.programName = r;
			this._content = new Float32Array(0);
			this._toUpdate = new Int8Array(0);
			if (n === 1) {
				this.set = this.set1x1;
				this.set3 = this.set1x3
			} else if (n === 2) {
				this.set = this.set2x1;
				this.set3 = this.set2x3
			} else if (n === 3) {
				this.set = this.set3x1;
				this.set3 = this.set3x3
			} else if (n === 4) {
				this.set = this.set4x1;
				this.set3 = this.set4x3
			}
			bs(this, o)
		};
	_s.prototype.clear = function e() {
		this._bufferAll = true
	};
	_s.prototype.copy = function e(t, r) {
		ms(this, r);
		var n = this._content,
			i = t._content,
			o = r * 3 * this._size,
			s = o + 3 * this._size;
		if (n.length < i.length) {
			bs(this, i.length / (this._size * 3));
			n = this._content
		}
		for (var a = o; a < s; ++a) {
			n[a] = i[a]
		}
	};
	_s.prototype.fill = function e(value) {
		this._content.fill(value);
		this._bufferAll = true
	};
	_s.prototype.shift = function e(t, r, n, i, o, s, a) {
		ms(this, t);
		var u = this._content;
		t *= 12;
		u[t + 2] = u[t];
		u[t + 3] = u[t + 1];
		u[t + 6] = u[t + 4];
		u[t + 7] = u[t + 5];
		u[t + 10] = u[t + 8];
		u[t + 11] = u[t + 9];
		u[t] = r;
		u[t + 1] = n;
		u[t + 4] = i;
		u[t + 5] = o;
		u[t + 8] = s;
		u[t + 9] = a
	};
	_s.prototype.get = function e(t, r) {
		return this._content[t * this._size * 3 + r]
	};
	_s.prototype.set1x3 = function e(t, r, n, i) {
		ms(this, t);
		var o = this._content;
		t *= 3;
		o[t] = r;
		o[t + 1] = n;
		o[t + 2] = i
	};
	_s.prototype.set1x1 = function e(t, r) {
		ms(this, t);
		var n = this._content;
		t *= 3;
		n[t] = r;
		n[t + 1] = r;
		n[t + 2] = r
	};
	_s.prototype.set2x3 = function e(t, r, n, i, o, s, a) {
		ms(this, t);
		var u = this._content;
		t *= 6;
		u[t] = r;
		u[t + 1] = n;
		u[t + 2] = i;
		u[t + 3] = o;
		u[t + 4] = s;
		u[t + 5] = a
	};
	_s.prototype.set2x1 = function e(t, r, n) {
		ms(this, t);
		var i = this._content;
		t *= 6;
		i[t] = r;
		i[t + 1] = n;
		i[t + 2] = r;
		i[t + 3] = n;
		i[t + 4] = r;
		i[t + 5] = n
	};
	_s.prototype.set3x3 = function e(t, r, n, i, o, s, a, u, l, d) {
		ms(this, t);
		var f = this._content;
		t *= 9;
		f[t] = r;
		f[t + 1] = n;
		f[t + 2] = i;
		f[t + 3] = o;
		f[t + 4] = s;
		f[t + 5] = a;
		f[t + 6] = u;
		f[t + 7] = l;
		f[t + 8] = d
	};
	_s.prototype.set3x1 = function e(t, r, n, i) {
		ms(this, t);
		var o = this._content;
		t *= 9;
		o[t] = r;
		o[t + 1] = n;
		o[t + 2] = i;
		o[t + 3] = r;
		o[t + 4] = n;
		o[t + 5] = i;
		o[t + 6] = r;
		o[t + 7] = n;
		o[t + 8] = i
	};
	_s.prototype.set4x3 = function e(t, r, n, i, o, s, a, u, l, d, f, h, c) {
		ms(this, t);
		var p = this._content;
		t *= 12;
		p[t] = r;
		p[t + 1] = n;
		p[t + 2] = i;
		p[t + 3] = o;
		p[t + 4] = s;
		p[t + 5] = a;
		p[t + 6] = u;
		p[t + 7] = l;
		p[t + 8] = d;
		p[t + 9] = f;
		p[t + 10] = h;
		p[t + 11] = c
	};
	_s.prototype.set4x1 = function e(t, r, n, i, o) {
		ms(this, t);
		var s = this._content;
		t *= 12;
		s[t] = r;
		s[t + 1] = n;
		s[t + 2] = i;
		s[t + 3] = o;
		s[t + 4] = r;
		s[t + 5] = n;
		s[t + 6] = i;
		s[t + 7] = o;
		s[t + 8] = r;
		s[t + 9] = n;
		s[t + 10] = i;
		s[t + 11] = o
	};

	function ms(e, t) {
		if (!e._bufferAll) {
			if (!e._toUpdate[t]) {
				e._nbToUpdate += 1;
				if (e._nbToUpdate > 1e4) {
					e._bufferAll = true
				} else {
					e._toUpdate[t] = 1
				}
			}
		}
	}
	function xs(e) {
		var t = e._gl;
		if (e._bufferAll) {
			t.bufferSubData(t.ARRAY_BUFFER, 0, e._content);
			e._toUpdate.fill(0);
			e._bufferAll = false;
			e._nbToUpdate = 0
		} else if (e._nbToUpdate !== 0) {
			var r = e._toUpdate,
				n = r.length,
				i = e._size * 3,
				o = e._eltBuffer,
				s = e._content;
			for (var a = 0; a < n; ++a) {
				if (r[a]) {
					var u = a * i;
					for (var l = 0; l < i; ++l) {
						o[l] = s[u + l]
					}
					t.bufferSubData(t.ARRAY_BUFFER, u * 4, o);
					r[a] = 0
				}
			}
			e._nbToUpdate = 0
		}
	}
	function bs(e, t) {
		var r = e._gl;
		r.bindBuffer(r.ARRAY_BUFFER, e._glBuffer);
		r.bufferData(r.ARRAY_BUFFER, t * e._size * 3 * 4, r.DYNAMIC_DRAW);
		r.bufferSubData(r.ARRAY_BUFFER, 0, e._content);
		var n = new Float32Array(t * e._size * 3),
			i = new Int8Array(t);
		n.set(e._content);
		i.set(e._toUpdate);
		e._content = n;
		e._toUpdate = i
	}
	function As(e) {
		var t = e._gl;
		t.bindBuffer(t.ARRAY_BUFFER, e._glBuffer);
		xs(e);
		t.vertexAttribPointer(e._location, e._size, t.FLOAT, false, 0, 0)
	}
	var ws = ["precision mediump float;", "precision mediump int;"];

	function Es(e, t, r, n, i, o, s, a) {
		var u = Is(r),
			l = Is(n),
			d = Is(i),
			f = zs(e, t, Ls(u, l, d, o, s), true),
			h = zs(e, t, Ns(u, d, o, a), false),
			c = e.createProgram();
		e.attachShader(c, f);
		e.attachShader(c, h);
		e.linkProgram(c);
		if (!e.getProgramParameter(c, e.LINK_STATUS)) {
			throw new Error("unable to initialize WebGL program " + t + ": \n" + e.getProgramInfoLog(c))
		}
		this._gl = e;
		this.programName = t;
		this._glProgram = c;
		this._attributeDef = l;
		this._attributeList = Object.keys(l);
		this.uniforms = new hs(e, t, c, u)
	}
	Es.prototype.prepare = function(e) {
		var t = this;
		this._gl.useProgram(this._glProgram);
		for (var r = e; r < this._attributeList.length; ++r) {
			t._gl.enableVertexAttribArray(r)
		}
		for (r = this._attributeList.length; r < e; ++r) {
			t._gl.disableVertexAttribArray(r)
		}
		return this._attributeList.length
	};
	Es.prototype.createBuffer = function() {
		return new vs(this._gl, this.programName, this._glProgram, this._attributeDef)
	};

	function Is(e) {
		if (!(e instanceof Array)) {
			e = [e]
		}
		var t = {};
		for (var r = 0; r < e.length; ++r) {
			Ss(t, e[r])
		}
		return t
	}
	function Ss(e, t) {
		var r = Object.keys(t);
		for (var n = 0; n < r.length; ++n) {
			var i = r[n];
			e[i] = t[i]
		}
	}
	function Cs(e) {
		if (typeof e === "string") {
			return e + "\n"
		} else {
			var t = "";
			for (var r = 0; r < e.length; ++r) {
				t += Cs(e[r])
			}
			return t
		}
	}
	function Ts(e, t) {
		t = t || {};
		var r = Object.keys(t),
			n = [];
		for (var i = 0; i < r.length; ++i) {
			var o = r[i],
				s = t[o];
			n.push(e + " " + s + " " + o + ";")
		}
		return n
	}
	function Ls(e, t, r, n, i) {
		var o = [];
		i = ["void main() {", i, "}"];
		o.push(ws);
		o.push(Ts("uniform", e));
		o.push(Ts("attribute", t));
		o.push(Ts("varying", r));
		(n || []).forEach(function(e) {
			o.push(e)
		});
		o.push(i);
		return o.map(function(e) {
			return Cs(e)
		}).join("\n")
	}
	function Ns(e, t, r, n) {
		var i = [];
		n = ["void main() {", n, "}"];
		i.push(ws);
		i.push(Ts("uniform", e));
		i.push(Ts("varying", t));
		(r || []).forEach(function(e) {
			i.push(e)
		});
		i.push(n);
		return i.map(function(e) {
			return Cs(e)
		}).join("\n")
	}
	function zs(e, t, r, n) {
		var i = e.createShader(n ? e.VERTEX_SHADER : e.FRAGMENT_SHADER);
		e.shaderSource(i, r);
		e.compileShader(i);
		if (!e.getShaderParameter(i, e.COMPILE_STATUS)) {
			var o = 0;
			console.log(r.split("\n").map(function(e) {
				return ++o + "  " + e
			}).join("\n"));
			throw new Error("Error in program " + t + ":" + (n ? "vertex" : "fragment") + ":\n" + e.getShaderInfoLog(i))
		}
		return i
	}
	var Ms = function e(t, r, n) {
			if (n === void 0) n = {};
			this.renderer = t;
			this.gl = t.gl;
			this.renderFunction = r;
			this.ratio = Be(n.ratio, 1);
			this.wrap = Be(n.wrap, this.gl.CLAMP_TO_EDGE);
			this.minFilter = Be(n.minFilter, this.gl.NEAREST_MIPMAP_LINEAR);
			this.magFilter = Be(n.magFilter, this.gl.NEAREST);
			this.texture = null;
			this.framebuffer = null;
			this.depthStencilBuffer = null;
			this.screenWidth = null;
			this.screenHeight = null;
			this.renderWidth = null;
			this.renderHeight = null
		};
	Ms.prototype.resize = function e(t, r, n) {
		var i = Ut();
		t *= i;
		r *= i;
		this.screenWidth = t;
		this.screenHeight = r;
		this.renderWidth = t * this.ratio;
		this.renderHeight = r * this.ratio;
		if (!n) {
			return
		}
		var o = this.gl,
			s = ge(t, 2) * this.ratio,
			a = ge(r, 2) * this.ratio;
		if (s === this.textureWidth && a === this.textureHeight) {
			return
		}
		this.textureWidth = s;
		this.textureHeight = a;
		if (this.texture) {
			o.deleteTexture(this.texture)
		}
		if (this.framebuffer) {
			o.deleteFramebuffer(this.framebuffer)
		}
		if (this.depthStencilBuffer) {
			o.deleteRenderbuffer(this.depthStencilBuffer)
		}
		this.texture = o.createTexture();
		o.bindTexture(o.TEXTURE_2D, this.texture);
		o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_S, this.wrap);
		o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_T, this.wrap);
		o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MIN_FILTER, this.minFilter);
		o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MAG_FILTER, this.magFilter);
		o.texImage2D(o.TEXTURE_2D, 0, o.RGBA, this.textureWidth, this.textureHeight, 0, o.RGBA, o.UNSIGNED_BYTE, null);
		o.bindTexture(o.TEXTURE_2D, null);
		this.depthStencilBuffer = o.createRenderbuffer();
		o.bindRenderbuffer(o.RENDERBUFFER, this.depthStencilBuffer);
		o.renderbufferStorage(o.RENDERBUFFER, o.DEPTH_STENCIL, this.textureWidth, this.textureHeight);
		this.framebuffer = o.createFramebuffer();
		o.bindFramebuffer(o.FRAMEBUFFER, this.framebuffer);
		o.framebufferTexture2D(o.FRAMEBUFFER, o.COLOR_ATTACHMENT0, o.TEXTURE_2D, this.texture, 0);
		o.framebufferRenderbuffer(o.FRAMEBUFFER, o.DEPTH_STENCIL_ATTACHMENT, o.RENDERBUFFER, this.depthStencilBuffer)
	};
	Ms.prototype.render = function e(t) {
		var r = this.gl;
		r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer);
		r.viewport(0, 0, this.renderWidth, this.renderHeight);
		this.renderFunction(this.renderer, r, this, t)
	};
	var ks = 4096;
	var Rs = 4096;
	var Fs = false;
	var Ps = new Or;
	var Ds = new Or;
	var Os = new Or;
	var Bs = new Or;
	if (typeof document !== "undefined") {
		try {
			var Us = document.createElement("canvas").getContext("webgl") || document.createElement("canvas").getContext("experimental-webgl");
			Fs = !! Us
		} catch (e) {}
	}
	var Xs = Math.SQRT2 + 1;
	var js = function(e) {
			function t(t, r, n, i) {
				var o = this;
				if (i === void 0) i = {};
				e.call(this, t, r, n, i);
				this._parseColor = q;
				this.samplingLevel = i.antialias === "super-sampling" && Ut() < 2 ? 2 : 1;
				var s = Ut();
				while (this.samplingLevel > 1 && U() === "firefox" && (this.samplingLevel * window.innerWidth * s > ks || this.samplingLevel * window.innerHeight * s > Rs)) {
					o.samplingLevel /= 2
				}
				var a = i.antialias === "native" || i.antialias === "super-sampling" && Ut() !== 1;
				var u = {
					stencil: true,
					antialias: a,
					alpha: true,
					premultipliedAlpha: false
				};
				this.canvas = document.createElement("canvas");
				this.canvas.style.position = "absolute";
				this.canvas.style.top = "0px";
				this.canvas.style.left = "0px";
				this.gl = this.canvas.getContext("webgl", u);
				if (!this.gl) {
					Pe('Using "experimental-webgl"');
					this.canvas = document.createElement("canvas");
					this.gl = this.canvas.getContext("experimental-webgl", u)
				}
				this.canvas.className = "ogma";
				var l = this.gl;
				this.setBackgroundColor(i.backgroundColor);
				l.enable(l.BLEND);
				l.blendFuncSeparate(l.SRC_ALPHA, l.ONE_MINUS_SRC_ALPHA, l.SRC_ALPHA, l.ONE);
				l.enable(l.DEPTH_TEST);
				l.depthFunc(l.LEQUAL);
				this._nbAttributesEnabled = 0;
				var d = this;
				this._createTextTexture = function(e, t) {
					return ta(d, e, t, "text")
				};
				this.programs = {};
				var f = Object.keys(To);
				for (var h = 0; h < f.length; ++h) {
					var c = f[h],
						p = To[c];
					o.programs[c] = new Es(l, c, p.uniforms, p.attributes, p.varyings, p.functions, p.vertex, p.fragment)
				}
				this.shapeList = new sn({
					bufferOffset: Int32Array,
					bufferIndex: Int32Array,
					components: Array
				});
				this.texturesByUrl = {};
				this.textureCounter = 0;
				this.fontSamplingSize = i.fontSamplingSize;
				this.minSvgSize = i.minSvgSize;
				this.bitmapFontCounter = 0;
				this.bitmapFontsByIndex = {};
				this.bitmapFonts = {};
				this.buffersBySemanticLayer = {};
				this.bufferList = [];
				this._offset = null;
				this._renderSteps = [];
				this._renderSteps.push(new Ms(this, Ws, {
					ratio: this.samplingLevel
				}));
				if (this.samplingLevel !== 1) {
					this.antiAliasBuffer = this.programs.antialias.createBuffer();
					this.antiAliasBuffer.add();
					this.antiAliasBuffer.add();
					this.antiAliasBuffer.positionOnScreen.set3(0, -1, -1, 1, -1, 1, 1);
					this.antiAliasBuffer.positionOnScreen.set3(1, 1, 1, -1, 1, -1, -1);
					this._renderSteps.push(new Ms(this, Gs))
				}
				this._sortSemanticLayerFunction = function(e, t) {
					return Ia(d, e, t)
				};
				this.resize(48, 48)
			}
			if (e) t.__proto__ = e;
			t.prototype = Object.create(e && e.prototype);
			t.prototype.constructor = t;
			t.prototype.render = function e(t) {
				var r = this;
				var n = null;
				for (var i = 0; i < this._renderSteps.length; ++i) {
					var o = r._renderSteps[i];
					o.render(n);
					n = o
				}
				this.gl.flush()
			};
			t.prototype.resize = function e(t, r) {
				var n = this;
				Vt(this.canvas, t, r);
				this.width = t;
				this.height = r;
				for (var i = 0, o = this._renderSteps.length; i < o; ++i) {
					n._renderSteps[i].resize(t, r, i !== o - 1)
				}
				this.refresh()
			};
			t.prototype.usedMemory = function e() {
				var t = this.bufferList.map(function(e) {
					return e._attributeList.map(function(t) {
						return e[t]._content.length * 4
					}).reduce(function(e, t) {
						return e + t
					})
				}, 0).reduce(function(e, t) {
					return e + t
				}, 0);
				return (t / 1e3 | 0) + "K"
			};
			t.prototype.setDepth = function e(t, r) {
				Ys(this, "depth", t, r);
				this.refresh()
			};
			t.prototype.setVisibilityCondition1 = function e(t, r, n, i, o) {
				Vs(this, "visibilityCondition1", t, n, i, o, +r);
				this.refresh()
			};
			t.prototype.setVisibilityCondition2 = function e(t, r, n, i, o) {
				Vs(this, "visibilityCondition2", t, n, i, o, +r);
				this.refresh()
			};
			t.prototype.reloadFonts = function e() {
				rt(this.bitmapFonts, function(e) {
					rt(e, function(e) {
						e.reload()
					})
				})
			};
			t.prototype.updateComposite = function e(t, r) {
				var n = this;
				var i = this.shapeList.attributes;
				if (!Hs(t) || i.bufferIndex[t] === -2) {
					return []
				}
				var o = i.components[t];
				if (!o) {
					this.deleteTriangle(t);
					return []
				} else if (o.length !== r) {
					for (var s = 0; s < o.length; ++s) {
						n.delete(o[s])
					}
					return []
				}
				return o
			};
			t.prototype.composite = function e(t, r) {
				var n = this.shapeList.attributes,
					i;
				if (Hs(t) && n.bufferIndex[t] !== -2) {
					var o = n.components[t];
					if (o !== r) {
						n.components[t] = r
					}
					i = t
				} else {
					var s = this.shapeList.add();
					n.bufferIndex[s] = -1;
					n.bufferOffset[s] = -1;
					n.components[s] = r;
					i = s
				}
				return i
			};
			t.prototype.setColor = function e(t, r, n) {
				var i = this;
				if (!Hs(t)) {
					return
				}
				var o = this.shapeList.attributes,
					s = o.components[t];
				if (s) {
					for (var a = 0; a < s.length; ++a) {
						i.setColor(s[a], r, n)
					}
				} else {
					var u = o.bufferIndex[t],
						l = o.bufferOffset[t],
						d = this.bufferList[u],
						f = this._parseColor(r);
					if (d.programName === "shadowPolygon" || d.programName === "shadowCircle") {
						return
					}
					if (this.shadowsEnabled) {
						d.color.set(l, 0, 0, 0, .9)
					} else {
						d.prevColor.copy(d.color, l);
						d.color.set(l, f[0], f[1], f[2], n ? 0 : f[3])
					}
					this.refresh()
				}
			};
			t.prototype.stopAnimations = function e() {
				var t = this.bufferList,
					r = t.length;
				for (var n = 0; n < r; ++n) {
					t[n].animation.fill(0)
				}
				this.refresh()
			};
			t.prototype._nbTriangles = function e() {
				var t = this;
				var r = 0;
				for (var n = 0; n < this.bufferList.length; ++n) {
					r += t.bufferList[n]._nbTriangles
				}
				return r
			};
			t.prototype.delete = function e(t) {
				var r = this;
				if (!Hs(t)) {
					return -1
				}
				var n = this.shapeList.attributes,
					i = n.bufferIndex[t];
				if (i === -2) {
					return -1
				}
				var o = n.components[t];
				if (o) {
					for (var s = 0; s < o.length; ++s) {
						r.delete(o[s])
					}
				} else {
					this.deleteTriangle(t)
				}
				n.bufferIndex[t] = -2;
				n.components[t] = undefined;
				this.shapeList.remove(t);
				this.refresh();
				return -1
			};
			t.prototype.deleteTriangle = function e(t) {
				var r = this.shapeList.attributes,
					n = r.bufferIndex[t],
					i = r.bufferOffset[t],
					o = this.bufferList[n];
				o.remove(i)
			};
			t.prototype.domElement = function e() {
				return this.canvas
			};
			t.prototype.triangle = function e(t, r, n, i, o, s, a, u, l) {
				var e = Qs(this, t, Na(this, s), "polygon", r, n, i, a, u, l);
				this.setColor(e, o);
				return e
			};
			t.prototype.circle = function e(t, r, n, i, o, s, a, u, l) {
				Ps.set(r).addZXY(-n, n).addOXY(-i, i);
				Ds.set(r).addZXY(-n, -n * Xs).addOXY(-i, -i * Xs);
				Os.set(r).addZXY(n * Xs, n).addOXY(i * Xs, i);
				t = Qs(this, t, Na(this, s), "circle", Ps, Ds, Os, a, u, l);
				this.setColor(t, o);
				return t
			};
			t.prototype.rectangle = function e(t, r, n, i, o, s, a, u, l) {
				Br(r, n, Ps, Ds, Os, Bs);
				return this.quadrilateral(t, Ps, Ds, Os, Bs, i, o, s, a, u, l)
			};
			t.prototype.quadrilateral = function e(t, r, n, i, o, s, a, u, l, d, f) {
				var h = f ? "linePolygon" : "polygon";
				a = Na(this, a);
				var c = this.updateComposite(t, 2);
				c[0] = Qs(this, c[0], a, h, r, n, i, u, l, d);
				c[1] = Qs(this, c[1], a, h, i, o, r, u, l, d);
				if (f) {
					Ea(this, c[0], f.textWidth, f.textHeight, f.ratio, f.angle, f.length, f.size, f.strokeSize);
					Ea(this, c[1], f.textWidth, f.textHeight, f.ratio, f.angle, f.length, f.size, f.strokeSize)
				}
				t = this.composite(t, c);
				this.setColor(t, s);
				return t
			};
			t.prototype.polygon = function e(t, r, n, i, o, s, a) {
				var u = this;
				if (!(r instanceof jr)) {
					throw new Error('Argument "points" must be of type PositionList.')
				} else if (r.length < 3) {
					throw new Error("A polygon must have at least 3 points.")
				}
				i = Na(this, i);
				var l = Xn(r.getXYList()),
					d = this.updateComposite(t, l.length);
				for (var f = 0; f < l.length; ++f) {
					var h = l[f],
						c = r[h[0]],
						p = r[h[1]],
						g = r[h[2]];
					d[f] = Qs(u, d[f], i, "polygon", c, p, g, o, s, a);
					u.setColor(d[f], n)
				}
				return this.composite(t, d)
			};
			t.prototype.quadraticCurve = function e(t, r, n, i, o, s, a, u, l, d, f) {
				return ga(this, t, r, n, n, i, o, s, a, u, l, d, f, va)
			};
			t.prototype.cubicCurve = function e(t, r, n, i, o, s, a, u, l, d, f, h) {
				return ga(this, t, r, n, i, o, s, a, u, l, d, f, h, ya)
			};
			t.prototype.line = function e(t, r, n, i, o, s, a, u, l, d) {
				Xr(r, n, i, o, Ps, Ds, Os, Bs);
				return this.quadrilateral(t, Ps, Ds, Os, Bs, s, a, u, l, d)
			};
			t.prototype.image = function e(t, r, n, i, o, s, a, u, l, d) {
				Js(this, i);
				Br(r, n, Ps, Ds, Os, Bs);
				a = Na(this, a);
				var f = o ? "image" : "nonScaledImage",
					h = this.updateComposite(t, 2);
				h[0] = Qs(this, h[0], a, f, Ps, Ds, Os, u, l, d, i);
				h[1] = Qs(this, h[1], a, f, Os, Bs, Ps, u, l, d, i);
				_a(this, h[0], o, s, n.zx * 2, n.zy * 2, 0, 0, 1, 0, 1, 1);
				_a(this, h[1], o, s, n.zx * 2, n.zy * 2, 1, 1, 0, 1, 0, 0);
				return this.composite(t, h)
			};
			t.prototype.text = function e(t, r, n, i, o, s, a, u, l, d, f, h, c, p, g) {
				return Aa(this, t, r, n, i, o, s, a, u, l, d, f, h, c, p, g)
			};
			t.prototype.textWidth = function e(t, r, n, i) {
				var o = xa(this, r, i),
					s = 0;
				for (var a = 0; a < t.length; ++a) {
					var u = o.get(t[a]);
					s += u.ratio
				}
				return s * n
			};
			t.prototype.clear = function e() {
				var t = this;
				this.shapeList.clear();
				this.shapeList.attributes.bufferIndex.fill(-2);
				for (var r = 0; r < this.bufferList.length; ++r) {
					t.bufferList[r].clear()
				}
			};
			t.prototype.setBackgroundColor = function e(t) {
				if (!t) {
					this.gl.clearColor(0, 0, 0, 0)
				} else {
					var r = this._parseColor(t);
					this.gl.clearColor(r[0], r[1], r[2], r[3])
				}
			};
			return t
		}(_i);
	js.infoName = "WebGL";
	js.available = Fs;

	function Ws(e, t, r) {
		t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT | t.STENCIL_BUFFER_BIT);
		Ca(e);
		La(e, r.renderWidth, r.renderHeight)
	}
	function Gs(e, t, r, n) {
		t.disable(t.DEPTH_TEST);
		t.disable(t.STENCIL_TEST);
		e._nbAttributesEnabled = e.programs.antialias.prepare(e._nbAttributesEnabled);
		t.activeTexture(t.TEXTURE0);
		t.bindTexture(t.TEXTURE_2D, n.texture);
		t.generateMipmap(t.TEXTURE_2D);
		var i = e.programs.antialias.uniforms,
			o = r.renderWidth / (n.textureWidth / n.ratio),
			s = r.renderHeight / (n.textureHeight / n.ratio);
		i.texture.set(0);
		i.screenTextureRatio.set(o, s);
		e.antiAliasBuffer.draw()
	}
	function Hs(e) {
		return typeof e === "number" && e % 1 === 0 && e >= 0 && e !== 4294967295
	}
	function Ys(e, t, r, value) {
		if (!Hs(r)) {
			return
		}
		var n = e.shapeList.attributes,
			i = n.components[r];
		if (i) {
			for (var o = 0; o < i.length; ++o) {
				Ys(e, t, i[o], value)
			}
		} else {
			var s = n.bufferIndex[r],
				a = n.bufferOffset[r],
				u = e.bufferList[s];
			if (t === "depth" && u.transparency && value >= 0) {
				value -= xi
			}
			u[t].set(a, value);
			e.refresh()
		}
	}
	function Vs(e, t, r, n, i, o, s) {
		if (!Hs(r)) {
			return
		}
		var a = e.shapeList.attributes,
			u = a.components[r];
		if (u) {
			for (var l = 0; l < u.length; ++l) {
				Vs(e, t, u[l], n, i, o, s)
			}
		} else {
			var d = a.bufferIndex[r],
				f = a.bufferOffset[r],
				h = e.bufferList[d];
			h[t].set(f, n, i, o, s);
			e.refresh()
		}
	}
	var qs = new Or;

	function Zs(e, t, r, n, i, o, s, a, u, l, d, f) {
		var h = e.shapeList.attributes,
			c, p;
		if (!Hs(t) || h.bufferIndex[t] === -2) {
			t = e.shapeList.add();
			h.components[t] = undefined;
			var g = ma(e.buffersBySemanticLayer, r),
				v = ma(g, n);
			c = v[d];
			if (!c) {
				c = e.programs[n].createBuffer();
				c.index = e.bufferList.length;
				c.transparency = f;
				c.texture = d;
				v[d] = c;
				e.bufferList.push(c)
			}
			p = c.add();
			h.components[t] = undefined;
			h.bufferOffset[t] = p;
			h.bufferIndex[t] = c.index;
			c.animation.set(p, 0, 0, 0);
			c.depth.set(p, Be(a, 1))
		} else {
			c = e.bufferList[h.bufferIndex[t]];
			p = h.bufferOffset[t];
			if (h.components[t] || !c || c.programName !== n || c.texture !== d) {
				e.delete(t);
				return Zs(e, -1, r, n, i, o, s, a, u, l, d, f)
			}
			if (e.animationMode) {
				if (!c.animation.get(p, 0) || c.animation.get(p, 1) + c.animation.get(p, 2) < e.currentTime) {
					c.animation.set(p, 1, e.currentTime, e.animationDuration)
				}
			} else {
				c.animation.set(p, 0, e.currentTime, e.animationDuration)
			}
			if (a !== undefined) {
				c.depth.set(p, a)
			}
		}
		var y = e._offset || qs;
		c.absolutePosition.shift(p, i.x + y.x, i.y + y.y, o.x + y.x, o.y + y.y, s.x + y.x, s.y + y.y);
		c.zoomOffset.shift(p, i.zx + y.zx, i.zy + y.zy, o.zx + y.zx, o.zy + y.zy, s.zx + y.zx, s.zy + y.zy);
		c.offset.shift(p, i.ox + y.ox, i.oy + y.oy, o.ox + y.ox, o.oy + y.oy, s.ox + y.ox, s.oy + y.oy);
		c.visibilityCondition1.set(p, 0, 0, 0, 0);
		c.visibilityCondition2.set(p, 0, 0, 0, 0);
		if (n !== "lineText" && n !== "linePolygon") {
			c.angleOffset.shift(p, i.ax + y.ax, i.ay + y.ay, o.ax + y.ax, o.ay + y.ay, s.ax + y.ax, s.ay + y.ay)
		}
		if (n === "circle") {
			c.circleMultiplier.set2x3(p, -1, 1, -1, -Xs, Xs, 1)
		}
		c.symbolicSize.set(p, u, l);
		e.refresh();
		return t
	}
	function Qs(e, t, r, n, i, o, s, a, u, l, d) {
		if (u === undefined) {
			u = -1
		}
		if (l === undefined) {
			l = 0
		}
		if (d === undefined) {
			d = "default"
		}
		var f = e.getSemanticLayer(r);
		return Zs(e, t, r, n, i, o, s, a, u, l, d, f.transparency)
	}
	function Js(e, t) {
		if (!e.texturesByUrl[t]) {
			e.imageManager.use(t, function(r) {
				var n = t.endsWith(".svg");
				var i = ta(e, r, null, n ? "svg" : null);
				i.width = r.width;
				i.height = r.height;
				e.texturesByUrl[t] = i;
				e.refresh()
			})
		}
	}
	function Ks(e) {
		return typeof e === "number" && e % 1 === 0
	}
	function $s(e) {
		return Ks(Math.log(e) / Math.LN2)
	}
	function ea(e, t, r) {
		var n = t.width,
			i = t.height,
			o = false;
		if (r && e.minSvgSize) {
			var s = Math.max(e.minSvgSize / n, e.minSvgSize / i);
			if (s > 1) {
				n = n * s | 0;
				i = i * s | 0;
				o = true
			}
		}
		if (!$s(n) || !$s(i)) {
			n = ge(n, 2);
			i = ge(i, 2);
			o = true
		}
		if (o) {
			var a = document.createElement("canvas"),
				u = a.getContext("2d");
			a.width = n;
			a.height = i;
			u.drawImage(t, 0, 0, n, i);
			return a
		}
		return t
	}
	function ta(e, t, r, n) {
		var i = e.gl,
			o, s;
		if (r) {
			s = r.texture;
			o = r
		} else {
			s = i.createTexture();
			o = {
				index: e.textureCounter,
				texture: s
			};
			e.textureCounter += 1
		}
		t = ea(e, t, n === "svg");
		i.bindTexture(i.TEXTURE_2D, s);
		var a = i.RGBA;
		try {
			i.texImage2D(i.TEXTURE_2D, 0, a, a, i.UNSIGNED_BYTE, t)
		} catch (t) {
			Oe(t);
			i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, i.RGBA, i.UNSIGNED_BYTE, e.imageManager.getErrorImage())
		}
		var u = i.NEAREST,
			l = i.LINEAR;
		i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MAG_FILTER, n === "text" ? u : i.LINEAR);
		i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, n === "text" ? l : i.NEAREST_MIPMAP_LINEAR);
		i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE);
		i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE);
		i.generateMipmap(i.TEXTURE_2D);
		i.bindTexture(i.TEXTURE_2D, null);
		return o
	}
	var ra = 50;
	var na = new Or;
	var ia = new Or;
	var oa = new Or;
	var sa = new Or;
	var aa = new Or;
	var ua = new Or;
	var la = new Or;
	var da = new Or;
	var fa = new Or;
	var ha = new Or;
	var ca = new Or;
	var pa = new Or;

	function ga(e, t, r, n, i, o, s, a, u, l, d, f, h, c) {
		l = Na(e, l);
		sa.ax = (r.ax + o.ax) / 2;
		sa.ay = (r.ay + o.ay) / 2;
		sa.zx = (r.zx + o.zx) / 2;
		sa.zy = (r.zy + o.zy) / 2;
		sa.ox = (r.ox + o.ox) / 2;
		sa.oy = (r.oy + o.oy) / 2;
		c(0, r, n, i, o, sa, na);
		c(1 / ra, r, n, i, o, sa, ia);
		Xr(na, ia, s, a, aa, ua, la, da);
		var p = e.updateComposite(t, ra * 2);
		for (var g = 2; g <= ra; ++g) {
			c(g / ra, r, n, i, o, sa, oa);
			Xr(ia, oa, s, a, fa, ha, ca, pa);
			p[(g - 2) * 2] = Qs(e, p[(g - 2) * 2], l, "polygon", aa, ua, ha, d, f, h);
			p[(g - 2) * 2 + 1] = Qs(e, p[(g - 2) * 2 + 1], l, "polygon", ha, fa, aa, d, f, h);
			na.set(ia);
			ia.set(oa);
			aa.set(fa);
			ua.set(ha)
		}
		Xr(na, o, s, a, fa, ha, ca, pa);
		p[ra * 2 - 2] = Qs(e, p[ra * 2 - 2], l, "polygon", fa, ha, ca, d, f, h);
		p[ra * 2 - 1] = Qs(e, p[ra * 2 - 1], l, "polygon", ca, pa, fa, d, f, h);
		for (g = 0; g < p.length; ++g) {
			e.setColor(p[g], u)
		}
		return e.composite(t, p)
	}
	function va(e, t, r, n, i, o, s) {
		Wn(e, t.x, t.y, i.x, i.y, r.x, r.y, s);
		s.add(o)
	}
	function ya(e, t, r, n, i, o, s) {
		Vn(e, t.x, t.y, i.x, i.y, r.x, r.y, n.x, n.y, s);
		s.add(o)
	}
	function _a(e, t, r, n, i, o, s, a, u, l, d, f) {
		var h = e.shapeList.attributes,
			c = h.bufferIndex[t],
			p = h.bufferOffset[t],
			g = e.bufferList[c];
		if (!r) {
			g.textureBox.set(p, i, o);
			g.duplicate.set(p, +n)
		}
		g.textureCoords.set2x3(p, s, a, u, l, d, f)
	}
	function ma(e, t) {
		var r = e[t];
		if (!r) {
			r = {};
			e[t] = r
		}
		return r
	}
	function xa(e, t, r) {
		if (r !== "italic" && r !== "bold") {
			r = "none"
		}
		var n = e.bitmapFonts[t];
		if (!n) {
			n = {};
			e.bitmapFonts[t] = n
		}
		var i = n[r];
		if (!i) {
			i = new ss(t, r, e._createTextTexture, e.defaultFont, e.fontSamplingSize);
			i.index = e.bitmapFontCounter++;
			e.bitmapFontsByIndex[i.index] = i;
			n[r] = i
		}
		return i
	}
	var ba = new Or;

	function Aa(e, t, r, n, i, o, s, a, u, l, d, f, h, c, p, g) {
		f = Na(e, f);
		var v = 0,
			y, _ = s,
			m = o,
			x = g ? "lineText" : "text",
			b = xa(e, i, u);
		for (var A = 0; A < n.length; ++A) {
			var w = b.get(n[A]);
			v += w.ratio
		}
		y = v * o;
		v *= s;
		ba.reset();
		if (l === "center") {
			ba.ox -= v / 2;
			ba.zx -= y / 2
		} else if (l === "right") {
			ba.ox -= v;
			ba.zx -= y
		}
		if (d === "middle") {
			ba.oy -= _ / 2;
			ba.zy -= m / 2
		} else if (d === "bottom") {
			ba.oy -= _;
			ba.zy -= m
		}
		ba.oy += 1;
		Ps.set(r).add(ba);
		Ds.set(r).add(ba);
		Os.set(r).add(ba);
		Bs.set(r).add(ba);
		Ds.oy += _;
		Bs.oy += _;
		Ds.zy += m;
		Bs.zy += m;
		var E = e.updateComposite(t, n.length * 2),
			I = b.index;
		for (A = 0; A < n.length; ++A) {
			var S = b.get(n[A]),
				C = s * S.ratio,
				T = o * S.ratio;
			Os.ox = Ps.ox + C;
			Bs.ox = Ds.ox + C;
			Os.zx = Ps.zx + T;
			Bs.zx = Ds.zx + T;
			E[A * 2] = Qs(e, E[A * 2], f, x, Ps, Os, Bs, h, c, p, I);
			E[A * 2 + 1] = Qs(e, E[A * 2 + 1], f, x, Bs, Ds, Ps, h, c, p, I);
			e.setColor(E[A * 2], a, true);
			e.setColor(E[A * 2 + 1], a, true);
			wa(e, E[A * 2], S.x1, S.y1, S.x2, S.y1, S.x2, S.y2, o, s);
			wa(e, E[A * 2 + 1], S.x2, S.y2, S.x1, S.y2, S.x1, S.y1, o, s);
			if (g) {
				Ea(e, E[A * 2], g.textWidth, g.textHeight, g.ratio, g.angle, g.length, g.size, g.strokeSize);
				Ea(e, E[A * 2 + 1], g.textWidth, g.textHeight, g.ratio, g.angle, g.length, g.size, g.strokeSize)
			}
			Ps.set(Os);
			Ds.set(Bs)
		}
		return e.composite(t, E)
	}
	function wa(e, t, r, n, i, o, s, a, u, l) {
		var d = e.shapeList.attributes,
			f = d.bufferIndex[t],
			h = d.bufferOffset[t],
			c = e.bufferList[f];
		c.textureCoords.set2x3(h, r, n, i, o, s, a)
	}
	function Ea(e, t, r, n, i, o, s, a, u) {
		var l = e.shapeList.attributes,
			d = l.bufferIndex[t],
			f = l.bufferOffset[t],
			h = e.bufferList[d];
		h.textDimensions.set(f, r, n, i);
		h.lineInfo.set(f, o, s, a, u)
	}
	function Ia(e, t, r) {
		return Sa(e, t) - Sa(e, r)
	}
	function Sa(e, t) {
		if (t === "undefined") {
			return 1e4
		} else {
			var r = e.semanticLayers[t],
				n = r.level;
			if (r.transparency) {
				n += 5e3
			}
			return n
		}
	}
	function Ca(e) {
		rt(e.bitmapFonts, function(e) {
			rt(e, function(e) {
				e.updateIfNecessary()
			})
		})
	}
	function Ta(e, t) {
		if (t.defineClipSpace || t.useClipSpace) {
			e.enable(e.STENCIL_TEST);
			e.stencilOp(e.KEEP, e.KEEP, e.REPLACE);
			if (t.defineClipSpace) {
				e.clear(e.STENCIL_BUFFER_BIT);
				e.depthFunc(e.LEQUAL);
				e.stencilFunc(e.ALWAYS, 1, 1)
			} else {
				e.depthFunc(e.EQUAL);
				e.stencilFunc(e.EQUAL, 1, 1)
			}
		} else {
			e.depthFunc(e.LEQUAL);
			e.disable(e.STENCIL_TEST)
		}
	}
	function La(e, t, r) {
		var n = e.gl,
			i = e.buffersBySemanticLayer,
			o = Object.keys(i).sort(e._sortSemanticLayerFunction),
			s = Ut();
		n.enable(n.DEPTH_TEST);
		for (var a = 0; a < o.length; ++a) {
			var u = o[a],
				l = e.semanticLayers[u] || e.DEFAULT_LAYER,
				d = i[u],
				f = Object.keys(e.programs),
				h = l.camera;
			if (l.disabled) {
				continue
			}
			Ta(n, l);
			for (var c = 0; c < f.length; ++c) {
				var p = f[c],
					g = d[p];
				if (!g) {
					continue
				}
				var v = e.programs[p],
					y = v.uniforms,
					_ = Object.keys(g);
				e._nbAttributesEnabled = v.prepare(e._nbAttributesEnabled);
				y.pixelRatio.set(s);
				y.textureMultiplier.set(e.samplingLevel);
				y.animationMode.set(+e.animationsEnabled);
				y.screenSize.set(t, r);
				y.camPosition.set(h.x, h.y);
				y.camAngle.set(h.angle);
				y.cosCamAngle.set(Math.cos(h.angle));
				y.sinCamAngle.set(Math.sin(h.angle));
				y.camZoom.set(h.zoom);
				y.currentTime.set(e.currentTime);
				y.vcMargin.set(e._visibilityConditionTolerance);
				for (var m = 0; m < _.length; ++m) {
					var x = _[m],
						b = g[x];
					if (p === "nonScaledImage" || p === "image") {
						var A = e.texturesByUrl[x];
						if (!A) {
							continue
						}
						n.activeTexture(n.TEXTURE0);
						n.bindTexture(n.TEXTURE_2D, A.texture);
						v.uniforms.texture.set(0);
						if (p === "nonScaledImage") {
							y.textureDimensions.set(A.width, A.height)
						}
					} else if (p === "text" || p === "lineText") {
						var w = e.bitmapFontsByIndex[x],
							E = w.bigTexture;
						n.activeTexture(n.TEXTURE0);
						n.bindTexture(n.TEXTURE_2D, E.texture);
						v.uniforms.bigTexture.set(0)
					}
					b.draw()
				}
			}
		}
	}
	function Na(e, t) {
		if (t !== undefined && !e.semanticLayers[t]) {
			throw new Error('Sub-layer "' + t + '" does not exist.')
		}
		return t
	}
	g.extend(function(e) {
		var t = new za;
		e.modules.events = t;
		e.events.removeListener = function(e) {
			t.removeListener(e)
		}
	});
	var za = function e() {
			this._events = {}
		};
	za.prototype.register = function e(t, r) {
		var n = this;
		if (r === void 0) r = [];
		t.forEach(function(e) {
			if (n._events[e]) {
				throw new Error('event "' + e + '" already exists')
			}
			n._events[e] = new Ma(false, e)
		});
		r.forEach(function(e) {
			if (n._events[e]) {
				throw new Error('event "' + e + '" already exists')
			}
			n._events[e] = new Ma(true, e)
		})
	};
	za.prototype.on = function e(t, r) {
		var n = this;
		if (ke(t)) {
			Xe(t, function(e, t) {
				return n.on(t, e)
			})
		} else {
			var i = t.split(" ").filter(function(e) {
				return !!e
			});
			i.forEach(function(e) {
				return Ze(n._events, e, "event").on(r)
			})
		}
		return r
	};
	za.prototype.removeListener = function e(t) {
		Xe(this._events, function(e) {
			e.off(t)
		})
	};
	za.prototype.fire = function e(t, r) {
		Ze(this._events, t, "event").trigger(r)
	};
	za.prototype.once = function e(t, r) {
		var n = arguments;
		var i = this;
		var o = function() {
				r.apply(null, n);
				i.removeListener(o)
			};
		return this.on(t, o)
	};
	var Ma = function e(t, r) {
			this._name = r;
			this._reverseOrder = t;
			this._subscribers = []
		};
	Ma.prototype.trigger = function e(t) {
		var r = this;
		for (var n = 0; n < this._subscribers.length; ++n) {
			r._subscribers[n](t, r._name)
		}
	};
	Ma.prototype.on = function e(t) {
		if (typeof t !== "function") {
			throw new Error("handler is not a function")
		}
		if (this._reverseOrder) {
			this._subscribers.unshift(t)
		} else {
			this._subscribers.push(t)
		}
	};
	Ma.prototype.off = function e(t) {
		var r = this;
		var n;
		while ((n = this._subscribers.indexOf(t)) !== -1) {
			r._subscribers.splice(n, 1)
		}
	};
	g.extend(function(e) {
		e.modules.events.register([], ["reset", "kill"]);
		e.reset = function() {
			return e.modules.events.fire("reset")
		};
		e.kill = function() {
			return e.modules.events.fire("kill")
		}
	});
	g.atInit(function(e, t) {
		if (t.options) {
			e.setOptions(t.options)
		}
	});
	g.extend(function(e) {
		var t = new ka(e);
		e.modules.settings = t;
		e.setOptions = function(e) {
			return t.update(e)
		}
	});
	var ka = function e(t) {
			var r = this;
			this._currentValue = {};
			this._onChange = {};
			this._defaultValues = {};
			this._keys = [];
			t.modules.events.on("reset", function() {
				r.update(r._defaultValues)
			})
		};
	ka.prototype.register = function e(t, r, n) {
		this._keys.push(t);
		this._currentValue[t] = r;
		this._defaultValues[t] = r;
		this._onChange[t] = n ||
		function() {}
	};
	ka.prototype.update = function e(t) {
		var r = this;
		t = Et(t);
		var n = this._keys,
			i = {};
		for (var o = 0; o < n.length; ++o) {
			var s = n[o];
			if (s in t) {
				var value = t[s];
				if (value === undefined) {
					value = r._defaultValues[s]
				}
				i[s] = r._currentValue[s];
				r._currentValue[s] = value
			}
		}
		var a = Object.keys(i);
		for (var u = 0; u < a.length; ++u) {
			var l = a[u],
				d = r._currentValue[l],
				f = i[l];
			if (d !== f) {
				r._onChange[l](d, f)
			}
		}
		return St(i)
	};
	ka.prototype.get = function e(t) {
		if (t === undefined) {
			return St(this._currentValue)
		} else {
			return this._currentValue[t]
		}
	};
	var Ra = {
		x: 0,
		y: 0,
		zoom: 1,
		angle: 0
	};
	var Fa = ["edgeHalos", "nodeHaloStrokes", "nodeHalos", "edgeShapes", "edgeOuterStrokes", "edgeOutlines", "edgeTextBackground", "edgeText", "nodeOuterStrokes", "nodeInnerStrokes", "nodeShapes", "nodePieCharts", "nodeIcons", "nodeImages", "nodeBadgeStroke", "nodeBadge", "nodeBadgeImage", "nodeBadgeText", "nodeOutlines", "nodeTextBackground", "nodeText", "edgePulses", "nodePulses", "guidelines", "legendBorders", "legendBackground", "legendContent"];
	var Pa = ["geo", "graphics", "legend", "brand", "tooltip", "resizing", "rewiring", "lasso", "connectNodes"];
	var Da = "white";
	var Oa = "default";
	var Ba = 300;
	var Ua = 300;
	g.atInit(function(e, t) {
		var r = t.container;
		if (r) {
			e.setContainer(r)
		}
		if (typeof document !== "undefined" && document.fonts && document.fonts.ready instanceof Promise) {
			setTimeout(function() {
				return document.fonts.ready.then(function(t) {
					if (t.size > 0) {
						e.reloadFonts()
					}
				})
			}, 0)
		} else {
			setTimeout(e.reloadFonts, 2e3)
		}
	});
	g.extend(function(e, t) {
		var r = {
			type: Ye(t.renderer, "webgl"),
			imgCrossOrigin: Ye(t.imgCrossOrigin, "anonymous"),
			webglOptions: Ye(t.webglOptions, {
				antiAliasing: "super-sampling",
				fontSamplingSize: 32,
				minimumSvgSize: null
			})
		};
		var n = new Xa(e, r, t.dimensions);
		e.modules.render = n;
		e.setContainer = function(e) {
			return n.setContainer(e)
		};
		e.getContainer = function() {
			return n.getContainer()
		};
		e.reloadFonts = function() {
			return n.reloadFonts()
		};
		e.view.setFullScreen = function(value) {
			return n.setFullScreen(value)
		};
		e.view.isFullScreen = function(value) {
			return n.isFullScreen()
		};
		e.view.forceResize = function() {
			return n.resize()
		}
	});
	var Xa = function e(t, r, n) {
			var i = this;
			if (n === void 0) n = {};
			var o = n.width;
			if (o === void 0) o = 80;
			var s = n.height;
			if (s === void 0) s = 60;
			this._events = t.modules.events;
			this._settings = t.modules.settings;
			this._windowEvtListener = function() {
				return ja(i, true)
			};
			this._width = o;
			this._height = s;
			this._frameCount = 0;
			this._renderLayers = [];
			this._container = null;
			this._renderer = null;
			this._exportedRenderer = null;
			this._semanticLayers = {};
			this._defaultCursorStyle = Oa;
			this._cursorStyle = [];
			this._isFullScreen = false;
			this._visibilityConditionTolerance = 0;
			this._canvas = null;
			this._settings.register("fpsLimit", null, function(e) {
				return i._renderer.setFpsLimit(e)
			});
			this._settings.register("cursor.default", Oa, function(e) {
				i._defaultCursorStyle = e;
				Qa(i)
			});
			this._settings.register("backgroundColor", Da, function(e) {
				i._renderer.setBackgroundColor(e);
				i.refresh()
			});
			this._settings.register("minimumWidth", Ba, function() {
				return ja(i, true)
			});
			this._settings.register("minimumHeight", Ua, function() {
				return ja(i, true)
			});
			this._events.register(["beforeNewFrame", "newFrame", "setContainer", "resize", "reloadFonts"]);
			this._init_(r);
			if (typeof window !== "undefined") {
				window.addEventListener("focus", function() {
					return i.refresh()
				})
			}
		};
	Xa.prototype.addCursorStyle = function e(t) {
		if (!t) {
			return
		}
		this._cursorStyle.unshift(t);
		Qa(this)
	};
	Xa.prototype.removeCursorStyle = function e(t) {
		if (!t) {
			return
		}
		var r = this._cursorStyle.indexOf(t);
		if (r !== -1) {
			this._cursorStyle.splice(r, 1);
			Qa(this)
		}
	};
	Xa.prototype._init_ = function e(t) {
		var r = this;
		var n = t.type;
		var i = t.imgCrossOrigin;
		var o = t.webglOptions;
		var s = {
			webgl: js,
			canvas: Oi,
			svg: go,
			dummy: _i
		};
		if (n && (typeof window === "undefined" || !window["__OGMA_HEADLESS"]) && U() !== "node") {
			if (n === "webgl" && !s.webgl.available) {
				Pe("The WebGL renderer is not available, fallbacking on canvas.");
				n = "canvas"
			}
			if (n === "canvas" && !s.canvas.available) {
				Pe("The canvas renderer is not available, rendering will be disabled.");
				n = "dummy"
			}
		} else {
			n = "dummy"
		}
		this._renderer = new s[n](this._width, this._height, this._semanticLayers, {
			imgCrossOrigin: i,
			antialias: o.antiAliasing,
			fontSamplingSize: o.fontSamplingSize,
			minSvgSize: o.minimumSvgSize,
			backgroundColor: Da,
			defaultFont: "Arial",
			onRender: function(e) {
				var t = {
					elapsed: e
				};
				r._frameCount += 1;
				r._events.fire("beforeNewFrame", t);
				r._events.fire("newFrame", t)
			}
		});
		this._renderer.setVisibilityConditionTolerance(this._visibilityConditionTolerance);
		this.addRenderLayer(this._renderer.domElement(), "graphics");
		if (typeof window !== "undefined" && window.addEventListener) {
			window.addEventListener("resize", this._windowEvtListener)
		}
		Qa(this)
	};
	Xa.prototype.getDimensions = function e() {
		return {
			width: this._width,
			height: this._height
		}
	};
	Xa.prototype.reset = function e() {
		window.removeEventListener("resize", this._windowEvtListener)
	};
	Xa.prototype.addCanvasLayer = function e(t) {
		var r = kt();
		this.addRenderLayer(r, t, true);
		return r
	};
	Xa.prototype.addRenderLayer = function e(t, r, n) {
		if (typeof r === "string") {
			r = Pa.indexOf(r)
		}
		if (r < 0) {
			r = Pa.length
		}
		if (n) {
			t.style.pointerEvents = "none";
			t.style.position = "absolute";
			t.style.top = "0px";
			t.style.left = "0px";
			Vt(t, this._width, this._height)
		}
		this._renderLayers.push({
			element: t,
			level: r,
			automaticResize: n
		});
		Wa(this)
	};
	Xa.prototype.removeRenderLayer = function e(t) {
		var r = this;
		for (var n = 0; n < this._renderLayers.length; ++n) {
			if (r._renderLayers[n].element === t) {
				r._renderLayers.splice(n, 1);
				if (r._container) {
					r._container.removeChild(t)
				}
				break
			}
		}
		Wa(this)
	};
	Xa.prototype.setContainer = function e(t) {
		if (typeof t === "string") {
			t = document.getElementById(t)
		}
		if (t === this._container) {
			return
		}
		var r = this._container;
		this._container = t;
		if (this._container) {
			ja(this, false);
			Wa(this)
		}
		this._events.fire("setContainer", {
			element: t,
			prevElement: r
		})
	};
	Xa.prototype.getContainer = function e() {
		return this._container
	};
	Xa.prototype.getCanvas = function e() {
		return this._renderer && this._renderer.domElement()
	};
	Xa.prototype.resize = function e() {
		if (this._container) {
			ja(this, true)
		}
	};
	Xa.prototype.addSemanticLayer = function e(t, r) {
		if (r === void 0) r = {};
		if (this._semanticLayers[t]) {
			throw new Error("sub-layer " + t + " already exists")
		}
		this._semanticLayers[t] = {
			name: t,
			level: Ze(Fa, t, "semantic layer"),
			defineClipSpace: !! r.defineClipSpace,
			useClipSpace: !! r.useClipSpace,
			camera: r.camera || Ra,
			disabled: false,
			transparency: r.transparency || false
		}
	};
	Xa.prototype.type = function e() {
		return this._renderType
	};
	Xa.prototype.getSemanticLayers = function e() {
		return ut(this._semanticLayers)
	};
	Xa.prototype.atNextFrame = function e(t) {
		if (this._renderer) {
			return this._renderer.atNextFrame(t)
		}
	};
	Xa.prototype.setSemanticLayerEnabled = function e(t, r) {
		var n = Ha(this, t);
		n.disabled = !r;
		Ga(this)
	};
	Xa.prototype.setSemanticLayersEnabled = function e(t, r) {
		var n = this;
		for (var i = 0; i < t.length; ++i) {
			var o = Ha(n, t[i]);
			o.disabled = !r
		}
		Ga(this)
	};
	Xa.prototype.animate = function e(t, r) {
		this._renderer.animate(t, r)
	};
	Xa.prototype.stopAnimations = function e() {
		this._renderer.stopAnimations()
	};
	Xa.prototype.setAnimationsEnabled = function e(value) {
		this._renderer.setAnimationsEnabled(value)
	};
	Xa.prototype.setOffset = function e(t) {
		if (t) {
			Ya(t)
		}
		this._renderer.setOffset(t)
	};
	Xa.prototype.refresh = function e() {
		if (this._renderer) {
			this._renderer.refresh()
		}
	};
	Xa.prototype.delete = function e(t) {
		if (this._exportedRenderer) {
			return t
		} else {
			return this._renderer.delete(t)
		}
	};
	Xa.prototype.setDepth = function e(t, r) {
		this._renderer.setDepth(t, r)
	};
	Xa.prototype.hide = function e(t) {
		if (this._renderer.hide) {
			this._renderer.hide(t)
		} else {
			this._renderer.setDepth(t, 0)
		}
	};
	Xa.prototype.setColor = function e(t, r) {
		this._renderer.setColor(t, r)
	};
	Xa.prototype.setVisibilityCondition1 = function e(t, r, n, i, o) {
		this._renderer.setVisibilityCondition1(t, r, n, i, o)
	};
	Xa.prototype.setVisibilityCondition2 = function e(t, r, n, i, o) {
		this._renderer.setVisibilityCondition2(t, r, n, i, o)
	};
	Xa.prototype.wrappedUpdate = function e(t, r, n) {
		if (this._exportedRenderer) {
			return this._exportedRenderer.wrappedUpdate(-1, r, n)
		} else {
			return this._renderer.wrappedUpdate(t, r, n)
		}
	};
	Xa.prototype.updateComposite = function e(t, r) {
		if (this._exportedRenderer) {
			return this._exportedRenderer.updateComposite(-1, r)
		} else {
			return this._renderer.updateComposite(t, r)
		}
	};
	Xa.prototype.composite = function e(t, r) {
		if (this._exportedRenderer) {
			this._renderer.composite(-1, r);
			return t
		} else {
			return this._renderer.composite(t, r)
		}
	};
	Xa.prototype.circle = function e(t, r, n, i, o, s, a, u, l) {
		Ya(r);
		if (this._exportedRenderer) {
			this._exportedRenderer.circle(-1, r, n, i, o, s, a, u, l);
			return t
		} else {
			return this._renderer.circle(t, r, n, i, o, s, a, u, l)
		}
	};
	Xa.prototype.triangle = function e(t, r, n, i, o, s, a, u, l) {
		qa(r, n, i);
		if (this._exportedRenderer) {
			this._exportedRenderer.triangle(-1, r, n, i, o, s, a, u, l);
			return t
		} else {
			return this._renderer.triangle(t, r, n, i, o, s, a, u, l)
		}
	};
	Xa.prototype.rectangle = function e(t, r, n, i, o, s, a, u, l) {
		Va(r, n);
		if (this._exportedRenderer) {
			this._exportedRenderer.rectangle(-1, r, n, i, o, s, a, u, l);
			return t
		} else {
			return this._renderer.rectangle(t, r, n, i, o, s, a, u, l)
		}
	};
	Xa.prototype.quadrilateral = function e(t, r, n, i, o, s, a, u, l, d, f) {
		Za(r, n, i, o);
		if (this._exportedRenderer) {
			this._exportedRenderer.quadrilateral(-1, r, n, i, o, s, a, u, l, d, f);
			return t
		} else {
			return this._renderer.quadrilateral(t, r, n, i, o, s, a, u, l, d, f)
		}
	};
	Xa.prototype.polygon = function e(t, r, n, i, o, s, a) {
		if (this._exportedRenderer) {
			this._exportedRenderer.polygon(-1, r, n, i, o, s, a);
			return t
		} else {
			return this._renderer.polygon(t, r, n, i, o, s, a)
		}
	};
	Xa.prototype.line = function e(t, r, n, i, o, s, a, u, l, d) {
		Va(r, n);
		if (this._exportedRenderer) {
			this._exportedRenderer.line(-1, r, n, i, o, s, a, u, l, d);
			return t
		} else {
			return this._renderer.line(t, r, n, i, o, s, a, u, l, d)
		}
	};
	Xa.prototype.quadraticCurve = function e(t, r, n, i, o, s, a, u, l, d, f) {
		qa(r, n, i);
		if (this._exportedRenderer) {
			this._exportedRenderer.quadraticCurve(-1, r, n, i, o, s, a, u, l, d, f);
			return t
		} else {
			return this._renderer.quadraticCurve(t, r, n, i, o, s, a, u, l, d, f)
		}
	};
	Xa.prototype.cubicCurve = function e(t, r, n, i, o, s, a, u, l, d, f, h) {
		Za(r, n, i, o);
		if (this._exportedRenderer) {
			this._exportedRenderer.cubicCurve(-1, r, n, i, o, s, a, u, l, d, f, h);
			return t
		} else {
			return this._renderer.cubicCurve(t, r, n, i, o, s, a, u, l, d, f, h)
		}
	};
	Xa.prototype.image = function e(t, r, n, i, o, s, a, u, l, d) {
		Va(r, n);
		if (this._exportedRenderer) {
			this._exportedRenderer.image(-1, r, n, i, o, s, a, u, l, d);
			return t
		} else {
			return this._renderer.image(t, r, n, i, o, s, a, u, l, d)
		}
	};
	Xa.prototype.text = function e(t, r, n, i, o, s, a, u, l, d, f, h, c, p, g) {
		Ya(r);
		if (this._exportedRenderer) {
			this._exportedRenderer.text(-1, r, n, i, o, s, a, u, l, d, f, h, c, p, g);
			return t
		} else {
			return this._renderer.text(t, r, n, i, o, s, a, u, l, d, f, h, c, p, g)
		}
	};
	Xa.prototype.textWidth = function e(t, r, n, i) {
		if (this._exportedRenderer) {
			return this._exportedRenderer.textWidth(t, r, n, i)
		} else {
			return this._renderer.textWidth(t, r, n, i)
		}
	};
	Xa.prototype.enableShadows = function e(t, r, n) {
		if (this._exportedRenderer) {
			return this._exportedRenderer.enableShadows(t, r, n)
		} else {
			return this._renderer.enableShadows(t, r, n)
		}
	};
	Xa.prototype.disableShadows = function e() {
		if (this._exportedRenderer) {
			return this._exportedRenderer.disableShadows()
		} else {
			return this._renderer.disableShadows()
		}
	};
	Xa.prototype.reloadFonts = function e() {
		this._renderer.reloadFonts();
		this._events.fire("reloadFonts")
	};
	Xa.prototype.setFullScreen = function e(value) {
		if (value === undefined) {
			value = !this._isFullScreen
		}
		if (this._container) {
			if (value) {
				var t = $a(this._container);
				if (t) {
					this._container[t]()
				}
			} else if (this._isFullScreen) {
				t = eu();
				document[t]()
			}
		}
		this._isFullScreen = value
	};
	Xa.prototype.setVisibilityConditionTolerance = function e(value) {
		this._visibilityConditionTolerance = value;
		if (this._renderer) {
			this._renderer.setVisibilityConditionTolerance(value)
		}
	};
	Xa.prototype.clear = function e() {
		this._renderer.clear();
		this._renderer.refresh()
	};
	Xa.prototype.isFullScreen = function e() {
		return this._isFullScreen
	};
	Xa.prototype.export = function e(t, r, n, i, o) {
		var s = new t(r, n, this._semanticLayers, {
			noRefresh: true,
			backgroundColor: i
		}),
			a = this._width,
			u = this._height;
		s.setVisibilityConditionTolerance = this._visibilityConditionTolerance;
		this._exportedRenderer = s;
		this._width = r;
		this._height = n;
		o();
		this._exportedRenderer = undefined;
		this._width = a;
		this._height = u;
		return s
	};

	function ja(e, t) {
		if (!e._container) {
			return
		}
		var r = e._width,
			n = e._height,
			i = e._container.clientWidth || 1,
			o = e._container.clientHeight || 1,
			s = e._settings.get("minimumWidth"),
			a = e._settings.get("minimumHeight");
		i = Math.max(i, s);
		o = Math.max(o, a);
		e._width = i;
		e._height = o;
		e._renderer.resize(i, o);
		e._renderLayers.forEach(function(e) {
			if (e.automaticResize) {
				Vt(e.element, i, o)
			}
		});
		if (t) {
			e._events.fire("resize", {
				prevWidth: r,
				prevHeight: n,
				width: i,
				height: o,
				difWidth: i - r,
				difHeight: o - n
			})
		}
	}
	function Wa(e) {
		if (!e._container) {
			return
		}
		e._renderLayers.sort(function(e, t) {
			return e.level - t.level
		});
		var t = [];
		e._renderLayers.forEach(function(r) {
			var n = r.element;
			if (n.parentNode === e._container) {
				e._container.removeChild(n)
			}
			t.push(n)
		});
		var r = e._container.firstChild || null;
		t.forEach(function(t) {
			return e._container.insertBefore(t, t.__isOgmaTooltip ? null : r)
		})
	}
	function Ga(e) {
		if (e._renderer) {
			e._renderer.refresh()
		}
	}
	function Ha(e, t) {
		var r = e._semanticLayers[t];
		if (!r) {
			throw new Error('semantic layer "' + t + '" does not exist.')
		}
		return r
	}
	function Ya(e) {
		if (e.x === undefined) {
			e.x = 0
		}
		if (e.y === undefined) {
			e.y = 0
		}
		if (e.zx === undefined) {
			e.zx = 0
		}
		if (e.zy === undefined) {
			e.zy = 0
		}
		if (e.ax === undefined) {
			e.ax = 0
		}
		if (e.ay === undefined) {
			e.ay = 0
		}
		if (e.ox === undefined) {
			e.ox = 0
		}
		if (e.oy === undefined) {
			e.oy = 0
		}
	}
	function Va(e, t) {
		Ya(e);
		Ya(t)
	}
	function qa(e, t, r) {
		Ya(e);
		Ya(t);
		Ya(r)
	}
	function Za(e, t, r, n) {
		Ya(e);
		Ya(t);
		Ya(r);
		Ya(n)
	}
	function Qa(e) {
		if (e._renderer) {
			var t = e._cursorStyle[0] || e._defaultCursorStyle,
				r = e._renderer.domElement();
			r.style.cursor = t;
			if (r.style.cursor !== t) {
				r.style.cursor = "-webkit-" + t
			}
		}
	}
	var Ja = ["requestFullScreen", "webkitRequestFullScreen", "mozRequestFullScreen", "msRequestFullscreen"];
	var Ka = ["cancelFullScreen", "webkitCancelFullScreen", "mozCancelFullScreen", "msExitFullscreen"];

	function $a(e) {
		for (var t = 0; t < Ja.length; ++t) {
			var r = Ja[t];
			if (typeof e[r] === "function") {
				return r
			}
		}
		return null
	}
	function eu() {
		for (var e = 0; e < Ka.length; ++e) {
			var t = Ka[e];
			if (typeof document[t] === "function") {
				return t
			}
		}
		return null
	}
	var tu = function e(t, r, n) {
			this._ogma = t;
			this._graph = r;
			this._isNode = n;
			this._name = n ? "node" : "edge";
			this._filters = [];
			this._excluded = this._graph.createAttribute(this._isNode, {
				name: "excluded",
				storage: 1
			});
			this._objects = this._graph.getAttribute(this._isNode, "object");
			this._list = [];
			this._rules = [];
			this._nextRuleId = 1;
			this._sourceList = this._graph.getAttribute(false, "source");
			this._targetList = this._graph.getAttribute(false, "target");
			this._nodeExcluded = this._graph.getAttribute(true, "excluded")
		};
	tu.prototype.getNonExcludedList = function e(t) {
		var r = this;
		if (!t) {
			t = this._graph.allIndexes(this._isNode)
		}
		var n = [];
		for (var i = 0; i < t.length; ++i) {
			var o = t[i];
			if (r._excluded.get(o) === 0) {
				n.push(o)
			}
		}
		return n
	};
	tu.prototype.isExcluded = function e(t) {
		return this._excluded.get(t)
	};
	tu.prototype.addFilter = function e() {
		var t = this._graph.createAttribute(this._isNode, {
			storage: 1
		});
		this._filters.push(t);
		return t
	};
	tu.prototype.removeFilter = function e(t) {
		this._graph._removeAttribute(this._isNode, t);
		var r = this._filters.indexOf(t);
		if (r !== -1) {
			this._filters.splice(r, 1)
		}
	};
	tu.prototype.refreshFilters = function e(t) {
		var r = this;
		var n = this._filters,
			i = n.length,
			o = this._excluded,
			s = [],
			a = [],
			u = [];
		for (var l = 0, d = t.length; l < d; ++l) {
			var f = t[l],
				h = 0;
			if (!r._isNode) {
				var c = r._sourceList.get(f),
					p = r._targetList.get(f),
					g = r._nodeExcluded.get(c),
					v = r._nodeExcluded.get(p);
				h = g || v
			}
			if (!h) {
				for (var y = 0; y < i; ++y) {
					var _ = r._filters[y];
					if (_.get(f)) {
						h = 1;
						break
					}
				}
			}
			if (o.get(f) !== h) {
				(h ? a : u).push(f);
				o.set(f, h)
			}
			if (h) {
				s.push(f)
			}
		}
		this._list = s;
		return {
			newlyExcluded: a,
			newlyIncluded: u
		}
	};
	tu.prototype.refreshRules = function e(t) {
		var r = this;
		for (var n = 0; n < this._rules.length; ++n) {
			r._refreshRule(r._rules[n], t)
		}
	};
	tu.prototype._refreshRule = function e(t, r) {
		var n = this;
		if (!r) {
			r = this._graph._allIndexes(this._isNode)
		}
		var i = t.array,
			o = t.func;
		for (var s = 0; s < r.length; ++s) {
			var a = r[s],
				u = n._objects.get(a);
			i.set(a, !o(u))
		}
	};
	tu.prototype.addRule = function e(t) {
		var r = this.addFilter(),
			n = {
				id: this._nextRuleId,
				func: t,
				array: r
			};
		this._rules.push(n);
		this._refreshRule(n);
		return this._nextRuleId++
	};
	tu.prototype.removeRule = function e(t) {
		var r = this._getRuleIndex(t),
			n = this._rules[r];
		this.removeFilter(n.array);
		this._rules.splice(r, 1)
	};
	tu.prototype.clearRules = function e() {
		var t = this;
		if (!this._rules.length) {
			return
		}
		for (var r = 0; r < this._rules.length; ++r) {
			t.removeFilter(t._rules[r].array)
		}
		this._rules = []
	};
	tu.prototype._getRuleIndex = function e(t) {
		var r = this;
		for (var n = 0; n < this._rules.length; ++n) {
			if (r._rules[n].id === t) {
				return n
			}
		}
		throw new Error(this._name + " filter " + t + " does not exist")
	};
	var ru = function e(t, r) {
			this._isNode = r;
			this._graph = t;
			this._array = this._graph.createAttribute(r, {
				storage: 1
			});
			this._list = []
		};
	var nu = {
		list: {},
		size: {}
	};
	ru.prototype.alter = function e(t, value) {
		return value ? this.add(t) : this.remove(t)
	};
	ru.prototype.add = function e(t) {
		if (!this._array.get(t)) {
			this._array.set(t, 1);
			this._list.push(t);
			return true
		}
		return false
	};
	ru.prototype.addMultiple = function e(t) {
		var r = this;
		for (var n = 0; n < t.length; ++n) {
			var i = t[n];
			if (!r._array.get(i)) {
				r._array.set(i, 1);
				r._list.push(i)
			}
		}
	};
	ru.prototype.addMultipleAndRetrieveDifference = function e(t) {
		var r = this;
		var n = new Array(t.length),
			i = 0;
		for (var o = 0; o < t.length; ++o) {
			var s = t[o];
			if (!r._array.get(s)) {
				r._array.set(s, 1);
				r._list.push(s);
				n[i] = s;
				i += 1
			}
		}
		n.length = i;
		return n
	};
	ru.prototype.has = function e(t) {
		return !!this._array.get(t)
	};
	ru.prototype.hasMultiple = function e(t) {
		var r = this;
		var n = new Array(t.length);
		for (var i = 0; i < t.length; ++i) {
			n[i] = !! r._array.get(t[i])
		}
		return n
	};
	ru.prototype.getList = function e() {
		return this._list.slice()
	};
	ru.prototype.getInvertedList = function e() {
		var t = this;
		var r = [],
			n = this._graph._allIndexes(this._isNode);
		for (var i = 0; i < n.length; ++i) {
			var o = n[i];
			if (!t.has(o)) {
				r.push(o)
			}
		}
		return r
	};
	ru.prototype.remove = function e(t) {
		if (this._array.get(t)) {
			this._array.set(t, 0);
			this._list.splice(this._list.indexOf(t), 1);
			return true
		}
		return false
	};
	ru.prototype.removeMultiple = function e(t) {
		var r = this;
		var n = t.length < 20;
		for (var i = 0; i < t.length; ++i) {
			var o = t[i];
			if (r._array.get(o)) {
				r._array.set(o, 0);
				if (n) {
					r._list.splice(r._list.indexOf(o), 1)
				}
			}
		}
		if (!n) {
			this._list = iu(this)
		}
	};
	ru.prototype.removeMultipleAndRetrieveDifference = function e(t) {
		var r = this;
		var n = t.length < 20,
			i = new Array(t.length),
			o = 0;
		for (var s = 0; s < t.length; ++s) {
			var a = t[s];
			if (r._array.get(a)) {
				r._array.set(a, 0);
				i[o] = a;
				o += 1;
				if (n) {
					r._list.splice(r._list.indexOf(a), 1)
				}
			}
		}
		if (!n) {
			this._list = iu(this)
		}
		i.length = o;
		return i
	};
	ru.prototype.clear = function e() {
		var t = this._list;
		if (t.length !== 0) {
			this._array.reset()
		}
		this._list = [];
		return t
	};
	nu.list.get = function() {
		return this._list
	};
	nu.size.get = function() {
		return this._list.length
	};
	Object.defineProperties(ru.prototype, nu);

	function iu(e) {
		var t = [],
			r = e._graph._allIndexes(e._isNode);
		for (var n = 0; n < r.length; ++n) {
			var i = r[n];
			if (e._array.get(i)) {
				t.push(i)
			}
		}
		return t
	}
	var ou = function e(t) {
			this._NodeList = t.NodeList;
			this._EdgeList = t.EdgeList;
			this._nodeSet = t.modules.graph._createIndexSet(true);
			this._edgeSet = t.modules.graph._createIndexSet(false)
		};
	ou.prototype.addElements = function e(t) {
		var r = t.isNode;
		var n = t._indexes;
		return new this[r ? "_NodeList" : "_EdgeList"](this[r ? "_nodeSet" : "_edgeSet"].addMultipleAndRetrieveDifference(n))
	};
	ou.prototype.removeElements = function e(t) {
		var r = t.isNode;
		var n = t._indexes;
		return new this[r ? "_NodeList" : "_EdgeList"](this[r ? "_nodeSet" : "_edgeSet"].removeMultipleAndRetrieveDifference(n))
	};
	ou.prototype.getNodes = function e() {
		return new this._NodeList(this._nodeSet.getList())
	};
	ou.prototype.getEdges = function e() {
		return new this._EdgeList(this._edgeSet.getList())
	};
	ou.prototype.clearNodes = function e() {
		return new this._NodeList(this._nodeSet.clear())
	};
	ou.prototype.clearEdges = function e() {
		return new this._EdgeList(this._edgeSet.clear())
	};
	ou.prototype.hasNodes = function e(t) {
		return this._nodeSet.hasMultiple(t._indexes)
	};
	ou.prototype.hasEdges = function e(t) {
		return this._edgeSet.hasMultiple(t._indexes)
	};
	var su = function e(t, r, n, i) {
			this._graph = t;
			this._isNode = r;
			this._id = n;
			this._deleted = false;
			this._whenApplied = i
		};
	su.prototype._checkDeleted = function e() {
		if (this._deleted) {
			throw new Error("the filter is deleted")
		}
	};
	su.prototype.whenApplied = function e(t) {
		this._checkDeleted();
		return this._whenApplied.then(t)
	};
	su.prototype.delete = function e() {
		this._checkDeleted();
		return this._graph._removeFilterRule(this._isNode, this._id)
	};
	su.prototype.refresh = function e() {
		this._checkDeleted();
		return this._graph._refreshFilterRules(this._isNode)
	};
	g.atInit(function(e, t) {
		var r = t.graph;
		if (r) {
			var n = r.nodes;
			var i = r.edges;
			if (n) {
				e.addNodes(n)
			}
			if (i) {
				e.addEdges(i)
			}
		}
	});
	g.extend(function(e) {
		var t = new uu(e);
		var r = t.Node;
		var n = t.Edge;
		var i = t.NodeList;
		var o = t.EdgeList;
		e.modules.graph = t;
		e.Node = r;
		e.Edge = n;
		e.NodeList = i;
		e.EdgeList = o;
		e.events.onNodesAdded = function(t) {
			e.modules.events.on("addNodes", t);
			return e.events
		};
		e.events.onBeforeNodesRemoved = function(t) {
			e.modules.events.on("beforeRemoveNodes", t);
			return e
		};
		e.events.onNodesRemoved = function(t) {
			e.modules.events.on("removeNodes", t);
			return e.events
		};
		e.events.onEdgesAdded = function(t) {
			e.modules.events.on("addEdges", t);
			return e.events
		};
		e.events.onBeforeEdgesRemoved = function(t) {
			e.modules.events.on("beforeRemoveEdges", t);
			return e
		};
		e.events.onEdgesRemoved = function(t) {
			e.modules.events.on("removeEdges", t);
			return e.events
		};
		e.addNodes = function(t, r) {
			if (r === void 0) r = {};
			return au(e, "addNodes", t, r.batchSize)
		};
		e.addEdges = function(t, r) {
			if (r === void 0) r = {};
			return au(e, "addEdges", t, r.batchSize)
		};
		e.addNode = function(e) {
			return t.addNode(e)
		};
		e.addEdge = function(e) {
			return t.addEdge(e)
		};
		e.removeNodes = function(e) {
			return t.removeNodes(e)
		};
		e.removeEdges = function(e) {
			return t.removeEdges(e)
		};
		e.removeNode = function(e) {
			return t.removeNodes(e)
		};
		e.removeEdge = function(e) {
			return t.removeEdges(e)
		};
		e.getNodes = function(e) {
			return t.getNodes(e)
		};
		e.getEdges = function(e) {
			return t.getEdges(e)
		};
		e.getNode = function(e) {
			return t.getNode(e)
		};
		e.getEdge = function(e) {
			return t.getEdge(e)
		};
		e.clearGraph = function() {
			return t.clear()
		};
		e.setGraph = function(r, n) {
			if (r === void 0) r = {};
			if (n === void 0) n = {};
			var i = r.nodes || [],
				o = r.edges || [];
			t.clear();
			if (!n.batchSize) {
				var s = t.addNodes(i),
					a = t.addEdges(o);
				return Promise.resolve({
					nodes: s,
					edges: a
				})
			} else {
				return new Promise(function(t) {
					e.addNodes(i, n).then(function(r) {
						e.addEdges(o, n).then(function(e) {
							t({
								nodes: r,
								edges: e
							})
						})
					})
				})
			}
		};
		e.addGraph = function(t, r) {
			if (t === void 0) t = {};
			if (r === void 0) r = {};
			var n = t.nodes || [],
				i = t.edges || [];
			return new Promise(function(t) {
				e.addNodes(n, r).then(function(n) {
					e.addEdges(i, r).then(function(e) {
						t({
							nodes: n,
							edges: e
						})
					})
				})
			})
		};
		r.prototype.getAdjacentNodes = function(e) {
			return t.getAdjacentNodes(this, e)
		};
		i.prototype.getAdjacentNodes = function(e) {
			return t.getAdjacentNodes(this, e)
		};
		r.prototype.getAdjacentEdges = function(e) {
			return t.getAdjacentEdges(this, e)
		};
		i.prototype.getAdjacentEdges = function(e) {
			return t.getAdjacentEdges(this, e)
		};
		r.prototype.getDegree = function(e) {
			return t.degree(this, e)
		};
		i.prototype.getDegree = function(e) {
			var r = this;
			var n = new Array(this._indexes.length);
			for (var i = 0; i < this._indexes.length; ++i) {
				n[i] = t._degree(r._indexes[i], e)
			}
			return n
		};
		e.addNodeFilter = function(e) {
			return t.addNodeFilterRule(e)
		};
		e.addEdgeFilter = function(e) {
			return t.addEdgeFilterRule(e)
		};
		e.getNodeFilters = function() {
			return t.getNodeFilters()
		};
		e.getEdgeFilters = function() {
			return t.getEdgeFilters()
		};
		e.getConnectedComponents = function() {
			var e = t.getConnectedComponents(true, true);
			return e.map(function(e) {
				return t._getElements(true, e)
			})
		};
		e.getConnectedComponentByNode = function(e) {
			return t._getElements(true, t.getConnectedComponentByNode(e, true, true))
		};
		r.prototype.isExcluded = function() {
			return t.isNodeExcluded(this)
		};
		n.prototype.isExcluded = function() {
			return t.isEdgeExcluded(this)
		}
	});

	function au(e, t, r, n) {
		var i = e.modules.graph,
			o = e.modules.render;
		if (!n) {
			return Promise.resolve(i[t](r))
		} else {
			return new Promise(function(e) {
				var s = 0,
					a = n,
					u = r.length,
					l = [];
				var d = function() {
						if (s < u) {
							l.push.apply(l, i[t](r.slice(s, a)));
							s = a;
							a += n;
							o.atNextFrame(d)
						} else {
							e(l)
						}
					}
			})
		}
	}
	var uu = function e(t) {
			var r = this;
			this._ogma = t;
			this._events = t.modules.events;
			this._elts = We(new an(true), new an(false));
			this._sets = We([], []);
			this._buffer = [];
			this._events.register(["addNodes", "addEdges", "updateDirections", "refreshNodeFilters", "refreshEdgeFilters"], ["clear", "beforeRemoveNodes", "removeNodes", "beforeRemoveEdges", "removeEdges"]);
			this._promisesToResolve = [];
			this._init_();
			this._sourceList = this.createEdgeAttribute({
				name: "source",
				storage: 32
			});
			this._targetList = this.createEdgeAttribute({
				name: "target",
				storage: 32
			});
			this._nodeDeduper = this.createNodeAttribute({
				storage: 1
			});
			this._edgeDeduper = this.createEdgeAttribute({
				storage: 1
			});
			this._directionUpdated = [];
			this.Node = function e(t) {
				this._index = t
			};
			Object.defineProperty(this.Node.prototype, "_ogma", {
				value: t
			});
			Object.defineProperty(this.Node.prototype, "isNode", {
				value: true
			});
			Object.defineProperty(this.Node.prototype, "size", {
				value: 1
			});
			Object.defineProperty(this.Node.prototype, "__indexes", {
				value: [0]
			});
			Object.defineProperty(this.Node.prototype, "_indexes", {
				get: function() {
					this.__indexes[0] = this._index;
					return this.__indexes
				}
			});
			this.Edge = function e(t) {
				this._index = t
			};
			Object.defineProperty(this.Edge.prototype, "_ogma", {
				value: t
			});
			Object.defineProperty(this.Edge.prototype, "isNode", {
				value: false
			});
			Object.defineProperty(this.Edge.prototype, "size", {
				value: 1
			});
			Object.defineProperty(this.Edge.prototype, "__indexes", {
				value: [0]
			});
			Object.defineProperty(this.Edge.prototype, "_indexes", {
				get: function() {
					this.__indexes[0] = this._index;
					return this.__indexes
				}
			});
			this.NodeList = function e(t) {
				this._indexes = t || []
			};
			Object.defineProperty(this.NodeList.prototype, "_ogma", {
				value: t
			});
			Object.defineProperty(this.NodeList.prototype, "size", {
				get: function() {
					return this._indexes.length
				}
			});
			Object.defineProperty(this.NodeList.prototype, "isNode", {
				value: true
			});
			this.EdgeList = function e(t) {
				this._indexes = t || []
			};
			Object.defineProperty(this.EdgeList.prototype, "_ogma", {
				value: t
			});
			Object.defineProperty(this.EdgeList.prototype, "size", {
				get: function() {
					return this._indexes.length
				}
			});
			Object.defineProperty(this.EdgeList.prototype, "isNode", {
				value: false
			});
			this._nodeFilterRules = [];
			this._edgeFilterRules = [];
			this._nodes = this.createAttribute(true, {
				name: "object",
				storage: "any"
			});
			this._edges = this.createAttribute(false, {
				name: "object",
				storage: "any"
			});
			this._filters = We(new tu(t, this, true), new tu(t, this, false));
			this._promisesToResolve = [];
			this._filterUpdater = new cn(this, function(e) {
				var t = e.nodes;
				var n = e.edges;
				var i = r._filters.nodes.refreshFilters(t),
					o = r._filters.edges.refreshFilters(n);
				if (i.newlyIncluded.length || i.newlyExcluded.length) {
					r._events.fire("refreshNodeFilters", {
						isNode: true,
						newlyIncluded: new r.NodeList(i.newlyIncluded),
						newlyExcluded: new r.NodeList(i.newlyExcluded)
					})
				}
				if (o.newlyIncluded.length || o.newlyExcluded.length) {
					r._events.fire("refreshEdgeFilters", {
						isNode: false,
						newlyIncluded: new r.EdgeList(o.newlyIncluded),
						newlyExcluded: new r.EdgeList(o.newlyExcluded)
					})
				}
				r._resolvePromises()
			});
			this._events.on("reset", function() {
				r.clear();
				r.clearNodeFilterRules();
				r.clearEdgeFilterRules()
			})
		};
	uu.prototype._resolvePromises = function e() {
		var t = this._promisesToResolve;
		this._promisesToResolve = [];
		t.forEach(function(e) {
			return e()
		})
	};
	uu.prototype._init_ = function e() {
		this._nodeList = [];
		this._edgeList = [];
		this._neighborTable = new fn;
		this._parallelTable = new fn;
		this._parallelEdgesIndex = [];
		this._resolvePromises()
	};
	uu.prototype._triggerDirectionUpdate_ = function e() {
		this._events.fire("updateDirections", {
			directions: this._directionUpdated
		});
		this._directionUpdated = []
	};
	uu.prototype.isNodeExcluded = function e(t) {
		return this._isExcluded(true, t._index)
	};
	uu.prototype.isEdgeExcluded = function e(t) {
		return this._isExcluded(false, t._index)
	};
	uu.prototype._isExcluded = function e(t, r) {
		return this._filters.fetch(t).isExcluded(r)
	};
	uu.prototype._addFilter = function e(t) {
		return this._filters.fetch(t).addFilter()
	};
	uu.prototype._removeFilter = function e(t, r) {
		return this._filters.fetch(t).removeFilter(r)
	};
	uu.prototype.addNodeFilterRule = function e(t) {
		return this._addFilterRule(true, t)
	};
	uu.prototype.addEdgeFilterRule = function e(t) {
		return this._addFilterRule(false, t)
	};
	uu.prototype._addFilterRule = function e(t, r) {
		var n = this;
		var i = this._filters.fetch(t).addRule(r),
			o = new Promise(function(e) {
				return n._promisesToResolve.push(e)
			}),
			s = new su(this, t, i, o);
		this[t ? "_nodeFilterRules" : "_edgeFilterRules"].push(s);
		this._filterUpdater.updateAll();
		return s
	};
	uu.prototype._removeFilterRule = function e(t, r) {
		var n = this;
		this._filters.fetch(t).removeRule(r);
		this._filterUpdater.updateAll();
		var i = this[t ? "_nodeFilterRules" : "_edgeFilterRules"];
		for (var o = 0; o < i.length; ++o) {
			if (i[o]._id === r) {
				i.splice(o, 1)
			}
		}
		return new Promise(function(e) {
			n._promisesToResolve.push(e)
		})
	};
	uu.prototype.getNodeFilters = function e() {
		return this._nodeFilterRules.slice()
	};
	uu.prototype.getEdgeFilters = function e() {
		return this._edgeFilterRules.slice()
	};
	uu.prototype.clearNodeFilterRules = function e() {
		return this._clearFilterRules(true)
	};
	uu.prototype.clearEdgeFilterRules = function e() {
		return this._clearFilterRules(false)
	};
	uu.prototype._clearFilterRules = function e(t) {
		var r = this;
		this._filters.fetch(t).clearRules();
		this._filterUpdater.updateAll();
		return new Promise(function(e) {
			r._promisesToResolve.push(e)
		})
	};
	uu.prototype._refreshFilterRules = function e(t, r) {
		var n = this;
		this._filters.fetch(t).refreshRules(r);
		this._filterUpdater.updateAll();
		return new Promise(function(e) {
			n._promisesToResolve.push(e)
		})
	};
	uu.prototype._refreshFilters = function e(t, r) {
		if (!r) {
			this._filterUpdater.updateAll()
		} else if (t) {
			this._filterUpdater.updateNodes(r)
		} else {
			this._filterUpdater.updateEdges(r)
		}
	};
	uu.prototype.addNode = function e(t) {
		console.log("addNode")
		console.log(t)
		return this._getElement(true, this._addElements(true, [t])[0])
	};
	uu.prototype.addEdge = function e(t) {
		return this._getElement(false, this._addElements(false, [t])[0])
	};
	uu.prototype.addNodes = function e(t) {
		return this._getElements(true, this._addElements(true, t))
	};
	uu.prototype.addEdges = function e(t) {
		return this._getElements(false, this._addElements(false, t))
	};
	uu.prototype._addElements = function e(t, r) {
		console.log("add element")
		console.log(t)
		console.log(r)
		console.log(this)
		return cu(this, t, r)
	};
	uu.prototype.removeNodes = function e(t) {
		if (t === undefined) {
			throw new Error(t + " is not a valid argument")
		}
		this._removeElements(true, this.filterIndexes(true, this._getIndexes(true, t)))
	};
	uu.prototype.removeEdges = function e(t) {
		if (t === undefined) {
			throw new Error(t + " is not a valid argument")
		}
		this._removeElements(false, this.filterIndexes(false, this._getIndexes(false, t)))
	};
	uu.prototype._removeElements = function e(t, r) {
		gu(this, t, r)
	};
	uu.prototype.getNodes = function e(t) {
		var r = lu(t);
		var n = r.ids;
		var i = r.filter;
		var o = r.criteria;
		var s = this._getIndexes(true, n);
		this._filter(true, s, i);
		if (o) {
			this._filterWithCriteria(true, s, o)
		}
		return this._getElements(true, s)
	};
	uu.prototype.getEdges = function e(t) {
		var r = lu(t);
		var n = r.ids;
		var i = r.filter;
		var o = r.criteria;
		var s = this._getIndexes(false, n);
		this._filter(false, s, i);
		if (o) {
			this._filterWithCriteria(false, s, o)
		}
		return this._getElements(false, s)
	};
	uu.prototype._getElements = function e(t, r) {
		if (arguments.length < 2) {
			throw new Error("_getElement: invalid number of parameters")
		}
		return new this[t ? "NodeList" : "EdgeList"](r)
	};
	uu.prototype.getNode = function e(t) {
		return this._getElement(true, this._getIndex(true, t))
	};
	uu.prototype.getEdge = function e(t) {
		return this._getElement(false, this._getIndex(false, t))
	};
	uu.prototype._getElement = function e(t, r) {
		if (arguments.length < 2) {
			throw new Error("_getElement: invalid number of parameters")
		}
		if (!r) {
			return undefined
		}
		return this[t ? "_nodes" : "_edges"].get(r)
	};
	uu.prototype.getRaw = function e() {
		var t = "raw";
		return {
			nodes: this.getNodes(t).toArray(),
			edges: this.getEdges(t).toArray()
		}
	};
	uu.prototype.getVisible = function e() {
		var t = "visible";
		return {
			nodes: this.getNodes(t).toArray(),
			edges: this.getEdges(t).toArray()
		}
	};
	uu.prototype.clear = function e() {
		this._events.fire("clear");
		this._sets.nodes.forEach(function(e) {
			return e.clear()
		});
		this._sets.edges.forEach(function(e) {
			return e.clear()
		});
		this._elts.nodes.clear();
		this._elts.edges.clear();
		this._init_()
	};
	uu.prototype.forEachNode = function e(t, r) {
		this._forEachElements(true, t._indexes, r)
	};
	uu.prototype.forEachEdge = function e(t, r) {
		this._forEachElements(false, t._indexes, r)
	};
	uu.prototype._forEachElements = function e(t, r, n) {
		var i = this;
		for (var o = 0; o < r.length; ++o) {
			n(i._getElement(t, r[o]), o)
		}
	};
	uu.prototype.mapNodes = function e(t, r) {
		return this._mapElements(true, t._indexes, r)
	};
	uu.prototype.mapEdges = function e(t, r) {
		return this._mapElements(false, t._indexes, r)
	};
	uu.prototype._mapElements = function e(t, r, n) {
		var i = this;
		var o = new Array(r.length);
		for (var s = 0; s < r.length; ++s) {
			o[s] = n(i._getElement(t, r[s]), s)
		}
		return o
	};
	uu.prototype.filterNodes = function e(t, r) {
		return this._filterElements(true, t._indexes, r)
	};
	uu.prototype.filterEdges = function e(t, r) {
		return this._filterElements(false, t._indexes, r)
	};
	uu.prototype._filterElements = function e(t, r, n) {
		var i = this;
		var o = [];
		for (var s = 0; s < r.length; ++s) {
			var a = r[s];
			if (n(i._getElement(t, a), s)) {
				o.push(a)
			}
		}
		return this._getElements(t, o)
	};
	uu.prototype.reduceNodes = function e(t, r, n) {
		return this._reduceElements(true, t._indexes, r, n)
	};
	uu.prototype.reduceEdges = function e(t, r, n) {
		return this._reduceElements(false, t._indexes, r, n)
	};
	uu.prototype._reduceElements = function e(t, r, n, i) {
		var o = this;
		var s = i;
		for (var a = 0; a < r.length; ++a) {
			var u = r[a],
				l = o._getElement(t, u);
			s = n(s, l, a)
		}
		return s
	};
	uu.prototype.dedupeNodes = function e(t) {
		return this._getElements(true, this._dedupe(true, t._indexes.slice()))
	};
	uu.prototype.dedupeEdges = function e(t) {
		return this._getElements(false, this._dedupe(false, t._indexes.slice()))
	};
	uu.prototype._dedupe = function e(t, r) {
		var n = this[t ? "_nodeDeduper" : "_edgeDeduper"],
			i = 0;
		n.reset();
		for (var o = 0; o < r.length; ++o) {
			var s = r[o];
			if (n.get(s) === 0) {
				n.set(s, 1);
				r[i] = s;
				i += 1
			}
		}
		r.length = i;
		return r
	};
	uu.prototype.inverse = function e(t) {
		var r = t.isNode,
			n = t._indexes,
			i = this[r ? "_nodeDeduper" : "_edgeDeduper"],
			o = this._elts.fetch(r).getFlexArray("excluded"),
			s = this._allIndexes(r),
			a = [];
		i.reset();
		for (var u = 0, l = n.length; u < l; ++u) {
			var d = n[u];
			i.set(d, 1)
		}
		for (var f = 0, h = s.length; f < h; ++f) {
			var c = s[f];
			if (i.get(c) === 0 && o.get(c) === 0) {
				a.push(c)
			}
		}
		return this._getElements(r, a)
	};
	uu.prototype.partitionNodes = function e(t, r) {
		return this._partition(true, t._indexes, r)
	};
	uu.prototype.partitionEdges = function e(t, r) {
		return this._partition(false, t._indexes, r)
	};
	uu.prototype._partition = function e(t, r, n) {
		var i = this;
		var o = {};
		for (var s = 0; s < r.length; ++s) {
			var a = r[s],
				u = i._getElement(t, a),
				l = n(u, s),
				d = o[l];
			if (!d) {
				d = new i.NodeList;
				o[l] = d
			}
			d._indexes.push(a)
		}
		return o
	};
	uu.prototype.concatNodes = function e(t, r) {
		return this._getElements(true, t._indexes.concat(r._indexes))
	};
	uu.prototype.concatEdges = function e(t, r) {
		return this._getElements(false, t._indexes.concat(r._indexes))
	};
	uu.prototype.createAttribute = function e(t, r) {
		return this._elts.fetch(t).createFlexArray(r)
	};
	uu.prototype.createNodeAttribute = function e(t) {
		return this.createAttribute(true, t)
	};
	uu.prototype.createEdgeAttribute = function e(t) {
		return this.createAttribute(false, t)
	};
	uu.prototype.createAttributes = function e(t) {
		var r = this;
		t.forEach(function(e) {
			if (e.
			for ==="nodes" || e.
			for ==="both") {
				r.createNodeAttribute(e)
			}
			if (e.
			for ==="edges" || e.
			for ==="both") {
				r.createEdgeAttribute(e)
			}
		})
	};
	uu.prototype._removeAttribute = function e(t, r) {
		this._elts.fetch(t).removeFlexArray(r)
	};
	uu.prototype.getAttribute = function e(t, r) {
		return this._elts.fetch(t).getFlexArray(r)
	};
	uu.prototype.getAttributes = function e(t, r) {
		var n = this;
		return r.map(function(e) {
			return n.getAttribute(t, e)
		})
	};
	uu.prototype.getNodeAttribute = function e(t) {
		return this.getAttribute(true, t)
	};
	uu.prototype.getEdgeAttribute = function e(t) {
		return this.getAttribute(false, t)
	};
	uu.prototype._getIndexes = function e(t, r, n) {
		if (n === void 0) n = false;
		if (typeof t !== "boolean") {
			throw new TypeError('"isNode" should be a boolean')
		}
		var i = this[t ? "Node" : "Edge"],
			o = this[t ? "NodeList" : "EdgeList"],
			s = this._elts.fetch(t),
			a;
		if (r === undefined) {
			a = s.allIndexes().slice()
		} else if (r instanceof o || r instanceof i) {
			a = r._indexes.slice()
		} else {
			a = [];
			if (Ke(r)) {
				for (var u = 0; u < r.length; ++u) {
					var l = r[u];
					if (l instanceof i) {
						a.push(l._index)
					} else {
						var d = s.getIndex(l, n);
						if (d) {
							a.push(d)
						}
					}
				}
			} else {
				var f = s.getIndex(r, n);
				if (f) {
					a.push(f)
				}
			}
		}
		return a
	};
	uu.prototype._allIndexes = function e(t) {
		return this._elts.fetch(t).allIndexes()
	};
	uu.prototype._getIndex = function e(t, r, n) {
		var i = this[t ? "Node" : "Edge"];
		if (r instanceof i) {
			return r._index
		} else {
			return this._elts.fetch(t).getIndex(r, n)
		}
	};
	uu.prototype.getNodeIndex = function e(t) {
		return this._elts.nodes.getIndex(t)
	};
	uu.prototype.getEdgeIndex = function e(t) {
		return this._elts.edges.getIndex(t)
	};
	uu.prototype.nodeIndexList = function e(t) {
		return this._getIndexes(true, t)
	};
	uu.prototype.edgeIndexList = function e(t) {
		return this._getIndexes(false, t)
	};
	uu.prototype.getAttributesArrays = function e(t, r, n) {
		if (n === void 0) n = {};
		var i = n.destArrays;
		var o = n.ids;
		if (!r) {
			throw new Error("You must provide array of attributes to retrieve the values")
		}
		if (!o) {
			o = this._elts[t ? "nodes" : "edges"].getAllIndexes()
		}
		return this.getAttributes(t, r).map(function(e, t) {
			return e.getMultiple(o, i ? i[t] : undefined)
		})
	};
	uu.prototype.getNodeAttributesArrays = function e(t, r) {
		return this.getAttributesArrays(true, t, r)
	};
	uu.prototype.getEdgeAttributesArrays = function e(t, r) {
		return this.getAttributesArrays(false, t, r)
	};
	uu.prototype._getId = function e(t, r) {
		return this._elts.fetch(t).getId(r)
	};
	uu.prototype._getIds = function e(t, r, n) {
		return this._elts.fetch(t).getIdList(r, n)
	};
	uu.prototype._getSource = function e(t) {
		return this._sourceList.get(t)
	};
	uu.prototype._getSources = function e(t, r) {
		return this._sourceList.getMultiple(t, r)
	};
	uu.prototype._getTarget = function e(t) {
		return this._targetList.get(t)
	};
	uu.prototype._getTargets = function e(t, r) {
		return this._targetList.getMultiple(t, r)
	};
	uu.prototype._setExtremities = function e(t, r, n) {
		var i = this;
		for (var o = 0; o < t.length; ++o) {
			vu(i, t[o])
		}
		if (r) {
			this._sourceList.setMultiple(t, r)
		}
		if (n) {
			this._targetList.setMultiple(t, n)
		}
		for (var s = 0; s < t.length; ++s) {
			pu(i, t[s])
		}
		this._triggerDirectionUpdate_()
	};
	uu.prototype.setSource = function e(t, r) {
		var n = this._getIndexes(false, t),
			i = Array.isArray(r) ? this._getIndexes(true, r) : this._getIndex(true, r);
		this._setExtremities(n, i, undefined)
	};
	uu.prototype.setTarget = function e(t, r) {
		var n = this._getIndexes(false, t),
			i = Array.isArray(r) ? this._getIndexes(true, r) : this._getIndex(true, r);
		this._setExtremities(n, undefined, i)
	};
	uu.prototype.getParallelIndexes = function e(t, r) {
		var n = this._parallelTable.get(+t);
		if (!r) {
			r = new Array(n.length)
		}
		for (var i = 0; i < n.length; ++i) {
			r[i] = n[i]
		}
		return r
	};
	uu.prototype.getEdgeDirection = function e(t) {
		var r = _u(this._sourceList.get(t), this._targetList.get(t));
		return this._parallelEdgesIndex[r]
	};
	uu.prototype._getAllEdgeDirections = function e() {
		var t = this;
		var r = [],
			n = Object.keys(this._parallelEdgesIndex);
		for (var i = 0; i < n.length; ++i) {
			r.push(t._parallelEdgesIndex[n[i]])
		}
		return r
	};
	uu.prototype._filter = function e(t, r, n) {
		if (n === "all") {
			return r
		}
		var i = undefined,
			o = 0;
		if (n === "raw") {
			i = this._elts.fetch(t).getFlexArray("virtual")
		} else {
			i = this._elts.fetch(t).getFlexArray("excluded")
		}
		for (var s = 0; s < r.length; ++s) {
			var a = r[s];
			if (i.get(a) === 0) {
				r[o] = a;
				o += 1
			}
		}
		r.length = o;
		return r
	};
	uu.prototype._filterWithCriteria = function e(t, r, n) {
		var i = this;
		var o = 0;
		for (var s = 0; s < r.length; ++s) {
			var a = r[s];
			if (n(i._getElement(t, a))) {
				r[o] = a;
				o += 1
			}
		}
		r.length = o;
		return r
	};
	uu.prototype._collectAdjacentEdges = function e(t, r) {
		var n = this;
		var i = r === "out",
			o = r === "in",
			s = !(i || o),
			a = [];
		for (var u = 0; u < t.length; ++u) {
			var l = t[u],
				d = n._neighborTable.get(l);
			for (var f = 0; f < d.length; ++f) {
				var h = n._parallelTable.get(d[f]);
				if (s) {
					a.push.apply(a, h)
				} else {
					for (var c = 0; c < h.length; ++c) {
						var p = h[c],
							g = n._sourceList.get(p),
							v = n._targetList.get(p),
							y = v === l;
						if (o === y || g === v) {
							a.push(p)
						}
					}
				}
			}
		}
		return a
	};
	uu.prototype._collectAdjacentNodes = function e(t, r) {
		var n = this;
		if (!Ke(t)) {
			t = [t]
		}
		var i = r === "out",
			o = r === "in",
			s = !(i || o),
			a = [];
		for (var u = 0; u < t.length; ++u) {
			var l = t[u],
				d = n._neighborTable.get(l);
			for (var f = 0; f < d.length; ++f) {
				var h = n._parallelTable.get(d[f]);
				for (var c = 0; c < h.length; ++c) {
					var p = h[c],
						g = n._sourceList.get(p),
						v = n._targetList.get(p);
					if (g !== v && (s || o && l === v || i && l === g)) {
						a.push(g + v - l);
						break
					}
				}
			}
		}
		return a
	};
	uu.prototype.getAdjacentNodes = function e(t, r) {
		return this._getElements(true, this._getAdjacentElements(true, this._getIndexes(true, t), r))
	};
	uu.prototype.getAdjacentEdges = function e(t, r) {
		return this._getElements(false, this._getAdjacentElements(false, this._getIndexes(true, t), r))
	};
	uu.prototype._getAdjacentElements = function e(t, r, n) {
		var i = this;
		if (n === void 0) n = {};
		var o = n.direction;
		var s = n.filter;
		var a = n.includeSources;
		r = this._dedupe(true, r.slice());
		var u = this._collectAdjacentEdges(r, o);
		this._filter(false, u, s);
		if (!t) {
			this._dedupe(false, u);
			return u
		} else {
			var l = [];
			for (var d = 0; d < u.length; ++d) {
				var f = u[d],
					h = i._sourceList.get(f),
					c = i._targetList.get(f);
				l.push(h, c)
			}
			this._dedupe(true, l);
			this._filter(true, l, s);
			var p = l.length;
			for (var g = 0; g < r.length; ++g) {
				var v = l.indexOf(r[g]);
				if (v !== -1) {
					p -= 1;
					l[v] = l[p]
				}
			}
			l.length = p;
			if (a) {
				l.unshift.apply(l, r)
			}
			return l
		}
	};
	uu.prototype.degree = function e(t, r) {
		return this._degree(this._getIndex(true, t), r)
	};
	uu.prototype._degree = function e(t, r) {
		if (r !== "in" && r !== "out") {
			return this._neighborTable.size(t)
		} else {
			return yu(this, t, r === "in")
		}
	};
	uu.prototype._degrees = function e(t, r) {
		var n = this;
		if (r !== "in" && r !== "out") {
			return this._neighborTable.sizes(t)
		} else {
			var i = new Array(t.length);
			var o = r === "in";
			for (var s = 0, a = t.length; s < a; s++) {
				i[s] = yu(n, t[s], o)
			}
			return i
		}
	};
	uu.prototype._createIndexSet = function e(t) {
		var r = new ru(this, t);
		this._sets.fetch(t).push(r);
		return r
	};
	uu.prototype.createSet = function e() {
		return new ou(this._ogma)
	};
	uu.prototype.getAdjacencyTable = function e(t, r, n, i) {
		return this._getAdjacencyTable(t, r, n, this._getIndexes(true, i))
	};
	uu.prototype._getAdjacencyTable = function e(t, r, n, i) {
		return xu(this, !t, !r, n, i)
	};
	uu.prototype.getConnectedComponents = function e(t, r) {
		return mu(this, t, -1, !r)
	};
	uu.prototype.getComponentByNode = function e(t, r, n) {
		if (t === undefined) {
			throw new Error("topology.getComponentByNode: Node has to be defined")
		}
		var i = t.id === undefined ? t : t.id;
		t = this.getNode(i);
		if (!t) {
			throw new Error('topology.getComponentByNode: Cannot find node "' + i + '"')
		}
		return mu(this, r, t.__index, !n)
	};
	uu.prototype.getConnectedComponentByNode = function e(t, r, n) {
		if (t === undefined) {
			throw new Error("topology.getConnectedComponentByNode: Node has to be defined")
		}
		var i = t.id === undefined ? t : t.id;
		t = this.getNode(i);
		if (!t) {
			throw new Error('topology.getConnectedComponentByNode: Cannot find node "' + i + '"')
		}
		return mu(this, r, t._index, !n)
	};
	uu.prototype.filterIndexes = function e(t, r) {
		var n = this._elts.fetch(t),
			i = this._buffer,
			o = null;
		for (var s = 0; s < r.length; ++s) {
			var a = r[s];
			if (n.has(a) && !i[a]) {
				i[a] = 1;
				if (o) {
					o.push(a)
				}
			} else {
				if (!o) {
					o = r.slice(0, s)
				}
			}
		}
		i.length = 0;
		return o || r
	};
	uu.prototype.generateUnusedNodeId = function e() {
		return du(this, true)
	};
	uu.prototype.generateUnusedEdgeId = function e() {
		return du(this, false)
	};
	uu.prototype._generateUnusedId = function e(t) {
		return du(this, t)
	};

	function lu(e) {
		if (e === null || e === undefined) {
			return {}
		} else if (Ke(e)) {
			return {
				ids: e,
				filter: "all"
			}
		} else if (typeof e === "function") {
			return {
				criteria: e
			}
		} else if (typeof e === "string") {
			return {
				filter: e
			}
		} else {
			return e
		}
	}
	function du(e, t) {
		var r = e._elts.fetch(t),
			n = null;
		do {
			n = Math.random().toString().slice(2)
		} while (r.hasId(n));
		return n
	}
	function fu(e) {
		if (e === undefined) {
			return "gen_" + Math.random().toString().slice(2) + "_"
		} else if (typeof e !== "string" && (typeof e !== "number" || !isFinite(e))) {
			throw new Error(e + " is not a valid id, expected string or number")
		}
		return e
	}
	function hu(e, t) {
		if (t instanceof e.Node) {
			return t._index
		} else {
			return e._elts.nodes.getIndex(t, true)
		}
	}
	function cu(e, t, r) {
		if (!Ke(r)) {
			throw new TypeError(r + " is not an array")
		}
		var n = e._elts.fetch(t),
			i = [],
			o = [],
			s = r.length,
			a = [],
			u = [],
			l = {};
		for (var d = 0; d < s; ++d) {
			var f = r[d];
			if (typeof f !== "object" || f === null) {
				throw new Error(f + " is not a valid " + (t ? "node" : "edge"))
			}
			var h = fu(f.id);
			if (!n.getIndex(h, false) && !(h in l)) {
				o.push(h);
				i.push(f);
				l[h] = 1;
				if (!t) {
					a.push(hu(e, f.source));
					u.push(hu(e, f.target))
				}
			}
		}
		var c = n.addElements(o),
			p = c.length;
		if (t) {
			e._neighborTable.reserve(c.length);
			for (var g = 0; g < p; ++g) {
				e._neighborTable.addEntry(c[g])
			}
		} else {
			e._parallelTable.reserve(c.length / 2 | 0);
			for (var v = 0; v < p; ++v) {
				var y = c[v],
					_ = a[v],
					m = u[v];
				e._sourceList.set(y, _);
				e._targetList.set(y, m);
				pu(e, y)
			}
			e._triggerDirectionUpdate_()
		}
		var x = e[t ? "_nodes" : "_edges"],
			b = e[t ? "Node" : "Edge"];
		for (var A = 0; A < p; ++A) {
			var w = c[A];
			x.set(w, new b(w))
		}
		var E = {
			objects: i
		};
		E[t ? "nodes" : "edges"] = e._getElements(t, c);
		e._events.fire(t ? "addNodes" : "addEdges", E);
		e._filters.fetch(t).refreshRules(c);
		e._filters.fetch(t).refreshFilters(c);
		return c
	}
	function pu(e, t) {
		var r = e._sourceList.get(t),
			n = e._targetList.get(t),
			i = _u(r, n),
			o = e._parallelEdgesIndex[i];
		if (o === undefined) {
			o = e._parallelTable.addEntry();
			e._parallelEdgesIndex[i] = o;
			e._neighborTable.addTo(r, o);
			if (r !== n) {
				e._neighborTable.addTo(n, o)
			}
		}
		e._parallelTable.addTo(o, t);
		e._directionUpdated.push(o)
	}
	function gu(e, t, r) {
		if (!r.length) {
			return
		}
		if (t) {
			var n = e._collectAdjacentEdges(r);
			e._dedupe(false, n);
			gu(e, false, n)
		}
		var i = e._elts.fetch(t),
			o = e._sets.fetch(t),
			s = (a = {}, a[t ? "nodes" : "edges"] = e._getElements(t, r), a);
		var a;
		e._events.fire(t ? "beforeRemoveNodes" : "beforeRemoveEdges", s);
		for (var u = 0; u < o.length; ++u) {
			o[u].removeMultiple(r)
		}
		if (!t) {
			for (var l = 0, d = r.length; l < d; ++l) {
				vu(e, r[l])
			}
			e._triggerDirectionUpdate_()
		}
		i.removeElements(r);
		e._events.fire(t ? "removeNodes" : "removeEdges", s);
		return r
	}
	function vu(e, t) {
		var r = e._sourceList.get(t),
			n = e._targetList.get(t),
			i = _u(r, n),
			o = e._parallelEdgesIndex[i];
		if (e._parallelTable.removeFromAndGetSize(o, t) === 0) {
			e._neighborTable.removeFrom(r, o);
			if (r !== n) {
				e._neighborTable.removeFrom(n, o)
			}
			e._parallelEdgesIndex[i] = undefined
		}
		e._directionUpdated.push(o)
	}
	function yu(e, t, r) {
		var n = e._neighborTable.get(t),
			i = 0;
		for (var o = 0; o < n.length; ++o) {
			var s = e._parallelTable.get(n[o]);
			for (var a = 0; a < s.length; ++a) {
				var u = s[a],
					l = e._sourceList.get(u),
					d = e._targetList.get(u);
				if (r && d === t || !r && l === t) {
					i += 1;
					break
				}
			}
		}
		return i
	}
	function _u(e, t) {
		var r = e < t ? e : t,
			n = e + t - r;
		return r * 67108864 + n
	}
	function mu(e, t, r, n) {
		var i = e.getAdjacencyTable(true, true, null);
		var o = e;
		var s = o._getIndexes(true);
		var a = s.length;
		var u = {},
			l = {};
		var d = [],
			f;
		for (f = 0; f < a; f++) {
			l[s[f]] = f
		}
		for (f = 0; f < a; f++) {
			var h = s[f];
			if (!u[h]) {
				var c = h;
				var p = [h];
				var g = [];
				var v = false;
				while (p.length !== 0) {
					c = p.pop();
					if (!u[c]) {
						p.push.apply(p, i[l[c]].nodes);
						u[c] = 1;
						g.push(c);
						if (c === r) {
							v = true
						}
					}
				}
				if (g.length > 0) {
					if (t) {
						if (n) {
							g = g.map(function(e) {
								return o._getId(true, e)
							})
						}
					} else {
						g = g.map(function(e) {
							return o._getElement(true, e)
						})
					}
					if (v) {
						return g
					}
					d.push(g)
				}
			}
		}
		return d
	}
	function xu(e, t, r, n, i) {
		var o = t ? "out" : "both";
		var s = i || e._getIndexes(true);
		var a = s.map(function(t) {
			return e._collectAdjacentEdges([t], o)
		});
		var u = e._nodeIdList;
		var l = e.getAttributes(false, ["source", "target", "width"]);
		var d = l[0];
		var f = l[1];
		var h = l[2];
		var c = new Array,
			p;
		var g = 1,
			v = false,
			y = false;
		if (typeof n === "number") {
			v = true;
			g = n
		} else if (typeof n === "function") {
			y = true
		} else if (typeof n !== "string") {
			n = n ? "size" : null
		}
		for (var _ = 0, m = a.length; _ < m; _++) {
			var x = a[_],
				b = s[_];
			var A = void 0,
				w = void 0,
				E = void 0,
				I = void 0;
			var S = x.length;
			var C = r ? new Array(S) : new Uint32Array(S);
			var T = new Array(S);
			for (var L = 0; L < S; L++) {
				A = x[L];
				w = d.get(A);
				E = f.get(A);
				I = t ? E : b === w ? E : w;
				if (r) {
					I = e._getId(true, I)
				}
				C[L] = I;
				if (n) {
					if (v) {
						T[L] = g
					} else if (y) {
						T[L] = n(u.get(w), u.get(E))
					} else {
						T[L] = h.get(A) || g
					}
				}
			}
			p = Object.create(null);
			p.nodes = C;
			p.id = r ? e._getId(true, b) : b;
			if (n) {
				p.weights = T
			}
			c.push(p)
		}
		return c
	}
	g.extend(function(e) {
		var t = e.modules.graph;
		var r = e.Node;
		var n = e.Edge;
		var i = e.NodeList;
		var o = e.EdgeList;
		r.prototype.toList = function() {
			return new i([this._index])
		};
		n.prototype.toList = function() {
			return new o([this._index])
		};
		i.prototype.toArray = function() {
			var e = this;
			var r = this.size,
				n = new Array(r);
			for (var i = 0; i < r; ++i) {
				n[i] = t._getElement(true, e._indexes[i])
			}
			return n
		};
		i.prototype.clone = function() {
			return new i(this._indexes.slice())
		};
		o.prototype.toArray = function() {
			var e = this;
			var r = this.size,
				n = new Array(r);
			for (var i = 0; i < r; ++i) {
				n[i] = t._getElement(false, e._indexes[i])
			}
			return n
		};
		o.prototype.clone = function() {
			return new o(this._indexes.slice())
		};
		r.prototype.getId = function() {
			return t._getId(true, this._index)
		};
		i.prototype.getId = function() {
			return t._getIds(true, this._indexes)
		};
		n.prototype.getId = function() {
			return t._getId(false, this._index)
		};
		o.prototype.getId = function() {
			return t._getIds(false, this._indexes)
		};
		n.prototype.getSource = function() {
			return t._getElement(true, t._getSource(this._index))
		};
		o.prototype.getSource = function() {
			return t._getElements(true, t._getSources(this._indexes))
		};
		n.prototype.getTarget = function() {
			return t._getElement(true, t._getTarget(this._index))
		};
		o.prototype.getTarget = function() {
			return t._getElements(true, t._getTargets(this._indexes))
		};
		n.prototype.getExtremities = function() {
			return t._getElements(true, [t._getSource(this._index), t._getTarget(this._index)])
		};
		o.prototype.getExtremities = function() {
			return t._getElements(true, t._getSources(this._indexes).concat(t._getTargets(this._indexes)))
		};
		n.prototype.setSource = function(e) {
			t.setSource(this, e)
		};
		n.prototype.setTarget = function(e) {
			t.setTarget(this, e)
		};
		i.prototype.get = function(e) {
			return t._getElement(true, this._indexes[e])
		};
		i.prototype.forEach = function(e) {
			t.forEachNode(this, e)
		};
		i.prototype.map = function(e) {
			return t.mapNodes(this, e)
		};
		i.prototype.filter = function(e) {
			return t.filterNodes(this, e)
		};
		i.prototype.reduce = function(e, r) {
			return t.reduceNodes(this, e, r)
		};
		i.prototype.concat = function(e) {
			return t.concatNodes(this, e)
		};
		i.prototype.dedupe = function() {
			return t.dedupeNodes(this)
		};
		i.prototype.slice = function(e, t) {
			return new i(this._indexes.slice(e, t))
		};
		o.prototype.get = function(e) {
			return t._getElement(false, this._indexes[e])
		};
		o.prototype.forEach = function(e) {
			t.forEachEdge(this, e)
		};
		o.prototype.map = function(e) {
			return t.mapEdges(this, e)
		};
		o.prototype.filter = function(e) {
			return t.filterEdges(this, e)
		};
		o.prototype.reduce = function(e, r) {
			return t.reduceEdges(this, e, r)
		};
		o.prototype.concat = function(e) {
			return t.concatEdges(this, e)
		};
		o.prototype.dedupe = function() {
			return t.dedupeEdges(this)
		};
		i.prototype.partition = function(e) {
			return t.partitionNodes(this, e)
		};
		o.prototype.partition = function(e) {
			return t.partitionEdges(this, e)
		};
		o.prototype.slice = function(e, t) {
			return new o(this._indexes.slice(e, t))
		};
		i.prototype.includes = function(e) {
			var r = this._indexes.indexOf(e._index);
			return r === -1 ? false : t._getElement(true, e._index) === e
		};
		o.prototype.includes = function(e) {
			var r = this._indexes.indexOf(e._index);
			return r === -1 ? false : t._getElement(false, e._index) === e
		};
		i.prototype.sort = function(e) {
			return new i(this._indexes.slice().sort(function(r, n) {
				return e(t._getElement(true, r), t._getElement(true, n))
			}))
		};
		i.prototype.inverse = function() {
			return t.inverse(this)
		};
		o.prototype.inverse = function() {
			return t.inverse(this)
		}
	});
	g.extend(function(e) {
		var t = e.Node;
		var r = e.Edge;
		var n = e.NodeList;
		var i = e.EdgeList;
		var o = new Au(e);
		e.modules.data = o;
		e.events.onNodeDataChange = function(t) {
			e.modules.events.on("updateNodeData", t);
			return e.events
		};
		e.events.onEdgeDataChange = function(t) {
			e.modules.events.on("updateEdgeData", t);
			return e.events
		};
		t.prototype.setData = function(e, value) {
			if (arguments.length < 2) {
				value = e;
				e = null
			}
			o.setProperty(this, e, value);
			return this
		};
		t.prototype.getData = function(e) {
			bu(arguments.length);
			return o.getProperty(this, e)[0]
		};
		r.prototype.setData = function(e, value) {
			if (arguments.length < 2) {
				value = e;
				e = null
			}
			o.setProperty(this, e, value);
			return this
		};
		r.prototype.getData = function(e) {
			bu(arguments.length);
			return o.getProperty(this, e)[0]
		};
		n.prototype.setData = function(e, t) {
			if (arguments.length < 2) {
				t = e;
				e = null
			}
			o.setProperty(this, e, t, {
				dispatch: true
			});
			return this
		};
		n.prototype.fillData = function(e, value) {
			if (arguments.length < 2) {
				value = e;
				e = null
			}
			o.setProperty(this, e, value, {
				dispatch: false
			});
			return this
		};
		n.prototype.getData = function(e) {
			bu(arguments.length);
			return o.getProperty(this, e)
		};
		i.prototype.setData = function(e, t) {
			if (arguments.length < 2) {
				t = e;
				e = null
			}
			o.setProperty(this, e, t, {
				dispatch: true
			});
			return this
		};
		i.prototype.fillData = function(e, value) {
			if (arguments.length < 2) {
				value = e;
				e = null
			}
			o.setProperty(this, e, value, {
				dispatch: false
			});
			return this
		};
		i.prototype.getData = function(e) {
			bu(arguments.length);
			return o.getProperty(this, e)
		}
	});

	function bu(e) {
		if (e > 1) {
			De("getData: more than one argument were specified, you probably want to use a single array argument instead of multiple arguments")
		}
	}
	var Au = function e(t) {
			var r = this;
			this._graph = t.modules.graph;
			this._events = t.modules.events;
			this._nodeChanges = [];
			this._edgeChanges = [];
			this._timeout = null;
			this._nodeDataList = this._graph.createAttribute(true, {
				name: "data",
				storage: "any"
			});
			this._edgeDataList = this._graph.createAttribute(false, {
				name: "data",
				storage: "any"
			});
			this._nodeList = this._graph.getAttribute(true, "object");
			this._edgeList = this._graph.getAttribute(false, "object");
			this._events.register(["updateNodeData", "updateEdgeData"]);
			this._tmp = new Array(2);
			this._events.on({
				"addNodes addEdges": function(e) {
					var t = e.nodes;
					var n = e.edges;
					var i = e.objects;
					var o = t || n;
					var s = o.isNode;
					var a = o.size;
					var u = o._indexes;
					var l = r[s ? "_nodeDataList" : "_edgeDataList"];
					for (var d = 0; d < a; ++d) {
						l.set(u[d], i[d].data)
					}
				}
			})
		};
	Au.prototype.setProperty = function e(t, r, value, n) {
		if (n === void 0) n = {};
		var i = n.dispatch;
		if (i === void 0) i = false;
		return Tu(this, t.isNode, t._indexes, r, value, i)
	};
	Au.prototype.getProperty = function e(t, r) {
		return Nu(this, t.isNode, t._indexes, r)
	};

	function wu(e) {
		if (!e._timeout) {
			e._timeout = setTimeout(function() {
				Eu(e);
				e._timeout = null
			}, 0)
		}
	}
	function Eu(e) {
		var t = Iu(e, true),
			r = Iu(e, false);
		e._events.fire("updateNodeData", t);
		e._events.fire("updateEdgeData", r)
	}
	function Iu(e, t) {
		var r = t ? "_nodeChanges" : "_edgeChanges",
			n = [],
			i = e[r];
		e[r] = [];
		for (var o = 0; o < i.length; ++o) {
			var s = i[o];
			n.push.apply(n, s.indexes);
			s[t ? "nodes" : "edges"] = e._graph._getElements(t, s.indexes);
			delete s.indexes
		}
		return a = {
			isNode: t,
			changes: i
		}, a[t ? "nodes" : "edges"] = e._graph._getElements(t, n).dedupe(), a;
		var a
	}
	function Su(e, t) {
		for (var r = 0; r < e.length; ++r) {
			var n = e[r],
				i = n.property;
			if (t === null && i === null) {
				return n
			} else if (t && i && i.length === t.length) {
				var o = true;
				for (var s = 0; s < i.length; ++s) {
					if (i[s] !== t[s]) {
						o = false;
						break
					}
				}
				if (o) {
					return n
				}
			}
		}
		var a = {
			property: t && t.slice(),
			indexes: [],
			previousValues: [],
			newValues: []
		};
		e.push(a);
		return a
	}
	function Cu(e) {
		if (typeof e === "string") {
			return e.split(".")
		} else if (Array.isArray(e)) {
			return e
		} else if (e === undefined || e === null) {
			return null
		} else {
			return [e.toString()]
		}
	}
	function Tu(e, t, r, n, value, i) {
		if (i && typeof value === "function") {
			i = false
		}
		n = Cu(n);
		var o = typeof value === "function",
			s = t ? e._nodeList : e._edgeList,
			a = t ? e._nodeDataList : e._edgeDataList,
			u = t ? e._nodeChanges : e._edgeChanges,
			l = Su(u, n);
		for (var d = 0; d < r.length; ++d) {
			var f = r[d],
				h = a.get(f),
				c = s.get(f),
				p = i ? value[d] : value,
				g = void 0,
				v = void 0;
			if (n === null) {
				g = h;
				v = o ? p(c) : p;
				a.set(f, v)
			} else {
				if (h === null || h === undefined) {
					h = {};
					a.set(f, h)
				}
				Lu(h, n, p, o, c, e._tmp);
				g = e._tmp[0];
				v = e._tmp[1]
			}
			l.indexes.push(f);
			l.previousValues.push(g);
			l.newValues.push(v)
		}
		wu(e)
	}
	function Lu(e, t, value, r, n, i) {
		var o = t.length - 1;
		for (var s = 0; s < o; ++s) {
			var a = t[s],
				u = e[a];
			if (u === null || u === undefined) {
				u = {};
				e[a] = u
			}
			e = u
		}
		var l = t[o],
			d = e[l],
			f = r ? value(n) : value;
		e[l] = f;
		i[0] = d;
		i[1] = f
	}
	function Nu(e, t, r, n, i) {
		n = Cu(n);
		if (!i) {
			i = new Array(r.length)
		}
		var o = t ? e._nodeDataList : e._edgeDataList;
		for (var s = 0; s < r.length; ++s) {
			var a = r[s],
				u = o.get(a);
			i[s] = zu(u, n)
		}
		return i
	}
	function zu(e, t) {
		if (t === null || !t.length) {
			return e
		} else if (e === undefined || e === null) {
			return undefined
		}
		var r = t.length - 1;
		for (var n = 0; n < r; ++n) {
			var i = t[n];
			e = e[i];
			if (e === null || e === undefined) {
				return undefined
			}
		}
		return e[t[r]]
	}
	var Mu = {
		linear: function(e) {
			return e
		},
		quadraticIn: function(e) {
			return e * e
		},
		quadraticOut: function(e) {
			return e * (2 - e)
		},
		quadraticInOut: function(e) {
			if ((e *= 2) < 1) {
				return .5 * e * e
			}
			return -.5 * (--e * (e - 2) - 1)
		},
		cubicIn: function(e) {
			return e * e * e
		},
		cubicOut: function(e) {
			return --e * e * e + 1
		},
		cubicInOut: function(e) {
			if ((e *= 2) < 1) {
				return .5 * e * e * e
			}
			return .5 * ((e -= 2) * e * e + 2)
		}
	};
	var ku = {
		duration: 0,
		easing: "linear",
		callback: function() {},
		startAfter: 0
	};
	g.extend(function(e) {
		return e.modules.animations = new Ru(e)
	});
	var Ru = function e(t) {
			var r = this;
			this._render = t.modules.render;
			this._events = t.modules.events;
			this._animationList = [];
			this._events.on("beforeNewFrame", function(e) {
				var t = e.elapsed;
				return Fu(r, t)
			})
		};
	Ru.prototype.play = function e(t, r) {
		var n = Ye(r, ku);
		var i = n.duration;
		var o = n.easing;
		var s = n.callback;
		var a = n.startAfter;
		var u = null;
		if (i <= 0) {
			t(1);
			s()
		} else {
			u = {
				func: t,
				easing: typeof o === "function" ? o : Mu[o],
				duration: i,
				callback: s,
				elapsed: 0,
				startAfter: a,
				done: false
			};
			this._animationList.push(u);
			this._render.refresh()
		}
		return u
	};
	Ru.prototype.end = function e(t, r) {
		if (r === void 0) r = true;
		var n = this._animationList.indexOf(t);
		if (n !== -1) {
			t.func(1);
			t.done = true;
			this._animationList.splice(n, 1);
			if (r) {
				t.callback(true)
			}
		}
	};

	function Fu(e, t) {
		if (t < 0 || e._animationList.length === 0) {
			return true
		}
		var r = [];
		var n = e._animationList;
		for (var i = 0; i < n.length; ++i) {
			var o = n[i],
				s = o.elapsed / o.duration,
				a = o.startAfter,
				u = o.easing(s);
			if (s >= 1) {
				o.func(1);
				o.done = true;
				n.splice(i, 1);
				i -= 1;
				r.push(o.callback)
			} else if (u >= a) {
				var l = 1 / (1 - a);
				u = (u - a) * l;
				o.func(u);
				o.elapsed += t
			} else {
				o.elapsed += t
			}
		}
		for (var d = 0; d < r.length; ++d) {
			r[d](false)
		}
		e._render.refresh()
	}
	var Pu = 1e-8;
	var Du = 1e8;
	var Ou = {
		duration: 0,
		easing: "linear",
		startAfter: 0
	};

	function Bu(e) {
		return Math.abs(e) < 1e-9
	}
	g.extend(function(e) {
		var t = new Uu(e),
			r = e.modules,
			n = e.view;
		r.camera = t;
		n.setZoom = function(e, r) {
			return t.setZoom(e, r)
		};
		n.zoomIn = function(e, r) {
			return t.zoomIn(e, r)
		};
		n.zoomOut = function(e, r) {
			return t.zoomOut(e, r)
		};
		n.getZoom = function() {
			return t.zoom
		};
		n.setCenter = function(e, r) {
			return t.setCenter(e, r)
		};
		n.move = function(e, r) {
			return t.move(e, r)
		};
		n.getCenter = function() {
			return {
				x: t.x,
				y: t.y
			}
		};
		n.setAngle = function(e, r) {
			return t.setAngle(e, r)
		};
		n.rotate = function(e, r) {
			return t.rotate(e, r)
		};
		n.getAngle = function() {
			return t.angle
		};
		n.set = function(e, r) {
			return t.setView(e, r)
		};
		n.get = function() {
			return t.getView()
		};
		n.graphToScreenCoordinates = function(e) {
			return t.graphToScreenCoordinates(e)
		};
		n.screenToGraphCoordinates = function(e) {
			return t.screenToGraphCoordinates(e)
		};
		n.getSize = function() {
			return {
				width: t.width,
				height: t.height
			}
		}
	});
	var Uu = function e(t) {
			var r = this;
			this._events = t.modules.events;
			this._render = t.modules.render;
			this._animations = t.modules.animations;
			this._settings = t.modules.settings;
			this._zoomAnimation = null;
			this._moveAnimation = null;
			Xu(this);
			this._minZoom = Pu;
			this._maxZoom = Du;
			mt(this, {
				width: function() {
					return r._dimensions.width
				},
				height: function() {
					return r._dimensions.height
				},
				x: function() {
					return r._x
				},
				y: function() {
					return r._y
				},
				zoom: function() {
					return r._zoom
				},
				angle: function() {
					return r._angle
				}
			});
			this._events.register(["cameraMove", "cameraPan", "cameraZoom", "cameraRotate", "viewChanged"]);
			this._settings.register("minZoom", Pu, function(e) {
				r._minZoom = e;
				if (r._zoom < e) {
					r._zoom = e;
					r._events.fire("cameraMove")
				}
			});
			this._settings.register("maxZoom", Du, function(e) {
				r._maxZoom = e;
				if (r._zoom > e) {
					r._zoom = e;
					r._events.fire("cameraMove")
				}
			});
			this._events.on({
				setContainer: function() {
					Xu(r);
					r._events.fire("cameraMove")
				},
				resize: function() {
					r.reloadDimensions();
					r._events.fire("cameraMove")
				}
			})
		};
	Uu.prototype.setCenter = function e(t, r) {
		var n = this;
		var i = t.x;
		var o = t.y;
		r = Ye(r, Ou);
		var s = this._x,
			a = this._y,
			u = i - this._x,
			l = o - this._y;
		if (Bu(u) && Bu(l)) {
			return Promise.resolve()
		}
		return new Promise(function(e) {
			var t = function(e) {
					n._x = s + u * e;
					n._y = a + l * e;
					n._events.fire("cameraMove");
					n._events.fire("cameraPan")
				};
			r.callback = Gu(n, e);
			if (n._moveAnimation) {
				n._animations.end(n._moveAnimation)
			}
			n._moveAnimation = n._animations.play(t, r)
		})
	};
	Uu.prototype.move = function e(t, r) {
		var n = t.x;
		var i = t.y;
		var o = Hu(this, {
			x: n,
			y: i
		});
		return this.setCenter({
			x: this._x + o.x,
			y: this._y + o.y
		}, r)
	};
	Uu.prototype.setZoom = function e(t, r, n) {
		var i = this;
		if (n === void 0) n = {};
		var o = n.refX;
		var s = n.refY;
		r = Ye(r, Ou);
		if (t < this._minZoom) {
			t = this._minZoom
		} else if (t > this._maxZoom) {
			t = this._maxZoom
		}
		if (Bu(this._zoom - t)) {
			return Promise.resolve()
		}
		return new Promise(function(e) {
			var n = i._dimensions.width / 2,
				a = i._dimensions.height / 2,
				u = i._zoom,
				l = n / u - n / t;
			var d = function(e) {
					i._zoom = n / (n / u - l * e);
					i._events.fire("cameraMove");
					i._events.fire("cameraZoom")
				};
			r.callback = Gu(i, e);
			if (o !== undefined && s !== undefined) {
				var f = (o - n) / u - (o - n) / t,
					h = (s - a) / u - (s - a) / t,
					c = Math.cos(i._angle),
					p = Math.sin(i._angle),
					g = c * f - p * h,
					v = p * f + c * h;
				i.setCenter({
					x: i._x + g,
					y: i._y + v
				}, r)
			}
			if (i._zoomAnimation) {
				i._animations.end(i._zoomAnimation)
			}
			i._zoomAnimation = i._animations.play(d, r)
		})
	};
	Uu.prototype.zoomIn = function e(t, r, n) {
		if (typeof t !== "number") {
			n = r;
			r = t;
			t = this._settings.get("interactions.zoom.modifier")
		}
		return this.setZoom(this._zoom * t, r, n)
	};
	Uu.prototype.zoomOut = function e(t, r, n) {
		if (typeof t !== "number") {
			n = r;
			r = t;
			t = this._settings.get("interactions.zoom.modifier")
		}
		return this.setZoom(this._zoom / t, r, n)
	};
	Uu.prototype.setAngle = function e(t, r) {
		var n = this;
		r = Ye(r, Ou);
		var i = this._angle,
			o = t - i;
		if (Bu(o)) {
			return Promise.resolve()
		}
		return new Promise(function(e) {
			var t = function(e) {
					n._angle = i + o * e;
					while (n._angle > Math.PI) {
						n._angle -= 2 * Math.PI
					}
					while (n._angle < -Math.PI) {
						n._angle += 2 * Math.PI
					}
					n._events.fire("cameraMove");
					n._events.fire("cameraRotate")
				};
			r.callback = Gu(n, e);
			if (n._rotateAnimation) {
				n._animations.end(n._rotateAnimation)
			}
			n._rotateAnimation = n._animations.play(t, r)
		})
	};
	Uu.prototype.rotate = function e(t, r) {
		return this.setAngle(this._angle + t, r)
	};
	Uu.prototype.graphToScreenCoordinates = function e(t, r) {
		var n = t.x;
		var i = t.y;
		if (r === void 0) r = {};
		var o = this._dimensions.width / 2,
			s = this._dimensions.height / 2,
			a = (n - this._x) * this._zoom + o,
			u = (i - this._y) * this._zoom + s;
		return zr(a, u, o, s, this._angle * -1, r)
	};
	Uu.prototype.screenToGraphCoordinates = function e(t, r) {
		var n = t.x;
		var i = t.y;
		if (r === void 0) r = {};
		var o = this._x + (n - this._dimensions.width / 2) / this._zoom,
			s = this._y + (i - this._dimensions.height / 2) / this._zoom;
		return zr(o, s, this._x, this._y, this._angle, r)
	};
	Uu.prototype.screenToGraphVector = function e(t) {
		var r = t.x;
		var n = t.y;
		return Hu(this, {
			x: r,
			y: n
		})
	};
	Uu.prototype.getView = function e() {
		return {
			x: this._x,
			y: this._y,
			zoom: this._zoom,
			angle: this._angle
		}
	};
	Uu.prototype.setView = function e(t, r) {
		var n = Ye(t, {
			x: this._x,
			y: this._y,
			zoom: this._zoom,
			angle: this._angle
		});
		var i = n.x;
		var o = n.y;
		var s = n.zoom;
		var a = n.angle;
		this.setCenter({
			x: i,
			y: o
		}, r);
		this.setZoom(s, r);
		return this.setAngle(a, r)
	};
	Uu.prototype.reloadDimensions = function e() {
		this._dimensions = this._render.getDimensions()
	};
	Uu.prototype.animationInProgress = function e() {
		var t = this._moveAnimation;
		var r = this._zoomAnimation;
		return t && !t.done || r && !r.done
	};

	function Xu(e) {
		e._zoom = 1;
		e._x = 0;
		e._y = 0;
		e._angle = 0;
		e._dimensions = e._render.getDimensions()
	}
	var ju = 200;
	var Wu = me(function(e) {
		return e._events.fire("viewChanged")
	}, ju);

	function Gu(e, t) {
		var r = arguments;
		return function() {
			t.apply(undefined, r);
			clearTimeout(e._moveEndTimer);
			e._moveEndTimer = setTimeout(function() {
				return Wu(e)
			}, ju)
		}
	}
	function Hu(e, t) {
		var r = t.x;
		var n = t.y;
		r /= e._zoom;
		n /= e._zoom;
		var i = Math.cos(e._angle),
			o = Math.sin(e._angle);
		return {
			x: i * r - o * n,
			y: o * r + i * n
		}
	}
	var Yu = 2;
	var Vu = 4;
	var qu = new Or;
	var Zu = new Or;
	var Qu = {};
	var Ju = {};

	function Ku(e, t, r, n, i, o, s, a, u, l, d, f, h, c, p, g, v, y, _, m) {
		if (n === i) {
			t = r.drawLoop(e, t, o, s, l, d, f, h, p, g, y, _, v, m)
		} else if (f === 0) {
			t = r.drawStraight(e, t, o, s, a, u, l, d, h, c, p, g, y, _, v, m)
		} else {
			t = r.drawCurved(e, t, o, s, a, u, l, d, f, h, c, p, g, y, _, v, m)
		}
		return t
	}
	function $u(e, t, r, n, i, o) {
		if (i < 0) {
			return jn(e, t, r, n, Yu, Vu / i, o)
		} else {
			return jn(r, n, e, t, Yu, Vu / i * -1, o)
		}
	}
	function el(e, t, r, n, i) {
		return Yn(e, t, n + r, i)
	}
	function tl(e, t) {
		return {
			drawStraight: function(r, n, i, o, s, a, u, l, d, f, h, c, p, g, v) {
				var y = u * e,
					_ = y * t,
					m = y + _,
					x = distance(i, o, s, a),
					b = (s - i) / x,
					A = (a - o) / x,
					w = d * .7,
					E = (x - w) / m | 0,
					I = w;
				var S = r.updateComposite(n, E);
				for (var C = 0; C < E; ++C) {
					qu.setXY(i + b * I, o + A * I);
					I += y;
					Zu.setXY(i + b * I, o + A * I);
					I += _;
					S[C] = r.line(S[C], qu, Zu, u, l, h, c, p, g, v)
				}
				return r.composite(n, S)
			},
			drawCurved: function(r, n, i, o, s, a, u, l, d, f, h, c, p, g, v, y) {
				var _ = u * e,
					m = _ * t,
					x = _ + m,
					b = $u(i, o, s, a, d, b),
					A = Qn(i, o, b.x, b.y, s, a),
					w = f * .7,
					E = (A - w) / x | 0,
					I = _ / A,
					S = m / A,
					C = w / A;
				var T = r.updateComposite(n, E);
				for (var L = 0; L < E; ++L) {
					Wn(C, i, o, s, a, b.x, b.y, Qu);
					qu.setXY(Qu.x, Qu.y);
					C += I;
					Wn(C, i, o, s, a, b.x, b.y, Qu);
					Zu.setXY(Qu.x, Qu.y);
					C += S;
					T[L] = r.line(T[L], qu, Zu, u, l, c, p, g, v, y)
				}
				return r.composite(n, T)
			},
			drawLoop: function(r, n, i, o, s, a, u, l, d, f, h, c, p) {
				var g = s * e,
					v = g * t,
					y = el(i, o, u, l, y),
					_ = ei(i, o, y.x1, y.y1, y.x2, y.y2, i, o),
					m = l * .7,
					x = g / _,
					b = v / _,
					A = m / _,
					w = 0;
				r.delete(n);
				var E = [];
				while (A <= 1) {
					Vn(A, i, o, i, o, y.x1, y.y1, y.x2, y.y2, qu);
					A += x;
					do {
						Vn(A, i, o, i, o, y.x1, y.y1, y.x2, y.y2, Zu);
						A += .01
					} while (distance(qu.x, qu.y, Zu.x, Zu.y) < g);
					do {
						Vn(A, i, o, i, o, y.x1, y.y1, y.x2, y.y2, Zu);
						A -= .01
					} while (distance(qu.x, qu.y, Zu.x, Zu.y) > g);
					A += b + .01;
					E[w] = r.line(E[w], qu, Zu, s, a, d, f, h, c, p);
					++w
				}
				return r.composite(-1, E)
			},
			detectStraight: function(e, t, r, n, i, o, s, a, u) {
				return _r(e, t, r, n, i, o, s)
			},
			detectCurved: function(e, t, r, n, i, o, s, a, u, l) {
				$u(r, n, i, o, a, Ju);
				return Gn(e, t, r, n, i, o, Ju.x, Ju.y, s / 2)
			},
			detectLoop: function(e, t, r, n, i, o, s) {
				el(r, n, o, s, Ju);
				return Zn(e, t, r, n, r, n, Ju.x1, Ju.y1, Ju.x2, Ju.y2, i / 2)
			}
		}
	}
	var rl = {
		getLoopControlPoints: el,
		getCurveControlPoint: $u,
		getPointOnQuadraticCurve: Wn,
		getPointOnBezierCurve: Vn,
		distance: distance,
		lineAngle: wr
	};
	var nl = function e(t, r, n, i, o, s) {
			var a = this;
			this._LAYER_DEPTH_VALUE = Ii;
			this._MIN_DEPTH = t ? Ei : xi * 4;
			this._EPSILON = xi;
			this._name = t ? "node" : "edge";
			this._ogma = r;
			this._shapes = n;
			this._graph = r.modules.graph;
			this._render = r.modules.render;
			this._settings = i;
			this._camera = o;
			this._nodes = s;
			this._edges = null;
			this._isNode = t;
			this._refreshAll = true;
			this._nameList = [];
			this._byName = {};
			this._graphicsList = [];
			this._semanticLayers = [];
			this._properties = {};
			this._propertyList = [];
			this._propertiesByRootKey = {};
			this._aliases = {};
			this._drawFunctionModels = [];
			this._postDraw = [];
			this._contexts = {};
			this._components = [];
			this._toRefresh = this._graph._createIndexSet(t);
			this._getNodeAttribute = function(e) {
				return a._graph.getNodeAttribute(e)
			};
			this._getEdgeAttribute = function(e) {
				return a._graph.getEdgeAttribute(e)
			};
			this._toReconfigure = false;
			this._toComputeCurvatures = false;
			this._individualStyles = {};
			this._originalStyles = {};
			this._ruleStyles = {};
			this._finalStyles = {};
			this._curvaturesToRecompute = {};
			this._layerList = [];
			this._layers = {};
			this._elements = this._graph.getAttribute(t, "object");
			this._excludedList = this._graph.getAttribute(t, "excluded");
			this._nextRuleId = 1;
			this._ruleList = [];
			this._rules = {};
			this._layer = this._graph.createAttribute(t, {
				name: "layer",
				storage: bi
			});
			this._depth = this._graph.createAttribute(t, {
				name: "depth",
				storage: "float"
			});
			if (!t) {
				this._graph.createEdgeAttribute({
					name: "curvature",
					storage: "int8"
				});
				this._sourceList = this._graph.getEdgeAttribute("source");
				this._targetList = this._graph.getEdgeAttribute("target")
			}
			r.modules.events.on((u = {}, u[t ? "addNodes" : "addEdges"] = function(e) {
				var t = e.objects;
				var r = e.nodes;
				var n = e.edges;
				var i = r || n,
					o = new Array(t.length),
					s = i._indexes;
				for (var u = 0; u < t.length; ++u) {
					o[u] = t[u].style
				}
				a._updateDepth(s);
				for (var l = 0; l < t.length; ++l) {
					o[l] = t[l].attributes
				}
				a._setIndividualStyles(s, o, true, false);
				a._computeRules(Object.keys(a._rules), s, false);
				a._computeStyles(Object.keys(a._finalStyles), s);
				a._markToRefresh(s)
			}, u[t ? "beforeRemoveNodes" : "beforeRemoveEdges"] = function(e) {
				var t = e.nodes;
				var r = e.edges;
				a._deleteGraphics((t || r)._indexes);
				a._render.refresh()
			}, u[t ? "refreshNodeFilters" : "refreshEdgeFilters"] = function(e) {
				var r = e.newlyIncluded;
				var n = e.newlyExcluded;
				a._markToRefresh(r._indexes);
				a._markToRefresh(n._indexes);
				if (!t) {
					var i = [];
					for (var o = 0; o < r._indexes.length; ++o) {
						i.push(a._graph.getEdgeDirection(r._indexes[o]))
					}
					for (var s = 0; s < n._indexes.length; ++s) {
						i.push(a._graph.getEdgeDirection(n._indexes[s]))
					}
					a._addCurvaturesToUpdate(i)
				}
			}, u));
			var u;
			if (!t) {
				r.modules.events.on({
					updateDirections: function(e) {
						var t = e.directions;
						a._addCurvaturesToUpdate(t)
					}
				})
			}
		};
	nl.prototype._assignEdges = function e(t) {
		this._edges = t;
		this._edgeDepth = this._graph.getEdgeAttribute("depth")
	};
	nl.prototype._addCurvaturesToUpdate = function e(t) {
		var r = this;
		for (var n = 0; n < t.length; ++n) {
			r._curvaturesToRecompute[t[n]] = 1
		}
		this._toComputeCurvatures = true;
		this._render.refresh()
	};
	nl.prototype.updateAllCurvatures = function e() {
		this._addCurvaturesToUpdate(this._graph._getAllEdgeDirections())
	};
	nl.prototype.getAttributeArray = function e(t) {
		if (this._aliases[t]) {
			t = this._aliases[t]
		}
		var r = this._finalStyles[t],
			n = this._properties[t];
		if (!n) {
			throw new Error("attribute " + t + " does not exist")
		}
		return r || {
			get: function e() {
				return n.
			default
			},
			getMultiple: function e(t, r) {
				if (!r) {
					r = new Array(t.length)
				}
				for (var i = 0; i < t.length; ++i) {
					r[i] = n.
				default
				}
				return r
			}
		}
	};
	nl.prototype.addFeature = function e(t, r) {
		var n = this;
		this._nameList.push(t);
		var i = r.properties || {},
			o = r.settings || {},
			s = r.semanticLayers || {},
			a = r.draw ? Array.isArray(r.draw) ? r.draw : [r.draw] : [],
			u = r.aliases || {},
			l = r.context ||
		function() {
			return undefined
		};
		var d = {
			name: t,
			semanticLayers: Object.keys(s),
			draw: a,
			enabled: true,
			visible: true
		};
		this._byName[t] = d;
		this._graphicsList.push(d);
		Xe(s, function(e, t) {
			var r = e.useClipSpace;
			var i = e.defineClipSpace;
			var o = e.transparency;
			n._semanticLayers.push(t);
			n._render.addSemanticLayer(t, {
				camera: n._camera,
				useClipSpace: r,
				defineClipSpace: i,
				transparency: o
			})
		});
		Xe(u, function(e, t) {
			n._aliases[t] = e
		});
		a.forEach(function(e) {
			n._drawFunctionModels.push({
				body: e,
				feature: t
			});
			n._components.push(n._graph.createAttribute(n._isNode, {
				storage: 32,
			default:
				-1
			}))
		});
		Xe(Et(i, function(e) {
			return "default" in e && "check" in e
		}), function(e, t) {
			var r = t.split(".")[0];
			n._properties[t] = e;
			n._propertyList.push(t);
			if (["x", "y", "radius", "width", "shape", "hidden", "color"].indexOf(t) !== -1) {
				n._instanciateFinalStyleProperty(t)
			}
			if (!n._propertiesByRootKey[r]) {
				n._propertiesByRootKey[r] = r === t ? null : [t]
			} else {
				n._propertiesByRootKey[r].push(t)
			}
		});
		var f = l(this._ogma, i, o);
		this._contexts[t] = f;
		if (r.postDraw) {
			this._postDraw.push({
				context: f,
				func: r.postDraw
			})
		}
		this._reconfigure()
	};
	nl.prototype._computeCurvatures = function e() {
		var t = this;
		var r = this._graph;
		var n = this._graph.getAttributes(false, ["source", "target", "curvature", "width", "hidden"]);
		var i = n[0];
		var o = n[1];
		var s = n[2];
		var a = n[3];
		var u = n[4];
		var l = this._settings.edgesAlwaysCurvy,
			d = this._settings.directedEdges,
			f = Object.keys(this._curvaturesToRecompute),
			h = l ? 1 : 0;
		for (var c = 0, p = f.length; c < p; ++c) {
			var g = f[c],
				v = r.getParallelIndexes(g);
			r._filter(false, v);
			t._markToRefresh(v);
			if (v.length === 1) {
				s.set(v[0], h)
			} else {
				var y = v[0],
					_ = i.get(y),
					m = 0,
					x = 0,
					b = 0,
					A = 0,
					w = 0,
					E = 0;
				for (var I = 0; I < v.length; ++I) {
					var S = v[I];
					if (!u.get(S)) {
						if (i.get(S) === _) {
							m += 1
						} else {
							x += 1
						}
					}
				}
				var C = m + x;
				for (var T = 0; T < v.length; ++T) {
					var L = v[T],
						N = u.get(L);
					if (N) {
						continue
					}
					var z = i.get(L),
						M = o.get(L),
						k = a.get(L),
						R = z === _,
						F = z === M,
						P = d ? il(R ? w : E, m, x, (R ? b : A) + k / 2, F, false, true, l) : il(w + E, C, 0, b + A + k / 2, F, !R, false, l);
					s.set(L, P);
					if (R) {
						b += k;
						w += 1
					} else {
						A += k;
						E += 1
					}
				}
			}
		}
	};
	nl.prototype.setGraphicsVisibility = function e(t, r) {
		var n = this._byName[t];
		if (n) {
			this._render.setSemanticLayersEnabled(n.semanticLayers, r);
			n.visible = r
		}
	};
	nl.prototype.addLayer = function e(t, r, n) {
		if (this._layerList.length === bi) {
			throw new Error("cannot add layer: maximum number of layers (" + bi + ") reached")
		}
		if (this._layers[t]) {
			throw new Error("layer " + t + " already exists")
		}
		var i = {
			name: t,
			depth: r
		};
		this._layers[t] = i;
		this._layerList.push(i);
		this._layerList.sort(function(e, t) {
			return e.depth - t.depth
		});
		this._layerList.forEach(function(e, t) {
			return e.index = t
		});
		this.setLayerStyle(t, n || {})
	};
	nl.prototype.formatStyle = function e(t) {
		var r = Et(t);
		Xe(this._aliases, function(e, t) {
			if (t in r) {
				r[e] = r[t];
				delete r[t]
			}
		});
		return r
	};
	nl.prototype.setLayerStyle = function e(t, r) {
		var n = this;
		var i = this._getLayer(t),
			o = this.formatStyle(r),
			s = Object.keys(o);
		s.forEach(function(e) {
			if (!n._properties[e]) {
				throw new Error('style property "' + e + '" does not exist')
			}
			n._instanciateFinalStyleProperty(e)
		});
		i.propertyList = s;
		i.style = o
	};
	nl.prototype.updateLayerStyle = function e(t, r) {
		var n = this._getLayer(t),
			i = Et(r);
		Xe(i, function(e, t) {
			return n.style[t] = e
		});
		this.setLayerStyle(t, n.style)
	};
	nl.prototype._getLayer = function e(t) {
		var r = this._layers[t];
		if (!r) {
			throw new Error("layer " + t + " does not exist")
		}
		return r
	};
	nl.prototype.putOnLayer = function e(t, r) {
		this._layerAction(true, t, r)
	};
	nl.prototype.removeFromLayer = function e(t, r) {
		this._layerAction(false, t, r)
	};
	nl.prototype._layerAction = function e(t, r, n) {
		var i = this._getLayer(r);
		(t ? sl : al)(this._layer, i.index, n);
		this._updateDepth(n);
		this._computeStyles(i.propertyList, n);
		this._markToRefresh(n)
	};
	nl.prototype._updateDepth = function e(t) {
		var r = this;
		for (var n = 0, i = t.length; n < i; ++n) {
			var o = t[n],
				s = r._layer.get(o),
				a = Math.log2(s) + 1 | 0,
				u = r._MIN_DEPTH + r._EPSILON * o + r._LAYER_DEPTH_VALUE * a;
			r._depth.set(o, u)
		}
	};
	nl.prototype._get = function e(t) {
		var r = this._byName[t];
		if (!r) {
			throw new Error((this._isNode ? "node" : "edge") + ' graphics "' + t + '" do not exist')
		}
		return r
	};
	nl.prototype._deleteGraphics = function e(t) {
		var r = this;
		var n = this._render;
		for (var i = 0; i < this._components.length; ++i) {
			var o = r._components[i];
			for (var s = 0, a = t.length; s < a; ++s) {
				n.delete(o.get(t[s]))
			}
		}
	};
	nl.prototype._markToRefresh = function e(t) {
		if (this._refreshAll) {
			return
		}
		this._toRefresh.addMultiple(t);
		this._render.refresh()
	};
	nl.prototype._markAdjacentEdgesToRefresh = function e(t) {
		if (this._edges._refreshAll) {
			return
		}
		this._edges._markToRefresh(this._graph._collectAdjacentEdges(t))
	};
	nl.prototype._reconfigure = function e() {
		this._toReconfigure = true
	};
	nl.prototype._configure = function e() {
		this._draw = sd(this)
	};
	nl.prototype._instanciateFinalStyleProperty = function e(t) {
		if (this._finalStyles[t]) {
			return this._finalStyles[t]
		}
		if (!this._properties[t]) {
			throw new Error('cannot instanciate non-existing attribute "' + t + '"')
		}
		var r = this._properties[t],
			n = this._graph.createAttribute(this._isNode, {
				name: t,
			default:
				r.
			default,
				storage:
				r.storage || "resource"
			});
		this._finalStyles[t] = n;
		this._reconfigure();
		return n
	};
	nl.prototype._instanciateStyleProperty = function e(t, r) {
		if (!this._properties[t]) {
			throw new Error('unknown attribute "' + t + '"')
		}
		var n = this._graph.createAttribute(this._isNode, {
		default:
			undefined, storage: "resource"
		});
		r[t] = n;
		this._instanciateFinalStyleProperty(t);
		return n
	};
	nl.prototype.drawAllSynchronously = function e() {
		var t = this._graph._allIndexes(this._isNode);
		if (!this._draw) {
			this._configure()
		}
		this._doDraw(t)
	};
	nl.prototype._doDraw = function e(t) {
		this._draw(this._render, this._shapes, this._getNodeAttribute, this._getEdgeAttribute, this._settings, this._components, t, this._contexts, Or, jr, rl)
	};
	nl.prototype.draw = function e() {
		var t = this;
		if (this._toReconfigure) {
			this._configure();
			this._toReconfigure = false
		}
		if (this._toComputeCurvatures) {
			this._computeCurvatures();
			this._curvaturesToRecompute = {};
			this._toComputeCurvatures = false
		}
		if (!this._toRefresh.size && !this._refreshAll) {
			return
		}
		var r = this._refreshAll ? this._graph._allIndexes(this._isNode) : this._toRefresh.list;
		this._doDraw(r);
		if (this._settings.edgeClipping && !this._isNode) {
			this._setupClipping(r)
		}
		for (var n = 0; n < this._postDraw.length; ++n) {
			var i = t._postDraw[n];
			i.func(t._ogma, i.context)
		}
		this._toRefresh.clear();
		this._refreshAll = false
	};
	nl.prototype.refresh = function e(t) {
		this._markToRefresh(t);
		if (this._isNode) {
			this._markAdjacentEdgesToRefresh(t)
		}
	};
	nl.prototype.refreshAll = function e() {
		this._refreshAll = true;
		this._render.refresh()
	};
	nl.prototype._setupClipping = function e(t) {
		var r = this;
		var n = this._graph.getAttributes(true, ["x", "y", "radius"]);
		var i = n[0];
		var o = n[1];
		var s = n[2];
		var a = this._graph.getAttributes(false, ["source", "target"]);
		var u = a[0];
		var l = a[1];
		var d = this._components,
			f = d.length;
		for (var h = 0, c = t.length; h < c; ++h) {
			var p = t[h],
				g = u.get(p),
				v = l.get(p),
				y = i.get(g),
				_ = o.get(g),
				m = s.get(g),
				x = i.get(v),
				b = o.get(v),
				A = s.get(v);
			for (var w = 0; w < f; ++w) {
				var E = d[w].get(p);
				r._render.setVisibilityCondition1(E, true, y, _, m);
				r._render.setVisibilityCondition2(E, true, x, b, A)
			}
		}
	};
	nl.prototype.setEnabled = function e(t, r) {};
	nl.prototype._computeStyles = function e(t, r) {
		var n = this;
		var i = this._layer,
			o = this._layerList,
			s = r.length,
			a = this._shapes;
		for (var u = 0; u < t.length; ++u) {
			var l = t[u],
				d = n._properties[l],
				f = d.
			default,
				h = d.check,
				c = n._finalStyles[l],
				p = n._originalStyles[l],
				g = n._ruleStyles[l],
				v = n._individualStyles[l];
			for (var y = 0; y < s; ++y) {
				var _ = r[y],
					m = n._elements.get(_),
					value = ol(o, i.get(_), l, m);
				if (value === undefined) {
					value = v && v.get(_);
					if (value === undefined) {
						value = g && g.get(_);
						if (value === undefined) {
							value = p && p.get(_)
						}
					}
				}
				if (value === undefined || !h(value, a)) {
					value = f
				}
				c.set(_, value)
			}
		}
	};
	nl.prototype.getIndividualStyles = function e(t, r) {
		var n = this;
		r = r || Object.keys(this._properties);
		var i = new Array(t.length);
		for (var o = 0; o < t.length; ++o) {
			i[o] = {}
		}
		r.forEach(function(e) {
			if (Array.isArray(e)) {
				e = r.join(".")
			}
			if (n._aliases[e]) {
				e = n._aliases[e]
			}
			var o = n._properties[e];
			if (!o) {
				throw new Error('attribute "' + o + '" does not exist')
			}
			var s = n._graph.getAttribute(n._isNode, e) || {
				get: function() {
					return o.
				default
				}
			};
			for (var a = 0; a < t.length; ++a) {
				var value = s.get(t[a]);
				if (Array.isArray(value)) {
					value = value.slice()
				}
				It(i[a], e, value)
			}
		});
		return i
	};
	nl.prototype.getIndividualStyle = function e(t, r) {
		return this.getAttributeArray(r).getMultiple(t)
	};
	nl.prototype._setIndividualStyles = function e(t, r, n, i) {
		var o = Array.isArray(r) ? this._setIndividualStylesByArray(t, r, n) : this._setIndividualStylesBySingleValue(t, r, n);
		if (i) {
			this._computeStyles(o, t);
			this._markToRefresh(t);
			var s = o.reduce(function(e, value) {
				return e || value === "x" || value === "y" || value === "radius"
			}, false);
			if (s) {
				this._markAdjacentEdgesToRefresh(t)
			}
		}
	};
	nl.prototype._setIndividualStylesBySingleValue = function e(t, r, n) {
		var i = this;
		var o = this[n ? "_originalStyles" : "_individualStyles"],
			s = this.formatStyle(r),
			a = Object.keys(s);
		for (var u = 0; u < a.length; ++u) {
			var l = a[u],
				d = o[l] || i._instanciateStyleProperty(l, o),
				value = s[l];
			for (var f = 0, h = t.length; f < h; ++f) {
				d.set(t[f], value)
			}
		}
		return a
	};
	nl.prototype._setIndividualStylesByArray = function e(t, r, n) {
		var i = this;
		var o = this._properties,
			s = this._propertiesByRootKey,
			a = this[n ? "_originalStyles" : "_individualStyles"],
			u = this._aliases,
			l = {};
		for (var d = 0, f = t.length; d < f; ++d) {
			var h = t[d],
				c = r[d];
			if (!c) {
				continue
			}
			var p = Object.keys(c);
			for (var g = 0; g < p.length; ++g) {
				var v = p[g];
				if (o[v]) {
					var y = a[v] || i._instanciateStyleProperty(v, a);
					y.set(h, c[v]);
					l[v] = true
				} else if (s[v]) {
					var _ = c[v];
					if (_ === null || typeof _ !== "object" || Array.isArray(_)) {
						var m = u[v];
						if (m) {
							var x = a[m] || i._instanciateStyleProperty(m, a);
							x.set(h, _);
							l[m] = true
						}
					} else {
						var b = Ct(_);
						for (var A = 0; A < b.length; ++A) {
							var w = b[A],
								E = v + "." + w;
							if (u[E]) {
								E = u[E]
							}
							if (o[E]) {
								var I = a[E] || i._instanciateStyleProperty(E, a);
								I.set(h, $e(_, w));
								l[E] = true
							}
						}
					}
				}
			}
		}
		return Object.keys(l)
	};
	nl.prototype._setSingleAttribute = function e(t, r, n) {
		var i = this._instanciateStyleProperty(r, this._individualStyles);
		i.setMultiple(t, n)
	};
	nl.prototype.setIndividualStyles = function e(t, r) {
		this._setIndividualStyles(t, r, false, true)
	};
	nl.prototype.setSingleAttribute = function e(t, r, n) {
		r = Array.isArray(r) ? r.join(".") : r;
		this._setSingleAttribute(t, r, n);
		this._computeStyles([r], t);
		this._markToRefresh(t);
		if (r === "x" || r === "y" || r === "radius") {
			this._markAdjacentEdgesToRefresh(t)
		}
	};
	nl.prototype.resetIndividualStyles = function e(t, r) {
		var n = this;
		var i = Object.keys(this._individualStyles);
		if (r) {
			r = _e(r).join(".");
			i = i.filter(function(e) {
				return e.startsWith(r)
			})
		}
		for (var o = 0; o < i.length; ++o) {
			var s = i[o],
				a = n._individualStyles[s];
			for (var u = 0; u < t.length; ++u) {
				a.set(t[u], undefined)
			}
		}
		this._computeStyles(i, t);
		this._markToRefresh(t)
	};
	nl.prototype.computeRules = function e(t) {
		this._computeRules(Object.keys(this._rules), t, true)
	};
	nl.prototype._computeRules = function e(t, r, n) {
		var i = this;
		var o = this._graph,
			s = this._isNode;
		for (var a = 0; a < t.length; ++a) {
			var u = t[a],
				l = i._rules[u],
				d = i._ruleStyles[u] || i._instanciateStyleProperty(u, i._ruleStyles);
			if (!l) {
				d.reset();
				continue
			}
			for (var f = 0; f < r.length; ++f) {
				var h = r[f],
					value = undefined;
				for (var c = 0; c < l.length && value === undefined; ++c) {
					var p = l[c];
					value = p(o._getElement(s, h))
				}
				if (u !== "color" && Array.isArray(value)) {
					value = value[0]
				}
				d.set(h, value)
			}
		}
		if (n) {
			this._computeStyles(t, r);
			this._markToRefresh(r);
			var g = t.reduce(function(e, value) {
				return e || value === "x" || value === "y" || value === "radius"
			}, false);
			if (g) {
				this._markAdjacentEdgesToRefresh(r)
			}
		}
	};
	nl.prototype.getRuleIds = function e() {
		return this._ruleList.map(function(e) {
			var t = e.id;
			return t
		})
	};
	nl.prototype.addRule = function e(t, r) {
		var n = this;
		if (!r) {
			r = t;
			t = undefined
		}
		var i = this.formatStyle(r),
			o = {},
			s = this._nextRuleId++;
		Xe(i, function(e, r) {
			if (typeof e !== "function") {
				var i = e;
				e = new Function("return " + Qe(i) + ";");
				e.metaData = {
					constant: i
				}
			}
			if (t) {
				var s = e,
					a = e.onAdd,
					u = e.onRemove,
					l = e.metaData,
					d = e.getMapping;
				e = function(e) {
					if (t(e)) {
						return s(e)
					}
				};
				e.onAdd = a;
				e.onRemove = u;
				e.metaData = l;
				e.getMapping = d
			}
			if (e.onAdd) {
				e.onAdd(n._isNode)
			}
			o[r] = e
		});
		this._ruleList.unshift({
			id: s,
			style: o
		});
		this._constructRules(Object.keys(i));
		return s
	};
	nl.prototype.removeRule = function e(t) {
		var r = this.getRuleIndex(t),
			n = this._ruleList[r];
		this._removeRule(n);
		this._ruleList.splice(r, 1);
		this._constructRules(Object.keys(n.style))
	};
	nl.prototype._removeRule = function e(t) {
		var r = this;
		Xe(t.style, function(e) {
			if (e.onRemove) {
				e.onRemove(r._isNode)
			}
		})
	};
	nl.prototype.getRuleIndex = function e(t) {
		var r = this;
		for (var n = 0; n < this._ruleList.length; ++n) {
			if (r._ruleList[n].id === t) {
				return n
			}
		}
		throw new Error(this._name + ' style rule "' + t + '" does not exist')
	};
	nl.prototype.setRuleIndex = function e(t, r) {
		var n = this.getRuleIndex(t),
			i = this._ruleList[n];
		this._ruleList.splice(n, 1);
		if (r >= this._ruleList.length) {
			this._ruleList.push(i)
		} else {
			if (r < 0) {
				r = 0
			}
			this._ruleList.splice(r, 0, i)
		}
		this._constructRules(Object.keys(i.style))
	};
	nl.prototype.clearRules = function e() {
		var t = this;
		for (var r = 0; r < this._ruleList.length; ++r) {
			t._removeRule(t._ruleList[r])
		}
		this._ruleList = [];
		this._constructRules(Object.keys(this._rules))
	};
	nl.prototype._constructRules = function e(t) {
		var r = this;
		this._rules = {};
		this._ruleList.forEach(function(e) {
			var t = e.style;
			Xe(t, function(e, t) {
				var n = r._rules[t];
				if (!n) {
					n = [];
					r._rules[t] = n
				}
				n.push(e)
			})
		});
		this.refreshAll();
		this._computeRules(t, this._graph._allIndexes(this._isNode), true)
	};
	nl.prototype.getAttributeRuleList = function e(t) {
		return (this._rules[t] || []).slice()
	};

	function il(e, t, r, n, i, o, s, a) {
		var u;
		if (i) {
			u = n
		} else if (s) {
			u = t === 1 && r === 0 && !a ? 0 : e + 1
		} else if (t % 2 === 1 && !a) {
			u = e === 0 ? 0 : ((e + 1) / 2 | 0) * (e % 2 === 0 ? 1 : -1) * (o ? -1 : 1)
		} else {
			u = ((e / 2 | 0) + 1) * (e % 2 === 0 ? 1 : -1) * (o ? -1 : 1)
		}
		return u
	}
	function ol(e, t, r, n) {
		var i = undefined;
		while (t > 0 && i === undefined) {
			var o = Math.log2(t),
				s = e[o | 0];
			i = s.style[r];
			if (typeof i === "function") {
				i = i(n)
			}
			t -= 1 << o
		}
		return i
	}
	function sl(e, t, r) {
		var n = 1 << t;
		for (var i = 0, o = r.length; i < o; ++i) {
			var s = r[i];
			e.set(s, e.get(s) | n)
		}
	}
	function al(e, t, r) {
		var n = Math.pow(2, e.elementBitSize()) - 1 - (1 << t);
		for (var i = 0, o = r.length; i < o; ++i) {
			var s = r[i];
			e.set(s, e.get(s) & n)
		}
	}
	function ul(e, t) {
		e = e.replace(/\$/g, "\\$");
		if (t) {
			return new RegExp(e + "\\('[ \\w.{}()\",-/*:]+'\\)", "g")
		} else {
			return new RegExp(e, "g")
		}
	}
	function ll(e, t, r) {
		if (!t) {
			t = "'";
			r = "'"
		}
		return e.substring(e.indexOf(t) + 1, e.lastIndexOf(r))
	}
	var dl = "A";
	var fl = "S";
	var hl = "T";
	var cl = "$setting";
	var pl = "$constant";
	var gl = "$component";
	var vl = "$render";
	var yl = "$shapes";
	var _l = "$source";
	var ml = "$target";
	var xl = "$ensure";
	var bl = "$index";
	var Al = "_render";
	var wl = "_shapes";
	var El = "_indexes";
	var Il = "_index";
	var Sl = "_sourceIndexes";
	var Cl = "_targetIndexes";
	var Tl = "_sourceIndex";
	var Ll = "_targetIndex";
	var Nl = "_i";
	var zl = "_l";
	var Ml = "_componentList";
	var kl = "_components";
	var Rl = "_component";
	var Fl = "_getNodeAttribute";
	var Pl = "_getEdgeAttribute";
	var Dl = "_settings";
	var Ol = "_hiddenList";
	var Bl = "_excludedList";
	var Ul = "_nodeHiddenList";
	var Xl = "_nodeExcludedList";
	var jl = "_hidden";
	var Wl = "_contexts";
	var Gl = "_context";
	var Hl = "$context";
	var Yl = ul(dl, true);
	var Vl = ul(fl, true);
	var ql = ul(hl, true);
	var Zl = ul(cl, true);
	var Ql = ul(pl, true);
	var Jl = ul(xl, true);
	var Kl = ul("return");
	var $l = ul(gl);
	var ed = ul(vl);
	var td = ul(yl);
	var rd = ul(_l);
	var nd = ul(ml);
	var id = ul(bl);
	var od = ul(Hl);

	function sd(e) {
		var t = e._drawFunctionModels,
			r = e._isNode,
			n = [],
			i = [],
			o = [],
			s = [],
			a = [],
			u = {},
			l = {},
			d = {},
			f = {},
			h = {},
			c = r ? Fl : Pl,
			p = 1;
		i.push("var " + Ol + " = " + c + "('hidden');");
		i.push("var " + Bl + " = " + c + "('excluded');");
		if (!r) {
			i.push("var " + Sl + " = " + Pl + "('source');");
			i.push("var " + Cl + " = " + Pl + "('target');");
			i.push("var " + Ul + " = " + Fl + "('hidden');");
			i.push("var " + Xl + " = " + Fl + "('excluded');");
			n.push("var " + Tl + " = " + Sl + ".get(" + Il + ")");
			n.push("var " + Ll + " = " + Cl + ".get(" + Il + ")");
			n.push("var " + jl + " = " + Bl + ".get(" + Il + ") || " + Ol + ".get(" + Il + ") || " + Ul + ".get(" + Tl + ") || " + Ul + ".get(" + Ll + ");")
		} else {
			n.push("var " + jl + " = " + Ol + ".get(" + Il + ") || " + Bl + ".get(" + Il + ");")
		}
		for (var g = 0; g < t.length; ++g) {
			i.push("var " + kl + g + " = " + Ml + "[" + g + "];")
		}
		t.forEach(function(t, n) {
			var c = t.body,
				g = c.match(Yl) || [],
				v = c.match(Vl) || [],
				y = c.match(ql) || [],
				_ = c.match(Ql) || [],
				m = c.match(Zl) || [],
				x = c.match(Jl) || [];
			g = g.concat(x);
			c = c.replace(Kl, Rl + " =");
			c = c.replace($l, Rl);
			c = c.replace(ed, Al);
			c = c.replace(td, wl);
			c = c.replace(id, Il);
			if (!r) {
				c = c.replace(rd, Tl);
				c = c.replace(nd, Ll)
			}
			var b = function(t, n, s) {
					var a = ll(t),
						l = n ? u : s ? f : h,
						d = n ? dl : s ? fl : hl,
						g = l[a],
						v = n ? "att" : s ? "srcAtt" : "trgAtt",
						y = "_" + v + "_" + g;
					if (!g) {
						g = p++;
						var _ = n ? e._properties : e._nodes._properties,
							m = _[a],
							x = n ? Il : s ? Tl : Ll,
							b = "_" + v + "List_" + g;
						y = "_" + v + "_" + g;
						l[a] = g;
						if (m && !e._graph.getAttribute(n ? r : true, a)) {
							o.push("var " + y + " = " + JSON.stringify(m.
						default))
						} else {
							i.push("var " + b + " = " + (r || !n ? Fl : Pl) + "('" + a + "');");
							o.push("var " + y + " = " + b + ".get(" + x + ");")
						}
					}
					c = c.replace(ul(d + "\\('" + a + "'\\)"), y);
					c = c.replace(ul(d + '\\("' + a + '"\\)'), y)
				};
			g.forEach(function(e) {
				return b(e, true)
			});
			if (!r) {
				v.forEach(function(e) {
					return b(e, false, true)
				});
				y.forEach(function(e) {
					return b(e, false, false)
				})
			}
			m.forEach(function(e) {
				var t = ll(e),
					r = d[t];
				if (!r) {
					r = "_s" + p++;
					d[t] = r;
					i.push("var " + r + " = " + Dl + "['" + t + "'];")
				}
				c = c.replace(ul(cl + "\\('" + t + "'\\)"), "" + r);
				c = c.replace(ul(cl + '\\("' + t + '"\\)'), "" + r)
			});
			_.forEach(function(e) {
				var t = ll(e),
					r = l[t];
				if (!r) {
					r = "_cst" + p++;
					l[t] = r;
					i.push("var " + r + " = " + t + ";")
				}
				var n = pl + "('" + t + "')";
				while (c.indexOf(n) !== -1) {
					c = c.replace(n, r)
				}
			});
			if (x.length) {
				x = x.map(function(e) {
					return "_att_" + u[ll(e)]
				}).join(" || ");
				c = c.replace(Jl, "");
				c = "\n        if (" + x + ") {\n          " + c + "\n        } else {\n          " + Rl + " = " + Al + ".delete(" + Rl + ");\n        }"
			}
			c = c.replace(od, Gl);
			s.push("    var " + Gl + " = " + Wl + "." + t.feature + ";", "    var " + Rl + " = " + kl + n + ".get(" + Il + ");", c, "    " + kl + n + ".set(" + Il + ", " + Rl + ");", "");
			a.push("    " + Al + ".hide(" + kl + n + ".get(" + Il + "));")
		});
		var v = [i.join("\n"), "", "for (var " + Nl + " = 0, " + zl + " = " + El + ".length; " + Nl + " < " + zl + "; ++" + Nl + ") {", "  var " + Il + " = " + El + "[" + Nl + "];", n.map(function(e) {
			return "  " + e
		}).join("\n"), "", "  if (" + jl + ") {", a.join("\n"), "  } else {", o.map(function(e) {
			return "    " + e
		}).join("\n"), s.join("\n"), "  }", "}"].join("\n");
		return new Function(Al, wl, Fl, Pl, Dl, Ml, El, Wl, "Position", "PositionList", "$utils", v)
	}
	var ad = function e(t, r, n) {
			this._graphics = t;
			this._isNode = r;
			this._id = n;
			this._deleted = false
		};
	ad.prototype._checkDeleted = function e() {
		if (this._deleted) {
			throw new Error("the rule is deleted")
		}
	};
	ad.prototype.whenApplied = function e(t) {
		var r = this;
		this._checkDeleted();
		return new Promise(function(e) {
			return r._graphics._addResolver(e)
		}).then(t)
	};
	ad.prototype.refresh = function e() {
		this._checkDeleted();
		return this._graphics._refreshStyleRules(this._isNode)
	};
	ad.prototype.getIndex = function e() {
		this._checkDeleted();
		return this._graphics._getRuleIndex(this._isNode, this._id)
	};
	ad.prototype.setIndex = function e(t) {
		this._checkDeleted();
		this._graphics._setRuleIndex(this._isNode, this._id, t)
	};
	ad.prototype.delete = function e() {
		this._checkDeleted();
		this._graphics._removeRule(this._isNode, this._id);
		this._deleted = true;
		return this._graphics._refreshStyleRules(this._isNode)
	};
	g.extend(function(e) {
		var t = new dd(e),
			r = e.modules.camera;
		var n = e.Node;
		var i = e.Edge;
		var o = e.NodeList;
		var s = e.EdgeList;
		e.modules.graphics = t;
		e.styles.setNodesVisibility = function(value) {
			return t.setNodesVisibility(value)
		};
		e.styles.setEdgesVisibility = function(value) {
			return t.setEdgesVisibility(value)
		};
		n.prototype.setAttributes = function(e, r) {
			return t.setAttributes(this, e, r)[0]
		};
		n.prototype.setAttribute = function(e, value, r) {
			return t.setAttribute(this, e, value, r)
		};
		n.prototype.getAttributes = function(e) {
			return t.getAttributes(this, e)[0]
		};
		n.prototype.getAttribute = function(e) {
			return t.getAttribute(this, e)[0]
		};
		n.prototype.resetAttributes = function(e) {
			return t.resetAttributes(this, e)
		};
		o.prototype.setAttributes = function(e, r) {
			return t.setAttributes(this, e, r)
		};
		o.prototype.setAttribute = function(e, r, n) {
			return t.setAttribute(this, e, r, n)
		};
		o.prototype.getAttributes = function(e) {
			return t.getAttributes(this, e)
		};
		o.prototype.getAttribute = function(e) {
			return t.getAttribute(this, e)
		};
		o.prototype.resetAttributes = function(e) {
			return t.resetAttributes(this, e)
		};
		i.prototype.setAttributes = function(e, r) {
			return t.setAttributes(this, e, r)[0]
		};
		i.prototype.setAttribute = function(e, value, r) {
			return t.setAttribute(this, e, value, r)
		};
		i.prototype.getAttributes = function(e) {
			return t.getAttributes(this, e)[0]
		};
		i.prototype.getAttribute = function(e) {
			return t.getAttribute(this, e)[0]
		};
		i.prototype.resetAttributes = function(e) {
			return t.resetAttributes(this, e)
		};
		s.prototype.setAttributes = function(e, r) {
			return t.setAttributes(this, e, r)
		};
		s.prototype.setAttribute = function(e, r, n) {
			return t.setAttribute(this, e, r, n)
		};
		s.prototype.getAttributes = function(e) {
			return t.getAttributes(this, e)
		};
		s.prototype.getAttribute = function(e) {
			return t.getAttribute(this, e)
		};
		s.prototype.resetAttributes = function(e) {
			return t.resetAttributes(this, e)
		};
		n.prototype.getPosition = function() {
			return this.getAttributes(["x", "y"])
		};
		o.prototype.getPosition = function() {
			return this.getAttributes(["x", "y"])
		};
		n.prototype.getPositionOnScreen = function() {
			return r.graphToScreenCoordinates(this.getPosition())
		};
		n.prototype.isInScreen = function() {
			var e = this.getPositionOnScreen();
			return e.x >= 0 && e.x <= r.width && e.y >= 0 && e.y <= r.height
		};
		e.styles.addNodeRule = function(e, r) {
			return t.addNodeRule(e, r)
		};
		e.styles.addEdgeRule = function(e, r) {
			return t.addEdgeRule(e, r)
		};
		e.styles.getNodeRules = function() {
			return t.getNodeRules()
		};
		e.styles.getEdgeRules = function() {
			return t.getEdgeRules()
		};
		ud([n, i, o, s], "setStyle", "setAttributes");
		ud([n, i, o, s], "resetStyle", "resetAttributes");
		ud([n, i, o, s], "getStyle", "getAttribute");
		ud([n, o], "setPosition", "setAttributes")
	});

	function ud(e, t, r) {
		for (var n = 0; n < e.length; ++n) {
			var i = e[n];
			i.prototype[t] = function(e, n) {
				De('Deprecated method "' + t + '"; please use "' + r + '" instead.');
				return this[r](e, n)
			}
		}
	}
	var ld = [];
	var dd = function e(t) {
			var r = this;
			var n = t.modules;
			var i = n.settings;
			var o = n.events;
			var s = n.graph;
			var a = n.camera;
			var u = n.render;
			this._graph = s;
			this._render = u;
			this._camera = a;
			this._events = o;
			this._shapes = We({}, {});
			this._cameraForRender = {
				x: 0,
				y: 0,
				angle: 0,
				zoom: 1
			};
			this._animations = [];
			this._animationsToProcess = [];
			this._settings = i._currentValue;
			this._resolvers = [];
			this._refreshNodeRules = false;
			this._refreshEdgeRules = false;
			this._nodeRules = [];
			this._edgeRules = [];
			var l = function() {
					return r.refreshAll()
				};
			i.register("edgeClipping", true, l);
			i.register("edgeClippingPadding", 100, l);
			i.register("edgesAlwaysCurvy", false, function() {
				return r._elts.edges.updateAllCurvatures()
			});
			i.register("directedEdges", false, function() {
				return r._elts.edges.updateAllCurvatures()
			});
			this._featuresVisibility = We({}, {});
			this._showNodes = true;
			this._showEdges = true;
			this._render.setVisibilityConditionTolerance(100);
			var d = new nl(true, t, this._shapes.nodes, this._settings, this._cameraForRender),
				f = new nl(false, t, this._shapes.edges, this._settings, this._cameraForRender, d);
			d._assignEdges(f);
			this._elts = We(d, f);
			this._draw = function() {
				r._elts.nodes.draw();
				r._elts.edges.draw()
			};
			this._xList = this._graph.getNodeAttribute("x");
			this._yList = this._graph.getNodeAttribute("y");
			this.refreshAll();
			o.on({
				clear: function() {
					return r._render.clear()
				},
				cameraMove: function() {
					var e = {
						x: r._camera.width / 2 / r._camera.zoom,
						y: r._camera.height / 2 / r._camera.zoom
					};
					zr(e.x, e.y, 0, 0, r._camera.angle, e);
					r._cameraForRender.x = r._camera.x - e.x;
					r._cameraForRender.y = r._camera.y - e.y;
					r._cameraForRender.angle = r._camera.angle;
					r._cameraForRender.zoom = r._camera.zoom;
					r._render.refresh()
				},
				newFrame: function() {
					if (r._refreshNodeRules) {
						r._computeStyleRules(true);
						r._refreshNodeRules = false
					}
					if (r._refreshEdgeRules) {
						r._computeStyleRules(false);
						r._refreshEdgeRules = false
					}
					r._draw();
					var e = r._resolvers.slice();
					r._resolvers = [];
					e.forEach(function(e) {
						return e()
					});
					if (!r._animationsToProcess.length) {
						return
					}
					var t = r._animationsToProcess;
					r._animationsToProcess = [];
					for (var n = 0; n < t.length; ++n) {
						var i = t[n];
						r._animations.push(i);
						i.timeout = setTimeout(hd(r, i), i.duration);
						i.func();
						r._render.animate(i.duration, r._draw)
					}
				},
				reset: function() {
					r._nodeRules.forEach(function(e) {
						return e.delete()
					});
					r._edgeRules.forEach(function(e) {
						return e.delete()
					})
				},
				reloadFonts: function() {
					r.drawAllSynchronously()
				}
			})
		};
	dd.prototype._getAttributeArray = function e(t, r) {
		return this._elts.fetch(t).getAttributeArray(r)
	};
	dd.prototype._getAttributeArrays = function e(t, r) {
		var n = this;
		return r.map(function(e) {
			return n._getAttributeArray(t, e)
		})
	};
	dd.prototype._addShape = function e(t, r, n) {
		qe(this._shapes.fetch(t), r, n, "shape")
	};
	dd.prototype.getNodeShape = function e(t) {
		return Ze(this._shapes.nodes, t, "shape")
	};
	dd.prototype.getEdgeShape = function e(t) {
		return Ze(this._shapes.edges, t, "shape")
	};
	dd.prototype._addFeature = function e(t, r, n) {
		this._elts.fetch(t).addFeature(r, n);
		this._featuresVisibility.fetch(t)[r] = true
	};
	dd.prototype._setFeatureVisibility = function e(t, r, value) {
		var n = this._elts.fetch(t),
			i = this._featuresVisibility.fetch(t),
			o = i[r];
		if (o !== value) {
			i[r] = value;
			n.setGraphicsVisibility(r, this[t ? "_showNodes" : "_showEdges"] && value)
		}
		return o
	};
	dd.prototype.setNodesVisibility = function e(value) {
		return this._setElementsVisibility(true, !! value)
	};
	dd.prototype.setEdgesVisibility = function e(value) {
		return this._setElementsVisibility(false, !! value)
	};
	dd.prototype._setElementsVisibility = function e(t, value) {
		var r = t ? "_showNodes" : "_showEdges",
			n = this[r];
		if (n !== value) {
			this[r] = value;
			var i = this._elts.fetch(t),
				o = this._featuresVisibility.fetch(t);
			Xe(o, function(e, t) {
				i.setGraphicsVisibility(t, e && value)
			})
		}
		return n
	};
	dd.prototype._refresh = function e(t, r) {
		this._elts.fetch(t).refresh(r)
	};
	dd.prototype._refreshAll = function e(t) {
		this._elts.fetch(t).refreshAll()
	};
	dd.prototype.refreshAll = function e() {
		this._elts.nodes.refreshAll();
		this._elts.edges.refreshAll()
	};
	dd.prototype.camera = function e() {
		return this._cameraForRender
	};
	dd.prototype.animate = function e(t, r, n) {
		var i = this;
		var o = cd(r);
		if (!o) {
			t(n);
			return Promise.resolve(n)
		} else {
			return new Promise(function(e) {
				i._animationsToProcess.push({
					duration: r,
					func: t,
					callback: e,
					callbackArg: n
				});
				i._render.refresh()
			})
		}
	};
	dd.prototype.stopAnimations = function e(t) {
		if (t === void 0) t = true;
		this._render.stopAnimations();
		var r = this._animations.slice();
		this._animations = [];
		for (var n = 0; n < r.length; ++n) {
			var i = r[n];
			if (i.callback && t) {
				i.callback()
			}
			if (i.timeout) {
				clearTimeout(i.timeout)
			}
		}
	};
	dd.prototype.isAnimating = function e() {
		return this._animations.length > 0
	};
	dd.prototype.setAttributes = function e(t, r, n) {
		var i = this;
		var o = fd(n);
		var s = o.duration;
		return this.animate(function() {
			i._elts.fetch(t.isNode).setIndividualStyles(t._indexes, r)
		}, s)
	};
	dd.prototype.setAttribute = function e(t, r, n, i) {
		var o = this;
		var s = fd(i);
		var a = s.duration;
		return this.animate(function() {
			o._elts.fetch(t.isNode).setSingleAttribute(t._indexes, r, n)
		}, a)
	};
	dd.prototype.resetAttributes = function e(t, r) {
		this._elts.fetch(t.isNode).resetIndividualStyles(t._indexes, r)
	};
	dd.prototype.getAttributes = function e(t, r) {
		return this._elts.fetch(t.isNode).getIndividualStyles(t._indexes, r)
	};
	dd.prototype.getAttribute = function e(t, r) {
		return this._elts.fetch(t.isNode).getIndividualStyle(t._indexes, r)
	};
	dd.prototype.addLayer = function e(t, r) {
		if (r === void 0) r = {};
		var n = r.nodeAttributes;
		var i = r.edgeAttributes;
		var o = r.depth;
		if (o === undefined) {
			o = Ze(ld, t, "layer")
		}
		this._elts.nodes.addLayer(t, o, n);
		this._elts.edges.addLayer(t, o, i)
	};
	dd.prototype._resetLayerStyle = function e(t, r, n) {
		if (n === void 0) n = {};
		this._elts.fetch(r).setLayerStyle(t, n)
	};
	dd.prototype._updateLayerStyle = function e(t, r, n) {
		if (n === void 0) n = {};
		this._elts.fetch(r).updateLayerStyle(t, n)
	};
	dd.prototype.putOnLayer = function e(t, r) {
		this._putOnLayer(r.isNode, t, r._indexes)
	};
	dd.prototype._putOnLayer = function e(t, r, n) {
		this._elts.fetch(t).putOnLayer(r, n)
	};
	dd.prototype.removeFromLayer = function e(t, r) {
		this._removeFromLayer(r.isNode, t, r._indexes)
	};
	dd.prototype._removeFromLayer = function e(t, r, n) {
		this._elts.fetch(t).removeFromLayer(r, n)
	};
	dd.prototype.addNodeRule = function e(t, r) {
		return this._addRule(true, t, r)
	};
	dd.prototype.addEdgeRule = function e(t, r) {
		return this._addRule(false, t, r)
	};
	dd.prototype.getNodeRules = function e() {
		return this._getRules(true)
	};
	dd.prototype.getEdgeRules = function e() {
		return this._getRules(false)
	};
	dd.prototype._addRule = function e(t, r, n) {
		var i = this._elts.fetch(t).addRule(r, n),
			o = new ad(this, t, i);
		this[t ? "_nodeRules" : "_edgeRules"][i] = o;
		return o
	};
	dd.prototype._removeRule = function e(t, r) {
		this._elts.fetch(t).removeRule(r);
		this[t ? "_nodeRules" : "_edgeRules"][r] = undefined
	};
	dd.prototype._getRuleIndex = function e(t, r) {
		return this._elts.fetch(t).getRuleIndex(r)
	};
	dd.prototype._setRuleIndex = function e(t, r, n) {
		return this._elts.fetch(t).setRuleIndex(r, n)
	};
	dd.prototype._getRules = function e(t) {
		var r = this[t ? "_nodeRules" : "_edgeRules"];
		return this._elts.fetch(t).getRuleIds().map(function(e) {
			return r[e]
		})
	};
	dd.prototype._computeStyleRules = function e(t, r) {
		if (!r) {
			r = this._graph._allIndexes(t)
		}
		this._elts.fetch(t).computeRules(r)
	};
	dd.prototype._refreshStyleRules = function e(t) {
		var r = this;
		return new Promise(function(e) {
			r._addResolver(e);
			r[t ? "_refreshNodeRules" : "_refreshEdgeRules"] = true
		})
	};
	dd.prototype.drawAllSynchronously = function e() {
		this._elts.nodes.drawAllSynchronously();
		this._elts.edges.drawAllSynchronously()
	};
	dd.prototype._getAttributeRuleList = function e(t, r) {
		return this._elts.fetch(t).getAttributeRuleList(r)
	};
	dd.prototype._addResolver = function e(t) {
		this._resolvers.push(t);
		this._render.refresh()
	};
	dd.prototype._setPositionsByArrays = function e(t, r, n) {
		this._elts.nodes.setIndividualStyles(t, t.map(function(e, t) {
			return {
				x: r[t],
				y: n[t]
			}
		}))
	};
	dd.prototype.toggleTexts = function e(t) {
		var r = t.nodes;
		var n = t.edges;
		return {
			nodes: this._setFeatureVisibility(true, "text", r),
			edges: this._setFeatureVisibility(false, "text", n)
		}
	};

	function fd(e) {
		if (e === void 0) e = {};
		if (typeof e === "number") {
			e = {
				duration: e
			}
		}
		return {
			duration: cd(e.duration),
			skipAnimations: !! e.skipAnimations
		}
	}
	function hd(e, t) {
		return function() {
			var r = e._animations.indexOf(t);
			if (r !== -1) {
				e._animations.splice(r, 1)
			}
			if (t.callback) {
				t.callback(t.callbackArg)
			}
		}
	}
	function cd(e) {
		if (e === undefined || typeof e !== "number" || !isFinite(e) || e < 0) {
			return 0
		} else {
			return e
		}
	}
	var pd = {
		color: {
			check: function(e) {
				return e === null || e === "inherit" || Ne(e)
			},
		default:
			"white"
		},
		scale: {
			check: Se,
		default:
			.45
		},
		positionScale: {
			check: Se,
		default:
			1
		},
		image: {
			check: Le,
		default:
			null
		},
		threshold: {
			check: Se,
		default:
			6
		},
		stroke: {
			color: {
				check: function(e) {
					return e === null || e === "inherit" || Ne(e)
				},
			default:
				"black"
			},
			width: {
				check: Se,
			default:
				2
			}
		},
		text: {
			content: {
				check: Le,
			default:
				null
			},
			color: {
				check: function(e) {
					return e === "inherit" || Ne(e)
				},
			default:
				"black"
			},
			font: {
				check: Te,
			default:
				"Arial"
			},
			style: {
				check: function(e) {
					return ["none", "italic", "bold"].indexOf(e) !== -1
				},
			default:
				"none"
			},
			scale: {
				check: Se,
			default:
				1
			}
		}
	};
	var gd = "\n    var _p = $constant('new Position(\"badgesPosition\")'),\n        _d = $constant('new Position(\"badgesDimensions\")'),\n        SQRT_2 = $constant('Math.sqrt(2)');\n\n    if (!A('badges.{{position}}.text.content') && !A('badges.{{position}}.image')) {\n      return $render.delete($component);\n    } else {\n      var components = $render.updateComposite($component, 4),\n        nodeSize = A('radius'),\n        badgeSize = nodeSize * A('badges.{{position}}.scale'),\n        offset = nodeSize * A('badges.{{position}}.positionScale'),\n        inheritedColor = A('color'),\n        fillColor = A('badges.{{position}}.color'),\n        strokeColor = A('badges.{{position}}.stroke.color'),\n        strokeWidth = A('badges.{{position}}.stroke.width'),\n        text = A('badges.{{position}}.text.content'),\n        textSize = badgeSize * A('badges.{{position}}.text.scale'),\n        textColor = A('badges.{{position}}.text.color'),\n        textFont = A('badges.{{position}}.text.font'),\n        textStyle = A('badges.{{position}}.text.style'),\n        image = A('badges.{{position}}.image'),\n        depth = A('depth');\n\n      if (typeof inheritedColor !== 'string') inheritedColor = inheritedColor[0];\n      if (fillColor === 'inherit') fillColor = inheritedColor;\n      if (strokeColor === 'inherit') strokeColor = inheritedColor;\n      if (textColor === 'inherit') textColor = inheritedColor;\n      if (typeof text === 'number') text = text.toString();\n\n      _p.setXY(A('x') + offset * X_OFFSET_MULTIPLIER / SQRT_2, A('y') + offset * Y_OFFSET_MULTIPLIER / SQRT_2);\n\n      if (fillColor) {\n        components[0] = $render.circle(components[0], _p, badgeSize, 0, fillColor, 'nodeBadge', depth, badgeSize, A('badges.{{position}}.threshold'));\n      } else {\n        components[0] = $render.delete(components[0]);\n      }\n\n      if (strokeColor) {\n        components[1] = $render.circle(components[1], _p, badgeSize, strokeWidth, strokeColor, 'nodeBadgeStroke', depth, badgeSize, A('badges.{{position}}.threshold'));\n      } else {\n        components[1] = $render.delete(components[1]);\n      }\n\n      if (image) {\n        _d.zx = badgeSize;\n        _d.zy = badgeSize;\n        components[2] = $render.image(components[2], _p, _d, image, true, false, 'nodeBadgeImage', depth, badgeSize, A('badges.{{position}}.threshold'));\n      } else {\n        components[2] = $render.delete(components[2]);\n      }\n\n      if (text) {\n        components[3] = $render.text(components[3], _p, text, textFont, textSize, 0, textColor, textStyle, 'center', 'middle', 'nodeBadgeText', depth, badgeSize, A('badges.{{position}}.threshold'));\n      } else {\n        components[3] = $render.delete(components[3]);\n      }\n\n      return $render.composite($component, components);\n    }\n  ";
	var vd = {
		topLeft: [-1, -1],
		topRight: [1, -1],
		bottomLeft: [-1, 1],
		bottomRight: [1, 1]
	};
	var yd = {
		semanticLayers: {
			nodeBadge: {
				defineClipSpace: true
			},
			nodeBadgeStroke: {},
			nodeBadgeImage: {
				useClipSpace: true
			},
			nodeBadgeText: {}
		},
		aliases: {
			"badges.topLeft.text": "badges.topLeft.text.content",
			"badges.topRight.text": "badges.topRight.text.content",
			"badges.bottomLeft.text": "badges.bottomLeft.text.content",
			"badges.bottomRight.text": "badges.bottomRight.text.content"
		},
		properties: {
			badges: {
				bottomRight: pd,
				bottomLeft: pd,
				topRight: pd,
				topLeft: pd
			}
		},
		draw: [_d("topLeft"), _d("bottomLeft"), _d("topRight"), _d("bottomRight")]
	};

	function _d(e) {
		var t = gd;
		while (t.indexOf("{{position}}") !== -1) {
			t = t.replace("{{position}}", e)
		}
		t = t.replace("X_OFFSET_MULTIPLIER", vd[e][0]);
		t = t.replace("Y_OFFSET_MULTIPLIER", vd[e][1]);
		return t
	}
	g.extend(function(e) {
		e.modules.graphics._addFeature(true, "badges", yd)
	});
	var md = {
		properties: {
			halo: {
				color: {
					check: ze,
				default:
					null
				},
				size: {
					check: Se,
				default:
					50
				},
				strokeColor: {
					check: ze,
				default:
					null
				},
				strokeWidth: {
					check: Se,
				default:
					1
				}
			}
		},
		settings: {
			halo: {
				clustering: {
					check: Ee,
				default:
					false
				},
				clusteringMaxRadius: {
					check: Se,
				default:
					1e3
				}
			}
		},
		aliases: {
			halo: "halo.color"
		},
		semanticLayers: {
			nodeHaloStrokes: {},
			nodeHalos: {}
		},
		draw: "$ensure('halo.color');\n\n    var DEPTH = " + xi + ",\n        pos = $constant('new Position(\"halo\")'),\n        c = $render.updateComposite($component, 2);\n\n    c[0] = $render.circle(c[0], pos.setXY(A('x'), A('y')), A('radius'), A('halo.size'), A('halo.color'), 'nodeHalos', DEPTH);\n\n    if (A('halo.strokeColor')) {\n      c[1] = $render.circle(c[1], pos, A('radius'), A('halo.size') + A('halo.strokeWidth'), A('halo.strokeColor'), 'nodeHaloStrokes', DEPTH);\n    } else {\n      c[1] = $render.delete(c[1]);\n    }\n\n    return $render.composite($component, c);",
		context: function e(t, r, n) {
			var e = {
				clusterCircles: [],
				ogma: t,
				clear: function() {
					var e = this;
					for (var r = 0; r < this.clusterCircles.length; ++r) {
						t.render.delete(e.clusterCircles[r])
					}
					this.clusterCircles = [];
					return this.clusterCircles
				}
			};
			t.modules.events.on({
				cameraZoom: function() {
					return xd(t, n.halo, e)
				},
				clear: function() {
					return e.clear()
				}
			});
			return e
		},
		_postDraw: xd
	};

	function xd(e, t, r) {
		if (t.clustering.
	default) {
			var n = e.modules.graph.getFlexArray(true, "halo");
			var i = e.modules.graph.getAttributes(true, ["x", "y", "radius", "halo.size", "halo.color", "halo.strokeColor", "halo.strokeWidth"]);
			var o = i[0];
			var s = i[1];
			var a = i[2];
			var u = i[3];
			var l = i[4];
			var d = i[5];
			var f = i[6];
			var h = e.graph.indexList(true),
				c = h.length,
				p = e.modules.camera.zoom,
				g = e.moudles.render,
				v = xi * 2,
				y = [],
				_ = new Or;
			for (var m = 0; m < c; ++m) {
				var x = h[m];
				if (n.get(x)) {
					y.push([x])
				}
			}
			bd(y, o, s, a, u, l, d, f, p, t.nodeHaloClusteringMaxRadius / p);
			var b = r.clear();
			for (m = 0; m < y.length; ++m) {
				var A = y[m];
				if (!A || A.length === 1) {
					continue
				}
				var w = 0,
					E = 0,
					I = 0;
				for (var S = 0; S < A.length; ++S) {
					x = A[S];
					w += o.get(x);
					E += s.get(x)
				}
				w /= A.length;
				E /= A.length;
				for (S = 0; S < A.length; ++S) {
					x = A[S];
					I = Math.max(I, distance(w, E, o.get(x), s.get(x)) + a.get(x))
				}
				var C = g.circle(-1, _.setXY(w, E), 0, I * p + haloSize, haloColor, "nodeHalos", v);
				b.push(C);
				if (haloStrokeColor) {
					var T = g.circle(-1, _.setXY(w, E), 0, I * p + haloSize + haloStrokeWidth, haloStrokeColor, "nodeHaloStrokes", v);
					b.push(T)
				}
			}
		} else if (r.clusterCircles.length) {
			r.clear()
		}
	}
	function bd(e, t, r, n, i, o, s, a, u, l) {
		var d;
		for (var f = 0; f < e.length; ++f) {
			var h = e[f];
			if (!h) {
				continue
			}
			var c = 0,
				p = 0,
				g = 0;
			for (var v = 0; v < h.length; ++v) {
				d = h[v];
				c += t.get(d);
				p += r.get(d)
			}
			c /= h.length;
			p /= h.length;
			for (v = 0; v < h.length; ++v) {
				d = h[v];
				g = Math.max(g, distance(c, p, t.get(d), r.get(d)) + n.get(d))
			}
			for (v = f + 1; v < e.length; ++v) {
				var y = e[v];
				if (!y) {
					continue
				}
				var _ = 0,
					m = 0,
					x = 0;
				for (var b = 0; b < y.length; ++b) {
					d = y[b];
					_ += t.get(d);
					m += r.get(d)
				}
				_ /= y.length;
				m /= y.length;
				for (b = 0; b < y.length; ++b) {
					d = y[b];
					x = Math.max(x, distance(_, m, t.get(d), r.get(d)) + n.get(d))
				}
				var A = distance(c, p, _, m) * u,
					w = g + x,
					E = w * u + haloSize * 2;
				if (A <= E && E - haloSize <= l) {
					e[f] = h.concat(y);
					e[v] = null;
					bd(e, haloSize, t, r, n, u, l);
					return
				}
			}
		}
	}
	var Ad = {
		properties: {
			halo: {
				color: {
					check: ze,
				default:
					null
				},
				size: {
					check: Se,
				default:
					10
				}
			}
		},
		aliases: {
			halo: "halo.color"
		},
		semanticLayers: {
			edgeHalos: {}
		},
		draw: "$ensure('halo.color');\n\n    var DEPTH = " + xi + ",\n        shape = $shapes[A('shape')],\n        defaultShape = $shapes['line'],\n        params = $constant('{}'),\n        haloSize = A('halo.size'),\n        haloColor = A('halo.color');\n\n    if ($source === $target) {\n      return (shape.haloLoop || defaultShape.haloLoop)($render, $component, S('x'), S('y'), A('width'), haloSize, A('curvature'), S('radius'), haloColor, 'edgeHalos', DEPTH, undefined, undefined, params);\n    } else if (A('curvature') !== 0) {\n      return (shape.haloCurved || defaultShape.haloCurved)($render, $component, S('x'), S('y'), T('x'), T('y'), A('width'), haloSize, A('curvature'), S('radius'), T('radius'), haloColor, 'edgeHalos', DEPTH, undefined, undefined, params);\n    } else {\n      return (shape.haloStraight || defaultShape.haloStraight)($render, $component, S('x'), S('y'), T('x'), T('y'), A('width'), haloSize, S('radius'), T('radius'), haloColor, 'edgeHalos', DEPTH, undefined, undefined, params);\n    }"
	};
	g.extend(function(e) {
		e.modules.graphics._addFeature(true, "halo", md);
		e.modules.graphics._addFeature(false, "halo", Ad)
	});
	var wd = {
		properties: {
			icon: {
				content: {
					check: Le,
				default:
					null
				},
				font: {
					check: Te,
				default:
					"Arial"
				},
				color: {
					check: Ne,
				default:
					"black"
				},
				scale: {
					check: Se,
				default:
					1.4
				},
				threshold: {
					check: Se,
				default:
					5
				}
			}
		},
		aliases: {
			icon: "icon.content"
		},
		semanticLayers: {
			nodeIcons: {
				useClipSpace: true
			}
		},
		draw: "$ensure('icon.content');\n\n    var pos = $constant('new Position()');\n\n    pos.setXY(A('x'), A('y'));\n    return $render.text($component, pos, A('icon.content'), A('icon.font'), A('radius') * A('icon.scale'), 0, A('icon.color'), 'none', 'center', 'middle', 'nodeIcons', A('depth'), A('radius'), A('icon.threshold'));\n  "
	};
	g.extend(function(e) {
		e.modules.graphics._addFeature(true, "icon", wd)
	});
	var Ed = {
		properties: {
			image: {
				url: {
					check: Le,
				default:
					null
				},
				scale: {
					check: Se,
				default:
					1
				},
				rescale: {
					check: Ee,
				default:
					true
				},
				duplicate: {
					check: Ee,
				default:
					false
				},
				threshold: {
					check: Se,
				default:
					5
				}
			}
		},
		aliases: {
			image: "image.url"
		},
		semanticLayers: {
			nodeImages: {
				useClipSpace: true
			}
		},
		draw: "$ensure('image.url');\n\n    var imgCenter = $constant('new Position(\"imgCenter\")'),\n        imgDimensions = $constant('new Position(\"imgDimensions\")'),\n        imgSize = A('radius') * A('image.scale');\n\n    imgCenter.setXY(A('x'), A('y'));\n    imgDimensions.setZXY(imgSize, imgSize);\n\n    return $render.image($component, imgCenter, imgDimensions, A('image.url'), A('image.rescale'), A('image.duplicate'), 'nodeImages', A('depth'), A('radius'), A('image.threshold'));"
	};
	g.extend(function(e) {
		e.modules.graphics._addFeature(true, "image", Ed)
	});
	var Id = 1.1;
	var Sd = 0;
	var Cd = .15;
	var Td = 1;
	var Ld = {
		properties: {
			outline: {
				enabled: {
					check: Ee,
				default:
					false
				},
				color: {
					check: Ne,
				default:
					"rgba(0, 0, 0, 0.36)"
				}
			}
		},
		aliases: {
			outline: "outline.enabled"
		},
		semanticLayers: {
			nodeOutlines: {
				transparency: true
			}
		},
		draw: "\n    $ensure('outline.enabled');\n\n    var EPSILON = " + xi + ",\n        offset = $constant('new Position(\"outline\")'),\n        additionalOffset = A('outerStroke.color') ? A('outerStroke.width') / 2 : 0;\n\n    offset.zy = " + Cd + " * A('radius');\n    offset.oy = " + Td + " + additionalOffset;\n\n    $render.setOffset(offset);\n\n    return $shapes[A('shape')].draw($render, $component, A('x'), A('y'), A('radius') * " + Id + ", " + Sd + " + additionalOffset, A('outline.color'), 'nodeOutlines', A('depth') - EPSILON, A('radius'), A('innerStroke.threshold'));\n\n    $render.setOffset(null);\n  "
	};
	var Nd = 1.1;
	var zd = 0;
	var Md = .15;
	var kd = 1;
	var Rd = {
		properties: {
			outline: {
				enabled: {
					check: Ee,
				default:
					false
				},
				color: {
					check: Ne,
				default:
					"rgba(0, 0, 0, 0.36)"
				}
			}
		},
		aliases: {
			outline: "outline.enabled"
		},
		semanticLayers: {
			edgeOutlines: {
				transparency: true
			}
		},
		draw: "\n    $ensure('outline.enabled');\n\n    var EPSILON = " + xi + ",\n        offset = $constant('new Position(\"outline\")'),\n        additionalOffset = A('strokeWidth'),\n        shape = $shapes[A('shape')],\n        parameters = $constant('{}'),\n        outlineRelativeSize = A('width') * " + Nd + ",\n        outlineAbsoluteSize = A('strokeWidth') + " + zd + ",\n        color = A('outline.color');\n\n    offset.zy = " + Md + " * A('width');\n    offset.oy = " + kd + " + additionalOffset;\n\n    $render.setOffset(offset);\n\n    if ($source === $target) {\n      return shape.drawLoop($render, $component, S('x'), S('y'), outlineRelativeSize, outlineAbsoluteSize, A('curvature'), S('radius'), color, 'edgeOutlines', A('depth') - EPSILON, A('width'), A('threshold'), parameters);\n    } else if (A('curvature') === 0) {\n      return shape.drawStraight($render, $component, S('x'), S('y'), T('x'), T('y'), outlineRelativeSize, outlineAbsoluteSize, S('radius'), T('radius'), color, 'edgeOutlines', A('depth') - EPSILON, A('width'), A('threshold'), parameters);\n    } else {\n      return shape.drawCurved($render, $component, S('x'), S('y'), T('x'), T('y'), outlineRelativeSize, outlineAbsoluteSize, A('curvature'), S('radius'), T('radius'), color, 'edgeOutlines', A('depth') - EPSILON, A('width'), A('threshold'), parameters);\n    }\n\n    $render.setOffset(null);\n  "
	};
	g.extend(function(e) {
		e.modules.graphics._addFeature(true, "outline", Ld);
		e.modules.graphics._addFeature(false, "outline", Rd)
	});
	var Fd = {
		properties: {
			x: {
				check: Ie,
			default:
				0,
				storage: "float"
			},
			y: {
				check: Ie,
			default:
				0,
				storage: "float"
			},
			hidden: {
				check: Ee,
			default:
				false
			},
			radius: {
				check: Se,
			default:
				5,
				storage: "float"
			},
			color: {
				check: function(e) {
					return Ne(e) || Array.isArray(e) && e.every(Ne) && e.length >= 1
				},
			default:
				"grey"
			},
			shape: {
				check: function(value, e) {
					return value in e
				},
			default:
				"circle"
			},
			innerStroke: {
				width: {
					check: Se,
				default:
					2
				},
				color: {
					check: ze,
				default:
					"white"
				},
				threshold: {
					check: Se,
				default:
					5
				}
			},
			outerStroke: {
				width: {
					check: Se,
				default:
					5
				},
				color: {
					check: ze,
				default:
					null
				},
				threshold: {
					check: Se,
				default:
					0
				}
			}
		},
		semanticLayers: {
			nodeOuterStrokes: {},
			nodeInnerStrokes: {},
			nodeShapes: {
				defineClipSpace: true
			},
			nodePieCharts: {
				useClipSpace: true
			}
		},
		draw: ["return $shapes[A('shape')].draw($render, $component, A('x'), A('y'), A('radius'), 0, typeof A('color') === 'string' ? A('color') : 'rgba(0, 0, 0, 0)', 'nodeShapes', A('depth'), A('radius'), 0, $constant('{}'));", "$ensure('innerStroke.color');\n    return $shapes[A('shape')].draw($render, $component, A('x'), A('y'), A('radius'), A('innerStroke.width'), A('innerStroke.color'), 'nodeInnerStrokes', A('depth'), A('radius'), A('innerStroke.threshold'), $constant('{}'));", "$ensure('outerStroke.color');\n    return $shapes[A('shape')].draw($render, $component, A('x'), A('y'), A('radius'), A('innerStroke.width') + A('outerStroke.width'), A('outerStroke.color'), 'nodeOuterStrokes', A('depth'), A('radius'), 0, $constant('{}'));", "  var _p = $constant('new PositionList(3, \"pieCharts\")'),\n          colors = A('color'),\n          nbColors = typeof colors !== 'string' && colors.length;\n\n      if (!nbColors) {\n        return $render.delete($component);\n      } else {\n        var triangles = $render.updateComposite($component, nbColors),\n            x = A('x'), y = A('y'),\n            depth = A('depth'),\n            size = A('radius');\n\n        _p.reset();\n\n        if (nbColors === 1) {\n          triangles[0] = $render.rectangle(triangles[0], _p[0].setXY(x, y), _p[1].setZXY(size, size), colors[0], 'nodePieCharts', depth);\n        } else if (nbColors === 2) {\n          triangles[0] = $render.rectangle(triangles[0], _p[0].setXY(x, y).setZXY(0, size), _p[1].setZXY(size, size), colors[0], 'nodePieCharts', depth);\n          triangles[1] = $render.rectangle(triangles[1], _p[0].setXY(x, y).setZXY(0, -size), _p[1].setZXY(size, size), colors[1], 'nodePieCharts', depth);\n        } else {\n          size *= 2;\n\n          _p.x = x;\n          _p.y = y;\n\n          var step = (2 * Math.PI) / nbColors,\n              startAngle = 0;\n\n          _p[2].zx = size;\n          _p[2].zy = 0;\n\n          for (var j = 0; j < nbColors; ++j) {\n            var endAngle = startAngle + step,\n                endCos = Math.cos(endAngle),\n                endSin = Math.sin(endAngle);\n\n            _p[1].set(_p[2]);\n\n            _p[2].zx = endCos * size;\n            _p[2].zy = endSin * size;\n\n            triangles[j] = $render.triangle(triangles[j], _p[0], _p[1], _p[2], colors[j], 'nodePieCharts', depth);\n\n            startAngle = endAngle;\n          }\n        }\n\n        return $render.composite($component, triangles);\n      }\n    "]
	};
	var Pd = {
		properties: {
			hidden: {
				check: Ee,
			default:
				false
			},
			width: {
				check: Se,
			default:
				1
			},
			color: {
				check: function(e) {
					return e === "source" || e === "target" || Ne(e)
				},
			default:
				"grey"
			},
			shape: {
				check: function(value, e) {
					return value in e
				},
			default:
				"line"
			},
			strokeWidth: {
				check: Se,
			default:
				0
			},
			threshold: {
				check: Se,
			default:
				0
			}
		},
		semanticLayers: {
			edgeShapes: {}
		},
		draw: "\n    var shape = $shapes[A('shape')];\n    var parameters = $constant('{}');\n    var cp = $constant('{x: 0, y: 0}');\n    var color = A('color');\n    var targetSize = T('radius');\n\n    if (color === 'source') {\n      color = S('color');\n    } else if (color === 'target') {\n      color = T('color');\n    }\n\n    if (A('shape') === 'arrow' && $source !== $target) {\n      var dx, dy, badge, multiplier;\n\n      if (A('curvature') === 0) {\n        dx = S('x') - T('x');\n        dy = S('y') - T('y');\n      } else {\n        $utils.getCurveControlPoint(S('x'), S('y'), T('x'), T('y'), A('curvature'), cp);\n        dx = cp.x - T('x');\n        dy = cp.y - T('y');\n      }\n\n      if (dx > 0) {\n        if (dy > 0) {\n          badge = T('badges.bottomRight.text.content') || T('badges.bottomRight.image');\n          multiplier = T('badges.bottomRight.scale') + T('badges.bottomRight.positionScale') - 0.95;\n        } else {\n          badge = T('badges.topRight.text.content') || T('badges.topRight.image');\n          multiplier = T('badges.topRight.scale') + T('badges.topRight.positionScale') - 0.95;\n        }\n      } else {\n        if (dy > 0) {\n          badge = T('badges.bottomLeft.text.content') || T('badges.bottomLeft.image');\n          multiplier = T('badges.bottomLeft.scale') + T('badges.bottomLeft.positionScale') - 0.95;\n        } else {\n          badge = T('badges.topLeft.text.content') || T('badges.topLeft.image');\n          multiplier = T('badges.topLeft.scale') + T('badges.topLeft.positionScale') - 0.95;\n        }\n      }\n\n      if (badge) {\n        var dist = Math.sqrt(dx * dx + dy * dy),\n            sum = Math.abs(dx / dist) + Math.abs(dy / dist),\n            ratio = (sum - 1) / (Math.SQRT2 - 1);\n\n        targetSize *= 1 + (ratio * multiplier);\n      }\n    }\n\n    if (typeof color !== 'string') color = color[0];\n\n    if ($source === $target) {\n      return shape.drawLoop($render, $component, S('x'), S('y'), A('width'), A('strokeWidth'), A('curvature'), S('radius'), color, 'edgeShapes', A('depth'), A('width'), A('threshold'), parameters);\n    } else if (A('curvature') === 0) {\n      return shape.drawStraight($render, $component, S('x'), S('y'), T('x'), T('y'), A('width'), A('strokeWidth'), S('radius'), targetSize, color, 'edgeShapes', A('depth'), A('width'), A('threshold'), parameters);\n    } else {\n      return shape.drawCurved($render, $component, S('x'), S('y'), T('x'), T('y'), A('width'), A('strokeWidth'), A('curvature'), S('radius'), targetSize, color, 'edgeShapes', A('depth'), A('width'), A('threshold'), parameters);\n    }\n  "
	};
	g.extend(function(e) {
		e.modules.graphics._addFeature(true, "shape", Fd);
		e.modules.graphics._addFeature(false, "shape", Pd)
	});
	var Dd = {
		content: {
			check: Le,
		default:
			null
		},
		font: {
			check: Te,
		default:
			"Arial"
		},
		color: {
			check: Ne,
		default:
			"black"
		},
		size: {
			check: Se,
		default:
			12
		},
		scale: {
			check: Se,
		default:
			.2
		},
		backgroundColor: {
			check: function(e) {
				return e === null || e === "inherit" || Ne(e)
			},
		default:
			null
		},
		backgroundMargin: {
			check: Se,
		default:
			2
		},
		secondary: {
			content: {
				check: Le,
			default:
				null
			},
			font: {
				check: Te,
			default:
				"Arial"
			},
			color: {
				check: Ne,
			default:
				"black"
			},
			size: {
				check: Se,
			default:
				10
			},
			scale: {
				check: Se,
			default:
				.15
			},
			style: {
				check: function(e) {
					return ["none", "italic", "bold"].indexOf(e) !== -1
				},
			default:
				"none"
			},
			backgroundColor: {
				check: function(e) {
					return e === null || e === "inherit" || Ne(e)
				},
			default:
				null
			},
			backgroundMargin: {
				check: Se,
			default:
				2
			},
			margin: {
				check: Se,
			default:
				2
			}
		},
		scaling: {
			check: Ee,
		default:
			false
		},
		style: {
			check: function(e) {
				return ["none", "italic", "bold"].indexOf(e) !== -1
			},
		default:
			"none"
		},
		position: {
			check: function(e) {
				return ["right", "left", "top", "bottom", "center"].indexOf(e) !== -1
			},
		default:
			"bottom"
		},
		threshold: {
			check: Se,
		default:
			12
		},
		maxLineLength: {
			check: Se,
		default:
			0
		},
		truncateLength: {
			check: Se,
		default:
			0
		},
		backgroundArrowBaseSize: {
			check: Se,
		default:
			10
		}
	};

	function Od() {
		return "\n    if (A('text.content') !== null || A('text.secondary.content') !== null) {\n      var X_MULTIPLIER = $constant('{ left: -1, right: 1,  top: 0, bottom: 0, center: 0 }'),\n          Y_MULTIPLIER = $constant('{ left: 0, right: 0, top: -1, bottom: 1, center: 0 }'),\n          TEXT_WIDTH_MULTIPLIER = $constant('{ left: -1, right: 0, top: -1/2, bottom: -1/2,  center: -1/2 }'),\n          TEXT_HEIGHT_MULTIPLIER = $constant('{ left: -1/2, right: -1/2, top: -1, bottom: 0, center: -1/2 }'),\n          ARROW_BASE_MULTIPLIER = $constant('2/3');\n\n      var textPosition = new Position(),\n          backgroundDimensions = $constant('new Position(\"textBgDimensions\")'),\n          backgroundCenter = $constant('new Position(\"textBgCenter\")'),\n          p1 = $constant('new Position(\"textP1\")'),\n          p2 = $constant('new Position(\"textP2\")'),\n          p3 = $constant('new Position(\"textP3\")');\n\n      var isFontSizeFixed = !A('text.scaling'),\n          primaryFontSize = isFontSizeFixed ? A('text.size') : A('text.scale') * A('radius'),\n          secondaryFontSize = isFontSizeFixed ? A('text.secondary.size') : A('text.scale') * A('radius'),\n          primaryMargin = A('text.backgroundMargin'),\n          textOffset = primaryMargin + A('innerStroke.width') + A('outerStroke.width') + A('text.backgroundArrowBaseSize') * ARROW_BASE_MULTIPLIER,\n          primaryText = A('text.content'),\n          primaryColor = A('text.color'),\n          primaryFontFamily = A('text.font'),\n          primaryFontStyle = A('text.style'),\n          primaryBackgroundColor = A('text.backgroundColor'),\n          secondaryText = A('text.secondary.content'),\n          secondaryColor = A('text.secondary.color'),\n          secondaryFontFamily = A('text.secondary.font'),\n          secondaryFontStyle = A('text.secondary.style'),\n          secondaryBackgroundColor = A('text.secondary.backgroundColor'),\n          secondaryMargin = A('text.secondary.backgroundMargin'),\n          spaceBetweenTexts = A('text.secondary.margin'),\n          primaryLines = $context.getLines(primaryText, A('text.maxLineLength')),\n          primaryNbLines = primaryLines ? primaryLines.length : 0,\n          secondaryLines = $context.getLines(secondaryText, A('text.maxLineLength')),\n          secondaryNbLines = secondaryLines ? secondaryLines.length : 0,\n          totalNbLines = primaryNbLines + secondaryNbLines,\n          backgroundArrowBase = A('text.backgroundArrowBaseSize'),\n          primaryTextHeight = primaryNbLines * primaryFontSize,\n          secondaryTextHeight = secondaryNbLines * secondaryFontSize,\n          textHeight = primaryTextHeight + secondaryTextHeight,\n          primaryTextWidth = 0,\n          secondaryTextWidth = 0,\n          textWidth;\n\n      var c = $render.updateComposite($component, 4);\n\n      if (primaryBackgroundColor === 'inherit') primaryBackgroundColor = A('color');\n      if (secondaryBackgroundColor === 'inherit') secondaryBackgroundColor = A('color');\n      if (primaryColor === 'inherit') primaryColor = A('color');\n      if (secondaryColor === 'inherit') secondaryColor = A('color');\n\n      for (var i = 0; i < primaryNbLines; ++i) {\n        primaryTextWidth = Math.max(primaryTextWidth, $render.textWidth(primaryLines[i], primaryFontFamily, primaryFontSize, primaryFontStyle));\n      }\n\n      for (var i = 0; i < secondaryNbLines; ++i) {\n        secondaryTextWidth = Math.max(secondaryTextWidth, $render.textWidth(secondaryLines[i], secondaryFontFamily, secondaryFontSize, secondaryFontStyle));\n      }\n\n      textWidth = Math.max(primaryTextWidth, secondaryTextWidth);\n\n      var positionToUse = A('text.position');\n      if (positionToUse === 'center' && (A('icon.content') || A('image.url'))) {\n        positionToUse = 'bottom';\n      }\n\n      var xMult = X_MULTIPLIER[positionToUse],\n          yMult = Y_MULTIPLIER[positionToUse];\n\n      textPosition.setXY(A('x'), A('y'));\n      textPosition.setZXY(xMult * A('radius'), yMult * A('radius'));\n      textPosition.setOXY(xMult * (textOffset), yMult * (textOffset));\n\n      if (isFontSizeFixed) {\n        textPosition.ox += TEXT_WIDTH_MULTIPLIER[positionToUse] * textWidth;\n        textPosition.oy += TEXT_HEIGHT_MULTIPLIER[positionToUse] * textHeight;\n      } else {\n        textPosition.zx += TEXT_WIDTH_MULTIPLIER[positionToUse] * textWidth;\n        textPosition.zy += TEXT_HEIGHT_MULTIPLIER[positionToUse] * textHeight;\n      }\n\n      $context.textPosition.set($index, textPosition);\n      $context.textWidth.set($index, primaryTextWidth);\n      $context.textHeight.set($index, primaryTextHeight);\n\n      // BACKGROUND COLOR\n      if (primaryBackgroundColor) {\n        backgroundDimensions.reset();\n\n        if (isFontSizeFixed) {\n          backgroundDimensions.setOXY(primaryTextWidth / 2 + primaryMargin, primaryTextHeight / 2 + primaryMargin);\n        } else {\n          backgroundDimensions.setZXY(primaryTextWidth / 2, primaryTextHeight / 2);\n          backgroundDimensions.setOXY(primaryMargin, primaryMargin);\n        }\n\n        backgroundCenter.set(textPosition);\n        backgroundCenter[isFontSizeFixed ? 'addOXY' : 'addZXY'](textWidth / 2, primaryTextHeight / 2);\n\n        // TEXT INDICATOR ARROW\n        if (backgroundArrowBase && positionToUse !== 'center') {\n          p1.setXY(A('x'), A('y')).setZXY(xMult * A('radius'), yMult * A('radius')).setOXY(xMult * (textOffset - backgroundArrowBase * ARROW_BASE_MULTIPLIER - primaryMargin + 1), yMult * (textOffset - backgroundArrowBase * ARROW_BASE_MULTIPLIER - primaryMargin + 1));\n          p2.set(p1); p3.set(p1);\n\n          // var offset = primaryMargin + (isFontSizeFixed ? primaryFontSize / 2 : backgroundArrowBase / 2);\n          var offset = backgroundArrowBase / 2;\n\n          p2.addOXY(xMult * backgroundArrowBase * ARROW_BASE_MULTIPLIER + yMult * offset, yMult * backgroundArrowBase * ARROW_BASE_MULTIPLIER + xMult * offset);\n          p3.addOXY(xMult * backgroundArrowBase * ARROW_BASE_MULTIPLIER - yMult * offset, yMult * backgroundArrowBase * ARROW_BASE_MULTIPLIER - xMult * offset);\n\n          c[2] = $render.triangle(c[2], p1, p2, p3, primaryBackgroundColor, 'nodeTextBackground', A('depth'), A('radius'), A('text.threshold'));\n        } else {\n          c[2] = $render.delete(c[2]);\n        }\n\n        c[1] = $render.rectangle(c[1], backgroundCenter, backgroundDimensions, primaryBackgroundColor, 'nodeTextBackground', A('depth'), A('radius'), A('text.threshold'));\n      } else {\n        c[1] = $render.delete(c[1]);\n        c[2] = $render.delete(c[2]);\n      }\n\n      // SECONDARY BACKGROUND COLOR\n\n      if (secondaryBackgroundColor) {\n        backgroundDimensions.reset();\n\n        if (isFontSizeFixed) {\n          backgroundDimensions.setOXY(secondaryTextWidth / 2 + secondaryMargin, secondaryTextHeight / 2 + secondaryMargin);\n        } else {\n          backgroundDimensions.setZXY(secondaryTextWidth / 2, secondaryTextHeight / 2);\n          backgroundDimensions.setOXY(secondaryMargin, secondaryMargin);\n        }\n\n        backgroundCenter.set(textPosition);\n        backgroundCenter[isFontSizeFixed ? 'addOXY' : 'addZXY'](textWidth / 2, primaryTextHeight + secondaryTextHeight / 2);\n\n        backgroundCenter.addOXY(xMult * (primaryMargin + secondaryMargin + spaceBetweenTexts), yMult * (primaryMargin + secondaryMargin + spaceBetweenTexts));\n\n        c[3] = $render.rectangle(c[3], backgroundCenter, backgroundDimensions, secondaryBackgroundColor, 'nodeTextBackground', A('depth'), A('radius'), A('text.threshold'));\n      }\n\n      var absoluteMultiplier = +isFontSizeFixed,\n          relativeMultiplier = (1 - isFontSizeFixed),\n          primaryAbsoluteFontSize = absoluteMultiplier * primaryFontSize,\n          primaryRelativeFontSize = relativeMultiplier * primaryFontSize,\n          secondaryAbsoluteFontSize = absoluteMultiplier * secondaryFontSize,\n          secondaryRelativeFontSize = relativeMultiplier * secondaryFontSize,\n          textAlign = 'left',\n          verticalAlign = 'top',\n          semanticLayer = 'nodeText';\n\n      var textElements = $render.updateComposite(c[0], totalNbLines);\n\n      // if (isFontSizeFixed) {\n      //   textPosition.oy -= (primaryTextHeight / 2 - primaryFontSize / 2);\n      //   textPosition.oy -= (secondaryTextHeight / 2 - secondaryFontSize / 2);\n      // } else {\n      //   textPosition.zy -= (primaryTextHeight / 2 - primaryFontSize / 2);\n      // }\n\n      textPosition[isFontSizeFixed ? 'ox' : 'zx'] += (textWidth - primaryTextWidth) / 2;\n\n      for (var i = 0; i < primaryNbLines; ++i) {\n        textElements[i] = $render.text(textElements[i], textPosition, primaryLines[i], primaryFontFamily, primaryRelativeFontSize, primaryAbsoluteFontSize, primaryColor, primaryFontStyle, textAlign, verticalAlign, semanticLayer, A('depth'), A('radius'), A('text.threshold'));\n        textPosition.oy += primaryAbsoluteFontSize;\n        textPosition.zy += primaryRelativeFontSize;\n      }\n\n      textPosition[isFontSizeFixed ? 'ox' : 'zx'] -= (textWidth - primaryTextWidth) / 2;\n      textPosition[isFontSizeFixed ? 'ox' : 'zx'] += (textWidth - secondaryTextWidth) / 2;\n      textPosition.oy += (primaryMargin + secondaryMargin + spaceBetweenTexts);\n\n      $context.secondaryTextPosition.set($index, textPosition.clone());\n      $context.secondaryTextWidth.set($index, secondaryTextWidth);\n      $context.secondaryTextHeight.set($index, secondaryTextHeight);\n\n      for (var i = 0; i < secondaryNbLines; ++i) {\n        textElements[i+primaryNbLines] = $render.text(textElements[i+primaryNbLines], textPosition, secondaryLines[i], secondaryFontFamily, secondaryRelativeFontSize, secondaryAbsoluteFontSize, secondaryColor, secondaryFontStyle, textAlign, verticalAlign, semanticLayer, A('depth'), A('radius'), A('text.threshold'));\n        textPosition.oy += secondaryAbsoluteFontSize;\n        textPosition.zy += secondaryRelativeFontSize;\n      }\n\n      textPosition[isFontSizeFixed ? 'ox' : 'zx'] -= (textWidth - secondaryTextWidth) / 2;\n      textPosition[isFontSizeFixed ? 'ox' : 'zx'] += (textWidth - primaryTextWidth) / 2;\n      textPosition.oy -= primaryAbsoluteFontSize * primaryNbLines;\n      textPosition.zy -= primaryRelativeFontSize * primaryNbLines;\n\n      textPosition.oy -= (primaryMargin + secondaryMargin + spaceBetweenTexts);\n\n      textPosition.oy -= secondaryAbsoluteFontSize * secondaryNbLines;\n      textPosition.zy -= secondaryRelativeFontSize * secondaryNbLines;\n\n      c[0] = $render.composite(c[0], textElements);\n\n      return $render.composite($component, c);\n    } else {\n      $context.textPosition.set($index, undefined);\n\n      return $render.delete($component);\n    }\n  "
	}
	var Bd = {
		properties: {
			text: Ge(Dd)
		},
		aliases: {
			text: "text.content",
			"text.secondary": "text.secondary.content"
		},
		settings: {
			preventNodeTextOverlap: {
			default:
				true, type: "boolean"
			},
			nodeTextOverlapNbBuckets: {
			default:
				7, type: "positive"
			}
		},
		semanticLayers: {
			nodeTextBackground: {},
			nodeText: {}
		},
		context: function(e, t, r) {
			return {
				textPosition: e.modules.graph.createNodeAttribute({
					name: "textPosition",
					storage: "any"
				}),
				textWidth: e.modules.graph.createNodeAttribute({
					name: "textWidth",
					storage: "float"
				}),
				textHeight: e.modules.graph.createNodeAttribute({
					name: "textHeight",
					storage: "float"
				}),
				secondaryTextPosition: e.modules.graph.createNodeAttribute({
					name: "secondaryTextPosition",
					storage: "any"
				}),
				secondaryTextWidth: e.modules.graph.createNodeAttribute({
					name: "secondaryTextWidth",
					storage: "float"
				}),
				secondaryTextHeight: e.modules.graph.createNodeAttribute({
					name: "secondaryTextHeight",
					storage: "float"
				}),
				getLines: Gd
			}
		},
		draw: Od()
	};
	var Ud = 4;

	function Xd(e) {
		var t = e ? "text.content" : "text.secondary.content",
			r = e ? "" : ".secondary";
		return "\n    $ensure('" + t + "');\n\n    var PI = $constant('Math.PI');\n\n    var textPosition = $constant('new Position(\"text\")'),\n        backgroundDimensions = $constant('new Position(\"textBgDimensions\")'),\n        backgroundCenter = $constant('new Position(\"textBgCenter\")'),\n        controlPoint = $constant('{x1: 0, y1: 0, x2: 0, y2: 0}'),\n        lineInfo = $constant('{angle: 0, length: 0, size: 0, strokeSize: 0, textWidth: 0, textHeight: 0, ratio: 0}');\n\n    var isFontSizeFixed = !A('text.scaling'),\n        fontSize = isFontSizeFixed ? A('text" + r + ".size') : A('text" + r + ".scale') * A('width'),\n        margin = A('text" + r + ".backgroundMargin'),\n        text = A('" + t + "'),\n        color = A('text" + r + ".color'),\n        fontFamily = A('text" + r + ".font'),\n        fontStyle = A('text" + r + ".style'),\n        backgroundColor = A('text" + r + ".backgroundColor'),\n        lines = $context.getLines(text, A('text.maxLineLength')),\n        nbLines = lines ? lines.length : 1,\n        textHeight = nbLines * fontSize,\n        textWidth;\n\n    var c = $render.updateComposite($component, 2);\n\n    if (backgroundColor === 'inherit') backgroundColor = A('color');\n    if (color === 'inherit') color = A('color');\n\n    textWidth = $render.textWidth(lines[0], fontFamily, fontSize, fontStyle);\n    for (var j = 1; j < lines.length; ++j) {\n      textWidth = Math.max(textWidth, $render.textWidth(lines[j], fontFamily, fontSize, fontStyle));\n    }\n\n    var curvature = A('curvature'),\n        sx = S('x'), sy = S('y'), tx = T('x'), ty = T('y'),\n        ss = S('radius'), ts = T('radius'),\n        angle;\n\n    if ($source === $target) {\n      angle = PI / 4;\n      $utils.getLoopControlPoints(sx, sy, curvature, ss, controlPoint);\n      $utils.getPointOnBezierCurve(0.5, sx, sy, tx, ty, controlPoint.x1, controlPoint.y1, controlPoint.x2, controlPoint.y2, textPosition);\n    } else if (curvature === 0) {\n      angle = $utils.lineAngle(sx, sy, tx, ty);\n      textPosition.x = (sx + tx + Math.cos(angle) * ss + Math.cos(angle + PI) * ts) / 2;\n      textPosition.y = (sy + ty + Math.sin(angle) * ss + Math.sin(angle + PI) * ts) / 2;\n    } else {\n      angle = $utils.lineAngle(sx, sy, tx, ty);\n      $utils.getCurveControlPoint(sx, sy, tx, ty, curvature, controlPoint);\n      $utils.getPointOnQuadraticCurve(0.5, sx, sy, tx, ty, controlPoint.x, controlPoint.y, textPosition);\n      textPosition.x += (Math.cos(angle) * ss + Math.cos(angle + PI) * ts) / 2;\n      textPosition.y += (Math.sin(angle) * ss + Math.sin(angle + PI) * ts) / 2;\n    }\n\n    textPosition.oy = (margin + " + Ud + " - A('strokeWidth')) * (" + (e ? "-1" : "1") + ");\n\n    var len = $source === $target ? -100000 : $utils.distance(sx, sy, tx, ty) - ss - ts;\n\n    lineInfo.angle = angle;\n    lineInfo.length = len;\n    lineInfo.size = " + (e ? "1" : "-1") + " * A('width');\n    lineInfo.strokeSize = A('strokeWidth');\n    lineInfo.textWidth = textWidth;\n    lineInfo.textHeight = textHeight;\n    lineInfo.ratio = isFontSizeFixed ? -1 : A('text.scale');\n\n    // TODO: remember bounding box\n    // textBoundingBoxList[index] = [textPosition, lineInfo];\n\n    // BACKGROUND COLOR\n    if (backgroundColor) {\n      backgroundDimensions.reset();\n\n      if (isFontSizeFixed) {\n        backgroundDimensions.setOXY(textWidth / 2 + margin, textHeight / 2 + margin);\n      } else {\n        backgroundDimensions.setZXY(textWidth / 2, textHeight / 2);\n        backgroundDimensions.setOXY(margin, margin);\n      }\n\n      backgroundCenter.set(textPosition);\n\n      c[1] = $render.rectangle(c[1], backgroundCenter, backgroundDimensions, backgroundColor, 'edgeTextBackground', A('depth'), A('width'), A('text.threshold'), lineInfo);\n    } else {\n      c[1] = $render.delete(c[1]);\n    }\n\n    var absoluteFontSize = +isFontSizeFixed && fontSize,\n        relativeFontSize = (1 - isFontSizeFixed) && fontSize,\n        textAlign = 'center',\n        verticalAlign = 'middle',\n        semanticLayer = 'edgeText';\n\n    if (!lines || lines.length === 1) {\n      c[0] = $render.text(c[0], textPosition, text, fontFamily, relativeFontSize, absoluteFontSize, color, fontStyle, textAlign, verticalAlign, semanticLayer, A('depth'), A('width'), A('text.threshold'), lineInfo);\n    } else {\n      var textElements = $render.updateComposite(c[0], lines.length);\n\n      if (isFontSizeFixed) textPosition.oy -= (textHeight / 2 - absoluteFontSize / 2);\n      else textPosition.zy -= (textHeight / 2 - relativeFontSize / 2);\n\n      for (j = 0; j < lines.length; ++j) {\n        textElements[j] = $render.text(textElements[j], textPosition, lines[j], fontFamily, relativeFontSize, absoluteFontSize, color, fontStyle, textAlign, verticalAlign, semanticLayer, A('depth'), A('width'), A('text.threshold'), lineInfo);\n        textPosition.oy += absoluteFontSize;\n        textPosition.zy += relativeFontSize;\n      }\n\n      textPosition.oy -= absoluteFontSize * lines.length;\n      textPosition.zy -= relativeFontSize * lines.length;\n\n      c[0] = $render.composite(c[0], textElements);\n    }\n\n    return $render.composite($component, c);\n  "
	}
	var jd = {
		properties: {
			text: {
				content: {
					check: Le,
				default:
					null
				},
				font: {
					check: Te,
				default:
					"Arial"
				},
				color: {
					check: Ne,
				default:
					"black"
				},
				size: {
					check: Se,
				default:
					12
				},
				scale: {
					check: Se,
				default:
					1
				},
				scaling: {
					check: Ee,
				default:
					false
				},
				style: {
					check: function(e) {
						return ["none", "italic", "bold"].indexOf(e) !== -1
					},
				default:
					"none"
				},
				backgroundColor: {
					check: function(e) {
						return e === null || e === "inherit" || Ne(e)
					},
				default:
					null
				},
				backgroundMargin: {
					check: Se,
				default:
					2
				},
				threshold: {
					check: Se,
				default:
					4
				},
				maxLineLength: {
					check: Se,
				default:
					0
				}
			}
		},
		aliases: {
			text: "text.content"
		},
		semanticLayers: {
			edgeTextBackground: {},
			edgeText: {}
		},
		context: function(e, t) {
			return {
				getLines: Gd
			}
		},
		draw: Xd(true)
	};
	var Wd = {
		properties: {
			text: {
				secondary: {
					content: {
						check: Le,
					default:
						null
					},
					font: {
						check: Te,
					default:
						"Arial"
					},
					color: {
						check: Ne,
					default:
						"black"
					},
					size: {
						check: Se,
					default:
						10
					},
					scale: {
						check: Se,
					default:
						.8
					},
					style: {
						check: function(e) {
							return ["none", "italic", "bold"].indexOf(e) !== -1
						},
					default:
						"none"
					},
					backgroundColor: {
						check: function(e) {
							return e === null || e === "inherit" || Ne(e)
						},
					default:
						null
					},
					backgroundMargin: {
						check: Se,
					default:
						2
					}
				}
			}
		},
		aliases: {
			"text.secondary": "text.secondary.content"
		},
		context: function() {
			return {
				getLines: Gd
			}
		},
		draw: Xd(false)
	};

	function Gd(e, t) {
		if (e === null) {
			return null
		} else {
			e = e.toString()
		}
		var r = e.split("\n"),
			n = [];
		for (var i = 0; i < r.length; ++i) {
			var o = r[i];
			if (!t || t <= 1 || o.length < t) {
				n.push(o)
			} else {
				var s = Hd(r[i], t);
				for (var a = 0; a < s.length; ++a) {
					n.push(s[a])
				}
			}
		}
		return n
	}
	function Hd(e, t) {
		var r = e.split(" "),
			n = [],
			i = 0,
			o = -1,
			s = [],
			a = true;
		for (var u = 0; u < r.length; ++u) {
			if (a) {
				if (r[u].length > t) {
					var l = Yd(r[u], t);
					for (var d = 0; d < l.length; ++d) {
						n.push([l[d]]);
						++o
					}
					i = l[l.length - 1].length
				} else {
					n.push([r[u]]);
					++o;
					i = r[u].length + 1
				}
				a = false
			} else if (i + r[u].length <= t) {
				n[o].push(r[u]);
				i += r[u].length + 1
			} else {
				a = true;
				--u
			}
		}
		for (u = 0; u < n.length; ++u) {
			s.push(n[u].join(" "))
		}
		return s
	}
	function Yd(e, t) {
		var r = [];
		for (var n = 0; n < e.length; n += t - 1) {
			r.push(e.substr(n, t - 1) + "-")
		}
		var i = r[r.length - 1].length;
		r[r.length - 1] = r[r.length - 1].substr(0, i - 1) + " ";
		return r
	}
	g.extend(function(e) {
		e.modules.graphics._addFeature(true, "text", Bd);
		e.modules.graphics._addFeature(false, "text", jd);
		e.modules.graphics._addFeature(false, "secondaryText", Wd);
		e.styles.setNodeTextsVisibility = function(value) {
			return e.modules.graphics._setFeatureVisibility(true, "text", !! value)
		};
		e.styles.setEdgeTextsVisibility = function(value) {
			e.modules.graphics._setFeatureVisibility(false, "secondaryText", !! value);
			return e.modules.graphics._setFeatureVisibility(false, "text", !! value)
		}
	});
	var Vd = new Or;
	var qd = {
		draw: function(e, t, r, n, i, o, s, a, u, l, d) {
			return e.circle(t, Vd.setXY(r, n), i, o, s, a, u, l, d)
		},
		detect: function(e, t, r, n, i) {
			var o = e - n,
				s = t - i;
			return o * o + s * s < r * r
		}
	};
	g.extend(function(e) {
		return e.modules.graphics._addShape(true, "circle", qd)
	});
	var Zd = .31;

	function Qd(e, t, r) {
		e.reset();
		e.x = t;
		e.y = r;
		return e
	}
	function Jd(e, t, r, n, i) {
		e.reset();
		e.zx = t;
		e.zy = r;
		e.ox = n;
		e.oy = i;
		return e
	}
	var Kd = {
		RATIO: Zd,
		_p: new Or,
		_d: new Or,
		draw: function e(t, r, n, i, o, s, a, u, l, d, f) {
			var h = t.updateComposite(r, 2);
			h[0] = t.rectangle(h[0], Qd(this._p, n, i), Jd(this._d, o, o * this.RATIO, s, s), a, u, l, d, f);
			h[1] = t.rectangle(h[1], Qd(this._p, n, i), Jd(this._d, o * this.RATIO, o, s, s), a, u, l, d, f);
			return t.composite(r, h)
		},
		detect: function e(t, r, n, i, o) {
			var s = n * this.RATIO;
			return Fn(i, o, t - n, r - s, t + n, r + s) || Fn(i, o, t - s, r - n, t + s, r + n)
		}
	};
	g.extend(function(e) {
		return e.modules.graphics._addShape(true, "cross", Kd)
	});
	var $d = new Or;
	var ef = new Or;

	function tf(e, t) {
		$d.reset();
		$d.x = e;
		$d.y = t;
		return $d
	}
	function rf(e, t, r, n) {
		ef.reset();
		ef.zx = e;
		ef.zy = t;
		ef.ox = r;
		ef.oy = n;
		return ef
	}
	var nf = {
		draw: function(e, t, r, n, i, o, s, a, u, l, d) {
			return e.rectangle(t, tf(r, n), rf(i, i, o, o), s, a, u, l, d)
		},
		detect: function(e, t, r, n, i) {
			return Fn(n, i, e - r, t - r, e + r, t + r)
		}
	};
	g.extend(function(e) {
		return e.modules.graphics._addShape(true, "square", nf)
	});
	var of = new jr(4);

	function sf(e, t, r, n) {
		of.reset();
		of.x = e;
		of.y = t;
		of[0].zy = -r;
		of[1].zx = r;
		of[2].zy = r;
		of[3].zx = -r;
		of[0].oy = -n;
		of[1].ox = n;
		of[2].oy = n;
		of[3].ox = -n
	}
	var af = {
		draw: function(e, t, r, n, i, o, s, a, u, l, d) {
			sf(r, n, i, o);
			return e.quadrilateral(t, of[0], of[1], of[2], of[3], s, a, u, l, d)
		},
		detect: function(e, t, r, n, i) {
			of.reset();
			of.setXY(e - r, t).setXY(e, t - r).setXY(e + r, t).setXY(e, t + r);
			return Pn(n, i, of)
		}
	};
	g.extend(function(e) {
		return e.modules.graphics._addShape(true, "diamond", af)
	});
	var uf = 5;
	var lf = .4;
	var df = uf * 2;
	var ff = 2 * Math.PI / df;
	var hf = [];
	var cf = [];
	for (var pf = 0; pf < df; ++pf) {
		hf[pf] = Math.cos(pf * ff - Math.PI / 2);
		cf[pf] = Math.sin(pf * ff - Math.PI / 2)
	}
	var gf = new jr(10);
	var vf = {
		draw: function(e, t, r, n, i, o, s, a, u, l, d) {
			gf.reset();
			gf.x = r;
			gf.y = n;
			for (var f = 0; f < df; ++f) {
				var h = f % 2 === 1 ? lf : 1;
				gf[f].zx = hf[f] * i * h;
				gf[f].zy = cf[f] * i * h;
				gf[f].ox = hf[f] * o * h * 2.5;
				gf[f].oy = cf[f] * o * h * 2.5
			}
			return e.polygon(t, gf, s, a, u, l, d)
		},
		detect: function(e, t, r, n, i) {
			gf.reset();
			for (var o = 0; o < df; ++o) {
				var s = o % 2 === 1 ? lf : 1;
				gf[o].x = e + hf[o] * r * s;
				gf[o].y = t + cf[o] * r * s
			}
			return Pn(n, i, gf)
		}
	};
	g.extend(function(e) {
		return e.modules.graphics._addShape(true, "star", vf)
	});
	var yf = [];
	for (var _f = 0; _f < 10; ++_f) {
		yf.push({
			x: 0,
			y: 0
		})
	}
	var mf = {
		draw: function(e, t, r, n, i, o, s, a, u, l, d, f) {
			if (f === void 0) f = {};
			var h = f.numPoints || 5,
				c = new jr(h),
				p = -Math.PI / 2 + (f.rotate || 0),
				g = 2 * Math.PI / h;
			c.x = r;
			c.y = n;
			for (var v = 0; v < h; ++v) {
				var y = Math.cos(p),
					_ = Math.sin(p);
				c[v].setZXY(y * i, _ * i);
				c[v].setOXY(y * o, _ * o);
				p += g
			}
			return e.polygon(t, c, s, a, u, l, d)
		},
		detect: function(e, t, r, n, i, o) {
			var s = o.numPoints || 5,
				a = -Math.PI / 2 + (o.rotate || 0),
				u = 2 * Math.PI / s;
			for (var l = 0; l < s; ++l) {
				yf[l].x = e + Math.cos(a) * r;
				yf[l].y = t + Math.sin(a) * r;
				a += u
			}
			return Pn(n, i, yf, s)
		}
	};
	g.extend(function(e) {
		return e.modules.graphics._addShape(true, "equilateral", mf)
	});
	var xf = new Or;
	var bf = new Or;
	var Af = {};
	var wf = new Or;
	var Ef = new Or;
	var If = new Or;
	var Sf = new Or;

	function Cf(e, t, r, n, i, o, s, a, u, l, d, f, h, c, p) {
		xf.x = r;
		xf.y = n;
		bf.x = i;
		bf.y = o;
		return e.line(t, xf, bf, s, a, d, f, h, c, p)
	}
	function Tf(e, t, r, n, i, o, s, a, u, l, d, f, h, c, p, g) {
		wf.reset();
		If.reset();
		Sf.reset();
		If.x = r;
		If.y = n;
		Sf.x = i;
		Sf.y = o;
		$u(r, n, i, o, u, wf);
		return e.quadraticCurve(t, If, wf, Sf, s, a, f, h, c, p, g)
	}
	function Lf(e, t, r, n, i, o, s, a, u, l, d, f, h) {
		wf.reset();
		Ef.reset();
		If.reset();
		wf.reset();
		Ef.reset();
		If.reset();
		If.x = r;
		If.y = n;
		el(r, n, s, a, Af);
		wf.x = Af.x1;
		wf.y = Af.y1;
		Ef.x = Af.x2;
		Ef.y = Af.y2;
		return e.cubicCurve(t, If, wf, Ef, If, i, o, u, l, d, f, h)
	}
	var Nf = {
		drawStraight: Cf,
		drawCurved: Tf,
		drawLoop: Lf,
		detectStraight: function(e, t, r, n, i, o, s, a, u) {
			return _r(e, t, r, n, i, o, s)
		},
		detectCurved: function(e, t, r, n, i, o, s, a, u, l) {
			$u(r, n, i, o, a, Af);
			return Gn(e, t, r, n, i, o, Af.x, Af.y, s / 2)
		},
		detectLoop: function(e, t, r, n, i, o, s) {
			el(r, n, o, s, Af);
			return Zn(e, t, r, n, r, n, Af.x1, Af.y1, Af.x2, Af.y2, i / 2)
		},
		haloStraight: Cf,
		haloCurved: Tf,
		haloLoop: Lf
	};
	g.extend(function(e) {
		return e.modules.graphics._addShape(false, "line", Nf)
	});

	function zf(e, t) {
		if (t === undefined) {
			t = 3
		}
		return e + Math.log(e + 1) * t
	}
	var Mf = new Or;
	var kf = new Or;
	var Rf = new Or;
	var Ff = new Or;
	var Pf = new jr(3);
	var Df = {};
	var Of = {
		drawStraight: Bf(false),
		drawCurved: Uf(false),
		drawLoop: Xf(false),
		haloStraight: Bf(true),
		haloCurved: Uf(true),
		haloLoop: Xf(true),
		detectStraight: function(e, t, r, n, i, o, s, a, u) {
			var l = zf(s),
				d = distance(r, n, i, o),
				f = (i - r) / d,
				h = (o - n) / d,
				c = i - f * (l + u),
				p = o - h * (l + u),
				g = i - f * u,
				v = o - h * u,
				y = yr(c, p, i, o, l);
			return _r(e, t, r, n, c, p, s) || Mn(e, t, y.x1, y.y1, y.x2, y.y2, g, v)
		},
		detectCurved: function(e, t, r, n, i, o, s, a, u, l) {
			Zf(r, n, i, o, s, a, l);
			return Gn(e, t, r, n, Hf, Yf, Wf.x, Wf.y, s / 2) || Mn(e, t, Hf + Vf, Yf + qf, Hf + qf * .6, Yf - Vf * .6, Hf - qf * .6, Yf + Vf * .6)
		},
		detectLoop: function(e, t, r, n, i, o, s) {
			Qf(r, n, i, o, s);
			return Zn(e, t, Hf, Yf, r, n, Wf.x1, Wf.y1, Wf.x2, Wf.y2, i / 2) || Mn(e, t, Hf + Vf, Yf + qf, Hf + qf * .6, Yf - Vf * .6, Hf - qf * .6, Yf + Vf * .6)
		}
	};

	function Bf(e) {
		return function(t, r, n, i, o, s, a, u, l, d, f, h, c, p, g, v) {
			if (v === void 0) v = {};
			var y = zf(a, v.arrowSizeRatio),
				_ = u / 2,
				m = distance(n, i, o, s),
				x = (o - n) / m,
				b = (s - i) / m,
				A = o - x * (y + d),
				w = s - b * (y + d),
				E = o - x * d,
				I = s - b * d,
				S = -b,
				C = x,
				T = A + S * (y / 2),
				L = w + C * (y / 2),
				N = A - S * (y / 2),
				z = w - C * (y / 2),
				M = A + S * _,
				k = w + C * _,
				R = A - S * _,
				F = w - C * _;
			Mf.x = n;
			Mf.y = i;
			kf.x = A;
			kf.y = w;
			Pf.reset();
			Pf[0].setXY(T, L);
			Pf[1].setXY(N, z);
			Pf[2].setXY(E, I);
			Pf[0].setAXY(M - A, k - w);
			Pf[1].setAXY(R - A, F - w);
			if (e) {
				Pf[2].setAXY(x * _, b * _);
				Pf[0].ax -= x * _;
				Pf[0].ay -= b * _;
				Pf[1].ax -= x * _;
				Pf[1].ay -= b * _
			}
			var P = t.updateComposite(r, 2);
			P[0] = t.line(P[0], Mf, kf, a, u, f, h, c, p, g);
			P[1] = t.triangle(P[1], Pf[0], Pf[1], Pf[2], f, h, c, p, g);
			return t.composite(r, P)
		}
	}
	function Uf(e) {
		return function(t, r, n, i, o, s, a, u, l, d, f, h, c, p, g, v, y) {
			if (y === void 0) y = {};
			Zf(n, i, o, s, a, l, f, y.arrowSizeRatio);
			Mf.setXY(n, i);
			kf.setXY(Hf, Yf);
			Rf.setXY(Wf.x, Wf.y);
			Pf.reset();
			Pf[0].setXY(Hf + Vf, Yf + qf);
			Pf[1].setXY(Hf + qf * .6, Yf - Vf * .6);
			Pf[2].setXY(Hf - qf * .6, Yf + Vf * .6);
			Zf(n, i, o, s, u, l, f, y.arrowSizeRatio);
			Pf[1].setAXY(qf * .3, -Vf * .3);
			Pf[2].setAXY(-qf * .3, Vf * .3);
			if (e) {
				Pf[0].setAXY(Vf, qf);
				Pf[1].ax -= (Vf - qf) * .3;
				Pf[1].ay -= (qf + Vf) * .3;
				Pf[2].ax -= (Vf + qf) * .3;
				Pf[2].ay -= (qf - Vf) * .3
			}
			var _ = t.updateComposite(r, 2);
			_[0] = t.quadraticCurve(_[0], Mf, Rf, kf, a, u, h, c, p, g, v);
			_[1] = t.triangle(_[1], Pf[0], Pf[1], Pf[2], h, c, p, g, v);
			return t.composite(r, _)
		}
	}
	function Xf(e) {
		return function(t, r, n, i, o, s, a, u, l, d, f, h, c, p) {
			p = p || Df;
			Qf(n, i, o, a, u, p.arrowSizeRatio);
			Mf.setXY(n, i);
			kf.setXY(Hf, Yf);
			Rf.setXY(Wf.x1, Wf.y1);
			Ff.setXY(Wf.x2, Wf.y2);
			Pf.reset();
			Pf[0].setXY(Hf + Vf, Yf + qf);
			Pf[1].setXY(Hf + qf * .6, Yf - Vf * .6);
			Pf[2].setXY(Hf - qf * .6, Yf + Vf * .6);
			Qf(n, i, s, a, u, p.arrowSizeRatio);
			Pf[1].setAXY(qf * .3, -Vf * .3);
			Pf[2].setAXY(-qf * .3, Vf * .3);
			if (e) {
				Pf[0].setAXY(Vf, qf);
				Pf[1].ax -= (Vf - qf) * .3;
				Pf[1].ay -= (qf + Vf) * .3;
				Pf[2].ax -= (Vf + qf) * .3;
				Pf[2].ay -= (qf - Vf) * .3
			}
			var g = t.updateComposite(r, 2);
			g[0] = t.cubicCurve(g[0], Mf, Ff, Rf, kf, o, s, l, d, f, h, c);
			g[1] = t.triangle(g[1], Pf[0], Pf[1], Pf[2], l, d, f, h, c);
			return t.composite(r, g)
		}
	}
	var jf;
	var Wf = {};
	var Gf;
	var Hf;
	var Yf;
	var Vf;
	var qf;

	function Zf(e, t, r, n, i, o, s, a) {
		jf = zf(i, a);
		$u(e, t, r, n, o, Wf);
		Gf = distance(r, n, Wf.x, Wf.y);
		Hf = Wf.x + (r - Wf.x) * (Gf - jf - s) / Gf;
		Yf = Wf.y + (n - Wf.y) * (Gf - jf - s) / Gf;
		Vf = (r - Wf.x) * jf / Gf;
		qf = (n - Wf.y) * jf / Gf
	}
	function Qf(e, t, r, n, i, o) {
		jf = zf(r, o);
		el(e, t, n, i, Wf);
		var s = i + (r - n),
			a = s / 2;
		Wf.x1 += s;
		Wf.y1 += s;
		Wf.y2 -= a;
		Gf = Math.sqrt(Math.pow(e - Wf.x1, 2) + Math.pow(t - Wf.y1, 2));
		Hf = Wf.x1 + (e - Wf.x1) * (Gf - jf - i) / Gf;
		Yf = Wf.y1 + (t - Wf.y1) * (Gf - jf - i) / Gf;
		Vf = (e - Wf.x1) * jf / Gf;
		qf = (t - Wf.y1) * jf / Gf
	}
	g.extend(function(e) {
		return e.modules.graphics._addShape(false, "arrow", Of)
	});
	var Jf = 3;
	var Kf = 3 / 8;
	var $f = tl(Jf, Kf);
	g.extend(function(e) {
		return e.modules.graphics._addShape(false, "dashed", $f)
	});
	var eh = 1;
	var th = 1;
	var rh = tl(eh, th);
	g.extend(function(e) {
		return e.modules.graphics._addShape(false, "dotted", rh)
	});
	var nh = {};
	var ih = {};
	var oh = new Or;
	var sh = new Or;
	var ah = new Or;
	var uh = new Or;
	var lh = new Or;
	var dh = new Or;
	var fh = new Or;
	var hh = new Or;
	var ch = new Or;
	var ph = new Or;
	var gh = new Or;
	var vh = 40;
	var yh = new jr(vh * 2 + 1);
	var _h = {
		drawStraight: Ah,
		drawCurved: xh,
		drawLoop: mh,
		haloStraight: Ah,
		haloCurved: xh,
		haloLoop: mh,
		detectStraight: function(e, t, r, n, i, o, s, a, u) {
			yr(r, n, i, o, 2 * s, nh);
			return Mn(e, t, nh.x1, nh.y1, nh.x2, nh.y2, i, o)
		},
		detectCurved: function(e, t, r, n, i, o, s, a, u, l) {
			wh(r, n, i, o, s, 0, a, u, l);
			return Pn(e, t, yh)
		},
		detectLoop: function(e, t, r, n, i, o, s) {
			Eh(r, n, i, 0, o, s);
			return Pn(e, t, yh)
		}
	};

	function mh(e, t, r, n, i, o, s, a, u, l, d, f, h) {
		Eh(r, n, i, o, s, a);
		return e.polygon(t, yh, u, l, d, f, h)
	}
	function xh(e, t, r, n, i, o, s, a, u, l, d, f, h, c, p, g) {
		wh(r, n, i, o, s, a, u, l, d);
		return e.polygon(t, yh, f, h, c, p, g)
	}
	var bh = new jr(4);

	function Ah(e, t, r, n, i, o, s, a, u, l, d, f, h, c, p) {
		var g = distance(r, n, i, o);
		Er(r, n, i, o, 1, nh);
		var v = (r - i) / g,
			y = (n - o) / g,
			_ = -y,
			m = v,
			x = a / 2;
		bh.reset().setXY(r + _ * s, n + m * s).setXY(r - _ * s, n - m * s).setXY(i + v * l, o + y * l).setXY(i + v * l, o + y * l);
		bh.setAXY(_ * x, m * x).setAXY(-_ * x, -m * x).setAXY((-_ - v) * x, (-m - y) * x).setAXY((_ - v) * x, (m - y) * x);
		return e.quadrilateral(t, bh[0], bh[1], bh[2], bh[3], d, f, h, c, p)
	}
	function wh(e, t, r, n, i, o, s, a, u) {
		$u(e, t, r, n, s, ih);
		var l = distance(ih.x, ih.y, r, n);
		oh.setXY(e, t);
		sh.setXY(r + (ih.x - r) / l * u, n + (ih.y - n) / l * u);
		ah.setXY(ih.x, ih.y);
		Ch(oh, ah, ah, sh, 2 * i, o, Ih)
	}
	function Eh(e, t, r, n, i, o) {
		el(e, t, i, o, ih);
		var s = distance(ih.x2, ih.y2, e, t);
		oh.setXY(e, t);
		sh.setXY(e + (ih.x1 - e) / s * o, t + (ih.y1 - t) / s * o);
		ah.setXY(ih.x1, ih.y1);
		uh.setXY(ih.x2, ih.y2);
		Ch(oh, uh, ah, sh, 2 * r, n, Sh)
	}
	function Ih(e, t, r, n, i, o) {
		Wn(e, t.x, t.y, i.x, i.y, r.x, r.y, o)
	}
	function Sh(e, t, r, n, i, o) {
		Vn(e, t.x, t.y, i.x, i.y, r.x, r.y, n.x, n.y, o)
	}
	function Ch(e, t, r, n, i, o, s) {
		s(0, e, t, r, n, lh);
		s(1 / vh, e, t, r, n, dh);
		Xr(lh, dh, i, o, hh, ch, ph, gh);
		yh[0].set(hh);
		yh[vh * 2].set(ch);
		yh[vh * 2 - 1].set(ph);
		yh[1].set(gh);
		for (var a = 2; a < vh; ++a) {
			s(a / vh, e, t, r, n, fh);
			Xr(dh, fh, i * (1 - a / vh), o, hh, ch, ph, gh);
			hh.set(ph);
			ch.set(gh);
			yh[vh * 2 - a].set(hh);
			yh[a].set(ch);
			lh.set(dh);
			dh.set(fh)
		}
		yh[vh].set(n)
	}
	g.extend(function(e) {
		return e.modules.graphics._addShape(false, "tapered", _h)
	});
	g.extend(function(e) {
		e.modules.ruleRefresher = new Th(e)
	});
	var Th = function e(t) {
			var r = this;
			this._graph = t.modules.graph;
			this._graphics = t.modules.graphics;
			this._events = t.modules.events;
			this._events.on({
				updateNodeData: function(e) {
					var t = e.nodes;
					return Lh(r, t, {
						styles: true,
						filters: true
					})
				},
				updateEdgeData: function(e) {
					var t = e.edges;
					return Nh(r, t, {
						styles: true,
						filters: true
					})
				}
			})
		};

	function Lh(e, t, r) {
		var n = r.styles;
		var i = r.filters;
		var o = t.getAdjacentNodes({
			includeSources: true,
			filter: "all"
		})._indexes,
			s = t.getAdjacentEdges({
				filter: "all"
			})._indexes;
		if (i) {
			e._graph._refreshFilterRules(true, o);
			e._graph._refreshFilterRules(false, s)
		}
		if (n) {
			e._graphics._computeStyleRules(true, o);
			e._graphics._computeStyleRules(false, s)
		}
	}
	function Nh(e, t, r) {
		var n = r.styles;
		var i = r.filters;
		var o = t.getSource().concat(t.getTarget()).dedupe(),
			s = t._indexes;
		if (i) {
			e._graph._refreshFilterRules(true, o);
			e._graph._refreshFilterRules(false, s)
		}
		if (n) {
			e._graphics._computeStyleRules(true, o);
			e._graphics._computeStyleRules(false, s)
		}
	}
	var zh = function e(t) {
			var r = t.modules;
			var n = r.graph;
			var i = r.graphics;
			var o = r.camera;
			var s = r.settings;
			this._graph = n;
			this._camera = o;
			this._graphics = i;
			this._settings = s
		};
	zh.prototype.getNodesInScreenByDistance = function e(t) {
		var r = t.getPositionOnScreen();
		var n = r.x;
		var i = r.y;
		return this._graph.getNodes().filter(function(e) {
			return e.isInScreen() && e !== t
		}).sort(function(e, t) {
			var r = e.getPositionOnScreen(),
				o = t.getPositionOnScreen();
			return distance(r.x, r.y, n, i) - distance(o.x, o.y, n, i)
		})
	};
	zh.prototype.getNearestNodesForNode = function e(t, r, n) {
		if (r === void 0) r = 240;
		var i = t.getPosition();
		var o = i.x;
		var s = i.y;
		return this.getNearestNodes(o, s, r, n, t)
	};
	zh.prototype.getNearestNodes = function e(t, r, n, i, o) {
		if (i) {
			var s = this._camera.screenToGraphVector({
				x: n,
				y: n
			});
			n = distance(0, 0, s.x, s.y)
		}
		return this._getNearestNodes(t, r, n, o)
	};
	zh.prototype._getNearestNodes = function e(t, r, n, i) {
		var o = [];
		var s = n * n;
		var a = i ? i._index : 0;
		var u = this._graph._getIndexes(true);
		var l = this._graph.getAttributes(true, ["excluded", "x", "y"]);
		var d = l[0];
		var f = l[1];
		var h = l[2];
		var c = this._graphics._getAttributeArray(true, "hidden");
		for (var p = 0, g = u.length; p < g; p++) {
			var v = u[p];
			if (v === a || c.get(v) || d.get(v)) {
				continue
			}
			var y = t - f._buffer[v],
				_ = r - h._buffer[v];
			if (y * y + _ * _ <= s) {
				o.push(v)
			}
		}
		return new this._graph.NodeList(o)
	};
	zh.prototype.getPointsForEdge = function e(t, r) {
		if (r === void 0) r = false;
		var n = 10;
		var i = this._graph.getEdgeAttribute("curvature"),
			o = t.getSource(),
			s = t.getTarget(),
			a = o.getPosition(),
			u = s.getPosition(),
			l = i.get(t._index),
			d = a,
			f = u,
			h;
		if (r) {
			d = this._camera.graphToScreenCoordinates(d);
			f = this._camera.graphToScreenCoordinates(f)
		}
		if (l === 0 && o !== s) {
			h = [d, f]
		} else {
			h = new Array(n);
			if (o !== s) {
				var c = $u(a.x, a.y, u.x, u.y, l);
				if (r) {
					c = this._camera.graphToScreenCoordinates(c)
				}
				for (var p = 0; p < n; ++p) {
					h[p] = Wn(p / (n - 1), d.x, d.y, f.x, f.y, c.x, c.y)
				}
			} else {
				var g = el(a.x, a.y, l, o.getAttribute("radius")),
					v = {
						x: g.x1,
						y: g.y1
					},
					y = {
						x: g.x2,
						y: g.y2
					};
				if (r) {
					v = this._camera.graphToScreenCoordinates(v);
					y = this._camera.graphToScreenCoordinates(y)
				}
				for (var _ = 0; _ < n; ++_) {
					h[_] = Vn(_ / (n - 1), d.x, d.y, f.x, f.y, v.x, v.y, y.x, y.y)
				}
			}
		}
		return h
	};
	zh.prototype.getNodesByBoundingBox = function e(t, r, n, i, o) {
		if (o) {
			var s;
			s = this._camera.screenToGraphVector({
				x: t,
				y: r
			});
			t = s.x;
			r = s.y;
			s = this._camera.screenToGraphVector({
				x: n,
				y: i
			});
			n = s.x;
			i = s.y
		}
		var a = this._graph;
		var u = a._getIndexes(true);
		var l = [];
		var d = a.getAttributes(true, ["excluded", "x", "y"]);
		var f = d[0];
		var h = d[1];
		var c = d[2];
		var p = this._graphics._getAttributeArray(true, "hidden");
		for (var g = 0, v = u.length; g < v; g++) {
			var y = u[g];
			if (p.get(y) || f.get(y)) {
				continue
			}
			var _ = h._buffer[y],
				m = c._buffer[y];
			if (_ >= t && _ <= n && m >= r && m <= i) {
				l.push(y)
			}
		}
		return new a.NodeList(l)
	};
	g.extend(function(e) {
		var t = new zh(e);
		e.modules.spatial = t
	});
	g.extend(function(e) {
		var t = new kh(e);
		e.modules.watcher = t;
		e.schema = {
			watchNodeObjectProperty: function e(r) {
				return t.watchNodeObjectProperty(r)
			},
			watchEdgeObjectProperty: function e(r) {
				return t.watchEdgeObjectProperty(r)
			},
			watchNodeNonObjectProperty: function e(r) {
				return t.watchNodeNonObjectProperty(r)
			},
			watchEdgeNonObjectProperty: function e(r) {
				return t.watchEdgeNonObjectProperty(r)
			}
		}
	});

	function Mh(e) {
		if (typeof e !== "object" || e === null || Array.isArray(e)) {
			return {
				path: Rh(e),
				unwindArrays: false
			}
		} else {
			return {
				path: Rh(e.path),
				unwindArrays: !! e.unwindArrays
			}
		}
	}
	var kh = function e(t) {
			var r = this;
			this._data = t.modules.data;
			this._graph = t.modules.graph;
			this._events = t.modules.events;
			this._infoWatchers = [];
			this._propWatchers = [];
			this._toUpdate = [];
			this._ogma = t;
			this._events.on({
				"refreshNodeFilters refreshEdgeFilters": function(e) {
					var t = e.isNode;
					var n = e.newlyIncluded;
					var i = e.newlyExcluded;
					for (var o = 0, s = r._infoWatchers.length; o < s; o++) {
						var a = r._infoWatchers[o];
						if (a.isNode === t) {
							jh(a, n.getData(a.property));
							Wh(a, i.getData(a.property));
							Ph(a)
						}
					}
				},
				"updateNodeData updateEdgeData": function(e) {
					var t = e.isNode;
					var n = e.changes;
					for (var i = 0; i < r._infoWatchers.length; ++i) {
						var o = r._infoWatchers[i],
							s = o.property;
						if (o.isNode !== t) {
							continue
						}
						for (var a = 0; a < n.length; ++a) {
							var u = n[a],
								l = u.property || [],
								d = Oh(l, s);
							if (d) {
								var f = u.nodes || u.edges,
									h = [],
									c = [];
								for (var p = 0; p < f.size; ++p) {
									var g = f.get(p);
									if (!g.isExcluded()) {
										h.push($e(u.newValues[p], d));
										c.push($e(u.previousValues[p], d))
									}
								}
								if (h.length) {
									jh(o, h);
									Wh(o, c);
									Ph(o)
								}
							}
						}
					}
					for (var v = 0, y = r._propWatchers.length; v < y; v++) {
						var _ = r._propWatchers[v];
						var m = _._path;
						var x = function(e) {
								var t = n[e];
								var r = t.property;
								var i = t.nodes;
								var o = t.edges;
								var s = i || o,
									a = s.isNode;
								if (!r || r.length <= m.length + 1 && m.map(function(e, t) {
									return e === r[t]
								}).reduce(function(e, t) {
									return e && t
								}, true)) {
									qh(_, a, s)
								}
							};
						for (var b = 0; b < n.length; ++b) x(b)
					}
				},
				"addNodes addEdges": function(e) {
					var t = e.nodes;
					var n = e.edges;
					var i = t || n;
					var o = function(e) {
							var t = r._infoWatchers[e];
							if (t.isNode === i.isNode) {
								setTimeout(function() {
									var e = Fh(i, t.property);
									if (e.length) {
										jh(t, e);
										Ph(t)
									}
								}, 0)
							}
						};
					for (var s = 0; s < r._infoWatchers.length; ++s) o(s);
					for (var a = 0, u = r._propWatchers.length; a < u; a++) {
						qh(r._propWatchers[a], i.isNode, i)
					}
				},
				"beforeRemoveNodes beforeRemoveEdges": function(e) {
					var t = e.nodes;
					var n = e.edges;
					var i = t || n;
					var o = function(e) {
							var t = r._infoWatchers[e];
							if (t.isNode === i.isNode) {
								var n = Fh(i, t.property);
								if (n.length) {
									setTimeout(function() {
										Wh(t, n);
										Ph(t)
									}, 0)
								}
							}
						};
					for (var s = 0; s < r._infoWatchers.length; ++s) o(s)
				},
				kill: function() {
					r._propWatchers.forEach(function(e) {
						return e.kill()
					});
					r._infoWatchers = [];
					r._propWatchers = []
				}
			})
		};
	kh.prototype._watchPropertyInformation = function e(t, r, n, i) {
		var o = Bh(this, t, r);
		if (!o) {
			o = Xh(this, t, r, i)
		}
		if (n) {
			o.onChange.push(n);
			this._infoWatchers.push(o)
		}
		return o.info
	};
	kh.prototype._unwatchPropertyInformation = function e(t, r, n) {
		var i = Bh(this, t, r);
		if (!i) {
			return
		}
		var o = i.onChange,
			s = o.indexOf(n);
		if (s !== -1) {
			o.splice(s, 1);
			if (o.length === 0) {
				this._infoWatchers.splice(this._infoWatchers.indexOf(i, 1))
			}
		}
	};
	kh.prototype._watchObjectProperty = function e(t, r) {
		var n = r.path;
		var i = r.unwindArrays;
		var o = new Yh(this, t, n, i);
		this._propWatchers.push(o);
		qh(o, t, this._graph[t ? "getNodes" : "getEdges"]());
		return o
	};
	kh.prototype._watchNonObjectProperty = function e(t, r) {
		var n = r.path;
		var i = r.unwindArrays;
		return new Vh(this, t, n, i)
	};
	kh.prototype.watchNodeObjectProperty = function e(t) {
		return this._watchObjectProperty(true, Mh(t))
	};
	kh.prototype.watchEdgeObjectProperty = function e(t) {
		return this._watchObjectProperty(false, Mh(t))
	};
	kh.prototype.watchNodeNonObjectProperty = function e(t) {
		return this._watchNonObjectProperty(true, Mh(t))
	};
	kh.prototype.watchEdgeNonObjectProperty = function e(t) {
		return this._watchNonObjectProperty(false, Mh(t))
	};

	function Rh(value) {
		if (value === null || value === undefined) {
			return []
		} else {
			return _e(value)
		}
	}
	function Fh(e, t) {
		var r = new Array(e.size),
			n = 0;
		for (var i = 0; i < e.size; ++i) {
			var o = e.get(i);
			if (!o.isExcluded()) {
				r[n] = o.getData(t);
				n += 1
			}
		}
		r.length = n;
		return r
	}
	function Ph(e) {
		for (var t = 0; t < e.onChange.length; ++t) {
			e.onChange[t](e.info)
		}
	}
	function Dh(e, t) {
		if (e.length !== t.length) {
			return false
		}
		for (var r = 0; r < e.length; ++r) {
			if (e[r] !== t[r]) {
				return false
			}
		}
		return true
	}
	function Oh(e, t) {
		if (e.length > t.length) {
			return null
		}
		for (var r = 0; r < e.length; ++r) {
			if (e[r] !== t[r]) {
				return null
			}
		}
		return t.slice(r)
	}
	function Bh(e, t, r) {
		for (var n = 0; n < e._infoWatchers.length; ++n) {
			var i = e._infoWatchers[n];
			if (i.isNode === t && Dh(i.property, r)) {
				return i
			}
		}
		return null
	}
	var Uh = function e(t) {
			this._watcher = t
		};
	Uh.prototype.isNode = function e() {
		return this._watcher.isNode
	};
	Uh.prototype.getPath = function e() {
		return this._watcher.property.slice()
	};
	Uh.prototype.getBoundaries = function e() {
		var t = this._watcher.boundaries;
		return t ? {
			min: t.min,
			max: t.max
		} : null
	};
	Uh.prototype.getValues = function e() {
		return this._watcher.values.keys()
	};
	Uh.prototype.getValueCount = function e(value) {
		return this._watcher.values.get(value) || 0
	};
	Uh.prototype.getCount = function e() {
		return this._watcher.nbTotal
	};
	Uh.prototype.getType = function e() {
		if (this._watcher.nbAny > 0) {
			return "any"
		} else if (this._watcher.nbNumbers > 0) {
			return "number"
		} else {
			return "undefined"
		}
	};

	function Xh(e, t, r, n) {
		var i = {
			isNode: t,
			property: r,
			nbNumbers: 0,
			nbAny: 0,
			nbTotal: 0,
			values: new cr,
			boundaries: null,
			onChange: [],
			unwindArrays: n,
			info: undefined
		};
		i.info = new Uh(i);
		jh(i, e._ogma[t ? "getNodes" : "getEdges"]().getData(r));
		return i
	}
	function jh(e, t, r) {
		var n = e.values,
			i = !r && e.unwindArrays;
		for (var o = 0; o < t.length; ++o) {
			var value = t[o];
			if (!r && value !== undefined) {
				e.nbTotal += 1
			}
			if (i && Array.isArray(value)) {
				jh(e, value, true)
			} else {
				var s = n.get(value);
				if (s) {
					n.set(value, s + 1)
				} else {
					n.set(value, 1);
					if (Hh(value)) {
						if (!e.boundaries) {
							e.boundaries = {
								min: value,
								max: value
							}
						} else if (value < e.boundaries.min) {
							e.boundaries.min = value
						} else if (value > e.boundaries.max) {
							e.boundaries.max = value
						}
						e.nbNumbers += 1
					} else if (value !== undefined) {
						e.nbAny += 1
					}
				}
			}
		}
	}
	function Wh(e, t, r) {
		var n = e.values,
			i = !r && e.unwindArrays,
			o = e.boundaries,
			s = false;
		for (var a = 0; a < t.length; ++a) {
			var value = t[a];
			if (!r && value !== undefined) {
				e.nbTotal -= 1
			}
			if (i && Array.isArray(value)) {
				s |= Wh(e, value, true)
			} else {
				var u = n.get(value);
				if (u > 1) {
					n.set(value, u - 1)
				} else {
					n.delete(value);
					if (Hh(value)) {
						e.nbNumbers -= 1;
						if (o && (o.min === value || o.max === value)) {
							s = true
						}
					} else if (value !== undefined) {
						e.nbAny -= 1
					}
				}
			}
		}
		if (!r && s) {
			e.boundaries = Gh(n.keys())
		}
		return s
	}
	function Gh(e) {
		var t = undefined,
			r = undefined;
		for (var n = 0; n < e.length; ++n) {
			var value = e[n];
			if (Hh(value)) {
				if (t === undefined || value < t) {
					t = value
				}
				if (r === undefined || value > r) {
					r = value
				}
			}
		}
		return t === undefined ? null : {
			min: t,
			max: r
		}
	}
	function Hh(value) {
		return typeof value === "number" && isFinite(value)
	}
	var Yh = function e(t, r, n, i) {
			this._module = t;
			this._isNode = r;
			this._path = n;
			this._unwindArrays = i;
			this._propertyList = [];
			this._properties = {};
			this._onAddHandlers = [];
			this._onRemoveHandlers = [];
			this._onUpdateHandlers = []
		};
	Yh.prototype.onPropertyAdded = function e(t) {
		this._onAddHandlers.push(t);
		return this
	};
	Yh.prototype.onPropertyRemoved = function e(t) {
		this._onRemoveHandlers.push(t);
		return this
	};
	Yh.prototype.onPropertyUpdated = function e(t) {
		this._onUpdateHandlers.push(t);
		return this
	};
	Yh.prototype.getPath = function e() {
		return this._path.slice()
	};
	Yh.prototype.getProperties = function e() {
		return this._propertyList.slice()
	};
	Yh.prototype.getPropertyInfo = function e(t) {
		var r = this._properties[t];
		return r ? r.info : null
	};
	Yh.prototype.kill = function e() {
		Kh(this)
	};
	var Vh = function e(t, r, n, i) {
			var o = this;
			this._module = t;
			this._isNode = r;
			this._path = n || [];
			this._onUpdateHandlers = [];
			this._unwindArrays = i;
			this._triggerUpdate = function(e) {
				for (var t = 0; t < o._onUpdateHandlers.length; ++t) {
					o._onUpdateHandlers[t](e)
				}
			};
			this._info = t._watchPropertyInformation(this._isNode, this._path, this._triggerUpdate, this._unwindArrays)
		};
	Vh.prototype.onUpdate = function e(t) {
		this._onUpdateHandlers.push(t)
	};
	Vh.prototype.getPropertyInfo = function e() {
		return this._info
	};
	Vh.prototype.getPath = function e() {
		return this._path.slice()
	};
	Vh.prototype.kill = function e() {
		this._module._unwatchPropertyInformation(this._isNode, this._path, this._triggerUpdate)
	};

	function qh(e, t, r) {
		if (t !== e._isNode) {
			return
		}
		var n = r.getData(e._path);
		for (var i = 0, o = n.length; i < o; i++) {
			var s = n[i];
			if (ke(s)) {
				var a = Object.keys(s);
				for (var u = 0, l = a.length; u < l; u++) {
					Zh(e, a[u])
				}
			}
		}
	}
	function Zh(e, t) {
		if (!e._properties[t]) {
			var r = e._path.concat([t]),
				n = function(r) {
					return Qh(e, t)
				},
				i = e._module._watchPropertyInformation(e._isNode, r, n, e._unwindArrays);
			e._properties[t] = {
				handler: n,
				info: i
			};
			Qh(e, t)
		}
	}
	function Qh(e, t) {
		var r = e._properties[t];
		var n = r.info;
		var i = e._propertyList.indexOf(t),
			o = i !== -1,
			s = n.getType() !== "undefined";
		if (!o && s) {
			e._propertyList.push(t);
			Jh(e, "_onAddHandlers", t, n)
		} else if (o && !s) {
			e._propertyList.splice(i, 1);
			Jh(e, "_onRemoveHandlers", t, n)
		} else if (o && s) {
			Jh(e, "_onUpdateHandlers", t, n)
		}
	}
	function Jh(e, t, r, n) {
		var i = e[t];
		for (var o = 0, s = i.length; o < s; o++) {
			i[o](r, n)
		}
	}
	function Kh(e) {
		Xe(e._properties, function(t, r) {
			var n = t.handler;
			var i = e._path.concat([r]);
			e._module._unwatchPropertyInformation(e._isNode, i, n)
		});
		e._propertyList = undefined;
		e._properties = undefined;
		e._onAddHandlers = undefined;
		e._onRemoveHandlers = undefined;
		e._onUpdateHandlers = undefined;
		e._module._propWatchers.splice(e._module._propWatchers.indexOf(e), 1)
	}
	g.extend(function(e) {
		var t = new $h(e);
		e.modules.rules = t;
		e.rules = {
			map: function e(r) {
				return t.createMapping(r)
			},
			slices: function e(r) {
				return t.createSlices(r)
			},
			template: function e(r) {
				return t.createTemplate(r)
			}
		}
	});
	var $h = function e(t) {
			this._ogma = t;
			this._graph = t.modules.graph;
			this._graphics = t.modules.graphics;
			this._watcher = t.modules.watcher;
			this._data = t.modules.data;
			this._events = t.modules.events
		};
	$h.prototype.createMapping = function e(t) {
		if (t === void 0) t = {};
		var r = t.field;
		var n = t.values;
		if (n === void 0) n = {};
		var i = t.fallback;
		r = _e(r);
		if (!Ke(i)) {
			i = [i]
		}
		if (i.length === 0) {
			i = [undefined]
		}
		if (typeof n !== "object" || n === null || Ke(n)) {
			throw new Error('"mapping" should be an object')
		}
		return rc(this, r, function(e) {
			return ec(e.getValues(), n, i)
		})
	};
	$h.prototype.createSlices = function e(t) {
		if (t === void 0) t = {};
		var r = t.field;
		var n = t.fallback;
		var i = t.stops;
		if (i === void 0) i = {};
		var o = t.values;
		if (o === void 0) o = {
			nbSlices: 7
		};
		var s = t.reverse;
		if (s === void 0) s = false;
		r = _e(r);
		if (!o.nbSlices) {
			o.nbSlices = 7
		}
		return rc(this, r, function(e) {
			return tc(e.getValues(), e.getBoundaries(), n, i, o, s)
		})
	};
	$h.prototype.createTemplate = function e(t) {
		if (typeof t !== "string") {
			throw new TypeError('"template" should be a string')
		}
		var r = [],
			n = 0;
		while (true) {
			var i = -1,
				o = t.indexOf("{{", n);
			if (o !== -1) {
				i = t.indexOf("}}", o + 2)
			}
			if (i !== -1) {
				r.push(t.substring(n, o));
				r.push(t.substring(o + 2, i));
				n = i + 2
			} else {
				r.push(t.slice(n));
				break
			}
		}
		return function(e) {
			var t = r[0];
			for (var n = 1; n < r.length; n += 2) {
				t += e.getData(r[n]);
				t += r[n + 1]
			}
			return t
		}
	};

	function ec(e, t, r) {
		e = e.map(function(e) {
			return "" + e
		}).sort();
		var n = 0,
			i = {};
		for (var o = 0; o < e.length; ++o) {
			var value = e[o];
			if (value in t) {
				i[value] = t[value]
			} else {
				i[value] = r[n];
				n = (n + 1) % r.length
			}
		}
		return i
	}
	function tc(e, t, r, n, i, o) {
		var s = {};
		if (!t) {
			for (var a = 0; a < e.length; ++a) {
				s[e[a]] = r
			}
		} else {
			var u = Ke(i) ? i.length : i.nbSlices,
				l, d;
			if (Ke(n)) {
				l = n.slice()
			} else {
				var f = n.min;
				var h = n.max;
				if (f === undefined || h === undefined) {
					f = t.min;
					h = t.max
				}
				var c = (h - f) / u;
				l = [];
				for (var p = 1; p < u; ++p) {
					l.push(f + c * p)
				}
			}
			if (Ke(i)) {
				d = i
			} else {
				var g = i.min;
				var v = i.max;
				var y = l.length + 1,
					_ = (v - g) / l.length;
				d = [];
				for (var m = 0; m < y; ++m) {
					d.push(g + m * _)
				}
			}
			if (o) {
				d.reverse()
			}
			if (l.length !== d.length - 1) {
				throw new Error("there should be exactly one more value that stops")
			}
			for (var x = 0; x < e.length; ++x) {
				var value = e[x],
					b = +value;
				if (!isFinite(b)) {
					s[value] = r
				} else {
					for (var A = 0; A < l.length && l[A] <= value; ++A) {}
					s[value] = d[A]
				}
			}
		}
		return s
	}
	function rc(e, t, r) {
		var n = {
			field: t,
			mapping: null
		},
			i = function(t) {
				n.mapping = r(t);
				e._graphics._computeStyleRules(t.isNode());
				nc(e)
			},
			o = function(o) {
				var s = e._watcher._watchPropertyInformation(o, t, i, true);
				n.mapping = r(s);
				nc(e)
			},
			s = function(r) {
				e._watcher._unwatchPropertyInformation(r, t, i);
				nc(e)
			},
			a = function(e) {
				var value = e.getData(t),
					r = n.mapping;
				if (Ke(value)) {
					return value.map(function(e) {
						return r[e]
					})
				} else {
					return r[value]
				}
			};
		a.onAdd = o;
		a.onRemove = s;
		a.metaData = n;
		a.getMapping = function() {
			return Ge(n.mapping)
		};
		return a
	}
	function nc(e) {
		e._ogma.modules.legend.refresh()
	}
	var ic = 40;
	var oc = "quadraticInOut";
	var sc = 100;
	g.atInit(function(e) {
		e.view.locateGraph()
	});
	g.extend(function(e) {
		var t = new ac(e);
		var r = e.Node;
		var n = e.Edge;
		var i = e.NodeList;
		var o = e.EdgeList;
		e.modules.locate = t;
		r.prototype.locate = function(e) {
			return t.locateNodes(this, e)
		};
		i.prototype.locate = function(e) {
			return t.locateNodes(this, e)
		};
		n.prototype.locate = function(e) {
			return t.locateEdges(this, e)
		};
		o.prototype.locate = function(e) {
			return t.locateEdges(this, e)
		};
		r.prototype.getBoundingBox = function() {
			return t.nodesBoundingBox(this)
		};
		i.prototype.getBoundingBox = function() {
			return t.nodesBoundingBox(this)
		};
		n.prototype.getBoundingBox = function() {
			return t.edgesBoundingBox(this)
		};
		o.prototype.getBoundingBox = function() {
			return t.edgesBoundingBox(this)
		};
		e.view.locateGraph = function(e) {
			return t.locateNodes(undefined, e)
		};
		e.view.locateRawGraph = function(e, r) {
			return t.locateRawGraph(e.nodes, r)
		};
		e.view.getGraphBoundingBox = function() {
			return t.graphBoundingBox()
		}
	});
	var ac = function e(t) {
			this._ogma = t;
			this._camera = t.modules.camera;
			this._graph = t.modules.graph;
			this._settings = t.modules.settings
		};
	ac.prototype.locateNodes = function e(t, r) {
		if (r === void 0) r = {};
		var n = this._graph._getIndexes(true, t);
		return lc(this, true, n, r)
	};
	ac.prototype.locateEdges = function e(t, r) {
		if (r === void 0) r = {};
		var n = this._graph._getIndexes(false, t);
		return lc(this, false, n, r)
	};
	ac.prototype.locateRawGraph = function e(t, r) {
		var n = hc(t);
		return uc(this, n, r)
	};
	ac.prototype.graphBoundingBox = function e() {
		return this._nodesBoundingBoxes(this._graph._filter(true, this._graph._getIndexes(true), "visible"))
	};
	ac.prototype.nodesBoundingBox = function e(t) {
		if (!t) {
			return this.graphBoundingBox()
		} else if (Ke(t)) {
			t = this._ogma.getNodes(t)
		}
		return this._nodesBoundingBoxes(t._indexes)
	};
	ac.prototype.edgesBoundingBox = function e(t) {
		return this._edgesBoundingBox(t._indexes)
	};
	ac.prototype._nodesBoundingBoxes = function e(t) {
		var r = Infinity,
			n = Infinity,
			i = -Infinity,
			o = -Infinity,
			s = 0,
			a = Infinity,
			u = 0;
		var l = this._graph.getAttributes(true, ["radius", "x", "y", "hidden", "excluded"]);
		var d = l[0];
		var f = l[1];
		var h = l[2];
		var c = l[3];
		var p = l[4];
		for (var g = 0, v = t.length; g < v; ++g) {
			var y = t[g],
				_ = c.get(y),
				m = p.get(y);
			if (!_ && !m) {
				var x = d.get(y),
					b = f.get(y),
					A = h.get(y);
				s = Math.max(s, x);
				a = Math.min(a, x);
				r = Math.min(r, b - x);
				n = Math.min(n, A - x);
				i = Math.max(i, b + x);
				o = Math.max(o, A + x);
				u += 1
			}
		}
		return {
			minX: r,
			minY: n,
			maxX: i,
			maxY: o,
			cx: r + (i - r) / 2,
			cy: n + (o - n) / 2,
			width: i - r,
			height: o - n,
			sideSize: Math.max(i - r, o - n),
			maxSize: s,
			minSize: a,
			count: u
		}
	};
	ac.prototype._edgesBoundingBox = function e(t) {
		var r = Infinity,
			n = Infinity,
			i = -Infinity,
			o = -Infinity,
			s = 0;
		var a = this._graph.getAttributes(false, ["source", "target", "curvature", "excluded", "hidden"]);
		var u = a[0];
		var l = a[1];
		var d = a[2];
		var f = a[3];
		var h = a[4];
		var c = this._graph.getAttributes(true, ["x", "y", "radius"]);
		var p = c[0];
		var g = c[1];
		var v = c[2];
		for (var y = 0, _ = t.length; y < _; ++y) {
			var m = t[y],
				x = u.get(m),
				b = l.get(m),
				A = v.get(x),
				w = f.get(m),
				E = h.get(m),
				I = p.get(x),
				S = g.get(x),
				C = v.get(b),
				T = p.get(b),
				L = g.get(b),
				N = d.get(m);
			if (E || w) {
				continue
			}
			s = Math.max(s, Math.max(A, C));
			if (x === b) {
				var z = A + N;
				r = Math.min(r, I - Hn * z);
				n = Math.min(n, S - A);
				i = Math.max(i, I + A);
				o = Math.max(o, S + Hn * z)
			} else {
				r = Math.min(r, Math.min(I - A, T - C));
				n = Math.min(n, Math.min(S - A, L - C));
				i = Math.max(i, Math.max(I + A, T + C));
				o = Math.max(o, Math.max(S + A, L + C))
			}
		}
		return {
			minX: r,
			minY: n,
			maxX: i,
			maxY: o,
			cx: (i + r) / 2,
			cy: (o + n) / 2,
			width: i - r,
			height: o - n,
			maxSize: s
		}
	};
	ac.prototype._graphInCamera = function e() {
		var t = this.nodesBoundingBox(this._graph._allIndexes(true)),
			r = this._camera,
			n = r.width / r.zoom / 2,
			i = r.height / r.zoom / 2,
			o = r.x - n,
			s = r.y - i,
			a = r.x + n,
			u = r.y + i,
			l = t.minX,
			d = t.minY,
			f = t.maxX,
			h = t.maxY;
		return (o < l && l < a || l < o && o < f) && (s < d && d < u || d < s && s < h)
	};
	ac.prototype.computeCameraConfig = function e(t, r) {
		if (r === void 0) r = {};
		return dc(this, this.nodesBoundingBox(t), r)
	};
	ac.prototype._computeConfigForBounds = function e(t, r) {
		if (r === void 0) r = {};
		return dc(this, t, r)
	};

	function uc(e, t, r) {
		if (r === void 0) r = {};
		var n = r.padding;
		if (n === void 0) n = {};
		var i = r.easing;
		if (i === void 0) i = oc;
		var o = r.duration;
		if (o === void 0) o = 0;
		var s = e._camera,
			a = dc(e, t, n),
			u = a.x,
			l = a.y,
			d = a.zoom,
			f = d / s.zoom;
		return fc(s, u, l, d, o, i, f)
	}
	function lc(e, t, r, n) {
		if (r.length === 0) {
			return Promise.resolve()
		} else {
			return uc(e, e[t ? "_nodesBoundingBoxes" : "_edgesBoundingBox"](r), n)
		}
	}
	function dc(e, t, r) {
		var n, i, o, s;
		if (typeof r === "number") {
			n = r;
			i = r;
			o = r;
			s = r
		} else {
			n = Be(r.left, ic);
			i = Be(r.right, ic);
			o = Be(r.top, ic);
			s = Be(r.bottom, ic)
		}
		var a = (e._camera.width - n - i) / (t.maxX - t.minX),
			u = (e._camera.height - o - s) / (t.maxY - t.minY),
			l = a < u ? a : u,
			d = e._settings.get("maxZoom"),
			f = e._settings.get("minZoom");
		if (sc && t.maxSize * l > sc) {
			l = sc / t.maxSize
		}
		if (l > d) {
			l = d
		} else if (l < f) {
			l = f
		}
		return {
			x: t.cx + (i - n) / (l * 2),
			y: t.cy + (s - o) / (l * 2),
			zoom: l
		}
	}
	function fc(e, t, r, n, i, o, s) {
		if (s > 1.01) {
			e.setCenter({
				x: t,
				y: r
			}, {
				duration: i,
				easing: o
			});
			return e.setZoom(n, {
				duration: i,
				easing: o,
				startAfter: .5
			})
		} else if (s < .99) {
			e.setCenter({
				x: t,
				y: r
			}, {
				duration: i,
				easing: o,
				startAfter: .5
			});
			return e.setZoom(n, {
				duration: i,
				easing: o
			})
		} else {
			return e.setCenter({
				x: t,
				y: r
			}, {
				duration: i,
				easing: o
			})
		}
	}
	function hc(e) {
		var t = Infinity,
			r = Infinity,
			n = -Infinity,
			i = -Infinity;
		for (var o = 0; o < e.length; ++o) {
			var s = e[o],
				a = s.x || 0,
				u = s.y || 0,
				l = +(s.style && s.style.size) || 5;
			t = Math.min(t, a - l);
			r = Math.min(r, u - l);
			n = Math.max(n, a + l);
			i = Math.max(i, u + l)
		}
		return {
			minX: t,
			minY: r,
			maxX: n,
			maxY: i,
			cx: t + (n - t) / 2,
			cy: r + (i - r) / 2,
			width: n - t,
			height: i - r
		}
	}
	g.extend(function(e) {
		e.modules.imports = new cc(e);
		e.fetch = function(e) {
			return tr(e)
		}
	});
	var cc = function e(t) {
			this._ogma = t;
			this._graph = t.modules.graph;
			this._locate = t.modules.locate;
			this._render = t.modules.render;
			this._camera = t.modules.camera;
			this._importers = {}
		};
	cc.prototype.from = function e(t, r) {
		var n = this._importers[t];
		if (!n) {
			throw new Error(t + " is not a valid importer.")
		}
		return new Promise(function(e, t) {
			try {
				var i = n.translate(r);
				e(i)
			} catch (e) {
				t(e)
			}
		})
	};
	cc.prototype.register = function e(t, r) {
		if (typeof r === "function") {
			r = {
				translate: r,
				webWorkerCompatible: false
			}
		}
		qe(this._importers, t, r, "importer")
	};
	var pc = Oc(" ");
	var gc = Oc("<");
	var vc = Oc(">");
	var yc = Oc('"');
	var _c = Oc("\n");
	var mc = Oc("\r");
	var xc = Oc("/");
	var bc = Oc("\\");
	var Ac = Oc("a");
	var wc = Oc("z");
	var Ec = Oc("A");
	var Ic = Oc("Z");
	var Sc = Oc("0");
	var Cc = Oc("9");
	var Tc = Oc(":");
	var Lc = -1;
	var Nc = -2;
	var zc = -3;
	var Mc = -4;

	function kc(e) {
		var t = new Int32Array(e.length);
		for (var r = 0, n = e.length; r < n; ++r) {
			t[r] = e.charCodeAt(r)
		}
		return t
	}
	function Rc(e, t, r, n) {
		var i = n.length;
		if (r - t !== i) {
			return false
		}
		for (var o = 0; o < i; ++o) {
			if (e[t + o] !== n[o]) {
				return false
			}
		}
		return true
	}
	function Fc(e, t, r, n) {
		return Dc(e.tags, t, r, n)
	}
	function Pc(e, t, r, n) {
		return Dc(e.attributes, t, r, n)
	}
	function Dc(e, t, r, n) {
		var i = e.length;
		for (var o = 0; o < i; ++o) {
			if (Rc(t, r, n, e[o])) {
				return o
			}
		}
		e.push(t.slice(r, n));
		return i
	}
	function Oc(e) {
		return e.charCodeAt(0)
	}
	function Bc(e, t, r) {
		var n, i, o;
		r = jc(t, r);
		n = t[r];
		if (n === vc || n === xc) {
			return r
		}
		i = r;
		r = Gc(t, r);
		o = Pc(e, t, i, r);
		while (t[r] !== yc) {
			++r
		}++r;
		i = r;
		while ((n = t[r]) !== yc) {
			if (n === bc) {
				++r
			}++r
		}
		e.tokens.push(zc, o, i, r);
		return r + 1
	}
	function Uc(e, t) {
		var r, n, i, o, s = e.length;
		var a = {
			tags: [],
			attributes: [],
			tokens: []
		};
		var u = a.tokens;
		t = jc(e, t);
		while (t < s) {
			o = e[t];
			if (o === gc) {
				t = jc(e, ++t);
				if (e[t] === xc) {
					u.push(Nc);
					while (e[++t] !== vc) {}
				} else {
					r = t;
					t = Gc(e, r);
					i = Fc(a, e, r, t);
					u.push(Lc, i);
					o = e[t];
					while (o !== vc && o !== xc) {
						t = Bc(a, e, t);
						o = e[t]
					}
					if (o === xc) {
						u.push(Nc);
						while (e[++t] !== vc) {}
					}
				}
				t += 1
			} else {
				r = t;
				while (e[++t] !== gc) {}
				n = t - 1;
				while (Xc(e[n])) {
					--n
				}
				u.push(Mc, r, n + 1)
			}
			t = jc(e, t)
		}
		return a
	}
	function Xc(e) {
		return e === pc || e === _c || e === mc
	}
	function jc(e, t) {
		while (Xc(e[t])) {
			++t
		}
		return t
	}
	function Wc(e) {
		return e >= Ac && e <= wc || e >= Ec && e <= Ic || e === Tc || e >= Sc && e <= Cc
	}
	function Gc(e, t) {
		while (Wc(e[t])) {
			++t
		}
		return t
	}
	function Hc(e, t) {
		var r = ["this.id = undefined;", "this.attributes = {", "  text: undefined,", "  color: undefined,", "  " + (e ? "radius" : "width") + ": undefined", e ? "  ,x: undefined" : "", e ? "  ,y: undefined" : "", "};"];
		if (!e) {
			r.push("this.source = undefined;", "this.target = undefined;")
		}
		var n = Object.keys(t);
		if (n.length) {
			r.push("  this.data = {")
		}
		for (var i = 0; i < n.length; ++i) {
			var o = n[i],
				s = t[o],
				a = s.title;
			r.push('  "' + a + '": ' + (s.
		default !==undefined ? JSON.stringify(s.
		default):
			undefined) + (i === n.length - 1 ? "" : ","))
		}
		if (n.length) {
			r.push("};")
		}
		return new Function(r.join("\n"))
	}
	function Yc(e) {
		if (e.indexOf("\\") === -1) {
			return e
		}
		e = e.replace(/\\"/g, '"');
		return e
	}
	function Vc(e) {
		if (e.indexOf("<gexf") === -1) {
			throw new Error("not a GEXF file")
		}
		var t = kc(e),
			r = Uc(t, e.indexOf("<gexf ")),
			n = {},
			i = [],
			o = {},
			s = [];
		r.tags.forEach(function(e, t) {
			var r = String.fromCharCode.apply(null, e);
			n[r] = t;
			i.push(r)
		});
		r.attributes.forEach(function(e, t) {
			var r = String.fromCharCode.apply(null, e);
			o[r] = t;
			s.push(r)
		});
		var a = n["attributes"],
			u = n["attribute"],
			l = n["node"],
			d = n["edge"],
			f = n["default"],
			h = n["viz:position"],
			c = n["viz:size"],
			p = n["viz:color"],
			g = n["attvalue"],
			v = o["class"],
			y = o["id"],
			_ = o["type"],
			m = o["title"],
			x = o["label"],
			b = o["source"],
			A = o["target"],
			w = o["x"],
			E = o["y"],
			I = o["r"],
			S = o["g"],
			C = o["b"],
			T = o["a"],
			L = o["value"],
			N = o["for"],
			z = o["weight"],
			M = 4,
			k = 5,
			R = 6;
		var F = 1,
			P = 2,
			D = 3,
			O = 4,
			B = 5;
		var U = {
			float: F,
			double: F,
			integer: P,
			boolean: D,
			string: O,
			"list-string": B
		};
		var X = 0,
			j = r.tokens,
			W = j.length;
		var G = new Array(16),
			H = 0,
			Y = 0,
			V = 0,
			q = true,
			Z = {},
			Q = {},
			J = null,
			K = null,
			$ = null,
			ee = undefined,
			te = null,
			re = 0,
			ne = 0,
			ie = 0,
			oe = 1,
			se = null,
			ae = undefined,
			ue = false,
			le = true,
			de = null,
			fe = null,
			he = [],
			ce = [],
			pe = 0,
			ge = null;
		while (X < W) {
			var ve = j[X];
			if (ve === Lc) {
				Y = H;
				H = j[X + 1];
				G[V] = H;
				V += 1;
				if (H === l) {
					if (!de) {
						de = Hc(true, Z)
					}
					te = new de;
					le = true;
					ge = Z
				} else if (H === d) {
					if (!fe) {
						fe = Hc(false, Q)
					}
					te = new fe;
					le = false;
					ge = Q
				}
				X += 2
			} else if (ve === Nc) {
				if (J && H === u) {
					ge = q ? Z : Q;
					var ye = U[K],
						value = ee;
					if (value) {
						if (ye === F) {
							value = +value
						} else if (ye === P) {
							value = +value | 0
						} else if (ye === D) {
							value = value === "true"
						} else if (ye === B) {
							value = value.split(" ").filter(function(e) {
								return e
							})
						}
					}
					ge[J] = {
						title: $ || J,
						type: ye,
					default:
						value
					};
					J = null;
					$ = null;
					K = null;
					ee = undefined
				} else if (H === l && V === M) {
					if (ue) {
						te.attributes.color = "rgba(" + re + ", " + ne + ", " + ie + ", " + oe + ")";
						re = 0;
						ne = 0;
						ie = 0;
						oe = 1;
						ue = false
					}
					if (!te.id) {
						te.id = ++pe
					}
					he.push(te)
				} else if (H === d && V === M) {
					if (!te.id) {
						te.id = ++pe
					}
					ce.push(te)
				} else if (H === g && V === R && se) {
					var _e = (le ? Z : Q)[se];
					if (_e) {
						if (ae === undefined) {
							ae = _e.
						default
						} else {
							ye = _e.type;
							if (ye) {
								if (ye === F) {
									ae = +ae
								} else if (ye === P) {
									ae = +ae | 0
								} else if (ye === D) {
									ae = ae === "true"
								} else if (ye === B) {
									ae = ae.split(" ").filter(function(e) {
										return e
									}).map(function(e) {
										return Yc(e)
									})
								} else {
									ae = Yc(ae)
								}
							}
						}
						te.data[ge[se].title] = ae
					}
					se = null;
					ae = null
				}
				V -= 1;
				H = Y;
				Y = G[V - 2];
				X += 1
			} else if (ve === zc) {
				var me = j[X + 1];
				value = e.substring(j[X + 2], j[X + 3]);
				if (H === a) {
					if (me === v) {
						q = value !== "edge" && value !== "edges"
					}
				} else if (H === u) {
					if (me === y) {
						J = value
					} else if (me === _) {
						K = value
					} else if (me === m) {
						$ = value
					}
				} else if ((H === l || H === d) && V === M) {
					if (me === y) {
						te.id = value
					} else if (me === x) {
						te.attributes.text = value
					} else if (me === b) {
						te.source = value
					} else if (me === A) {
						te.target = value
					} else if (me === z) {
						te.attributes.width = +value
					}
				} else if (H === h && V === k) {
					if (me === w) {
						te.attributes.x = +value
					} else if (me === E) {
						te.attributes.y = -value
					}
				} else if (H === p && V === k) {
					ue = true;
					if (me === I) {
						re = value
					} else if (me === S) {
						ne = value
					} else if (me === C) {
						ie = value
					} else if (me === T) {
						oe = value
					}
				} else if (H === c && V === k) {
					if (me === L) {
						if (le) {
							te.attributes.radius = +value
						} else {
							te.attributes.width = +value
						}
					}
				} else if (H === g && V === R) {
					if (me === N || me === y) {
						se = value
					} else if (me === L) {
						ae = value
					}
				}
				X += 4
			} else if (ve === Mc) {
				value = e.substring(j[X + 1], j[X + 2]);
				if (H === f) {
					ee = value
				}
				X += 3
			} else {
				throw new Error("at index " + X + ": token " + ve)
			}
		}
		return {
			nodes: he,
			edges: ce
		}
	}
	g.extend(function(e) {
		e.modules.imports.register("gexf", {
			translate: Vc,
			webWorkerCompatible: true
		});
		e.parse.gexf = function(t) {
			return e.modules.imports.from("gexf", t)
		};
		e.parse.gexfFromUrl = function(t) {
			return tr(t).then(function(t) {
				return e.modules.imports.from("gexf", t)
			})
		}
	});

	function qc(e, t, r) {
		r = r || t;
		if (t in e) {
			if (!e.attributes) {
				e.attributes = {}
			}
			e.attributes[r] = e[t]
		}
	}
	function Zc(e) {
		var t = JSON.parse(e),
			r = t.nodes || [],
			n = t.edges || [];
		for (var i = 0, o = r.length; i < o; ++i) {
			var s = r[i];
			if (typeof s.size === "string") {
				s.size = +s.size
			}
			if (typeof s.x === "string") {
				s.x = +s.x
			}
			if (typeof s.y === "string") {
				s.y = +s.y
			}
			qc(s, "x");
			qc(s, "y");
			qc(s, "size");
			qc(s, "color");
			qc(s, "text")
		}
		for (var a = 0, u = n.length; a < u; ++a) {
			var l = n[a];
			if (typeof l.size === "string") {
				l.size = +l.size
			}
			qc(l, "size", "width");
			qc(l, "color");
			qc(l, "text")
		}
		return t
	}
	g.extend(function(e) {
		e.modules.imports.register("json", {
			translate: Zc,
			webWorkerCompatible: true
		});
		e.parse.json = function(t) {
			return e.modules.imports.from("json", t)
		};
		e.parse.jsonFromUrl = function(t) {
			return tr(t).then(function(t) {
				return e.modules.imports.from("json", t)
			})
		}
	});
	g.extend(function(e) {
		e.modules.imports.register("neo4j", tp);
		e.parse.neo4j = function(t) {
			return e.modules.imports.from("neo4j", t)
		}
	});

	function Qc(e) {
		if (typeof e !== "object" || e === null) {
			throw new Error("Ogma can only retrieve nodes and relationships from Neo4j. Please make sure that your Cypher query returns nodes and edges, not values.")
		}
		var t = Object.keys(e.properties);
		for (var r = 0; r < t.length; r++) {
			var n = t[r],
				i = e.properties[n];
			if (typeof i === "object" && "high" in i && "low" in i) {
				i = i.low
			}
		}
		if (typeof e.identity !== "number") {
			e.identity = e.identity.low;
			if ("start" in e && "end" in e) {
				e.start = e.start.low;
				e.end = e.end.low
			}
		}
	}
	var Jc = function(e) {
			return "start" in e && "end" in e && "type" in e
		};
	var Kc = function(e) {
			return "segments" in e
		};

	function $c(e, t) {
		t.segments.forEach(function(t) {
			ep(e, t.start);
			ep(e, t.end);
			ep(e, t.relationship)
		})
	}
	function ep(e, t) {
		if (t) {
			if (Array.isArray(t)) {
				t.forEach(function(t) {
					return ep(e, t)
				})
			} else if (Kc(t)) {
				$c(e, t)
			} else {
				Qc(t);
				if (Jc(t)) {
					e.edges.push({
						id: t.identity,
						source: t.start,
						target: t.end,
						data: {
							neo4jType: t.type,
							neo4jProperties: t.properties
						}
					})
				} else {
					e.nodes.push({
						id: t.identity,
						attributes: {
							x: Math.random() * 100,
							y: Math.random() * 100
						},
						data: {
							neo4jLabels: t.labels,
							neo4jProperties: t.properties
						}
					})
				}
			}
		}
	}
	function tp(e) {
		var t = {
			nodes: [],
			edges: []
		};
		e.records.forEach(function(e) {
			e.forEach(function(e) {
				ep(t, e)
			})
		});
		return t
	}
	g.extend(function(e) {
		e.modules.imports.register("janus", rp);
		e.parse.janus = function(t) {
			return e.modules.imports.from("janus", t)
		}
	});

	function rp(e) {
		var t = [],
			r = [];
		var n = function(e) {
				if (!e || typeof e !== "object") {
					return
				}
				if (e.type === "vertex") {
					var i = {};
					if (e.properties) {
						Object.keys(e.properties).forEach(function(t) {
							i[t] = e.properties[t][0].value
						})
					}
					t.push({
						id: e.id + "",
						data: {
							id: e.id + "",
							categories: [e.label],
							properties: i
						}
					})
				} else if (e.type === "edge") {
					r.push({
						id: e.id + "",
						source: e.inV + "",
						target: e.outV + "",
						data: {
							id: e.id + "",
							type: e.label,
							properties: e.properties || {}
						}
					})
				} else if (Array.isArray(e)) {
					e.forEach(function(e) {
						return n(e)
					})
				} else {
					Object.keys(e).forEach(function(t) {
						return n(e[t])
					})
				}
			};
		n(e);
		return {
			nodes: t,
			edges: r
		}
	}
	var np = {
		mouseEventRate: 15,
		wheelDebounceTime: 60,
		doubleClickTimer: 500
	};
	g.extend(function(e) {
		e.modules.mouse = new ip(e)
	});
	var ip = function e(t) {
			var r = this;
			this._render = t.modules.render;
			this._settings = t.modules.settings;
			this._events = t.modules.events;
			this._domElt = null;
			this._focus = false;
			this._wheelEnabled = true;
			this._preventRightClick = null;
			this._binds = [];
			this._x = 0;
			this._y = 0;
			this._left = false;
			this._middle = false;
			this._right = false;
			this._settings.register("mouse.enabled", true);
			this._settings.register("mouse.wheelEnabled", true);
			this._settings.register("mouse.disableWheelUntilMouseDown", false);
			this._events.register(["mouseDown", "mouseUp", "mouseMove", "mouseWheel", "mouseClick", "mouseDoubleClick", "mouseLeave"]);
			mt(this, {
				x: function() {
					return r._x
				},
				y: function() {
					return r._y
				},
				left: function() {
					return r._left
				},
				middle: function() {
					return r._middle
				},
				right: function() {
					return r._right
				}
			});
			this._domElt = this._render.getCanvas();
			if (this._domElt) {
				ap(this)
			}
			this._events.on({
				kill: function() {
					if (r._domElt) {
						sp(r)
					}
				}
			})
		};
	var op = {
		0: "left",
		1: "middle",
		2: "right"
	};

	function sp(e) {
		if (typeof document !== "undefined") {
			document.removeEventListener("contextmenu", e._preventRightClick)
		}
		e._preventRightClick = null;
		e._binds.forEach(function(e) {
			return Kt(e)
		});
		e._binds = []
	}
	function ap(e) {
		var t = {
			left: 0,
			middle: 0,
			right: 0
		},
			r = function(t, r) {
				return e._events.fire(t, r)
			};
		var n = 0,
			i = 0,
			o = 0,
			s = 0,
			a = {
				left: false,
				middle: false,
				right: false
			},
			u = null;
		e._preventRightClick = function(t) {
			if (e._focus) {
				t.preventDefault()
			}
		};
		if (typeof document !== "undefined") {
			document.addEventListener("contextmenu", e._preventRightClick, false)
		}
		var l = function(e, value) {
				if (value === void 0) value = 0;
				if (e) {
					t[e] = value
				} else {
					t.left = value;
					t.middle = value;
					t.right = value
				}
			};
		var d = function(t) {
				o = n;
				s = i;
				var r = e._domElt.getBoundingClientRect();
				n = t.clientX - r.left;
				i = t.clientY - r.top;
				u = op[t.button];
				e._x = n;
				e._y = i;
				e._left = a.left;
				e._right = a.right;
				e._middle = a.middle
			};
		var f = function(t, r, n) {
				e._binds.push(Jt(e._domElt, t, function(t) {
					if (e._settings.get("mouse.enabled")) {
						r(t)
					}
				}, Be(n, np.mouseEventRate)))
			};
		var h = me(function(e) {
			d(e);
			var t = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
			r("mouseWheel", {
				delta: t,
				x: n,
				y: i
			})
		}, np.wheelDebounceTime);

		function c(t) {
			if (e._settings.get("mouse.wheelEnabled") && (!e._settings.get("mouse.disableWheelUntilMouseDown") || e._focus)) {
				if (t.preventDefault) {
					t.preventDefault()
				} else {
					t.returnValue = false
				}
				if (t.stopPropagation) {
					t.stopPropagation()
				} else {
					t.cancelBubble = true
				}
				h(t)
			}
		}
		f("mousewheel", c, 0);
		f("DOMMouseScroll", c, 0);
		f("mousemove", function(e) {
			d(e);
			var t = n - o,
				a = i - s;
			if (t === 0 && a === 0) {
				return
			}
			l("left");
			l("right");
			l("middle");
			r("mouseMove", {
				x: n,
				y: i,
				dx: t,
				dy: a
			})
		});
		f("mouseleave", function() {
			if (a.left) {
				r("mouseUp", {
					button: "left",
					x: n,
					y: i
				});
				a.left = false
			}
			if (a.middle) {
				r("mouseUp", {
					button: "middle",
					x: n,
					y: i
				});
				a.middle = false
			}
			if (a.right) {
				r("mouseUp", {
					button: "right",
					x: n,
					y: i
				});
				a.right = false
			}
			l("left");
			l("right");
			l("middle");
			e._focus = false;
			r("mouseLeave")
		});
		f("mousedown", function(o) {
			d(o);
			e._focus = true;
			a[u] = true;
			t[u] += 1;
			setTimeout(l, np.doubleClickTimer, u, 1);
			r("mouseDown", {
				button: u,
				x: n,
				y: i
			})
		});
		f("mouseup", function(e) {
			d(e);
			a[u] = false;
			if (t[u] === 1) {
				r("mouseClick", {
					button: u,
					x: n,
					y: i
				})
			} else if (t[u] > 1) {
				r("mouseDoubleClick", {
					button: u,
					x: n,
					y: i
				});
				l(u)
			}
			r("mouseUp", {
				button: u,
				x: n,
				y: i
			})
		})
	}
	g.extend(function(e) {
		var t = new up(e);
		e.modules.virtualMouse = t;
		e.mouse = {
			move: function e(r) {
				return t.move(r)
			},
			down: function e(r) {
				return t.down(r)
			},
			up: function e(r) {
				return t.up(r)
			},
			click: function e(r) {
				return t.click(r)
			},
			doubleClick: function e(r) {
				return t.doubleClick(r)
			}
		}
	});
	var up = function e(t) {
			this._ogma = t;
			this._events = t.modules.events;
			this._events.register(["virtualDown", "virtualUp", "virtualMove", "virtualClick", "virtualDoubleClick"])
		};
	var lp = {
		x: {},
		y: {}
	};
	lp.x.get = function() {
		return this._ogma.modules.captor._x
	};
	lp.y.get = function() {
		return this._ogma.modules.captor._y
	};
	up.prototype.move = function e(t) {
		var r = t.x;
		var n = t.y;
		var i = r - this.x,
			o = n - this.y;
		this._events.fire("virtualMove", {
			x: r,
			y: n,
			dx: i,
			dy: o
		});
		return dp()
	};
	up.prototype.down = function e(t) {
		if (t) {
			this.move(t)
		}
		this._events.fire("virtualDown", {
			x: this.x,
			y: this.y,
			button: "left"
		});
		this._events.fire("virtualMove", {
			x: this.x,
			y: this.y,
			dx: 0,
			dy: 0
		});
		return dp()
	};
	up.prototype.up = function e(t) {
		if (t) {
			this.move(t)
		}
		this._events.fire("virtualUp", {
			x: this.x,
			y: this.y,
			button: "left"
		});
		return dp()
	};
	up.prototype.click = function e(t) {
		if (t) {
			this.move(t)
		}
		this._events.fire("virtualClick", {
			x: this.x,
			y: this.y,
			button: "left"
		});
		return dp()
	};
	up.prototype.doubleClick = function e(t) {
		if (t) {
			this.move(t)
		}
		this._events.fire("virtualDoubleClick", {
			x: this.x,
			y: this.y,
			button: "left"
		});
		return dp()
	};
	Object.defineProperties(up.prototype, lp);

	function dp() {
		return new Promise(function(e) {
			setTimeout(function() {
				return setTimeout(e)
			})
		})
	}
	var fp = {
		doubleTapTimer: 500,
		touchEventRate: 15
	};
	g.extend(function(e) {
		e.modules.touch = new hp(e)
	});
	var hp = function e(t) {
			var r = this;
			this._render = t.modules.render;
			this._events = t.modules.events;
			this._settings = t.modules.settings;
			this._dom = null;
			this._binds = [];
			this._x = 0;
			this._y = 0;
			this._pressed = false;
			mt(this, {
				x: function() {
					return r._x
				},
				y: function() {
					return r._y
				},
				pressed: function() {
					return r._pressed
				}
			});
			this._settings.register("touch.enabled", true);
			this._events.register(["touchDown", "touchUp", "touchTap", "touchDoubleTap", "touchMove", "touchStartGesture", "touchProgressGesture", "touchEndGesture"]);
			this._dom = this._render.getCanvas();
			if (this._dom) {
				pp(this)
			}
			this._events.on({
				kill: function() {
					return cp(r)
				}
			})
		};

	function cp(e) {
		e._binds.forEach(function(e) {
			return Kt(e)
		});
		e._binds = []
	}
	function pp(e) {
		var t = function(t, r) {
				return e._events.fire(t, r)
			};
		var r = 0,
			n = 0,
			i = 0,
			o = 0,
			s = false,
			a = 0,
			u = false,
			l = false,
			d = 1,
			f = 0;
		var h = function() {
				e._x = r;
				e._y = n;
				e._pressed = s
			};
		var c = function(e, t, i, o) {
				d = e;
				f = t;
				r = i;
				n = o;
				h()
			};
		var p = function(t) {
				var i = e._dom.getBoundingClientRect(),
					o = t.touches[0].clientX - i.left,
					s = t.touches[0].clientY - i.top,
					a = t.touches[1].clientX - i.left,
					u = t.touches[1].clientY - i.top;
				var l = (o + a) / 2,
					h = (s + u) / 2,
					p = l - r,
					g = h - n,
					v = distance(o, s, a, u),
					y = v / d,
					_ = wr(o, s, a, u),
					m = _ - f,
					x = {
						dx: p,
						dy: g,
						rotation: m,
						scale: y
					};
				c(distance, _, l, h);
				return x
			};
		var g = function(e) {
				if (e.touches.length !== 2 && l) {
					l = false;
					t("touchEndGesture")
				} else if (e.touches.length === 2 && !l) {
					l = true;
					p(e, true);
					t("touchStartGesture")
				}
				return e.touches.length === 2
			};
		var v = function(e) {
				if (e.touches.length === 2 && l) {
					var i = p(e);
					var o = i.dx;
					var s = i.dy;
					var a = i.rotation;
					var u = i.scale;
					t("touchProgressGesture", {
						dx: o,
						dy: s,
						rotation: a,
						scale: u,
						x: r,
						y: n
					})
				}
			};
		var y = function(t, r) {
				e._binds.push(Jt(e._dom, t, function(t) {
					if (e._settings.get("touch.enabled")) {
						r(t)
					}
				}, fp.touchEventRate))
			};
		var _ = function(a) {
				i = r;
				o = n;
				if (a.touches.length !== 1) {
					s = false;
					if (a.touches.length > 1) {
						t("touchUp", {
							x: r,
							y: n
						})
					}
				} else {
					var u = e._dom.getBoundingClientRect();
					r = a.touches[0].clientX - u.left;
					n = a.touches[0].clientY - u.top;
					s = true
				}
				h();
				return a.touches.length === 1
			};
		var m = function() {
				a = 0
			};
		y("touchstart", function(e) {
			g(e);
			if (_(e)) {
				t("touchDown", {
					x: r,
					y: n
				});
				a += 1;
				setTimeout(m, fp.doubleTapTimer);
				u = true
			}
		});
		var x = function(e) {
				g(e);
				_(e);
				if (e.touches.length === 0) {
					if (a === 1) {
						t("touchTap", {
							x: r,
							y: n
						})
					} else if (a > 1) {
						t("touchDoubleTap", {
							x: r,
							y: n
						});
						m()
					}
					t("touchUp", {
						x: r,
						y: n
					})
				}
			};
		y("touchend", x);
		y("touchcancel", x);
		y("touchmove", function(e) {
			v(e);
			if (u) {
				u = false;
				return
			}
			m();
			if (_(e)) {
				t("touchMove", {
					x: r,
					y: n,
					dx: r - i,
					dy: n - o
				})
			}
		});
		var b = function(e) {
				return e.preventDefault()
			};
		y("touchstart", b);
		y("touchend", b);
		y("touchcancel", b)
	}
	var gp = {
		65: "a",
		66: "b",
		67: "c",
		68: "d",
		69: "e",
		70: "f",
		71: "g",
		72: "h",
		73: "i",
		74: "j",
		75: "k",
		76: "l",
		77: "m",
		78: "n",
		79: "o",
		80: "p",
		81: "q",
		82: "r",
		83: "s",
		84: "t",
		85: "u",
		86: "v",
		87: "w",
		88: "x",
		89: "y",
		90: "z",
		48: "0",
		49: "1",
		50: "2",
		51: "3",
		52: "4",
		53: "5",
		54: "6",
		55: "7",
		56: "8",
		57: "9",
		13: "enter",
		16: "shift",
		17: "ctrl",
		18: "alt",
		27: "esc",
		46: "del",
		8: "backspace",
		32: "space",
		224: "cmd",
		91: "cmd",
		92: "cmd",
		93: "cmd",
		187: "+",
		189: "-"
	};
	var vp = {};
	(function() {
		var e = Object.keys(gp);
		e.forEach(function(e) {
			var t = gp[e];
			if (!vp[t]) {
				vp[t] = []
			}
			vp[t].push(e)
		})
	})();
	g.extend(function(e) {
		var t = new yp(e);
		e.modules.keyboard = t;
		e.events.onKeyPress = function(r, n) {
			t.onKeyPress(r, n);
			return e.events
		};
		e.keyboard = {
			isKeyPressed: function e(r) {
				return t.isPressed(r)
			}
		}
	});
	var yp = function e(t) {
			var r = this;
			this._events = t.modules.events;
			this._events.register(["keyUp", "keyDown"]);
			this._binds = [];
			this._pressed = [];
			this._onKeyDown = function(e) {
				var t = e.keyCode || e.which,
					n = r._binds[t];
				r._pressed[t] = true;
				if (n) {
					for (var i = 0; i < n.length; ++i) {
						var o = n[i],
							s = true;
						for (var a = 0; a < o.keys.length; ++a) {
							var u = false,
								l = o.keys[a];
							for (var d = 0; d < l.length; ++d) {
								if (r._pressed[l[d]]) {
									u = true
								}
							}
							if (!u) {
								s = false
							}
						}
						if (s) {
							o.handler()
						}
					}
				}
				r._events.fire("keyDown", {
					key: gp[t],
					code: t
				})
			};
			this._onKeyUp = function(e) {
				var t = e.keyCode || e.which;
				r._pressed[t] = false;
				r._events.fire("keyUp", {
					key: gp[t],
					code: t
				})
			};
			if (typeof window !== "undefined") {
				window.addEventListener("keydown", this._onKeyDown);
				window.addEventListener("keyup", this._onKeyUp)
			}
			this._events.on("kill", function() {
				if (typeof window !== "undefined") {
					window.removeEventListener("keydown", r._onKeyDown);
					window.removeEventListener("keyup", r._onKeyUp)
				}
			})
		};
	yp.prototype.onKeyPress = function e(t, r) {
		var n = this;
		if (typeof t === "number") {
			t = [t]
		} else if (typeof t === "string") {
			t = t.split(" ")
		} else if (!Array.isArray(t)) {
			throw new TypeError(t + " is not a number, string or array")
		} else if (t.length === 0) {
			throw new Error("the array should contain at least one element")
		}
		var i = [];
		t.forEach(function(e) {
			if (typeof e === "number") {
				i.push([e])
			} else if (typeof e === "string") {
				var t = vp[e];
				if (!t) {
					throw new Error(e + " is not a valid key identifier")
				}
				i.push(t)
			} else {
				throw new TypeError(e + " is not a valid key identifier")
			}
		});
		var o = i.pop(),
			s = {
				keys: i,
				handler: r
			};
		o.forEach(function(e) {
			if (!n._binds[e]) {
				n._binds[e] = []
			}
			n._binds[e].push(s)
		})
	};
	yp.prototype.isPressed = function e(t) {
		var r = this;
		if (typeof t === "number") {
			return this._pressed[t]
		} else if (typeof t === "string") {
			var n = vp[t];
			if (n) {
				for (var i = 0; i < n.length; ++i) {
					if (r._pressed[n[i]]) {
						return true
					}
				}
			}
		}
		return false
	};
	g.extend(function(e) {
		var t = new _p(e),
			r = e.modules.events;
		e.modules.captor = t;
		e.getHoveredElement = function() {
			return t.getPointedElement()
		};
		e.view.getElementAt = function(e) {
			return t.getElementAt(e)
		};
		et(e.events, {
			onMouseMove: function t(n) {
				r.on("move", n);
				return e.events
			},
			onMouseButtonDown: function t(n) {
				r.on("down", n);
				return e.events
			},
			onMouseButtonUp: function t(n) {
				r.on("up", n);
				return e.events
			},
			onClick: function t(n) {
				r.on("click", n);
				return e.events
			},
			onDoubleClick: function t(n) {
				r.on("doubleClick", n);
				return e.events
			},
			onMouseWheel: function t(n) {
				r.on("wheel", n);
				return e.events
			},
			onHover: function t(n) {
				r.on("hover", n);
				return e.events
			},
			onUnhover: function t(n) {
				r.on("unhover", n);
				return e.events
			},
			onDragStart: function t(n) {
				r.on("dragStart", n);
				return e.events
			},
			onDragProgress: function t(n) {
				r.on("dragProgress", n);
				return e.events
			},
			onDragEnd: function t(n) {
				r.on("dragEnd", n);
				return e.events
			},
			onGestureStart: function t(n) {
				r.on("gestureStart", n);
				return e.events
			},
			onGestureProgress: function t(n) {
				r.on("gestureProgress", n);
				return e.events
			},
			onGestureEnd: function t(n) {
				r.on("gestureEnd", n);
				return e.events
			},
			onZoomProgress: function t(n) {
				r.on("cameraZoom", n);
				return e.events
			},
			onViewChanged: function t(n) {
				r.on("viewChanged", n);
				return e.events
			}
		})
	});
	var _p = function e(t) {
			var r = this;
			this._graph = t.modules.graph;
			this._graphics = t.modules.graphics;
			this._camera = t.modules.camera;
			this._mouse = t.modules.mouse;
			this._touch = t.modules.touch;
			this._events = t.modules.events;
			this._settings = t.modules.settings;
			this._elt = null;
			this._hoveredElt = null;
			this._draggedElt = null;
			this._enabled = true;
			this._init = false;
			this._hover = false;
			this._x = undefined;
			this._y = undefined;
			this._timeout = null;
			this._buttons = {
				left: {
					isPressed: false,
					isDragging: false
				},
				middle: {
					isPressed: false,
					isDragging: false
				},
				right: {
					isPressed: false,
					isDragging: false
				}
			};
			this._events.register(["move", "down", "up", "click", "doubleClick", "hover", "unhover", "wheel", "dragStart", "dragProgress", "dragEnd", "gestureStart", "gestureProgress", "gestureEnd"]);
			this._settings.register("detect.nodes", true);
			this._settings.register("detect.edges", true);
			this._settings.register("detect.nodeTexts", true);
			this._settings.register("detect.edgeTexts", true);
			this._settings.register("detect.nodeErrorMargin", 5);
			this._settings.register("detect.edgeErrorMargin", 7);
			this._events.on({
				"removeNodes removeEdges clear": function() {
					Tp(r, r._x, r._y);
					if (!r._timeout) {
						r._timeout = setTimeout(function() {
							Ap(r, {
								x: r._x,
								y: r._y,
								dx: 0,
								dy: 0
							});
							r._timeout = null
						}, 0)
					}
				},
				"mouseMove touchMove virtualMove": function(e, t) {
					var n = e.x;
					var i = e.y;
					var o = e.dx;
					var s = e.dy;
					Ap(r, {
						x: n,
						y: i,
						dx: o,
						dy: s,
						source: mp(t)
					})
				},
				"mouseDown touchDown virtualDown": function(e, t) {
					var n = e.x;
					var i = e.y;
					var o = e.button;
					if (o === void 0) o = "left";
					bp(r, {
						x: n,
						y: i,
						button: o,
						source: mp(t)
					})
				},
				"mouseUp touchUp virtualUp": function(e, t) {
					var n = e.x;
					var i = e.y;
					var o = e.button;
					if (o === void 0) o = "left";
					Ip(r, {
						x: n,
						y: i,
						button: o,
						source: mp(t)
					})
				},
				"mouseClick touchTap virtualClick": function(e, t) {
					var n = e.x;
					var i = e.y;
					var o = e.button;
					if (o === void 0) o = "left";
					Sp(r, {
						x: n,
						y: i,
						button: o,
						source: mp(t)
					})
				},
				"mouseDoubleClick touchDoubleTap virtualDoubleClick": function(e, t) {
					var n = e.x;
					var i = e.y;
					var o = e.button;
					if (o === void 0) o = "left";
					Cp(r, {
						x: n,
						y: i,
						button: o,
						source: mp(t)
					})
				},
				mouseWheel: function(e) {
					var t = e.x;
					var n = e.y;
					var i = e.delta;
					r._x = t;
					r._y = n;
					xp(r, "wheel", undefined, {
						x: t,
						y: n,
						delta: i,
						source: "mouse",
						target: r._hoveredElt
					})
				},
				touchStartGesture: function(e) {
					return r._events.fire("gestureStart", e)
				},
				touchProgressGesture: function(e) {
					return r._events.fire("gestureProgress", e)
				},
				touchEndGesture: function(e) {
					return r._events.fire("gestureEnd", e)
				}
			})
		};
	_p.prototype.getElementAt = function e(t) {
		var r = t.x;
		var n = t.y;
		return Np(this, r, n)
	};
	_p.prototype.getPointedElement = function e() {
		return this._hoveredElt
	};
	_p.prototype.getDraggedElement = function e() {
		return this._draggedElt
	};
	_p.prototype.isButtonPressed = function e(t) {
		return this._buttons[t].isPressed
	};
	_p.prototype.isLeftPressed = function e() {
		return this.isButtonPressed("left")
	};
	_p.prototype.getCursorPosition = function e() {
		return {
			x: this._x,
			y: this._y
		}
	};
	_p.prototype.getCursorInformation = function e() {
		return {
			x: this._x,
			y: this._y,
			target: this._hoveredElt
		}
	};
	_p.prototype.setDetectionEnabled = function e(value) {
		var t = this._enabled;
		this._enabled = !! value;
		return t
	};

	function mp(e) {
		if (e.indexOf("mouse") === 0) {
			return "mouse"
		} else if (e.indexOf("touch") === 0) {
			return "touch"
		} else {
			return "mouse"
		}
	}
	function xp(e, t, r, n) {
		n.target = r || null;
		e._events.fire(t, n);
		return n
	}
	function bp(e, t) {
		var r = t.x;
		var n = t.y;
		var i = t.button;
		var o = t.source;
		Lp(e, r, n);
		if (e._elt !== e._hoveredElt) {
			Tp(e, r, n)
		}
		e._hoveredElt = e._elt;
		e._hoveredEltIsNode = e._elt && e._elt.isNode;
		e._buttons[i].isPressed = true;
		e._events.fire("down", {
			x: r,
			y: n,
			button: i,
			source: o
		})
	}
	function Ap(e, t) {
		var r = t.x;
		var n = t.y;
		var i = t.dx;
		var o = t.dy;
		var s = t.source;
		e._events.fire("move", {
			x: r,
			y: n,
			dx: i,
			dy: o,
			source: s
		});
		e._x = r;
		e._y = n;
		Xe(e._buttons, function(t, a) {
			var u = t.isPressed;
			var l = t.isDragging;
			if (u) {
				if (!l) {
					e._buttons[a].isDragging = true;
					if (e._hoveredElt) {
						if (e._hover) {
							xp(e, "unhover", e._hoveredElt, {
								x: r,
								y: n,
								source: s
							});
							e._hover = false
						}
					}
					if (!e._draggedElt) {
						e._draggedElt = e._hoveredElt;
						e._draggedEltIsNode = e._hoveredEltIsNode
					}
					xp(e, "dragStart", e._draggedElt, {
						x: r,
						y: n,
						button: a,
						source: s
					})
				}
				xp(e, "dragProgress", e._draggedElt, {
					x: r,
					y: n,
					dx: i,
					dy: o,
					source: s
				})
			}
		});
		Lp(e, r, n);
		if (e._elt !== e._hoveredElt) {
			if (e._hoveredElt && e._hover) {
				e._hover = true;
				xp(e, "unhover", e._hoveredElt, {
					x: r,
					y: n,
					source: s
				})
			}
			e._hoveredElt = e._elt;
			e._hoveredEltIsNode = e._isNode;
			if (e._elt) {
				e._hover = true;
				xp(e, "hover", e._hoveredElt, {
					x: r,
					y: n,
					source: s
				})
			}
		}
	}
	function wp(e) {
		return je(e._buttons, function(e, t) {
			var r = t.isDragging;
			if (r === void 0) r = false;
			return e + r
		}, 0)
	}
	function Ep(e) {
		return je(e._buttons, function(e, t) {
			var r = t.isPressed;
			if (r === void 0) r = false;
			return e + r
		}, 0)
	}
	function Ip(e, t) {
		var r = t.x;
		var n = t.y;
		var i = t.button;
		var o = t.source;
		var s = e._buttons[i];
		var a = s.isPressed;
		var u = s.isDragging;
		if (!a) {
			return
		}
		e._buttons[i].isPressed = false;
		if (u) {
			xp(e, "dragEnd", e._draggedElt, {
				x: r,
				y: n,
				button: i,
				source: o
			});
			e._buttons[i].isDragging = false;
			if (wp(e) === 0) {
				e._draggedElt = null
			}
		}
		if (Ep(e) && !e._hover && o !== "touch") {
			Lp(e, r, n);
			e._hoveredElt = e._elt;
			e._hoveredEltIsNode = e._isNode;
			if (e._hoveredElt) {
				xp(e, "hover", e._hoveredElt, {
					x: r,
					y: n,
					source: o
				});
				e._hover = true
			}
		}
		e._events.fire("up", {
			x: r,
			y: n,
			button: i,
			source: o
		})
	}
	function Sp(e, t) {
		var r = t.x;
		var n = t.y;
		var i = t.button;
		var o = t.source;
		xp(e, "click", e._hoveredElt, {
			x: r,
			y: n,
			button: i,
			source: o
		})
	}
	function Cp(e, t) {
		var r = t.x;
		var n = t.y;
		var i = t.button;
		var o = t.source;
		xp(e, "doubleClick", e._hoveredElt, {
			x: r,
			y: n,
			button: i,
			source: o
		})
	}
	function Tp(e, t, r) {
		Xe(e._buttons, function(n, i) {
			var o = n.isDragging;
			if (o) {
				xp(e, "dragEnd", e._draggedElt, {
					x: t,
					y: r,
					button: i
				})
			}
		});
		if (e._hover && e._hoveredElt) {
			xp(e, "unhover", e._hoveredElt, {
				x: t,
				y: r
			})
		}
		Object.keys(e._buttons).forEach(function(t) {
			e._buttons[t].isPressed = false;
			e._buttons[t].isDragging = false
		});
		e._hover = false;
		e._hoveredElt = null;
		e._draggedElt = null
	}
	function Lp(e, t, r) {
		e._elt = Np(e, t, r);
		e._isNode = !e._elt || e._elt.isNode
	}
	function Np(e, t, r) {
		var n = null;
		if (!e._enabled || t === undefined || r === undefined) {
			return
		}
		if (e._settings.get("detect.nodes")) {
			var i = zp(e, t, r);
			if (i) {
				n = e._graph._getElement(true, i)
			} else if (e._settings.get("detect.edges")) {
				var o = Mp(e, t, r);
				if (o) {
					n = e._graph._getElement(false, o)
				}
			}
		}
		return n
	}
	function zp(e, t, r) {
		var n = e._graph._allIndexes(true),
			i = e._camera.zoom,
			o = e._settings.get("detect.nodeErrorMargin") / i,
			s = e._camera.screenToGraphCoordinates({
				x: t,
				y: r
			}),
			a = s.x,
			u = s.y,
			l = e._graphics._shapes.nodes,
			d = {};
		var f = e._graph.getAttributes(true, ["excluded", "x", "y", "textPosition", "textWidth", "textHeight", "secondaryTextPosition", "secondaryTextWidth", "secondaryTextHeight"]);
		var h = f[0];
		var c = f[1];
		var p = f[2];
		var g = f[3];
		var v = f[4];
		var y = f[5];
		var _ = f[6];
		var m = f[7];
		var x = f[8];
		var b = e._graphics._getAttributeArrays(true, ["radius", "shape", "hidden", "text.scaling", "text.threshold", "text.backgroundMargin"]);
		var A = b[0];
		var w = b[1];
		var E = b[2];
		var I = b[3];
		var S = b[4];
		var C = b[5];
		var T = e._settings.get("detect.nodeTexts"),
			L = 0,
			N = 0;
		for (var z = 0, M = n.length; z < M; ++z) {
			var k = n[z];
			if (!E.get(k) || !h.get(k)) {
				var R = A.get(k);
				if (l[w.get(k)].detect(c.get(k), p.get(k), R + o, a, u, d)) {
					L = k
				} else if (T) {
					var F = g.get(k);
					if (!F || R * i < S.get(k)) {
						continue
					}
					var P = F,
						D = v.get(k),
						O = y.get(k),
						B = e._camera.graphToScreenCoordinates(P),
						U = B.x + P.zx * i + P.ox,
						X = B.y + P.zy * i + P.oy;
					if (I.get(k)) {
						D *= i;
						O *= i
					}
					var j = C.get(k);
					if (t >= U - j && t <= U + D + j && r >= X - j && r <= X + O + j) {
						N = k
					} else {
						P = _.get(k);
						if (!P) {
							continue
						}
						D = m.get(k);
						O = x.get(k);
						B = e._camera.graphToScreenCoordinates(P);
						U = B.x + P.zx * i + P.ox;
						X = B.y + P.zy * i + P.oy;
						if (I.get(k)) {
							D *= i;
							O *= i
						}
						j = C.get(k);
						if (t >= U - j && t <= U + D + j && r >= X - j && r <= X + O + j) {
							N = k
						}
					}
				}
			}
		}
		return L || N
	}
	function Mp(e, t, r) {
		var n = e._graph._allIndexes(false),
			i = e._settings.get("edgeClipping"),
			o = e._settings.get("detect.edgeErrorMargin") / e._camera.zoom,
			s = e._camera.screenToGraphCoordinates({
				x: t,
				y: r
			}),
			a = s.x,
			u = s.y,
			l = e._graphics._shapes.edges,
			d = {};
		var f = e._graph.getAttributes(true, ["x", "y", "radius", "hidden"]);
		var h = f[0];
		var c = f[1];
		var p = f[2];
		var g = f[3];
		var v = e._graph.getAttributes(false, ["excluded", "source", "target", "shape", "width", "curvature", "hidden"]);
		var y = v[0];
		var _ = v[1];
		var m = v[2];
		var x = v[3];
		var b = v[4];
		var A = v[5];
		var w = v[6];
		var E = 0;
		if (i) {
			var I = e._settings.get("edgeClippingPadding") / e._camera.zoom,
				S = e._camera.screenToGraphCoordinates({
					x: 0,
					y: 0
				}),
				C = e._camera.screenToGraphCoordinates({
					x: 0,
					y: e._camera.height
				}),
				T = e._camera.screenToGraphCoordinates({
					x: e._camera.width,
					y: 0
				}),
				L = e._camera.screenToGraphCoordinates({
					x: e._camera.width,
					y: e._camera.height
				}),
				N = Math.min(S.x, C.x, T.x, L.x) - I,
				z = Math.min(S.y, C.y, T.y, L.y) - I,
				M = Math.max(S.x, C.x, T.x, L.x) + I,
				k = Math.max(S.y, C.y, T.y, L.y) + I
		}
		for (var R = 0, F = n.length; R < F; ++R) {
			var P = n[R],
				D = _.get(P),
				O = m.get(P);
			if (!g.get(D) && !g.get(O) && !w.get(P) && !y.get(P)) {
				var B = l[x.get(P)],
					U = b.get(P) + o,
					X = A.get(P),
					j = h.get(D),
					W = c.get(D),
					G = h.get(O),
					H = c.get(O),
					Y = p.get(D),
					V = p.get(D),
					q = false;
				if (i) {
					var Z = j - Y,
						Q = j + Y,
						J = W - Y,
						K = W + Y,
						$ = G - V,
						ee = G + V,
						te = H - V,
						re = H + V;
					if (!((N < Z && Z < M || N < Q && Q < M) && (z < J && J < k || z < K && K < k) || (N < $ && $ < M || N < ee && ee < M) && (z < te && te < k || z < re && re < k))) {
						continue
					}
				}
				if (D === O) {
					q = B.detectLoop(a, u, j, W, U, X, Y, d)
				} else if (X === 0) {
					q = B.detectStraight(a, u, j, W, G, H, U, Y, V, d)
				} else {
					q = B.detectCurved(a, u, j, W, G, H, U, X, Y, V, d)
				}
				if (q) {
					E = P
				}
			}
		}
		return E
	}
	var kp = ["hover", "zoom", "panning", "rotation", "gesture", "drag", "selection", "tooltip", "user", "interactions", "resizing", "rewiring", "connectNodes", "lasso"];
	g.extend(function(e) {
		var t = new Rp(e);
		e.modules.interactions = t
	});
	var Rp = function e(t) {
			this._captor = t.modules.captor;
			this._events = t.modules.events;
			this._settings = t.modules.settings;
			this._timeout = null;
			this._current = null;
			this._started = false;
			this._scheduled = [];
			this._priority = 0;
			this._startFunc = null
		};
	Rp.prototype.onDrag = function e(t) {
		return Fp(this, "dragStart", "dragProgress", "dragEnd", t)
	};
	Rp.prototype.onGesture = function e(t) {
		return Fp(this, "gestureStart", "gestureProgress", "gestureEnd", t)
	};
	Rp.prototype.onClick = function e(t) {
		return Pp(this, "click", t)
	};
	Rp.prototype.onDoubleClick = function e(t) {
		return Pp(this, "doubleClick", t)
	};
	Rp.prototype.onHover = function e(t) {
		return Pp(this, "hover", t)
	};
	Rp.prototype.onUnhover = function e(t) {
		return Pp(this, "unhover", t)
	};
	Rp.prototype.onMouseWheel = function e(t) {
		return Pp(this, "wheel", t)
	};
	Rp.prototype.onMouseDown = function e(t) {
		return Pp(this, "down", t)
	};
	Rp.prototype.onMouseUp = function e(t) {
		return Pp(this, "up", t)
	};
	Rp.prototype.onMouseMove = function e(t) {
		return Pp(this, "move", t)
	};

	function Fp(e, t, r, n, i) {
		var o = i.check;
		var s = i.onStart;
		var a = i.onStop;
		var u = i.onProgress;
		var l = i.priority;
		var d = i.disableDetection;
		if (l !== undefined) {
			var f = Op(e, {
				priority: Ze(kp, l, "interaction"),
				disableDetection: d,
				check: o,
				onStart: s,
				onStop: a,
				onProgress: u
			});
			e._events.on((h = {}, h[t] = function(e) {
				return f.start(e)
			}, h[r] = function(e) {
				return f.progress(e)
			}, h[n] = function(e) {
				return f.stop(e)
			}, h));
			var h;
			return f
		} else {
			var c = false;
			e._events.on(t, function(e) {
				c = !o || o(e);
				if (c && s) {
					s(e)
				}
			});
			if (u) {
				e._events.on(r, function(e) {
					if (c) {
						u(e)
					}
				})
			}
			if (a) {
				e._events.on(n, function(e) {
					if (c) {
						if (a) {
							a(e)
						}
						c = false
					}
				})
			}
		}
	}
	function Pp(e, t, r) {
		if (typeof r === "function") {
			r = {
				handler: r
			}
		}
		var n = r.priority,
			i = r.handler,
			o = r.check;
		if (n !== undefined) {
			var s = Op(e, {
				priority: Ze(kp, n, "interaction"),
				check: o,
				handler: i
			});
			e._events.on(t, s)
		} else if (i) {
			if (o) {
				e._events.on(t, function(e) {
					if (o(e)) {
						i(e)
					}
				})
			} else {
				e._events.on(t, i)
			}
		}
	}
	var Dp = function() {};

	function Op(e, t) {
		if (t === void 0) t = {};
		if (typeof t === "function") {
			t = {
				onStart: t
			}
		} else if (!ke(t)) {
			throw new TypeError("invalid parameters " + t + ": not an object")
		}
		var r = Be(t.onStart, t.handler),
			n = Be(t.onProgress, Dp),
			i = Be(t.onStop, Dp),
			o = Be(t.check, function() {
				return true
			}),
			s = Be(t.disableDetection, false),
			a = Be(t.priority, 0),
			u = null,
			l = null;
		r = Be(r, Dp);
		var d = function(t) {
				if (o(t) && (!e._current || a >= e._priority)) {
					if (e._current) {
						e._current.stop()
					}
					e._current = u;
					e._priority = a;
					e._started = false;
					e._scheduled = null;
					e._startFunc = function() {
						if (s) {
							l = e._captor.setDetectionEnabled(false)
						}
						r(t)
					};
					Bp(e);
					return true
				}
				return false
			};
		var f = function(t) {
				if (e._current === u) {
					if (e._started) {
						if (s) {
							e._captor.setDetectionEnabled(l)
						}
						i(t)
					}
					if (e._timeout) {
						clearTimeout(e._timeout)
					}
					e._timeout = null;
					e._current = null;
					e._priority = 0;
					e._started = false;
					e._scheduled = null
				}
			};
		var h = function(t) {
				if (e._current === u && e._started) {
					n(t)
				}
			};
		u = function(t) {
			if (d(t)) {
				e._scheduled = f
			}
		};
		u.start = d;
		u.stop = f;
		u.progress = h;
		return u
	}
	function Bp(e) {
		if (!e._timeout) {
			e._timeout = setTimeout(function() {
				if (e._startFunc) {
					e._startFunc();
					e._startFunc = null;
					e._started = true
				}
				if (e._scheduled) {
					e._scheduled()
				}
				e._scheduled = null;
				e._timeout = null
			}, 0)
		}
	}
	var Up = 1e3;
	g.extend(function(e) {
		var t = new Xp(e);
		var r = e.Node;
		var n = e.Edge;
		var i = e.NodeList;
		var o = e.EdgeList;
		e.modules.classes = t;
		e.createClass = function(e, r) {
			return t.create(e, r)
		};
		e.updateClass = function(e, r) {
			return t.update(e, r)
		};
		e.events.onNodesClassAdded = function(r, n) {
			t.onNodesClassAdded(r, n);
			return e.events
		};
		e.events.onNodesClassRemoved = function(r, n) {
			t.onNodesClassRemoved(r, n);
			return e.events
		};
		e.events.onEdgesClassAdded = function(r, n) {
			t.onEdgesClassAdded(r, n);
			return e.events
		};
		e.events.onEdgesClassRemoved = function(r, n) {
			t.onEdgesClassRemoved(r, n);
			return e.events
		};
		e.getNodesByClassName = function(e) {
			return t.getNodesByClass(e)
		};
		r.prototype.addClass = function(e, r) {
			return t.addClassToNodes(e, this, r)
		};
		i.prototype.addClass = function(e, r) {
			return t.addClassToNodes(e, this, r)
		};
		r.prototype.removeClass = function(e, r) {
			return t.removeNodesFromClass(e, this, r)
		};
		i.prototype.removeClass = function(e, r) {
			return t.removeNodesFromClass(e, this, r)
		};
		r.prototype.hasClass = function(e) {
			return t.nodesHaveClass(e, this)[0]
		};
		i.prototype.hasClass = function(e) {
			return t.nodesHaveClass(e, this)
		};
		e.getEdgesByClassName = function(e) {
			return t.getEdgesByClass(e)
		};
		n.prototype.addClass = function(e, r) {
			return t.addClassToEdges(e, this, r)
		};
		o.prototype.addClass = function(e, r) {
			return t.addClassToEdges(e, this, r)
		};
		n.prototype.removeClass = function(e, r) {
			return t.removeEdgesFromClass(e, this, r)
		};
		o.prototype.removeClass = function(e, r) {
			return t.removeEdgesFromClass(e, this, r)
		};
		n.prototype.hasClass = function(e) {
			return t.edgesHaveClass(e, this)[0]
		};
		o.prototype.hasClass = function(e) {
			return t.edgesHaveClass(e, this)
		}
	});
	var Xp = function e(t) {
			var r = this;
			this._graphics = t.modules.graphics;
			this._graph = t.modules.graph;
			this._events = t.modules.events;
			this._classes = [];
			this._events.on({
				"refreshNodeFilters refreshEdgeFilters": function(e) {
					var t = e.newlyExcluded;
					for (var n = 0; n < r._classes.length; ++n) {
						Gp(r, r._classes[n].name, t)
					}
				}
			})
		};
	Xp.prototype.create = function e(t, r) {
		if (r === void 0) r = {};
		var n = r.nodeAttributes;
		var i = r.edgeAttributes;
		var o = r.after;
		var s = Yp(this, o) + 1,
			a = qp(this, s),
			u = new jp(t, s, a, this, this._graph);
		this._events.register([u.nodeAddEvtName, u.edgeAddEvtName, u.nodeRemovalEvtName, u.edgeRemovalEvtName]);
		this._classes.splice(s, 0, u);
		this._graphics.addLayer(t, {
			nodeAttributes: n,
			edgeAttributes: i,
			depth: a
		})
	};
	Xp.prototype.update = function e(t, r) {
		var n = r.nodeAttributes;
		var i = r.edgeAttributes;
		this.setNodeAttribute(t, n);
		this.setEdgeAttributes(t, i)
	};
	Xp.prototype.setNodeAttribute = function e(t, r) {
		if (r === null) {
			this._graphics._resetLayerStyle(t, true)
		} else {
			this._graphics._updateLayerStyle(t, true, r)
		}
		this._graphics.putOnLayer(t, this.getNodesByClass(t))
	};
	Xp.prototype.setEdgeAttributes = function e(t, r) {
		if (r === null) {
			this._graphics._resetLayerStyle(t, false)
		} else {
			this._graphics._updateLayerStyle(t, false, r)
		}
		this._graphics.putOnLayer(t, this.getEdgesByClass(t))
	};
	Xp.prototype.getNodesByClass = function e(t) {
		return Vp(this, t).getNodes()
	};
	Xp.prototype.getEdgesByClass = function e(t) {
		return Vp(this, t).getEdges()
	};
	Xp.prototype.onNodesClassAdded = function e(t, r) {
		this._events.on(Vp(this, t).nodeAddEvtName, r)
	};
	Xp.prototype.onEdgesClassAdded = function e(t, r) {
		this._events.on(Vp(this, t).edgeAddEvtName, r)
	};
	Xp.prototype.onNodesClassRemoved = function e(t, r) {
		this._events.on(Vp(this, t).nodeRemovalEvtName, r)
	};
	Xp.prototype.onEdgesClassRemoved = function e(t, r) {
		this._events.on(Vp(this, t).edgeRemovalEvtName, r)
	};
	Xp.prototype.addClassToNodes = function e(t, r, n) {
		return Wp(this, t, r, n)
	};
	Xp.prototype.addClassToEdges = function e(t, r, n) {
		return Wp(this, t, r, n)
	};
	Xp.prototype.removeNodesFromClass = function e(t, r, n) {
		return Gp(this, t, r, n)
	};
	Xp.prototype.removeEdgesFromClass = function e(t, r, n) {
		return Gp(this, t, r, n)
	};
	Xp.prototype.nodesHaveClass = function e(t, r) {
		return Vp(this, t).hasNodes(r)
	};
	Xp.prototype.edgesHaveClass = function e(t, r) {
		return Vp(this, t).hasEdges(r)
	};
	Xp.prototype.clearNodes = function e(t, r) {
		return Hp(this, t, true, r)
	};
	Xp.prototype.clearEdges = function e(t, r) {
		return Hp(this, t, false, r)
	};
	var jp = function e(t, r, n, i, o) {
			this.index = r;
			this.name = t;
			this._classes = i;
			this.priority = n;
			this.set = o.createSet(), this.nodeAddEvtName = "nodeClassAdded_" + t;
			this.edgeAddEvtName = "edgeClassAdded_" + t;
			this.nodeRemovalEvtName = "nodeClassRemoved_" + t;
			this.edgeRemovalEvtName = "edgeClassRemoved_" + t
		};
	jp.prototype.update = function e(t) {
		this._classes.update(this.name, t);
		return this
	};
	jp.prototype.getNodes = function e() {
		return this.set.getNodes()
	};
	jp.prototype.getEdges = function e() {
		return this.set.getEdges()
	};
	jp.prototype.hasNodes = function e(t) {
		return this.set.hasNodes(t)
	};
	jp.prototype.hasEdges = function e(t) {
		return this.set.hasEdges(t)
	};
	jp.prototype.addElements = function e(t) {
		return this.set.addElements(t)
	};
	jp.prototype.removeElements = function e(t) {
		return this.set.removeElements(t)
	};
	jp.prototype.clearNodes = function e() {
		return this.set.clearNodes()
	};
	jp.prototype.clearEdges = function e() {
		return this.set.clearEdges()
	};

	function Wp(e, t, r, n) {
		if (!r.size) {
			return
		}
		var i = r.isNode,
			o = Vp(e, t),
			s = o.addElements(r);
		e._graphics.animate(function() {
			return e._graphics.putOnLayer(t, s)
		}, n);
		e._events.fire(o[i ? "nodeAddEvtName" : "edgeAddEvtName"], (a = {
			_className: t
		}, a[i ? "nodes" : "edges"] = s, a));
		var a
	}
	function Gp(e, t, r, n) {
		if (!r.size) {
			return
		}
		var i = r.isNode,
			o = Vp(e, t),
			s = o.removeElements(r);
		e._graphics.animate(function() {
			return e._graphics.removeFromLayer(t, s)
		}, n);
		e._events.fire(o[i ? "nodeRemovalEvtName" : "edgeRemovalEvtName"], (a = {
			_className: t
		}, a[i ? "nodes" : "edges"] = s, a));
		var a
	}
	function Hp(e, t, r, n) {
		var i = Vp(e, t),
			o = i[r ? "clearNodes" : "clearEdges"]();
		if (o.size) {
			e._graphics.animate(function() {
				return e._graphics.removeFromLayer(t, o)
			}, n);
			e._events.fire(i[r ? "nodeRemovalEvtName" : "edgeRemovalEvtName"], (s = {
				_className: t
			}, s[r ? "nodes" : "edges"] = o, s));
			var s
		}
	}
	function Yp(e, t) {
		for (var r = 0; r < e._classes.length; ++r) {
			if (e._classes[r].name === t) {
				return r
			}
		}
		return -1
	}
	function Vp(e, t) {
		var r = Yp(e, t);
		if (r === -1) {
			throw new Error('class "' + t + '" does not exist')
		}
		return e._classes[r]
	}
	function qp(e, t) {
		var r = e._classes,
			n = r.length;
		if (t === n) {
			return t === 0 ? Up : r[t - 1].priority * 2
		} else if (t === 0) {
			return r[0].priority / 2
		} else {
			return (r[t - 1].priority + r[t].priority) / 2
		}
	}
	var Zp = function() {
			return {}
		};
	var Qp = function() {
			return undefined
		};
	var Jp = function() {
			return false
		};
	var Kp = function() {};
	var $p = function() {};
	var eg = function() {};
	var tg = function(e) {
			function t(t, r) {
				e.call(this);
				this._dependencies = r;
				this.configure(t)
			}
			if (e) t.__proto__ = e;
			t.prototype = Object.create(e && e.prototype);
			t.prototype.constructor = t;
			t.prototype.configure = function e(t) {
				this._onStart = t.onStart || $p;
				this._onEnd = t.onEnd || eg;
				this._update = t.update || Qp;
				this._onUpdate = t.onUpdate || Kp;
				this._createContext = t.context || Zp;
				this._isRunning = t.isRunning || Jp
			};
			t.prototype.onStart = function e() {
				this.fire("start", {
					target: this
				});
				this._onStart.call(this);
				return this
			};
			return t
		}(M);
	var rg = function(e) {
			function t(t, r) {
				var n = this;
				e.call(this, t, r);
				var i = [ng(t.imports), "", "", "var __CONTEXT = (" + this._createContext.toString() + ")(),", "    __UPDATE_FUNC = " + this._update.toString() + ",", "    __IS_RUNNING_FUNC = " + this._isRunning.toString() + ";", "", 'self.addEventListener("message", function (evt) {', "  var result    = __UPDATE_FUNC(evt.data, __CONTEXT);", "  var isRunning = __IS_RUNNING_FUNC(__CONTEXT, evt.data);", "  self.postMessage({ result: result, isRunning: isRunning });", "});"].join("\n");
				this._worker = _n(i);
				this._sync = function(e) {
					n.sync(e)
				};
				this._worker.addEventListener("message", this._sync)
			}
			if (e) t.__proto__ = e;
			t.prototype = Object.create(e && e.prototype);
			t.prototype.constructor = t;
			t.prototype.sync = function e(t) {
				var r = t.data.isRunning;
				var n = t.data.result;
				var i = this._onUpdate.call(this, n, this._dependencies, r);
				this.fire("update", {
					target: this,
					isRunning: r
				});
				if (r) {
					this.send(i)
				} else {
					this.stop(n)
				}
			};
			t.prototype.stop = function e(t) {
				this._onEnd.call(this, t, this._dependencies);
				this._worker.terminate();
				return this.fire("stop", {
					target: this
				})
			};
			t.prototype.send = function e(t) {
				this._worker.postMessage(t);
				return this
			};
			return t
		}(tg);

	function ng(e) {
		if (!e || e.length === 0) {
			return ""
		}
		var t = [];
		var r = Object.keys(e);
		for (var n = 0, i = r.length; n < i; n++) {
			var o = r[n];
			var s = e[o];
			if (typeof s !== "function") {
				throw new Error('Asynchronous task: dependency "' + o + '" is not found')
			} else {
				t.push("var " + o + " = " + s.toString() + ";")
			}
		}
		return t.join("\n")
	}
	var ig = function(e) {
			function t(t, r) {
				e.call(this, t, r);
				this._stopped = false;
				this._context = this._createContext()
			}
			if (e) t.__proto__ = e;
			t.prototype = Object.create(e && e.prototype);
			t.prototype.constructor = t;
			t.prototype.sync = function e(t) {
				var r = this._update(t, this._context),
					n = this._isRunning(this._context, t);
				t = this._onUpdate.call(this, r, this._dependencies, n);
				this.fire("update", {
					target: this,
					isRunning: n
				});
				if (n) {
					this.send(t)
				} else {
					this.stop(r)
				}
			};
			t.prototype.send = function e(t) {
				var r = this;
				if (!this._stopped) {
					setTimeout(function() {
						return r.sync(t)
					}, 0)
				}
				return this
			};
			t.prototype.stop = function e(t) {
				this._onEnd(t, this._dependencies);
				this._stopped = true;
				return this
			};
			return t
		}(tg);
	g.extend(function(e) {
		return e.modules.tasks = new og(e)
	});
	var og = function e(t) {
			this._ogma = t
		};
	og.prototype.run = function e(t, r, n, i) {
		var o = Be(n, true),
			s = t.configure ||
		function(e) {
			return e
		};
		var a = sg(s, r, i);
		var u = o ? rg : ig;
		var l = new u(t, i);
		l.onStart();
		l.send(a);
		return l
	};

	function sg(e, t, r) {
		var n = e(t, r);
		if (n === undefined) {
			n = t
		}
		return n
	}
	g.extend(function(e) {
		e.modules.generators = new ag(e);
		e.generate = {}
	});
	var ag = function e(t) {
			this._ogma = t;
			this._graph = t.modules.graph;
			this._tasks = t.modules.tasks;
			this._generators = {}
		};
	ag.prototype.register = function e(t, r) {
		qe(this._generators, t, r, "generator")
	};
	ag.prototype.load = function e(t, r) {
		var n = Ze(this._generators, t, "generator"),
			i = n.configure(r);
		return Promise.resolve(n.generate(i))
	};

	function ug(e) {
		if (e === void 0) e = {};
		var t = e.nodes;
		if (t === void 0) t = 10;
		var r = e.edges;
		if (r === void 0) r = 10;
		return {
			nodes: t,
			edges: r
		}
	}
	function lg(e) {
		var t = e.nodes;
		var r = e.edges;
		var n = [],
			i = [];
		for (var o = 0; o < t; o++) {
			n.push({
				id: o,
				attributes: {
					x: Math.random() * 200,
					y: Math.random() * 200
				}
			})
		}
		for (var s = 0; s < r; s++) {
			i.push({
				id: s,
				source: Math.random() * t | 0,
				target: Math.random() * t | 0
			})
		}
		return {
			nodes: n,
			edges: i
		}
	}
	g.extend(function(e) {
		e.modules.generators.register("random", {
			configure: ug,
			generate: lg
		});
		e.generate.random = function(t) {
			return e.modules.generators.load("random", t)
		}
	});

	function dg(e) {
		if (e === void 0) e = {};
		var t = e.rows;
		if (t === void 0) t = 4;
		var r = e.columns;
		if (r === void 0) r = 4;
		return {
			rows: t,
			columns: r
		}
	}
	function fg(e) {
		var t = e.rows;
		var r = e.columns;
		var n = {
			nodes: [],
			edges: []
		},
			i = 15,
			o = 15,
			s = 0;
		for (var a = 0; a < t; ++a) {
			for (var u = 0; u < r; ++u) {
				var l = a * r + u;
				n.nodes.push({
					id: l,
					attributes: {
						x: u * i,
						y: a * o
					}
				});
				if (u !== r - 1) {
					n.edges.push({
						id: s,
						source: l,
						target: a * r + u + 1
					});
					s += 1
				}
				if (a !== t - 1) {
					n.edges.push({
						id: s,
						source: l,
						target: (a + 1) * r + u
					});
					s += 1
				}
			}
		}
		return n
	}
	g.extend(function(e) {
		e.modules.generators.register("grid", {
			configure: dg,
			generate: fg
		});
		e.generate.grid = function(t) {
			return e.modules.generators.load("grid", t)
		}
	});

	function hg(e) {
		if (e === void 0) e = {};
		var t = e.length;
		if (t === void 0) t = 5;
		return {
			length: t
		}
	}
	function cg(e) {
		var t = e.length;
		var r = {
			nodes: [],
			edges: []
		};
		if (t <= 0) {
			return r
		}
		r.nodes.push({
			id: 0,
			attributes: {
				x: Math.random() * 100,
				y: Math.random() * 100
			}
		});
		for (var n = 1; n < t; ++n) {
			r.nodes.push({
				id: n,
				attributes: {
					x: Math.random() * 100,
					y: Math.random() * 100
				}
			});
			r.edges.push({
				id: n - 1,
				source: n - 1,
				target: n
			})
		}
		return r
	}
	g.extend(function(e) {
		e.modules.generators.register("path", {
			configure: hg,
			generate: cg
		});
		e.generate.path = function(t) {
			return e.modules.generators.load("path", t)
		}
	});

	function pg(e) {
		if (e === void 0) e = {};
		var t = e.children;
		if (t === void 0) t = 2;
		var r = e.height;
		if (r === void 0) r = 3;
		if (!Ce(t)) {
			throw new TypeError('Invalid argument: "children" is not a positive number, was ' + t)
		}
		if (!Se(r)) {
			throw new TypeError('Invalid argument: "height" is not a positive number, was ' + r)
		}
		return {
			children: t,
			height: r
		}
	}
	function gg(e) {
		var t = e.children;
		var r = e.height;
		r += 1;
		var n = Math.pow(t, r),
			i = [],
			o = [],
			s = 1,
			a = 0,
			u = 0;
		for (var l = 0; l < r; ++l) {
			var d = n / (s + 1) / 1.5;
			for (var f = 0; f < s; ++f) {
				var h = a++;
				i.push({
					id: h,
					attributes: {
						x: (f + 1) * d * 10,
						y: l * 20
					}
				});
				if (l !== r - 1) {
					for (var c = 0; c < t; ++c) {
						o.push({
							id: u,
							source: h,
							target: h * t + c + 1
						});
						u += 1
					}
				}
			}
			s *= t
		}
		return {
			nodes: i,
			edges: o
		}
	}
	g.extend(function(e) {
		e.modules.generators.register("balancedTree", {
			configure: pg,
			generate: gg
		});
		e.generate.balancedTree = function(t) {
			return e.modules.generators.load("balancedTree", t)
		}
	});

	function vg(e) {
		if (e === void 0) e = {};
		var t = e.nodes;
		if (t === void 0) t = 20;
		var r = e.edges;
		var n = e.p;
		if (!Ie(t) || t < 3) {
			throw new TypeError("Invalid argument: options.nodes is not a number >= 3, was " + t)
		}
		if (r !== undefined && n !== undefined) {
			throw new TypeError("Invalid argument: choose between options.edges and options.p")
		}
		if (r === undefined && n === undefined) {
			n = .1
		}
		return {
			nodes: t,
			edges: r,
			p: n
		}
	}
	function yg(e) {
		var t = {
			nodes: [],
			edges: []
		},
			r, n, i, o = 0,
			s = e.nodes,
			a = e.p;
		if (e.p >= 0) {
			for (n = 0; n < s; n++) {
				t.nodes.push({
					id: n,
					attributes: {
						x: Math.random() * 100,
						y: Math.random() * 100
					}
				});
				for (i = 0; i < n; i++) {
					if (Math.random() < a) {
						t.edges.push({
							id: o++,
							source: n,
							target: i
						})
					}
				}
			}
		} else {
			var u = [],
				l = e.edges;
			for (n = 0; n < s; n++) {
				t.nodes.push({
					id: n,
					x: Math.random() * 100,
					y: Math.random() * 100,
					size: 1
				});
				for (i = n + 1; i < s; i++) {
					u.push({
						source: n,
						target: i
					})
				}
			}
			o = u.length - 1;
			for (n = 0; n < l; n++) {
				r = u.splice(Math.floor(Math.random() * o), 1)[0];
				r.id = n;
				t.edges.push(r);
				o--
			}
		}
		return t
	}
	g.extend(function(e) {
		e.modules.generators.register("erdosRenyi", {
			configure: vg,
			generate: yg
		});
		e.generate.erdosRenyi = function(t) {
			return e.modules.generators.load("erdosRenyi", t)
		}
	});

	function _g(e) {
		if (e === void 0) e = {};
		var t = e.nodes;
		if (t === void 0) t = 40;
		var r = e.m0;
		if (r === void 0) r = 5;
		var n = e.m;
		if (n === void 0) n = 1;
		if (!Ie(t) || t < 3) {
			throw new TypeError("Invalid argument: options.nodes is not a number >= 3, was " + t)
		}
		if (!Ie(r) || r >= t) {
			throw new TypeError("Invalid argument: options.m0 is not a number < " + t + ", was " + r)
		}
		if (!Ie(r) || n >= r) {
			throw new TypeError("Invalid argument: options.m is not a number <= " + r + ", was " + n)
		}
		return {
			nodes: t,
			m0: r,
			m: n
		}
	}
	function mg(e) {
		var t = {
			nodes: [],
			edges: []
		},
			r = {},
			n = [],
			i, o, s, a, u, l, d, f, h = 0,
			c = e.nodes,
			p = e.m0,
			g = e.m;
		for (i = 0; i < p; i++) {
			t.nodes.push({
				id: i,
				attributes: {
					x: Math.random(),
					y: Math.random()
				}
			});
			n[i] = 0
		}
		for (i = 0; i < p; i++) {
			for (o = i + 1; o < p; o++) {
				s = {
					id: h++,
					source: i,
					target: o
				};
				r[s.source + "-" + s.target] = s;
				t.edges.push(s);
				n[i]++;
				n[o]++
			}
		}
		for (i = p; i < c; i++) {
			t.nodes.push({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100
			});
			n[i] = 0;
			a = 0;
			for (o = 0; o < i; o++) {
				a += n[o]
			}
			u = 0;
			for (l = 0; l < g; l++) {
				d = Math.random();
				f = 0;
				for (o = 0; o < i; o++) {
					if (r[i + "-" + o] || r[o + "-" + i]) {
						continue
					}
					if (i == 1) {
						f = 1
					} else {
						f += n[o] / a + u / (i - l)
					}
					if (d <= f) {
						u += n[o] / a;
						s = {
							id: h++,
							source: i,
							target: o
						};
						r[s.source + "-" + s.target] = s;
						t.edges.push(s);
						n[i]++;
						n[o]++;
						break
					}
				}
			}
		}
		return t
	}
	g.extend(function(e) {
		e.modules.generators.register("barabasiAlbert", {
			configure: _g,
			generate: mg
		});
		e.generate.barabasiAlbert = function(t) {
			return e.modules.generators.load("barabasiAlbert", t)
		}
	});

	function xg(e) {
		var t = e.toggleTexts({
			nodes: false,
			edges: false
		});
		var r = t.nodes;
		var n = t.edges;
		this._nodeTextsWereEnabled = r;
		this._edgeTextsWereEnabled = n
	}
	function bg(e) {
		e.toggleTexts({
			nodes: this._nodeTextsWereEnabled,
			edges: this._edgeTextsWereEnabled
		});
		this._nodeTextsWereEnabled = undefined;
		this._edgeTextsWereEnabled = undefined
	}
	var Ag = 40;
	var wg = {
		defaultSyncDuration: 500,
		skipTextDrawing: true,
		useWebWorker: true,
		locate: false
	};
	g.extend(function(e) {
		var t = new Eg(e);
		e.modules.layouts = t;
		e.layouts = {
			stop: function() {
				return t.stop()
			}
		};
		e.events.onLayoutStart = function(t) {
			e.modules.events.on("layoutStart", t);
			return e.events
		};
		e.events.onLayoutComplete = function(t) {
			e.modules.events.on("layoutEnd", t);
			return e.events
		};
		e.modules.graphics._addFeature(true, "layoutable", {
			properties: {
				layoutable: {
					check: function(e) {
						return typeof e === "boolean"
					},
				default:
					true
				}
			}
		})
	});
	var Eg = function e(t) {
			var r = this;
			var n = t.modules;
			var i = n.graph;
			var o = n.graphics;
			var s = n.tasks;
			var a = n.events;
			var u = n.settings;
			var l = n.locate;
			this._modules = n;
			this._events = a;
			this._graph = i;
			this._graphics = o;
			this._tasks = s;
			this._settings = u;
			this._locate = l;
			this._layouts = {};
			this._nodeTextsWereEnabled = undefined;
			this._edgeTextsWereEnabled = undefined;
			Object.keys(wg).forEach(function(e) {
				r._settings.register("layouts." + e, wg[e])
			});
			this._events.register(["layoutStart", "layoutEnd"]);
			this._currentLayout = null;
			this._events.on("clear", function() {
				return r.stop()
			})
		};
	Eg.prototype.register = function e(t, r) {
		qe(this._layouts, t, r, "layout")
	};
	Eg.prototype.getAvailableLayouts = function e() {
		return Object.keys(this._layouts)
	};
	Eg.prototype.start = function e(t, r) {
		var n = this;
		if (r === void 0) r = {};
		var i = this._layouts[t];
		var o = this._settings;
		var s = this;
		return new Promise(function(e) {
			if (!i) {
				throw new Error("layout " + t + " does not exist")
			}
			if (n._currentLayout) {
				n._currentLayout.stop()
			}
			var a = typeof r.duration === "number" ? r.duration : o.get("layouts.defaultSyncDuration");
			var u = i.onSync;
			var l = r.onSync;
			var d = 0;
			var f = Be(r.skipTextDrawing, o.get("layouts.skipTextDrawing"));
			var h = r.locate || o.get("layouts.locate");
			r.name = t;
			r.skipTextDrawing = f;
			if (h) {
				if (typeof h === "boolean") {
					h = {
						duration: a
					}
				} else {
					h.duration = a
				}
			}
			var c = {
				update: i.update,
				isRunning: i.isRunning,
				configure: i.configure,
				context: i.context,
				imports: i.imports,
				onStart: function() {
					if (f) {
						xg.call(s, s._graphics)
					}
					s.onStart(i, r, this)
				},
				onUpdate: function(e, t, r) {
					var n = this;
					var i = ie();
					if (r && i - d < Ag) {
						return
					}
					d = i;
					if (l) {
						setTimeout(function() {
							return l(e, t, r)
						}, a)
					}
					if (u) {
						s._graphics.animate(function() {
							s._graphics.refreshAll();
							u(e, t, r);
							if (h) {
								s._locate.locateNodes(undefined, h)
							}
						}, a).then(function() {
							if (!r) {
								n.fire("complete")
							}
						})
					} else if (!r) {
						this.fire("complete")
					}
				},
				onEnd: function(t, n) {
					this.once("complete", function() {
						s.onComplete(t, i, r, n, e, r.onEnd)
					})
				}
			};
			n._currentLayout = n._tasks.run(c, r, Be(r.useWebWorker, n._settings.get("layouts.useWebWorker")), n._modules)
		})
	};
	Eg.prototype.onComplete = function e(t, r, n, i, o, s) {
		var a = this;
		if (r.onEnd) {
			r.onEnd(t, i, null, false)
		}
		if (n.skipTextDrawing) {
			setTimeout(function() {
				return bg.call(a, a._graphics)
			}, 200)
		}
		this._graphics.refreshAll();
		this._currentLayout = null;
		var u = n.nodeData.indexes;
		var l = Ig(u, this._graph, this._graphics);
		var d = n.nodeData;
		this._events.fire("layoutEnd", {
			type: "layoutEnd",
			name: n.name,
			positions: {
				current: l.positions,
				before: d.positions
			},
			ids: l.ids
		});
		setTimeout(function() {
			if (s) {
				s(t)
			}
			o()
		})
	};
	Eg.prototype.onStart = function e(t, r, n) {
		var i = this._graph;
		var o = i.nodeIndexList(r.nodes);
		var s = Ig(o, i, this._graphics);
		r.nodeData = s;
		o = s.ids;
		this._events.fire("layoutStart", {
			type: "layoutStart",
			name: r.name,
			ids: o,
			task: n
		})
	};
	Eg.prototype.stop = function e() {
		if (this._currentLayout) {
			this._currentLayout.stop();
			this._currentLayout = null
		}
	};
	Eg.prototype.isRunning = function e() {
		return !!this._currentLayout
	};

	function Ig(e, t, r) {
		var n = e.length;
		var i = t._getIds(true, e);
		var o = r.getAttributes(new t.NodeList(e), ["x", "y"]);
		return {
			positions: o,
			indexes: e,
			ids: i,
			size: n
		}
	}
	var Sg = {
		configure: function(e, t) {
			var r = t.graph;
			var n = t.camera;
			var i = t.graphics;
			if (!e.nodes) {
				e.nodes = r.getNodes()
			}
			if (e.nodes && e.nodes instanceof r.NodeList) {
				e.nodes = e.nodes.getId()
			}
			var o = r.nodeIndexList(e.nodes);
			var s, a = {},
				u = {};
			var l = o.length,
				d, f;
			var h = r._nodes,
				c = r._edges;
			if (e.nodes) {
				e = ut(e);
				delete e.nodes
			}
			var p = i._getAttributeArray(true, "innerStroke.width");
			var g = i._getAttributeArray(true, "outerStroke.width");
			var v = r._degrees(o);
			var y = r.getNodeAttributesArrays(["x", "y", "radius"], {
				ids: o,
				destArrays: [new Float32Array(l), new Float32Array(l), new Array(l)]
			});
			var _ = y[0];
			var m = y[1];
			var x = y[2];
			p = p.getMultiple(o);
			g = g.getMultiple(o);
			var b = i.getAttribute(new r.NodeList(o), "layoutable");
			var A = typeof e.nodeMass === "function" ? e.nodeMass : function(e, t, r) {
					return t + 1
				};
			delete e.nodeMass;
			var w = typeof e.edgeWeight === "function" ? e.edgeWeight : function(e) {
					return 1
				};
			delete e.edgeWeight;
			var E = o.reduce(function(e, t, r) {
				if (!b[r]) {
					e[t] = true
				}
				return e
			}, {});
			var I = 0,
				S = 0,
				C = 0;
			var T = n.zoom;
			for (f = 0; f < o.length; ++f) {
				var L = o[f];
				var N = _[f],
					z = m[f];
				a[L] = {
					id: L,
					x: N,
					y: z,
					degree: v[f],
					size: x[f] + (p[f] + g[f]) / T,
					pinned: !! E[L],
					mass: A(h.get(L), v[f], f)
				}
			}
			if (l > 1) {
				for (f = 0; f < l; f++) {
					var M = a[o[f]];
					if (!M.pinned) {
						var k = Math.random() * 1e-6;
						var R = Math.random() * 1e-6;
						M.x += k;
						M.y += R
					}
					I += M.x;
					S += M.y
				}
			}
			I /= l;
			S /= l;
			var F = {
				x: I,
				y: S
			};
			s = r._getAdjacentElements(false, o);
			d = s.length;
			var P = r._getSources(s);
			var D = r._getTargets(s);
			for (f = 0; f < d; f++) {
				var O = s[f];
				var B = P[f];
				var U = D[f];
				if (a[B] && a[U]) {
					u[O] = {
						source: B,
						target: U
					};
					u[O].weight = w(c.get(O))
				}
			}
			return {
				nodes: a,
				edges: u,
				config: e,
				barycentre: F
			}
		},
		context: function() {
			return {}
		},
		update: function(e, t) {
			var r;
			if (!t.W) {
				r = {
					ppn: 10,
					ppe: 3,
					ppr: 9,
					MAX_SUBDIVISION_RETRIES: 3,
					maxForce: 10,
					iterations: 0,
					converged: false,
					settings: {
						linLogMode: false,
						outboundAttractionDistribution: false,
						adjustSizes: false,
						edgeWeightInfluence: 0,
						scalingRatio: 100,
						strongGravityMode: true,
						gravity: 1,
						slowDown: 1,
						barnesHutOptimize: false,
						barnesHutTheta: .5,
						startingIterations: 10,
						iterationsPerRender: 10,
						maxIterations: 1e3,
						avgDistanceThreshold: .01,
						autoStop: true,
						alignNodeSiblings: true,
						nodeSiblingsScale: 5,
						nodeSiblingsAngleMin: 0
					}
				};
				t.W = r;
				b(e, e.config);
				r.settings = s(e.config, r.settings);
				t.nodes = e.nodes;
				t.edges = e.edges;
				t.barycentre = e.barycentre
			} else {
				r = t.W
			}
			var n = t.NodeMatrix,
				i = t.EdgeMatrix,
				o;

			function s() {
				var e = arguments;
				var t, r, n = {},
					i = arguments.length;
				for (t = i - 1; t >= 0; t--) {
					for (r in arguments[t]) {
						n[r] = e[t][r]
					}
				}
				return n
			}
			function a(e, t, r, n) {
				var i = r - e,
					o = n - t;
				return Math.sqrt(i * i + o * o)
			}
			function u(value, e, t, r, n) {
				return (n - r) * (value - e) / (t - e) + r
			}
			function l(e) {
				return Math.acos(e.x / Math.sqrt(e.x * e.x + e.y * e.y))
			}
			function d(e, t, r, n) {
				return {
					xi: -(n - t),
					yi: r - e,
					xi_prime: n - t,
					yi_prime: -(r - e)
				}
			}
			function f(e, t) {
				return {
					x: (e.xi_prime - e.xi) / t,
					y: (e.yi_prime - e.yi) / t
				}
			}
			function h(e, t, r, n, i) {
				return {
					x: e + (r - e) * i,
					y: t + (n - t) * i
				}
			}
			var c = {
				x: 0,
				y: 1,
				dx: 2,
				dy: 3,
				old_dx: 4,
				old_dy: 5,
				mass: 6,
				convergence: 7,
				size: 8,
				pinned: 9
			};
			var p = {
				source: 0,
				target: 1,
				weight: 2
			};
			var g = {
				node: 0,
				centerX: 1,
				centerY: 2,
				size: 3,
				nextSibling: 4,
				firstChild: 5,
				mass: 6,
				massCenterX: 7,
				massCenterY: 8
			};

			function v(e, t) {
				if (e % r.ppn !== 0) {
					throw new Error('Invalid argument in np: "i" is not correct (' + e + ").")
				}
				if (e !== parseInt(e)) {
					throw new TypeError('Invalid argument in np: "i" is not an integer.')
				}
				if (t in c) {
					return e + c[t]
				} else {
					throw new Error("ForceLink.Worker - " + "Inexistant node property given (" + t + ").")
				}
			}
			function y(e, t) {
				if (e % r.ppe !== 0) {
					throw new Error('Invalid argument in ep: "i" is not correct (' + e + ").")
				}
				if (e !== parseInt(e)) {
					throw new TypeError('Invalid argument in ep: "i" is not an integer.')
				}
				if (t in p) {
					return e + p[t]
				} else {
					throw new Error("ForceLink.Worker - " + "Inexistant edge property given (" + t + ").")
				}
			}
			function _(e, t) {
				if (e % r.ppr !== 0) {
					throw new Error('Invalid argument in rp: "i" is not correct (' + e + ").")
				}
				if (e !== parseInt(e)) {
					throw new TypeError('Invalid argument in rp: "i" is not an integer.')
				}
				if (t in g) {
					return e + g[t]
				} else {
					throw new Error("ForceLink.Worker - " + "Inexistant region property given (" + t + ").")
				}
			}
			function m(e, t) {
				switch (t.randomize) {
				case "globally":
					return Math.random() * (t.randomizeFactor || 1);
				case "locally":
					return e + Math.random() * (t.randomizeFactor || 1);
				default:
					return e
				}
			}
			function x(e, t) {
				var n = e.nodes,
					i = e.edges,
					o = Object.keys(e.nodes),
					s = Object.keys(e.edges),
					a = o.length * r.ppn,
					u = s.length * r.ppe,
					l = {},
					d, f, h;
				var c = new Float32Array(a);
				var p = new Float32Array(u);
				for (d = f = 0, h = o.length; d < h; d++) {
					var g = o[d],
						v = n[g];
					l[g] = f;
					c[f] = m(v.x, t);
					c[f + 1] = m(v.y, t);
					c[f + 2] = 0;
					c[f + 3] = 0;
					c[f + 4] = 0;
					c[f + 5] = 0;
					c[f + 6] = v.mass;
					c[f + 7] = 1;
					c[f + 8] = v.size;
					c[f + 9] = v.pinned || 0;
					f += r.ppn
				}
				for (d = f = 0, h = s.length; d < h; d++) {
					g = s[d];
					var y = i[g];
					p[f] = l[y.source];
					p[f + 1] = l[y.target];
					p[f + 2] = y.weight || 0;
					f += r.ppe
				}
				return {
					nodes: c,
					edges: p
				}
			}
			function b(e, n) {
				var i = x(e, n);
				t.NodeMatrix = i.nodes;
				t.EdgeMatrix = i.edges;
				r.nodesLength = t.NodeMatrix.length;
				r.edgesLength = t.EdgeMatrix.length
			}
			function A() {
				var e, t, s, c, p, g, y, _, m, x, b, A, w;
				var E, I, S, C, T, L, N, z, distance, M, k;
				for (g = 0; g < r.nodesLength; g += r.ppn) {
					n[g + 4] = n[g + 2];
					n[g + 5] = n[g + 3];
					n[g + 2] = 0;
					n[g + 3] = 0
				}
				if (r.settings.outboundAttractionDistribution) {
					E = 0;
					for (g = 0; g < r.nodesLength; g += r.ppn) {
						E += n[g + 6]
					}
					E /= r.nodesLength
				}
				if (r.settings.barnesHutOptimize) {
					var R = Infinity,
						F = -Infinity,
						P = Infinity,
						D = -Infinity,
						O, B, U;
					o = [];
					for (g = 0; g < r.nodesLength; g += r.ppn) {
						R = Math.min(R, n[g]);
						F = Math.max(F, n[g]);
						P = Math.min(P, n[g + 1]);
						D = Math.max(D, n[g + 1])
					}
					var X = F - R,
						j = D - P;
					if (X > j) {
						P -= (X - j) / 2;
						D = P + X
					} else {
						R -= (j - X) / 2;
						F = R + j
					}
					o[0] = -1;
					o[0 + 1] = (R + F) / 2;
					o[0 + 2] = (P + D) / 2;
					o[0 + 3] = Math.max(F - R, D - P);
					o[0 + 4] = -1;
					o[0 + 5] = -1;
					o[0 + 6] = 0;
					o[0 + 7] = 0;
					o[0 + 8] = 0;
					c = 1;
					var W = 0;
					for (g = 0; g < r.nodesLength; g += r.ppn) {
						p = 0;
						U = r.MAX_SUBDIVISION_RETRIES;
						while (true) {
							if (o[p + 5] >= 0) {
								if (n[g] < o[p + 1]) {
									if (n[g + 1] < o[p + 2]) {
										O = o[p + 5]
									} else {
										O = o[p + 5] + r.ppr
									}
								} else {
									if (n[g + 1] < o[p + 2]) {
										O = o[p + 5] + r.ppr * 2
									} else {
										O = o[p + 5] + r.ppr * 3
									}
								}
								o[p + 7] = (o[p + 7] * o[p + 6] + n[g] * n[g + 6]) / (o[p + 6] + n[g + 6]);
								o[p + 8] = (o[p + 8] * o[p + 6] + n[g + 1] * n[g + 6]) / (o[p + 6] + n[g + 6]);
								o[p + 6] += n[g + 6];
								p = O;
								continue
							} else {
								if (o[p] < 0) {
									o[p] = g;
									break
								} else {
									o[p + 5] = c * r.ppr;
									x = o[p + 3] / 2;
									b = o[p + 5];
									o[b] = -1;
									o[b + 1] = o[p + 1] - x;
									o[b + 2] = o[p + 2] - x;
									o[b + 3] = x;
									o[b + 4] = b + r.ppr;
									o[b + 5] = -1;
									o[b + 6] = 0;
									o[b + 7] = 0;
									o[b + 8] = 0;
									b += r.ppr;
									o[b] = -1;
									o[b + 1] = o[p + 1] - x;
									o[b + 2] = o[p + 2] + x;
									o[b + 3] = x;
									o[b + 4] = b + r.ppr;
									o[b + 5] = -1;
									o[b + 6] = 0;
									o[b + 7] = 0;
									o[b + 8] = 0;
									b += r.ppr;
									o[b] = -1;
									o[b + 1] = o[p + 1] + x;
									o[b + 2] = o[p + 2] - x;
									o[b + 3] = x;
									o[b + 4] = b + r.ppr;
									o[b + 5] = -1;
									o[b + 6] = 0;
									o[b + 7] = 0;
									o[b + 8] = 0;
									b += r.ppr;
									o[b] = -1;
									o[b + 1] = o[p + 1] + x;
									o[b + 2] = o[p + 2] + x;
									o[b + 3] = x;
									o[b + 4] = o[p + 4];
									o[b + 5] = -1;
									o[b + 6] = 0;
									o[b + 7] = 0;
									o[b + 8] = 0;
									c += 4;
									if (n[o[p]] < o[p + 1]) {
										if (n[o[p] + 1] < o[p + 2]) {
											O = o[p + 5]
										} else {
											O = o[p + 5] + r.ppr
										}
									} else {
										if (n[o[p] + 1] < o[p + 2]) {
											O = o[p + 5] + r.ppr * 2
										} else {
											O = o[p + 5] + r.ppr * 3
										}
									}
									o[p + 6] = n[o[p] + 6];
									o[p + 7] = n[o[p]];
									o[p + 8] = n[o[p] + 1];
									o[O] = o[p];
									o[p] = -1;
									if (n[g] < o[p + 1]) {
										if (n[g + 1] < o[p + 2]) {
											B = o[p + 5]
										} else {
											B = o[p + 5] + r.ppr
										}
									} else {
										if (n[g + 1] < o[p + 2]) {
											B = o[p + 5] + r.ppr * 2
										} else {
											B = o[p + 5] + r.ppr * 3
										}
									}
									if (O === B) {
										if (U--) {
											p = O;
											continue
										} else {
											U = r.MAX_SUBDIVISION_RETRIES;
											break
										}
									}
									o[B] = g;
									break
								}
							}
						}
					}
				}
				if (r.settings.barnesHutOptimize) {
					I = r.settings.scalingRatio;
					for (g = 0; g < r.nodesLength; g += r.ppn) {
						p = 0;
						while (true) {
							if (o[p + 5] >= 0) {
								distance = Math.sqrt((n[g] - o[p + 7]) * (n[g] - o[p + 7]) + (n[g + 1] - o[p + 8]) * (n[g + 1] - o[p + 8]));
								if (2 * o[p + 3] / distance < r.settings.barnesHutTheta) {
									S = n[g] - o[p + 7];
									C = n[g + 1] - o[p + 8];
									if (r.settings.adjustSizes) {
										if (distance > 0) {
											k = I * n[g + 6] * o[p + 6] / distance / distance;
											n[g + 2] += S * k;
											n[g + 3] += C * k
										} else if (distance < 0) {
											k = -I * n[g + 6] * o[p + 6] / distance;
											n[g + 2] += S * k;
											n[g + 3] += C * k
										}
									} else {
										if (distance > 0) {
											k = I * n[g + 6] * o[p + 6] / distance / distance;
											n[g + 2] += S * k;
											n[g + 3] += C * k
										}
									}
									if (o[p + 4] < 0) {
										break
									}
									p = o[p + 4];
									continue
								} else {
									p = o[p + 5];
									continue
								}
							} else {
								if (o[p] >= 0 && o[p] !== g) {
									S = n[g] - n[o[p]];
									C = n[g + 1] - n[o[p] + 1];
									distance = Math.sqrt(S * S + C * C);
									if (r.settings.adjustSizes) {
										if (distance > 0) {
											k = I * n[g + 6] * n[o[p] + 6] / distance / distance;
											n[g + 2] += S * k;
											n[g + 3] += C * k
										} else if (distance < 0) {
											k = -I * n[g + 6] * n[o[p] + 6] / distance;
											n[g + 2] += S * k;
											n[g + 3] += C * k
										}
									} else {
										if (distance > 0) {
											k = I * n[g + 6] * n[o[p] + 6] / distance / distance;
											n[g + 2] += S * k;
											n[g + 3] += C * k
										}
									}
								}
								if (o[p + 4] < 0) {
									break
								}
								p = o[p + 4];
								continue
							}
						}
					}
				} else {
					I = r.settings.scalingRatio;
					for (y = 0; y < r.nodesLength; y += r.ppn) {
						for (_ = 0; _ < y; _ += r.ppn) {
							S = n[y] - n[_];
							C = n[y + 1] - n[_ + 1];
							if (r.settings.adjustSizes) {
								distance = Math.sqrt(S * S + C * C) - n[y + 8] - n[_ + 8];
								if (distance > 0) {
									k = I * n[y + 6] * n[_ + 6] / distance / distance;
									n[y + 2] += S * k;
									n[y + 3] += C * k;
									n[_ + 2] += S * k;
									n[_ + 3] += C * k
								} else if (distance < 0) {
									k = 100 * I * n[y + 6] * n[_ + 6];
									n[y + 2] += S * k;
									n[y + 3] += C * k;
									n[_ + 2] -= S * k;
									n[_ + 3] -= C * k
								}
							} else {
								distance = Math.sqrt(S * S + C * C);
								if (distance > 0) {
									k = I * n[y + 6] * n[_ + 6] / distance / distance;
									n[y + 2] += S * k;
									n[y + 3] += C * k;
									n[_ + 2] -= S * k;
									n[_ + 3] -= C * k
								}
							}
						}
					}
				}
				b = r.settings.gravity / r.settings.scalingRatio;
				I = r.settings.scalingRatio;
				for (g = 0; g < r.nodesLength; g += r.ppn) {
					k = 0;
					S = n[g];
					C = n[g + 1];
					distance = Math.sqrt(S * S + C * C);
					if (r.settings.strongGravityMode) {
						if (distance > 0) {
							k = I * n[g + 6] * b
						}
					} else {
						if (distance > 0) {
							k = I * n[g + 6] * b / distance
						}
					}
					n[g + 2] -= S * k;
					n[g + 3] -= C * k
				}
				I = 1 * (r.settings.outboundAttractionDistribution ? E : 1);
				for (m = 0; m < r.edgesLength; m += r.ppe) {
					y = i[m];
					_ = i[m + 1];
					x = i[m + 2];
					N = Math.pow(x, r.settings.edgeWeightInfluence);
					S = n[y] - n[_];
					C = n[y + 1] - n[_ + 1];
					if (r.settings.adjustSizes) {
						distance = Math.sqrt(S * S + C * C) - n[y + 8] - n[_ + 8];
						if (r.settings.linLogMode) {
							if (r.settings.outboundAttractionDistribution) {
								if (distance > 0) {
									k = -I * N * Math.log(1 + distance) / distance / n[y + 6]
								}
							} else {
								if (distance > 0) {
									k = -I * N * Math.log(1 + distance) / distance
								}
							}
						} else {
							if (r.settings.outboundAttractionDistribution) {
								if (distance > 0) {
									k = -I * N / n[y + 6]
								}
							} else {
								if (distance > 0) {
									k = -I * N
								}
							}
						}
					} else {
						distance = Math.sqrt(S * S + C * C);
						if (r.settings.linLogMode) {
							if (r.settings.outboundAttractionDistribution) {
								if (distance > 0) {
									k = -I * N * Math.log(1 + distance) / distance / n[y + 6]
								}
							} else {
								if (distance > 0) {
									k = -I * N * Math.log(1 + distance) / distance
								}
							}
						} else {
							if (r.settings.outboundAttractionDistribution) {
								distance = 1;
								k = -I * N / n[y + 6]
							} else {
								distance = 1;
								k = -I * N
							}
						}
					}
					if (distance > 0) {
						n[y + 2] += S * k;
						n[y + 3] += C * k;
						n[_ + 2] -= S * k;
						n[_ + 3] -= C * k
					}
				}
				var G, H, Y, V, q = 0;
				if (r.settings.adjustSizes) {
					for (g = 0; g < r.nodesLength; g += r.ppn) {
						if (!n[v(g, "pinned")]) {
							G = Math.sqrt(n[g + 2] * n[g + 2] + n[g + 3] * n[g + 3]);
							if (G > r.maxForce) {
								n[g + 2] = n[g + 2] * r.maxForce / G;
								n[g + 3] = n[g + 3] * r.maxForce / G
							}
							H = n[g + 6] * Math.sqrt((n[g + 4] - n[g + 2]) * (n[g + 4] - n[g + 2]) + (n[g + 5] - n[g + 3]) * (n[g + 5] - n[g + 3]));
							Y = Math.sqrt((n[g + 4] + n[g + 2]) * (n[g + 4] + n[g + 2]) + (n[g + 5] + n[g + 3]) * (n[g + 5] + n[g + 3])) / 2;
							V = .1 * Math.log(1 + Y) / (1 + Math.sqrt(H));
							T = n[g];
							L = n[g + 1];
							n[g] = n[g] + n[g + 2] * (V / r.settings.slowDown);
							n[g + 1] = n[g + 1] + n[g + 3] * (V / r.settings.slowDown);
							S = n[g];
							C = n[g + 1];
							distance = Math.sqrt((S - T) * (S - T) + (C - L) * (C - L));
							q += distance
						}
					}
				} else {
					for (g = 0; g < r.nodesLength; g += r.ppn) {
						if (!n[v(g, "pinned")]) {
							H = n[g + 6] * Math.sqrt((n[g + 4] - n[g + 2]) * (n[g + 4] - n[g + 2]) + (n[g + 5] - n[g + 3]) * (n[g + 5] - n[g + 3]));
							Y = Math.sqrt((n[g + 4] + n[g + 2]) * (n[g + 4] + n[g + 2]) + (n[g + 5] + n[g + 3]) * (n[g + 5] + n[g + 3])) / 2;
							V = n[g + 7] * Math.log(1 + Y) / (1 + Math.sqrt(H));
							n[g + 7] = Math.min(1, Math.sqrt(V * (n[g + 2] * n[g + 2] + n[g + 3] * n[g + 3]) / (1 + Math.sqrt(H))));
							T = n[g];
							L = n[g + 1];
							n[g] = n[g] + n[g + 2] * (V / r.settings.slowDown);
							n[g + 1] = n[g + 1] + n[g + 3] * (V / r.settings.slowDown);
							S = n[g];
							C = n[g + 1];
							distance = Math.sqrt((S - T) * (S - T) + (C - L) * (C - L));
							q += distance
						}
					}
				}
				r.iterations++;
				if (r.settings.autoStop) {
					r.converged = r.iterations > r.settings.maxIterations || q / r.nodesLength < r.settings.avgDistanceThreshold;
					if (r.converged && r.settings.alignNodeSiblings) {
						var Z = {},
							Q = {},
							J, K;
						for (m = 0; m < r.edgesLength; m += r.ppe) {
							y = i[m];
							_ = i[m + 1];
							if (y === _) {
								continue
							}
							Z[y] = Z[y] || {};
							Z[_] = Z[_] || {};
							Z[y][_] = true;
							Z[_][y] = true
						}
						Object.keys(Z).forEach(function(e) {
							e = ~~e;
							K = Object.keys(Z[e]);
							if (K.length == 2) {
								J = K[0] + ";" + K[1];
								if (J in Q) {
									Q[J].push(e)
								} else {
									J = K[1] + ";" + K[0];
									if (!Q[J]) {
										Q[J] = [~~K[1], ~~K[0]]
									}
									Q[J].push(e)
								}
							}
						});
						var $, ee, te, re, ne, ie, oe, se, ae, ue, le, de, fe, he, ce, pe = r.settings.nodeSiblingsAngleMin;
						Object.keys(Q).forEach(function(e) {
							ee = Q[e].shift();
							te = Q[e].shift();
							$ = Q[e].filter(function(e) {
								return !n[v(e, "pinned")]
							});
							if ($.length == 1) {
								return
							}
							ie = n[ee];
							oe = n[ee + 1];
							se = n[te];
							ae = n[te + 1];
							re = Object.keys(Z[ee]).length;
							ne = Object.keys(Z[te]).length;
							ue = u(re / (re + ne), 0, 1, 1 / 4, 3 / 4);
							de = h(ie, oe, se, ae, ue);
							fe = d(ie, oe, se, ae);
							le = a(ie, oe, se, ae);
							he = f(fe, le);
							ce = l(he);
							if (2 * pe > Math.PI) {
								throw new Error("ForceLink.Worker - Invalid parameter: angleMin must be smaller than 2 PI.")
							}
							if (pe > 0) {
								if (ce < pe || ce > Math.PI - pe && ce <= Math.PI) {
									he = {
										x: Math.cos(Math.PI - pe) * 2,
										y: Math.sin(Math.PI - pe) * 2
									}
								} else if (ce > 2 * Math.PI - pe || ce >= Math.PI && ce < Math.PI + pe) {
									he = {
										x: Math.cos(pe) * 2,
										y: Math.sin(pe) * 2
									}
								}
							}
							var t = 0,
								i = 1,
								o = 1;
							if ($.length % 2 == 1) {
								o = 0;
								t = 1
							}
							for (var s = 0; s < $.length; s++) {
								n[$[s]] = de.x + i * he.x * o * (t || s >= 2 ? r.settings.nodeSiblingsScale : r.settings.nodeSiblingsScale * 2 / 3);
								n[$[s] + 1] = de.y + i * he.y * o * (t || s >= 2 ? r.settings.nodeSiblingsScale : r.settings.nodeSiblingsScale * 2 / 3);
								i = -i;
								o += (s + t) % 2
							}
						})
					}
				}
			}
			function w() {
				if (r.settings.autoStop) {
					var e = 0;
					while (!r.converged) {
						A()
					}
				} else {
					var n = r.iterations === 0 ? r.settings.startingIterations : r.iterations + r.settings.iterationsPerRender;
					while (r.iterations !== n) {
						A()
					}
				}
				return {
					nodes: E(t.nodes),
					barycentre: t.barycentre
				}
			}
			function E(e) {
				var t = Object.keys(e);
				var i = {};
				for (var o = 0; o < n.length; o += r.ppn) {
					var s = t[o / r.ppn];
					i[s] = {
						id: s,
						x: n[o],
						y: n[o + 1],
						pinned: n[v(o, "pinned")]
					}
				}
				return i
			}
			return w()
		},
		isRunning: function(e) {
			return !e.W.settings.autoStop
		},
		onSync: function(e, t) {
			var r = e.nodes;
			var n = e.barycentre;
			var i = t.graphics;
			var o = t.graph;
			var s = Object.keys(r);
			var a = s.length;
			var u = 0,
				l = 0;
			var d, f, h, c, p, g, v;
			var y = new Array(a);
			var _ = new Array(a);
			var m = new Array(a);
			var x = 0;
			for (d = 0; d < a; d++) {
				f = s[d];
				h = r[f];
				c = h.x;
				p = h.y;
				y[d] = parseInt(f);
				_[d] = {
					x: c,
					y: p
				};
				m[d] = h.pinned;
				u += c;
				l += p
			}
			g = u / a - n.x;
			v = l / a - n.y;
			for (d = 0; d < a; d++) {
				if (!m[d]) {
					_[d].x -= g;
					_[d].y -= v
				}
			}
			i.setAttributes(new o.NodeList(y), _)
		}
	};
	g.extend(function(e) {
		e.layouts.forceLink = function(t) {
			if (t === void 0) t = {};
			return e.modules.layouts.start("forceLink", t)
		};
		e.modules.layouts.register("forceLink", Sg)
	});
	var Cg = {
		dependencies: ["locate", "graph", "graphics", "data"],
		configure: function(e, t) {
			var r = t.graph;
			var n = t.locate;
			var i = t.data;
			var o = t.graphics;
			var s = e.sortBy;
			var a = e.rows;
			var u = e.cols;
			if (!e.nodes) {
				e.nodes = r.getNodes()
			}
			if (e.nodes && !(e.nodes instanceof r.NodeList)) {
				e.nodes = r.getNodes(e.nodes)
			}
			function l(e) {
				return e === undefined || typeof e === "number" && isFinite(e) && e > 0
			}
			if (!l(a)) {
				throw new TypeError('"rows" should be a positive integer')
			}
			if (!l(u)) {
				throw new TypeError('"cols" should be a positive integer')
			}
			var d = e.nodes;
			var f = e.nodes._indexes;
			var h = f.length;
			if (a) {
				u = Math.ceil(h / a)
			} else if (u) {
				a = Math.ceil(h / u)
			} else {
				u = Math.ceil(Math.sqrt(h));
				a = Math.ceil(h / u)
			}
			var c, p;
			var g;
			var v = e.sortFallbackValue;
			if (typeof s === "string") {
				if (s === "radius") {
					g = r.getAttribute(true, "radius").getMultiple(f)
				} else if (s === "random") {
					g = new Array(h);
					for (c = 0; c < h; c++) {
						g[c] = Math.random()
					}
				} else {
					g = d.getData(s);
					if (v !== undefined) {
						for (c = 0; c < h; c++) {
							if (g[c] === undefined) {
								g[c] = v
							}
						}
					}
				}
			} else {
				g = new Array(h);
				for (c = 0; c < h; c++) {
					g[c] = c
				}
			}
			var y = [];
			var _ = o.getAttribute(d, "layoutable");
			for (c = 0; c < h; ++c) {
				p = f[c];
				if (_[c]) {
					y.push({
						id: p,
						attr: g[c]
					})
				}
			}
			var m = n.nodesBoundingBox(d),
				x = m.maxSize * 1.1,
				b = m.minX + x,
				A = m.maxX - x,
				w = m.minY + x,
				E = m.maxY - x;
			if (m.width < x * u * 2) {
				b = m.cx - x * u + x;
				A = m.cx + x * u - x
			}
			if (m.height < x * a * 2) {
				w = m.cy - x * a + x;
				E = m.cy + x * a - x
			}
			return {
				sort: !! s,
				nodes: y,
				reverse: !! e.reverse,
				cols: u,
				rows: a,
				minX: b,
				maxX: A,
				minY: w,
				maxY: E
			}
		},
		update: function(e) {
			if (e.sort) {
				e.nodes.sort(function(e, t) {
					var r = e.attr,
						n = t.attr;
					if (r < n) {
						return -1
					} else if (r > n) {
						return 1
					} else {
						return 0
					}
				})
			}
			if (e.reverse) {
				e.nodes.reverse()
			}
			var t = (e.maxX - e.minX) / (e.cols - 1),
				r = (e.maxY - e.minY) / (e.rows - 1),
				n = 0,
				i = 0,
				o = e.minX,
				s = e.minY;
			if (!isFinite(t)) {
				t = 0
			}
			if (!isFinite(r)) {
				r = 0
			}
			for (var a = 0; a < e.nodes.length; ++a) {
				var u = e.nodes[a];
				u.x = o + n * t;
				u.y = s + i * r;
				n += 1;
				if (n === e.cols) {
					i += 1;
					n = 0
				}
			}
			return e.nodes
		},
		onSync: function(e, t) {
			var r = t.graphics;
			var n = t.graph;
			var i = e.length;
			var o = new Uint32Array(i);
			var s = new Array(i);
			for (var a = 0; a < e.length; ++a) {
				var u = e[a];
				o[a] = u.id;
				s[a] = {
					x: u.x,
					y: u.y
				}
			}
			r.setAttributes(new n.NodeList(o), s)
		}
	};
	g.extend(function(e) {
		e.layouts.grid = function(t) {
			if (t === void 0) t = {};
			return e.modules.layouts.start("grid", t)
		};
		e.modules.layouts.register("grid", Cg)
	});
	var Tg = {
		configure: function(e, t) {
			var r = t.graph;
			var n = t.graphics;
			var i = t.data;
			if (e.centralNode === undefined) {
				throw new Error('concentric layout: missing parameter "centralNode"')
			} else if (!(e.centralNode instanceof r.Node)) {
				e.centralNode = r.getNode(e.centralNode)
			}
			if (!e.nodes) {
				e.nodes = r.getNodes()
			} else if (!(e.nodes instanceof r.NodeList)) {
				e.nodes = r.getNodes(e.nodes)
			}
			var o = r._getIndex(true, e.centralNode);
			var s = e.centralNode.getPosition();
			var a = s.x,
				u = s.y;
			var l, d = null,
				f, h;
			var c = r.nodeIndexList(e.nodes);
			var p = [];
			var g = c.length;
			var v = r.getNodeAttributesArrays(["radius"], {
				ids: c,
				destArrays: [new Array(g)]
			});
			var y = v[0];
			var _ = n.getAttribute(e.nodes, "layoutable");
			for (f = 0; f < g; f++) {
				h = c[f];
				if (h === o || _[f]) {
					p.push(h)
				}
			}
			if (p.indexOf(o) === -1) {
				p.push(o)
			}
			g = p.length;
			var m = {},
				x = new Array(g);
			for (f = 0; f < g; f++) {
				m[p[f]] = x[f] = f
			}
			var b = new Array(g);
			for (f = 0; f < g; f++) {
				var A = r._getAdjacentElements(true, [p[f]]);
				for (var w = 0, E = A.length; w < E; w++) {
					A[w] = m[A[w]]
				}
				b[f] = A
			}
			if (e.sortBy) {
				if (e.sortBy === "random") {
					d = "random"
				} else if (e.sortBy === "radius") {
					d = y.slice()
				} else {
					d = i.getProperty(true, l, e.sortBy)
				}
			}
			return {
				sourceNodeIndex: p.indexOf(o),
				centerX: e.centerX === "number" ? e.centerX : a,
				centerY: e.centerY === "number" ? e.centerY : u,
				list: p,
				indexes: x,
				size: g,
				totalSize: g,
				attributes: {
					adjacentNodes: b,
					size: y
				},
				sortAttr: d,
				clockWise: e.clockWise === undefined ? true : e.clockWise,
				circleHopRatio: e.circleHopRatio || 5,
				allowOverlap: !! e.allowOverlap
			}
		},
		context: function() {
			return {
				dijkstra: function(e, t, r, n, i) {
					var o = Math.pow(2, 31) - 1,
						s = new Int32Array(n),
						a = new Int32Array(n),
						u = new Int8Array(n),
						l, d, f;
					for (f = 0; f < n + 1; ++f) {
						s[f] = o;
						a[f] = -1
					}
					for (f = 0; f < n; ++f) {
						l = t[f];
						if (l !== undefined) {
							s[l] = o;
							a[l] = -1
						}
					}
					s[i] = 0;
					while (true) {
						var h = o,
							c = -1;
						for (f = 0; f < r; ++f) {
							l = t[f];
							d = s[l];
							if (!u[l] && d < h) {
								h = d;
								c = l;
								u[l] = true
							}
						}
						if (c === -1) {
							break
						}
						var p = e[c],
							g = p.length,
							v = h + 1;
						for (f = 0; f < g; ++f) {
							l = p[f];
							d = s[l];
							if (v < d) {
								s[l] = v;
								a[l] = c
							}
						}
					}
					return s
				},
				determinePropertyType: function(e, t, r) {
					for (var n = 0; n < r; ++n) {
						if (typeof e[t[n]] !== "number") {
							return "string"
						}
					}
					return "number"
				}
			}
		},
		update: function(e, t) {
			var r = e.attributes.adjacentNodes,
				n = e.attributes.size,
				i = e.indexes,
				o = e.size,
				s = e.sourceNodeIndex,
				a = e.centerX,
				u = e.centerY,
				l = e.sortAttr,
				d = new Array(e.totalSize),
				f = new Array(e.totalSize);
			var h = t.dijkstra(r, i, e.size, e.totalSize, s),
				c = 0,
				p = {},
				g;
			for (g = 0; g < o; ++g) {
				var v = n[i[g]];
				if (v > c) {
					c = v
				}
			}
			var y = c * e.circleHopRatio,
				_ = 0,
				m = 0,
				x = Math.PI / 9;
			for (g = 0; g < o; ++g) {
				var b = i[g],
					distance = h[b],
					A = p[distance];
				if (!A) {
					A = [];
					p[distance] = A
				}
				A.push(b)
			}
			var w = null,
				E = true;
			if (l === "random") {
				w = function() {
					return Math.random() - .5
				}
			} else if (l) {
				var I = t.determinePropertyType(l, i, v);
				w = I === "number" ?
				function(e, t) {
					return l[e] - l[t]
				} : function(e, t) {
					return l[e] < l[t] ? -1 : 1
				}
			} else {
				E = false
			}
			var S = Object.keys(p).sort(function(e, t) {
				return parseInt(e) - parseInt(t)
			});
			for (g = 0; g < S.length; ++g) {
				var C = p[S[g]],
					T = C.length,
					L = m,
					N = Math.PI * 2 / T;
				if (g !== 0 && !e.allowOverlap) {
					var z = Math.PI * 2 * _,
						M = 0,
						k = 0;
					for (R = 0; R < T; ++R) {
						M += n[C[R]]
					}
					k = M * 2 * Math.SQRT2;
					if (k > z) {
						_ += k / (2 * Math.PI) - _
					}
				}
				if (E) {
					C.sort(w);
					if (!e.clockWise) {
						C.reverse()
					}
				}
				for (var R = 0; R < T; ++R) {
					b = C[R];
					d[b] = Math.cos(L) * _ + a;
					f[b] = Math.sin(L) * _ + u;
					v = n[b];
					var F = e.allowOverlap ? 1 : v / M * T;
					L += N * F
				}
				_ += y;
				m += x
			}
			return {
				x: d,
				y: f,
				indexes: e.list
			}
		},
		isRunning: function() {
			return false
		},
		onSync: function(e, t) {
			var r = e.indexes;
			var n = e.x;
			var i = e.y;
			var o = t.graphics;
			var s = t.graph;
			o.setAttributes(new s.NodeList(r), r.map(function(e, t) {
				return {
					x: n[t],
					y: i[t]
				}
			}))
		}
	};
	g.extend(function(e) {
		e.layouts.concentric = function(t) {
			if (t === void 0) t = {};
			return e.modules.layouts.start("concentric", t)
		};
		e.modules.layouts.register("concentric", Tg)
	});
	var Lg = {
		defaultDirected: true,
		defaultMultigraph: true,
		defaultCompound: false,
		defaultRankDir: "TB",
		maxNbEdges: 500,
		maxNbNodes: 500
	};
	g.extend(function(e) {
		e.layouts.hierarchical = function(t) {
			if (t === void 0) t = {};
			t.useWebWorker = false;
			return e.modules.layouts.start("hierarchical", t)
		};
		e.modules.layouts.register("hierarchical", Ng)
	});
	var Ng = {
		configure: function(e, t) {
			if (e === void 0) e = {};
			var r = t.graph;
			var n = t.graphics;
			var i = t.data;
			var o = re("dagre", {
				globalVarName: "dagre"
			});
			if (!o || !o.graphlib) {
				throw new Error("to use the dagre plugin, please include lib/dagre.min.js")
			}
			if (!e.nodes) {
				e.nodes = r.getNodes()
			}
			if (e.nodes && e.nodes instanceof r.NodeList) {
				e.nodes = e.nodes.getId()
			}
			var s = Ge(Lg);
			var a = r.getEdges();
			var u = r.getNodes(e.nodes);
			var l = u.size,
				d = a.size,
				f = s.maxNbNodes,
				h = s.maxNbEdges;
			if (f && l > f) {
				throw new Error("Unable to run dagre layout: the graph has " + l + " nodes (maximum allowed: " + f + ")")
			}
			if (h && d > h) {
				throw new Error("Unable to run dagre layout: the graph has " + d + " edges (maximum allowed: " + h + ")")
			}
			e = e || {};
			e.directed = Be(e.directed, s.defaultDirected);
			e.multigraph = Be(e.multigraph, s.defaultMultigraph);
			e.compound = Be(e.compound, s.defaultCompound);
			e.rankdir = Be(e.rankdir, s.defaultRankDir);
			if (["TB", "BT", "LR", "RL"].indexOf(e.rankdir) === -1) {
				throw new Error('defaultRankDir should be one of the "TB", "BT", "LR", "RL"')
			}
			var c = u.getId();
			var p = n.getAttribute(u, "layoutable").reduce(function(e, value, t) {
				e[c[t]] = value;
				return e
			}, {});
			return {
				nodes: c,
				edges: a.map(function(e) {
					return {
						id: e.getId(),
						source: e.getSource().getId(),
						target: e.getTarget().getId()
					}
				}),
				options: e,
				layoutable: p
			}
		},
		context: function() {},
		update: function(e, t) {
			var r = e.nodes;
			var n = e.edges;
			var i = e.options;
			var o = e.layoutable;
			var s = re("dagre", {
				globalVarName: "dagre"
			});
			var a = new s.graphlib.Graph({
				directed: i.directed,
				multigraph: i.multigraph,
				compound: i.compound
			});
			a.setGraph(i);
			r.forEach(function(e) {
				if (o[e]) {
					a.setNode(e, {})
				}
			});
			n.forEach(function(e) {
				var t = e.source;
				var r = e.target;
				var n = e.id;
				if (a.node(t) && a.node(r)) {
					a.setEdge(t, r, {
						id: n
					})
				}
			});
			s.layout(a);
			var u = a.nodes();
			return {
				ids: u,
				positions: u.map(function(e) {
					return a.node(e)
				})
			}
		},
		isRunning: function() {
			return false
		},
		onSync: function(e, t) {
			var r = e.ids;
			var n = e.positions;
			var i = t.graphics;
			var o = t.graph;
			i.setAttributes(o.getNodes(r), n)
		}
	};

	function zg(e, t, r, n, i) {
		return {
			x: e + i * (r - e),
			y: t + i * (n - t)
		}
	}
	function Mg(e, t, r) {
		var n = Infinity;
		var i, o;
		for (var s = 1, a = t.length; s < a; s += 2) {
			var u = t[s - 1],
				l = t[s % a];
			var d = (u[0] + l[0]) / 2,
				f = (u[1] + l[1]) / 2;
			var h = e[0] - d,
				c = e[1] - f;
			var p = h * h + c * c;
			if (p < n) {
				n = p;
				i = u;
				o = l
			}
		}
		return kg(i[0], i[1], o[0], o[1], r)
	}
	function kg(e, t, r, n, i) {
		var o = (e + r) / 2,
			s = (t + n) / 2;
		var a = e - r,
			u = t - n;
		var l = -u,
			d = a;
		var f = Math.sqrt(l * l + d * d);
		l /= f;
		d /= f;
		return [o - i * l, s - i * d]
	}
	function Rg(e, t) {
		var r = t[0];
		var n = t[1];
		var i = t[2];
		var o = Math.abs;
		for (var s = 0, a = e.length; s < a; s++) {
			var u = e[s];
			var l = u[0];
			var d = u[1];
			var f = o(l - r),
				h = o(d - n);
			if (f + h <= i) {
				return true
			}
			if (f > i || h > i) {
				continue
			}
			if (f * f + h * h <= i * i) {
				return true
			}
		}
		return false
	}
	function Fg(e, t, r) {
		var n = Tr(r.cx, r.cy, e, t, r.minX, r.minY, r.maxX, r.maxY);
		var i = +Infinity,
			o, s;
		for (var a = 0, u = n.length; a < u; a++) {
			var l = n[a];
			o = distance(e, t, l.x, l.y);
			if (o < i) {
				i = o;
				s = l
			}
		}
		return s
	}
	function Pg(e, t, r) {
		var n = t.nodes;
		var i = t.margin;
		if (i === void 0) i = 5;
		var o = t.duration;
		if (o === void 0) o = 0;
		var s = e.modules;
		var a = s.graph;
		var u = e.getNodes();
		var l = n._indexes.reduce(function(e, t) {
			e[t] = true;
			return e
		}, {});
		var d = new a.NodeList(u._indexes.slice().filter(function(e) {
			return !l[e]
		}));
		var f = d.getPosition().map(function(e) {
			return [e.x, e.y]
		});
		var h = n.getPosition();
		var c = n.getBoundingBox();
		var p = d.getBoundingBox();
		var g = minDisk(h.map(function(e) {
			return e.x
		}), h.map(function(e) {
			return e.y
		}), n.getAttribute("radius"));
		var v = g[0];
		var y = g[1];
		var _ = g[2] + (c.maxSize + p.maxSize) + i;
		var m = 0,
			x = 0,
			b;
		if (Rg(f, [g[0], g[1], _])) {
			if (d.size <= 3) {
				if (Nn([v, y, g[2]], p)) {
					var A = Fg(v, y, p);
					b = distance(p.cx, p.cy, A.x, A.y);
					var w = zg(p.cx, p.cy, A.x, A.y, (b + _) / b);
					m = w.x - v;
					x = w.y - y
				}
			} else {
				var E = new ri(f.slice()).triangulate();
				var convexhull = oi(f);
				var I = si(d, 20, _, E, convexhull);
				if (I.length > 0) {
					var S = Infinity;
					for (var C = 0, T = I.length; C < T; C++) {
						var L = I[C];
						m = v - L[0];
						x = y - L[1];
						b = Math.sqrt(m * m + x * x);
						if (b < S) {
							S = b;
							A = L
						}
					}
					m = A[0] - v;
					x = A[1] - y
				} else {
					A = Mg([v, y], convexhull, _);
					m = A[0] - c.cx;
					x = A[1] - c.cy
				}
			}
		}
		if (m || x) {
			n.setAttributes(h.map(function(e) {
				e.x += m;
				e.y += x;
				return e
			}), o).then(r)
		} else {
			setTimeout(r, 0)
		}
	}
	function Dg(e, t, r) {
		var n = Ge(t);
		n.duration = 0;
		e.layouts.forceLink(n).then(function() {
			Pg(e, t, r)
		})
	}
	function Og(e, t, r) {
		var n = t.nodes;
		var i = t.duration;
		var o = t.centralNode;
		var s = n;
		var a = s.reduce(function(e, t) {
			e[t._index] = true;
			return e
		}, {});
		var u = e.getNodes();
		if (t.focusOnGroupShape) {
			e.layouts.forceLink({
				nodes: s,
				duration: 0
			}).then(function() {
				var t = s.concat(o);
				var n = t.getAttribute("layoutable");
				t.setAttributes({
					layoutable: false
				});
				e.layouts.forceLink({
					nodes: e.getNodes(),
					duration: i
				}).then(function() {
					t.setAttributes(n);
					r()
				})
			})
		} else {
			var l = Ge(t);
			delete l.centralNode;
			l.nodes = u;
			l.nodeMass = function(e, t) {
				var r = a[e._index] ? 1 : 2;
				return (t + 1) * r
			};
			e.layouts.forceLink(l).then(r)
		}
	}
	g.extend(function(e) {
		e.layouts.incremental = function(t) {
			if (t === void 0) t = {};
			return new Promise(function(r) {
				var n = t.nodes;
				var i = t.centralNode;
				if (!n) {
					throw new Error("Incremental ForceLink layout: no nodes are selected")
				}
				if ("margin" in t && !isFinite(t.margin)) {
					throw new Error("Incremental ForceLink layout: margin has to be a positive number")
				}
				if (i && !i.getAttribute("layoutable")) {
					Og(e, t, r)
				} else {
					Dg(e, t, r)
				}
			})
		}
	});
	var Bg = function(e, t) {
			return e - t
		};
	var Ug = {
		imports: {
			minHeap: minHeap,
			bellmanFord: bellmanFord,
			dijkstra: dijkstra,
			johnson: johnson,
			distance: distance,
			circleCircleIntersection: circleCircleIntersection,
			circleSortCompare: circleSortCompare,
			weightedStress: weightedStress,
			distanceStress: distanceStress,
			constrainedStress: constrainedStress,
			stressMinimizationStep: stressMinimizationStep,
			removeRadialOverlap: removeRadialOverlap
		},
		configure: function(e, t) {
			if (e === void 0) e = {};
			var r = t.graph;
			var n = t.graphics;
			var i = null,
				o, s, a, u = -1;
			var l = null;
			if (e.centralNode !== undefined && e.centralNode !== null) {
				i = r.getNode(e.centralNode, true);
				a = i.getPosition();
				o = isFinite(e.centerX) ? parseFloat(e.centerX) : a.x;
				s = isFinite(e.centerY) ? parseFloat(e.centerY) : a.y;
				u = i._index
			} else {
				throw new Error('concentric layout: missing parameter "centralNode"')
			}
			if (!e.nodes) {
				e.nodes = r.getNodes()
			}
			if (e.nodes && !(e.nodes instanceof r.NodeList)) {
				e.nodes = r.getNodes(e.nodes)
			}
			var d = r._getIndexes(true, e.nodes);
			var f = n.getAttribute(e.nodes, "layoutable");
			d = d.filter(function(e, t) {
				return f[t] || e === u
			});
			if (d.indexOf(u) === -1) {
				d.push(u)
			}
			d.sort(Bg);
			var h = d.length;
			var c = r.getConnectedComponents(true, true);
			var p = Wg(d, c, u);
			c = p;
			var g = r._degrees(d);
			var v = r.getNodeAttributesArrays(["x", "y", "radius"], {
				ids: d,
				destArrays: [new Float32Array(h), new Float32Array(h), new Array(h), new Uint8Array(h)]
			});
			var y = v[0];
			var _ = v[1];
			var m = v[2];
			var x = r.getEdgeAttributesArrays(["source", "target", "width"]);
			var b = x[0];
			var A = x[1];
			var w = r._getAdjacencyTable(true, true, 1, d);
			var E = isFinite(e.radiusRatio) ? parseFloat(e.radiusRatio) : Math.SQRT2;
			var I = isFinite(e.radiusDelta) ? parseFloat(e.radiusDelta) : 0;
			var S = isFinite(e.nodeGap) ? parseInt(e.nodeGap) : 10;
			var C = h * (isFinite(e.repulsion) ? parseFloat(e.repulsion) : 1);
			var T = isFinite(e.maxIterations) ? parseInt(e.maxIterations) : 100;
			if (T < 1) {
				throw new RangeError("maxIterations must be a positive integer")
			}
			var L = isFinite(e.iterationsPerRender) ? parseInt(e.iterationsPerRender) : 20;
			if (L < 1) {
				throw new RangeError("iterationsPerRender must be a positive integer")
			}
			var N = isFinite(e.epsilon) ? parseFloat(e.epsilon) : .001;
			if (N <= 0) {
				throw new RangeError("epsilon has to be a positive number")
			}
			return {
				centerIndex: u,
				centerX: o,
				centerY: s,
				list: d,
				components: p,
				X: y,
				Y: _,
				degree: g,
				size: h,
				currStress: Number.POSITIVE_INFINITY,
				epsilon: N,
				maxSteps: T,
				iterationsPerRender: L,
				attributes: {
					size: m,
					adjacency: w,
					weights: A.map(function(e) {
						return 1
					}),
					sources: b,
					targets: A
				},
				sortAttr: l,
				allowOverlap: !! e.allowOverlap,
				nodeGap: S,
				radiusRatio: E,
				radiusDelta: I,
				repulsion: C,
				randomize: "randomize" in e ? !! e.randomize : true,
				renderSteps: !! e.renderSteps
			}
		},
		context: function() {
			return {
				getHighestNodeSize: function e(t, r) {
					var n = 0;
					for (var i = 0, o = r.length; i < o; i++) {
						var s = t[r[i]];
						if (s > n) {
							n = s
						}
					}
					return n
				},
				grid: function e(t, r) {
					if (r === void 0) r = 8;
					var n = t.size;
					var i = new Float32Array(n);
					var o = new Float32Array(n);
					var s, a, u = this.getHighestNodeSize(t.attributes.size, t.list, n);
					var l = u * r;
					var d = Math.ceil(Math.sqrt(n));
					var f = Math.ceil(n / d);
					var h = -Math.floor((f - 1) * l / 2);
					var c = -Math.floor((d - 1) * l / 2);
					for (s = 0; s < d; s++) {
						for (a = 0; a < f; a++) {
							i[s * f + a] = h + a * l;
							o[s * f + a] = c + s * l
						}
					}
					return {
						x: i,
						y: o
					}
				},
				connectSubgraphs: function e(t, r, n, i, o, s) {
					var a, u;

					function l(e, value) {
						var t = new Uint32Array(e.length + 1);
						t.set(e);
						t[e.length] = value;
						return t
					}
					var d = function(e) {
							a = t[e];
							var d = 0,
								f = 0;
							a.forEach(function(e, t) {
								if (o[e] > d) {
									f = t;
									d = o[e]
								}
							});
							u = a[f];
							var h = r[s[u]];
							h.nodes = l(h.nodes, n);
							h.weights.push(i);
							h = r[n];
							h.nodes = l(h.nodes, u);
							h.weights.push(i)
						};
					for (var f = 1; f < t.length; f++) d(f)
				},
				correctSubgraphsDistances: function e(t, r, n, i, o) {
					var s = Array.prototype.reduce.call(t[n], function(e, t, r) {
						if (r !== n && t < i && t > e) {
							e = t
						}
						return e
					}, 0);
					var a = i - s - 1;
					for (var u = 1; u < r.length; u++) {
						var l = r[u];
						for (var d = 0, f = l.length; d < f; d++) {
							var h = o[l[d]];
							t[n][h] -= a;
							t[h][n] -= a
						}
					}
				},
				establishRadii: function e(t, r, n, i, o, s, a, u) {
					var l = Object.create(null);
					var d = o[r];
					var f = d,
						h = 0;
					var c = d;
					for (var p in i) {
						var g = i[p];
						var v = 0;
						var y = 0,
							_ = void 0;
						for (var m = 0, x = g.length; m < x; m++) {
							_ = o[g[m]];
							y = Math.max(y, _);
							v += _ * 2 + s
						}
						var b = v / (2 * Math.PI) + y;
						var A = y + f;
						var w = u ? h + Math.max(u, A) : h * a;
						h = Math.max(h, b, c, w);
						l[p] = h;
						f = y
					}
					l[0] = 0;
					l[Number.POSITIVE_INFINITY] = h;
					return l
				},
				initData: function e(t, r) {
					t.step = 0;
					t.data = r;
					t.totalSteps = r.totalSteps;
					t.currStress = Number.POSITIVE_INFINITY;
					t.prevStress = 0;
					t.epsilon = t.data.epsilon;
					var n = {},
						i = {};
					t.normIndexes = r.list.reduce(function(e, o, s) {
						e[s] = n[o] = s;
						i[o] = r.degree[s];
						if (o === r.centerIndex) {
							t.centerIndexPos = s
						}
						return e
					}, new Uint32Array(r.list.length));
					var o = t.centerIndexPos;
					var s = r.components[0].length;
					this.connectSubgraphs(r.components, r.attributes.adjacency, r.centerIndex, s, i, n);
					var a = johnson({
						sources: r.attributes.sources,
						targets: r.attributes.targets,
						weights: r.attributes.weights,
						indexes: r.list,
						adjacency: r.attributes.adjacency,
						undirected: true
					});
					this.correctSubgraphsDistances(a, r.components, o, s, n);
					t.D = a;
					t.rings = this.groupRings(a, o, t.normIndexes);
					t.radii = this.establishRadii(a, o, t.normIndexes, t.rings, r.attributes.size, r.nodeGap, r.radiusRatio, r.radiusDelta)
				},
				groupRings: function e(t, r, n) {
					var i = t[r];
					var o = Object.create(null);
					for (var s = 0, a = n.length; s < a; s++) {
						if (s !== r) {
							var u = i[s];
							o[u] = o[u] || [];
							o[u].push(n[s])
						}
					}
					return o
				},
				removeOverlaps: function e(t, r) {
					var n = t.centerIndexPos;
					var i = r.attributes.size;
					var o = t.rings;
					var s = r.X[n];
					var a = r.Y[n];
					for (var u in o) {
						var l = o[u];
						var d = distance(s, a, r.X[l[0]], r.Y[l[0]]);
						removeRadialOverlap({
							X: r.X,
							Y: r.Y,
							sizes: i,
							indexes: l,
							center: [s, a],
							R: d,
							gap: r.nodeGap,
							inPlace: true
						})
					}
				},
				easingQuadraticInOut: function(e) {
					if ((e *= 2) < 1) {
						return .5 * e * e
					}
					return -.5 * (--e * (e - 2) - 1)
				}
			}
		},
		update: function(e, t) {
			e = e || t.data;
			var r = e.list;
			var n = e.centerIndex;
			var i = e.X || new Float32Array(e.size);
			var o = e.Y || new Float32Array(e.size);
			var s = null;
			var a;
			if (t.step === undefined) {
				t.initData(t, e)
			} else {
				t.step++
			}
			var u = e.repulsion;
			var l = function(e) {
					return t.radii[e] || 1
				};
			if (t.step === 0) {
				if (e.randomize) {
					a = t.grid(e);
					e.X = a.x;
					e.Y = a.y
				}
				e.spent = 0
			} else if (!t.converged) {
				var d = e.maxSteps;
				var f = e.iterationsPerRender;
				var h = t.step;
				var c = Math.min(h + f, d + 1);
				while (h <= c || !t.converged) {
					var p = t.easingQuadraticInOut(Math.min(h, d) / d);
					t.step = h++;
					a = stressMinimizationStep(t.D, i, o, e.size, t.centerIndexPos, u, p, t.normIndexes, l);
					e.X = a.X;
					e.Y = a.Y;
					t.prevStress = t.currStress;
					t.currStress = constrainedStress(t.D, e.X, e.Y, e.size, t.centerIndexPos, u, p, t.normIndexes, r, n);
					t.converged = t.converged || Math.abs(t.currStress - t.prevStress) <= t.epsilon
				}
			}
			if (t.converged) {
				if (t.overlapRemoved || t.data.allowOverlap) {
					t.done = true;
					s = Object.keys(t.rings).reduce(function(e, n) {
						e[n] = t.rings[n].map(function(e) {
							return r[e]
						});
						return e
					}, {})
				} else {
					t.removeOverlaps(t, e, n);
					t.overlapRemoved = true
				}
			}
			return {
				x: e.X,
				y: e.Y,
				indexes: e.list,
				components: t.overlapRemoved ? e.components : undefined,
				rings: s,
				centerIndex: t.centerIndexPos,
				cx: e.centerX,
				cy: e.centerY,
				step: t.step,
				renderSteps: e.renderSteps,
				converged: t.converged,
				overlapRemoved: t.overlapRemoved,
				stress: t.currStress,
				done: t.done
			}
		},
		isRunning: function(e) {
			if (!e.converged) {
				return true
			} else {
				return e.data.allowOverlap ? false : !e.done
			}
		},
		onSync: function(e, t, r) {
			if (e.renderSteps || e.done) {
				Xg(e, t)
			}
		},
		onEnd: function(e, t, r) {
			Xg(e, t)
		}
	};

	function Xg(e, t) {
		var r = t.graph;
		var n = t.graphics;
		var i = e.x,
			o = e.y;
		var s = e.indexes.length;
		var a = new Array(s);
		var u = i[e.centerIndex] - e.cx;
		var l = o[e.centerIndex] - e.cy;
		for (var d = 0; d < s; d++) {
			a[d] = {
				x: i[d] - u,
				y: o[d] - l
			}
		}
		n.setAttributes(new r.NodeList(e.indexes), a)
	}
	function jg(e, t) {
		var r = 0,
			n = e.length - 1,
			i;
		var o;
		while (r <= n) {
			i = (r + n) / 2 | 0;
			o = e[i];
			if (o < t) {
				r = i + 1
			} else if (o > t) {
				n = i - 1
			} else {
				return i
			}
		}
		return -1
	}
	function Wg(e, t, r) {
		var n = e.slice().sort(Bg),
			i = [];
		for (var o = 0, s = t.length; o < s; o++) {
			var a = [],
				u = t[o];
			var l = false;
			for (var d = 0, f = u.length; d < f; d++) {
				var h = u[d];
				var c = jg(n, h);
				if (c !== -1) {
					if (h === r) {
						l = true
					}
					a.push(h)
				}
			}
			if (a.length !== 0) {
				i[l ? "unshift" : "push"](a.sort(Bg))
			}
		}
		return i
	}
	g.extend(function(e) {
		e.layouts.radial = function(t) {
			if (t === void 0) t = {};
			return e.modules.layouts.start("radial", t)
		};
		e.modules.layouts.register("radial", Ug)
	});
	g.extend(function(e) {
		var t = new Gg(e);
		e.modules.transform = t;
		e.transformations = {
			remove: function e(r, n) {
				return t.removeRule(r, n)
			},
			getIndex: function e(r) {
				return t.getRuleIndex(r)
			},
			setIndex: function e(r, n, i) {
				return t.setRuleIndex(r, n, i)
			},
			clear: function e(r) {
				return t.clearRules(r)
			}
		}
	});
	var Gg = function e(t) {
			var r = this;
			this._ogma = t;
			this._graph = t.modules.graph;
			this._rules = [];
			this._timeout = null;
			this._idCounter = 1;
			this._updating = false;
			this._updateFromDataChange = true;
			this._onRefresh = [];
			this._refreshSync = function() {
				r._updating = true;
				r._updateFromDataChange = false;
				Yg(r);
				r._updating = false;
				r._timeout = null;
				setTimeout(function() {
					r._updateFromDataChange = true;
					for (var e = 0, t = r._onRefresh.length; e < t; e++) {
						r._onRefresh[e]()
					}
					r._onRefresh.length = 0
				}, 0)
			};
			this._refresh = function(e) {
				if (e) {
					r._onRefresh.push(e)
				}
				if (!r._timeout) {
					r._timeout = setTimeout(r._refreshSync, 0)
				}
			};
			this._nodeVirtualList = this._graph.createAttribute(true, {
				name: "virtual",
				storage: 1
			});
			this._edgeVirtualList = this._graph.createAttribute(false, {
				name: "virtual",
				storage: 1
			});
			t.modules.events.on({
				"addNodes addEdges removeNodes removeEdges": function() {
					if (!r._updating && r._rules.length) {
						r._refresh()
					}
				},
				"updateNodeData updateEdgeData": function() {
					if (r._updateFromDataChange && r._rules.length) {
						r._refresh()
					}
				}
			})
		};
	Gg.prototype.addRule = function e(t, r) {
		if (typeof t !== "function") {
			throw new Error("expected function")
		}
		this._rules.push(new Vg(this._ogma, t, this._idCounter));
		this._idCounter += 1;
		this._refresh(r);
		return this._idCounter - 1
	};
	Gg.prototype.nextId = function e() {
		return this._idCounter
	};
	Gg.prototype.removeRule = function e(t, r) {
		var n = Hg(this, t);
		var i = n.rule;
		var o = n.index;
		i.kill();
		this._rules.splice(o, 1);
		this._refresh(r)
	};
	Gg.prototype.getRuleIndex = function e(t) {
		return Hg(this, t).index
	};
	Gg.prototype.getRule = function e(t) {
		return Hg(this, t).rule
	};
	Gg.prototype.setRuleIndex = function e(t, r, n) {
		var i = Hg(this, t);
		var o = i.index;
		var s = i.rule;
		this._rules.splice(o, 1);
		if (r < 0) {
			this._rules.unshift(s)
		} else if (r >= this._rules.length) {
			this._rules.push(s)
		} else {
			this._rules.splice(r, 0, s)
		}
		this._refresh(n)
	};
	Gg.prototype.clearRules = function e(t) {
		var r = this;
		for (var n = this._rules.length - 1; n >= 0; --n) {
			r._rules[n].kill()
		}
		this._rules = [];
		this._refresh(t)
	};

	function Hg(e, t) {
		for (var r = 0; r < e._rules.length; ++r) {
			var n = e._rules[r];
			if (n._id === t) {
				return {
					rule: n,
					index: r
				}
			}
		}
		throw new Error('rule "' + t + '" does not exist')
	}
	function Yg(e) {
		if (e._rules.length) {
			var t = e._graph.getRaw();
			for (var r = 0; r < e._rules.length; ++r) {
				var n = e._rules[r];
				t = n.update(t)
			}
		}
		e._graph._refreshFilters(true);
		e._graph._refreshFilters(false)
	}
	var Vg = function e(t, r, n) {
			this._ogma = t;
			this._id = n;
			this._rule = r;
			this._nodes = new qg(true, t);
			this._edges = new qg(false, t, this._nodes)
		};
	Vg.prototype.update = function e(t) {
		var r = this._rule(t, this._id);
		var n = r.virtualNodes;
		if (n === void 0) n = [];
		var i = r.virtualEdges;
		if (i === void 0) i = [];
		var o = r.hiddenNodes;
		if (o === void 0) o = [];
		var s = r.hiddenEdges;
		if (s === void 0) s = [];
		var a = this._nodes.update(n, o),
			u = this._edges.update(i, s);
		var l = t.nodes;
		var d = t.edges;
		this._ogma.removeEdges(u);
		this._ogma.removeNodes(a);
		var f = this._nodes.getVirtualElements(),
			h = this._edges.getVirtualElements();
		for (var c = 0; c < o.length; ++c) {
			Zg(l, o[c])
		}
		for (var p = 0; p < s.length; ++p) {
			Zg(d, s[p])
		}
		l.push.apply(l, f);
		d.push.apply(d, h);
		return {
			nodes: l,
			edges: d
		}
	};
	Vg.prototype.kill = function e() {
		this._edges.reverse();
		this._nodes.reverse()
	};
	var qg = function e(t, r, n) {
			this._isNode = t;
			this._ogma = r;
			this._filter = r.modules.graph._addFilter(t);
			this._virtualElements = [];
			this._nodes = n
		};
	qg.prototype.update = function e(t, r) {
		var n = this;
		if (!t) {
			t = []
		}
		if (!r) {
			r = []
		}
		var i = this._ogma,
			o = this._isNode,
			s = [],
			a = this._virtualElements.slice(),
			u = new Array(t.length),
			l = new Array(t.length),
			d = new Array(t.length);
		for (var f = 0; f < t.length; ++f) {
			var h = t[f];
			var c = h.id;
			var p = h.attributes;
			var g = h.data;
			if (!Zg(a, c)) {
				var v = {
					id: c
				};
				if (!o) {
					v.source = h.source;
					v.target = h.target
				}
				s.push(v)
			}
			u[f] = c;
			l[f] = p;
			d[f] = g
		}
		this._virtualElements = u;
		this._filter.reset();
		for (var y = 0; y < r.length; ++y) {
			n._filter.set(r[y]._index, 1)
		}
		var _ = i.modules.graph[o ? "addNodes" : "addEdges"](s);
		i.modules.transform[o ? "_nodeVirtualList" : "_edgeVirtualList"].setMultiple(_._indexes, 1);
		var m = i[o ? "getNodes" : "getEdges"](u);
		m.setAttributes(l);
		m.setData(d);
		return a
	};
	qg.prototype.getVirtualElements = function e() {
		return this._ogma[this._isNode ? "getNodes" : "getEdges"](this._virtualElements).toArray()
	};
	qg.prototype.reverse = function e() {
		this._ogma.modules.graph._removeFilter(this._isNode, this._filter);
		this._ogma[this._isNode ? "removeNodes" : "removeEdges"](this._virtualElements)
	};

	function Zg(e, t) {
		var r = e.indexOf(t);
		if (r === -1) {
			return false
		} else {
			e[r] = e[e.length - 1];
			e.length -= 1;
			return true
		}
	}
	g.extend(function(e) {
		var t = new Qg(e);
		e.modules.pathfinding = t;
		e.pathfinding = {
			astar: function e(r, n, i) {
				if (i === void 0) i = {};
				return t.astar(r, n, i)
			},
			dijkstra: function dijkstra(e, r, n) {
				if (n === void 0) n = {};
				return t.dijkstra(e, r, n)
			},
			dijkstraBig: function e(r, n, i) {
				if (i === void 0) i = {};
				return t.dijkstraBig(r, n, i)
			}
		}
	});
	var Qg = function e(t) {
			this._graph = t.modules.graph;
			this._objectList = this._graph.getAttribute(true, "object")
		};
	Qg.prototype.astar = function e(t, r, n) {
		return rv(this, t, r, Ye(n, Jg))
	};
	Qg.prototype.dijkstra = function dijkstra(e, t, r) {
		return rv(this, e, t, Ye(r, Kg))
	};
	Qg.prototype.dijkstraBig = function e(t, r, n) {
		var i = n.directed !== undefined ? !! n.directed : false;
		var o = this._graph.getAdjacencyTable(!i, true, 1, this._graph.getNodes());
		var s = dijkstra(o, t._index, r._index, this._graph.getNodes()._indexes, undefined, false);
		return s.path ? new this._graph.NodeList(s.path) : null
	};
	var Jg = {
		pathLengthFunction: $g,
		heuristicLengthFunction: $g
	};
	var Kg = {
		pathLengthFunction: ev,
		heuristicLengthFunction: tv
	};

	function $g(e, t) {
		var r = e.getPosition(),
			n = t.getPosition();
		return distance(r.x, r.y, n.x, n.y)
	}
	function ev() {
		return 1
	}
	function tv() {
		return 0
	}
	function rv(e, t, r, n) {
		if (n === void 0) n = {};
		var i = e._graph._getIndex(true, t),
			o = e._graph._getIndex(true, r),
			s = n.pathLengthFunction,
			a = n.heuristicLengthFunction,
			u = n.filter,
			l = n.directed ? "out" : "both",
			d = e._objectList,
			f = d.get(i),
			h = d.get(o),
			c = null;
		if (i === o) {
			c = [i]
		} else {
			var p = e._graph._elts.nodes._nextIndex,
				g = new gr(Uint32Array),
				v = new gr(Uint32Array),
				y = new Int32Array(p),
				_ = new Float32Array(p),
				m = new Float32Array(p);
			for (var x = 0; x < p; ++x) {
				y[x] = -1;
				_[x] = Infinity;
				m[x] = Infinity
			}
			v.add(i);
			_[i] = 0;
			m[i] = a(f, h);
			while (v.length !== 0) {
				var b = v.length,
					A = v.get(0),
					w = 0,
					E = m[A];
				for (var I = 1; I < b; ++I) {
					var S = v.get(I),
						C = m[S];
					if (C < E) {
						E = C;
						A = S;
						w = I
					}
				}
				if (A === o) {
					c = nv(y, i, o);
					break
				}
				var T = d.get(A);
				v.removeByPosition(w);
				g.add(A);
				var L = e._graph._getElement(true, A).getAdjacentNodes({
					direction: l,
					filter: u
				})._indexes;
				for (var N = 0; N < L.length; ++N) {
					var z = L[N],
						M = d.get(z);
					if (g.has(z)) {
						continue
					}
					var k = _[A] + s(T, M);
					if (!v.add(z) && k >= _[z]) {
						continue
					}
					y[z] = A;
					_[z] = k;
					m[z] = k + a(M, h)
				}
			}
		}
		return c ? e._graph._getElements(true, c) : null
	}
	function nv(e, t, r) {
		var n = [r],
			i = r;
		while (i !== t) {
			i = e[i];
			n.push(i)
		}
		n.reverse();
		return n
	}
	g.extend(function(e) {
		e.modules.cameraInteractions = new iv(e)
	});
	var iv = function e(t) {
			var r = this;
			this._ogma = t;
			this._locate = t.modules.locate;
			this._camera = t.modules.camera;
			this._settings = t.modules.settings;
			this._interactions = t.modules.interactions;
			this._graphics = t.modules.graphics;
			this._adjusting = false;
			this._config = {};
			this._settings.register("interactions.zoom.enabled", true);
			this._settings.register("interactions.zoom.onDoubleClick", false);
			this._settings.register("interactions.zoom.duration", 150);
			this._settings.register("interactions.zoom.modifier", 1.8);
			this._settings.register("interactions.zoom.hideNodes", false);
			this._settings.register("interactions.zoom.hideEdges", false);
			this._settings.register("interactions.zoom.hideNodeTexts", false);
			this._settings.register("interactions.zoom.hideEdgeTexts", false);
			this._settings.register("interactions.pan.enabled", true);
			this._settings.register("interactions.pan.hideNodes", false);
			this._settings.register("interactions.pan.hideEdges", false);
			this._settings.register("interactions.pan.hideNodeTexts", false);
			this._settings.register("interactions.pan.hideEdgeTexts", false);
			this._settings.register("interactions.pan.viewFixDuration", 500);
			this._settings.register("interactions.rotation.enabled", true);
			this._settings.register("interactions.rotation.hideNodes", false);
			this._settings.register("interactions.rotation.hideEdges", false);
			this._settings.register("interactions.rotation.hideNodeTexts", false);
			this._settings.register("interactions.rotation.hideEdgeTexts", false);
			this._settings.register("interactions.gesture.enabled", true);
			this._settings.register("interactions.gesture.hideNodes", false);
			this._settings.register("interactions.gesture.hideEdges", false);
			this._settings.register("interactions.gesture.hideNodeTexts", false);
			this._settings.register("interactions.gesture.hideEdgeTexts", false);
			var n = 0,
				i = 0;
			var o = function(e) {
					var t = e.x;
					var o = e.y;
					var s = r._camera.width / 2,
						a = r._camera.height / 2,
						u = t - s,
						l = o - a,
						d = Math.sqrt(u * u + l * l),
						f = 0;
					u /= d;
					l /= d;
					if (u !== 0 || l !== 0) {
						var h = Math.abs(n * u + i * l) / (Math.sqrt(n * n + i * i) * Math.sqrt(u * u + l * l));
						f = Math.acos(h);
						if (!isNaN(f)) {
							if (u < 0 && n > 0 || u > 0 && i < 0) {
								if (l > 0 && n > u || l < 0 && n < u) {
									f *= -1
								}
							} else if (u > 0 && l > i || u < 0 && l < i) {
								f *= -1
							}
						} else {
							f = 0
						}
					}
					n = u;
					i = l;
					return f
				};
			this._interactions.onMouseWheel({
				priority: "zoom",
				disableDetection: true,
				check: function() {
					return r._settings.get("interactions.zoom.enabled") && !r._adjusting
				},
				handler: function(e) {
					var t = e.x;
					var n = e.y;
					var i = e.delta;
					return uv(r, i, t, n)
				}
			});
			this._interactions.onDoubleClick({
				priority: "zoom",
				disableDetection: true,
				check: function() {
					return r._settings.get("interactions.zoom.enabled") && r._settings.get("interactions.zoom.onDoubleClick") && !r._adjusting
				},
				handler: function(e) {
					var t = e.x;
					var n = e.y;
					return uv(r, 1, t, n)
				}
			});
			this._interactions.onDrag({
				priority: "panning",
				disableDetection: true,
				check: function(e) {
					var t = e.button;
					return t === "left" && r._settings.get("interactions.pan.enabled") && !r._adjusting
				},
				onStart: function(e) {
					var t = e.x;
					var n = e.y;
					ov(r, "pan")
				},
				onProgress: function(e) {
					var t = e.x;
					var n = e.y;
					var i = e.dx;
					var o = e.dy;
					r._camera.move({
						x: -i,
						y: -o
					})
				},
				onStop: function() {
					sv(r, "pan");
					av(r)
				}
			});
			this._interactions.onDrag({
				priority: "rotation",
				disableDetection: true,
				check: function(e) {
					var t = e.button;
					return t === "right" && r._settings.get("interactions.rotation.enabled") && !r._adjusting
				},
				onStart: function() {
					n = 0;
					i = 0;
					ov(r, "rotation")
				},
				onProgress: function(e) {
					var t = e.x;
					var n = e.y;
					r._camera.rotate(o({
						x: t,
						y: n
					}))
				},
				onStop: function() {
					sv(r, "rotation")
				}
			});
			this._interactions.onGesture({
				priority: "gesture",
				disableDetection: true,
				check: function() {
					return r._settings.get("interactions.gesture.enabled") && !r._adjusting
				},
				onStart: function() {
					ov(r, "gesture")
				},
				onProgress: function(e) {
					var t = e.dx;
					var n = e.dy;
					var i = e.rotation;
					var o = e.scale;
					var s = e.x;
					var a = e.y;
					r._camera.rotate(-i);
					r._camera.zoomIn(o, undefined, {
						x: s,
						y: a
					});
					r._camera.move({
						x: -t,
						y: -n
					})
				},
				onStop: function() {
					sv(r, "gesture")
				}
			})
		};

	function ov(e, t) {
		var r = e._settings.get("interactions." + t + ".hideNodes"),
			n = e._settings.get("interactions." + t + ".hideEdges"),
			i = e._settings.get("interactions." + t + ".hideNodeTexts"),
			o = e._settings.get("interactions." + t + ".hideEdgeTexts"),
			s = {};
		if (r) {
			s.nodesVisible = e._ogma.setNodesVisibility(false)
		}
		if (i) {
			s.nodeTextsVisible = e._ogma.setNodeTextsVisibility(false)
		}
		if (n) {
			s.edgesVisible = e._ogma.setEdgesVisibility(false)
		}
		if (o) {
			s.edgeTextsVisible = e._ogma.setEdgeTextsVisibility(false)
		}
		e._config[t] = s
	}
	function sv(e, t) {
		var r = e._config[t];
		if ("nodesVisible" in r) {
			e._ogma.setNodesVisibility(r.nodesVisible)
		}
		if ("nodeTextsVisible" in r) {
			e._ogma.setNodeTextsVisibility(r.nodeTextsVisible)
		}
		if ("edgesVisible" in r) {
			e._ogma.setEdgesVisibility(r.edgesVisible)
		}
		if ("edgeTextsVisible" in r) {
			e._ogma.setEdgeTextsVisibility(r.edgeTextsVisible)
		}
	}
	function av(e) {
		return
	}
	function uv(e, t, r, n) {
		var i = e._settings.get("interactions.zoom.modifier"),
			o = e._settings.get("interactions.zoom.duration");
		if (t < 0) {
			i = 1 / i
		}
		var s = {
			duration: o,
			callback: function(t) {
				sv(e, "zoom");
				if (!t) {
					av(e)
				}
			},
			easing: "quadraticOut"
		};
		e._camera.zoomIn(i, s, {
			refX: r,
			refY: n
		});
		ov(e, "zoom")
	}
	var lv = 100;
	var dv = {
		outline: true,
		"outerStroke.color": "red",
		"outerStroke.width": 5,
		"text.backgroundColor": "rgb(220, 220, 220)",
		"text.threshold": 0
	};
	var fv = {
		outline: true,
		"text.backgroundColor": "rgb(220, 220, 220)",
		"text.threshold": 0,
		color: "red",
		strokeWidth: 2
	};
	g.extend(function(e) {
		e.modules.hover = new hv(e);
		e.styles.setHoveredNodeAttributes = function(t) {
			return e.modules.hover.updateNodeAttributes(t)
		};
		e.styles.setHoveredEdgeAttributes = function(t) {
			return e.modules.hover.updateEdgeAttributes(t)
		}
	});
	var hv = function e(t) {
			var r = this;
			this._render = t.modules.render;
			this._graph = t.modules.graph;
			this._graphics = t.modules.graphics;
			this._settings = t.modules.settings;
			this._captor = t.modules.captor;
			this._events = t.modules.events;
			this._classes = t.modules.classes;
			this._settings.register("cursor.node", "pointer", function(value, e) {
				if (r._hovered && r._hovered.isNode) {
					r._render.removeCursorStyle(e);
					r._render.addCursorStyle(value)
				}
			});
			this._settings.register("cursor.edge", "pointer", function(value, e) {
				if (r._hovered && !r._hovered.isNode) {
					r._render.removeCursorStyle(e);
					r._render.addCursorStyle(value)
				}
			});
			this._settings.register("nodeHover", true, function(value) {
				if (!value && r._hovered && r._hovered.isNode) {
					vv(r, r._hovered)
				}
			});
			this._settings.register("edgeHover", true, function(value) {
				if (!value && r._hovered && !r._hovered.isNode) {
					vv(r, r._hovered)
				}
			});
			this._classes.create("hoverExtremityHighlighted", {
				nodeAttributes: dv
			});
			this._classes.create("hovered", {
				nodeAttributes: dv,
				edgeAttributes: fv
			});
			var n = function() {
					r._classes.clearNodes("hoverExtremityHighlighted");
					r._classes.getEdgesByClass("hovered").getExtremities().addClass("hoverExtremityHighlighted")
				};
			this._classes.onEdgesClassAdded("hovered", n);
			this._classes.onEdgesClassRemoved("hovered", n);
			this._timeout = null;
			this._hovered = null;
			this._events.on({
				hover: function(e) {
					var t = e.target;
					return gv(r, t)
				},
				unhover: function(e) {
					var t = e.target;
					return vv(r, t)
				},
				clear: function() {
					r._hovered = null;
					if (r._timeout) {
						clearTimeout(r._timeout)
					}
				}
			})
		};
	hv.prototype.updateNodeAttributes = function e(t) {
		this._classes.setNodeAttribute("hovered", t);
		this._classes.setNodeAttribute("hoverExtremityHighlighted", t)
	};
	hv.prototype.updateEdgeAttributes = function e(t) {
		this._classes.setEdgeAttributes("hovered", t)
	};

	function cv(e) {
		if (e._timeout) {
			clearTimeout(e._timeout);
			e._timeout = null
		}
	}
	function pv(e) {
		return e._graphics.isAnimating()
	}
	function gv(e, t) {
		if (!t.isNode && !e._settings.get("edgeHover") || t.isNode && !e._settings.get("nodeHover") || cv(e) || pv(e)) {
			return
		}
		var r = function() {
				if (pv(e)) {
					e._timeout = setTimeout(r, lv)
				} else {
					yv(e, true, t);
					e._hovered = t;
					e._timeout = null
				}
			};
		e._timeout = setTimeout(r, lv)
	}
	function vv(e, t) {
		cv(e);
		if (e._hovered === t) {
			yv(e, false, t);
			e._hovered = null
		}
	}
	function yv(e, t, r) {
		var n = e._settings.get(r.isNode ? "cursor.node" : "cursor.edge");
		e._render[t ? "addCursorStyle" : "removeCursorStyle"](n);
		r[t ? "addClass" : "removeClass"]("hovered");
		if (!r.isNode) {}
	}
	var _v = {
		number: 1,
		duration: 1e3,
		interval: 800,
		startColor: "rgb(0,0,0,0.6)",
		endColor: "rgb(0,0,0,0.0)",
		width: 50,
		startRatio: 1,
		endRatio: 2
	};
	var mv = {
		number: 1,
		duration: 1e3,
		interval: 800,
		startColor: "rgb(0,0,0,0.6)",
		endColor: "rgb(0,0,0,0.0)",
		width: 10,
		startRatio: 1,
		endRatio: 2
	};
	g.extend(function(e) {
		var t = new xv(e);
		e.modules.pulses = t;
		e.Node.prototype.pulse = function(e) {
			t.highlightNodes(this, e)
		};
		e.NodeList.prototype.pulse = function(e) {
			t.highlightNodes(this, e)
		};
		e.Edge.prototype.pulse = function(e) {
			t.highlightEdges(this, e)
		};
		e.EdgeList.prototype.pulse = function(e) {
			t.highlightEdges(this, e)
		}
	});
	var xv = function e(t) {
			var r = this;
			this._graph = t.modules.graph;
			this._render = t.modules.render;
			this._graphics = t.modules.graphics;
			this._events = t.modules.events;
			this._classes = t.modules.classes;
			this._nodes = [];
			this._edges = [];
			this._NodeList = t.NodeList;
			this._EdgeList = t.EdgeList;
			this._classes.create("pulsing");
			this._render.addSemanticLayer("edgePulses", {
				camera: this._graphics._cameraForRender
			});
			this._render.addSemanticLayer("nodePulses", {
				camera: this._graphics._cameraForRender
			});
			t.modules.events.on({
				"beforeRemoveNodes beforeRemoveEdges": function(e) {
					var t = e.nodes;
					var n = e.edges;
					var i = t || n;
					Cv(r, i.isNode, i._indexes)
				},
				clear: function() {
					r._nodes.forEach(function(e) {
						return e.kill()
					});
					r._edges.forEach(function(e) {
						return e.kill()
					});
					r._nodes = [];
					r._edges = []
				}
			})
		};
	xv.prototype.highlightNodes = function e(t, r) {
		Sv(this, true, this._graph._getIndexes(true, t), Ye(r, _v))
	};
	xv.prototype.highlightEdges = function e(t, r) {
		Sv(this, false, this._graph._getIndexes(false, t), Ye(r, mv))
	};

	function bv(e) {
		e.add()
	}
	function Av(e) {
		e.remove()
	}
	var wv = function e(t, r, n, i, o) {
			var s = this;
			this.index = r;
			this._render = t._render;
			this._params = n;
			this._startColor = i;
			this._endColor = o;
			this._components = [];
			this._timeouts = [];
			this._nextToRemove = 0;
			for (var a = 0; a < n.nbPulses; ++a) {
				s._timeouts.push(setTimeout(bv, a * n.interval, s));
				s._timeouts.push(setTimeout(Av, a * n.interval + n.duration, s))
			}
		};
	wv.prototype.remove = function e() {
		this._components[this._nextToRemove] = this._render.delete(this._components[this._nextToRemove]);
		this._nextToRemove += 1
	};
	wv.prototype.kill = function e() {
		var t = this;
		for (var r = 0; r < this._timeouts.length; ++r) {
			clearTimeout(t._timeouts[r])
		}
		for (var n = 0; n < this._components.length; ++n) {
			t._render.delete(t._components[n])
		}
	};
	var Ev = function(e) {
			function t(t, r, n, i, o, s, a, u) {
				e.call(this, t, r, n, i, o);
				this._x = s;
				this._y = a;
				this._size = u
			}
			if (e) t.__proto__ = e;
			t.prototype = Object.create(e && e.prototype);
			t.prototype.constructor = t;
			t.prototype.add = function e() {
				this._components.push(Lv(this._render, this._x, this._y, this._size * this._params.startRatio, this._size * this._params.endRatio, this._params.strokeWidth, this._startColor, this._endColor, this._params.duration))
			};
			return t
		}(wv);
	var Iv = function(e) {
			function t(t, r, n, i, o, s, a, u, l, d, f, h, c, p) {
				e.call(this, t, r, n, i, o);
				this._DEPTH = Ei;
				this._s = s;
				this._sx = u;
				this._sy = l;
				this._ss = d;
				this._t = a;
				this._tx = f;
				this._ty = h;
				this._ts = c;
				this._curvature = p
			}
			if (e) t.__proto__ = e;
			t.prototype = Object.create(e && e.prototype);
			t.prototype.constructor = t;
			t.prototype.add = function e() {
				this._components.push(Nv(this._render, this._DEPTH, this._s, this._t, this._sx, this._sy, this._ss, this._tx, this._ty, this._ts, this._curvature, this._startColor, this._endColor, this._params.startRatio, this._params.endRatio, this._params.strokeWidth, this._params.duration))
			};
			return t
		}(wv);

	function Sv(e, t, r, n) {
		var i = n.number;
		var o = n.duration;
		var s = n.interval;
		var a = n.startColor;
		var u = n.endColor;
		var l = n.width;
		var d = n.startRatio;
		var f = n.endRatio;
		var h = {
			nbPulses: i,
			duration: o,
			interval: s,
			strokeWidth: l,
			startRatio: d,
			endRatio: f
		};
		var c = a,
			p = u,
			g = e._graphics._getAttributeArray(t, "color");
		var v = e._graph.getAttributes(false, ["source", "target", "curvature"]);
		var y = v[0];
		var _ = v[1];
		var m = v[2];
		var x = e._graph.getAttributes(true, ["x", "y"]);
		var b = x[0];
		var A = x[1];
		var w = e._graphics._getAttributeArray(true, "radius");
		Cv(e, t, r);
		new(t ? e._NodeList : e._EdgeList)(r).addClass("pulsing");
		for (var E = 0, I = r.length; E < I; ++E) {
			var S = r[E],
				C = c === "inherit" ? g.get(S) : c,
				T = p === "inherit" ? g.get(S) : p;
			if (t) {
				e._nodes.push(new Ev(e, S, h, C, T, b.get(S), A.get(S), w.get(S)))
			} else {
				var L = y.get(S),
					N = _.get(S),
					z = b.get(L),
					M = A.get(L),
					k = w.get(L),
					R = b.get(N),
					F = A.get(N),
					P = w.get(N),
					D = m.get(S);
				e._edges.push(new Iv(e, S, h, C, T, L, N, z, M, k, R, F, P, D))
			}
		}
		setTimeout(Cv, (h.nbPulses - 1) * h.interval + h.duration, e, t, r)
	}
	function Cv(e, t, r) {
		var n = e[t ? "_nodes" : "_edges"];
		if (!n.length) {
			return
		}
		for (var i = 0; i < r.length; ++i) {
			Tv(n, r[i])
		}
		new(t ? e._NodeList : e._EdgeList)(r).removeClass("pulsing")
	}
	function Tv(e, t) {
		for (var r = 0, n = e.length; r < n; ++r) {
			var i = e[r];
			if (i.index === t) {
				e.splice(r, 1);
				i.kill();
				break
			}
		}
	}
	function Lv(e, t, r, n, i, o, s, a, u) {
		var l = on(e, -1, t, r, n, o, s, "nodePulses");
		e.animate(u, function() {
			on(e, l, t, r, i, o, a, "nodePulses")
		});
		return l
	}
	function Nv(e, t, r, n, i, o, s, a, u, l, d, f, h, c, p, g, v) {
		var y = Nf,
			_, m, x, b;
		if (r === n) {
			b = Ir(i, o, i + 1, o - 1, 1);
			m = y.drawLoop(e, -1, i + b.x * c, o + b.y * c, 0, g, d, s + c / 2, f, "edgePulses", t);
			x = y.drawLoop(e, -1, i - b.x * c, o - b.y * c, 0, g, d, s - c / 2, f, "edgePulses", t);
			e.animate(v, function() {
				y.drawLoop(e, m, i + b.x * p, o + b.y * p, 0, g, d, s + p / 2, h, "edgePulses", t);
				y.drawLoop(e, x, i - b.x * p, o - b.y * p, 0, g, d, s - p / 2, h, "edgePulses", t)
			})
		} else {
			b = Ir(i, o, a, u, 1);
			var A = b.y,
				w = -b.x;
			m = Ku(e, -1, y, r, n, i + A * c, o + w * c, a + A * c, u + w * c, 0, g, d, s, l, f, "edgePulses", undefined, t);
			x = Ku(e, -1, y, r, n, i - A * c, o - w * c, a - A * c, u - w * c, 0, g, d, s, l, f, "edgePulses", undefined, t);
			e.animate(v, function() {
				Ku(e, m, y, r, n, i + A * p, o + w * p, a + A * p, u + w * p, 0, g, d, s, l, h, "edgePulses", undefined, t);
				Ku(e, x, y, r, n, i - A * p, o - w * p, a - A * p, u - w * p, 0, g, d, s, l, h, "edgePulses", undefined, t)
			})
		}
		_ = e.composite(-1, [m, x]);
		return _
	}
	var zv = {
		outline: true,
		"outerStroke.color": "red",
		"outerStroke.width": 5,
		"text.backgroundColor": "rgb(220, 220, 220)",
		"text.threshold": 0
	};
	var Mv = {
		outline: true,
		"text.backgroundColor": "rgb(220, 220, 220)",
		"text.threshold": 0,
		color: "red",
		strokeWidth: 2
	};
	g.extend(function(e) {
		var t = new kv(e),
			r = e.modules.classes;
		var n = e.Node;
		var i = e.Edge;
		var o = e.NodeList;
		var s = e.EdgeList;
		e.modules.selection = t;
		e.events.onNodesSelected = function(t) {
			r.onNodesClassAdded("selected", t);
			return e.events
		};
		e.events.onNodesUnselected = function(t) {
			r.onNodesClassRemoved("selected", t);
			return e.events
		};
		e.events.onEdgesSelected = function(t) {
			r.onEdgesClassAdded("selected", t);
			return e.events
		};
		e.events.onEdgesUnselected = function(t) {
			r.onEdgesClassRemoved("selected", t);
			return e.events
		};
		e.styles.setSelectedNodeAttributes = function(e) {
			return t.setNodeAttribute(e)
		};
		e.styles.setSelectedEdgeAttributes = function(e) {
			return t.setEdgeAttributes(e)
		};
		e.clearSelection = function() {
			return t.clear()
		};
		e.getSelectedNodes = function() {
			return t.getSelectedNodes()
		};
		e.getNonSelectedNodes = function() {
			return t.getNonSelectedNodes()
		};
		e.getSelectedEdges = function() {
			return t.getSelectedEdges()
		};
		e.getNonSelectedEdges = function() {
			return t.getNonSelectedEdges()
		};
		n.prototype.setSelected = function(e) {
			t.setActive(this, e)
		};
		n.prototype.isSelected = function() {
			return t.areActive(this)
		};
		o.prototype.setSelected = function(e) {
			t.setActive(this, e)
		};
		o.prototype.isSelected = function() {
			return t.areActive(this)
		};
		i.prototype.setSelected = function(e) {
			t.setActive(this, e)
		};
		i.prototype.isSelected = function() {
			return t.areActive(this)
		};
		s.prototype.setSelected = function(e) {
			t.setActive(this, e)
		};
		s.prototype.isSelected = function() {
			return t.areActive(this)
		}
	});
	var kv = function e(t) {
			var r = this;
			this._events = t.modules.events;
			this._settings = t.modules.settings;
			this._graph = t.modules.graph;
			this._keyboard = t.modules.keyboard;
			this._graphics = t.modules.graphics;
			this._interactions = t.modules.interactions;
			this._classes = t.modules.classes;
			this._classes.create("selectionExtremityHighlighted", {
				nodeAttributes: zv
			});
			this._classes.create("selected", {
				nodeAttributes: zv,
				edgeAttributes: Mv
			});
			var n = function() {
					r._classes.clearNodes("selectionExtremityHighlighted");
					r._classes.getEdgesByClass("selected").getExtremities().addClass("selectionExtremityHighlighted")
				};
			this._classes.onEdgesClassAdded("selected", n);
			this._classes.onEdgesClassRemoved("selected", n);
			this._settings.register("interactions.selection.enabled", true);
			this._settings.register("interactions.selection.multiSelectionKey", "ctrl");
			this._interactions.onClick({
				priority: "selection",
				check: function(e) {
					var t = e.button;
					return t === "left" && r._settings.get("interactions.selection.enabled")
				},
				handler: function(e) {
					var t = e.target;
					if (!t) {
						r._classes.clearEdges("selected");
						r._classes.clearNodes("selected")
					} else {
						var n = r._settings.get("interactions.selection.multiSelectionKey"),
							i = n && r._keyboard.isPressed(n);
						r._classes[t.isNode ? "clearEdges" : "clearNodes"]("selected");
						if (!i) {
							r._classes[t.isNode ? "getNodesByClass" : "getEdgesByClass"]("selected").filter(function(e) {
								return e !== t
							}).removeClass("selected");
							if (!t.hasClass("selected")) {
								t.addClass("selected")
							}
						} else if (t.hasClass("selected")) {
							t.removeClass("selected")
						} else {
							t.addClass("selected")
						}
					}
				}
			})
		};
	kv.prototype.setNodeAttribute = function e(t) {
		this._classes.setNodeAttribute("selected", t);
		this._classes.setNodeAttribute("selectionExtremityHighlighted", t)
	};
	kv.prototype.setEdgeAttributes = function e(t) {
		this._classes.setEdgeAttributes("selected", t)
	};
	kv.prototype.setActive = function e(t, r) {
		if (Ke(r)) {
			var n = function(e, t) {
					return r[t] ? "toSelect" : "toUnselect"
				};
			var i = n.toSelect;
			var o = n.toUnselect;
			if (i) {
				i.addClass("selected")
			}
			if (o) {
				i.removeClass("selected")
			}
		} else {
			t[r ? "addClass" : "removeClass"]("selected")
		}
	};
	kv.prototype.areActive = function e(t) {
		return t.hasClass("selected")
	};
	kv.prototype.getSelectedNodes = function e() {
		return this._classes.getNodesByClass("selected")
	};
	kv.prototype.getSelectedEdges = function e() {
		return this._classes.getEdgesByClass("selected")
	};
	kv.prototype.getNonSelectedNodes = function e() {
		return this._graph.getNodes().filter(function(e) {
			return !e.hasClass("selected")
		})
	};
	kv.prototype.getNonSelectedEdges = function e() {
		return this._graph.getEdges().filter(function(e) {
			return !e.hasClass("selected")
		})
	};
	kv.prototype.clear = function e() {
		this._classes.clearEdges("selected");
		this._classes.clearNodes("selected")
	};
	g.extend(function(e) {
		e.modules.drag = new Fv(e);
		e.events.onNodeDragStart = function(t) {
			e.modules.events.on("startMoveNodesByDragging", t);
			return e.events
		};
		e.events.onNodeDragProgress = function(t) {
			e.modules.events.on("progressMoveNodesByDragging", t);
			return e.events
		};
		e.events.onNodeDragEnd = function(t) {
			e.modules.events.on("endMoveNodesByDragging", t);
			return e.events
		};
		e.modules.graphics._addFeature(true, "draggable", {
			properties: {
				draggable: {
					check: function(e) {
						return typeof e === "boolean"
					},
				default:
					true
				}
			}
		})
	});
	var Rv = "__dragged";
	var Fv = function e(t) {
			var r = this;
			var n = t.modules;
			var i = n.graph;
			var o = n.graphics;
			var s = n.camera;
			var a = n.selection;
			var u = n.events;
			var l = n.classes;
			var d = n.settings;
			var f = n.render;
			this._graph = i;
			this._camera = s;
			this._graphics = o;
			this._selection = a;
			this._events = u;
			this._settings = d;
			this._classes = l;
			this._render = f;
			this._classes.create(Rv, {
				after: "selected"
			});
			this._xList = this._graph.getNodeAttribute("x");
			this._yList = this._graph.getNodeAttribute("y");
			this._events.register(["startMoveNodesByDragging", "progressMoveNodesByDragging", "endMoveNodesByDragging"]);
			this._settings.register("interactions.drag.enabled", true);
			this._settings.register("interactions.drag.cursor", "move");
			this._settings.register("interactions.drag.onBeforeDrag", null);
			this._dragged = null;
			this._start = null;
			this._end = null;
			this._startDrag = null;
			t.modules.interactions.onDrag({
				priority: "drag",
				disableDetection: true,
				check: function(e) {
					var t = e.target;
					return r._settings.get("interactions.drag.enabled") && t && t.isNode && t.getAttribute("draggable")
				},
				onStart: function(e) {
					var t = e.target;
					var n = e.x;
					var i = e.y;
					if (t.isSelected()) {
						r._dragged = r._selection.getSelectedNodes().filter(function(e) {
							return e.getAttribute("draggable")
						})
					} else {
						r._dragged = r._graph._getElements(true, [t._index])
					}
					r._start = r._dragged.getPosition();
					r._end = Ge(r._start);
					r._onBeforeDrag = r._settings.get("interactions.drag.onBeforeDrag");
					r._startDrag = Pv(r, n, i);
					r._dragged.addClass(Rv);
					r._events.fire("startMoveNodesByDragging", {
						nodes: r._dragged
					});
					r._render.addCursorStyle(r._settings.get("interactions.drag.cursor"))
				},
				onProgress: function(e) {
					var t = e.x;
					var n = e.y;
					var i = r._dragged._indexes,
						o = Pv(r, t, n),
						s = o.x - r._startDrag.x,
						a = o.y - r._startDrag.y;
					for (var u = 0; u < i.length; ++u) {
						var l = r._start[u],
							d = r._end[u];
						d.x = l.x + s;
						d.y = l.y + a
					}
					if (r._onBeforeDrag) {
						r._onBeforeDrag(t, n, r._end)
					}
					r._dragged.setAttributes(r._end);
					r._events.fire("progressMoveNodesByDragging", {
						nodes: r._dragged
					})
				},
				onStop: function() {
					r._dragged.removeClass(Rv);
					r._render.removeCursorStyle(r._settings.get("interactions.drag.cursor"));
					r._events.fire("endMoveNodesByDragging", {
						nodes: r._dragged,
						start: r._start,
						end: r._end
					});
					r._dragged = null;
					r._start = null;
					r._end = null
				}
			})
		};

	function Pv(e, t, r) {
		var n = Math.cos(e._camera.angle),
			i = Math.sin(e._camera.angle),
			o = t / e._camera.zoom,
			s = r / e._camera.zoom,
			a = n * o - i * s,
			u = i * o + n * s;
		return {
			x: a,
			y: u
		}
	}
	g.extend(function(e) {
		var t = new Dv(e);
		e.modules.grouping = t;
		e.transformations.addNodeGrouping = function(e) {
			return new Promise(function(r) {
				var n = t.addNodeGrouping(e, function() {
					return r(n)
				})
			})
		};
		e.transformations.addEdgeGrouping = function(e) {
			return new Promise(function(r) {
				var n = t.addEdgeGrouping(e, function() {
					return r(n)
				})
			})
		};
		e.transformations.removeNodeGrouping = function(e, r) {
			if (r === void 0) r = 0;
			return new Promise(function(n) {
				t.removeGrouping(e, r, n)
			})
		}
	});
	var Dv = function e(t) {
			var r = t.modules;
			var n = r.graph;
			var i = r.transform;
			var o = r.graphics;
			this._graph = n;
			this._transform = i;
			this._graphics = o;
			this._nodeToGroup = this._graph.createAttribute(true, {
				storage: "any"
			});
			this._edgeToGroup = this._graph.createAttribute(false, {
				storage: "any"
			})
		};
	Dv.prototype.addNodeGrouping = function e(t, r) {
		var n = this;
		var i = Ov(this, t);
		if (typeof t.duration === "number" && t.duration > 0) {
			this.animateGrouping(i(this._graph.getVisible(), ""), "", t.duration).then(function() {
				return n._transform.addRule(i, r)
			});
			return this._transform.nextId()
		} else {
			return this._transform.addRule(i, r)
		}
	};
	Dv.prototype.animateGrouping = function e(t, r, n) {
		var i = this;
		var o = t.virtualNodes;
		var s = t.hiddenNodes;
		var a = t.groupToNodes;
		return new Promise(function(e) {
			var t = o.reduce(function(e, t) {
				e[t.id] = t;
				return e
			}, {});
			var s = a.keys();
			var u = [],
				l = [];
			for (var d = 0, f = s.length; d < f; d++) {
				var h = s[d];
				if (h !== undefined) {
					var c = t[Xv(r, h)];
					var p = a.get(h);
					for (var g = 0, v = p.length; g < v; g++) {
						l.push(p[g]._index);
						u.push({
							x: c.attributes.x,
							y: c.attributes.y
						})
					}
				}
			}
			var y = new i._graph.NodeList(l);
			var _ = i._graph.getAttributes(true, ["x", "y"]);
			var m = _[0];
			var x = _[1];
			var b = m.getMultiple(l),
				A = x.getMultiple(l);
			xg.call(i, i._graphics);
			y.setAttributes(u, n).then(function() {
				e();
				bg.call(i, i._graphics);
				m.setMultiple(l, b);
				x.setMultiple(l, A)
			})
		})
	};
	Dv.prototype.addEdgeGrouping = function e(t, r) {
		return this._transform.addRule(Bv(this, t), r)
	};
	Dv.prototype.removeGrouping = function e(t, r, n) {
		var i = this;
		if (r === void 0) r = 0;
		if (r > 0) {
			xg.call(this, this._graphics);
			var o = this._transform.getRule(t);
			var s = o._nodes.getVirtualElements();
			var a = new this._graph.NodeList(s.map(function(e) {
				return e._index
			}));
			var u = a.getPosition();
			var l = a.getId().reduce(function(e, t, r) {
				e[t] = u[r];
				return e
			}, {});
			var d = [],
				f = [],
				h = [];
			var c = this._nodeToGroup._buffer;
			for (var p = 1, g = c.length; p < g; p++) {
				var v = c[p];
				if (v !== undefined && v !== 0) {
					var y = Xv(t, v);
					if (l[y]) {
						var _ = l[y];
						d.push(p);
						f.push(_.x);
						h.push(_.y)
					}
				}
			}
			var m = new this._graph.NodeList(d);
			var x = m.getPosition();
			var b = this._graph.getAttributes(true, ["x", "y"]);
			var A = b[0];
			var w = b[1];
			A.setMultiple(d, f);
			w.setMultiple(d, h);
			this._transform.removeRule(t, function() {
				m.setAttributes(x, r).then(function() {
					bg.call(i, i._graphics);
					n()
				})
			})
		} else {
			this._transform.removeRule(t, n)
		}
	};

	function Ov(e, t) {
		if (t === void 0) t = {};
		var r = t.selector;
		var n = t.groupIdFunction;
		var i = t.nodeGenerator;
		var o = t.edgeGenerator;
		var s = t.ignoreEdgeDirection;
		if (s === void 0) s = false;
		var a = t.groupSelfLoopEdges;
		if (a === void 0) a = false;
		var u = t.duration;
		if (u === void 0) u = 0;
		if (!n) {
			n = function() {
				return "default"
			}
		}
		if (!i) {
			i = function() {
				return {}
			}
		}
		var l = r ?
		function(e) {
			return r(e) ? n(e) : undefined
		} : n;
		return function(t, r) {
			return Hv(e, t, r, l, i, o, s, a)
		}
	}
	function Bv(e, t) {
		if (t === void 0) t = {};
		var r = t.selector;
		var n = t.groupIdFunction;
		var i = t.generator;
		var o = t.ignoreEdgeDirection;
		if (o === void 0) o = false;
		if (!n) {
			n = function() {
				return "default"
			}
		}
		if (!i) {
			i = function() {
				return {}
			}
		}
		var s = r ?
		function(e) {
			return r(e) ? n(e) : undefined
		} : n;
		return function(t, r) {
			return Vv(e, t, r, s, i, o)
		}
	}
	function Uv(e) {
		var t = e[0];
		return {
			data: Ge(t.getData()),
			attributes: {
				width: t.getAttribute("width"),
				color: t.getAttribute("color")
			}
		}
	}
	function Xv(e, t) {
		return "#" + e + "[" + t + "]"
	}
	function jv(e, t, r) {
		return "#" + e + "[" + t + "->" + r + "]"
	}
	function Wv(e, t, r) {
		var n = t.toString(),
			i = r.toString(),
			o = n < i ? n : i,
			s = o === n ? i : n;
		return "#" + e + "[" + o + "<->" + s + "]"
	}
	function Gv(e, t, r, n, i, o) {
		if (e) {
			if (t) {
				return Wv(r, n, i)
			} else {
				return jv(r, n, i)
			}
		} else {
			return Xv(r, o)
		}
	}
	function Hv(e, t, r, n, i, o, s, a) {
		var u = t.nodes;
		var l = t.edges;
		var d = new cr,
			f = new cr,
			h = e._nodeToGroup,
			c = [],
			p = [],
			g = [],
			v = [];
		for (var y = 0; y < u.length; ++y) {
			var _ = u[y],
				m = n(_),
				x = d.get(m);
			if (!x) {
				x = [];
				d.set(m, x)
			}
			x.push(_);
			h.set(_._index, m)
		}
		for (var b = 0; b < l.length; ++b) {
			var A = l[b],
				w = A.getSource(),
				E = A.getTarget(),
				I = h.get(w._index),
				S = h.get(E._index);
			if (I !== undefined || S !== undefined) {
				if (I !== S || a) {
					var C = I !== undefined ? Xv(r, I) : w.getId(),
						T = S !== undefined ? Xv(r, S) : E.getId(),
						L = Gv(o, s, r, C, T, A.getId()),
						N = f.get(L);
					if (N) {
						N.edges.push(A)
					} else {
						f.set(L, {
							source: C,
							target: T,
							edges: [A]
						})
					}
				} else {
					v.push(A)
				}
			}
		}
		var z = d.keys(),
			M = f.keys();
		for (var k = 0; k < z.length; ++k) {
			var R = z[k];
			if (R !== undefined) {
				var F = d.get(R),
					P = i(F, R, r);
				P.id = Xv(r, R);
				if (!P.attributes) {
					P.attributes = {}
				}
				if (!("x" in P.attributes) || !("y" in P.attributes)) {
					var D = F.reduce(function(e, t) {
						var r = t.getPosition();
						e.x += r.x;
						e.y += r.y;
						return e
					}, {
						x: 0,
						y: 0
					});
					var O = D.x;
					var B = D.y;
					P.attributes.x = O / F.length;
					P.attributes.y = B / F.length
				}
				c.push(P);
				g.push.apply(g, F)
			}
		}
		if (!o) {
			o = Uv
		}
		for (var U = 0; U < M.length; ++U) {
			var X = M[U];
			if (X !== undefined) {
				var j = f.get(X);
				var W = j.source;
				var G = j.target;
				var H = j.edges;
				var Y = o(H, X, r);
				Y.id = X;
				Y.source = W;
				Y.target = G;
				p.push(Y);
				v.push.apply(v, H)
			}
		}
		return {
			virtualNodes: c,
			virtualEdges: p,
			hiddenNodes: g,
			hiddenEdges: v,
			groupToNodes: d
		}
	}
	function Yv(e, t) {
		var r = e.toString(),
			n = t.toString();
		return r < n ? [r, n] : [n, r]
	}
	function Vv(e, t, r, n, i, o) {
		var s = t.edges;
		var a = new cr,
			u = e._edgeToGroup,
			l = [],
			d = [];
		for (var f = 0; f < s.length; ++f) {
			var h = s[f],
				c = h.getSource().getId(),
				p = h.getTarget().getId(),
				g = n(h),
				v = g;
			if (g) {
				if (o) {
					var y = Yv(c, p);
					var _ = y[0];
					var m = y[1];
					g = "#" + r + "(" + _ + "<->" + m + ")[" + g + "]"
				} else {
					g = "#" + r + "(" + c + "->" + p + ")[" + g + "]"
				}
				var x = a.get(g);
				if (!x) {
					x = {
						source: c,
						target: p,
						groupId: v,
						edges: []
					};
					a.set(g, x)
				}
				x.edges.push(h)
			}
			u.set(h._index, g)
		}
		var b = a.keys();
		for (var A = 0; A < b.length; ++A) {
			var w = b[A];
			if (w !== undefined) {
				var E = a.get(w);
				var I = E.source;
				var S = E.target;
				var C = E.edges;
				var T = E.groupId;
				var L = i(C, T, r);
				L.id = w;
				L.source = I;
				L.target = S;
				l.push(L);
				d.push.apply(d, C)
			}
		}
		return {
			virtualEdges: l,
			hiddenEdges: d
		}
	}
	var qv = {
		"top-left": "left",
		"bottom-left": "left",
		"top-right": "right",
		"bottom-right": "right"
	};
	var Zv = {
		"top-left": "top",
		"bottom-left": "bottom",
		"top-right": "top",
		"bottom-right": "bottom"
	};
	g.extend(function(e) {
		var t = new Jv(e);
		e.modules.brand = t;
		e.tools.brand = {
			set: function e(r, n) {
				return t.set(r, n)
			},
			remove: function e() {
				t.remove()
			}
		}
	});
	var Qv = {
		position: "bottom-right",
		horizontalMargin: 0,
		verticalMargin: 0,
		className: null
	};
	var Jv = function e(t) {
			var r = this;
			this._render = t.modules.render;
			this._brand = null;
			t.modules.events.on({
				kill: function() {
					return r.remove()
				}
			})
		};
	Jv.prototype.set = function e(t, r) {
		var n = Ye(r, Qv);
		var i = n.position;
		var o = n.horizontalMargin;
		var s = n.verticalMargin;
		var a = n.className;
		if (!qv[i]) {
			i = Qv.position
		}
		this.remove();
		var u = document.createElement("div");
		u.innerHTML = t;
		u.style.position = "absolute";
		u.style[qv[i]] = o + "px";
		u.style[Zv[i]] = s + "px";
		u.style.padding = "0px 0px 0px 0px";
		u.style.zIndex = "1000";
		if (a) {
			u.setAttribute("class", a)
		}
		this._brand = u;
		this._render.addRenderLayer(this._brand, "brand");
		return u
	};
	Jv.prototype.remove = function e() {
		if (this._brand) {
			this._render.removeRenderLayer(this._brand);
			this._brand = null
		}
	};
	g.extend(function(e) {
		var t = new sy(e);
		var r = e.modules;
		var n = r.graph;
		e.modules.geo = t;
		e.geo = {
			enable: function(e) {
				return t.enable(e)
			},
			disable: function(e) {
				return t.disable(e)
			},
			setOptions: function(e) {
				return t.setOptions(e)
			},
			enabled: function() {
				return t.isEnabled()
			},
			getCenter: function() {
				return t.getCenter()
			},
			getView: function() {
				return t.getView()
			},
			getZoom: function() {
				return t.getZoom()
			},
			setZoom: function(e) {
				return t.setZoom(e)
			},
			setView: function(e, r, n) {
				return t.setView(e, r, n)
			},
			setCenter: function(e, r) {
				return t.setCenter(e, r)
			},
			toggle: function(e) {
				return t.toggle(e)
			},
			resetCoordinates: function() {
				return t.resetCoordinates()
			},
			updateCoordinates: function() {
				return t.updateCoordinates()
			}
		};
		n.Node.prototype.getGeoCoordinates = function() {
			return {
				latitude: n.getAttribute(true, "geo.latitude").get(this._index),
				longitude: n.getAttribute(true, "geo.longitude").get(this._index)
			}
		};
		n.Node.prototype.setGeoCoordinates = function(e, r) {
			var i = e.latitude;
			var o = e.longitude;
			n_(i, o);
			n.getAttribute(true, "geo.latitude").set(this._index, i);
			n.getAttribute(true, "geo.longitude").set(this._index, o);
			return t._redrawNodes(r, this)
		};
		n.NodeList.prototype.getGeoCoordinates = function() {
			var e = new Array(this._indexes.length);
			var t = n.getAttribute(true, "geo.latitude").getMultiple(this._indexes);
			var r = n.getAttribute(true, "geo.longitude").getMultiple(this._indexes);
			for (var i = 0, o = this._indexes.length; i < o; i++) {
				e[i] = {
					latitude: t[i],
					longitude: r[i]
				}
			}
			return e
		};
		n.NodeList.prototype.setGeoCoordinates = function(e, r) {
			var i = this.getId();
			var o = this._indexes;
			var s = n.getAttribute(true, "geo.latitude");
			var a = n.getAttribute(true, "geo.longitude");
			var u = new Array(o.length);
			var l = new Array(o.length);
			if (e.length !== o.length) {
				throw new RangeError("You must provide coordinates for each node in the NodeList")
			}
			for (var d = 0, f = o.length; d < f; d++) {
				var h = e[d],
					c = i[d];
				ly(c, h.latitude);
				uy(c, h.longitude);
				u[d] = h.latitude;
				l[d] = h.longitude
			}
			s.setMultiple(o, u);
			a.setMultiple(o, l);
			return t._redrawNodes(r, this)
		};
		e.events.onGeoModeEnabled = function(t) {
			e.modules.events.on("geoEnabled", t);
			return e.events
		};
		e.events.onGeoModeDisabled = function(t) {
			e.modules.events.on("geoDisabled", t);
			return e.events
		};
		e.events.onGeoModeLoaded = function(t) {
			e.modules.events.on("geoLoaded", t);
			return e.events
		}
	});
	var Kv = {
		latitudePath: "latitude",
		longitudePath: "longitude",
		maxZoomLevel: 17,
		tileUrlTemplate: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
		tileUrlSubdomains: "abc",
		attribution: null,
		backgroundColor: "silver",
		opacity: 1,
		transitionDuration: 0,
		detectRetina: false,
		disableNodeDragging: true,
		tileBuffer: 1
	};
	var $v = 256;
	var ey = 500;
	var ty = 100;
	var ry = 100;
	var ny = 0;
	var iy = 10;

	function oy(e) {
		if (e === void 0) e = {};
		var t = e.tileUrlSubdomains;
		var r = e.tileUrlTemplate;
		var n = e.attribution;
		var i = e.latitudePath;
		var o = e.longitudePath;
		if (r && typeof r !== "string") {
			throw new TypeError("Geo mode: tileUrlTemplate must be a URL string")
		}
		if (t && typeof t !== "string") {
			throw new TypeError("Geo mode: tileUrlTemplate must be a string")
		}
		if (n && typeof n !== "string") {
			throw new TypeError("Geo mode: Map attribution must be a string")
		}
		if (i && typeof i !== "string") {
			throw new TypeError("Geo mode: Latitude path must be a '.'-separated path")
		}
		if (o && typeof o !== "string") {
			throw new TypeError("Geo mode: Longitude path must be a '.'-separated path")
		}
	}
	var sy = function e(t) {
			var r = this;
			var n = t.modules;
			var i = n.render;
			var o = n.graphics;
			var s = n.graph;
			var a = n.camera;
			var u = n.locate;
			var l = n.data;
			var d = n.events;
			var f = n.settings;
			var h = n.brand;
			this._ogma = t;
			this._render = i;
			this._graphics = o;
			this._graph = s;
			this._data = l;
			this._camera = a;
			this._events = d;
			this._settingsModule = f;
			this._locate = u;
			this._brand = h;
			this._settings = Ve({}, Kv);
			this._screen = this._render.getDimensions();
			this._tiles = {};
			this._tileSize = $v * Ut();
			this._enableMapBackground = false;
			this._init = false;
			this._enabled = false;
			this._sIndex = 0;
			this._lat = 0;
			this._lng = 0;
			this._zoom = 1;
			this._zoomOffset = 0;
			this._loadingTiles = 0;
			s.createNodeAttribute({
				name: "geo.prevX",
				storage: "float"
			});
			s.createNodeAttribute({
				name: "geo.prevY",
				storage: "float"
			});
			s.createNodeAttribute({
				name: "geo.prevLat",
				storage: "float"
			});
			s.createNodeAttribute({
				name: "geo.prevLng",
				storage: "float"
			});
			s.createNodeAttribute({
				name: "geo.prevSize",
				storage: "float"
			});
			s.createNodeAttribute({
				name: "geo.latitude",
				storage: "float"
			});
			s.createNodeAttribute({
				name: "geo.longitude",
				storage: "float"
			});
			this._graph.createEdgeAttribute({
				name: "geo.prevSize",
				storage: "float"
			});
			d.register(["geoEnabled", "geoDisabled", "geoLoaded", "geoReady"]);
			d.on({
				addNodes: function(e) {
					return r._onNodesAdded(e.nodes)
				},
				addEdges: function(e) {
					return r._onEdgesAdded(e.edges)
				},
				setContainer: function(e) {
					if (e && r._enabled) {
						My(r, e)
					}
				},
				cameraMove: function() {
					return Ly(r)
				},
				resize: function() {
					return r._onResize()
				},
				endMoveNodesByDragging: function(e) {
					return Uy(r, e.nodes)
				}
			})
		};
	sy.prototype._onNodesDrawn = function e(t) {
		if (this._enabled && !this._transition) {
			Uy(this, t)
		}
	};
	sy.prototype._onResize = function e() {
		dy(this);
		Ly(this)
	};
	sy.prototype._readNodesCoordinates = function e(t) {
		var r = this._graph;
		var n = this._settings;
		var i = n.longitudePath;
		var o = n.latitudePath;
		var s = r.getAttributes(true, ["geo.latitude", "geo.longitude"]);
		var a = s[0];
		var u = s[1];
		var l = this._nodeVisibilityFilter;
		var d = t._indexes;
		var f = t.getId();
		var h = d.length;
		var c = t.getData(o),
			p = t.getData(i);
		var g, v, y, _;
		for (var m = 0; m < h; m++) {
			v = p[m];
			g = c[m];
			_ = d[m];
			y = f[m];
			if (g !== undefined && v !== undefined) {
				uy(y, v);
				ly(y, g);
				u.set(_, +v);
				a.set(_, +g);
				if (l) {
					l.set(_, 0)
				}
			} else {
				if (l) {
					l.set(_, 1)
				}
			}
		}
	};
	sy.prototype._onNodesAdded = function e(t) {
		this._readNodesCoordinates(t);
		if (this._enabled) {
			ky(this, t);
			Oy(this, t);
			By(this, true, t);
			this._graph._refreshFilters(true);
			this._graph._refreshFilters(false)
		}
	};
	sy.prototype._onEdgesAdded = function e(t) {
		if (this._enabled) {
			jy(this, t, "width", "geo.prevSize");
			By(this, false, t)
		}
	};
	sy.prototype._onSettingsChanged = function e(t, r) {
		if (!this._enabled) {
			return
		}
		if (t.tileUrlTemplate !== r.tileUrlTemplate) {
			clearTimeout(this._redrawTimer);
			vy(this);
			Ly(this)
		}
		if (t.sizeZoomReferential !== r.sizeZoomReferential) {
			By(this, true, this._graph.getNodes());
			By(this, false, this._graph.getEdges());
			this._graphics.refreshAll()
		}
		if (t.attribution !== r.attribution) {
			fy(this)
		}
		if (t.maxZoomLevel !== r.maxZoomLevel) {
			this._settingsModule.update({
				minZoom: 1,
				maxZoom: Math.pow(2, r.maxZoomLevel)
			})
		}
	};
	sy.prototype._updateVisibility = function e(t, r) {
		var n = this._graph;
		var i = this._settings;
		var o = i.latitudePath;
		var s = i.longitudePath;
		var a = t._indexes;
		var u = n._allIndexes(false);
		var l = t.getData(o);
		var d = t.getData(s);
		var f = a.length;
		var h = new Array(f);
		var c = {};
		for (var p = 0; p < f; p++) {
			var g = l[p] === undefined || d[p] === undefined;
			h[p] = g;
			c[a[p]] = !g
		}
		var v = n.getAttribute(false, "source").getMultiple(u);
		var y = n.getAttribute(false, "target").getMultiple(u);
		var _ = new Array(u.length);
		for (var m = 0, x = u.length; m < x; m++) {
			_[m] = !(c[v[m]] && c[y[m]])
		}
		this._nodeVisibilityFilter.setMultiple(a, h);
		this._edgeVisibilityFilter.setMultiple(u, _);
		this._graph._refreshFilters(true);
		this._graph._refreshFilters(false);
		if (r) {
			setTimeout(r)
		}
	};
	sy.prototype._transformToGeoSpace = function e(t, r) {
		var n = this;
		var i = r.X;
		var o = r.Y;
		var s = r.indexes;
		var a = this._graph.getAttributes(true, ["x", "y", "radius"]);
		var u = a[0];
		var l = a[1];
		var d = a[2];
		var f = u.getMultiple(s),
			h = l.getMultiple(s);
		var c = ay(f, h);
		var p = ay(i, o);
		if (f.length === 0 || h.length === 0) {
			c.cx = c.cy = 0;
			c.width = c.height = 0
		}
		if (!isFinite(p.width) || !isFinite(p.height)) {
			p.cx = p.cy = 0;
			p.width = p.height = 0
		}
		var g = p.cx - c.cx,
			v = p.cy - c.cy;
		var y = Math.min(p.width / c.width, p.height / c.height) * Ut();
		var _ = this._locate._computeConfigForBounds(p);
		_.zoom = i_(_.zoom);
		var m = this._camera.zoom / _.zoom / Ut();
		g += (c.cx - this._camera.x) * m;
		v += (c.cy - this._camera.y) * m;
		var x = c.cx + g,
			b = c.cy + v;
		for (var A = 0, w = s.length; A < w; A++) {
			var E = f[A],
				I = h[A];
			f[A] = (E + g - x) * m + x;
			h[A] = (I + v - b) * m + b
		}
		this._scaleInfo = {
			ratio: m,
			sizeRatio: y,
			dx: g,
			dy: v,
			zoom: this._camera.zoom,
			x: this._camera.x,
			y: this._camera.y
		};
		var S = this._graph.getAttribute(false, "width");
		var C = this._graph._allIndexes(false).filter(function(e) {
			return n._edgeVisibilityFilter.get(e) === 0
		});
		u.setMultiple(s, f);
		l.setMultiple(s, h);
		d.setMultiple(s, d.getMultiple(s).map(function(e) {
			return e * m
		}));
		S.setMultiple(C, S.getMultiple(C).map(function(e) {
			return e * m
		}));
		this._scaleInfo.cameraConfig = {
			zoom: this._camera.zoom / m,
			x: (this._camera.x + g - x) * m + x,
			y: (this._camera.y + v - b) * m + b
		};
		this._graphics.refreshAll()
	};
	sy.prototype._show = function e(t) {
		var r = this;
		var n = this._render.getContainer(),
			i = this._settings.transitionDuration;
		if (n) {
			if (!this._init) {
				My(this, n)
			}
			this._render.addRenderLayer(this._rcanvas, "geo")
		}
		this._enableTime = ie();
		this._enableMapBackground = false;
		var o = this._graph.getNodes();
		var s = this._graph.getEdges();
		this._nodeVisibilityFilter = this._graph._addFilter(true);
		this._edgeVisibilityFilter = this._graph._addFilter(false);
		this._updateVisibility(o, function() {
			r._readNodesCoordinates(o);
			r._graphics.refreshAll();
			ky(r, o);
			jy(r, s, "width", "geo.prevSize");
			var e = r._graphics._setFeatureVisibility(true, "text", false);
			var n = r._graphics._setFeatureVisibility(false, "text", false);
			var a = Dy(r, o);
			r._transformToGeoSpace(o, a);
			r._edgeSizeRatio = r._scaleInfo.sizeRatio;
			r._nodeSizeRatio = r._scaleInfo.sizeRatio;
			r._graphics.animate(function() {
				r._graphics.refreshAll();
				Oy(r, o, a);
				By(r, true, o);
				By(r, false, s);
				r._camera.setView(r._scaleInfo.cameraConfig)
			}, i).then(function() {
				r._graphics._setFeatureVisibility(true, "text", e);
				r._graphics._setFeatureVisibility(false, "text", n);
				r._prevSettings = r._settingsModule.update({
					backgroundColor: null,
					minZoom: 1,
					maxZoom: Math.pow(2, r._settings.maxZoomLevel),
					"interactions.rotation.enabled": false
				});
				r._enableMapBackground = true;
				fy(r);
				if (r._graph.getNodes().size === 0) {
					r.setCenter(0, 0)
				}
				_y(r, r._settings.opacity, r._settings.backgroundColor);
				t()
			}).
			catch (function(e) {
				Fe(e.stack)
			})
		})
	};
	sy.prototype._transformToGraphSpace = function e(t) {
		var r = this;
		var n = this._graph.getAttributes(true, ["x", "y", "geo.prevX", "geo.prevY", "radius"]);
		var i = n[0];
		var o = n[1];
		var s = n[2];
		var a = n[3];
		var u = n[4];
		var l = t._indexes.filter(function(e) {
			return r._nodeVisibilityFilter.get(e) === 0
		});
		var d = i.getMultiple(l),
			f = o.getMultiple(l),
			h = u.getMultiple(l);
		var c = ay(d, f);
		var p = this._graph._allIndexes(true);
		var g = ay(s.getMultiple(p), a.getMultiple(p));
		this._settingsModule.update({
			minZoom: this._prevSettings.minZoom
		});
		var v = this._locate._computeConfigForBounds(g);
		v.zoom = i_(v.zoom);
		this._scaleInfo.cameraConfig = v;
		var y = g.cx - c.cx,
			_ = g.cy - c.cy;
		var m = this._camera.zoom / v.zoom;
		y += (c.cx - this._camera.x) * m;
		_ += (c.cy - this._camera.y) * m;
		var x = c.cx + y,
			b = c.cy + _;
		for (var A = 0, w = l.length; A < w; A++) {
			var E = d[A],
				I = f[A];
			d[A] = (E + y - x) * m + x;
			f[A] = (I + _ - b) * m + b;
			h[A] *= m
		}
		i.setMultiple(l, d);
		o.setMultiple(l, f);
		u.setMultiple(l, h);
		var S = this._graph._allIndexes(false).filter(function(e) {
			return r._edgeVisibilityFilter.get(e) === 0
		});
		var C = this._graph.getAttribute(false, "width");
		C.setMultiple(S, C.getMultiple(S).map(function(e) {
			return e / m
		}));
		this._graphics.refreshAll()
	};
	sy.prototype._hide = function e(t) {
		var r = this;
		var n = this._render.getContainer();
		var i = this._settings.transitionDuration;
		var o = i / 2;
		var s = ie();
		var a = function() {
				var e = ie();
				var t = (e - s) / o;
				if (t < 1 && t >= 0) {
					_y(r, 1 - t, r._prevBgColor);
					r._fadeTimer = F(a)
				}
			};
		clearTimeout(this._redrawTimer);
		if (o !== 0) {
			this._fadeTimer = F(a)
		} else {
			a()
		}
		var u = this._graph.getNodes();
		this._transformToGraphSpace(u);
		var l = this._graphics._setFeatureVisibility(true, "text", false);
		var d = this._graphics._setFeatureVisibility(false, "text", false);
		this._graphics.animate(function() {
			r._graphics.refreshAll();
			Ry(r, u);
			Fy(r, u);
			jy(r, r._graph.getEdges(), "geo.prevSize", "width");
			r._camera.setView(r._scaleInfo.cameraConfig)
		}, i).then(function() {
			hy(r);
			r._graphics._setFeatureVisibility(true, "text", l);
			r._graphics._setFeatureVisibility(false, "text", d);
			r._graph._removeFilter(true, r._nodeVisibilityFilter);
			r._graph._removeFilter(false, r._edgeVisibilityFilter);
			r._nodeVisibilityFilter = r._edgeVisibilityFilter = null;
			r._graph._refreshFilters(true);
			r._graph._refreshFilters(false);
			r._graphics.refreshAll();
			if (n) {
				r._render.removeRenderLayer(r._rcanvas)
			}
			setTimeout(function() {
				r._settingsModule.update(r._prevSettings);
				vy(r);
				t()
			})
		})
	};
	sy.prototype.enable = function e(t) {
		return this.setEnabled(true, t)
	};
	sy.prototype.disable = function e(t) {
		return this.setEnabled(false, t)
	};
	sy.prototype.isEnabled = function e() {
		return this._enabled
	};
	sy.prototype.toggle = function e(t) {
		return this.setEnabled(!this._enabled, t)
	};
	sy.prototype.setOptions = function e(t) {
		if (t === void 0) t = {};
		oy(t);
		var r = this._settings;
		this._settings = Ve({}, this._settings, Kv, t);
		if (this._enabled) {
			this._onSettingsChanged(r, this._settings)
		}
	};
	sy.prototype.setEnabled = function e(value, t) {
		var r = this;
		if (t === void 0) t = {};
		oy(t);
		if (value !== this._enabled && !this._transition) {
			this._enabled = value;
			this._transition = true;
			this._settings = Ve({}, this._settings, Kv, t);
			if (value) {
				if (this._settings.disableNodeDragging) {
					this._nodeDraggingSetting = this._settingsModule.get("interactions.drag.enabled");
					this._settingsModule.update({
						interactions: {
							drag: {
								enabled: false
							}
						}
					})
				}
				this._show(function() {
					r._transition = false;
					r._events.fire("geoEnabled");
					r._events.fire("geoReady")
				})
			} else {
				this._hide(function() {
					r._transition = false;
					r._events.fire("geoDisabled");
					if (r._settings.disableNodeDragging) {
						r._settingsModule.update({
							interactions: {
								drag: {
									enabled: r._nodeDraggingSetting
								}
							}
						})
					}
				})
			}
		}
		return new Promise(function(e) {
			if (r._transition) {
				r._events.once(value ? "geoEnabled" : "geoDisabled", e)
			} else {
				e()
			}
		})
	};
	sy.prototype.resetCoordinates = function e() {
		if (!this._enabled) {
			return
		}
		var t = this._graph.getNodes();
		Py(this, t);
		Oy(this, t);
		this._graphics.refreshAll()
	};
	sy.prototype.updateCoordinates = function e() {
		Uy(this, this._graph.getNodes());
		if (this._enabled) {
			this._graphics.refreshAll()
		}
	};
	sy.prototype._redrawNodes = function e(t, r) {
		var n = this;
		return new Promise(function(e, i) {
			if (n._enabled) {
				Oy(n, n._graph.getNodes(), undefined, t, function() {
					return e(r)
				});
				n._graphics.refreshAll()
			} else {
				e(r)
			}
		})
	};
	sy.prototype.setView = function e(t, r, n) {
		if (!this._enabled) {
			throw new Error("Geo mode is not enabled")
		}
		r_(this, n);
		n_(t, r);
		zy(this, t, r, n);
		Ny(this)
	};
	sy.prototype.setCenter = function e(t, r) {
		this.setView(t, r, this._zoom)
	};
	sy.prototype.setZoom = function e(t) {
		this.setView(this._lat, this._lng, t)
	};
	sy.prototype.getView = function e() {
		return {
			latitude: this._lat,
			longitude: this._lng,
			zoom: this._zoom
		}
	};
	sy.prototype.getCenter = function e() {
		return {
			latitude: this._lat,
			longitude: this._lng
		}
	};
	sy.prototype.getZoom = function e() {
		return this._zoom
	};
	sy.prototype.exportBackground = function e(t, r) {
		var n = this;
		r = r || this._camera.getView();
		return new Promise(function(e, i) {
			var o = Math.log2(r.zoom);
			var s = e_(r.x, r.y);
			var a = s[0];
			var u = s[1];
			if (!cy(n, t.getContext("2d"), t.width, t.height, o, a, u, false)) {
				setTimeout(function() {
					n.exportBackground(t, r).then(e)
				}, ty)
			} else {
				e()
			}
		})
	};
	sy.prototype.whenReady = function e(t) {
		var r = this;
		if (typeof t !== "function") {
			throw new Error("Callback has to be a function")
		}
		var n = function() {
				return r.whenReady(t)
			};
		if (this.isEnabled()) {
			if (this._transition) {
				this._events.once("geoReady", n)
			} else if (!yy(this)) {
				setTimeout(n, 50)
			} else {
				t()
			}
		} else {
			this._events.once("geoEnabled", n)
		}
		return this
	};

	function ay(e, t) {
		var r = e.reduce(function(r, n, i) {
			var o = e[i],
				s = t[i];
			r.minX = Math.min(o, r.minX);
			r.minY = Math.min(s, r.minY);
			r.maxX = Math.max(o, r.maxX);
			r.maxY = Math.max(s, r.maxY);
			return r
		}, {
			minX: Infinity,
			minY: Infinity,
			maxX: -Infinity,
			maxY: -Infinity
		});
		r.width = r.maxX - r.minX;
		r.height = r.maxY - r.minY;
		r.cx = r.minX + r.width * .5;
		r.cy = r.minY + r.height * .5;
		return r
	}
	function uy(e, t) {
		if (isNaN(t)) {
			throw new TypeError("node " + e + ": " + t + " is not a valid longitude")
		}
	}
	function ly(e, t) {
		if (isNaN(t)) {
			throw new TypeError("node " + e + ": " + t + " is not a valid latitude")
		}
	}
	function dy(e) {
		if (e._init) {
			var t = e._screen = e._render.getDimensions();
			var r = t.width;
			var n = t.height;
			e._tileSize = $v * Ut();
			Vt(e._canvas, r, n);
			Vt(e._rcanvas, r, n)
		}
	}
	function fy(e) {
		if (!e._enabled) {
			return
		}
		var t = e._settings.attribution;
		if (t) {
			e._brand.set(t)
		} else {
			e._brand.remove()
		}
	}
	function hy(e) {
		e._brand.remove()
	}
	function cy(e, t, r, n, i, o, s, a) {
		t = t || e._ctx;
		var u = Math.ceil(i),
			l = e._settings.tileBuffer,
			d = u - i,
			f = 1 / Math.pow(2, d),
			h = e._tileSize * f,
			c = u,
			p = Ut();
		r += l * 2 * h;
		n += l * 2 * h;
		if (e._settings.detectRetina) {
			h /= p;
			c += Math.log2(p)
		}
		var g = t_(o, s, c),
			v = g.x | 0,
			y = g.y | 0;
		var _ = g.x - v,
			m = g.y - y;
		var x = r / 2 - _ * h,
			b = n / 2 - m * h;
		while (x > 0) {
			x -= h;
			v -= 1
		}
		while (b > 0) {
			b -= h;
			y -= 1
		}
		var A = true;
		x -= l * h;
		b -= l * h;
		var w = [];
		var E, I, S, C, T;
		for (E = x, I = v; E < r; E += h, ++I) {
			for (S = b, C = y; S < n; S += h, ++C) {
				w.push([I, C, E, S])
			}
		}
		e._tileBounds = [v - l, y - l, I + l, C + l];
		var L = v + (I - v) / 2,
			N = y + (C - y) / 2;
		w.sort(function(e, t) {
			return Mr(e[0], e[1], L, N) - Mr(t[0], t[1], L, N)
		});
		for (E = 0, T = w.length; E < T; E++) {
			var z = w[E];
			A &= xy(e, t, z[2], z[3], c, z[0], z[1], h, a)
		}
		clearTimeout(e._pruneTimer);
		e._pruneTimer = setTimeout(function() {
			return py(e, c)
		}, ey);
		return A
	}
	function py(e, t) {
		var r = {};
		var n = e._settings.tileBuffer;
		var i = e._tileBounds;
		var o, s, a, u, l, d;
		for (var f in e._tiles) {
			var h = f.split("/");
			d = parseInt(h[0]);
			u = parseInt(h[1]);
			l = parseInt(h[2]);
			r[d] = r[d] || [];
			r[d].push([u, l])
		}
		var c = [];
		for (d in r) {
			var p = parseInt(d);
			var g = Math.pow(2, p - t);
			var v = r[d];
			for (o = 0, s = v.length; o < s; o++) {
				a = v[o];
				u = a[0];
				l = a[1];
				if (u < i[0] * g - n || u > i[2] * g + n || l < i[1] * g - n || l > i[3] * g + n) {
					c.push(Cy(p, a[0], a[1]))
				}
			}
		}
		gy(e, c);
		return c.length
	}
	function gy(e, t) {
		for (var r = 0, n = t.length; r < n; r++) {
			var i = t[r];
			var o = e._tiles[i];
			if (o) {
				if (!o.err && !o.loaded) {
					ny--
				}
				if (o.img) {
					Sy(o.img)
				}
			}
			delete e._tiles[i]
		}
	}
	function vy(e) {
		gy(e, Object.keys(e._tiles));
		e._tiles = {}
	}
	function yy(e) {
		var t = 0;
		Object.keys(e._tiles).forEach(function(r) {
			var n = e._tiles[r];
			if (n && !n.loaded && !n.err) {
				t++
			}
		});
		return t === 0
	}
	function _y(e, t, r) {
		if (!e._enableMapBackground || !e._ctx) {
			return
		}
		var n = e._ctx,
			i = e._lat,
			o = e._lng,
			s = e._zoom,
			a = Ut(),
			u = e._screen.width * a,
			l = e._screen.height * a;
		n.fillStyle = r || e._settings.backgroundColor;
		n.fillRect(0, 0, u, l);
		if (typeof t === "number" && t !== e._opacity) {
			e._opacity = t;
			e._rcanvas.style.opacity = t
		}
		if (!cy(e, e._ctx, u, l, s, i, o, true)) {
			clearTimeout(e._redrawTimer);
			e._redrawTimer = setTimeout(function() {
				_y(e, t, r)
			}, ry)
		} else {
			e._events.fire("geoLoaded")
		}
		e._rctx.drawImage(e._canvas, 0, 0)
	}
	function my(e) {
		return e instanceof Image
	}
	function xy(e, t, r, n, i, o, s, a, u) {
		var l = Ty(e, i, o, s, true);
		if (my(l)) {
			t.drawImage(l, r, n, a, a);
			return true
		} else if (l === by.LOADING) {
			if (u) {
				var d;
				l = Ty(e, i - 1, o / 2 | 0, s / 2 | 0, false);
				if (my(l)) {
					d = l.naturalWidth / 2;
					var f = o & 1 ? d : 0;
					var h = s & 1 ? d : 0;
					t.drawImage(l, f, h, d, d, r, n, a, a)
				} else {
					var c = Ty(e, i + 1, o * 2, s * 2, false),
						p = Ty(e, i + 1, o * 2 + 1, s * 2, false),
						g = Ty(e, i + 1, o * 2, s * 2 + 1, false),
						v = Ty(e, i + 1, o * 2 + 1, s * 2 + 1, false);
					if (my(c) && my(p) && my(g) && my(v)) {
						d = a / 2;
						t.drawImage(c, r, n, d, d);
						t.drawImage(p, r + d, n, d, d);
						t.drawImage(g, r, n + d, d, d);
						t.drawImage(v, r + d, n + d, d, d)
					}
				}
			}
			return false
		} else {
			return true
		}
	}
	var by = {
		INVALID: 1,
		LOADING: 2,
		MISSING: 3
	};

	function Ay(e, t) {
		var r = e._sIndex;
		if (t.length > 0) {
			r = (r + 1) % t.length;
			e._sIndex = r;
			return r
		}
		return 0
	}
	function wy(e, t, r, n) {
		var i = e._settings.tileUrlSubdomains,
			o = Ay(e, i);
		return e._settings.tileUrlTemplate.replace("{z}", n).replace("{x}", t).replace("{y}", r).replace("{s}", i.charAt(o))
	}
	function Ey() {
		if (this._tile) {
			ny--;
			this._tile.err = true;
			Sy(this)
		}
	}
	function Iy() {
		if (this._tile) {
			ny--;
			this._tile.loaded = true;
			Sy(this)
		}
	}
	function Sy(e) {
		e.onLoad = e.onError = null;
		e._tile = null
	}
	function Cy(e, t, r) {
		return e + "/" + t + "/" + r
	}
	function Ty(e, t, r, n, i) {
		var o = Math.pow(2, t) - 1;
		if (t < 0 || r < 0 || r > o || n < 0 || n > o) {
			return by.INVALID
		}
		var s = Cy(t, r, n),
			a = e._tiles[s];
		if (!a) {
			if (!i) {
				return by.MISSING
			} else {
				if (!e._camera.animationInProgress() && ny < iy) {
					var u = new Image;
					a = {
						img: u,
						err: false,
						loaded: false
					};
					u._tile = a;
					u.setAttribute("crossOrigin", "anonymous");
					u.onError = Ey;
					u.onload = Iy;
					u.src = wy(e, r, n, t);
					ny++
				}
				e._tiles[s] = a;
				return by.LOADING
			}
		} else if (a.err) {
			return by.MISSING
		} else if (!a.loaded) {
			return by.LOADING
		} else {
			return a.img
		}
	}
	function Ly(e) {
		if (e._enabled) {
			var t = e._camera;
			var r = Math.max(0, Math.log2(t.zoom));
			var n = e_(t.x, t.y);
			zy(e, n[0], n[1], r)
		}
	}
	function Ny(e) {
		var t = $y(e._lat, e._lng),
			r = Math.pow(2, e._zoom);
		e._camera.setView({
			x: t[0],
			y: t[1],
			zoom: r
		})
	}
	function zy(e, t, r, n) {
		if (!e._enabled) {
			return
		}
		e._lat = t;
		e._lng = r;
		e._zoom = n;
		_y(e)
	}
	/*画布的位置*/
	function My(e, t) {
		e._rcanvas = document.createElement("canvas");
		e._rctx = e._rcanvas.getContext("2d");
		e._canvas = document.createElement("canvas");
		e._ctx = e._canvas.getContext("2d");
		e._rcanvas.style.position = "absolute";
		e._rcanvas.style.zIndex = +(t.style.zIndex || 0) - 1;
		e._rcanvas.className = "ogma-geo-container";
		e._init = true;
		dy(e)
	}
	function ky(e, t) {
		Xy(e, t, "x", "geo.prevX");
		Xy(e, t, "y", "geo.prevY");
		Xy(e, t, "radius", "geo.prevSize");
		Xy(e, t, "geo.latitude", "geo.prevLat");
		Xy(e, t, "geo.longitude", "geo.prevLng")
	}
	function Ry(e, t) {
		Xy(e, t, "geo.prevX", "x");
		Xy(e, t, "geo.prevY", "y")
	}
	function Fy(e, t) {
		Xy(e, t, "geo.prevSize", "radius")
	}
	function Py(e, t) {
		Xy(e, t, "geo.prevLat", "geo.latitude");
		Xy(e, t, "geo.prevLng", "geo.longitude");
		Oy(e, t)
	}
	function Dy(e, t) {
		var r = e._nodeVisibilityFilter;
		var n = e._graph.getAttributes(true, ["geo.latitude", "geo.longitude"]);
		var i = n[0];
		var o = n[1];
		var s = new Array(2),
			a, u, l;
		var d = t._indexes;
		var f = i.getMultiple(d);
		var h = o.getMultiple(d);
		var c = d.length,
			p = [];
		var g = [],
			v = [];
		for (var y = 0, _ = c; y < _; ++y) {
			l = d[y];
			a = f[y], u = h[y];
			if (r.get(l) === 0) {
				$y(a, u, s);
				g.push(s[0]);
				v.push(s[1]);
				p.push(l)
			}
		}
		return {
			X: g,
			Y: v,
			indexes: p
		}
	}
	function Oy(e, t, r, n, i) {
		if (n === void 0) n = 0;
		if (i === void 0) i = function() {};
		if (!r) {
			r = Dy(e, t)
		}
		var o = r.X;
		var s = r.Y;
		var a = r.indexes;
		var u = e._graph.getAttributes(true, ["x", "y"]);
		var l = u[0];
		var d = u[1];
		if (n === 0) {
			l.setMultiple(a, o);
			d.setMultiple(a, s);
			i()
		} else {
			return t.setAttributes(a.map(function(e, t) {
				return {
					x: o[t],
					y: s[t]
				}
			}), n).then(i)
		}
	}
	function By(e, t, r) {
		var n = e._graph.getAttributes(t, [t ? "radius" : "width", "geo.prevSize"]);
		var i = n[0];
		var o = n[1];
		var s = t ? e._nodeSizeRatio : e._edgeSizeRatio;
		if (e._settings.sizeZoomReferential) {
			s = Math.pow(2, -e._settings.sizeZoomReferential)
		}
		var a = r._indexes;
		var u = t ? e._nodeVisibilityFilter : e._edgeVisibilityFilter;
		var l = u.getMultiple(a);
		var d = o.getMultiple(a);
		for (var f = 0, h = a.length; f < h; f++) {
			if (l[f] === 0) {
				d[f] *= s
			}
		}
		i.setMultiple(a, d)
	}
	function Uy(e, t) {
		var r = e._graph.getAttributes(true, ["x", "y", "geo.latitude", "geo.longitude"]);
		var n = r[0];
		var i = r[1];
		var o = r[2];
		var s = r[3];
		var a = new Array(2),
			u, l, d;
		var f = t._indexes;
		var h = [],
			c = [],
			p = [];
		for (var g = 0, v = f.length; g < v; g++) {
			d = f[g];
			u = o.get(d);
			l = s.get(d);
			if (l !== undefined && u !== undefined) {
				e_(n.get(d), i.get(d), a);
				p.push(d);
				h.push(a[0]);
				c.push(a[1])
			}
		}
		o.setMultiple(p, h);
		s.setMultiple(p, c)
	}
	function Xy(e, t, r, n) {
		Wy(e, true, t, r, n)
	}
	function jy(e, t, r, n) {
		Wy(e, false, t, r, n)
	}
	function Wy(e, t, r, n, i) {
		var o = e._graph;
		var s = o.getAttribute(t, n);
		var a = o.getAttribute(t, i);
		var u = r._indexes;
		a.setMultiple(u, s.getMultiple(u))
	}
	var Gy = 6378137;
	var Hy = 85.0511287798;
	var Yy = 256;
	var Vy = Math.PI / 180;
	var qy = 180 / Math.PI;
	var Zy = .5 / (Math.PI * Gy);
	var Qy = .5;
	var Jy = -Zy;
	var Ky = .5;

	function $y(e, t, r) {
		if (r === void 0) r = [];
		var n = Math.max(Math.min(Hy, e), -Hy),
			i = Math.sin(n * Vy);
		r[0] = Yy * (Zy * (Gy * t * Vy) + Qy);
		r[1] = Yy * (Jy * (Gy * Math.log((1 + i) / (1 - i)) / 2) + Ky);
		return r
	}
	function e_(e, t, r) {
		if (r === void 0) r = [];
		e = (e / Yy - Qy) / Zy;
		t = (t / Yy - Ky) / Jy;
		r[0] = (2 * Math.atan(Math.exp(t / Gy)) - Math.PI / 2) * qy;
		r[1] = e * qy / Gy;
		return r
	}
	function t_(e, t, r) {
		var n = 1 << r;
		e = e * Vy;
		return {
			x: n * ((t + 180) / 360),
			y: n * (1 - Math.log(Math.tan(e) + 1 / Math.cos(e)) / Math.PI) / 2
		}
	}
	function r_(e, t) {
		var r = e._settings.maxZoomLevel;
		if (typeof t !== "number" || !(t >= 0 && t <= r)) {
			throw new Error("invalid zoom value " + t + ": expected value between 0 and " + r)
		}
	}
	function n_(e, t) {
		if (typeof e !== "number") {
			throw new Error("invalid latitude " + e + ": expected number")
		}
		if (typeof t !== "number") {
			throw new Error("invalid longitude " + t + ": expected number")
		}
	}
	function i_(e) {
		return Math.pow(2, Math.floor(Math.log2(e)))
	}
	var o_ = function() {};
	var s_ = {
		strokeColor: "black",
		strokeWidth: 2,
		dashLength: 8,
		cursorStyle: "cell",
		createNodes: true,
		condition: null,
		onNodeCreated: o_,
		onEdgeCreated: o_,
		onComplete: o_
	};
	g.extend(function(e) {
		var t = new a_(e);
		e.modules.connectNodes = t;
		e.tools.connectNodes = {
			enable: function e(r) {
				t.enable(r);
				return this
			},
			disable: function e() {
				t.disable();
				return this
			},
			enabled: function e() {
				return t.enabled()
			}
		};
		e.events.onNodesConnected = function(t) {
			e.modules.events.on("connectedNodes", t);
			return e.events
		}
	});
	var a_ = function e(t) {
			var r = this;
			var n = t.modules;
			this._render = n.render;
			this._camera = n.camera;
			this._captor = n.captor;
			this._graph = n.graph;
			this._graphics = n.graphics;
			this._interactions = n.interactions;
			this._events = n.events;
			this._settings = n.settings;
			this._connectCondition = null;
			this._enabled = false;
			this._options = Ge(s_);
			this._canvas = kt();
			this._ctx = this._canvas.getContext("2d");
			this._render.addRenderLayer(this._canvas, "connectNodes", true);
			this._events.register(["connectedNodes"]);
			this._events.on("clear", function() {
				return r.disable()
			});
			this._line = null;
			this._interaction = this._interactions.onDrag({
				priority: "connectNodes",
				check: function(e) {
					var t = e.target;
					var n = e.button;
					return n === "left" && r._enabled && t && t.isNode
				},
				onStart: function(e) {
					return r._onStart(e)
				},
				onProgress: function(e) {
					return r._onProgress(e)
				},
				onStop: function(e) {
					return r._onStop(e)
				}
			})
		};
	a_.prototype.enable = function e(t) {
		this.disable();
		this._options = Ye(t, s_);
		this._enabled = true;
		this._prevSettings = this._settings.update({
			cursorOnNodeHover: this._options.cursorStyle,
			"detect.edges": false
		});
		if (this._captor.isLeftPressed()) {
			this._interaction.start(et(this._captor.getCursorInformation(), {
				button: "left"
			}))
		}
		return this
	};
	a_.prototype.disable = function e() {
		if (this._enabled) {
			this._enabled = false;
			this._settings.update(this._prevSettings)
		}
	};
	a_.prototype.enabled = function e() {
		return this._enabled
	};
	a_.prototype._onStart = function e(t) {
		var r = t.target;
		this._startNode = r;
		this._render.addCursorStyle(this._options.cursorStyle)
	};
	a_.prototype._onProgress = function e(t) {
		var r = t.x;
		var n = t.y;
		this._line = this._render.delete(this._line);
		this._line = u_(this, r, n, this._options.strokeColor, this._options.strokeWidth, this._options.dashLength)
	};
	a_.prototype._onStop = function e(t) {
		var r = t.x;
		var n = t.y;
		console.log("%%%")
		console.log(t)
		this._graphics.refreshAll();
		this._render.removeCursorStyle(this._options.cursorStyle);
		this._line = this._render.delete(this._line);
		var i = this._captor.getPointedElement(),
			o = false,
			s;
		var a = this._startNode;
		if (!i && this._options.createNodes) {
			var u = this._camera.screenToGraphCoordinates({
				x: r,
				y: n
			});
			i = this._graph.addNode({
				id: this._graph.generateUnusedNodeId(),
				attributes: {
					x: u.x,
					y: u.y
				}
			});
			o = true
		}
		var l = this._options;
		var d = l.onEdgeCreated;
		var f = l.onNodeCreated;
		var h = l.onComplete;
		if (i && i.isNode) {
			if (!this._connectCondition || this._connectCondition(a, i)) {
				var c = this._graph.addEdge({
					id: this._graph.generateUnusedEdgeId(),
					source: a.getId(),
					target: i.getId()
				});
				if (o && typeof f === "function") {
					f(i)
				}
				if (typeof d === "function") {
					d(c)
				}
				s = {
					source: a,
					target: i,
					edge: c
				}
			} else if (o) {
				s = {
					source: a,
					target: null,
					edge: null
				};
				this._graph.removeNodes(i)
			}
		} else {
			s = {
				source: a,
				target: null,
				edge: null
			}
		}
		this.disable();
		if (typeof h === "function") {
			h(s)
		}
	};

	function u_(e, t, r, n, i, o) {
		var s = [],
			a = new Or,
			u = new Or,
			l = e._startNode.getPosition(),
			d = e._camera.graphToScreenCoordinates(l),
			f = Pr(d.x, d.y, t, r, o),
			h = e._camera.screenToGraphVector(f),
			c = distance(d.x, d.y, t, r),
			p = 0;
		a.setXY(l.x, l.y);
		u.set(a).addXY(h.x, h.y);
		while (p < c) {
			s.push(e._render.line(-1, a, u, 0, i, n, "edgeShapes", Ei));
			a.addOXY(f.x * 2, f.y * 2);
			u.addOXY(f.x * 2, f.y * 2);
			p += o * 2
		}
		return e._render.composite(-1, s)
	}
	var l_ = ["color", "shape", "radius", "icon.content", "image.url"];
	var d_ = ["color", "shape", "width"];
	var f_ = Math.PI;
	var h_ = 2 * Math.PI;
	var c_ = 1.6;
	var p_ = 3;
	var g_ = .9;
	var v_ = {
		position: "bottom",
		widgetWidth: 130,
		fontFamily: "Arial",
		fontSize: 10,
		fontColor: "black",
		titleFontSize: 12,
		titleFontColor: "black",
		titleMaxLength: 20,
		titleTextAlign: "left",
		shapeColor: "grey",
		backgroundColor: "white",
		borderColor: "black",
		borderRadius: 0,
		borderWidth: 1,
		innerMargin: 10,
		outerMargin: 5,
		circleStrokeWidth: 3,
		titleFunction: function(e) {
			return e[e.length - 1]
		}
	};
	g.extend(function(e) {
		var t = new y_(e);
		e.modules.legend = t;
		e.tools.legend = {
			enable: function e(r) {
				t.enable(r)
			},
			disable: function e() {
				t.disable()
			},
			enabled: function e() {
				return t.enabled()
			}
		}
	});
	var y_ = function e(t) {
			var r = this;
			this._graphics = t.modules.graphics;
			this._render = t.modules.render;
			this._settings = Ge(v_);
			this._enabled = false;
			this._canvas = kt();
			this._timeout = null;
			this._widgets = null;
			this._refreshSync = function() {
				if (r._enabled) {
					__(r);
					m_(r, r._canvas)
				}
				r._timeout = null
			};
			this._refresh = function() {
				if (!r._timeout) {
					r._timeout = setTimeout(r._refreshSync, 0)
				}
			};
			t.modules.events.on({
				"resize reloadFonts": this._refresh,
				reset: function() {
					return r.disable()
				},
				resize: function() {
					if (r._enabled) {
						m_(r, r._canvas)
					}
				}
			})
		};
	y_.prototype.enable = function e(t) {
		this._enabled = true;
		this._userSettings = Ye(t, v_);
		this._setSettings();
		this._render.addRenderLayer(this._canvas, "legend", true);
		this._refresh()
	};
	y_.prototype._setSettings = function e() {
		var t = this;
		var r = Ut(),
			n = ["widgetWidth", "fontSize", "titleFontSize", "borderRadius", "borderWidth", "innerMargin", "outerMargin", "circleStrokeWidth"];
		this._settings = {};
		Object.keys(v_).forEach(function(e) {
			return t._settings[e] = t._userSettings[e]
		});
		n.forEach(function(e) {
			return t._settings[e] *= r
		})
	};
	y_.prototype.disable = function e() {
		if (this._enabled) {
			if (this._timeout) {
				clearTimeout(this._timeout);
				this._timeout = null
			}
			this._enabled = false;
			this._render.removeRenderLayer(this._canvas)
		}
	};
	y_.prototype.enabled = function e() {
		return this._enabled
	};
	y_.prototype.refresh = function e() {
		this._refresh()
	};
	y_.prototype.drawOnCanvas = function e(t) {
		__(this);
		m_(this, t)
	};

	function __(e) {
		e._widgets = [];
		l_.forEach(function(t) {
			return X_(e, true, t)
		});
		d_.forEach(function(t) {
			return X_(e, false, t)
		})
	}
	function m_(e, t) {
		e._setSettings();
		var r = {
			width: t.width,
			height: t.height
		},
			n = false,
			i = e._settings;
		if (!r.width || !r.height || !e._widgets) {
			return false
		}
		t.getContext("2d").clearRect(0, 0, t.width, t.height);
		if (i.position === "top" || i.position === "bottom") {
			n = U_(r, i, e._widgets, i.position === "bottom")
		} else {
			n = D_(r, i, e._widgets, i.position === "left")
		}
		if (n) {
			e._widgets.forEach(function(e) {
				return x_(i, t, e)
			})
		}
		return n
	}
	function x_(e, t, r) {
		var n = t.getContext("2d");
		var i = r.x;
		var o = r.y;
		var s = r.height;
		var a = r.isNode;
		var u = r.styleProperty;
		var l = r.title;
		var d = r.mapping;
		var f = r.iconFont;
		E_(n, e, i, o, s);
		I_(n, e, l, i, o);
		var h = e.fontSize * c_,
			c = e.fontSize / 2 * c_ * g_,
			p = e.fontSize * p_,
			g = e.fontSize,
			v = w_(e, a),
			y = o + Y_(e),
			_ = i + e.innerMargin + v / 2,
			m = i + e.innerMargin * 2 + v,
			x = He(d),
			b = q_(x),
			A = e.fontColor,
			w = e.shapeColor,
			E = Je(d);
		if (b) {
			E.sort(function(e, t) {
				return Math.min.apply(null, d[t]) - Math.min.apply(null, d[e])
			})
		}
		if (u !== "radius" && u !== "width") {
			E.forEach(function(t) {
				var r = d[t];
				if (u === "color") {
					if (a) {
						C_(n, _, y, c, t)
					} else {
						T_(n, _, y, p, g, t)
					}
				} else if (u === "shape") {
					if (a) {
						M_(n, _, y, c, t, w)
					} else {
						R_(n, _, y, p, g, t, w)
					}
				} else if (u === "icon.content") {
					L_(n, _, y, t, f, c, A)
				} else if (u === "image.url") {
					N_(n, _, y, c, t)
				}
				S_(n, e, m, y, r, b);
				y += h
			})
		} else if (b) {
			var I = Z_(x),
				S = Q_(x),
				C = (I + S) / 2;
			if (I % 2 === 0 || S % 2 === 0) {
				C = Math.round(C)
			}
			if (a) {
				var T = e.fontSize * .7,
					L = T * 3,
					N = (T + L) / 2,
					z = i + e.innerMargin + L,
					M = z + L + e.innerMargin,
					k = y + L * 2 - e.innerMargin * .5,
					R = e.circleStrokeWidth;
				b_(n, z, k - T, T, w, R);
				b_(n, z, k - N, N, w, R);
				b_(n, z, k - L, L, w, R);
				A_(n, e.fontFamily, e.fontSize, e.fontColor, "left");
				n.fillText(J_(I), M, k + T - T * 2);
				n.fillText(J_(C), M, k + T - N * 2);
				n.fillText(J_(S), M, k + T - L * 2)
			} else {
				var F = (e.widgetWidth - 2 * e.innerMargin) / 3,
					P = e.fontSize,
					D = y - e.innerMargin / 2,
					O = D + P * 2,
					B = i + e.innerMargin;
				n.fillStyle = w;
				n.fillRect(B, D - P / 2, F + 1, P);
				n.fillRect(B + F, D - P / 3, F + 1, P / 1.5);
				n.fillRect(B + F * 2, D - P / 6, F, P / 3);
				A_(n, e.fontFamily, e.fontSize, e.fontColor, "center");
				n.fillText(J_(S), B + F * .5, O);
				n.fillText(J_(C), B + F * 1.5, O);
				n.fillText(J_(I), B + F * 2.5, O)
			}
		}
	}
	function b_(e, t, r, n, i, o) {
		e.beginPath();
		e.arc(t, r, n, 0, h_);
		e.strokeStyle = i;
		e.lineWidth = o;
		e.stroke()
	}
	function A_(e, t, r, n, i, o) {
		if (i === void 0) i = "left";
		if (o === void 0) o = "middle";
		e.textAlign = i;
		e.textBaseline = o;
		e.fillStyle = n;
		e.font = r + "px " + t
	}
	function w_(e, t) {
		return t ? e.fontSize : e.fontSize * p_
	}
	function E_(e, t, r, n, i) {
		F_(e, r, n, t.widgetWidth, i, t.borderRadius, t.backgroundColor, t.borderColor, t.borderWidth)
	}
	function I_(e, t, r, n, i) {
		A_(e, t.fontFamily, t.titleFontSize, t.titleFontColor, t.titleTextAlign);
		var o = t.titleTextAlign === "center",
			s = t.widgetWidth - t.innerMargin * 2,
			a = e.measureText(r).width,
			u = n + (o ? t.widgetWidth / 2 : t.innerMargin),
			l = i + t.titleFontSize / 2 + t.innerMargin;
		if (a > s) {
			var d = s / a,
				f = (r.length * d | 0) - 2;
			r = r.substr(0, f) + "…"
		}
		e.fillText(r, u, l)
	}
	function S_(e, t, r, n, i, o) {
		var s;
		if (o) {
			if (i.length === 1) {
				s = J_(i[0])
			} else {
				var a = Math.min.apply(Math, i),
					u = Math.max.apply(Math, i);
				s = J_(a) + " - " + J_(u)
			}
		} else {
			s = i.join()
		}
		A_(e, t.fontFamily, t.fontSize, t.fontColor);
		e.fillText(s, r, n)
	}
	function C_(e, t, r, n, i) {
		e.beginPath();
		e.arc(t, r, n, 0, 2 * f_);
		e.fillStyle = i;
		e.fill()
	}
	function T_(e, t, r, n, i, o) {
		e.fillStyle = o;
		e.fillRect(t - n / 2, r - i / 2, n, i)
	}
	function L_(e, t, r, n, i, o, s) {
		A_(e, i, o * 2, s, "center");
		e.fillText(n, t, r)
	}
	function N_(e, t, r, n, i) {
		if (!e._imgStore) {
			e._imgStore = {}
		}
		var o = e._imgStore[i];
		if (!o) {
			o = new Image;
			o.src = i;
			o.onload = function() {
				e.drawImage(o, t - n, r - n, n * 2, n * 2)
			};
			e._imgStore[i] = o
		} else {
			e.drawImage(o, t - n, r - n, n * 2, n * 2)
		}
	}
	var z_ = .31;

	function M_(e, t, r, n, i, o) {
		e.fillStyle = o;
		if (i === "circle") {
			C_(e, t, r, n, o)
		} else if (i === "square") {
			e.fillRect(t - n, r - n, n * 2, n * 2)
		} else if (i === "cross") {
			e.fillRect(t - n, r - n * z_, n * 2, n * 2 * z_);
			e.fillRect(t - n * z_, r - n, n * 2 * z_, n * 2)
		} else if (i === "diamond") {
			e.beginPath();
			e.moveTo(t - n, r);
			e.lineTo(t, r - n);
			e.lineTo(t + n, r);
			e.lineTo(t, r + n);
			e.fill()
		} else if (i === "equilateral") {
			e.beginPath();
			e.moveTo(t, r - n);
			e.lineTo(t + Math.cos(f_ / 2 - h_ / 5) * n, r + Math.sin(-f_ / 2 + h_ / 5) * n);
			e.lineTo(t + Math.cos(f_ / 2 - h_ / 5 * 2) * n, r + Math.sin(-f_ / 2 + h_ / 5 * 2) * n);
			e.lineTo(t + Math.cos(f_ / 2 - h_ / 5 * 3) * n, r + Math.sin(-f_ / 2 + h_ / 5 * 3) * n);
			e.lineTo(t + Math.cos(f_ / 2 - h_ / 5 * 4) * n, r + Math.sin(-f_ / 2 + h_ / 5 * 4) * n);
			e.fill()
		} else if (i === "star") {
			e.beginPath();
			e.moveTo(t, r - n);
			e.lineTo(t + Math.cos(f_ / 2 - h_ / 5 * 2) * n, r + Math.sin(-f_ / 2 + h_ / 5 * 2) * n);
			e.lineTo(t + Math.cos(f_ / 2 - h_ / 5 * 4) * n, r + Math.sin(-f_ / 2 + h_ / 5 * 4) * n);
			e.lineTo(t + Math.cos(f_ / 2 - h_ / 5) * n, r + Math.sin(-f_ / 2 + h_ / 5) * n);
			e.lineTo(t + Math.cos(f_ / 2 - h_ / 5 * 3) * n, r + Math.sin(-f_ / 2 + h_ / 5 * 3) * n);
			e.fill()
		}
	}
	var k_ = 1 / 3;

	function R_(e, t, r, n, i, o, s) {
		e.fillStyle = s;
		if (o === "line") {
			e.fillRect(t - n / 2, r - i / 4, n, i / 2)
		} else if (o === "arrow") {
			e.fillRect(t - n / 2, r - i / 4, n * (1 - k_), i / 2);
			e.beginPath();
			e.moveTo(t + n * (1 - k_ - .5), r - i / 2);
			e.lineTo(t + n * (1 - k_ - .5), r + i / 2);
			e.lineTo(t + n / 2, r);
			e.fill()
		} else if (o === "dashed" || o === "dotted") {
			e.beginPath();
			e.moveTo(t - n / 2, r);
			e.lineTo(t + n / 2, r);
			e.strokeStyle = s;
			e.lineWidth = i / 2;
			e.setLineDash(o === "dashed" ? [8, 3] : [3, 3]);
			e.stroke()
		} else if (o === "tapered") {
			e.beginPath();
			e.moveTo(t - n / 2, r - i / 2);
			e.lineTo(t - n / 2, r + i / 2);
			e.lineTo(t + n / 2, r);
			e.fill()
		}
	}
	function F_(e, t, r, n, i, o, s, a, u) {
		e.setLineDash([]);
		e.beginPath();
		e.moveTo(t + o, r);
		e.lineTo(t + n - o, r);
		e.quadraticCurveTo(t + n, r, t + n, r + o);
		e.lineTo(t + n, r + i - o);
		e.quadraticCurveTo(t + n, r + i, t + n - o, r + i);
		e.lineTo(t + o, r + i);
		e.quadraticCurveTo(t, r + i, t, r + i - o);
		e.lineTo(t, r + o);
		e.quadraticCurveTo(t, r, t + o, r);
		e.closePath();
		e.fillStyle = s;
		e.fill();
		e.strokeStyle = a;
		e.lineWidth = u;
		e.stroke()
	}
	function P_(e, t) {
		if (e.isNode !== t.isNode) {
			return e.isNode ? e : t
		} else {
			return e.title <= t.title ? -1 : 1
		}
	}
	function D_(e, t, r, n) {
		var i = t.widgetWidth + t.outerMargin,
			o = Math.floor((e.width - t.outerMargin) / i),
			s = e.height,
			a = t.outerMargin,
			u = n ? t.outerMargin : e.width - i,
			l = 1;
		r = r.slice().sort(P_);
		for (var d = 0; d < r.length; ++d) {
			var f = r[d];
			if (a + f.height > s) {
				if (a === t.outerMargin) {
					return false
				} else {
					a = t.outerMargin;
					l += 1;
					if (n) {
						u += i
					} else {
						u -= i
					}
				}
			}
			f.x = u;
			f.y = a;
			a += f.height
		}
		return l <= o
	}
	function O_(e, t, r) {
		var n = null;
		for (var i = 0; i < t.length; ++i) {
			var o = t[i];
			if ((o.isNode === e.isNode || t.length === 1) && (n === null || o.height < t[n].height)) {
				n = i
			}
		}
		o = t[n];
		o.content.push(e);
		o.height += e.height + r.outerMargin
	}
	function B_(e) {
		var t = 0;
		for (var r = 1; r < e.length; ++r) {
			if (e[r].height > e[t].height) {
				t = r
			}
		}
		return t
	}
	function U_(e, t, r, n) {
		r = r.slice();
		var i = t.widgetWidth + t.outerMargin,
			o = Math.floor((e.width - t.outerMargin) / i),
			s = e.height - t.outerMargin,
			a = new Array(Math.min(o, r.length)),
			u = r.length,
			l = 0,
			d = 0,
			f = 0,
			h = 0;
		for (var c = 0; c < u; ++c) {
			var p = r[c];
			if (p.isNode) {
				l += 1;
				d += p.height
			} else {
				f += 1;
				h += p.height
			}
		}
		var g = d + h,
			v = d / g,
			y = h / g,
			_ = Math.round(v * o),
			m = Math.round(y * o);
		if (_ > l) {
			_ = l
		} else if (m > f) {
			_ = o - f
		}
		if (o === 0) {
			return false
		}
		for (var x = 0; x < a.length; ++x) {
			a[x] = {
				content: [],
				height: 0,
				isNode: x < _
			}
		}
		for (x = 0; x < u; ++x) {
			var b = B_(r);
			O_(r[b], a, t);
			r.splice(b, 1)
		}
		if (a.every(function(e) {
			var t = e.content;
			return t.length === 1
		})) {
			a.sort(H_)
		} else {
			a.sort(G_)
		}
		var A = t.outerMargin;
		for (x = 0; x < a.length; ++x) {
			var w = a[x];
			if (w.height > s) {
				return false
			}
			w.content.sort(W_);
			var E = 0;
			for (var I = 0; I < w.content.length; ++I) {
				var S = w.content[I];
				S.x = A;
				S.y = n ? e.height - E - S.height - t.outerMargin : E + t.outerMargin;
				E += S.height + t.outerMargin
			}
			A += i
		}
		return true
	}
	function X_(e, t, r) {
		var n = j_(e, t, r);
		if (n) {
			if (r === "icon.content") {
				var i = e._graphics._getAttributeRuleList(t, "icon.font"),
					o = null;
				if (!i.length) {
					o = "Arial"
				} else {
					var s = i[0].metaData;
					if (s) {
						o = s.constant
					}
				}
				if (o) {
					n.iconFont = o;
					e._widgets.push(n)
				}
			} else {
				e._widgets.push(n)
			}
		}
	}
	function j_(e, t, r) {
		var n = e._graphics._getAttributeRuleList(t, r),
			i = n[0] && n[0].metaData;
		if (n[0] && !i) {
			De('legend (property "' + r + '"): it seems you are using a rule that was not generated by `ogma.rules.map()` or `ogma.rules.slices()`; no information can be extracted from that rule.')
		}
		if (i && i.mapping && i.field) {
			var o = {};
			Xe(i.mapping, function(e, t) {
				if (e === undefined) {
					return
				}
				if (e in o) {
					o[e].push(t)
				} else {
					o[e] = [t]
				}
			});
			if (Object.keys(o).length === 0) {
				return null
			}
			return {
				isNode: t,
				title: e._settings.titleFunction(i.field),
				styleProperty: r,
				dataProperty: i.field,
				mapping: o,
				height: V_(e, o, r, t)
			}
		} else {
			return null
		}
	}
	function W_(e, t) {
		return e.height - t.height
	}
	function G_(e, t) {
		if (e.isNode !== t.isNode) {
			return e.isNode ? e : t
		} else {
			return t.height - e.height
		}
	}
	function H_(e, t) {
		if (e.isNode !== t.isNode) {
			return e.isNode ? e : t
		} else {
			return e.content[0].title <= t.content[0].title ? -1 : 1
		}
	}
	function Y_(e) {
		return e.innerMargin + (e.titleFontSize + e.fontSize) * c_
	}
	function V_(e, t, r, n) {
		var i = e._settings,
			o = i.outerMargin + Y_(i),
			s = i.fontSize * c_,
			a = o - i.innerMargin * .8;
		if (r !== "radius" && r !== "width") {
			a += Object.keys(t).length * s
		} else {
			a += s * (n ? 3 : 2)
		}
		return a
	}
	function q_(e) {
		if (Ke(e)) {
			return e.reduce(function(e, t) {
				return e && q_(t)
			}, true)
		} else {
			return e === "undefined" || !isNaN(+e)
		}
	}
	function Z_(e) {
		if (Ke(e)) {
			return e.reduce(function(e, t) {
				return Math.min(e, Z_(t))
			}, Infinity)
		} else {
			return isNaN(e) ? Infinity : +e
		}
	}
	function Q_(e) {
		if (Ke(e)) {
			return e.reduce(function(e, t) {
				return Math.max(e, Q_(t))
			}, -Infinity)
		} else {
			return isNaN(e) ? -Infinity : +e
		}
	}
	function J_(e, t) {
		e = +e;
		var r = ["K", "M", "G", "T", "P", "E", "Z", "Y"];
		if (e > 9999) {
			var n = 0;
			while (n < r.length && e > 999) {
				e /= 1e3;
				++n
			}
			return K_(e) + r[n - 1]
		} else if (t) {
			return Math.round(e).toString()
		} else if (e < 10) {
			return (Math.round(e * 1e3) / 1e3).toString()
		} else if (e < 100) {
			return (Math.round(e * 100) / 100).toString()
		} else if (e < 1e3) {
			return (Math.round(e * 10) / 10).toString()
		} else {
			return Math.round(e).toString()
		}
	}
	function K_(e) {
		if (e < 10) {
			return Math.round(e * 100) / 100
		} else if (e < 100) {
			return Math.round(e * 10) / 10
		} else if (e < 1e3) {
			return Math.round(e)
		}
	}
	var $_ = {
		strokeColor: "#00C3FF",
		fillColor: "rgba(0,195,255,0.1)",
		strokeWidth: 1,
		cursorStyle: "cell",
		callback: function(e) {
			var t = e.nodes;
			t.setSelected(true)
		}
	};
	g.extend(function(e) {
		var t = new em(e);
		e.modules.lasso = t;
		e.tools.lasso = {
			enable: function(e) {
				return t.enable(e)
			},
			disable: function() {
				return t.disable()
			},
			enabled: function() {
				return t.enabled()
			}
		}
	});
	var em = function e(t) {
			var r = this;
			this._ogma = t;
			this._graph = t.modules.graph;
			this._selection = t.modules.selection;
			this._captor = t.modules.captor;
			this._keyboard = t.modules.keyboard;
			this._graphics = t.modules.graphics;
			this._camera = t.modules.camera;
			this._render = t.modules.render;
			this._interactions = t.modules.interactions;
			this._options = Ge($_);
			this._enabled = false;
			this._active = false;
			this._points = [];
			this._addToSelection = false;
			this._canvas = this._render.addCanvasLayer("lasso");
			this._ctx = this._canvas.getContext("2d");
			this._interaction = this._interactions.onDrag({
				priority: "lasso",
				check: function() {
					return r._enabled
				},
				onStart: function(e) {
					var t = e.x;
					var n = e.y;
					return rm(r, t, n, false)
				},
				onProgress: function(e) {
					var t = e.x;
					var n = e.y;
					return rm(r, t, n, true)
				},
				onStop: function() {
					var e = r._ogma.getNodes().filter(function(e) {
						return tm(e.getPositionOnScreen(), r._points)
					});
					r._ctx.clearRect(0, 0, r._canvas.width, r._canvas.height);
					r._points = [];
					r.disable();
					r._options.callback({
						nodes: e
					})
				}
			})
		};
	em.prototype.enable = function e(t) {
		if (this._enabled) {
			this.disable()
		}
		this._enabled = true;
		this._prevDetect = this._captor.setDetectionEnabled(false);
		this._options = Ye(t, $_);
		this._render.addCursorStyle(this._options.cursorStyle);
		if (this._captor.isLeftPressed()) {
			this._interaction.start(this._captor.getCursorPosition())
		}
	};
	em.prototype.disable = function e() {
		if (this._enabled) {
			this._enabled = false;
			this._captor.setDetectionEnabled(this._prevDetect);
			this._render.removeCursorStyle(this._options.cursorStyle)
		}
	};
	em.prototype.enabled = function e() {
		return this._enabled
	};

	function tm(e, t) {
		return Pn(e.x, e.y, t)
	}
	function rm(e, t, r, n) {
		var i = Ut();
		e._ctx.clearRect(0, 0, e._canvas.width, e._canvas.height);
		e._points.push({
			x: t,
			y: r
		});
		if (n) {
			var o = e._points[0];
			e._ctx.lineWidth = e._options.strokeWidth;
			e._ctx.lineJoin = "round";
			e._ctx.strokeStyle = e._options.strokeColor;
			e._ctx.fillStyle = e._options.fillColor;
			e._ctx.beginPath();
			e._ctx.moveTo(o.x * i, o.y * i);
			for (var s = 1; s < e._points.length; ++s) {
				var a = e._points[s];
				e._ctx.lineTo(a.x * i, a.y * i)
			}
			e._ctx.stroke();
			if (e._options.fillColor) {
				e._ctx.fill()
			}
		}
	}
	var nm = {
		strokeColor: "#00C3FF",
		fillColor: "rgba(0,195,255,0.1)",
		strokeWidth: 1,
		cursorStyle: "cell",
		callback: function(e) {
			var t = e.nodes;
			var r = e.edges;
			t.setSelected(true);
			r.setSelected(true)
		}
	};
	g.extend(function(e) {
		var t = new im(e);
		e.modules.rectangleSelect = t;
		e.tools.rectangleSelect = {
			enable: function(e) {
				return t.enable(e)
			},
			disable: function() {
				return t.disable()
			},
			enabled: function() {
				return t.enabled()
			}
		}
	});
	var im = function e(t) {
			var r = this;
			this._ogma = t;
			this._graph = t.modules.graph;
			this._selection = t.modules.selection;
			this._camera = t.modules.camera;
			this._render = t.modules.render;
			this._interactions = t.modules.interactions;
			this._keyboard = t.modules.keyboard;
			this._spatial = t.modules.spatial;
			this._captor = t.modules.captor;
			this._options = Ge(nm);
			this._canvas = kt();
			this._ctx = this._canvas.getContext("2d");
			this._render.addRenderLayer(this._canvas, "lasso", true);
			this._enabled = false;
			this._start = null;
			this._interaction = this._interactions.onDrag({
				priority: "lasso",
				disableDetection: true,
				check: function() {
					return r._enabled
				},
				onStart: function(e) {
					var t = e.x;
					var n = e.y;
					r._start = {
						x: t,
						y: n
					};
					r._ctx.fillStyle = r._options.fillColor;
					r._ctx.strokeStyle = r._options.strokeColor;
					r._ctx.lineWidth = r._options.strokeWidth
				},
				onProgress: function(e) {
					var t = e.x;
					var n = e.y;
					return dm(r, {
						x: t,
						y: n
					})
				},
				onStop: function(e) {
					var n = e.x;
					var i = e.y;
					var o = lm(r, {
						x: n,
						y: i
					}),
						s = r._ogma.getNodes().filter(function(e) {
							return om(e.getPositionOnScreen(), o)
						}),
						a = s.size ? new t.EdgeList : t.getEdges().filter(function(e) {
							return am(r, e, o)
						});
					um(r);
					r.disable();
					r._options.callback({
						nodes: s,
						edges: a
					})
				}
			})
		};
	im.prototype.enable = function e(t) {
		if (this._enabled) {
			this.disable()
		}
		this._enabled = true;
		this._options = Ye(t, nm);
		this._render.addCursorStyle(this._options.cursorStyle);
		if (this._captor.isLeftPressed()) {
			this._interaction.start(this._captor.getCursorPosition())
		}
	};
	im.prototype.disable = function e() {
		if (this._enabled) {
			this._enabled = false;
			this._render.removeCursorStyle(this._options.cursorStyle)
		}
	};
	im.prototype.enabled = function e() {
		return this._enabled
	};

	function om(e, t) {
		return e.x >= t.x1 && e.x <= t.x2 && e.y >= t.y1 && e.y <= t.y2
	}
	function sm(e, t, r) {
		var n = e.x < r.x1,
			i = e.x > r.x2,
			o = e.y < r.y1,
			s = e.y > r.y2,
			a = t.x < r.x1,
			u = t.x > r.x2,
			l = t.y < r.y1,
			d = t.y > r.y2;
		if (n && a || i && u || s && d || o && l) {
			return false
		}
		if (!n && !i && !o && !s || !a && !u && !l && !d) {
			return true
		}
		return br(e, t, {
			x: r.x1,
			y: r.y1
		}, {
			x: r.x1,
			y: r.y2
		}) || br(e, t, {
			x: r.x2,
			y: r.y2
		}, {
			x: r.x1,
			y: r.y2
		}) || br(e, t, {
			x: r.x1,
			y: r.y1
		}, {
			x: r.x2,
			y: r.y1
		}) || br(e, t, {
			x: r.x2,
			y: r.y2
		}, {
			x: r.x2,
			y: r.y1
		})
	}
	function am(e, t, r) {
		var n = e._spatial.getPointsForEdge(t, true);
		for (var i = 0; i < n.length - 1; ++i) {
			if (sm(n[i], n[i + 1], r)) {
				return true
			}
		}
		return false
	}
	function um(e) {
		e._ctx.clearRect(0, 0, e._canvas.width, e._canvas.height)
	}
	function lm(e, t) {
		var r = e._start.x,
			n = e._start.y,
			i = t.x,
			o = t.y,
			s = Math.abs(r - i),
			a = Math.abs(n - o),
			u = r < i ? r : i,
			l = n < o ? n : o;
		return {
			x1: u,
			y1: l,
			x2: u + s,
			y2: l + a,
			p1: {
				x: u,
				y: l
			},
			p2: {
				x: u + s,
				y: l + a
			},
			width: s,
			height: a
		}
	}
	function dm(e, t) {
		var r = lm(e, t);
		var n = r.x1;
		var i = r.y1;
		var o = r.width;
		var s = r.height;
		var a = Ut();
		um(e);
		e._ctx.strokeRect(n * a, i * a, o * a, s * a);
		if (e._options.fillColor) {
			e._ctx.fillRect(n * a, i * a, o * a, s * a)
		}
	}
	var fm = {
		cursor: "nesw-resize",
		color: "#00C3FF",
		lineWidth: 1,
		handleSize: 6,
		detectionMargin: 5,
		snappingRatio: 1.25,
		nbNodesToSnapTo: 5,
		previewColor: "rgba(0, 0, 0, 0.2)",
		sizeIndicatorColor: "black",
		sizeIndicatorOffset: 5,
		sizeIndicatorWidth: 3,
		sizeIndicatorThickness: 1
	};
	g.extend(function(e) {
		var t = new hm(e);
		e.modules.resizing = t;
		e.tools.resize = {
			enable: function e(r) {
				return t.enable(r)
			},
			disable: function e() {
				return t.disable()
			},
			enabled: function e() {
				return t.enabled()
			}
		}
	});
	var hm = function e(t) {
			var r = this;
			this._render = t.modules.render;
			this._interactions = t.modules.interactions;
			this._events = t.modules.events;
			this._camera = t.modules.camera;
			this._render = t.modules.render;
			this._spatial = t.modules.spatial;
			this._graphics = t.modules.graphics;
			this._init();
			this._interactions.onDrag({
				priority: "resizing",
				disableDetection: true,
				check: function() {
					return r._enabled && r._pointedNode
				},
				onStart: function(e) {
					var t = e.x;
					var n = e.y;
					r._x = t;
					r._y = n;
					r._nodeBeingResized = r._pointedNode
				},
				onProgress: function(e) {
					var t = e.x;
					var n = e.y;
					r._x = t;
					r._y = n;
					r._displayHandles()
				},
				onStop: function() {
					r._nodesToHighlight.forEach(function(e, t) {
						var n = r._additionalRadiuses[t] / r._camera.zoom;
						e.setAttributes({
							radius: e.getAttribute("radius") + n,
							x: e.getPosition().x + n,
							y: e.getPosition().y - n
						})
					});
					r._pointedNode = null;
					r._nodeBeingResized = null;
					r._displayHandles()
				}
			});
			this._onSelectionChange = function() {
				if (!r._enabled) {
					return
				}
				r._nodesToHighlight = t.getSelectedNodes();
				r._displayHandles()
			};
			this._events.on({
				"cameraMove progressMoveNodesByDragging": function() {
					return r._displayHandles()
				},
				"move down": function(e) {
					var t = e.x;
					var n = e.y;
					return r._detectBoundingBoxes(t, n)
				}
			});
			t.events.onNodesSelected(this._onSelectionChange);
			t.events.onNodesUnselected(this._onSelectionChange)
		};
	hm.prototype._init = function e() {
		this._enabled = false;
		this._canvas = null;
		this._nodesToHighlight = null;
		this._options = null;
		this._nodeBeingResized = null;
		this._pointedNode = null;
		this._cursorEnabled = false;
		this._x = 0;
		this._y = 0;
		this._additionalRadiuses = [];
		this._previewComponent = []
	};
	hm.prototype._enableCursor = function e() {
		if (!this._cursorEnabled) {
			this._render.addCursorStyle(this._options.cursor);
			this._cursorEnabled = true
		}
	};
	hm.prototype._disableCursor = function e() {
		if (this._cursorEnabled) {
			this._render.removeCursorStyle(this._options.cursor);
			this._cursorEnabled = false
		}
	};
	hm.prototype._detectBoundingBoxes = function e(t, r) {
		var n = this;
		if (!this._enabled || this._nodeBeingResized || !this._nodesToHighlight) {
			return
		}
		var i = this._options.handleSize,
			o = this._options.detectionMargin;
		this._pointedNode = null;
		this._forEachNodeToHighlight(function(e, s, a) {
			var u = s.x + a - i / 2 - o,
				l = s.x + a + i / 2 + o,
				d = s.y - a - i / 2 - o,
				f = s.y - a + i / 2 + o;
			if (t >= u && t <= l && r >= d && r <= f) {
				n._pointedNode = e
			}
		});
		if (this._pointedNode) {
			this._enableCursor()
		} else {
			this._disableCursor()
		}
	};
	hm.prototype._forEachNodeToHighlight = function e(t) {
		var r = this;
		this._nodesToHighlight.forEach(function(e) {
			var n = e.getPositionOnScreen(),
				i = r._getTotalOnScreenRadius(e);
			t(e, n, i)
		})
	};
	hm.prototype._displayHandles = function e() {
		var t = this;
		if (!this._enabled || !this._nodesToHighlight) {
			return
		}
		var r = this._canvas,
			n = r.getContext("2d"),
			i = r.width,
			o = r.height,
			s = Ut(),
			a = this._camera.zoom;
		var u = this._options;
		var l = u.color;
		var d = u.lineWidth;
		var f = u.handleSize;
		var h = 0;
		n.clearRect(0, 0, i, o);
		n.strokeStyle = l;
		n.fillStyle = l;
		n.lineWidth = d;
		this._previewComponent.forEach(function(e) {
			return t._render.delete(e)
		});
		this._previewComponent = [];
		if (this._nodeBeingResized) {
			var c = this._getTotalOnScreenRadius(this._nodeBeingResized),
				p = this._nodeBeingResized.getPositionOnScreen();
			h = Math.max(this._x - (p.x + c), -(this._y - (p.y - c))) / 2
		}
		this._additionalRadiuses = [];
		this._forEachNodeToHighlight(function(e, r, i) {
			var o = 0;
			if (t._nodeBeingResized) {
				o = h;
				var u = -i + e.getAttribute("innerStroke.width") + e.getAttribute("outerStroke.width") + d / 2 + 1;
				if (o < u) {
					o = u
				} else {
					o = t._snap(e, o)
				}
				t._additionalRadiuses.push(o);
				var l = t._graphics.getNodeShape(e.getAttribute("shape")),
					c = r.x + o,
					p = r.y - o,
					g = (i + o) / a,
					v = t._options.previewColor,
					y = t._camera.screenToGraphCoordinates({
						x: c,
						y: p
					});
				t._previewComponent.push(l.draw(t._render, -1, y.x, y.y, g, 0, v, "nodeShapes"))
			}
			n.strokeRect((r.x - i) * s, (r.y - i - o * 2) * s, (o + i) * 2 * s, (o + i) * 2 * s);
			n.fillRect((r.x + i + o * 2 - f / 2) * s, (r.y - i - o * 2 - f / 2) * s, f * s, f * s)
		})
	};
	hm.prototype._getTotalOnScreenRadius = function e(t) {
		return t.getAttribute("radius") * this._camera.zoom + t.getAttribute("innerStroke.width") + t.getAttribute("outerStroke.width") + this._options.lineWidth / 2
	};
	hm.prototype._snap = function e(t, r) {
		var n = this;
		var i = this._spatial.getNodesInScreenByDistance(t).filter(function(e) {
			return !e.isSelected()
		}).slice(0, this._options.nbNodesToSnapTo),
			o = this._canvas.getContext("2d"),
			s = this._getTotalOnScreenRadius(t),
			a = s + r,
			u = this._options.snappingRatio,
			l = a / s,
			d = Math.round(cm(l, u)),
			f = Math.pow(u, d),
			h = s * f,
			c = null;
		i.forEach(function(e) {
			var t = n._getTotalOnScreenRadius(e);
			if (Math.abs(t - a) <= Math.abs(h - a)) {
				h = t;
				c = e
			}
		});
		if (c) {
			o.save();
			o.strokeStyle = this._options.sizeIndicatorColor;
			o.lineWidth = this._options.sizeIndicatorThickness;
			var p = c.getAttribute("radius");
			this._displaySizeIndicator(t, h);
			i.filter(function(e) {
				return e.getAttribute("radius") === p
			}).forEach(function(e) {
				return n._displaySizeIndicator(e)
			});
			o.restore()
		}
		return h - s
	};
	hm.prototype._displaySizeIndicator = function e(t, r) {
		var n = this._canvas.getContext("2d"),
			i = Ut(),
			o = t.getPositionOnScreen(),
			s = this._getTotalOnScreenRadius(t),
			a = r || s,
			u = r ? r - s : 0,
			l = u - this._options.sizeIndicatorOffset - (r ? t.getAttribute("innerStroke.width") + t.getAttribute("outerStroke.width") : 0),
			d = o.x - a + l | 0,
			f = o.y - a - u | 0,
			h = o.y + a - u | 0,
			c = this._options.sizeIndicatorWidth;
		n.beginPath();
		n.moveTo((d - c) * i, f * i);
		n.lineTo((d + c) * i, f * i);
		n.moveTo(d * i, f * i);
		n.lineTo(d * i, h * i);
		n.moveTo((d - c) * i, h * i);
		n.lineTo((d + c) * i, h * i);
		n.stroke()
	};
	hm.prototype.enable = function e(t) {
		if (this._enabled) {
			this.disable()
		}
		this._options = Ye(t, fm);
		this._canvas = this._render.addCanvasLayer("resizing");
		this._enabled = true
	};
	hm.prototype.disable = function e() {
		if (this._enabled) {
			this._render.removeRenderLayer(this._canvas);
			this._disableCursor();
			this._init()
		}
	};
	hm.prototype.enabled = function e() {
		return this._enabled
	};

	function cm(e, t) {
		return Math.log(e) / Math.log(t)
	}
	g.extend(function(e) {
		var t = new gm(e);
		e.modules.rewiring = t;
		e.tools.rewire = {
			enable: function e(r) {
				return t.enable(r)
			},
			disable: function e() {
				return t.disable()
			},
			enabled: function e() {
				return t.enabled()
			}
		}
	});
	var pm = {
		color: "#00C3FF",
		radius: 7,
		cursorOnHover: "grab",
		cursorOnDrag: "grabbing"
	};
	var gm = function e(t) {
			var r = this;
			this._ogma = t;
			this._render = t.modules.render;
			this._captor = t.modules.captor;
			this._mouse = t.modules.mouse;
			this._graph = t.modules.graph;
			this._camera = t.modules.camera;
			this._graphics = t.modules.graphics;
			this._selection = t.modules.selection;
			this._events = t.modules.events;
			this._settings = t.modules.settings;
			this._interactions = t.modules.interactions;
			this._classes = t.modules.classes;
			this._classes.create("__rewirable", {
				after: "hoverExtremityHighlighted"
			});
			this._enabled = false;
			this._filter = this._graph._addFilter(false);
			this._canvas = null;
			this._nodesToHighlight = null;
			this._movedEdges = null;
			this._startNode = null;
			this._components = null;
			this._cursorActive = false;
			this._prevSettings = null;
			this._curvatureList = this._graph.getEdgeAttribute("curvature");
			this._nodeDepthList = this._graph.getNodeAttribute("depth");
			this._interactions.onDrag({
				priority: "rewiring",
				check: function(e) {
					var t = e.x;
					var n = e.y;
					var i = e.target;
					if (!r._enabled || !i || !i.isNode || !wm(r, i, t, n)) {
						return false
					}
					var o = i.getAdjacentEdges().filter(function(e) {
						return e.isSelected()
					});
					if (o.size) {
						r._movedEdges = o;
						r._startNode = i;
						return true
					} else {
						return false
					}
				},
				onStart: function() {
					r._nodesToHighlight = r._nodesToHighlight.filter(function(e) {
						return e !== r._startNode
					});
					r._edgeColors = r._movedEdges.getAttribute("color");
					Am(r, true);
					var e = r._options.cursorOnDrag;
					r._prevSettings = r._settings.update({
						edgeHover: false,
						cursor: {
						default:
							e, node: e,
							edge: e
						}
					})
				},
				onProgress: function(e) {
					var t = e.x;
					var n = e.y;
					mm(r, t, n)
				},
				onStop: function() {
					vm(r);
					var e = bm(r);
					xm(r);
					if (e) {
						r._movedEdges.forEach(function(t) {
							if (t.getTarget() === r._startNode) {
								t.setTarget(e)
							} else {
								t.setSource(e)
							}
						})
					}
					Am(r, false);
					r._movedEdges.setSelected(true);
					r._movedEdges = false;
					r._refreshHandles(r)
				}
			});
			this._refreshHandles = function() {
				if (!r._enabled || r._movedEdges) {
					return
				}
				var e = r._ogma.getSelectedEdges();
				r._nodesToHighlight = e.getExtremities().dedupe();
				r._classes.clearEdges("__rewirable");
				e.addClass("__rewirable");
				Im(r)
			};
			this._displayHandles = function() {
				return Im(r)
			};
			this._events.on({
				cameraMove: this._displayHandles,
				mouseMove: this._displayHandles,
				progressMoveNodesByDragging: this._displayHandles
			});
			t.events.onEdgesSelected(this._refreshHandles);
			t.events.onEdgesUnselected(this._refreshHandles)
		};
	gm.prototype.enable = function e(t) {
		if (this._enabled) {
			this.disable()
		}
		this._options = Ye(t, pm);
		this._canvas = this._render.addCanvasLayer("rewiring");
		this._enabled = true;
		this._refreshHandles()
	};
	gm.prototype.disable = function e() {
		if (this._enabled) {
			this._enabled = false;
			ym(this);
			vm(this);
			this._render.removeCursorStyle(this._options.cursorOnDrag);
			this._render.removeRenderLayer(this._canvas);
			this._canvas = null;
			this._classes.clearEdges("__rewirable")
		}
	};
	gm.prototype.enabled = function e() {
		return this._enabled
	};

	function vm(e) {
		if (e._prevSettings) {
			e._settings.update(e._prevSettings);
			e._prevSettings = null
		}
	}
	function ym(e) {
		if (e._cursorActive) {
			e._cursorActive = false;
			e._render.removeCursorStyle(e._options.cursorOnHover)
		}
	}
	function _m(e) {
		if (!e._cursorActive) {
			e._cursorActive = true;
			e._render.addCursorStyle(e._options.cursorOnHover)
		}
	}
	function mm(e, t, r) {
		var n = e._camera.screenToGraphCoordinates({
			x: t,
			y: r
		}),
			i = e._movedEdges,
			o = e._render.updateComposite(e._components, i.size);
		i.forEach(function(t, r) {
			var i = e._graphics.getEdgeShape(t.getAttribute("shape")),
				s = e._edgeColors[r],
				a = t.getAttribute("width"),
				u = t.getSource(),
				l = t.getTarget(),
				d = bm(e),
				f = l === e._startNode ? l : u,
				h = l === e._startNode ? u : l,
				c = h.getPosition(),
				p = d ? d.getPosition() : n,
				g = d ? d.getAttribute("radius") : 0,
				v = h.getAttribute("radius"),
				y = e._curvatureList.get(t._index),
				_ = 1,
				m, x, b, A, w, E;
			h.addClass("selectionExtremityHighlighted");
			if (f === l) {
				m = c.x;
				x = c.y;
				b = p.x;
				A = p.y;
				w = v;
				E = g
			} else {
				m = p.x;
				x = p.y;
				b = c.x;
				A = c.y;
				w = g;
				E = v
			}
			o[r] = Ku(e._render, o[r], i, true, false, m, x, b, A, a, 0, y, w, E, s, "edgeShapes", 0, _)
		});
		e._components = e._render.composite(e._components, o)
	}
	function xm(e) {
		e._components = e._render.delete(e._components)
	}
	function bm(e) {
		var t = e._captor.getPointedElement();
		return t && t.isNode ? t : null
	}
	function Am(e, value) {
		var t = e._movedEdges._indexes;
		for (var r = 0; r < t.length; ++r) {
			e._filter.set(t[r], value)
		}
		e._graph._refreshFilters(false, t)
	}
	function wm(e, t, r, n) {
		var i = e._camera.graphToScreenCoordinates(t.getPosition());
		return t.getAttribute("radius") * e._camera.zoom > e._options.radius && distance(i.x, i.y, r, n) < e._options.radius
	}
	function Em(e) {
		e._canvas.getContext("2d").clearRect(0, 0, e._canvas.width, e._canvas.height)
	}
	function Im(e) {
		if (!e._enabled || !e._nodesToHighlight) {
			return
		}
		var t = {
			x: e._mouse.x,
			y: e._mouse.y
		},
			r = bm(e),
			n = e._camera.zoom,
			i = e._canvas.getContext("2d"),
			o = Ut(),
			s = e._nodesToHighlight;
		var a = e._options;
		var u = a.color;
		var l = a.radius;
		var d = s.getPosition().map(function(t) {
			return e._camera.graphToScreenCoordinates(t)
		});
		Em(e);
		i.fillStyle = u;
		i.strokeStyle = u;
		var f = false;
		d.forEach(function(e, r) {
			var a = e.x;
			var u = e.y;
			if (s.get(r).getAttribute("radius") * n > l) {
				i.fillRect((a - l) * o, (u - l) * o, l * o * 2, l * o * 2);
				if (distance(a, u, t.x, t.y) < l) {
					f = true
				}
			}
		});
		if (e._movedEdges) {
			var h = t;
			if (r) {
				h = e._camera.graphToScreenCoordinates(r.getPosition())
			}
			i.fillRect((h.x - l) * o, (h.y - l) * o, l * o * 2, l * o * 2)
		}
		if (f) {
			_m(e)
		} else {
			ym(e)
		}
	}
	var Sm = {
		tolerance: 5,
		centerSnapDistance: 240,
		sideSnapDistanceFactor: 3,
		guidelineWidth: 1,
		guidelineColor: "#ff0000",
		preferredDistance: {
			enabled: true,
			ratio: 1.13,
			tolerance: 10,
			lineColor: "#00C3FF",
			lineWidth: 1
		},
		neighbours: {
			enabled: true,
			offset: 5,
			tolerance: 3,
			lineColor: "#00C3FF",
			lineWidth: 1
		}
	};
	var Cm = 1;
	var Tm = {
		NONE: 0,
		CENTER: 1,
		LEFT: 2,
		RIGHT: 3,
		TOP: 4,
		BOTTOM: 5
	};
	var Lm = function e(t) {
			var r = t.modules;
			var n = r.graph;
			var i = r.graphics;
			var o = r.render;
			var s = r.settings;
			var a = r.spatial;
			var u = r.events;
			var l = r.camera;
			this._graph = n;
			this._graphics = i;
			this._spatial = a;
			this._render = o;
			this._settings = s;
			this._events = u;
			this._camera = l;
			this._options = Ge(Sm);
			this._enabled = false;
			this._ysnap = this._xsnap = Tm.NONE;
			this._node = null;
			this._r = 0;
			this._viewport = null;
			this._horizontalGuideLine = null;
			this._verticalGuideLine = null;
			this._vguideline = {
				start: new Or,
				end: new Or
			};
			this._hguideline = {
				start: new Or,
				end: new Or
			};
			this._distanceGuidelines = [-1, -1];
			this._neighbourGuidelines = [];
			this._render.addSemanticLayer("guidelines", {
				camera: this._graphics._cameraForRender
			})
		};
	Lm.prototype.enable = function e(t) {
		var r = this;
		var n = this._events;
		this._options = Ye(t, Sm);
		if (!this._enabled) {
			this._enabled = true;
			this._dragStartListener = n.on("startMoveNodesByDragging", function(e) {
				return r._onNodeDragStart(e)
			});
			this._dragEndListener = n.on("endMoveNodesByDragging", function(e) {
				return r._onNodeDragEnd(e)
			});
			this._settings.update({
				"interactions.drag.onBeforeDrag": function(e, t, n) {
					return r._onBeforeDrag(e, t, n)
				}
			})
		}
	};
	Lm.prototype.disable = function e() {
		if (this._enabled) {
			var t = this._events;
			t.removeListener(this._dragStartListener);
			t.removeListener(this._dragEndListener);
			this._settings.update({
				"interactions.drag.onBeforeDrag": null
			});
			this._enabled = false
		}
	};
	Lm.prototype.enabled = function e() {
		return this._enabled
	};
	Lm.prototype._onNodeDragStart = function e(t) {
		var r = t.nodes;
		if (r.size === 1) {
			this._node = r.get(0);
			this._cacheViewport();
			this._r = this._node.getAttribute("radius")
		}
	};
	Lm.prototype._onBeforeDrag = function e(t, r, n) {
		if (this._node) {
			var i = n[0];
			this._scan(i);
			this._node.setAttributes(i)
		}
	};
	Lm.prototype._onNodeDragEnd = function e(t) {
		if (this._node) {
			var r = this._render;
			this._verticalGuideLine = r.delete(this._verticalGuideLine);
			this._horizontalGuideLine = r.delete(this._horizontalGuideLine);
			this._distanceGuidelines[0] = r.delete(this._distanceGuidelines[0]);
			this._distanceGuidelines[1] = r.delete(this._distanceGuidelines[1]);
			this._neighbourGuidelines.forEach(function(e) {
				return r.delete(e)
			});
			this._neighbourGuidelines = []
		}
		this._node = null
	};
	Lm.prototype._cacheViewport = function e() {
		var t = this._camera;
		var r = t.screenToGraphCoordinates({
			x: 0,
			y: 0
		});
		var n = t.screenToGraphCoordinates({
			x: t.width,
			y: t.height
		});
		this._viewport = {
			xmin: r.x,
			ymin: r.y,
			xmax: n.x,
			ymax: n.y
		};
		this._nodes = this._spatial.getNodesByBoundingBox(r.x, r.y, n.x, n.y);
		var i = this._node._index;
		var o = this._nodes._indexes.slice();
		o.splice(o.indexOf(i), 1);
		var s = this._graphics._getAttributeArray(true, "radius");
		var a = this._graph.getAttribute(true, "x")._buffer;
		var u = this._graph.getAttribute(true, "y")._buffer;
		var l = zm(o.slice(), a);
		var d = zm(o.slice(), u);
		var f = {},
			h = {};
		var c = {},
			p = {};
		var g = this._gridResolution = this._node.getAttribute("radius");
		for (var v = 0, y = o.length; v < y; v++) {
			var _ = l[v],
				m = d[v];
			var x = a[_] / g | 0,
				b = u[m] / g | 0;
			if (!f[x]) {
				f[x] = []
			}
			if (!h[b]) {
				h[b] = []
			}
			f[x].push(_);
			h[b].push(m);
			c[_] = p[m] = v
		}
		this._nodesByX = l;
		this._nodesByY = d;
		this._nodesByXIndex = c;
		this._nodesByYIndex = p;
		this._xGrid = f;
		this._yGrid = h;
		this._X = a;
		this._Y = u;
		this._R = s
	};
	Lm.prototype._scan = function e(t) {
		var r = this._node._index;
		var n = t.x,
			i = t.y,
			o = this._r;
		var s = this._render;
		var a = this._options;
		var u = this._R;
		var l = this._X;
		var d = this._Y;
		var f = this._camera.zoom;
		var h = Math.min(o, this._options.tolerance / f);
		var c = o * 2 * a.sideSnapDistanceFactor;
		var p = a.guidelineWidth;
		var g = a.guidelineColor;
		var v, y;
		this._verticalGuideLine = s.delete(this._verticalGuideLine);
		this._horizontalGuideLine = s.delete(this._horizontalGuideLine);
		this._distanceGuidelines[0] = s.delete(this._distanceGuidelines[0]);
		this._distanceGuidelines[1] = s.delete(this._distanceGuidelines[1]);
		var _ = r;
		var m = r;
		var x, b, A, w, E, I, S;
		var C = false,
			T = false;
		_ = Nm(this._nodesByX, l, n);
		m = Nm(this._nodesByY, d, i);
		if (Math.abs(l[_] - n) > a.centerSnapDistance) {
			_ = r
		}
		if (Math.abs(d[m] - i) > a.centerSnapDistance) {
			m = r
		}
		this._xsnap = Tm.NONE;
		if (_ !== r) {
			v = this._vguideline.start;
			y = this._vguideline.end;
			S = _;
			x = l[S];
			b = d[S];
			A = u.get(S);
			I = Math.abs(n - x);
			var L = Math.abs(n - o - (x - A));
			var N = Math.abs(n + o - (x + A));
			if (I < Math.max(o, A)) {
				if (b < i) {
					v.y = b - A;
					y.y = i + o
				} else {
					v.y = b + A;
					y.y = i - o
				}
				var z = Math.min(L, I, N);
				if (z === I) {
					v.x = y.x = x;
					y.y = i;
					v.y = b;
					this._xsnap = Tm.CENTER
				} else if (Math.abs(i - b) < A + o + c) {
					if (z === L) {
						v.x = y.x = x - A;
						this._xsnap = Tm.LEFT
					} else {
						v.x = y.x = x + A;
						this._xsnap = Tm.RIGHT
					}
				}
				if (z < h) {
					C = true
				}
			}
			if (this._xsnap !== Tm.NONE) {
				this._verticalGuideLine = s.line(-1, v, y, 0, p, g, "guidelines", Cm)
			}
		}
		this._ysnap = Tm.NONE;
		if (m !== r) {
			v = this._hguideline.start;
			y = this._hguideline.end;
			S = m;
			x = l[S];
			b = d[S];
			A = u.get(S);
			I = Math.abs(i - b);
			var M = Math.abs(i - o - (b - A));
			var k = Math.abs(i + o - (b + A));
			if (I < Math.max(o, A)) {
				if (x < n) {
					v.x = x - A;
					y.x = n + o
				} else {
					v.x = x + A;
					y.x = n - o
				}
				var R = Math.min(M, I, k);
				if (R === I) {
					v.y = y.y = b;
					y.x = n;
					v.x = x;
					this._ysnap = Tm.CENTER
				} else if (Math.abs(n - x) < A + o + c) {
					if (R === M) {
						v.y = y.y = b - A;
						this._ysnap = Tm.TOP
					} else {
						v.y = y.y = b + A;
						this._ysnap = Tm.BOTTOM
					}
				}
				if (R < h) {
					T = true
				}
			}
			if (this._ysnap !== Tm.NONE) {
				this._horizontalGuideLine = s.line(-1, v, y, 0, p, g, "guidelines", Cm)
			}
		}
		if (a.preferredDistance.enabled) {
			var F = a.preferredDistance.ratio;
			var P = Math.min(a.preferredDistance.tolerance / f, o);
			var D = Math.max(o, A);
			if (_ !== r && (this._xsnap === Tm.NONE || !C)) {
				S = _;
				x = l[S];
				b = d[S];
				A = u.get(S);
				w = Math.abs(n - x) - (o + A) * (1 + F);
				if (w <= P && w >= -P) {
					var O = n < x ? -1 : 1;
					v = this._vguideline.start;
					y = this._vguideline.end;
					v.x = y.x = x + O * (1 + F) * (o + A);
					v.y = b - D;
					y.y = b + D;
					v.x = y.x = x;
					this._distanceGuidelines[0] = s.line(-1, v, y, 0, p, g, "guidelines", Cm);
					v.y = i - D;
					y.y = i + D;
					v.x = y.x = x + O * (1 + F) * (o + A);
					this._distanceGuidelines[1] = s.line(-1, v, y, 0, p, g, "guidelines", Cm);
					this._xsnap = Tm.CENTER;
					C = true
				}
			} else if (m !== r && (this._ysnap === Tm.NONE || !T)) {
				S = m;
				x = l[S];
				b = d[S];
				A = u.get(S);
				E = Math.abs(i - b) - (o + A) * (1 + F);
				if (E <= P && E >= -P) {
					var B = i < b ? -1 : 1;
					v = this._hguideline.start;
					y = this._hguideline.end;
					v.x = x - D;
					y.x = x + D;
					v.y = y.y = b;
					this._distanceGuidelines[0] = s.line(-1, v, y, 0, p, g, "guidelines", Cm);
					v.x = n - D;
					y.x = n + D;
					v.y = y.y = b + B * (1 + F) * (o + A);
					this._distanceGuidelines[1] = s.line(-1, v, y, 0, p, g, "guidelines", Cm);
					this._ysnap = Tm.CENTER;
					T = true
				}
			}
		}
		if (a.neighbours.enabled) {
			var U = this._neighbourGuidelines;
			for (var X = 0, j = U.length; X < j; X++) {
				s.delete(U[X])
			}
			var W = this._gridResolution;
			var G = n / W | 0,
				H = i / W | 0;
			var Y = this._xGrid,
				V = this._yGrid,
				q = [];
			var Z = [].concat(V[H - 1] || q, V[H] || q, V[H + 1] || q);
			var Q = [].concat(Y[G - 1] || q, Y[G] || q, Y[G + 1] || q);
			var J;
			if (Z.length > 1) {
				zm(Z, l);
				J = this.findNeighboursToAlign(Z, l, r, n, o, u, h);
				if (J) {
					this.drawNeighbourGuidelines(J, t);
					C = false
				}
			}
			if (Q.length > 1 && !J) {
				zm(Q, d);
				J = this.findNeighboursToAlign(Q, d, r, i, o, u, h);
				if (J) {
					this.drawNeighbourGuidelines(J, t, true);
					T = false
				}
			}
		}
		if (C || T) {
			this._snap(t, !C, !T)
		}
	};
	Lm.prototype.findNeighboursToAlign = function e(t, r, n, i, o, s, a) {
		var u, l, d, f = false,
			h, c, p;
		var g = Math.abs;
		for (var v = 0, y = t.length; !f && v < y; v++) {
			for (var _ = 0; !f && _ < y; _++) {
				if (v === _) {
					continue
				}
				var m = t[v],
					x = t[_];
				if (_ < v) {
					h = x;
					x = m;
					m = h
				}
				var b = r[m],
					A = r[x];
				var w = s.get(m),
					E = s.get(x);
				if (b + w < i - o && A - E > i + o && g(g(b + w - (i - o)) - g(A - E - (i + o))) <= a) {
					u = m;
					l = n, d = x;
					p = b + w + Math.abs(A - E - (b + w)) / 2;
					c = [b + w, p - o, p + o, A - E];
					f = true
				} else if (b + w < i - o && A + E < i - o && g(g(b + w - (A - E)) - g(Math.max(b + w, A + E) - (i - o))) <= a) {
					u = m;
					l = x;
					d = n;
					p = A + w + g(g(b + w - (A - E))) + o;
					c = [b + w, A - E, A + E, p - o];
					f = true
				} else if (b - w > i + o && A - E > i + o && g(g(b + w - (A - E)) - g(Math.min(b - w, A - E) - (i + o))) <= a) {
					u = n;
					l = m;
					d = x;
					p = b - w - g(g(b + w - (A - E))) - o;
					c = [p + o, b - w, b + w, A - E];
					f = true
				}
			}
		}
		return f ? {
			a: u,
			b: l,
			c: d,
			current: n,
			target: p,
			points: c
		} : null
	};
	Lm.prototype.drawNeighbourGuidelines = function e(t, r, n) {
		var i = t.a;
		var o = t.b;
		var s = t.c;
		var a = t.points;
		var u = t.target;
		var l = this._neighbourGuidelines;
		var d = new Or;
		var f = new Or;
		var h = this._R,
			c = this._X,
			p = this._Y;
		var g = h.getMultiple([i, o, s]);
		var v = g[0];
		var y = g[1];
		var _ = g[2];
		var m = this._render;
		var x = this._options.neighbours;
		var b = x.offset;
		var A = x.lineWidth;
		var w = x.lineColor;
		var E, I;
		if (n) {
			r.y = u;
			v = -v;
			y = -y;
			_ = -_;
			E = f.x = d.x = Math.min(c[i] + v, c[o] + y, c[s] + _) - b;
			I = c
		} else {
			r.x = u;
			E = f.y = d.y = Math.max(p[i] + v, p[o] + y, p[s] + _) + b;
			I = p
		}
		var S = n ? "y" : "x";
		var C = n ? "x" : "y";
		d[S] = a[0];
		f[S] = a[1];
		l.push(m.line(-1, d, f, 0, A, w, "guidelines", Cm));
		d[S] = a[2];
		f[S] = a[3];
		l.push(m.line(-1, d, f, 0, A, w, "guidelines", Cm));
		d[S] = a[0];
		d[C] = E - b / 2;
		f[S] = a[0];
		d[C] = I[i] + v;
		l.push(m.line(-1, d, f, 0, A, w, "guidelines", Cm));
		d[S] = a[1];
		d[C] = E - b / 2;
		f[S] = a[1];
		d[C] = I[o] + y;
		l.push(m.line(-1, d, f, 0, A, w, "guidelines", Cm));
		d[S] = a[2];
		d[C] = E - b / 2;
		f[S] = a[2];
		d[C] = I[o] + y;
		l.push(m.line(-1, d, f, 0, A, w, "guidelines", Cm));
		d[S] = a[3];
		d[C] = E - b / 2;
		f[S] = a[3];
		d[C] = I[s] + _;
		l.push(m.line(-1, d, f, 0, A, w, "guidelines", Cm))
	};
	Lm.prototype._snap = function e(t, r, n) {
		var i = this._xsnap;
		var o = this._ysnap;
		var s;
		if (!r && i !== Tm.NONE) {
			s = this._vguideline.end;
			if (i === Tm.LEFT) {
				t.x = s.x + this._r
			} else if (i === Tm.RIGHT) {
				t.x = s.x - this._r
			} else {
				t.x = s.x
			}
		}
		if (!n && o !== Tm.NONE) {
			s = this._hguideline.end;
			if (o === Tm.TOP) {
				t.y = s.y + this._r
			} else if (o === Tm.BOTTOM) {
				t.y = s.y - this._r
			} else {
				t.y = s.y
			}
		}
	};

	function Nm(e, t, r, n) {
		var i = 0,
			o = e.length - 1;
		var s, a, u;
		var l = Math.abs;
		while (i < o) {
			s = (i + o) / 2 | 0;
			a = l(t[e[s]] - r);
			u = l(t[e[s + 1]] - r);
			if (u <= a) {
				i = s + 1
			} else {
				o = s
			}
		}
		return n ? o : e[o]
	}
	function zm(e, t) {
		for (var r = 1, n = e.length; r < n; r++) {
			var i = e[r],
				o = r;
			while (t[e[o - 1]] > t[i]) {
				e[o] = e[o - 1];
				--o
			}
			e[o] = i
		}
		return e
	}
	g.extend(function(e) {
		var t = new Lm(e);
		e.modules.snapping = t;
		e.tools.snapping = {
			enable: function(e) {
				return t.enable(e)
			},
			disable: function() {
				return t.disable()
			}
		}
	});
	g.extend(function(e) {
		var t = new km(e);
		e.modules.tooltip = t;
		e.tools.tooltip = {};
		e.tools.tooltip.onNodeHover = function(e, r) {
			Um(t, "hover.node", e, r)
		};
		e.tools.tooltip.onNodeClick = function(e, r) {
			console.log("###")
			console.log(t)
			console.log(e)
			console.log(r)
			Um(t, "click.left.node", e, r)
		};
		e.tools.tooltip.onNodeRightClick = function(e, r) {
			Um(t, "click.right.node", e, r)
		};
		e.tools.tooltip.onNodeDoubleClick = function(e, r) {
			Um(t, "doubleClick.left.node", e, r)
		};
		e.tools.tooltip.onEdgeHover = function(e, r) {
			Um(t, "hover.edge", e, r)
		};
		e.tools.tooltip.onEdgeClick = function(e, r) {
			Um(t, "click.left.edge", e, r)
		};
		e.tools.tooltip.onEdgeRightClick = function(e, r) {
			Um(t, "click.right.edge", e, r)
		};
		e.tools.tooltip.onEdgeDoubleClick = function(e, r) {
			Um(t, "doubleClick.left.edge", e, r)
		};
		e.tools.tooltip.onBackgroundClick = function(e, r) {
			Um(t, "click.left.background", e, r)
		};
		e.tools.tooltip.onBackgroundRightClick = function(e, r) {
			Um(t, "click.right.background", e, r)
		};
		e.tools.tooltip.onBackgroundDoubleClick = function(e, r) {
			Um(t, "doubleClick.left.background", e, r)
		};
		e.tools.tooltip.refresh = function() {
			t.refresh()
		}
	});
	/*Mm存放方位，cssDefined表示只存放在graph里面，不会放在节点周围*/
	var Mm = ["top", "bottom", "left", "right", "cssDefined"];
	var km = function e(t) {
			var r = this;
			this._render = t.modules.render;
			this._interactions = t.modules.interactions;
			this._camera = t.modules.camera;
			this._events = t.modules.events;
			this._handlers = {};
			this._currentHandlerName = null;
			this._tooltip = null;
			this._isHover = false;
			this._events.on({
				"up dragStart": function() {
					if (!r._isHover) {
						Gm(r)
					}
				},
				unhover: function() {
					if (r._isHover) {
						Gm(r)
					}
				},
				clear: function() {
					Gm(r)
				}
			});
			this._interactions.onHover(Fm(this, "hover", true));
			this._interactions.onClick(Fm(this, "click"));
			this._interactions.onDoubleClick(Fm(this, "doubleClick"))
		};
	km.prototype.hide = function e() {
		Gm(this, true)
	};
	km.prototype.refresh = function e() {
		Pm(this)
	};

	function Rm(e, t, r) {
		if (e._timeout) {
			clearTimeout(e._timeout)
		}
		e._timeout = setTimeout(function() {
			e._timeout = null;
			t()
		}, r)
	}
	function Fm(e, t, r) {
		if (r === void 0) r = false;
		return {
			priority: "tooltip",
			check: function(r) {
				var n = r.button;
				var i = r.target;
				var o = [];
				o.push(t);
				if (n) {
					o.push(n)
				}
				o.push(i ? i.isNode ? "node" : "edge" : "background");
				var s = o.join("."),
					a = e._handlers[s];
				if (a && a.condition(r)) {
					e._currentHandlerName = s;
					return true
				}
				return false
			},
			handler: function t(n) {
				var i = n.target;
				var o = n.x;
				var s = n.y;
				e._isHover = r;
				e._elt = i;
				e._x = o;
				e._y = s;
				Pm(e)
			}
		}
	}
	function Pm(e) {
		if (!e._currentHandlerName) {
			return
		}
		var t = e._handlers[e._currentHandlerName];
		var r = t.settings;
		var n = t.handler;
		var i = n(e._elt),
			o = i instanceof Promise ? i : Promise.resolve(i);
		o.then(function(t) {
			Rm(e, function() {
				Wm(e, t, r)
			}, r.delay)
		})
	}
	var Dm = {
		top: {
			x: 0,
			y: -1
		},
		bottom: {
			x: 0,
			y: 1
		},
		left: {
			x: -1,
			y: 0
		},
		right: {
			x: 1,
			y: 0
		}
	};
	var Om = {
		position: "top",
		autoAdjust: true,
		hoverDelay: 100,
		className: null
	};
	var Bm = {
		hover: {
			node: function(e) {
				var t = e.target;
				return t && t.isNode
			},
			edge: function(e) {
				var t = e.target;
				return t && !t.isNode
			}
		},
		click: {
			left: {
				node: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "left" && t && t.isNode
				},
				edge: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "left" && t && !t.isNode
				},
				background: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "left" && !t
				}
			},
			right: {
				node: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "right" && t && t.isNode
				},
				edge: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "right" && t && !t.isNode
				},
				background: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "right" && !t
				}
			}
		},
		doubleClick: {
			left: {
				node: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "left" && t && t.isNode
				},
				edge: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "left" && t && !t.isNode
				},
				background: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "left" && !t
				}
			},
			right: {
				node: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "right" && t && t.isNode
				},
				edge: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "right" && t && !t.isNode
				},
				background: function(e) {
					var t = e.target;
					var r = e.button;
					return r === "right" && !t
				}
			}
		}
	};

	function Um(e, t, r, n) {
		var i = Ye(n, Om, "position");
		if (Mm.indexOf(i.position) === -1) {
			i.position = "top"
		}
		e._handlers[t] = {
			handler: r,
			condition: $e(Bm, t),
			settings: i
		}
	}
	function Xm(e) {
		return typeof HTMLElement !== "undefined" ? e instanceof HTMLElement : false
	}
	function jm(e) {
		return typeof document === "object" ? document.createElement(e) : {
			style: {},
			offsetWidth: 10,
			offsetHeight: 10
		}
	}
	function Wm(e, t, r) {
		Gm(e, false);
		var n = e._x,
			i = e._y,
			o = e._elt,
			s = e._render.getDimensions();
		var a = r.className;
		var u = r.autoAdjust;
		var l = r.position,
			d = 0,
			f = 0;
		if (typeof t === "string") {
			e._tooltip = jm("div");
			e._tooltip.innerHTML = t
		} else if (Xm(t)) {
			e._tooltip = t
		} else {
			throw new Error("invalid tooltip " + t + ", expected HTML string or HTML element")
		}
		e._tooltip.__isOgmaTooltip = true;
		if (a) {
			e._tooltip.className += e._tooltip.className ? " " + a : a
		}
		if (l !== "cssDefined") {
			e._tooltip.style.position = "absolute"
		}
		e._render.addRenderLayer(e._tooltip, "tooltip");
		if (o && o.isNode) {
			var h = e._camera.graphToScreenCoordinates(o.getPosition()),
				c = o.getAttribute("radius") * e._camera.zoom + o.getAttribute("innerStroke.width") + +o.getAttribute("outerStroke.width") + 1;
			n = h.x;
			i = h.y;
			d = c;
			f = c
		}
		var p = e._tooltip.offsetWidth,
			g = e._tooltip.offsetHeight,
			v = p / 2,
			y = g / 2;
		d += v;
		f += y;
		if (l !== "cssDefined") {
			var _ = Dm[l],
				m = _.x,
				x = _.y;
			if (u) {
				var b = n + d * _.x,
					A = i + f * _.y;
				if (b - v < 0 || b + v >= s.width) {
					if (l === "left" || l === "right") {
						m *= -1
					} else {
						if (b - v < 0) {
							m = (v - b + 1) / d
						} else {
							m = (s.width - (b + v) - 1) / d
						}
					}
				}
				if (A - y < 0 || A + y >= s.height) {
					if (l === "top" || l === "bottom") {
						x *= -1
					} else {
						if (A - y < 0) {
							x = (y - A + 1) / f
						} else {
							x = (s.height - (A + y) - 1) / f
						}
					}
				}
			}
			e._tooltip.style.left = n + d * m - v + "px";
			e._tooltip.style.top = i + f * x - y + "px"
		}
	}
	function Gm(e, t) {
		if (e._timeout) {
			clearTimeout(e._timeout);
			e._timeout = null
		}
		if (e._tooltip) {
			e._render.removeRenderLayer(e._tooltip);
			e._tooltip = null
		}
		if (t) {
			e._currentHandlerName = null
		}
	}
	function Hm(e, t) {
		var r = t.styles;
		var n = t.nodes;
		var i = t.edges;
		var o = t.filter;
		var s = {
			nodes: Vm(true, e, r, n, o),
			edges: Vm(false, e, r, i, o)
		};
		return s
	}
	var Ym = {
		get: function() {
			return undefined
		}
	};

	function Vm(e, t, r, n, i) {
		var o = t.modules.graph,
			s = o._filter(e, o._getIndexes(e, n), i);
		var a = o.getAttributes(e, ["source", "target", "data", "x", "y", "text.content", "color", "shape", e ? "radius" : "width"]).map(function(e) {
			return e || Ym
		});
		var u = a[0];
		var l = a[1];
		var d = a[2];
		var f = a[3];
		var h = a[4];
		var c = a[5];
		var p = a[6];
		var g = a[7];
		var v = a[8];
		var y = new Array(s.length);
		if (r === "none") {
			c = Ym;
			p = Ym;
			g = Ym;
			v = Ym
		} else if (r === "original") {
			var _ = t.modules.graphics._elts.fetch(e)._originalStyles;
			c = _["text.content"] || Ym;
			p = _.color || Ym;
			g = _.shape || Ym;
			v = _.size || Ym
		}
		for (var m = 0; m < s.length; ++m) {
			var x = s[m],
				b = {
					id: o._getId(e, x),
					data: d.get(x),
					x: f.get(x),
					y: h.get(x),
					color: p.get(x),
					size: v.get(x),
					shape: g.get(x),
					text: c.get(x)
				};
			if (!e) {
				b.source = o._getId(true, u.get(x));
				b.target = o._getId(true, l.get(x))
			}
			if (Array.isArray(b.color)) {
				b.color = b.color[0]
			}
			y[m] = b
		}
		return y
	}
	function qm(e, t) {
		for (var r = 0; r < t.length; ++r) {
			if (e === undefined || e === null) {
				return undefined
			}
			e = e[t[r]]
		}
		return e
	}
	function Zm(e, t, value) {
		for (var r = 0; r < t.length - 1; ++r) {
			var n = t[r],
				i = e[n];
			if (i === undefined) {
				i = {};
				e[n] = i
			}
			e = i
		}
		e[t[t.length - 1]] = value
	}
	function Qm(e, t, r) {
		var n = new Kr,
			i = t ? 1 : 3,
			o = [];
		var s = function(s) {
				var a = e[s],
					u = new Array(i),
					l = a.data;
				if (r) {
					var d = {};
					r.forEach(function(e) {
						var t = _e(e),
							value = qm(l, t);
						Zm(d, t, value)
					});
					l = d
				}
				var f = Jr(l);
				u[0] = a.id;
				if (!t) {
					u[1] = a.source;
					u[2] = a.target
				}
				for (var h = 0; h < f.length; ++h) {
					var c = f[h];
					var p = c.path;
					var value = c.value;
					if (p.length) {
						if (n.has(p)) {
							u[n.get(p)] = value
						} else {
							n.set(p, i);
							u[i] = value;
							i++
						}
					}
				}
				o.push(u)
			};
		for (var a = 0; a < e.length; ++a) s(a);
		var u = [];
		u.push("id");
		if (!t) {
			u.push("source");
			u.push("target")
		}
		n.keys().forEach(function(e) {
			return u.push(e[e.length - 1])
		});
		o.unshift(u);
		o.forEach(function(e) {
			return e.length = i
		});
		return o
	}
	var Jm = {
		what: undefined,
		dataProperties: undefined,
		separator: ",",
		textSeparator: '"',
		download: true,
		filename: "graph.csv",
		filter: "visible",
		nodes: undefined,
		edges: undefined
	};
	g.extend(function(e) {
		e.export.csv = function(t) {
			var r = Ye(t, Jm, "what");
			var n = r.what;
			var i = r.dataProperties;
			var o = r.nodes;
			var s = r.edges;
			var a = r.separator;
			var u = r.textSeparator;
			var l = r.download;
			var d = r.filename;
			var f = r.filter;
			var h = Hm(e, {
				styles: "none",
				nodes: o,
				edges: s,
				filter: f
			}),
				c = Km(h, {
					what: n,
					separator: a,
					textSeparator: u,
					dataProperties: i
				});
			if (l) {
				Ht(c, d, "text")
			}
			return Promise.resolve(c)
		}
	});

	function Km(e, t) {
		var r = t.what;
		var n = t.separator;
		var i = t.textSeparator;
		var o = t.dataProperties;
		var s = new RegExp("" + i, "g");

		function a(e) {
			e = $m(e);
			e = i + e.replace(s, "\\$&") + i;
			return e
		}
		if (i && i !== '"' && i !== "'") {
			throw new TypeError('Invalid argument :"textSeparator" is not single-quote or double-quote, was ' + i)
		}
		if (r !== "nodes" && r !== "edges") {
			throw new TypeError('missing argument: "what": should have value "nodes" or "edges"')
		}
		var u = r === "nodes",
			l = u ? e.nodes : e.edges,
			d = Qm(l, u, o).map(function(e) {
				return e.map(function(value) {
					return a(value)
				})
			});
		return d.map(function(e) {
			return e.join(n)
		}).join("\n")
	}
	function $m(e) {
		if (e instanceof Date) {
			return e.toISOString()
		} else {
			return "" + e
		}
	}
	var ex = {
		creator: undefined,
		description: undefined,
		styles: "all",
		download: true,
		filename: "graph.gexf",
		nodes: undefined,
		edges: undefined,
		filter: "visible"
	};
	g.extend(function(e) {
		e.export.gexf = function(t) {
			if (t === void 0) t = {};
			var r = Ye(t, ex);
			var n = r.styles;
			var i = r.nodes;
			var o = r.edges;
			var s = r.download;
			var a = r.filename;
			var u = r.creator;
			var l = r.description;
			var d = r.filter;
			var f = Hm(e, {
				styles: n,
				nodes: i,
				edges: o,
				filter: d
			}),
				h = tx(f, {
					creator: u,
					description: l
				});
			if (s) {
				Ht(h, a, "text")
			}
			return Promise.resolve(h)
		}
	});

	function tx(e, t) {
		var r = Ft();
		var n, i = {},
			o = 0,
			s = {},
			a = 0,
			u, l, d, f, h, c, p, g, v, y, _, m, x, b, A, w, E, I;
		A = r.createElement("gexf");
		A.setAttribute("xmlns", "http://www.gexf.net/1.2draft");
		A.setAttribute("xmlns:viz", "http://www.gexf.net/1.2draft/viz");
		A.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
		A.setAttribute("xsi:schemaLocation", "http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd");
		A.setAttribute("version", "1.2");
		m = r.createElement("meta");
		m.setAttribute("lastmodifieddate", oe());
		if (t.creator) {
			p = r.createElement("creator");
			I = r.createTextNode("" + t.creator);
			p.appendChild(I);
			m.appendChild(p)
		}
		if (t.description) {
			g = r.createElement("description");
			I = r.createTextNode("" + t.description);
			g.appendChild(I);
			m.appendChild(g)
		}
		_ = r.createElement("graph");
		_.setAttribute("mode", "static");
		x = r.createElement("nodes");
		e.nodes.forEach(function(e) {
			b = r.createElement("node");
			b.setAttribute("id", e.id);
			if (e.text) {
				b.setAttribute("label", e.text)
			}
			n = e.data;
			if (n) {
				l = r.createElement("attvalues");
				Object.keys(n).forEach(function(e) {
					if (!(e in i)) {
						i[e] = {
							id: o,
							type: "integer"
						};
						o++
					}
					var t = n[e];
					i[e].type = rx(t, i[e].type);
					d = r.createElement("attvalue");
					d.setAttribute("for", i[e].id);
					d.setAttribute("value", t);
					l.appendChild(d)
				});
				b.appendChild(l)
			}
			if (e.color) {
				var t = q(e.color);
				c = r.createElement("viz:color");
				c.setAttribute("r", t[0]);
				c.setAttribute("g", t[1]);
				c.setAttribute("b", t[2]);
				c.setAttribute("a", t[3]);
				b.appendChild(c)
			}
			w = r.createElement("viz:position");
			w.setAttribute("x", e.x);
			w.setAttribute("y", -parseInt(e.y, 10));
			b.appendChild(w);
			if (e.size) {
				E = r.createElement("viz:size");
				E.setAttribute("value", e.size);
				b.appendChild(E)
			}
			x.appendChild(b)
		});
		f = r.createElement("attributes");
		f.setAttribute("class", "node");
		Object.keys(i).forEach(function(e) {
			u = r.createElement("attribute");
			u.setAttribute("id", i[e].id);
			u.setAttribute("title", e);
			u.setAttribute("type", i[e].type);
			f.appendChild(u)
		});
		v = r.createElement("edges");
		e.edges.forEach(function(e) {
			y = r.createElement("edge");
			y.setAttribute("id", e.id);
			y.setAttribute("source", e.source);
			y.setAttribute("target", e.target);
			if (e.size) {
				y.setAttribute("weight", e.size)
			}
			if (e.text) {
				y.setAttribute("label", e.text)
			}
			n = e.data;
			if (n) {
				l = r.createElement("attvalues");
				Object.keys(n).forEach(function(e) {
					if (!(e in s)) {
						s[e] = {
							id: a,
							type: "integer"
						};
						a++
					}
					var t = n[e];
					s[e].type = rx(t, s[e].type);
					d = r.createElement("attvalue");
					d.setAttribute("for", s[e].id);
					d.setAttribute("value", t);
					l.appendChild(d)
				});
				y.appendChild(l)
			}
			if (e.color) {
				var t = q(e.color);
				c = r.createElement("viz:color");
				c.setAttribute("r", t[0]);
				c.setAttribute("g", t[1]);
				c.setAttribute("b", t[2]);
				y.appendChild(c)
			}
			if (e.size) {
				E = r.createElement("viz:size");
				E.setAttribute("value", e.size);
				y.appendChild(E)
			}
			v.appendChild(y)
		});
		h = r.createElement("attributes");
		h.setAttribute("class", "edge");
		Object.keys(s).forEach(function(e) {
			u = r.createElement("attribute");
			u.setAttribute("id", s[e].id);
			u.setAttribute("title", e);
			u.setAttribute("type", s[e].type);
			h.appendChild(u)
		});
		_.appendChild(f);
		_.appendChild(h);
		_.appendChild(x);
		_.appendChild(v);
		A.appendChild(m);
		A.appendChild(_);
		r.appendChild(A);
		var S = Pt(r);
		if (u) {
			u.parentNode.removeChild(u)
		}
		if (l) {
			l.parentNode.removeChild(l)
		}
		if (d) {
			d.parentNode.removeChild(d)
		}
		if (c) {
			c.parentNode.removeChild(c)
		}
		if (p) {
			p.parentNode.removeChild(p)
		}
		if (g) {
			g.parentNode.removeChild(g)
		}
		if (I) {
			I.parentNode.removeChild(I)
		}
		if (w) {
			w.parentNode.removeChild(w)
		}
		if (E) {
			E.parentNode.removeChild(E)
		}
		if (b) {
			b.parentNode.removeChild(b)
		}
		if (y) {
			y.parentNode.removeChild(y)
		}
		if (f) {
			f.parentNode.removeChild(f)
		}
		if (h) {
			h.parentNode.removeChild(h)
		}
		if (x) {
			x.parentNode.removeChild(x)
		}
		if (v) {
			v.parentNode.removeChild(v)
		}
		if (_) {
			_.parentNode.removeChild(_)
		}
		if (m) {
			m.parentNode.removeChild(m)
		}
		if (A) {
			A.parentNode.removeChild(A)
		}
		r = null;
		return S
	}
	function rx(e, t) {
		if (t === "integer" && typeof e === "number") {
			if (e % 1 !== 0) {
				t = "float"
			}
		} else if (typeof e !== "number") {
			t = "string";
			if (typeof e === "boolean") {
				t = "boolean"
			}
		}
		return t
	}
	var nx = {
		graphId: "G",
		directedEdges: true,
		styles: "all",
		download: true,
		filename: "graph.graphml",
		nodes: undefined,
		edges: undefined,
		filter: "visible"
	};
	g.extend(function(e) {
		e.export.graphml = function(t) {
			if (t === void 0) t = {};
			var r = Ye(t, nx);
			var n = r.styles;
			var i = r.nodes;
			var o = r.edges;
			var s = r.download;
			var a = r.filename;
			var u = r.graphId;
			var l = r.directedEdges;
			var d = r.filter;
			var f = Hm(e, {
				styles: n,
				nodes: i,
				edges: o,
				filter: d
			}),
				h = ix(f, {
					graphId: u,
					directedEdges: l
				});
			if (s) {
				Ht(h, a, "text")
			}
			return Promise.resolve(h)
		}
	});

	function ix(e, t) {
		var r = Ft();

		function n(e, t) {
			var r = q(t);
			e.r = r[0];
			e.g = r[1];
			e.b = r[2]
		}
		function i(e, t, n, i, o) {
			n = n || {};
			var s = r.createElement(t);
			for (var a in n) {
				if (!n.hasOwnProperty(a)) {
					continue
				}
				var value = n[a];
				if (value !== undefined) {
					s.setAttribute(a, value)
				}
			}
			if (i !== undefined || o) {
				if (Object.prototype.toString.call(i) === "[object Object]") {
					i = JSON.stringify(i)
				}
				var u = r.createTextNode(i);
				s.appendChild(u)
			}
			e.appendChild(s);
			return s
		}
		var o = ["id", "source", "target"];
		var s = ["size", "x", "y", "shape", "color", "text"];
		var a = {
			size: {
				for :"all", type: "double"
			},
			x: {
				for :"node", type: "double"
			},
			y: {
				for :"node", type: "double"
			},
			shape: {
				for :"all", type: "string"
			},
			color: {
				for :"all", type: "string"
			},
			r: {
				for :"all", type: "int"
			},
			g: {
				for :"all", type: "int"
			},
			b: {
				for :"all", type: "int"
			},
			a: {
				for :"all", type: "double"
			},
			text: {
				for :"all", type: "string"
			}
		},
			u = [],
			l = [];

		function d(e, t) {
			var r = {
				id: e.id
			};
			s.forEach(function(i) {
				var value = e[i];
				if (i === "y" && value) {
					value = -parseFloat(value)
				}
				if (value !== undefined) {
					r[(t === "edge" ? "edge_" : "") + i] = value;
					if (i === "color") {
						n(r, value)
					}
				}
			});
			var i = e.data || {};
			rt(i, function(value, e) {
				if (s.indexOf(e) !== -1 || o.indexOf(e) !== -1) {
					return
				}
				if (!a[e]) {
					a[e] = {
						for :t, type: "string"
					}
				} else if (a[e].
				for !==t) {
					a[e].
					for = "all"
				}
				r[e] = value
			});
			if (t === "edge") {
				r.source = e.source;
				r.target = e.target;
				l.push(r)
			} else {
				u.push(r)
			}
		}
		e.nodes.forEach(function(e) {
			d(e, "node")
		});
		e.edges.forEach(function(e) {
			d(e, "edge")
		});
		var f = i(r, "graphml", {
			xmlns: "http://graphml.graphdrawing.org/xmlns",
			"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
			"xsi:schemaLocation": "http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd",
			"xmlns:y": "http://www.yworks.com/xml/graphml",
			"xmlns:java": "http://www.yworks.com/xml/yfiles-common/1.0/java",
			"xmlns:sys": "http://www.yworks.com/xml/yfiles-common/markup/primitives/2.0",
			"xmlns:x": "http://ww.yworks.com/xml/yfiles-common/markup/2.0"
		});
		rt(a, function(value, e) {
			if (value.
			for ==="node" || value.
			for ==="all") {
				i(f, "key", {
					"attr.name": e,
					"attr.type": value.type,
					for :"node",
					id: e
				})
			}
			if (value.
			for ==="edge" || value.
			for ==="all") {
				i(f, "key", {
					"attr.name": e,
					"attr.type": value.type,
					for :"edge",
					id: "edge_" + e
				})
			}
		});
		i(f, "key", {
			id: "nodegraphics",
			for :"node",
			"yfiles.type": "nodegraphics",
			"attr.type": "string"
		});
		i(f, "key", {
			id: "edgegraphics",
			for :"edge",
			"yfiles.type": "edgegraphics",
			"attr.type": "string"
		});
		var h = i(f, "graph", {
			edgedefault: t.directedEdges || t.directedEdges === undefined ? "directed" : "undirected",
			id: t.graphId ? t.graphId : "G",
			"parse.nodes": e.nodes.length,
			"parse.edges": e.edges.length,
			"parse.order": "nodesfirst"
		});

		function c(e, t) {
			var r = i(e, "data", {
				key: "nodegraphics"
			});
			var n = i(r, "y:ShapeNode");
			i(n, "y:Geometry", {
				x: t.x,
				y: t.y,
				width: t.size,
				height: t.size
			});
			i(n, "y:Fill", {
				color: K(t.color),
				transparent: false
			});
			i(n, "y:NodeLabel", null, t.text || "");
			i(n, "y:Shape", {
				type: t.shape
			})
		}
		function p(e, t) {
			var r = i(e, "data", {
				key: "edgegraphics"
			});
			var n = i(r, "y:PolyLineEdge");
			i(n, "y:LineStyle", {
				type: t.edge_type,
				color: K(t.edge_color),
				width: t.edge_size
			});
			i(n, "y:EdgeLabel", null, t.edge_label)
		}
		u.forEach(function(e) {
			var t = i(h, "node", {
				id: e.id
			});
			c(t, e);
			rt(e, function(value, e) {
				if (o.indexOf(e) !== -1) {
					return
				}
				i(t, "data", {
					key: e
				}, value, true)
			})
		});
		l.forEach(function(e) {
			var t = i(h, "edge", {
				id: e.id,
				source: e.source,
				target: e.target
			});
			p(t, e);
			rt(e, function(value, e) {
				if (o.indexOf(e) !== -1) {
					return
				}
				i(t, "data", {
					key: e
				}, value, true)
			})
		});
		var g = Pt(r);
		return '<?xml version="1.0" encoding="UTF-8"?>\n' + g
	}
	var ox = {
		pretty: false,
		styles: "all",
		download: true,
		filename: "graph.json",
		nodes: undefined,
		edges: undefined,
		filter: "visible"
	};
	g.extend(function(e) {
		e.export.json = function(t) {
			if (t === void 0) t = {};
			var r = Ye(t, ox);
			var n = r.pretty;
			var i = r.styles;
			var o = r.nodes;
			var s = r.edges;
			var a = r.download;
			var u = r.filename;
			var l = r.filter;
			var d = Hm(e, {
				styles: i,
				nodes: o,
				edges: s,
				filter: l
			}),
				f = n ? JSON.stringify(d, null, " ") : JSON.stringify(d);
			if (a) {
				Ht(f, u, "text")
			}
			return Promise.resolve(f)
		}
	});

	function sx(e, t, r, n) {
		if (n === void 0) n = false;
		var i = e.modules;
		var o = i.render;
		var s = i.graphics;
		var a = i.camera;
		var u = i.locate;
		var l = a.zoom,
			d = o.getDimensions();
		var f = d.width,
			h = d.height;
		var c = typeof t.margin === "number" ? t.margin : 10;
		var p, g, v, y;
		if (t.texts === false) {
			p = e.styles.setNodeTextsVisibility(false);
			g = e.styles.setEdgeTextsVisibility(false)
		}
		if (t.width && t.height) {
			v = t.width;
			y = t.height
		} else {
			v = f;
			y = h
		}
		var _ = u.nodesBoundingBox();
		var m;
		if (t.clip) {
			m = Math.min(v / (v + c), y / (y + c)) * l
		} else {
			m = Math.min(v / (_.width + c), y / (_.height + c))
		}
		var x = {
			zoom: m,
			x: _.cx,
			y: _.cy
		};
		var b = o.export(r, v, y, t.background, function() {
			a.reloadDimensions();
			s.drawAllSynchronously()
		});
		return new Promise(function(r) {
			b.whenImagesLoaded(function() {
				if (n) {
					b.setImagesEnabled(false)
				}
				a.reloadDimensions();
				a.setView(x);
				b.render();
				if (t.texts === false) {
					e.styles.setNodeTextsVisibility(p);
					e.styles.setEdgeTextsVisibility(g)
				}
				r({
					renderer: b,
					view: x
				})
			})
		})
	}
	g.extend(function(e) {
		e.export.png = function(t) {
			return lx(e, t, "png")
		};
		e.export.jpg = function(t) {
			return lx(e, t, "jpg")
		};
		e.export.tiff = function(t) {
			return lx(e, t, "tiff")
		};
		e.export.gif = function(t) {
			return lx(e, t, "gif")
		}
	});

	function ax(e) {
		return {
			download: true,
			filename: "graph." + e,
			clip: false,
			margin: 10,
			width: undefined,
			height: undefined,
			background: null,
			legend: true,
			texts: true,
			map: true,
			textWatermark: {
				content: null,
				fontFamily: "Arial",
				fontSize: 48,
				fontStyle: null,
				fontColor: "red",
				repeat: false,
				angle: 0,
				alpha: .65,
				space: 50,
				x: undefined,
				y: undefined
			},
			imageWatermark: {
				url: null,
				width: undefined,
				height: undefined,
				repeat: false,
				angle: 0,
				alpha: .65,
				space: 50,
				x: undefined,
				y: undefined
			}
		}
	}
	var ux = {
		png: ax("png"),
		jpg: ax("jpg"),
		tiff: ax("tiff"),
		gif: ax("gif")
	};

	function lx(e, t, r, n) {
		if (n === void 0) n = false;
		if (e.geo.enabled()) {
			delete t.background
		}
		t = Ye(t, ux[r]);
		var i = e.modules.camera.getView();
		return new Promise(function(o, s) {
			function a(e) {
				var r = e.renderer;
				var n = e.view;
				if (t.textWatermark.content) {
					px(r.canvas, t.textWatermark, dx, fx)
				}
				if (t.imageWatermark.url) {
					return new Promise(function(e) {
						$t(t.imageWatermark.url, function(i) {
							if (i) {
								t.imageWatermark.content = i;
								px(r.canvas, t.imageWatermark, cx, hx)
							}
							e({
								renderer: r,
								view: n
							})
						})
					})
				} else {
					return Promise.resolve({
						renderer: r,
						view: n
					})
				}
			}
			function u(e) {
				var t = e.width;
				var r = e.height;
				var n = Ut();
				return kt(t / n, r / n)
			}
			function l(r) {
				var n = r.renderer;
				var i = r.view;
				return new Promise(function(r, o) {
					if (t.legend && e.modules.legend.enabled()) {
						var s = n.canvas;
						var a = s.width;
						var l = s.height;
						var d = u(s);
						e.modules.legend.drawOnCanvas(d);
						s.getContext("2d").drawImage(d, 0, 0, a, l)
					}
					r({
						renderer: n,
						view: i
					})
				})
			}
			function d(e) {
				var n = e.toDataURL("image/" + r);
				if (t.download) {
					Ht(n, t.filename, "dataURL")
				}
				o(n)
			}
			function f(t, r) {
				var n = u(t);
				var i = t.width;
				var o = t.height;
				e.modules.geo.exportBackground(n, r).then(function() {
					n.getContext("2d").drawImage(t, 0, 0, i, o);
					d(n)
				})
			}
			function h(n) {
				var i = n.renderer;
				var a = n.view;
				try {
					var u = i.canvas;
					if (e.geo.enabled()) {
						f(u, a)
					} else {
						d(u)
					}
				} catch (n) {
					De(n);
					lx(e, t, r, true).then(o).
					catch (s)
				}
			}
			var c = function() {
					sx(e, t, Oi, n).then(a).then(l).then(h).then(function() {
						return e.modules.camera.setView(i)
					})
				};
			if (e.geo.enabled()) {
				e.modules.geo.whenReady(c)
			} else {
				c()
			}
		})
	}
	function dx(e, t, r, n) {
		e.textAlign = "center";
		e.textBaseline = "middle";
		e.fillText(t, r, n)
	}
	function fx(e, t, r) {
		return {
			width: e.measureText(t).width,
			height: r
		}
	}
	function hx(e, t, r, n, i) {
		return {
			width: n === undefined ? t.width : n,
			height: i === undefined ? t.height : i
		}
	}
	function cx(e, t, r, n, i, o) {
		e.drawImage(t, r - i / 2, n - o / 2, i, o)
	}
	function px(e, t, r, n) {
		if (!t) {
			return
		}
		if (typeof t !== "object") {
			t = {
				content: t
			}
		} else if (!t.content) {
			return
		}
		var i = e.getContext("2d");
		var o = t.fontFamily;
		var s = t.fontSize;
		var a = t.fontStyle;
		var u = t.fontColor;
		var l = t.repeat;
		var d = t.angle;
		var f = t.alpha;
		var h = t.space;
		var c = t.content;
		var p = e.width,
			g = e.height,
			v = t.x === undefined ? p / 2 : t.x,
			y = t.y === undefined ? g / 2 : t.y,
			_ = t.height,
			m = t.width;
		d = d / 180 * Math.PI;
		if (a) {
			i.font = a + " " + s + "px " + o
		} else {
			i.font = s + "px " + o
		}
		i.fillStyle = u;
		i.globalAlpha = f;
		var x = n(i, c, s, m, _);
		if (!l) {
			i.save();
			i.translate(v, y);
			i.rotate(d);
			r(i, c, 0, 0, x.width, x.height);
			i.restore()
		} else {
			var b = x.width + h,
				A = x.height + h,
				w = Math.sqrt(p * p + g * g);
			i.save();
			i.translate(0, 0);
			i.rotate(d);
			for (var E = 0; E < w; E += b) {
				for (var I = 0; I < w; I += A) {
					r(i, c, E, I, x.width, x.height);
					if (I !== 0) {
						r(i, c, E, -I, x.width, x.height)
					}
				}
			}
			i.restore()
		}
	}
	g.extend(function(e) {
		e.export.svg = function(t) {
			return vx(e, t)
		}
	});
	var gx = {
		download: true,
		filename: "graph.svg",
		width: undefined,
		height: undefined,
		background: null,
		texts: true
	};

	function vx(e, t) {
		t = Ye(t, gx);
		return new Promise(function(r, n) {
			var i = e.modules.camera.getView();
			sx(e, t, go).then(function(n) {
				var o = n.renderer;
				var s = n.view;
				var a = o.svg;
				a.setAttribute("version", "1.1");
				a.setAttribute("xmlns", "http://www.w3.org/2000/svg");
				a.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
				var u = '<?xml version="1.0" encoding="utf-8"?>' + Pt(a);
				if (t.download) {
					Ht(u, t.filename)
				}
				r(u);
				e.modules.camera.setView(i)
			})
		})
	}
	var yx = {
		what: undefined,
		dataProperties: undefined,
		download: true,
		filename: "graph.xlsx",
		nodes: undefined,
		edges: undefined,
		filter: "visible"
	};
	g.extend(function(e) {
		e.export.xlsx = function(t) {
			var r = Ye(t, yx, "what");
			var n = r.what;
			var i = r.nodes;
			var o = r.edges;
			var s = r.download;
			var a = r.filename;
			var u = r.dataProperties;
			var l = r.filter;
			var d = Hm(e, {
				styles: "none",
				nodes: i,
				edges: o,
				filter: l
			}),
				f = _x(d, {
					what: n,
					dataProperties: u
				});
			if (s) {
				Ht(f, a, "blob")
			}
			return Promise.resolve(f)
		}
	});

	function _x(e, t) {
		var r = t.what;
		var n = t.dataProperties;
		var i = re("xlsx", {
			globalVarName: "XLSX"
		}),
			o = new bx,
			s, a;
		if (!r) {
			s = xx(i, Qm(e.nodes, true, n));
			a = xx(i, Qm(e.edges, false, n))
		} else {
			if (r === "nodes") {
				s = xx(i, Qm(e.nodes, true, n))
			} else if (r === "edges") {
				a = xx(i, Qm(e.edges, false, n))
			} else {
				throw new TypeError('Invalid argument: "what" is not "nodes" or "edges", was ' + r)
			}
		}
		if (s) {
			o.SheetNames.push("Nodes");
			o.Sheets["Nodes"] = s
		}
		if (a) {
			o.SheetNames.push("Edges");
			o.Sheets["Edges"] = a
		}
		var u = i.write(o, {
			bookType: "xlsx",
			bookSST: false,
			type: "binary"
		});
		var l = Wt([Ax(u)]);
		return l
	}
	function mx(e) {
		if (e === undefined) {
			return ""
		} else if (e instanceof Date) {
			return e.toISOString()
		} else {
			return "" + e
		}
	}
	function xx(e, t) {
		var r = {};
		var n = {
			s: {
				c: 1e7,
				r: 1e7
			},
			e: {
				c: 0,
				r: 0
			}
		};
		for (var i = 0; i !== t.length; ++i) {
			var o = t[i];
			for (var s = 0; s !== o.length; ++s) {
				var value = o[s];
				if (n.s.r > i) {
					n.s.r = i
				}
				if (n.s.c > s) {
					n.s.c = s
				}
				if (n.e.r < i) {
					n.e.r = i
				}
				if (n.e.c < s) {
					n.e.c = s
				}
				var a = {
					v: mx(value)
				},
					u = e.utils.encode_cell({
						c: s,
						r: i
					});
				r[u] = a
			}
		}
		if (n.s.c < 1e7) {
			r["!ref"] = e.utils.encode_range(n)
		}
		return r
	}
	function bx() {
		if (!(this instanceof bx)) {
			return new bx
		}
		this.SheetNames = [];
		this.Sheets = {}
	}
	function Ax(e) {
		var t = new ArrayBuffer(e.length);
		var r = new Uint8Array(t);
		for (var n = 0; n !== e.length; ++n) {
			r[n] = e.charCodeAt(n) & 255
		}
		return t
	}
	g.
default = g;
	g.geometry = ti;
	g.algorithms = fi;
	g.utils = Cn;
	return g
});