/**
 * Selection component for crop region interaction.
 *
 * This component represents the crop selection area that the user can drag to move.
 * It handles mouse events and communicates state changes via an event bus.
 */

import { createDiv } from "../helpers";
import { TrueCropperBoxProps, TrueCropperEventHandler } from "../types";

export default class Selection {
  /**
   * Callback function to handle events emitted by the selection component.
   */
  private eventBus: TrueCropperEventHandler;
  /**
   * The DOM element representing the selection area.
   */
  private el: HTMLDivElement;
  /**
   * Indicates whether the selection is interactive.
   */
  private enable: boolean;
  /**
   * Reference to the mousedown event listener.
   */
  private listener?: (e: MouseEvent) => void;

  /**
   * Creates a new Selection instance.
   *
   * @param parent - The parent HTMLDivElement to which the selection element is appended.
   * @param className - The CSS class name assigned to the selection element.
   * @param eventBus - A callback to emit events related to selection interactions.
   * @param enable - Determines if the selection element should be interactive.
   */
  public constructor(
    parent: HTMLDivElement,
    className: string,
    eventBus: TrueCropperEventHandler,
    enable: boolean,
  ) {
    this.eventBus = eventBus;
    // Create the selection DOM element.
    this.el = createDiv(className, parent);
    this.enable = enable;
    if (enable) {
      // Attach the mousedown listener if interaction is enabled.
      this.listener = this.mouseEvent();
      this.el.addEventListener("mousedown", this.listener);
    } else {
      this.el.style.cursor = "default";
    }
  }

  /**
   * Transforms the selection element to match the specified crop box dimensions.
   *
   * @param box - An object containing the x, y coordinates and width, height dimensions.
   */
  public transform(box: TrueCropperBoxProps): void {
    this.el.style.transform = `translate(${box.x}px, ${box.y}px)`;
    this.el.style.width = `${box.width}px`;
    this.el.style.height = `${box.height}px`;
  }

  /**
   * Hides the selection element.
   */
  public hide(): void {
    this.el.style.display = "none";
    this.el.style.cursor = "default";
  }

  /**
   * Shows the selection element.
   */
  public show(): void {
    this.el.style.display = "block";
    this.el.style.cursor = "move";
  }

  /**
   * Destroys the selection element by removing it from the DOM and cleaning up event listeners.
   */
  public destroy(): void {
    if (this.listener) {
      this.el.removeEventListener("mousedown", this.listener);
    }
    this.el.remove();
  }

  /**
   * Creates and returns a mousedown event handler for the selection element.
   *
   * This handler attaches mousemove and mouseup listeners to the document to enable
   * dragging of the selection element. It emits corresponding events via the event bus.
   *
   * @returns A mousedown event handler function.
   */
  private mouseEvent(): (e: MouseEvent) => void {
    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      if (!this.enable) {
        return;
      }
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      // Notify that the dragging (region start) has begun.
      const data = { x: e.clientX, y: e.clientY };
      this.eventBus({ type: "regionstart", data });
    };

    const onMouseMove = (e: MouseEvent) => {
      e.stopPropagation();

      // Notify that the selection region is being moved.
      const data = { x: e.clientX, y: e.clientY };
      this.eventBus({ type: "regionmove", data });
    };

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Notify that the dragging (region end) has finished.
      const data = { x: e.clientX, y: e.clientY };
      this.eventBus({ type: "regionend", data });
    };

    return onMouseDown;
  }
}