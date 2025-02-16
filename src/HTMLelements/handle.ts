/**
 * Handle component
 */

import { createDiv } from "../helpers";
import { TrueCropperBoxProps, TrueCropperEventHandler } from "../types";
import { HandlesType } from "./handles";

export default class Handle {
  public position: { x: number; y: number };
  private eventBus: TrueCropperEventHandler;
  public el!: HTMLDivElement;
  private enable: boolean;
  private listener?: (e: MouseEvent) => void;

  public constructor(
    parent: HTMLDivElement,
    className: string,
    item: HandlesType,
    eventBus: TrueCropperEventHandler,
    enable: boolean,
  ) {
    this.position = item.position;
    this.eventBus = eventBus;
    this.enable = enable;

    this.el = createDiv(className, parent);
    this.el.style.cursor = item.cursor;

    if (enable) {
      // Attach initial listener
      this.listener = this.mouseEvent();
      this.el.addEventListener("mousedown", this.listener);
    } else {
      this.hide();
    }
  }

  public show() {
    this.el.style.display = "block";
  }

  public hide() {
    this.el.style.display = "none";
  }

  public destroy() {
    if (this.listener) {
      this.el.removeEventListener("mousedown", this.listener);
    }
    this.el.remove();
  }

  public transform(box: TrueCropperBoxProps) {
    // Calculate handle position
    const handleWidth = this.el.offsetWidth;
    const handleHeight = this.el.offsetHeight;
    const left = box.x + box.width * this.position.x - handleWidth / 2;
    const top = box.y + box.height * this.position.y - handleHeight / 2;

    this.el.style.transform = `translate(${left}px, ${top}px)`;
  }

  public getData() {
    return {
      points: { ...this.position },
    };
  }

  private mouseEvent() {
    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      if (!this.enable) {
        return;
      }
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      // Notify parent
      const data = this.getData();
      this.eventBus({ type: "handlestart", data });
    };

    const onMouseMove = (e: MouseEvent) => {
      e.stopPropagation();

      // Notify parent
      const data = { x: e.clientX, y: e.clientY };
      this.eventBus({ type: "handlemove", data });
    };

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Notify parent
      this.eventBus({ type: "handleend" });
    };

    return onMouseDown;
  }
}
