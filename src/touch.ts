/**
 * Enables support for touch devices by translating touch events to mouse events.
 */

/**
 * Binds an element's touch events to be simulated as mouse events.
 * @param {HTMLDivElement} element - The element to bind touch events to.
 */
export default function enableTouch(element: HTMLDivElement) {
  element.addEventListener("touchstart", simulateMouseEvent);
  element.addEventListener("touchend", simulateMouseEvent);
  element.addEventListener("touchmove", simulateMouseEvent);
}

/**
 * Translates a touch event to a mouse event.
 * @param {Event} e - The touch event to be translated.
 */
function simulateMouseEvent(e: Event) {
  e.preventDefault();
  const event = e as TouchEvent;
  const touch = event.changedTouches[0];

  touch.target.dispatchEvent(
    new MouseEvent(touchEventToMouseEvent(event.type), {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: touch.clientX,
      clientY: touch.clientY,
      screenX: touch.screenX,
      screenY: touch.screenY,
    }),
  );
}

/**
 * SubFunction to translates a touch type event to a mouse event
 * @param {string} type - The type of touch event to be translated.
 */
function touchEventToMouseEvent(type: string) {
  switch (type) {
    case "touchstart":
      return "mousedown";
    case "touchmove":
      return "mousemove";
    default: // touchend || touchcanceled
      return "mouseup";
  }
}
