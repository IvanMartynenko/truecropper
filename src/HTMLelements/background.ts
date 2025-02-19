/**
 * Background component for managing overlay elements.
 */

import { createDiv } from "../helpers";
import { TrueCropperBoxProps } from "../types";

/**
 * The Background class manages a set of overlay elements (divs) used as a background
 * for cropping functionality. It provides methods to show, hide, remove, and transform
 * the background elements based on the crop box.
 */
export default class Background {
  private nested: HTMLDivElement[] = [];

  /**
   * Creates an instance of Background.
   *
   * @param parent - The parent HTMLDivElement where the background elements will be appended.
   * @param className - The base CSS class name for the background elements.
   */
  public constructor(parent: HTMLDivElement, className: string) {
    for (let i = 0; i < 4; i++) {
      const div = createDiv(`${className}-${i}`, parent);
      this.nested.push(div);
    }
  }

  /**
   * Hides the background elements by setting their display style to "none".
   */
  public hide(): void {
    for (const el of this.nested) {
      el.style.display = "none";
    }
  }

  /**
   * Displays the background elements by setting their display style to "block".
   */
  public show(): void {
    for (const el of this.nested) {
      el.style.display = "block";
    }
  }

  /**
   * Removes the background elements from the DOM.
   */
  public destroy(): void {
    for (const el of this.nested) {
      el.remove();
    }
  }

  /**
   * Transforms the background elements based on the provided crop box.
   *
   * @param box - An object representing the crop box, including its x and y coordinates and dimensions.
   */
  public transform(box: TrueCropperBoxProps): void {
    const x2 = box.x + box.width;
    const y2 = box.y + box.height;

    // Top overlay: positioned above the crop box.
    this.nested[0].style.height = `${box.y}px`;
    this.nested[0].style.left = `${box.x}px`;
    this.nested[0].style.right = `calc(100% - ${box.width}px - ${box.x}px)`;

    // Right overlay: positioned to the right of the crop box.
    this.nested[1].style.left = `${x2}px`;

    // Bottom overlay: positioned below the crop box.
    this.nested[2].style.left = `${box.x}px`;
    this.nested[2].style.right = `calc(100% - ${box.width}px - ${box.x}px)`;
    this.nested[2].style.top = `${y2}px`;

    // Left overlay: positioned to the left of the crop box.
    this.nested[3].style.width = `${box.x}px`;
  }
}
