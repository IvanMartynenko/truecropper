var U = Object.defineProperty;
var F = (n, t, e) => t in n ? U(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var r = (n, t, e) => F(n, typeof t != "symbol" ? t + "" : t, e);
const w = "truecropper", u = {
  base: w,
  img: `${w}__image`,
  background: `${w}__background`,
  new: `${w}__new-selection`,
  selection: `${w}__selection`,
  handle: `${w}__handle`,
  hanleds: `${w}__handles`,
  valueX: `${w}X`,
  valueY: `${w}Y`,
  valueWidth: `${w}Width`,
  valueHeight: `${w}Height`,
  valueStatus: `${w}Status`,
  epsilon: 0.05
}, _ = {
  /**
   * Error when the target element is not found.
   */
  elementNotFound: { text: "Unable to find element", id: 0 },
  /**
   * Error when the image source is not provided.
   */
  srcEmpty: { text: "Image src not provided", id: 1 },
  /**
   * Error when the parent element does not contain the required <div> element.
   */
  parentNotContainDiv: { text: "Parent element can be exists", id: 2 }
};
class v extends Error {
  /**
   * Creates an instance of TrueCropperHtmlError.
   *
   * @param key - The key corresponding to a predefined error message.
   */
  constructor(e) {
    const i = _[e];
    super(i.text);
    /**
     * Additional error data.
     */
    r(this, "data");
    /**
     * The unique identifier for the error message.
     */
    r(this, "messageId");
    Object.setPrototypeOf(this, v.prototype), this.name = "TrueCropperHtmlError", this.data = {}, this.messageId = i.id;
  }
}
class x extends Error {
  /**
   * Creates an instance of TrueCropperImageError.
   *
   * @param message - The error message.
   * @param data - Additional data associated with the image error.
   * @param messageId - A unique identifier for the error message.
   */
  constructor(e, i, s) {
    super(e);
    /**
     * Additional data related to the image error.
     */
    r(this, "data");
    /**
     * A unique identifier for the error message.
     */
    r(this, "messageId");
    Object.setPrototypeOf(this, x.prototype), this.name = "TrueCropperImageError", this.data = {
      target: i.target,
      targetCoordinates: i.coordinates ? { ...i.coordinates } : void 0,
      targetSize: { ...i.targetSize },
      source: i.source,
      sourceSize: { ...i.sourceSize }
    }, this.messageId = s;
  }
  /**
   * Creates a new TrueCropperImageError instance for a start size issue.
   *
   * @param target - The target element identifier.
   * @param coordinates - The coordinates related to the error.
   * @param targetSize - The dimensions of the target element.
   * @param source - The source element identifier.
   * @param sourceSize - The dimensions of the source element.
   * @returns A new instance of TrueCropperImageError.
   */
  static startSize(e, i, s, h, o) {
    const a = `The ${e} (${i.x}x${i.y}:${s.width}x${s.height}) exceeds the ${h} (${o.width}x${o.height})`, l = {
      target: e,
      coordinates: i,
      targetSize: s,
      source: h,
      sourceSize: o
    };
    return new this(a, l, 6);
  }
  /**
   * Creates a new TrueCropperImageError instance for a size issue.
   *
   * @param target - The target element identifier.
   * @param targetSize - The dimensions of the target element.
   * @param source - The source element identifier.
   * @param sourceSize - The dimensions of the source element.
   * @returns A new instance of TrueCropperImageError.
   */
  static size(e, i, s, h) {
    const o = `The ${e} (${i.width}x${i.height}) exceeds the ${s} (${h.width}x${h.height})`, a = {
      target: e,
      coordinates: void 0,
      targetSize: i,
      source: s,
      sourceSize: h
    };
    return new this(o, a, 7);
  }
}
class d extends Error {
  /**
   * Creates an instance of TrueCropperOptionsError.
   *
   * @param message - The error message.
   * @param data - Additional error data.
   * @param messageId - A unique identifier for the error message.
   */
  constructor(e, i, s = 0) {
    super(e);
    /**
     * Additional data associated with the options error.
     */
    r(this, "data");
    /**
     * A unique identifier for the error message.
     */
    r(this, "messageId");
    Object.setPrototypeOf(this, d.prototype), this.name = "TrueCropperOptionsError", this.data = i, this.messageId = s;
  }
  /**
   * Factory method for creating an options error related to aspect ratio mismatch.
   *
   * @param name - The name of the property or dimension with the aspect ratio issue.
   * @param calculatedAspectRatio - The calculated aspect ratio based on dimensions.
   * @param aspectRatio - The expected aspect ratio.
   * @param epsilon - The tolerance value for aspect ratio differences.
   * @returns A new instance of TrueCropperOptionsError with aspect ratio error details.
   */
  static aspectRatio(e, i, s, h) {
    const o = `The specified aspect ratio (${s}) and calculated ${e} dimensions (width/height = ${i}) are greater than (${h}). This might be due to a rounding error on the server side or incorrect minimum sizes.`;
    return new this(o, { name: e }, 5);
  }
  static widthIsNull(e) {
    const i = `The width of (${e}) is null`;
    return new this(i, { name: e }, 8);
  }
  static heightIsNull(e) {
    const i = `The height of (${e}) is null`;
    return new this(i, { name: e }, 9);
  }
  static badSizeOfPercent(e) {
    const i = `The percent values of (${e}) > 100`;
    return new this(i, { name: e }, 10);
  }
  /**
   * Factory method for creating a generic options error.
   *
   * @param name - The name of the option.
   * @param object - The expected or disallowed object description.
   * @param positive - If true, indicates the option must be the specified object; if false, indicates it must not be.
   * @returns A new instance of TrueCropperOptionsError with generic error details.
   */
  static new(e, i, s = !0) {
    const h = s ? 3 : 4, o = s ? `${e} must be ${i}` : `${e} must not be ${i}`;
    return new this(o, { name: e, object: i }, h);
  }
}
const q = (n) => {
  let t = null;
  if (typeof n == "string") {
    if (t = document.querySelector(n), t === null)
      throw new v("elementNotFound");
  } else
    t = n;
  if (!(t instanceof HTMLImageElement))
    throw new v("srcEmpty");
  let e = t.parentElement;
  if (!e)
    throw new v("parentNotContainDiv");
  return e.classList.contains(u.base) || (e = null), [t, e];
}, M = (n, t = void 0) => {
  const e = document.createElement("div");
  return e.className = n, t && t.appendChild(e), e;
}, V = (n, t) => {
  if (t.savedCoordinate < 0)
    return { flipped: !1, coordinate: null, size: null, point: 0.5 };
  const e = n < t.savedCoordinate, i = t.left !== e, s = t.savedCoordinate, h = Math.abs(t.savedCoordinate - n), o = Number(e);
  return {
    flipped: i,
    coordinate: s,
    size: h,
    point: o
  };
}, Z = (n, t, e) => {
  const i = V(n.x, t), s = V(n.y, e);
  return {
    flipped: { x: i.flipped, y: s.flipped },
    newBox: {
      coordinates: { x: i.coordinate, y: s.coordinate },
      size: { width: i.size, height: s.size },
      points: { x: i.point, y: s.point }
    }
  };
}, G = (n, t, e, i, s) => {
  const h = (m, p, z) => z === "relative" ? m * s[p] : z === "percent" ? m >= 1 ? i[p] * (m / 100) : i[p] * m : m, o = {
    width: h(t.width, "width", t.unit),
    height: h(t.height, "height", t.unit)
  }, a = {
    width: h(e.width, "width", e.unit),
    height: h(e.height, "height", e.unit)
  }, l = {
    x: h(n.x, "width", n.unit),
    y: h(n.y, "height", n.unit)
  }, c = {
    width: h(n.width, "width", n.unit),
    height: h(n.height, "height", n.unit)
  };
  return { coordinates: l, size: c, minSize: o, maxSize: a };
}, J = (n, t, e, i, s, h) => {
  const o = I(
    n.minSize,
    { width: 1, height: 1 },
    e
  );
  let a = I(n.maxSize, t, e), l = I(n.size, t, e);
  a = tt(a, t, e);
  let c = n.coordinates;
  if (s) {
    const m = et(
      c,
      l,
      o,
      a,
      t,
      e,
      h.x,
      h.y
    );
    c = m.coordinates, l = m.size;
  }
  return { coordinates: c, size: l, minSize: o, maxSize: a, imgProps: t, aspectRatio: e, epsilon: i };
}, K = ({
  coordinates: n,
  minSize: t,
  maxSize: e,
  size: i,
  imgProps: s
}) => {
  const h = (o, a, l, c) => {
    if (o.width > a.width || o.height > a.height)
      throw x.size(l, o, c, a);
  };
  if (h(t, s, "minSize", "imageSize"), h(t, e, "minSize", "maxSize"), h(t, i, "minSize", "startSize"), n.x + i.width > s.width || n.y + i.height > s.height)
    throw x.startSize(
      "startSize",
      n,
      i,
      "imageSize",
      s
    );
}, B = ({
  size: n,
  minSize: t,
  maxSize: e,
  aspectRatio: i
}) => {
  const s = { ...n };
  return e && (s.width > e.width && (s.width = e.width, s.height = i ? e.width / i : s.height), s.height > e.height && (s.width = i ? e.height * i : s.width, s.height = e.height)), t && (s.width < t.width && (s.width = t.width, s.height = i ? t.width / i : s.height), s.height < t.height && (s.width = i ? t.height * i : s.width, s.height = t.height)), s;
}, j = (n, t, e) => {
  const i = n * t;
  return { width: i, height: i / e };
}, W = (n, t, e) => {
  const i = n * t;
  return { width: i * e, height: i };
}, Q = (n, t, e) => {
  let i = { ...n.size };
  if (e === 0)
    return i;
  const s = n.isMultiAxis ? i.height * e >= i.width : n.isVerticalMovement, h = n.points.x === 1 || n.points.x === 0 ? 1 : 2, o = n.points.y === 1 || n.points.y === 0 ? 1 : 2;
  if (s) {
    const a = i.height;
    i = { width: a * e, height: a };
  } else {
    const a = i.width;
    i = { width: a, height: a / e };
  }
  return n.coordinates.x + i.width * (1 - n.points.x) > t.width && (i = j(
    t.width - n.coordinates.x,
    h,
    e
  )), n.coordinates.y + i.height * (1 - n.points.y) > t.height && (i = W(
    t.height - n.coordinates.y,
    o,
    e
  )), n.coordinates.x - i.width * n.points.x < 0 && (i = j(n.coordinates.x, h, e)), n.coordinates.y - i.height * n.points.y < 0 && (i = W(n.coordinates.y, o, e)), i;
}, I = (n, t, e) => {
  const i = { ...n };
  return e && !i.width && !i.height && (e > 1 ? i.height = t.height : i.width = t.width), i.width || (i.width = e ? i.height * e : t.width), i.height || (i.height = e ? i.width / e : t.height), i;
}, tt = (n, t, e) => {
  let i = { ...n };
  return e && (i.width > i.height * e ? i.width = i.height * e : i.height = i.width / e), i = B({
    size: i,
    maxSize: t,
    aspectRatio: e
  }), i;
}, et = (n, t, e, i, s, h, o, a) => {
  const l = { ...t }, c = { ...n }, m = Math.min(i.width, s.width - n.x), p = Math.min(i.height, s.height - n.y), z = B({
    size: l,
    maxSize: { width: m, height: p },
    minSize: e,
    aspectRatio: h
  });
  return l.width = z.width, l.height = z.height, c.x = o ? (s.width - l.width) / 2 : n.x, c.y = a ? (s.height - l.height) / 2 : n.y, { coordinates: c, size: l };
};
class it {
  /**
   * Creates a new Box instance.
   * @constructor
   * @param {TrueCropperBoxInitConfig} - Initialization parameters.
   */
  constructor({
    coordinates: t,
    size: e,
    minSize: i,
    maxSize: s,
    imgProps: h,
    aspectRatio: o,
    epsilon: a
  }) {
    r(this, "coordinates");
    r(this, "size");
    r(this, "minSize");
    r(this, "maxSize");
    r(this, "imgSize");
    r(this, "aspectRatio");
    r(this, "epsilon");
    this.coordinates = { ...t }, this.size = { ...e }, this.minSize = { ...i }, this.maxSize = { ...s }, this.imgSize = { ...h }, this.aspectRatio = o, this.epsilon = a;
  }
  /**
   * Sets the value of coordinates and size properties based on the provided BoxProps object.
   * @param {TrueCropperBoxProps} box - The BoxProps object containing x, y, width, and height properties.
   * @returns {void}
   */
  setValue(t) {
    return t.width < this.minSize.width || t.height < this.minSize.height ? { ok: !1, message: "Crop region is smaller than the minimum allowed size." } : t.width > this.maxSize.width || t.height > this.maxSize.height ? { ok: !1, message: "Crop region exceeds the maximum allowed size." } : this.aspectRatio && t.width / t.height - this.aspectRatio > this.epsilon ? { ok: !1, message: "Crop region does not match the required aspect ratio." } : t.x < 0 || t.x > this.imgSize.width || t.y < 0 || t.y > this.imgSize.height ? { ok: !1, message: "Crop region is positioned outside the image boundaries." } : t.x + t.width > this.imgSize.width || t.y + t.height > this.imgSize.height ? { ok: !1, message: "Crop region extends beyond the image boundaries." } : (this.coordinates = { x: t.x, y: t.y }, this.size = { width: t.width, height: t.height }, { ok: !0, message: "success" });
  }
  /**
   * Moves the box to the specified coordinates within the boundaries of the image.
   * @param {TrueCropperCoordinates} coordinates - The new x and y coordinates for the box.
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
   * @param {TrueCropperSize} size - The new size for the box.
   * @param {TrueCropperPoints} points - The relative points for resizing.
   * @returns {void}
   */
  resize(t, e) {
    if (e.x < 0 || e.x > 1 || e.y < 0 || e.y > 1)
      return { ok: !1, message: "Point coordinates must be within the range of 0 to 1." };
    const i = this.coordinates.x + this.size.width * e.x, s = this.coordinates.y + this.size.height * e.y, h = i - t.width * e.x, o = s - t.height * e.y;
    return this.setValue({ x: h, y: o, width: t.width, height: t.height });
  }
  /**
   * Scales the box by a factor and relative points.
   * @param {number} factor - The scaling factor.
   * @param {TrueCropperPoints} points - The relative points for scaling.
   * @returns {void}
   */
  scale(t, e) {
    const i = this.size.width * t, s = this.size.height * t;
    return this.resize({ width: i, height: s }, e);
  }
  /**
   * Retrieves the current dimensions of the box.
   * @returns {TrueCropperSize} The width and height of the box.
   */
  getBoxSize() {
    return { ...this.imgSize };
  }
  /**
   * Retrieves the current coordinates of the box.
   * @returns {TrueCropperCoordinates} The current x and y coordinates of the box.
   */
  getCoourdinates() {
    return { x: this.coordinates.x, y: this.coordinates.y };
  }
  /**
   * Retrieves the current box.
   * @returns {TrueCropperBoxProps} The current x and y coordinates, width, and height of the box.
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
   * @returns {TrueCropperBoxProps} The current x and y coordinates, width, and height of the box.
   */
  getValueReal() {
    return this.getValue();
  }
  /**
   * Retrieves the current value of the box relative to a specified width and height.
   * @param {TrueCropperSize} size - The width and height for calculating relative values.
   * @returns {TrueCropperBoxProps} The current x and y coordinates, width, and height of the box relative to the specified width and height.
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
   * @returns {TrueCropperBoxProps} The current x and y coordinates, width, and height of the box as a percentage of the image size.
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
   * @param {TrueCropperPoints} points - The relative points determining the opposite corner.
   * @returns {TrueCropperCoordinates} The calculated x and y coordinates of the opposite corner.
   */
  getOppositeCornerCoordinates(t) {
    const e = t.x === 0.5 ? -1 : this.coordinates.x + this.size.width * (1 - t.x), i = t.y === 0.5 ? -1 : this.coordinates.y + this.size.height * (1 - t.y);
    return { x: e, y: i };
  }
  /**
   * Prepares and applies new size and coordinates for the box based on the provided data.
   * @param {TrueCropperNullableBoxData} newBox - The new box data to apply.
   * @returns {boolean} Returns true if the new size and coordinates were successfully applied, false otherwise.
   */
  prepareAndApplyNewSizeAndCoordinates(t) {
    const e = this.prepareSizeAndCoordinates(t);
    if (e.size.width === 0 || e.size.height === 0)
      return !1;
    const i = this.adjustAndCalculateSize(e), s = this.adjustAndCalculateCoordinate(
      e.coordinates,
      i,
      e.points
    );
    return s.x < 0 || s.x + i.width > this.imgSize.width || s.y < 0 || s.y + i.height > this.imgSize.height ? !1 : (this.size = i, this.coordinates = s, !0);
  }
  /**
   * Prepares and calculates the size and coordinates for the new box based on the provided data.
   * @param {TrueCropperNullableBoxData} newBox - The new box data to calculate size and coordinates for.
   * @returns {TrueCropperDragData} An object containing the calculated size, coordinates, and other relevant properties.
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
      isMultiAxis: h,
      points: t.points
    };
  }
  /**
   * Adjusts and calculates the size based on aspect ratio and constraints for the new box.
   * @param {TrueCropperDragData} data - The data containing coordinates, size, and other parameters for adjustment.
   * @returns {TrueCropperSize} The adjusted size within the constraints of aspect ratio, min size, and max size.
   */
  adjustAndCalculateSize(t) {
    const e = Q(t, this.imgSize, this.aspectRatio);
    return B({
      size: e,
      minSize: this.minSize,
      maxSize: this.maxSize,
      aspectRatio: this.aspectRatio
    });
  }
  /**
   * Adjusts and calculates the new coordinates based on the input coordinates, size, and points.
   * @param {TrueCropperCoordinates} coordinates - The original coordinates.
   * @param {TrueCropperSize} size - The size to adjust the coordinates.
   * @param {TrueCropperPoints} points - The points to calculate the adjustment.
   * @returns {TrueCropperCoordinates} The adjusted coordinates based on the size and points.
   */
  adjustAndCalculateCoordinate(t, e, i) {
    return {
      x: t.x - e.width * i.x,
      y: t.y - e.height * i.y
    };
  }
}
function st(n) {
  n.addEventListener("touchstart", k), n.addEventListener("touchend", k), n.addEventListener("touchmove", k);
}
function k(n) {
  n.preventDefault();
  const t = n, e = t.changedTouches[0];
  e.target.dispatchEvent(
    new MouseEvent(nt(t.type), {
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
function nt(n) {
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
  /**
   * Creates an instance of Background.
   *
   * @param parent - The parent HTMLDivElement where the background elements will be appended.
   * @param className - The base CSS class name for the background elements.
   */
  constructor(t, e) {
    r(this, "nested", []);
    for (let i = 0; i < 4; i++) {
      const s = M(`${e}-${i}`, t);
      this.nested.push(s);
    }
  }
  /**
   * Hides the background elements by setting their display style to "none".
   */
  hide() {
    for (const t of this.nested)
      t.style.display = "none";
  }
  /**
   * Displays the background elements by setting their display style to "block".
   */
  show() {
    for (const t of this.nested)
      t.style.display = "block";
  }
  /**
   * Removes the background elements from the DOM.
   */
  destroy() {
    for (const t of this.nested)
      t.remove();
  }
  /**
   * Transforms the background elements based on the provided crop box.
   *
   * @param box - An object representing the crop box, including its x and y coordinates and dimensions.
   */
  transform(t) {
    const e = t.x + t.width, i = t.y + t.height;
    this.nested[0].style.height = `${t.y}px`, this.nested[0].style.left = `${t.x}px`, this.nested[0].style.right = `calc(100% - ${t.width}px - ${t.x}px)`, this.nested[1].style.left = `${e}px`, this.nested[2].style.left = `${t.x}px`, this.nested[2].style.right = `calc(100% - ${t.width}px - ${t.x}px)`, this.nested[2].style.top = `${i}px`, this.nested[3].style.width = `${t.x}px`;
  }
}
class ot {
  /**
   * Creates a new NewSelection instance.
   *
   * @param parent - The parent HTMLDivElement where the new selection element is appended.
   * @param className - The CSS class name for styling the new selection element.
   * @param eventBus - A callback function for communicating events (e.g., creating a new box).
   * @param enable - Determines whether the new selection functionality is enabled.
   */
  constructor(t, e, i, s) {
    /**
     * Callback function to communicate events to the parent.
     */
    r(this, "eventBus");
    /**
     * The container element for the new selection.
     */
    r(this, "el");
    /**
     * The starting mouse coordinates when a new selection is initiated.
     */
    r(this, "startMouse", { mouseX: 0, mouseY: 0 });
    /**
     * Flag indicating whether a new crop box has been created.
     */
    r(this, "newBoxCreated", !1);
    /**
     * Reference to the mousedown event listener.
     */
    r(this, "listener");
    this.eventBus = i, this.el = M(e, t), s ? (this.listener = this.mouseEvent(), this.el.addEventListener("mousedown", this.listener)) : this.hide();
  }
  /**
   * Hides the new selection element.
   */
  hide() {
    this.el.style.display = "none";
  }
  /**
   * Shows the new selection element.
   */
  show() {
    this.el.style.display = "block";
  }
  /**
   * Removes the new selection element from the DOM and cleans up event listeners.
   */
  destroy() {
    this.listener && this.el.removeEventListener("mousedown", this.listener), this.el.remove();
  }
  /**
   * Creates and returns a mousedown event handler that initiates the new selection process.
   *
   * When the user presses the mouse button down, mousemove and mouseup listeners are attached
   * to track the selection process.
   *
   * @returns A mousedown event handler function.
   */
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
  /**
   * Attempts to create a new crop box based on the current mouse coordinates.
   *
   * This method calculates the new crop box dimensions from the starting mouse position
   * and the current mouse position, then notifies the parent via the event bus.
   *
   * @param mouseX - The current x-coordinate of the mouse.
   * @param mouseY - The current y-coordinate of the mouse.
   */
  tryToCreateNewBox(t, e) {
    if (t === this.startMouse.mouseX || e === this.startMouse.mouseY)
      return;
    const i = t < this.startMouse.mouseX, s = e < this.startMouse.mouseY, [h, o] = i ? [t, this.startMouse.mouseX - t] : [this.startMouse.mouseX, t - this.startMouse.mouseX], [a, l] = s ? [e, this.startMouse.mouseY - e] : [this.startMouse.mouseY, e - this.startMouse.mouseY], c = {
      coordinates: { x: h, y: a },
      size: { width: o, height: l },
      leftMovable: i,
      topMovable: s
    };
    this.newBoxCreated = this.eventBus({ type: "createnewbox", data: c });
  }
}
class rt {
  /**
   * Creates a new Selection instance.
   *
   * @param parent - The parent HTMLDivElement to which the selection element is appended.
   * @param className - The CSS class name assigned to the selection element.
   * @param eventBus - A callback to emit events related to selection interactions.
   * @param enable - Determines if the selection element should be interactive.
   */
  constructor(t, e, i, s) {
    /**
     * Callback function to handle events emitted by the selection component.
     */
    r(this, "eventBus");
    /**
     * The DOM element representing the selection area.
     */
    r(this, "el");
    /**
     * Indicates whether the selection is interactive.
     */
    r(this, "enable");
    /**
     * Reference to the mousedown event listener.
     */
    r(this, "listener");
    this.eventBus = i, this.el = M(e, t), this.enable = s, s ? (this.listener = this.mouseEvent(), this.el.addEventListener("mousedown", this.listener)) : this.el.style.cursor = "default";
  }
  /**
   * Transforms the selection element to match the specified crop box dimensions.
   *
   * @param box - An object containing the x, y coordinates and width, height dimensions.
   */
  transform(t) {
    this.el.style.transform = `translate(${t.x}px, ${t.y}px)`, this.el.style.width = `${t.width}px`, this.el.style.height = `${t.height}px`;
  }
  /**
   * Hides the selection element.
   */
  hide() {
    this.el.style.display = "none", this.el.style.cursor = "default";
  }
  /**
   * Shows the selection element.
   */
  show() {
    this.el.style.display = "block", this.el.style.cursor = "move";
  }
  /**
   * Destroys the selection element by removing it from the DOM and cleaning up event listeners.
   */
  destroy() {
    this.listener && this.el.removeEventListener("mousedown", this.listener), this.el.remove();
  }
  /**
   * Creates and returns a mousedown event handler for the selection element.
   *
   * This handler attaches mousemove and mouseup listeners to the document to enable
   * dragging of the selection element. It emits corresponding events via the event bus.
   *
   * @returns A mousedown event handler function.
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
const at = ["real", "relative", "percent"];
var y = /* @__PURE__ */ ((n) => (n.Waiting = "waiting", n.Ready = "ready", n.Reloading = "reloading", n.Error = "error", n))(y || {});
const lt = u.base;
function dt(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function f(n) {
  return n == null;
}
function g(n, t, e, i = !1, s = !1) {
  if (f(t))
    return e;
  if (typeof t != "number")
    throw d.new(n, "number");
  if (Number.isNaN(t))
    throw d.new(n, "NaN", !1);
  if (i ? t < 0 : t <= 0)
    throw d.new(n, "positive");
  if (!s && t > 0 && t < 1)
    throw d.new(n, "fractional");
  return t;
}
function E(n, t, e) {
  if (f(t))
    return e;
  if (typeof t != "boolean")
    throw d.new(n, "boolean");
  return t;
}
function b(n, t, e) {
  if (f(t))
    return e;
  if (typeof t != "string" || !at.includes(t))
    throw d.new(n, "SizeUnit");
  return t;
}
const ct = (n, t) => {
  var h, o, a, l, c, m, p, z, D, R, T, L, X, Y, A, H;
  const e = t || {};
  if (typeof e != "object" || e === null)
    throw d.new("options", "object");
  const i = (P, O) => {
    const S = n[`${lt}${dt(P)}`];
    if (!S)
      return O;
    const C = S.toLowerCase();
    return C === "null" || C === "undefined" || C === "nil" ? O : S.trim().length !== 0 && !Number.isNaN(Number(S)) ? Number(S) : C === "true" ? !0 : C === "false" ? !1 : S;
  }, s = {
    aspectRatio: i("aspectRatio", e.aspectRatio),
    epsilon: i("epsilon", e.epsilon),
    allowFlip: i("allowFlip", e.allowFlip),
    allowNewSelection: i("allowNewSelection", e.allowNewSelection),
    allowMove: i("allowMove", e.allowMove),
    allowResize: i("allowResize", e.allowResize),
    returnMode: i("returnMode", e.returnMode),
    minSize: {
      width: i("minSizeWidth", (h = e.minSize) == null ? void 0 : h.width),
      height: i("minSizeHeight", (o = e.minSize) == null ? void 0 : o.height),
      unit: i("minSizeUnit", (a = e.minSize) == null ? void 0 : a.unit)
    },
    maxSize: {
      width: i("maxSizeWidth", (l = e.maxSize) == null ? void 0 : l.width),
      height: i("maxSizeHeight", (c = e.maxSize) == null ? void 0 : c.height),
      unit: i("maxSizeUnit", (m = e.maxSize) == null ? void 0 : m.unit)
    },
    startSize: {
      x: i("startSizeX", (p = e.startSize) == null ? void 0 : p.x),
      y: i("startSizeY", (z = e.startSize) == null ? void 0 : z.y),
      width: i("startSizeWidth", (D = e.startSize) == null ? void 0 : D.width),
      height: i("startSizeHeight", (R = e.startSize) == null ? void 0 : R.height),
      unit: i("startSizeUnit", (T = e.startSize) == null ? void 0 : T.unit)
    },
    defaultSize: {
      x: i("defaultSizeX", (L = e.defaultSize) == null ? void 0 : L.x),
      y: i("defaultSizeY", (X = e.defaultSize) == null ? void 0 : X.y),
      width: i("defaultSizeWidth", (Y = e.defaultSize) == null ? void 0 : Y.width),
      height: i("defaultSizeHeight", (A = e.defaultSize) == null ? void 0 : A.height),
      unit: i("defaultSizeUnit", (H = e.defaultSize) == null ? void 0 : H.unit)
    }
  };
  return f(s.startSize.x) && f(s.startSize.y) && f(s.startSize.width) && f(s.startSize.height) && (s.startSize = s.defaultSize), s;
}, $ = (n, t, e) => Math.abs(n - t) < e, ut = (n) => {
  var a;
  const t = g("aspectRatio", n.aspectRatio, 0, !1, !0), e = g("epsilon", n.epsilon, u.epsilon, !0, !0), i = {
    width: g("minSizeWidth", n.minSize.width, 0),
    height: g("minSizeHeight", n.minSize.height, 0),
    unit: b("minSizeUnit", (a = n.minSize) == null ? void 0 : a.unit, "real")
  }, s = {
    width: g("maxSizeWidth", n.maxSize.width, 0),
    height: g("maxSizeHeight", n.maxSize.height, 0),
    unit: b("maxSizeUnit", n.maxSize.unit, "real")
  }, h = {
    x: g("startSizeX", n.startSize.x, 0, !0),
    y: g("startSizeY", n.startSize.y, 0, !0),
    width: g("startSizeWidth", n.startSize.width, 0),
    height: g("startSizeHeight", n.startSize.height, 0),
    unit: b("startSizeUnit", n.startSize.unit, "real"),
    centeredX: f(n.startSize.x),
    centeredY: f(n.startSize.y),
    allowChange: !1
  };
  h.allowChange = h.width === 0 && h.height === 0;
  const o = {
    x: g("defaultSizeX", n.defaultSize.x, 0, !0),
    y: g("defaultSizeY", n.defaultSize.y, 0, !0),
    width: g("defaultSizeWidth", n.defaultSize.width, 0),
    height: g("defaultSizeHeight", n.defaultSize.height, 0),
    unit: b("defaultSizeUnit", n.defaultSize.unit, "real"),
    centeredX: f(n.defaultSize.x),
    centeredY: f(n.defaultSize.y),
    allowChange: !1
  };
  if (o.allowChange = o.width === 0 && o.height === 0, t) {
    if (i.width && i.height) {
      const l = i.width / i.height;
      if (!$(l, t, e))
        throw d.aspectRatio(
          "minimum",
          l,
          t,
          e
        );
    }
    if (o.width && o.height) {
      const l = o.width / o.height;
      if (!$(l, t, e))
        throw d.aspectRatio(
          "defaultSize",
          l,
          t,
          e
        );
    }
    if (h.width && h.height) {
      const l = h.width / h.height;
      if (!$(l, t, e))
        throw d.aspectRatio(
          "startSize",
          l,
          t,
          e
        );
    }
  }
  if (!h.centeredX && h.width === 0)
    throw d.widthIsNull("firstInitSize");
  if (!h.centeredY && h.height === 0)
    throw d.heightIsNull("firstInitSize");
  if (!o.centeredX && o.width === 0)
    throw d.widthIsNull("startSize");
  if (!o.centeredY && o.height === 0)
    throw d.heightIsNull("startSize");
  if (o.unit === "percent" && (o.x + o.width > 100 || o.y + o.height > 100))
    throw d.badSizeOfPercent("startSize");
  if (h.unit === "percent" && (h.x + h.width > 100 || h.y + h.height > 100))
    throw d.badSizeOfPercent("firstInitSize");
  if (i.unit === "percent" && (i.width > 100 || i.height > 100))
    throw d.badSizeOfPercent("minSize");
  if (s.unit === "percent" && (s.width > 100 || s.height > 100))
    throw d.badSizeOfPercent("maxSize");
  return {
    aspectRatio: t,
    epsilon: e,
    allowFlip: E("allowFlip", n.allowFlip, !0),
    allowNewSelection: E("allowNewSelection", n.allowNewSelection, !0),
    allowMove: E("allowMove", n.allowMove, !0),
    allowResize: E("allowResize", n.allowResize, !0),
    returnMode: b("returnMode", n.returnMode, "real"),
    minSize: i,
    maxSize: s,
    firstInitSize: h,
    startSize: o
  };
};
class gt {
  /**
   * Creates an instance of the Handle.
   *
   * @param parent - The parent HTMLDivElement to which the handle element is appended.
   * @param className - The CSS class name to assign to the handle element.
   * @param item - The handle configuration object, including its position and cursor style.
   * @param eventBus - A callback function to handle events emitted by the handle.
   * @param enable - Determines whether the handle is enabled.
   */
  constructor(t, e, i, s, h) {
    /**
     * The normalized position of the handle (values between 0 and 1).
     */
    r(this, "position");
    /**
     * Event bus function used to emit handle events.
     */
    r(this, "eventBus");
    /**
     * The HTML element representing the handle.
     */
    r(this, "el");
    /**
     * Flag indicating whether the handle is enabled.
     */
    r(this, "enable");
    /**
     * The event listener function for handling mouse events.
     */
    r(this, "listener");
    this.position = i.position, this.eventBus = s, this.enable = h, this.el = M(e, t), this.el.style.cursor = i.cursor, h ? (this.listener = this.mouseEvent(), this.el.addEventListener("mousedown", this.listener)) : this.hide();
  }
  /**
   * Displays the handle element.
   */
  show() {
    this.el.style.display = "block";
  }
  /**
   * Hides the handle element.
   */
  hide() {
    this.el.style.display = "none";
  }
  /**
   * Destroys the handle by removing event listeners and detaching it from the DOM.
   */
  destroy() {
    this.listener && this.el.removeEventListener("mousedown", this.listener), this.el.remove();
  }
  /**
   * Transforms the handle's position based on the provided crop box properties.
   *
   * @param box - The crop box properties (x, y, width, height).
   */
  transform(t) {
    const e = this.el.offsetWidth, i = this.el.offsetHeight, s = t.x + t.width * this.position.x - e / 2, h = t.y + t.height * this.position.y - i / 2;
    this.el.style.transform = `translate(${s}px, ${h}px)`;
  }
  /**
   * Retrieves data associated with the handle.
   *
   * @returns An object containing the handle's normalized position.
   */
  getData() {
    return {
      points: { ...this.position }
    };
  }
  /**
   * Creates and returns a mouse event handler for the handle.
   *
   * This function attaches mousemove and mouseup listeners to the document when a mousedown event is detected.
   *
   * @returns The mousedown event handler function.
   */
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
class wt {
  /**
   * Creates a new instance of the Handles collection.
   *
   * @param parent - The parent HTMLDivElement to which the handles container is appended.
   * @param className - The CSS class name for the handles container.
   * @param eventBus - A callback function to handle events emitted by the handles.
   * @param enable - Determines whether the handles are enabled for user interaction.
   * @param handleClassName - The CSS class name for individual handle elements.
   */
  constructor(t, e, i, s, h) {
    /**
     * The container element for the handles.
     */
    r(this, "el");
    /**
     * Array of individual handle instances.
     */
    r(this, "handles", []);
    this.el = M(e, t);
    for (const o of mt) {
      const a = new gt(
        this.el,
        h,
        o,
        i,
        s
      );
      this.handles.push(a);
    }
  }
  /**
   * Hides all the handles by setting their display style to "none".
   */
  hide() {
    for (const t of this.handles)
      t.hide();
  }
  /**
   * Shows all the handles by setting their display style to "block".
   */
  show() {
    for (const t of this.handles)
      t.show();
  }
  /**
   * Destroys all handles by removing them from the DOM.
   */
  destroy() {
    for (const t of this.handles)
      t.destroy();
    this.el.remove();
  }
  /**
   * Transforms (repositions) all handles based on the provided crop box dimensions.
   *
   * @param box - An object representing the crop box properties (x, y, width, height).
   */
  transform(t) {
    for (const e of this.handles)
      e.transform(t);
  }
  /**
   * Retrieves a handle based on the movability of the crop box edges.
   *
   * @param leftMovable - Indicates whether the left edge of the crop box is movable.
   * @param topMovable - Indicates whether the top edge of the crop box is movable.
   * @returns The handle corresponding to the specified movability configuration.
   */
  handleByMovableType(t, e) {
    return t ? e ? this.handles[0] : this.handles[6] : e ? this.handles[2] : this.handles[4];
  }
}
const N = { width: 0, height: 0 };
class pt {
  constructor(t, e) {
    r(this, "replaceDOM", !1);
    r(this, "htmlContainer");
    r(this, "htmlImg");
    r(this, "options");
    r(this, "newSelection");
    r(this, "selection");
    r(this, "handles");
    r(this, "background");
    r(this, "box");
    r(this, "currentMove");
    r(this, "activeHandle");
    r(this, "real", N);
    r(this, "relative", N);
    r(this, "ratio", N);
    r(this, "firstInit", !0);
    r(this, "isDomCreated", !1);
    r(this, "status", y.Waiting);
    r(this, "eventBus", this.event.bind(this));
    r(this, "observer");
    r(this, "preventDoubleLoad");
    r(this, "callbacks", {
      onInitialize: void 0,
      onCropStart: void 0,
      onCropChange: void 0,
      onCropEnd: void 0,
      onError: void 0
    });
    try {
      this.parseCallbackFunctions(e);
      const [i, s] = q(t);
      this.htmlImg = i, s ? this.htmlContainer = s : this.replaceDOM = !0, this.changeStatus(y.Waiting);
      const h = ct(this.htmlImg.dataset, e);
      this.options = ut(h), this.initializeCropper();
    } catch (i) {
      if (i instanceof v || i instanceof d)
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
      if (t instanceof v || t instanceof d || t instanceof x)
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
   * @param {TrueCropperCoordinates} coordinates
   */
  moveTo(t, e = void 0) {
    if (typeof t != "object" || !t || typeof t.x != "number" || typeof t.y != "number")
      return;
    const i = this.coordinatesToReal(t, e);
    this.box.move(i), this.redraw(), this.onCropEndCallback();
  }
  /**
   * Resizes the crop region to a specified width and height.
   * @param {SiTrueCropperSizeze} size
   * @param {TrueCropperPoints} points
   */
  resizeTo(t, e = { x: 0.5, y: 0.5 }, i = void 0) {
    if (typeof t != "object")
      return { ok: !1, message: "Size must be provided as an Size object." };
    if (!t || typeof t.width != "number" || typeof t.height != "number")
      return { ok: !1, message: "Size object must have numeric 'width' and 'height' properties." };
    if (typeof e != "object")
      return { ok: !1, message: "Points must be provided as an Points object." };
    if (!e || typeof e.x != "number" || typeof e.y != "number")
      return { ok: !1, message: "Points object must have numeric 'x' and 'y' properties." };
    const s = this.sizeToReal(t, i);
    this.box.resize(s, e), this.redraw(), this.onCropEndCallback();
  }
  /**
   * Scale the crop region by a factor.
   * @param {Number} factor
   * @param {TrueCropperPoints} points
   */
  scaleBy(t, e = { x: 0.5, y: 0.5 }) {
    if (typeof t != "number")
      return { ok: !1, message: "factor must be provided as numeric." };
    const i = this.box.scale(t, e);
    return i.ok && (this.redraw(), this.onCropEndCallback()), i;
  }
  /**
   * Sets the value of a box.
   * @param {TrueCropperBoxProps} box - The box object containing properties to set.
   * @public
   */
  setValue(t, e = void 0) {
    if (typeof t != "object")
      return { ok: !1, message: "Size must be provided as an BoxProps object." };
    if (!t || typeof t.x != "number" || typeof t.y != "number" || typeof t.width != "number" || typeof t.height != "number")
      return { ok: !1, message: "BoxProps object must have numeric 'x', 'y', 'width' and 'height' properties." };
    const i = this.boxToReal(t, e), s = this.box.setValue(i);
    return s.ok && (this.redraw(), this.onCropEndCallback()), s;
  }
  /**
   * Get the value of the crop region.
   * @param {TrueCropperSizeUnit | undefined} mode - The mode of return value type. If null, defaults to the return mode set in returnMode options.
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
   * @returns {real: TrueCropperSize, relative: TrueCropperSize} An object containing the real and relative properties.
   * @public
   */
  getImageProps() {
    return { real: this.real, relative: this.relative };
  }
  /**
   * Retrieves the status of the instance.
   * @returns {TrueCropperStatus} The status of the instance.
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
  onCropChangeCallback() {
    this.callbacks.onCropChange && this.callbacks.onCropChange(this, this.getValue());
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
    this.changeStatus(y.Error);
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
        this.status === y.Waiting ? y.Waiting : y.Reloading
      ), this.observer.unobserve(this.htmlImg), this.initialize());
    };
  }
  initialize() {
    try {
      this.createDOM(), this.calcContainerProps(), this.updateRelativeSize(), this.createNewBox(), this.onInitializeCallback(), this.observer.observe(this.htmlImg), this.changeStatus(y.Ready), this.onCropEndCallback();
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
    st(t), this.htmlImg.classList.add(u.img), this.background = new ht(t, u.background), this.newSelection = new ot(
      t,
      u.new,
      this.eventBus,
      this.options.allowNewSelection
    ), this.selection = new rt(
      t,
      u.selection,
      this.eventBus,
      this.options.allowMove
    ), this.handles = new wt(
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
    }, i = t.allowChange, s = G(
      t,
      this.options.minSize,
      this.options.maxSize,
      this.real,
      this.ratio
    ), h = J(
      s,
      this.real,
      this.options.aspectRatio,
      this.options.epsilon,
      i,
      e
    );
    K(h), this.box = new it(h);
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
    const e = this.mouseCoordinates(t), i = Z(
      e,
      this.activeHandle.x,
      this.activeHandle.y
    );
    !this.options.allowFlip && (i.flipped.x || i.flipped.y) || (this.box.prepareAndApplyNewSizeAndCoordinates(i.newBox) && this.redraw(), this.onCropChangeCallback());
  }
  /**
   *  Executes when the handle move ends.
   */
  onHandleMoveEnd() {
    this.onCropEndCallback();
  }
  /**
   * Executes when user starts moving the crop region.
   * @param {TrueCropperRegionMoveEvent["data"]} data - contains the raw mouseX, mouseY coordinate
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
    this.box.move({ x: s - e, y: h - i }), this.redraw(), this.onCropChangeCallback();
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
    t && (t.onError && typeof t.onError == "function" && (this.callbacks.onError = t.onError), t.onInitialize && typeof t.onInitialize == "function" && (this.callbacks.onInitialize = t.onInitialize), t.onCropStart && typeof t.onCropStart == "function" && (this.callbacks.onCropStart = t.onCropStart), t.onCropChange && typeof t.onCropChange == "function" && (this.callbacks.onCropChange = t.onCropChange), t.onCropEnd && typeof t.onCropEnd == "function" && (this.callbacks.onCropEnd = t.onCropEnd));
  }
  setDatasetCropValues(t) {
    const e = t || this.getValue();
    this.setDataset(u.valueX, e.x), this.setDataset(u.valueY, e.y), this.setDataset(u.valueWidth, e.width), this.setDataset(u.valueHeight, e.height);
  }
  /**
   * Converts a single numeric value from a given mode ("relative", "percent", or "real")
   * into its corresponding real value.
   *
   * @param value - The original value to convert.
   * @param ratio - The reference ratio (e.g., this.ratio.width or this.ratio.height) used for relative conversion.
   * @param total - The total dimension (from the image size) used for percent conversion.
   * @param mode - The conversion mode.
   * @returns The converted value.
   */
  getConvertedValue(t, e, i, s) {
    return s === "relative" ? t / e : s === "percent" ? i * t / 100 : t;
  }
  /**
   * Converts coordinate values (x and y) into their real equivalents based on the specified mode.
   *
   * @param coordinates - The coordinates to convert.
   * @param mode - The conversion mode ("relative", "percent", or "real").
   *               Defaults to `this.options.returnMode` if not provided.
   * @returns The converted coordinates.
   */
  coordinatesToReal(t, e = void 0) {
    const i = e || this.options.returnMode;
    if (i === "real")
      return { ...t };
    const s = this.box.getBoxSize();
    return {
      x: this.getConvertedValue(
        t.x,
        this.ratio.width,
        s.width,
        i
      ),
      y: this.getConvertedValue(
        t.y,
        this.ratio.height,
        s.height,
        i
      )
    };
  }
  /**
   * Converts size values (width and height) into their real equivalents based on the specified mode.
   *
   * @param size - The size object to convert.
   * @param mode - The conversion mode ("relative", "percent", or "real").
   *               Defaults to `this.options.returnMode` if not provided.
   * @returns The converted size object.
   */
  sizeToReal(t, e = void 0) {
    const i = e || this.options.returnMode;
    if (i === "real")
      return { ...t };
    const s = this.box.getBoxSize();
    return {
      width: this.getConvertedValue(
        t.width,
        this.ratio.width,
        s.width,
        i
      ),
      height: this.getConvertedValue(
        t.height,
        this.ratio.height,
        s.height,
        i
      )
    };
  }
  /**
   * Converts a box's properties (both position and size) into their real equivalents
   * based on the specified mode.
   *
   * @param box - The box properties to convert.
   * @param mode - The conversion mode ("relative", "percent", or "real").
   *               Defaults to `this.options.returnMode` if not provided.
   * @returns The converted box properties.
   */
  boxToReal(t, e = void 0) {
    const i = e || this.options.returnMode;
    return i === "real" ? t : {
      ...this.coordinatesToReal({ x: t.x, y: t.y }, i),
      ...this.sizeToReal({ width: t.width, height: t.height }, i)
    };
  }
}
export {
  pt as default
};
//# sourceMappingURL=truecropper.es.js.map
