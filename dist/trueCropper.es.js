var j = Object.defineProperty;
var F = (n, t, e) => t in n ? j(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var o = (n, t, e) => (F(n, typeof t != "symbol" ? t + "" : t, e), e);
const g = "truecropper", c = {
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
}, _ = {
  elementNotFound: { text: "Unable to find element", id: 0 },
  srcEmpty: { text: "Image src not provided", id: 1 },
  parentNotContainDiv: { text: "Parent element can be exists", id: 2 }
};
class y extends Error {
  constructor(e) {
    const i = _[e];
    super(i.text);
    o(this, "data");
    o(this, "messageId");
    Object.setPrototypeOf(this, y.prototype), this.name = "TrueCropperHtmlError", this.data = {}, this.messageId = i.id;
  }
}
class S extends Error {
  constructor(e, i, s) {
    super(e);
    o(this, "data");
    o(this, "messageId");
    Object.setPrototypeOf(this, S.prototype), this.name = "TrueCropperImageError", this.data = {
      target: i.target,
      targetCoordinates: i.coordinates ? { ...i.coordinates } : void 0,
      targetSize: { ...i.targetSize },
      source: i.source,
      sourceSize: { ...i.sourceSize }
    }, this.messageId = s;
  }
  static startSize(e, i, s, h, r) {
    const a = `The ${e} (${i.x}x${i.y}:${s.width}x${s.height}) exceeds the ${h} (${r.width}x${r.height})`, l = {
      target: e,
      coordinates: i,
      targetSize: s,
      source: h,
      sourceSize: r
    };
    return new this(a, l, 6);
  }
  static size(e, i, s, h) {
    const r = `The ${e} (${i.width}x${i.height}) exceeds the ${s} (${h.width}x${h.height})`, a = {
      target: e,
      coordinates: void 0,
      targetSize: i,
      source: s,
      sourceSize: h
    };
    return new this(r, a, 7);
  }
}
class w extends Error {
  constructor(e, i, s = 0) {
    super(e);
    o(this, "data");
    o(this, "messageId");
    Object.setPrototypeOf(this, w.prototype), this.name = "TrueCropperOptionsError", this.data = i, this.messageId = s;
  }
  static aspectRatio(e, i, s, h) {
    const r = `The specified aspect ratio (${s}) and calculated ${e} dimensions (width/height = ${i}) are greater than (${h}). This might be due to a rounding error on the server side or incorrect minimum sizes.`;
    return new this(r, { name: e }, 5);
  }
  static new(e, i, s = !0) {
    const h = s ? 3 : 4, r = s ? `${e} must be ${i}` : `${e} must not be ${i}`;
    return new this(r, { name: e, object: i }, h);
  }
}
const P = (n) => {
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
  return e.classList.contains(c.base) || (e = null), [t, e];
}, b = (n, t = void 0) => {
  const e = document.createElement("div");
  return e.className = n, t && t.appendChild(e), e;
}, O = (n, t) => {
  if (t.savedCoordinate < 0)
    return { flipped: !1, coordinate: null, size: null, point: 0.5 };
  const e = n < t.savedCoordinate, i = t.left !== e, s = t.savedCoordinate, h = Math.abs(t.savedCoordinate - n), r = Number(e);
  return {
    flipped: i,
    coordinate: s,
    size: h,
    point: r
  };
}, q = (n, t, e) => {
  const i = O(n.x, t), s = O(n.y, e);
  return {
    flipped: { x: i.flipped, y: s.flipped },
    newBox: {
      coordinates: { x: i.coordinate, y: s.coordinate },
      size: { width: i.size, height: s.size },
      points: { x: i.point, y: s.point }
    }
  };
}, Z = (n, t, e, i, s) => {
  const h = (m, f, p) => p === "relative" ? m * s[f] : p === "percent" ? m >= 1 ? i[f] * (m / 100) : i[f] * m : m, r = {
    width: h(t.width, "width", t.unit),
    height: h(t.height, "height", t.unit)
  }, a = {
    width: h(e.width, "width", e.unit),
    height: h(e.height, "height", e.unit)
  }, l = {
    x: h(n.x, "width", n.unit),
    y: h(n.y, "height", n.unit)
  }, d = {
    width: h(n.width, "width", n.unit),
    height: h(n.height, "height", n.unit)
  };
  return { coordinates: l, size: d, minSize: r, maxSize: a };
}, G = (n, t, e, i, s) => {
  const h = I(
    n.minSize,
    { width: 1, height: 1 },
    e
  );
  let r = I(n.maxSize, t, e), a = I(n.size, t, e);
  r = Q(r, t, e);
  let l = n.coordinates;
  if (i) {
    const d = tt(
      l,
      a,
      h,
      r,
      t,
      e,
      s.x,
      s.y
    );
    l = d.coordinates, a = d.size;
  }
  return { coordinates: l, size: a, minSize: h, maxSize: r, imgProps: t, aspectRatio: e };
}, J = ({
  coordinates: n,
  minSize: t,
  maxSize: e,
  size: i,
  imgProps: s
}) => {
  const h = (r, a, l, d) => {
    if (r.width > a.width || r.height > a.height)
      throw S.size(l, r, d, a);
  };
  if (h(t, s, "minSize", "imageSize"), h(t, e, "minSize", "maxSize"), h(t, i, "minSize", "startSize"), n.x + i.width > s.width || n.y + i.height > s.height)
    throw S.startSize(
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
}, V = (n, t, e) => {
  const i = n * t;
  return { width: i, height: i / e };
}, R = (n, t, e) => {
  const i = n * t;
  return { width: i * e, height: i };
}, K = (n, t, e) => {
  let i = { ...n.size };
  if (e === 0)
    return i;
  const s = n.isMultuAxis ? i.height * e >= i.width : n.isVerticalMovement, h = n.points.x === 1 || n.points.x === 0 ? 1 : 2, r = n.points.y === 1 || n.points.y === 0 ? 1 : 2;
  return s ? i = { width: i.height * e, height: i.height } : i = { width: i.width, height: i.width / e }, n.coordinates.x + i.width * (1 - n.points.x) > t.width && (i = V(
    t.width - n.coordinates.x,
    h,
    e
  )), n.coordinates.y + i.height * (1 - n.points.y) > t.height && (i = R(
    t.height - n.coordinates.y,
    r,
    e
  )), n.coordinates.x - i.width * n.points.x < 0 && (i = V(n.coordinates.x, h, e)), n.coordinates.y - i.height * n.points.y < 0 && (i = R(n.coordinates.y, r, e)), i;
}, I = (n, t, e) => {
  const i = { ...n };
  return e && !i.width && !i.height && (e > 1 ? i.height = t.height : i.width = t.width), i.width || (i.width = e ? i.height * e : t.width), i.height || (i.height = e ? i.width / e : t.height), i;
}, Q = (n, t, e) => {
  let i = { ...n };
  return e && (i.width > i.height * e ? i.width = i.height * e : i.height = i.width / e), i = N({
    size: i,
    maxSize: t,
    aspectRatio: e
  }), i;
}, tt = (n, t, e, i, s, h, r, a) => {
  const l = { ...t }, d = { ...n }, m = Math.min(i.width, s.width - n.x), f = Math.min(i.height, s.height - n.y), p = N({
    size: l,
    maxSize: { width: m, height: f },
    minSize: e,
    aspectRatio: h
  });
  return l.width = p.width, l.height = p.height, d.x = r ? (s.width - l.width) / 2 : n.x, d.y = a ? (s.height - l.height) / 2 : n.y, { coordinates: d, size: l };
};
class et {
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
    imgProps: h,
    aspectRatio: r
  }) {
    o(this, "coordinates");
    o(this, "size");
    o(this, "minSize");
    o(this, "maxSize");
    o(this, "imgSize");
    o(this, "aspectRatio");
    this.coordinates = { ...t }, this.size = { ...e }, this.minSize = { ...i }, this.maxSize = { ...s }, this.imgSize = { ...h }, this.aspectRatio = r;
  }
  /**
   * Sets the value of coordinates and size properties based on the provided BoxProps object.
   * @param {BoxProps} box - The BoxProps object containing x, y, width, and height properties.
   * @returns {void}
   */
  setValue(t) {
    this.coordinates = { x: t.x, y: t.y }, this.size = { width: t.width, height: t.height };
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
    }, s = t.coordinates.y !== null, h = s && t.coordinates.x !== null;
    return {
      size: e,
      coordinates: i,
      isVerticalMovement: s,
      isMultuAxis: h,
      points: t.points
    };
  }
  /**
   * Adjusts and calculates the size based on aspect ratio and constraints for the new box.
   * @param {Idd2} data - The data containing coordinates, size, and other parameters for adjustment.
   * @returns {Size} The adjusted size within the constraints of aspect ratio, min size, and max size.
   */
  adjustAndCalculateSize(t) {
    const e = K(t, this.imgSize, this.aspectRatio);
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
function it(n) {
  n.addEventListener("touchstart", k), n.addEventListener("touchend", k), n.addEventListener("touchmove", k);
}
function k(n) {
  n.preventDefault();
  const t = n, e = t.changedTouches[0];
  e.target.dispatchEvent(
    new MouseEvent(st(t.type), {
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
function st(n) {
  switch (n) {
    case "touchstart":
      return "mousedown";
    case "touchmove":
      return "mousemove";
    default:
      return "mouseup";
  }
}
class nt {
  constructor(t, e) {
    o(this, "nested", []);
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
    this.nested[0].style.height = `${t.y}px`, this.nested[0].style.left = `${t.x}px`, this.nested[0].style.right = `calc(100% - ${t.width}px - ${t.x}px)`, this.nested[1].style.left = `${e}px`, this.nested[2].style.left = `${t.x}px`, this.nested[2].style.right = `calc(100% - ${t.width}px - ${t.x}px)`, this.nested[2].style.top = `${i}px`, this.nested[3].style.width = `${t.x}px`;
  }
}
class ht {
  /**
   * Creates a new NewSelection instance.
   * @constructor
   */
  constructor(t, e, i, s) {
    o(this, "eventBus");
    o(this, "el");
    o(this, "startMouse", { mouseX: 0, mouseY: 0 });
    o(this, "newBoxCreated", !1);
    o(this, "listener");
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
        const h = { x: s.clientX, y: s.clientY };
        this.eventBus({ type: "handlemove", data: h });
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
    const i = t < this.startMouse.mouseX, s = e < this.startMouse.mouseY, [h, r] = i ? [t, this.startMouse.mouseX - t] : [this.startMouse.mouseX, t - this.startMouse.mouseX], [a, l] = s ? [e, this.startMouse.mouseY - e] : [this.startMouse.mouseY, e - this.startMouse.mouseY], d = {
      coordinates: { x: h, y: a },
      size: { width: r, height: l },
      leftMovable: i,
      topMovable: s
    };
    this.newBoxCreated = this.eventBus({ type: "createnewbox", data: d });
  }
}
class ot {
  constructor(t, e, i, s) {
    o(this, "eventBus");
    o(this, "el");
    o(this, "enable");
    o(this, "listener");
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
      const h = { x: s.clientX, y: s.clientY };
      this.eventBus({ type: "regionstart", data: h });
    }, e = (s) => {
      s.stopPropagation();
      const h = { x: s.clientX, y: s.clientY };
      this.eventBus({ type: "regionmove", data: h });
    }, i = (s) => {
      s.stopPropagation(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", i);
      const h = { x: s.clientX, y: s.clientY };
      this.eventBus({ type: "regionend", data: h });
    };
    return t;
  }
}
const rt = ["real", "relative", "percent"];
var v = /* @__PURE__ */ ((n) => (n.waiting = "waiting", n.ready = "ready", n.reloading = "reloading", n.error = "error", n))(v || {});
const W = 1e-4, at = c.base;
function lt(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function z(n) {
  return n == null;
}
function u(n, t, e, i = !1) {
  if (z(t))
    return e;
  if (typeof t != "number")
    throw w.new(n, "number");
  if (Number.isNaN(t))
    throw w.new(n, "NaN", !1);
  if (i ? t < 0 : t <= 0)
    throw w.new(n, "positive");
  return t;
}
function E(n, t, e) {
  if (z(t))
    return e;
  if (typeof t != "boolean")
    throw w.new(n, "boolean");
  return t;
}
function M(n, t, e) {
  if (z(t))
    return e;
  if (typeof t != "string" || !rt.includes(t))
    throw w.new(n, "SizeUnit");
  return t;
}
const dt = (n, t) => {
  var s, h, r, a, l, d, m, f, p, B, D, L, X, H, Y, A;
  const e = t || {};
  if (typeof e != "object" || e === null)
    throw w.new("options", "object");
  const i = (U, T) => {
    const x = n[`${at}${lt(U)}`];
    if (!x)
      return T;
    const C = x.toLowerCase();
    return C === "null" || C === "undefined" || C === "nil" ? T : x.trim().length !== 0 && !Number.isNaN(Number(x)) ? Number(x) : C === "true" ? !0 : C === "false" ? !1 : x;
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
      height: i("minSizeHeight", (h = e.minSize) == null ? void 0 : h.height),
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
      height: i("startSizeHeight", (B = e.startSize) == null ? void 0 : B.height),
      unit: i("startSizeUnit", (D = e.startSize) == null ? void 0 : D.unit)
    },
    defaultSize: {
      x: i("defaultSizeX", (L = e.defaultSize) == null ? void 0 : L.x),
      y: i("defaultSizeY", (X = e.defaultSize) == null ? void 0 : X.y),
      width: i("defaultSizeWidth", (H = e.defaultSize) == null ? void 0 : H.width),
      height: i("defaultSizeHeight", (Y = e.defaultSize) == null ? void 0 : Y.height),
      unit: i("defaultSizeUnit", (A = e.defaultSize) == null ? void 0 : A.unit)
    }
  };
}, ct = (n, t, e) => Math.abs(n - t) < e, ut = (n) => {
  var r;
  const t = u("aspectRatio", n.aspectRatio, 0), e = {
    width: u("minSizeWidth", n.minSize.width, 0),
    height: u("minSizeHeight", n.minSize.height, 0),
    unit: M("minSizeUnit", (r = n.minSize) == null ? void 0 : r.unit, "real")
  }, i = {
    width: u("maxSizeWidth", n.maxSize.width, 0),
    height: u("maxSizeHeight", n.maxSize.height, 0),
    unit: M("maxSizeUnit", n.maxSize.unit, "real")
  }, s = {
    x: u("startSizeX", n.startSize.x, 0, !0),
    y: u("startSizeY", n.startSize.y, 0, !0),
    width: u("startSizeWidth", n.startSize.width, 0),
    height: u("startSizeHeight", n.startSize.height, 0),
    unit: M("startSizeUnit", n.startSize.unit, "real"),
    centeredX: z(n.startSize.x),
    centeredY: z(n.startSize.y),
    allowChange: !1
  };
  s.allowChange = s.width === 0 && s.height === 0;
  const h = {
    x: u("defaultSizeX", n.defaultSize.x, 0, !0),
    y: u("defaultSizeY", n.defaultSize.y, 0, !0),
    width: u("defaultSizeWidth", n.defaultSize.width, 0),
    height: u("defaultSizeHeight", n.defaultSize.height, 0),
    unit: M("defaultSizeUnit", n.defaultSize.unit, "real"),
    centeredX: z(n.defaultSize.x),
    centeredY: z(n.defaultSize.y),
    allowChange: !1
  };
  if (h.allowChange = h.width === 0 && h.height === 0, t && e.width && e.height) {
    const a = e.width / e.height;
    if (!ct(a, t, W))
      throw w.aspectRatio(
        "minimum",
        a,
        t,
        W
      );
  }
  return {
    aspectRatio: t,
    allowFlip: E("allowFlip", n.allowFlip, !0),
    allowNewSelection: E(
      "allowNewSelection",
      n.allowNewSelection,
      !0
    ),
    allowMove: E("allowMove", n.allowMove, !0),
    allowResize: E("allowResize", n.allowResize, !0),
    returnMode: M("returnMode", n.returnMode, "real"),
    minSize: e,
    maxSize: i,
    firstInitSize: s,
    startSize: h
  };
};
class gt {
  constructor(t, e, i, s, h) {
    o(this, "position");
    o(this, "eventBus");
    o(this, "el");
    o(this, "enable");
    o(this, "listener");
    this.position = i.position, this.eventBus = s, this.enable = h, this.el = b(e, t), this.el.style.cursor = i.cursor, h ? (this.listener = this.mouseEvent(), this.el.addEventListener("mousedown", this.listener)) : this.hide();
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
    const e = this.el.offsetWidth, i = this.el.offsetHeight, s = t.x + t.width * this.position.x - e / 2, h = t.y + t.height * this.position.y - i / 2;
    this.el.style.transform = `translate(${s}px, ${h}px)`;
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
      const h = this.getData();
      this.eventBus({ type: "handlestart", data: h });
    }, e = (s) => {
      s.stopPropagation();
      const h = { x: s.clientX, y: s.clientY };
      this.eventBus({ type: "handlemove", data: h });
    }, i = (s) => {
      s.stopPropagation(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", i), this.eventBus({ type: "handleend" });
    };
    return t;
  }
}
const wt = [
  { position: { x: 0, y: 0 }, cursor: "nw-resize" },
  { position: { x: 0.5, y: 0 }, cursor: "n-resize" },
  { position: { x: 1, y: 0 }, cursor: "ne-resize" },
  { position: { x: 1, y: 0.5 }, cursor: "e-resize" },
  { position: { x: 1, y: 1 }, cursor: "se-resize" },
  { position: { x: 0.5, y: 1 }, cursor: "s-resize" },
  { position: { x: 0, y: 1 }, cursor: "sw-resize" },
  { position: { x: 0, y: 0.5 }, cursor: "w-resize" }
];
class mt {
  /**
   * Creates a new Handle instance.
   */
  constructor(t, e, i, s, h) {
    o(this, "el");
    o(this, "handles", []);
    this.el = b(e, t);
    for (const r of wt) {
      const a = new gt(
        this.el,
        h,
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
const $ = { width: 0, height: 0 };
class pt {
  constructor(t, e) {
    o(this, "replaceDOM", !1);
    o(this, "htmlContainer");
    o(this, "htmlImg");
    o(this, "options");
    o(this, "newSelection");
    o(this, "selection");
    o(this, "handles");
    o(this, "background");
    o(this, "box");
    o(this, "currentMove");
    o(this, "activeHandle");
    o(this, "real", $);
    o(this, "relative", $);
    o(this, "ratio", $);
    o(this, "firstInit", !0);
    o(this, "isDomCreated", !1);
    o(this, "status", v.waiting);
    o(this, "eventBus", this.event.bind(this));
    o(this, "observer");
    o(this, "preventDoubleLoad");
    o(this, "callbacks", {
      onInitialize: void 0,
      onCropStart: void 0,
      onCropMove: void 0,
      onCropEnd: void 0,
      onError: void 0
    });
    try {
      this.parseCallbackFunctions(e);
      const [i, s] = P(t);
      this.htmlImg = i, s ? this.htmlContainer = s : this.replaceDOM = !0, this.changeStatus(v.waiting);
      const h = dt(this.htmlImg.dataset, e);
      this.options = ut(h), this.initializeCropper();
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
    t && t.length !== 0 && (this.firstInit = !1, this.htmlImg.src = t);
  }
  /**
   * Resets the crop region to the initial settings.
   */
  reset() {
    try {
      this.firstInit = !1, this.destroy(), this.initializeCropper();
    } catch (t) {
      if (t instanceof y || t instanceof w || t instanceof S)
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
   * Sets the value of a box.
   * @param {BoxProps} box - The box object containing properties to set.
   * @public
   */
  setValue(t) {
    this.box.setValue(t), this.onCropEndCallback();
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
  /**
   * Retrieves the image properties.
   * @returns {real: Size, relative: Size} An object containing the real and relative properties.
   * @public
   */
  getImageProps() {
    return { real: this.real, relative: this.relative };
  }
  /**
   * Retrieves the status of the instance.
   * @returns {Status} The status of the instance.
   */
  getStatus() {
    return this.status;
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
    this.changeStatus(v.error);
    const e = {
      name: t.name,
      message: t.message,
      messageId: t.messageId,
      data: t.data
    };
    if (this.destroy(), this.callbacks.onError)
      this.callbacks.onError(this, e);
    else
      throw t;
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
    this.initializeObserver(), this.htmlImg.src && this.htmlImg.width !== 0 && this.htmlImg.height !== 0 && (this.preventDoubleLoad = this.htmlImg.src, this.initialize()), this.htmlImg.onload = () => {
      !this.htmlImg.src || this.preventDoubleLoad === this.htmlImg.src || (this.preventDoubleLoad = void 0, this.changeStatus(
        this.status === v.waiting ? v.waiting : v.reloading
      ), this.observer.unobserve(this.htmlImg), this.initialize());
    };
  }
  initialize() {
    try {
      this.createDOM(), this.calcContainerProps(), this.updateRelativeSize(), this.createNewBox(), this.onInitializeCallback(), this.observer.observe(this.htmlImg), this.changeStatus(v.ready), this.onCropEndCallback();
    } catch (t) {
      if (t instanceof S)
        this.onErrorCallback(t);
      else
        throw t;
    }
  }
  createDOM() {
    if (this.isDomCreated)
      return;
    this.replaceDOM && (this.htmlContainer = document.createElement("div"), this.htmlContainer.classList.add(c.base), this.htmlImg.parentElement && this.htmlImg.parentElement.replaceChild(
      this.htmlContainer,
      this.htmlImg
    ), this.htmlContainer.appendChild(this.htmlImg));
    const t = this.htmlContainer;
    it(t), this.htmlImg.classList.add(c.img), this.background = new nt(t, c.background), this.newSelection = new ht(
      t,
      c.new,
      this.eventBus,
      this.options.allowNewSelection
    ), this.selection = new ot(
      t,
      c.selection,
      this.eventBus,
      this.options.allowMove
    ), this.handles = new mt(
      t,
      c.hanleds,
      this.eventBus,
      this.options.allowResize,
      c.handle
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
    }, i = t.allowChange, s = Z(
      t,
      this.options.minSize,
      this.options.maxSize,
      this.real,
      this.ratio
    ), h = G(
      s,
      this.real,
      this.options.aspectRatio,
      i,
      e
    );
    J(h), this.box = new et(h);
  }
  updateRelativeSize() {
    const { width: t, height: e } = this.htmlImg.getBoundingClientRect();
    this.htmlImg.offsetWidth === 0 || this.htmlImg.offsetHeight === 0 ? this.relative = { width: this.real.width, height: this.real.height } : this.relative = { width: t, height: e }, this.ratio = {
      width: this.relative.width / this.real.width,
      height: this.relative.height / this.real.height
    };
  }
  changeStatus(t) {
    this.status = t, this.htmlImg && this.setDataset(c.valueStatus, t);
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
    const h = this.handles.handleByMovableType(i, s).getData(), a = {
      coordinates: this.mouseCoordinates(t),
      size: e,
      points: h.points
    };
    return this.box.prepareAndApplyNewSizeAndCoordinates(a) ? (this.redraw(), this.onHandleMoveStart(h), !0) : !1;
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
    const e = this.mouseCoordinates(t), i = q(
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
    const { offsetX: e, offsetY: i } = this.currentMove, { x: s, y: h } = this.mouseCoordinates(t);
    this.box.move({ x: s - e, y: h - i }), this.redraw(), this.onCropMoveCallback();
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
    this.setDataset(c.valueX, e.x), this.setDataset(c.valueY, e.y), this.setDataset(c.valueWidth, e.width), this.setDataset(c.valueHeight, e.height);
  }
}
export {
  pt as default
};
//# sourceMappingURL=trueCropper.es.js.map
