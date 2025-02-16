/**
 * Selection component
 */

import { createDiv } from "../helpers";
import { TrueCropperBoxProps, TrueCropperEventHandler } from "../types";

export default class Selection {
  private eventBus: TrueCropperEventHandler;
  private el: HTMLDivElement;
  private enable: boolean;
  private listener?: (e: MouseEvent) => void;

  public constructor(
    parent: HTMLDivElement,
    className: string,
    eventBus: TrueCropperEventHandler,
    enable: boolean,
  ) {
    this.eventBus = eventBus;
    // Create DOM element
    this.el = createDiv(className, parent);

    this.enable = enable;
    if (enable) {
      // Attach initial listener
      this.listener = this.mouseEvent();
      this.el.addEventListener("mousedown", this.listener);
    } else {
      this.el.style.cursor = "default";
    }
  }

  public transform(box: TrueCropperBoxProps) {
    // Calculate handle position
    this.el.style.transform = `translate(${box.x}px, ${box.y}px)`;
    this.el.style.width = `${box.width}px`;
    this.el.style.height = `${box.height}px`;
  }

  public hide() {
    this.el.style.display = "none";
    this.el.style.cursor = "default";
  }

  public show() {
    this.el.style.display = "block";
    this.el.style.cursor = "move";
  }

  public destroy() {
    if (this.listener) {
      this.el.removeEventListener("mousedown", this.listener);
    }
    this.el.remove();
  }

  /**
   * Attach event listeners for the crop selection element.
   * Enables dragging/moving of the selection element.
   */
  private mouseEvent() {
    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      if (!this.enable) {
        return;
      }
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      // Notify parent
      const data = { x: e.clientX, y: e.clientY };
      this.eventBus({ type: "regionstart", data });
    };

    const onMouseMove = (e: MouseEvent) => {
      e.stopPropagation();

      // Notify parent
      const data = { x: e.clientX, y: e.clientY };
      this.eventBus({ type: "regionmove", data });
    };

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Notify parent
      const data = { x: e.clientX, y: e.clientY };
      this.eventBus({ type: "regionend", data });
    };

    return onMouseDown;
  }
}
