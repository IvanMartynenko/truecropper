/**
 * NewSelection component
 */

import { createDiv } from "../helpers";
import { TrueCropperCoreCallbackEventFunction } from "../types";

export default class NewSelection {
  private eventBus: TrueCropperCoreCallbackEventFunction;
  private el: HTMLDivElement;
  private startMouse = { mouseX: 0, mouseY: 0 };
  private newBoxCreated: boolean = false;
  private listener?: (e: MouseEvent) => void;
  /**
   * Creates a new NewSelection instance.
   * @constructor
   */
  public constructor(
    parent: HTMLDivElement,
    className: string,
    eventBus: TrueCropperCoreCallbackEventFunction,
    enable: boolean,
  ) {
    this.eventBus = eventBus;
    this.el = createDiv(className, parent);
    if (enable) {
      // Attach initial listener
      this.listener = this.mouseEvent();
      this.el.addEventListener("mousedown", this.listener);
      this.mouseEvent();
    } else {
      this.hide();
    }
  }

  public hide() {
    this.el.style.display = "none";
  }

  public show() {
    this.el.style.display = "block";
  }

  public destroy() {
    if (this.listener) {
      this.el.removeEventListener("mousedown", this.listener);
    }
    this.el.remove();
  }

  private mouseEvent() {
    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      // Save start mouse coordinates
      this.startMouse = { mouseX: e.clientX, mouseY: e.clientY };
      this.newBoxCreated = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      if (this.newBoxCreated) {
        // Notify parent
        const data = { x: e.clientX, y: e.clientY };
        this.eventBus({ type: "handlemove", data });
      } else {
        this.tryToCreateNewBox(e.clientX, e.clientY);
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Notify parent
      if (this.newBoxCreated) {
        this.eventBus({ type: "handleend" });
      }
    };

    return onMouseDown;
  }

  private tryToCreateNewBox(mouseX: number, mouseY: number) {
    if (
      mouseX === this.startMouse.mouseX ||
      mouseY === this.startMouse.mouseY
    ) {
      return;
    }

    const leftMovable = mouseX < this.startMouse.mouseX;
    const topMovable = mouseY < this.startMouse.mouseY;
    const [x, width] = leftMovable
      ? [mouseX, this.startMouse.mouseX - mouseX]
      : [this.startMouse.mouseX, mouseX - this.startMouse.mouseX];
    const [y, height] = topMovable
      ? [mouseY, this.startMouse.mouseY - mouseY]
      : [this.startMouse.mouseY, mouseY - this.startMouse.mouseY];
    // Notify parent
    const data = {
      coordinates: { x, y },
      size: { width, height },
      leftMovable,
      topMovable,
    };
    this.newBoxCreated = this.eventBus({ type: "createnewbox", data });
  }
}
