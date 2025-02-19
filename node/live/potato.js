function j(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var E = { exports: {} }, C = { exports: {} };
(function(t, n) {
  (function(e) {
    n = e(), t.exports = n;
  })(function() {
    var e = function(i) {
      return i instanceof Function;
    }, s = function(i) {
      var l = Array.prototype.slice.call(arguments, 1);
      for (var h in l) {
        var f = l[h];
        if (typeof f == "object")
          for (var c in f)
            i[c] = f[c];
      }
      return i;
    }, o = {
      // internal object for indicating that class objects don't have a class object themselves,
      // may not be used by users
      _isClassObject: !1
    }, a = !1, r = function() {
    };
    return r._subClasses = [], r.prototype.init = function() {
    }, r._extend = function(i, l, h) {
      i === void 0 && (i = {}), l === void 0 && (l = {}), h === void 0 && (h = {}), h = s({}, o, h);
      var f = function() {
        a || (this._class = f, this.init instanceof Function && this.init.apply(this, arguments));
      }, c = this;
      a = !0;
      var d = new c();
      a = !1;
      var u = c.prototype;
      f.prototype = d, f.prototype.constructor = f, f._superClass = c, f._subClasses = [], c._subClasses.push(f), f._extend = c._extend, f._extends = function(O) {
        return this._superClass == r ? !1 : O == this._superClass || O == r ? !0 : this._superClass._extends(O);
      };
      for (var p in i) {
        var g = Object.getOwnPropertyDescriptor(i, p), v = g.value;
        if (v !== null && typeof v == "object" && v.descriptor)
          Object.defineProperty(d, p, v);
        else if (!("value" in g) && ("set" in g || "get" in g))
          Object.defineProperty(d, p, g);
        else {
          d[p] = v;
          var m = u[p];
          e(v) && e(m) && v !== m && (v._super = m);
        }
      }
      if (!h._isClassObject) {
        var b = c._members === void 0 ? r : c._members._class, R = s({}, h, { _isClassObject: !0 }), y = b._extend(l, {}, R);
        y._instanceClass = f, f._members = new y();
      }
      return f;
    }, r._convert = function(i, l) {
      var h = i.prototype;
      return h.init = function() {
        var f = this._origin = r._construct(i, arguments);
        Object.keys(f).forEach(function(c) {
          f.hasOwnProperty(c) && Object.defineProperty(this, c, {
            get: function() {
              return f[c];
            }
          });
        }, this);
      }, r._extend(h, {}, l);
    }, r._construct = function(i, l) {
      l === void 0 && (l = []);
      var h = function() {
        return i.apply(this, l);
      };
      return h.prototype = i.prototype, new h();
    }, r._superDescriptor = function(i, l) {
      if ("_class" in i && i instanceof i._class && (i = i._class), "_extends" in i && i._extends instanceof Function && i._extends(this))
        return Object.getOwnPropertyDescriptor(i._superClass.prototype, l);
    }, r;
  });
})(C, C.exports);
var P = C.exports, S = P, _ = S._extend({
  //-----------------------------------
  // Constructor
  //-----------------------------------
  init: function(t, n, e) {
    t = t instanceof Array ? t : [t], this._map = {}, this._list = [], this.callback = n, this.keyFields = t, this.isHashArray = !0, this.options = e || {
      ignoreDuplicates: !1
    }, n && n("construct");
  },
  //-----------------------------------
  // add()
  //-----------------------------------
  addOne: function(t) {
    var n = !1;
    for (var e in this.keyFields) {
      e = this.keyFields[e];
      var s = this.objectAt(t, e);
      if (s)
        if (this.has(s)) {
          if (this.options.ignoreDuplicates)
            return;
          if (this._map[s].indexOf(t) != -1) {
            n = !0;
            continue;
          }
          this._map[s].push(t);
        } else this._map[s] = [t];
    }
    (!n || this._list.indexOf(t) == -1) && this._list.push(t);
  },
  add: function() {
    for (var t = 0; t < arguments.length; t++)
      this.addOne(arguments[t]);
    return this.callback && this.callback("add", Array.prototype.slice.call(arguments, 0)), this;
  },
  addAll: function(t) {
    if (t.length < 100)
      this.add.apply(this, t);
    else
      for (var n = 0; n < t.length; n++)
        this.add(t[n]);
    return this;
  },
  addMap: function(t, n) {
    return this._map[t] = n, this.callback && this.callback("addMap", {
      key: t,
      obj: n
    }), this;
  },
  //-----------------------------------
  // Intersection, union, etc.
  //-----------------------------------
  /**
   * Returns a new HashArray that contains the intersection between this (A) and the hasharray passed in (B). Returns A ^ B.
   */
  intersection: function(t) {
    var n = this;
    if (!t || !t.isHashArray)
      throw Error("Cannot HashArray.intersection() on a non-hasharray object. You passed in: ", t);
    var e = this.clone(null, !0), s = this.clone(null, !0).addAll(this.all.concat(t.all));
    return s.all.forEach(function(o) {
      n.collides(o) && t.collides(o) && e.add(o);
    }), e;
  },
  /**
   * Returns a new HashArray that contains the complement (difference) between this hash array (A) and the hasharray passed in (B). Returns A - B.
   */
  complement: function(t) {
    if (!t || !t.isHashArray)
      throw Error("Cannot HashArray.complement() on a non-hasharray object. You passed in: ", t);
    var n = this.clone(null, !0);
    return this.all.forEach(function(e) {
      t.collides(e) || n.add(e);
    }), n;
  },
  //-----------------------------------
  // Retrieval
  //-----------------------------------
  get: function(t) {
    if (this.has(t))
      return !(this._map[t] instanceof Array) || this._map[t].length != 1 ? this._map[t] : this._map[t][0];
  },
  getAll: function(t) {
    if (t = t instanceof Array ? t : [t], t[0] == "*")
      return this.all;
    var n = new _(this.keyFields);
    for (var e in t)
      n.add.apply(n, this.getAsArray(t[e]));
    return n.all;
  },
  getAsArray: function(t) {
    return this._map[t] || [];
  },
  getUniqueRandomIntegers: function(t, n, e) {
    var s = [], o = {};
    for (t = Math.min(Math.max(e - n, 1), t); s.length < t; ) {
      var a = Math.floor(n + Math.random() * (e + 1));
      o[a] || (o[a] = !0, s.push(a));
    }
    return s;
  },
  sample: function(t, n) {
    var e = this.all, s = [];
    n && (e = this.getAll(n));
    for (var o = this.getUniqueRandomIntegers(t, 0, e.length - 1), a = 0; a < o.length; a++)
      s.push(e[o[a]]);
    return s;
  },
  //-----------------------------------
  // Peeking
  //-----------------------------------
  has: function(t) {
    return this._map.hasOwnProperty(t);
  },
  collides: function(t) {
    for (var n in this.keyFields)
      if (this.has(this.objectAt(t, this.keyFields[n])))
        return !0;
    return !1;
  },
  hasMultiple: function(t) {
    return this._map[t] instanceof Array;
  },
  //-----------------------------------
  // Removal
  //-----------------------------------
  removeByKey: function() {
    for (var t = [], n = 0; n < arguments.length; n++) {
      var e = arguments[n], s = this._map[e].concat();
      if (s) {
        t = t.concat(s);
        for (var o in s) {
          var a = s[o];
          for (var r in this.keyFields) {
            var i = this.objectAt(a, this.keyFields[r]);
            if (i && this.has(i)) {
              var r = this._map[i].indexOf(a);
              r != -1 && this._map[i].splice(r, 1), this._map[i].length == 0 && delete this._map[i];
            }
          }
          this._list.splice(this._list.indexOf(a), 1);
        }
      }
      delete this._map[e];
    }
    return this.callback && this.callback("removeByKey", t), this;
  },
  remove: function() {
    for (var t = 0; t < arguments.length; t++) {
      var n = arguments[t];
      for (var s in this.keyFields) {
        var e = this.objectAt(n, this.keyFields[s]);
        if (e) {
          var s = this._map[e].indexOf(n);
          if (s != -1)
            this._map[e].splice(s, 1);
          else
            throw new Error("HashArray: attempting to remove an object that was never added!" + e);
          this._map[e].length == 0 && delete this._map[e];
        }
      }
      var s = this._list.indexOf(n);
      if (s != -1)
        this._list.splice(s, 1);
      else
        throw new Error("HashArray: attempting to remove an object that was never added!" + e);
    }
    return this.callback && this.callback("remove", arguments), this;
  },
  removeAll: function() {
    var t = this._list.concat();
    return this._map = {}, this._list = [], this.callback && this.callback("remove", t), this;
  },
  //-----------------------------------
  // Utility
  //-----------------------------------
  objectAt: function(t, n) {
    if (typeof n == "string")
      return t[n];
    for (var e = n.concat(); e.length && t; )
      t = t[e.shift()];
    return t;
  },
  //-----------------------------------
  // Iteration
  //-----------------------------------
  forEach: function(t, n) {
    t = t instanceof Array ? t : [t];
    var e = this.getAll(t);
    return e.forEach(n), this;
  },
  forEachDeep: function(t, n, e) {
    t = t instanceof Array ? t : [t];
    var s = this, o = this.getAll(t);
    return o.forEach(function(a) {
      e(s.objectAt(a, n), a);
    }), this;
  },
  //-----------------------------------
  // Cloning
  //-----------------------------------
  clone: function(t, n) {
    var e = new _(this.keyFields.concat(), t || this.callback);
    return n || e.add.apply(e, this.all.concat()), e;
  },
  //-----------------------------------
  // Mathematical
  //-----------------------------------
  sum: function(t, n, e) {
    var s = this, o = 0;
    return this.forEachDeep(t, n, function(a, r) {
      e !== void 0 && (a *= s.objectAt(r, e)), o += a;
    }), o;
  },
  average: function(t, n, e) {
    var s = 0, o = 0, a = 0, r = this;
    return e !== void 0 && this.forEachDeep(t, e, function(i) {
      a += i;
    }), this.forEachDeep(t, n, function(i, l) {
      e !== void 0 && (i *= r.objectAt(l, e) / a), s += i, o++;
    }), e !== void 0 ? s : s / o;
  },
  //-----------------------------------
  // Filtering
  //-----------------------------------
  filter: function(t, n) {
    var e = this, s = typeof n == "function" ? n : a, o = new _(this.keyFields);
    return o.addAll(this.getAll(t).filter(s)), o;
    function a(r) {
      var i = e.objectAt(r, n);
      return i !== void 0 && i !== !1;
    }
  }
});
Object.defineProperty(_.prototype, "all", {
  get: function() {
    return this._list;
  }
});
Object.defineProperty(_.prototype, "map", {
  get: function() {
    return this._map;
  }
});
var T = _;
typeof window < "u" && (window.HashArray = _);
var I = T, x = I, D = 64, w = /^[\s]*$/, H = [
  {
    regex: /[åäàáâãæ]/ig,
    alternate: "a"
  },
  {
    regex: /[èéêë]/ig,
    alternate: "e"
  },
  {
    regex: /[ìíîï]/ig,
    alternate: "i"
  },
  {
    regex: /[òóôõö]/ig,
    alternate: "o"
  },
  {
    regex: /[ùúûü]/ig,
    alternate: "u"
  },
  {
    regex: /[æ]/ig,
    alternate: "ae"
  }
];
String.prototype.replaceCharAt = function(t, n) {
  return this.substr(0, t) + n + this.substr(t + n.length);
};
var A = function(t, n) {
  this.options = n || {}, this.options.ignoreCase = this.options.ignoreCase === void 0 ? !0 : this.options.ignoreCase, this.options.maxCacheSize = this.options.maxCacheSize || D, this.options.cache = this.options.hasOwnProperty("cache") ? this.options.cache : !0, this.options.splitOnRegEx = this.options.hasOwnProperty("splitOnRegEx") ? this.options.splitOnRegEx : /\s/g, this.options.splitOnGetRegEx = this.options.hasOwnProperty("splitOnGetRegEx") ? this.options.splitOnGetRegEx : this.options.splitOnRegEx, this.options.min = this.options.min || 1, this.options.keepAll = this.options.hasOwnProperty("keepAll") ? this.options.keepAll : !1, this.options.keepAllKey = this.options.hasOwnProperty("keepAllKey") ? this.options.keepAllKey : "id", this.options.idFieldOrFunction = this.options.hasOwnProperty("idFieldOrFunction") ? this.options.idFieldOrFunction : void 0, this.options.expandRegexes = this.options.expandRegexes || H, this.options.insertFullUnsplitKey = this.options.hasOwnProperty("insertFullUnsplitKey") ? this.options.insertFullUnsplitKey : !1, this.keyFields = t ? t instanceof Array ? t : [t] : [], this.root = {}, this.size = 0, this.options.cache && (this.getCache = new x("key"));
};
function F(t, n) {
  return n.length === 1 ? t[n[0]] : F(t[n[0]], n.slice(1, n.length));
}
A.prototype = {
  add: function(t, n) {
    this.options.cache && this.clearCache(), typeof n == "number" && (n = void 0);
    var e = n || this.keyFields;
    for (var s in e) {
      var o = e[s], a = o instanceof Array, r = a ? F(t, o) : t[o];
      if (r) {
        r = r.toString();
        for (var i = this.expandString(r), l = 0; l < i.length; l++) {
          var h = i[l];
          this.map(h, t);
        }
      }
    }
  },
  /**
   * By default using the options.expandRegexes, given a string like 'ö är bra', this will expand it to:
   *
   * ['ö är bra', 'o är bra', 'ö ar bra', 'o ar bra']
   *
   * By default this was built to allow for internationalization, but it could be also be expanded to
   * allow for word alternates, etc. like spelling alternates ('teh' and 'the').
   *
   * This is used for insertion! This should not be used for lookup since if a person explicitly types
   * 'ä' they probably do not want to see all results for 'a'.
   *
   * @param value The string to find alternates for.
   * @returns {Array} Always returns an array even if no matches.
   */
  expandString: function(t) {
    var n = [t];
    if (this.options.expandRegexes && this.options.expandRegexes.length)
      for (var e = 0; e < this.options.expandRegexes.length; e++)
        for (var s = this.options.expandRegexes[e], o; (o = s.regex.exec(t)) !== null; ) {
          var a = t.replaceCharAt(o.index, s.alternate);
          n.push(a);
        }
    return n;
  },
  addAll: function(t, n) {
    for (var e = 0; e < t.length; e++)
      this.add(t[e], n);
  },
  reset: function() {
    this.root = {}, this.size = 0;
  },
  clearCache: function() {
    this.getCache = new x("key");
  },
  cleanCache: function() {
    for (; this.getCache.all.length > this.options.maxCacheSize; )
      this.getCache.remove(this.getCache.all[0]);
  },
  addFromObject: function(t, n) {
    this.options.cache && this.clearCache(), n = n || "value", this.keyFields.indexOf("_key_") == -1 && this.keyFields.push("_key_");
    for (var e in t) {
      var s = { _key_: e };
      s[n] = t[e], this.add(s);
    }
  },
  map: function(t, n) {
    if (this.options.splitOnRegEx && this.options.splitOnRegEx.test(t)) {
      var e = t.split(this.options.splitOnRegEx), s = e.filter(function(c) {
        return w.test(c);
      }), o = e.filter(function(c) {
        return c === t;
      }), a = o.length + s.length === e.length;
      if (!a) {
        for (var r = 0, i = e.length; r < i; r++)
          w.test(e[r]) || this.map(e[r], n);
        if (!this.options.insertFullUnsplitKey)
          return;
      }
    }
    this.options.cache && this.clearCache(), this.options.keepAll && (this.indexed = this.indexed || new x([this.options.keepAllKey]), this.indexed.add(n)), this.options.ignoreCase && (t = t.toLowerCase());
    var l = this.keyToArr(t), h = this;
    f(l, n, this.root);
    function f(c, d, u) {
      if (c.length == 0) {
        u.value = u.value || [], u.value.push(d);
        return;
      }
      var p = c.shift();
      u[p] || h.size++, u[p] = u[p] || {}, f(c, d, u[p]);
    }
  },
  keyToArr: function(t) {
    var n;
    if (this.options.min && this.options.min > 1) {
      if (t.length < this.options.min)
        return [];
      n = [t.substr(0, this.options.min)], n = n.concat(t.substr(this.options.min).split(""));
    } else n = t.split("");
    return n;
  },
  findNode: function(t) {
    return n(this.keyToArr(t), this.root);
    function n(e, s) {
      if (s) {
        if (e.length == 0) return s;
        var o = e.shift();
        return n(e, s[o]);
      }
    }
  },
  _getCacheKey: function(t, n) {
    var e = t;
    return n && (e = t + "_" + n), e;
  },
  _get: function(t, n) {
    t = this.options.ignoreCase ? t.toLowerCase() : t;
    var e, s;
    if (this.options.cache && (e = this.getCache.get(this._getCacheKey(t, n))))
      return e.value;
    for (var o = void 0, a = this.options.indexField ? [this.options.indexField] : this.keyFields, r = this.options.splitOnGetRegEx ? t.split(this.options.splitOnGetRegEx) : [t], i = 0, l = r.length; i < l; i++)
      if (!(this.options.min && r[i].length < this.options.min)) {
        var h = new x(a);
        (s = this.findNode(r[i])) && d(s, h), o = o ? o.intersection(h) : h;
      }
    var f = o ? o.all : [];
    if (this.options.cache) {
      var c = this._getCacheKey(t, n);
      this.getCache.add({ key: c, value: f }), this.cleanCache();
    }
    return f;
    function d(u, p) {
      if (!(n && p.all.length === n)) {
        if (u.value && u.value.length)
          if (!n || p.all.length + u.value.length < n)
            p.addAll(u.value);
          else {
            p.addAll(u.value.slice(0, n - p.all.length));
            return;
          }
        for (var g in u) {
          if (n && p.all.length === n)
            return;
          g != "value" && d(u[g], p);
        }
      }
    }
  },
  get: function(t, n, e) {
    var s = this.options.indexField ? [this.options.indexField] : this.keyFields, o = void 0, a = void 0;
    if (n && !this.options.idFieldOrFunction)
      throw new Error("To use the accumulator, you must specify and idFieldOrFunction");
    t = t instanceof Array ? t : [t];
    for (var r = 0, i = t.length; r < i; r++) {
      var l = this._get(t[r], e);
      n ? a = n(a, t[r], l, this) : o = o ? o.addAll(l) : new x(s).addAll(l);
    }
    return n ? a : o.all;
  },
  search: function(t, n, e) {
    return this.get(t, n, e);
  },
  getId: function(t) {
    return typeof this.options.idFieldOrFunction == "function" ? this.options.idFieldOrFunction(t) : t[this.options.idFieldOrFunction];
  }
};
A.UNION_REDUCER = function(t, n, e, s) {
  if (t === void 0)
    return e;
  var o = {}, a, r, i = Math.max(t.length, e.length), l = [], h = 0;
  for (a = 0; a < i; a++)
    a < t.length && (r = s.getId(t[a]), o[r] = o[r] ? o[r] : 0, o[r]++, o[r] === 2 && (l[h++] = t[a])), a < e.length && (r = s.getId(e[a]), o[r] = o[r] ? o[r] : 0, o[r]++, o[r] === 2 && (l[h++] = e[a]));
  return l;
};
E.exports = A;
E.exports.default = A;
var L = E.exports, N = L;
const U = /* @__PURE__ */ j(N);
(function() {
  function t(a) {
    const r = document.getElementById(a);
    if (r !== null)
      try {
        return JSON.parse(r.textContent);
      } catch (i) {
        console.warn(`could not parse json element '${a}'. Error: ${i}`);
      }
  }
  function n(a) {
    const r = document.getElementById("instance-text");
    if (r === null) {
      console.warn("cannot find instance text");
      return;
    }
    const i = r.textContent;
    if (!i || i === "") {
      console.log("text content in instance");
      return;
    }
    const l = new U(void 0, {
      splitOnRegEx: !1
    });
    a.map((u) => l.map(u, u));
    const h = i.split(" ");
    let f = !1, c = "", d = "";
    for (const u of h) {
      const p = c + u, g = l.search(p);
      if (g.length === 0 && f) {
        d += `
                <mark aria-hidden="true" class="emphasis">${c}</mark>
                `, d += u + " ", c = "", f = !1;
        continue;
      }
      if (g.length === 0) {
        d += u + " ", c = "";
        continue;
      }
      if (g.length === 1 && g[0] === p) {
        d += `
                <mark aria-hidden="true" class="emphasis">${p}</mark>
                `, c = "", f = !1;
        continue;
      }
      g.includes(p) && (f = !0), c = p + " ";
    }
    r.innerHTML = d;
  }
  function e(a) {
    var r;
    try {
      for (const i of a) {
        const l = document.getElementById(i.name);
        if (l === null) {
          console.warn("no elem with id " + i.name);
          continue;
        }
        if (l.classList.contains("multiselect") || l.classList.contains("radio")) {
          const h = document.getElementById(i.name + ":::" + i.label);
          if (l === null) {
            console.warn(`no elem with id ${i.name + ":::" + i.label}`);
            continue;
          }
          (r = h == null ? void 0 : h.parentElement) == null || r.classList.add("suggestion");
        }
      }
    } catch {
      console.error("could not suggest elements");
    }
  }
  const s = t("emphasis");
  s !== void 0 && n(s);
  const o = t("suggestions");
  o !== void 0 && e(o);
})();
