/**
 * Handles component
 *
 * This module defines a collection of resize handles used in the cropping interface.
 */

import { createDiv } from "../helpers";
import { TrueCropperBoxProps, TrueCropperEventHandler } from "../types";
import Handle from "./handle";

/**
 * Defines the configuration for each resize handle.
 *
 * @property {object} position - The normalized (x, y) position of the handle within
 *      the crop region. Values are between 0 and 1.
 * @property {string} cursor - The CSS cursor style for this handle.
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

/**
 * Type definition for a single handle configuration.
 */
export type HandlesType = (typeof HANDLES)[number];

/**
 * Represents a collection of resize handles used in the cropping interface.
 */
export default class Handles {
  /**
   * The container element for the handles.
   */
  private el: HTMLDivElement;
  /**
   * Array of individual handle instances.
   */
  private handles: Handle[] = [];

  /**
   * Creates a new instance of the Handles collection.
   *
   * @param parent - The parent HTMLDivElement to which the handles container is appended.
   * @param className - The CSS class name for the handles container.
   * @param eventBus - A callback function to handle events emitted by the handles.
   * @param enable - Determines whether the handles are enabled for user interaction.
   * @param handleClassName - The CSS class name for individual handle elements.
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

  /**
   * Hides all the handles by setting their display style to "none".
   */
  public hide(): void {
    for (const handle of this.handles) {
      handle.hide();
    }
  }

  /**
   * Shows all the handles by setting their display style to "block".
   */
  public show(): void {
    for (const handle of this.handles) {
      handle.show();
    }
  }

  /**
   * Destroys all handles by removing them from the DOM.
   */
  public destroy(): void {
    for (const handle of this.handles) {
      handle.destroy();
    }
    this.el.remove();
  }

  /**
   * Transforms (repositions) all handles based on the provided crop box dimensions.
   *
   * @param box - An object representing the crop box properties (x, y, width, height).
   */
  public transform(box: TrueCropperBoxProps): void {
    for (const handle of this.handles) {
      handle.transform(box);
    }
  }

  /**
   * Retrieves a handle based on the movability of the crop box edges.
   *
   * @param leftMovable - Indicates whether the left edge of the crop box is movable.
   * @param topMovable - Indicates whether the top edge of the crop box is movable.
   * @returns The handle corresponding to the specified movability configuration.
   */
  public handleByMovableType(leftMovable: boolean, topMovable: boolean): Handle {
    if (leftMovable) {
      return topMovable ? this.handles[0] : this.handles[6];
    } else {
      return topMovable ? this.handles[2] : this.handles[4];
    }
  }
}
