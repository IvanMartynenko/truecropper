var _ = Object.defineProperty;
var P = (n, t, e) => t in n ? _(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var h = (n, t, e) => (P(n, typeof t != "symbol" ? t + "" : t, e), e);
const g = "truecropper", u = {
  base: g,
  img: `${g}__image`,
  background: `${g}__background`,
  new: `${g}__new-selection`,
  selection: `${g}__selection`,
  handle: `${g}__handle`,
  hanleds: `${g}__handles`,
  valueX: `${g}X`,
  valueY: `${g}Y`,
  valueWidth: `${g}Width`,
  valueHeight: `${g}Height`,
  valueStatus: `${g}Status`
}, q = {
  srcEmpty: "Image src not provided",
  elementNotFound: "Unable to find element",
  parentNotContainDiv: "parent element can be exists"
};
class y extends Error {
  constructor(e) {
    const i = q[e];
    super(i);
    h(this, "data");
    Object.setPrototypeOf(this, y.prototype), this.name = "TrueCropperHtmlError", this.data = null;
  }
}
class x extends Error {
  constructor(e, i) {
    super(e);
    h(this, "data");
    Object.setPrototypeOf(this, x.prototype), this.name = "TrueCropperImageError", this.data = {
      target: i.target,
      coordinates: i.coordinates ? { ...i.coordinates } : void 0,
      targetSize: { ...i.targetSize },
      source: i.source,
      sourceSize: { ...i.sourceSize }
    };
  }
  static startSize(e, i, s, o, r) {
    const a = `The ${e} (${i.x}x${i.y}:${s.width}x${s.height}) exceeds the ${o} (${r.width}x${r.height})`, l = {
      target: e,
      coordinates: i,
      targetSize: s,
      source: o,
      sourceSize: r
    };
    return new this(a, l);
  }
  static size(e, i, s, o) {
    const r = `The ${e} (${i.width}x${i.height}) exceeds the ${s} (${o.width}x${o.height})`, a = {
      target: e,
      coordinates: void 0,
      targetSize: i,
      source: s,
      sourceSize: o
    };
    return new this(r, a);
  }
}
class w extends Error {
  constructor(e) {
    super(e);
    h(this, "data");
    Object.setPrototypeOf(this, w.prototype), this.name = "TrueCropperOptionsError", this.data = null;
  }
  static aspectRatio(e, i, s) {
    const o = `The specified aspect ratio (${i}) and calculated minimum dimensions (width/height = ${e}) are greater than (${s}). This might be due to a rounding error on the server side or incorrect minimum sizes.`;
    return new this(o);
  }
  static new(e, i, s = !0) {
    const o = s ? `${e} must be of type ${i}` : `${e} must not be of type ${i}`;
    return new this(o);
  }
}
const Z = (n) => {
  let t = null;
  if (typeof n == "string") {
    if (t = document.querySelector(n), t === null)
      throw new y("elementNotFound");
  } else
    t = n;
  if (!(t instanceof HTMLImageElement))
    throw new y("srcEmpty");
  let e = t.parentElement;
  if (!e)
    throw new y("parentNotContainDiv");
  return e.classList.contains(u.base) || (e = null), [t, e];
}, b = (n, t = void 0) => {
  const e = document.createElement("div");
  return e.className = n, t && t.appendChild(e), e;
}, R = (n, t) => {
  if (t.savedCoordinate < 0)
    return { flipped: !1, coordinate: null, size: null, point: 0.5 };
  const e = n < t.savedCoordinate, i = t.left !== e, s = t.savedCoordinate, o = Math.abs(t.savedCoordinate - n), r = Number(e);
  return {
    flipped: i,
    coordinate: s,
    size: o,
    point: r
  };
}, G = (n, t, e) => {
  const i = R(n.x, t), s = R(n.y, e);
  return {
    flipped: { x: i.flipped, y: s.flipped },
    newBox: {
      coordinates: { x: i.coordinate, y: s.coordinate },
      size: { width: i.size, height: s.size },
      points: { x: i.point, y: s.point }
    }
  };
}, J = (n, t, e, i, s) => {
  const o = (m, f, p) => p === "relative" ? m * s[f] : p === "percent" ? m >= 1 ? i[f] * (m / 100) : i[f] * m : m, r = {
    width: o(t.width, "width", t.unit),
    height: o(t.height, "height", t.unit)
  }, a = {
    width: o(e.width, "width", e.unit),
    height: o(e.height, "height", e.unit)
  }, l = {
    x: o(n.x, "width", n.unit),
    y: o(n.y, "height", n.unit)
  }, d = {
    width: o(n.width, "width", n.unit),
    height: o(n.height, "height", n.unit)
  };
  return { coordinates: l, size: d, minSize: r, maxSize: a };
}, K = (n, t, e, i, s) => {
  const o = I(
    n.minSize,
    { width: 1, height: 1 },
    e
  );
  let r = I(n.maxSize, t, e), a = I(n.size, t, e);
  r = et(r, t, e);
  let l = n.coordinates;
  if (i) {
    const d = it(
      l,
      a,
      o,
      r,
      t,
      e,
      s.x,
      s.y
    );
    l = d.coordinates, a = d.size;
  }
  return { coordinates: l, size: a, minSize: o, maxSize: r, imgProps: t, aspectRatio: e };
}, Q = ({
  coordinates: n,
  minSize: t,
  maxSize: e,
  size: i,
  imgProps: s
}) => {
  const o = (r, a, l, d) => {
    if (r.width > a.width || r.height > a.height)
      throw x.size(l, r, d, a);
  };
  if (o(t, s, "minSize", "imageSize"), o(t, e, "minSize", "maxSize"), o(t, i, "minSize", "startSize"), n.x + i.width > s.width || n.y + i.height > s.height)
    throw x.startSize(
      "startSize",
      n,
      i,
      "imageSize",
      s
    );
}, N = ({
  size: n,
  minSize: t,
  maxSize: e,
  aspectRatio: i
}) => {
  const s = { ...n };
  return e && (s.width > e.width && (s.width = e.width, s.height = i ? e.width / i : s.height), s.height > e.height && (s.width = i ? e.height * i : s.width, s.height = e.height)), t && (s.width < t.width && (s.width = t.width, s.height = i ? t.width / i : s.height), s.height < t.height && (s.width = i ? t.height * i : s.width, s.height = t.height)), s;
}, W = (n, t, e) => {
  const i = n * t;
  return { width: i, height: i / e };
}, U = (n, t, e) => {
  const i = n * t;
  return { width: i * e, height: i };
}, tt = (n, t, e) => {
  let i = { ...n.size };
  if (e === 0)
    return i;
  const s = n.isMultuAxis ? i.height * e >= i.width : n.isVerticalMovement, o = n.points.x === 1 || n.points.x === 0 ? 1 : 2, r = n.points.y === 1 || n.points.y === 0 ? 1 : 2;
  return s ? i = { width: i.height * e, height: i.height } : i = { width: i.width, height: i.width / e }, n.coordinates.x + i.width * (1 - n.points.x) > t.width && (i = W(
    t.width - n.coordinates.x,
    o,
    e
  )), n.coordinates.y + i.height * (1 - n.points.y) > t.height && (i = U(
    t.height - n.coordinates.y,
    r,
    e
  )), n.coordinates.x - i.width * n.points.x < 0 && (i = W(n.coordinates.x, o, e)), n.coordinates.y - i.height * n.points.y < 0 && (i = U(n.coordinates.y, r, e)), i;
}, I = (n, t, e) => {
  const i = { ...n };
  return e && !i.width && !i.height && (e > 1 ? i.height = t.height : i.width = t.width), i.width || (i.width = e ? i.height * e : t.width), i.height || (i.height = e ? i.width / e : t.height), i;
}, et = (n, t, e) => {
  let i = { ...n };
  return e && (i.width > i.height * e ? i.width = i.height * e : i.height = i.width / e), i = N({
    size: i,
    maxSize: t,
    aspectRatio: e
  }), i;
}, it = (n, t, e, i, s, o, r, a) => {
  const l = { ...t }, d = { ...n }, m = Math.min(i.width, s.width - n.x), f = Math.min(i.height, s.height - n.y), p = N({
    size: l,
    maxSize: { width: m, height: f },
    minSize: e,
    aspectRatio: o
  });
  return l.width = p.width, l.height = p.height, d.x = r ? (s.width - l.width) / 2 : n.x, d.y = a ? (s.height - l.height) / 2 : n.y, { coordinates: d, size: l };
};
class st {
  /**
   * Creates a new Box instance.
   * @constructor
   * @param {BoxInitInterface} - Initialization parameters.
   */
  constructor({
    coordinates: t,
    size: e,
    minSize: i,
    maxSize: s,
    imgProps: o,
    aspectRatio: r
  }) {
    h(this, "coordinates");
    h(this, "size");
    h(this, "minSize");
    h(this, "maxSize");
    h(this, "imgSize");
    h(this, "aspectRatio");
    this.coordinates = { ...t }, this.size = { ...e }, this.minSize = { ...i }, this.maxSize = { ...s }, this.imgSize = { ...o }, this.aspectRatio = r;
  }
  /**
   * Moves the box to the specified coordinates within the boundaries of the image.
   * @param {Coordinates} coordinates - The new x and y coordinates for the box.
   * @returns {void}
   */
  move(t) {
    this.coordinates.x = Math.min(
      Math.max(t.x, 0),
      this.imgSize.width - this.size.width
    ), this.coordinates.y = Math.min(
      Math.max(t.y, 0),
      this.imgSize.height - this.size.height
    );
  }
  /**
   * Resizes the box to a new size.
   * @param {Size} size - The new size for the box.
   * @param {Points} points - The relative points for resizing.
   * @returns {void}
   */
  resize(t, e) {
    const i = this.coordinates.x + this.size.width * e.x, s = this.coordinates.y + this.size.height * e.y;
    this.coordinates = {
      x: i - t.width * e.x,
      y: s - t.height * e.y
    }, this.size = { width: t.width, height: t.height };
  }
  /**
   * Scales the box by a factor and relative points.
   * @param {number} factor - The scaling factor.
   * @param {Points} points - The relative points for scaling.
   * @returns {void}
   */
  scale(t, e) {
    const i = this.size.width * t, s = this.size.height * t;
    this.resize({ width: i, height: s }, e);
  }
  /**
   * Retrieves the current coordinates of the box.
   * @returns {Coordinates} The current x and y coordinates of the box.
   */
  getCoourdinates() {
    return { x: this.coordinates.x, y: this.coordinates.y };
  }
  /**
   * Retrieves the current box.
   * @returns {BoxProps} The current x and y coordinates, width, and height of the box.
   */
  getValue() {
    return {
      x: this.coordinates.x,
      y: this.coordinates.y,
      width: this.size.width,
      height: this.size.height
    };
  }
  /**
   * Retrieves the current real(natural) value of the box including coordinates, width, and height.
   * @returns {BoxProps} The current x and y coordinates, width, and height of the box.
   */
  getValueReal() {
    return this.getValue();
  }
  /**
   * Retrieves the current value of the box relative to a specified width and height.
   * @param {Size} size - The width and height for calculating relative values.
   * @returns {BoxProps} The current x and y coordinates, width, and height of the box relative to the specified width and height.
   */
  getValueRelative({ width: t, height: e }) {
    return {
      x: this.coordinates.x * t,
      y: this.coordinates.y * e,
      width: this.size.width * t,
      height: this.size.height * e
    };
  }
  /**
   * Retrieves the current value of the box as a percentage of the image size.
   * @returns {BoxProps} The current x and y coordinates, width, and height of the box as a percentage of the image size.
   */
  getValuePercent() {
    return {
      x: this.coordinates.x / this.imgSize.width * 100,
      y: this.coordinates.y / this.imgSize.height * 100,
      width: this.size.width / this.imgSize.width * 100,
      height: this.size.height / this.imgSize.height * 100
    };
  }
  /**
   * Calculates the coordinates of the opposite corner of the box based on relative points.
   * @param {Points} points - The relative points determining the opposite corner.
   * @returns {Coordinates} The calculated x and y coordinates of the opposite corner.
   */
  getOppositeCornerCoordinates(t) {
    const e = t.x === 0.5 ? -1 : this.coordinates.x + this.size.width * (1 - t.x), i = t.y === 0.5 ? -1 : this.coordinates.y + this.size.height * (1 - t.y);
    return { x: e, y: i };
  }
  /**
   * Prepares and applies new size and coordinates for the box based on the provided data.
   * @param {Idd} newBox - The new box data to apply.
   * @returns {boolean} Returns true if the new size and coordinates were successfully applied, false otherwise.
   */
  prepareAndApplyNewSizeAndCoordinates(t) {
    const e = this.prepareSizeAndCoordinates(t);
    return e.size.width === 0 || e.size.height === 0 ? !1 : (this.size = this.adjustAndCalculateSize(e), this.coordinates = this.adjustAndCalculateCoordinate(
      e.coordinates,
      this.size,
      e.points
    ), !0);
  }
  /**
   * Prepares and calculates the size and coordinates for the new box based on the provided data.
   * @param {Idd} newBox - The new box data to calculate size and coordinates for.
   * @returns {Idd2} An object containing the calculated size, coordinates, and other relevant properties.
   */
  prepareSizeAndCoordinates(t) {
    const e = {
      width: t.size.width ?? this.size.width,
      height: t.size.height ?? this.size.height
    }, i = {
      x: t.coordinates.x ?? this.coordinates.x + this.size.width / 2,
      y: t.coordinates.y ?? this.coordinates.y + this.size.height / 2
    }, s = t.coordinates.y !== null, o = s && t.coordinates.x !== null;
    return {
      size: e,
      coordinates: i,
      isVerticalMovement: s,
      isMultuAxis: o,
      points: t.points
    };
  }
  /**
   * Adjusts and calculates the size based on aspect ratio and constraints for the new box.
   * @param {Idd2} data - The data containing coordinates, size, and other parameters for adjustment.
   * @returns {Size} The adjusted size within the constraints of aspect ratio, min size, and max size.
   */
  adjustAndCalculateSize(t) {
    const e = tt(t, this.imgSize, this.aspectRatio);
    return N({
      size: e,
      minSize: this.minSize,
      maxSize: this.maxSize,
      aspectRatio: this.aspectRatio
    });
  }
  /**
   * Adjusts and calculates the new coordinates based on the input coordinates, size, and points.
   * @param {Coordinates} coordinates - The original coordinates.
   * @param {Size} size - The size to adjust the coordinates.
   * @param {Points} points - The points to calculate the adjustment.
   * @returns {Coordinates} The adjusted coordinates based on the size and points.
   */
  adjustAndCalculateCoordinate(t, e, i) {
    return {
      x: t.x - e.width * i.x,
      y: t.y - e.height * i.y
    };
  }
}
function nt(n) {
  n.addEventListener("touchstart", $), n.addEventListener("touchend", $), n.addEventListener("touchmove", $);
}
function $(n) {
  n.preventDefault();
  const t = n, e = t.changedTouches[0];
  e.target.dispatchEvent(
    new MouseEvent(ot(t.type), {
      bubbles: !0,
      cancelable: !0,
      view: window,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY
    })
  );
}
function ot(n) {
  switch (n) {
    case "touchstart":
      return "mousedown";
    case "touchmove":
      return "mousemove";
    default:
      return "mouseup";
  }
}
class ht {
  constructor(t, e) {
    h(this, "nested", []);
    for (let i = 0; i < 4; i++) {
      const s = b(`${e}-${i}`, t);
      this.nested.push(s);
    }
  }
  hide() {
    for (const t of this.nested)
      t.style.display = "none";
  }
  show() {
    for (const t of this.nested)
      t.style.display = "block";
  }
  destroy() {
    for (const t of this.nested)
      t.remove();
  }
  transform(t) {
    const e = t.x + t.width, i = t.y + t.height;
    this.nested[0].style.height = `${t.y}px`, this.nested[0].style.left = `${t.x}px`, this.nested[0].style.width = `${t.width}px`, this.nested[1].style.left = `${e}px`, this.nested[2].style.left = `${t.x}px`, this.nested[2].style.width = `${t.width}px`, this.nested[2].style.top = `${i}px`, this.nested[3].style.width = `${t.x}px`;
  }
}
class rt {
  /**
   * Creates a new NewSelection instance.
   * @constructor
   */
  constructor(t, e, i, s) {
    h(this, "eventBus");
    h(this, "el");
    h(this, "startMouse", { mouseX: 0, mouseY: 0 });
    h(this, "newBoxCreated", !1);
    h(this, "listener");
    this.eventBus = i, this.el = b(e, t), s ? (this.listener = this.mouseEvent(), this.el.addEventListener("mousedown", this.listener), this.mouseEvent()) : this.hide();
  }
  hide() {
    this.el.style.display = "none";
  }
  show() {
    this.el.style.display = "block";
  }
  destroy() {
    this.listener && this.el.removeEventListener("mousedown", this.listener), this.el.remove();
  }
  mouseEvent() {
    const t = (s) => {
      s.stopPropagation(), document.addEventListener("mousemove", e), document.addEventListener("mouseup", i), this.startMouse = { mouseX: s.clientX, mouseY: s.clientY }, this.newBoxCreated = !1;
    }, e = (s) => {
      if (s.stopPropagation(), this.newBoxCreated) {
        const o = { x: s.clientX, y: s.clientY };
        this.eventBus({ type: "handlemove", data: o });
      } else
        this.tryToCreateNewBox(s.clientX, s.clientY);
    }, i = (s) => {
      s.stopPropagation(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", i), this.newBoxCreated && this.eventBus({ type: "handleend" });
    };
    return t;
  }
  tryToCreateNewBox(t, e) {
    if (t === this.startMouse.mouseX || e === this.startMouse.mouseY)
      return;
    const i = t < this.startMouse.mouseX, s = e < this.startMouse.mouseY, [o, r] = i ? [t, this.startMouse.mouseX - t] : [this.startMouse.mouseX, t - this.startMouse.mouseX], [a, l] = s ? [e, this.startMouse.mouseY - e] : [this.startMouse.mouseY, e - this.startMouse.mouseY], d = {
      coordinates: { x: o, y: a },
      size: { width: r, height: l },
      leftMovable: i,
      topMovable: s
    };
    this.newBoxCreated = this.eventBus({ type: "createnewbox", data: d });
  }
}
class at {
  constructor(t, e, i, s) {
    h(this, "eventBus");
    h(this, "el");
    h(this, "enable");
    h(this, "listener");
    this.eventBus = i, this.el = b(e, t), this.enable = s, s ? (this.listener = this.mouseEvent(), this.el.addEventListener("mousedown", this.listener)) : this.el.style.cursor = "default";
  }
  transform(t) {
    this.el.style.transform = `translate(${t.x}px, ${t.y}px)`, this.el.style.width = `${t.width}px`, this.el.style.height = `${t.height}px`;
  }
  hide() {
    this.el.style.display = "none", this.el.style.cursor = "default";
  }
  show() {
    this.el.style.display = "block", this.el.style.cursor = "move";
  }
  destroy() {
    this.listener && this.el.removeEventListener("mousedown", this.listener), this.el.remove();
  }
  /**
   * Attach event listeners for the crop selection element.
   * Enables dragging/moving of the selection element.
   */
  mouseEvent() {
    const t = (s) => {
      if (s.stopPropagation(), !this.enable)
        return;
      document.addEventListener("mousemove", e), document.addEventListener("mouseup", i);
      const o = { x: s.clientX, y: s.clientY };
      this.eventBus({ type: "regionstart", data: o });
    }, e = (s) => {
      s.stopPropagation();
      const o = { x: s.clientX, y: s.clientY };
      this.eventBus({ type: "regionmove", data: o });
    }, i = (s) => {
      s.stopPropagation(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", i);
      const o = { x: s.clientX, y: s.clientY };
      this.eventBus({ type: "regionend", data: o });
    };
    return t;
  }
}
const lt = ["real", "relative", "percent"];
var z = /* @__PURE__ */ ((n) => (n.waiting = "waiting", n.ready = "ready", n.reloading = "reloading", n.error = "error", n))(z || {});
const E = 1e-4, dt = "cropper";
function ct(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function v(n) {
  return n == null;
}
function c(n, t, e, i = !1) {
  if (v(t))
    return e;
  if (typeof t != "number")
    throw w.new(n, "number");
  if (Number.isNaN(t))
    throw w.new(n, "NaN", !1);
  if (i ? t < 0 : t <= 0)
    throw w.new(n, "positive");
  return t;
}
function k(n, t, e) {
  if (v(t))
    return e;
  if (typeof t != "boolean")
    throw w.new(n, "boolean");
  return t;
}
function M(n, t, e) {
  if (v(t))
    return e;
  if (typeof t != "string" || !lt.includes(t))
    throw w.new(n, "SizeUnit");
  return t;
}
const ut = (n, t) => {
  var s, o, r, a, l, d, m, f, p, D, L, X, H, A, Y, T;
  const e = t || {};
  if (typeof e != "object" || e === null)
    throw w.new("options", "object");
  const i = (F, O) => {
    const S = n[`${dt}${ct(F)}`];
    if (!S)
      return O;
    const C = S.toLowerCase();
    if (C === "null" || C === "undefined" || C === "nil")
      return O;
    const V = Number.parseFloat(S);
    return V.toString() === S ? V : C === "true" ? !0 : C === "false" ? !1 : S;
  };
  return {
    aspectRatio: i("aspectRatio", e.aspectRatio),
    allowFlip: i("allowFlip", e.allowFlip),
    allowNewSelection: i("allowNewSelection", e.allowNewSelection),
    allowMove: i("allowMove", e.allowMove),
    allowResize: i("allowResize", e.allowResize),
    returnMode: i("returnMode", e.returnMode),
    minSize: {
      width: i("minSizeWidth", (s = e.minSize) == null ? void 0 : s.width),
      height: i("minSizeHeight", (o = e.minSize) == null ? void 0 : o.height),
      unit: i("minSizeUnit", (r = e.minSize) == null ? void 0 : r.unit)
    },
    maxSize: {
      width: i("maxSizeWidth", (a = e.maxSize) == null ? void 0 : a.width),
      height: i("maxSizeHeight", (l = e.maxSize) == null ? void 0 : l.height),
      unit: i("maxSizeUnit", (d = e.maxSize) == null ? void 0 : d.unit)
    },
    startSize: {
      x: i("startSizeX", (m = e.startSize) == null ? void 0 : m.x),
      y: i("startSizeY", (f = e.startSize) == null ? void 0 : f.y),
      width: i("startSizeWidth", (p = e.startSize) == null ? void 0 : p.width),
      height: i("startSizeHeight", (D = e.startSize) == null ? void 0 : D.height),
      unit: i("startSizeUnit", (L = e.startSize) == null ? void 0 : L.unit)
    },
    defaultSize: {
      x: i("defaultSizeX", (X = e.defaultSize) == null ? void 0 : X.x),
      y: i("defaultSizeY", (H = e.defaultSize) == null ? void 0 : H.y),
      width: i("defaultSizeWidth", (A = e.defaultSize) == null ? void 0 : A.width),
      height: i("defaultSizeHeight", (Y = e.defaultSize) == null ? void 0 : Y.height),
      unit: i("defaultSizeUnit", (T = e.defaultSize) == null ? void 0 : T.unit)
    }
  };
}, j = (n, t, e) => Math.abs(n - t) < e, gt = (n) => {
  var r;
  const t = c("aspectRatio", n.aspectRatio, 0), e = {
    width: c("minSizeWidth", n.minSize.width, 0),
    height: c("minSizeHeight", n.minSize.height, 0),
    unit: M("minSizeUnit", (r = n.minSize) == null ? void 0 : r.unit, "real")
  }, i = {
    width: c("maxSizeWidth", n.maxSize.width, 0),
    height: c("maxSizeHeight", n.maxSize.height, 0),
    unit: M("maxSizeUnit", n.maxSize.unit, "real")
  }, s = {
    x: c("startSizeX", n.startSize.x, 0, !0),
    y: c("startSizeY", n.startSize.y, 0, !0),
    width: c("startSizeWidth", n.startSize.width, 0),
    height: c("startSizeHeight", n.startSize.height, 0),
    unit: M("startSizeUnit", n.startSize.unit, "real"),
    centeredX: v(n.startSize.x),
    centeredY: v(n.startSize.y),
    allowChange: !1
  };
  s.allowChange = s.width === 0 && s.height === 0;
  const o = {
    x: c("defaultSizeX", n.defaultSize.x, 0, !0),
    y: c("defaultSizeY", n.defaultSize.y, 0, !0),
    width: c("defaultSizeWidth", n.defaultSize.width, 0),
    height: c("defaultSizeHeight", n.defaultSize.height, 0),
    unit: M("defaultSizeUnit", n.defaultSize.unit, "real"),
    centeredX: v(n.defaultSize.x),
    centeredY: v(n.defaultSize.y),
    allowChange: !1
  };
  if (o.allowChange = o.width === 0 && o.height === 0, t) {
    if (e.width && e.height) {
      const a = e.width / e.height;
      if (!j(a, t, E))
        throw w.aspectRatio(
          a,
          t,
          E
        );
    }
    if (s.width && s.height) {
      const a = s.width / s.height;
      if (!j(a, t, E))
        throw w.aspectRatio(
          a,
          t,
          E
        );
    }
  }
  return {
    aspectRatio: t,
    allowFlip: k("allowFlip", n.allowFlip, !0),
    allowNewSelection: k(
      "allowNewSelection",
      n.allowNewSelection,
      !0
    ),
    allowMove: k("allowMove", n.allowMove, !0),
    allowResize: k("allowResize", n.allowResize, !0),
    returnMode: M("returnMode", n.returnMode, "real"),
    minSize: e,
    maxSize: i,
    firstInitSize: s,
    startSize: o
  };
};
class wt {
  constructor(t, e, i, s, o) {
    h(this, "position");
    h(this, "eventBus");
    h(this, "el");
    h(this, "enable");
    h(this, "listener");
    this.position = i.position, this.eventBus = s, this.enable = o, this.el = b(e, t), this.el.style.cursor = i.cursor, o ? (this.listener = this.mouseEvent(), this.el.addEventListener("mousedown", this.listener)) : this.hide();
  }
  show() {
    this.el.style.display = "block";
  }
  hide() {
    this.el.style.display = "none";
  }
  destroy() {
    this.listener && this.el.removeEventListener("mousedown", this.listener), this.el.remove();
  }
  transform(t) {
    const e = this.el.offsetWidth, i = this.el.offsetHeight, s = t.x + t.width * this.position.x - e / 2, o = t.y + t.height * this.position.y - i / 2;
    this.el.style.transform = `translate(${s}px, ${o}px)`;
  }
  getData() {
    return {
      points: { ...this.position }
    };
  }
  mouseEvent() {
    const t = (s) => {
      if (s.stopPropagation(), !this.enable)
        return;
      document.addEventListener("mousemove", e), document.addEventListener("mouseup", i);
      const o = this.getData();
      this.eventBus({ type: "handlestart", data: o });
    }, e = (s) => {
      s.stopPropagation();
      const o = { x: s.clientX, y: s.clientY };
      this.eventBus({ type: "handlemove", data: o });
    }, i = (s) => {
      s.stopPropagation(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", i), this.eventBus({ type: "handleend" });
    };
    return t;
  }
}
const mt = [
  { position: { x: 0, y: 0 }, cursor: "nw-resize" },
  { position: { x: 0.5, y: 0 }, cursor: "n-resize" },
  { position: { x: 1, y: 0 }, cursor: "ne-resize" },
  { position: { x: 1, y: 0.5 }, cursor: "e-resize" },
  { position: { x: 1, y: 1 }, cursor: "se-resize" },
  { position: { x: 0.5, y: 1 }, cursor: "s-resize" },
  { position: { x: 0, y: 1 }, cursor: "sw-resize" },
  { position: { x: 0, y: 0.5 }, cursor: "w-resize" }
];
class ft {
  /**
   * Creates a new Handle instance.
   */
  constructor(t, e, i, s, o) {
    h(this, "el");
    h(this, "handles", []);
    this.el = b(e, t);
    for (const r of mt) {
      const a = new wt(
        this.el,
        o,
        r,
        i,
        s
      );
      this.handles.push(a);
    }
  }
  hide() {
    for (const t of this.handles)
      t.hide();
  }
  show() {
    for (const t of this.handles)
      t.show();
  }
  destroy() {
    for (const t of this.handles)
      t.destroy();
    this.el.remove();
  }
  transform(t) {
    for (const e of this.handles)
      e.transform(t);
  }
  handleByMovableType(t, e) {
    return t ? e ? this.handles[0] : this.handles[6] : e ? this.handles[2] : this.handles[4];
  }
}
const B = { width: 1, height: 1 };
class zt {
  constructor(t, e) {
    h(this, "replaceDOM", !1);
    h(this, "htmlContainer");
    h(this, "htmlImg");
    h(this, "options");
    h(this, "newSelection");
    h(this, "selection");
    h(this, "handles");
    h(this, "background");
    h(this, "box");
    h(this, "currentMove");
    h(this, "activeHandle");
    h(this, "real", B);
    h(this, "relative", B);
    h(this, "ratio", B);
    h(this, "firstInit", !0);
    h(this, "isDomCreated", !1);
    h(this, "status", z.waiting);
    h(this, "eventBus", this.event.bind(this));
    h(this, "observer");
    h(this, "callbacks", {
      onInitialize: void 0,
      onCropStart: void 0,
      onCropMove: void 0,
      onCropEnd: void 0,
      onError: void 0
    });
    try {
      this.parseCallbackFunctions(e);
      const [i, s] = Z(t);
      this.htmlImg = i, s ? this.htmlContainer = s : this.replaceDOM = !0, this.changeStatus(z.waiting);
      const o = ut(this.htmlImg.dataset, e);
      this.options = gt(o), this.initializeCropper();
    } catch (i) {
      if (i instanceof y || i instanceof w)
        this.onErrorCallback(i);
      else
        throw i;
    }
  }
  getImagePreview() {
    if (this.status !== "ready")
      return;
    const t = document.createElement("canvas");
    t.setAttribute("crossorigin", "anonymous");
    const e = t.getContext("2d");
    if (!e)
      return;
    const i = this.getValue("real");
    return t.width = i.width, t.height = i.height, e.drawImage(
      this.htmlImg,
      i.x,
      i.y,
      i.width,
      i.height,
      0,
      0,
      i.width,
      i.height
    ), t;
  }
  /**
   * Changes the image src.
   * @param {String} src
   */
  setImage(t) {
    t && t.length !== 0 && (this.htmlImg.src = t);
  }
  /**
   * Resets the crop region to the initial settings.
   */
  reset() {
    try {
      this.destroy(), this.initializeCropper();
    } catch (t) {
      if (t instanceof y || t instanceof w || t instanceof x)
        this.onErrorCallback(t);
      else
        throw t;
    }
  }
  /**
   * Destroy the TrueCropper instance and replace with the original element.
   */
  destroy() {
    this.isDomCreated && (this.observer.unobserve(this.htmlImg), this.newSelection.destroy(), this.handles.destroy(), this.selection.destroy(), this.background.destroy(), this.replaceDOM && this.htmlContainer.parentElement && this.htmlContainer.parentElement.replaceChild(
      this.htmlImg,
      this.htmlContainer
    )), this.isDomCreated = !1;
  }
  /**
   * Moves the crop region to a specified coordinate.
   * @param {Coordinates} coordinates
   */
  moveTo(t) {
    this.box.move(t), this.redraw(), this.onCropEndCallback();
  }
  /**
   * Resizes the crop region to a specified width and height.
   * @param {Size} size
   * @param {Points} points
   */
  resizeTo(t, e = { x: 0.5, y: 0.5 }) {
    this.box.resize(t, e), this.redraw(), this.onCropEndCallback();
  }
  /**
   * Scale the crop region by a factor.
   * @param {Number} factor
   * @param {Points} points
   */
  scaleBy(t, e = { x: 0.5, y: 0.5 }) {
    this.box.scale(t, e), this.redraw(), this.onCropEndCallback();
  }
  /**
   * Handles the callback when after initialization.
   */
  onInitializeCallback() {
    this.callbacks.onInitialize && this.callbacks.onInitialize(this, this.getValue());
  }
  /**
   * Handles the callback when cropping starts.
   */
  onCropStartCallback() {
    this.callbacks.onCropStart && this.callbacks.onCropStart(this, this.getValue());
  }
  /**
   * Handles the callback when cropping is in progress.
   */
  onCropMoveCallback() {
    this.callbacks.onCropMove && this.callbacks.onCropMove(this, this.getValue());
  }
  /**
   * Handles the callback when cropping ends.
   */
  onCropEndCallback() {
    const t = this.getValue();
    this.setDatasetCropValues(t), this.callbacks.onCropEnd && this.callbacks.onCropEnd(this, t);
  }
  /**
   * Handles errors encountered during operations.
   * @param {TrueCropperHtmlError | TrueCropperImageError | TrueCropperOptionsError} error - The error object containing information about the error.
   */
  onErrorCallback(t) {
    this.changeStatus(z.error);
    const e = {
      type: t.name,
      message: t.message,
      data: t.data
    };
    if (this.destroy(), this.callbacks.onError)
      this.callbacks.onError(this, e);
    else
      throw t;
  }
  /**
   * Get the value of the crop region.
   * @param {SizeUnit | undefined} mode - The mode of return value type. If null, defaults to the return mode set in returnMode options.
   * @returns {number} - The value of the crop region.
   */
  getValue(t = void 0) {
    const e = t || this.options.returnMode, s = e === "relative" ? this.box.getValueRelative(this.ratio) : e === "percent" ? this.box.getValuePercent() : this.box.getValueReal();
    return {
      x: Math.round(s.x),
      y: Math.round(s.y),
      width: Math.round(s.width),
      height: Math.round(s.height)
    };
  }
  /** ==============
   *
   *
   *  Private methods
   *
   *
   * ==============
   */
  initializeObserver() {
    this.observer = new ResizeObserver((t) => {
      for (const e of t) {
        const i = e.target;
        i === this.htmlImg && i.complete && i.width !== 0 && (this.updateRelativeSize(), this.redraw());
      }
    });
  }
  initializeCropper() {
    this.initializeObserver(), this.htmlImg.width !== 0 && this.htmlImg.height !== 0 && this.initialize(), this.htmlImg.onload = () => {
      this.changeStatus(
        this.status === z.waiting ? z.waiting : z.reloading
      ), this.observer.unobserve(this.htmlImg), this.initialize();
    };
  }
  initialize() {
    try {
      this.createDOM(), this.calcContainerProps(), this.updateRelativeSize(), this.createNewBox(), this.onInitializeCallback(), this.observer.observe(this.htmlImg), this.changeStatus(z.ready), this.onCropEndCallback();
    } catch (t) {
      if (t instanceof x)
        this.onErrorCallback(t);
      else
        throw t;
    }
  }
  createDOM() {
    if (this.isDomCreated)
      return;
    this.replaceDOM && (this.htmlContainer = document.createElement("div"), this.htmlContainer.classList.add(u.base), this.htmlImg.parentElement && this.htmlImg.parentElement.replaceChild(
      this.htmlContainer,
      this.htmlImg
    ), this.htmlContainer.appendChild(this.htmlImg));
    const t = this.htmlContainer;
    nt(t), this.htmlImg.classList.add(u.img), this.background = new ht(t, u.background), this.newSelection = new rt(
      t,
      u.new,
      this.eventBus,
      this.options.allowNewSelection
    ), this.selection = new at(
      t,
      u.selection,
      this.eventBus,
      this.options.allowMove
    ), this.handles = new ft(
      t,
      u.hanleds,
      this.eventBus,
      this.options.allowResize,
      u.handle
    ), this.isDomCreated = !0;
  }
  calcContainerProps() {
    this.real = {
      width: this.htmlImg.naturalWidth,
      height: this.htmlImg.naturalHeight
    };
  }
  createNewBox() {
    let t = this.options.startSize;
    this.firstInit && (this.firstInit = !1, t = this.options.firstInitSize);
    const e = {
      x: t.centeredX,
      y: t.centeredX
    }, i = t.allowChange, s = J(
      t,
      this.options.minSize,
      this.options.maxSize,
      this.real,
      this.ratio
    ), o = K(
      s,
      this.real,
      this.options.aspectRatio,
      i,
      e
    );
    Q(o), this.box = new st(o);
  }
  updateRelativeSize() {
    const { width: t, height: e } = this.htmlImg.getBoundingClientRect();
    this.htmlImg.offsetWidth === 0 || this.htmlImg.offsetHeight === 0 ? this.relative = { width: this.real.width, height: this.real.height } : this.relative = { width: t, height: e }, this.ratio = {
      width: this.relative.width / this.real.width,
      height: this.relative.height / this.real.height
    };
  }
  changeStatus(t) {
    this.status = t, this.htmlImg && this.setDataset(u.valueStatus, t);
  }
  /**
   * Draw visuals (border, handles, etc) for the current box.
   */
  redraw() {
    const t = this.box.getValueRelative(this.ratio);
    this.selection.transform(t), this.background.transform(t), this.handles.transform(t);
  }
  event({ type: t, data: e }) {
    switch (t) {
      case "handlestart":
        this.onHandleMoveStart(e);
        break;
      case "handlemove":
        this.onHandleMoveMoving(e);
        break;
      case "handleend":
        this.onHandleMoveEnd();
        break;
      case "regionstart":
        this.onRegionMoveStart(e);
        break;
      case "regionmove":
        this.onRegionMoveMoving(e);
        break;
      case "regionend":
        this.onRegionMoveEnd();
        break;
      case "createnewbox":
        return this.tryToCreateNewBox(e);
    }
    return !0;
  }
  tryToCreateNewBox({
    coordinates: t,
    size: e,
    leftMovable: i,
    topMovable: s
  }) {
    const o = this.handles.handleByMovableType(i, s).getData(), a = {
      coordinates: this.mouseCoordinates(t),
      size: e,
      points: o.points
    };
    return this.box.prepareAndApplyNewSizeAndCoordinates(a) ? (this.redraw(), this.onHandleMoveStart(o), !0) : !1;
  }
  /**
   * Executes when user begins dragging a handle.
   */
  onHandleMoveStart(t) {
    const { x: e, y: i } = this.box.getOppositeCornerCoordinates(t.points);
    this.activeHandle = {
      x: {
        left: t.points.x === 0,
        savedCoordinate: e
      },
      y: {
        left: t.points.y === 0,
        savedCoordinate: i
      }
    }, this.onCropStartCallback();
  }
  /**
   * Executes on handle move. Main logic to manage the movement of handles.
   */
  onHandleMoveMoving(t) {
    const e = this.mouseCoordinates(t), i = G(
      e,
      this.activeHandle.x,
      this.activeHandle.y
    );
    !this.options.allowFlip && (i.flipped.x || i.flipped.y) || (this.box.prepareAndApplyNewSizeAndCoordinates(i.newBox) && this.redraw(), this.onCropMoveCallback());
  }
  /**
   *  Executes when the handle move ends.
   */
  onHandleMoveEnd() {
    this.onCropEndCallback();
  }
  /**
   * Executes when user starts moving the crop region.
   * @param {TrueCropperCoreRegionMoveEvent["data"]} data - contains the raw mouseX, mouseY coordinate
   */
  onRegionMoveStart(t) {
    const { x: e, y: i } = this.mouseCoordinates(t), s = this.box.getCoourdinates();
    this.currentMove = { offsetX: e - s.x, offsetY: i - s.y }, this.onCropStartCallback();
  }
  /**
   * Executes when user moves the crop region.
   */
  onRegionMoveMoving(t) {
    const { offsetX: e, offsetY: i } = this.currentMove, { x: s, y: o } = this.mouseCoordinates(t);
    this.box.move({ x: s - e, y: o - i }), this.redraw(), this.onCropMoveCallback();
  }
  /**
   * Executes when user stops moving the crop region (mouse up).
   */
  onRegionMoveEnd() {
    this.onCropEndCallback();
  }
  /**
   * Get the real(natural) mouse coordinates within the image container.
   * @param {number} absMouseX - The absolute X coordinate of the mouse.
   * @param {number} absMouseY - The absolute Y coordinate of the mouse.
   * @returns {[number, number]} - The real(natural) X and Y coordinates within the image container.
   */
  mouseCoordinates(t) {
    const e = this.htmlImg.getBoundingClientRect();
    let i = t.x - e.left, s = t.y - e.top;
    return i = Math.min(Math.max(i, 0), this.relative.width) / this.ratio.width, s = Math.min(Math.max(s, 0), this.relative.height) / this.ratio.height, { x: i, y: s };
  }
  /**
   * Sets a value to a dataset attribute of an HTML image element.
   * @param {string} name - The name of the dataset attribute.
   * @param {string | number} value - The value to set for the dataset attribute.
   */
  setDataset(t, e) {
    this.htmlImg.dataset[t] = e.toString();
  }
  // to helpers
  parseCallbackFunctions(t) {
    t && (t.onError && typeof t.onError == "function" && (this.callbacks.onError = t.onError), t.onInitialize && typeof t.onInitialize == "function" && (this.callbacks.onInitialize = t.onInitialize), t.onCropStart && typeof t.onCropStart == "function" && (this.callbacks.onCropStart = t.onCropStart), t.onCropMove && typeof t.onCropMove == "function" && (this.callbacks.onCropMove = t.onCropMove), t.onCropEnd && typeof t.onCropEnd == "function" && (this.callbacks.onCropEnd = t.onCropEnd));
  }
  setDatasetCropValues(t) {
    const e = t || this.getValue();
    this.setDataset(u.valueX, e.x), this.setDataset(u.valueY, e.y), this.setDataset(u.valueWidth, e.width), this.setDataset(u.valueHeight, e.height);
  }
}
export {
  zt as default
};
//# sourceMappingURL=trueCropper.es.js.map
