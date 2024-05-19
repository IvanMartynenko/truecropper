/**
 * Background component
 */

import { createDiv } from "../helpers";
import { BoxProps } from "../types";

export default class Background {
  private nested: HTMLDivElement[] = [];

  public constructor(parent: HTMLDivElement, className: string) {
    for (let i = 0; i < 4; i++) {
      const div = createDiv(`${className}-${i}`, parent);
      this.nested.push(div);
    }
  }

  public hide() {
    for (const el of this.nested) {
      el.style.display = "none";
    }
  }

  public show() {
    for (const el of this.nested) {
      el.style.display = "block";
    }
  }

  public destroy() {
    for (const el of this.nested) {
      el.remove();
    }
  }

  public transform(box: BoxProps) {
    const x2 = box.x + box.width;
    const y2 = box.y + box.height;
    this.nested[0].style.height = `${box.y}px`;
    this.nested[0].style.left = `${box.x}px`;
    // this.nested[0].style.width = `${box.width}px`;
    this.nested[0].style.right = `calc(100% - ${box.width}px - ${box.x}px)`;

    this.nested[1].style.left = `${x2}px`;
    // this.nested[1].style.top = `${box.y}px`;

    this.nested[2].style.left = `${box.x}px`;
    // this.nested[2].style.width = `${box.width}px`;
    this.nested[2].style.right = `calc(100% - ${box.width}px - ${box.x}px)`;
    this.nested[2].style.top = `${y2}px`;

    // this.nested[3].style.top = `${box.y}px`;
    // this.nested[3].style.height = `${box.height + 0.002}px`;
    this.nested[3].style.width = `${box.x}px`;
  }
}
