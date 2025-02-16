/**
 * Handle component
 */

import { createDiv } from "../helpers";
import { TrueCropperBoxProps, TrueCropperEventHandler } from "../types";
import Handle from "./handle";

/**
 * Define a list of handles to create.
 *
 * @property {Array} position - The x and y ratio position of the handle within
 *      the crop region. Accepts a value between 0 to 1 in the order of [X, Y].
 * @property {String} cursor - The CSS cursor of this handle.
 */
const HANDLES = [
  { position: { x: 0, y: 0 }, cursor: "nw-resize" },
  { position: { x: 0.5, y: 0 }, cursor: "n-resize" },
  { position: { x: 1, y: 0 }, cursor: "ne-resize" },
  { position: { x: 1, y: 0.5 }, cursor: "e-resize" },
  { position: { x: 1, y: 1 }, cursor: "se-resize" },
  { position: { x: 0.5, y: 1 }, cursor: "s-resize" },
  { position: { x: 0, y: 1 }, cursor: "sw-resize" },
  { position: { x: 0, y: 0.5 }, cursor: "w-resize" },
] as const;

export type HandlesType = (typeof HANDLES)[number];

export default class Handles {
  private el: HTMLDivElement;
  private handles: Handle[] = [];
  /**
   * Creates a new Handle instance.
   */
  public constructor(
    parent: HTMLDivElement,
    className: string,
    eventBus: TrueCropperEventHandler,
    enable: boolean,
    handleClassName: string,
  ) {
    this.el = createDiv(className, parent);
    for (const item of HANDLES) {
      const handle = new Handle(
        this.el,
        handleClassName,
        item,
        eventBus,
        enable,
      );
      this.handles.push(handle);
    }
  }

  public hide() {
    for (const handle of this.handles) {
      handle.hide();
    }
  }

  public show() {
    for (const handle of this.handles) {
      handle.show();
    }
  }

  public destroy() {
    for (const handle of this.handles) {
      handle.destroy();
    }
    this.el.remove();
  }

  public transform(box: TrueCropperBoxProps) {
    for (const handle of this.handles) {
      handle.transform(box);
    }
  }

  public handleByMovableType(leftMovable: boolean, topMovable: boolean) {
    if (leftMovable) {
      return topMovable ? this.handles[0] : this.handles[6];
    } else {
      return topMovable ? this.handles[2] : this.handles[4];
    }
  }
}
