/**
 * NewSelection component
 *
 * This component allows the user to create a new crop box by clicking and dragging
 * within the designated area. It listens for mouse events and notifies the parent
 * via an event bus.
 */

import { createDiv } from "../helpers";
import { TrueCropperEventHandler } from "../types";

export default class NewSelection {
  /**
   * Callback function to communicate events to the parent.
   */
  private eventBus: TrueCropperEventHandler;
  /**
   * The container element for the new selection.
   */
  private el: HTMLDivElement;
  /**
   * The starting mouse coordinates when a new selection is initiated.
   */
  private startMouse = { mouseX: 0, mouseY: 0 };
  /**
   * Flag indicating whether a new crop box has been created.
   */
  private newBoxCreated: boolean = false;
  /**
   * Reference to the mousedown event listener.
   */
  private listener?: (e: MouseEvent) => void;

  /**
   * Creates a new NewSelection instance.
   *
   * @param parent - The parent HTMLDivElement where the new selection element is appended.
   * @param className - The CSS class name for styling the new selection element.
   * @param eventBus - A callback function for communicating events (e.g., creating a new box).
   * @param enable - Determines whether the new selection functionality is enabled.
   */
  public constructor(
    parent: HTMLDivElement,
    className: string,
    eventBus: TrueCropperEventHandler,
    enable: boolean,
  ) {
    this.eventBus = eventBus;
    this.el = createDiv(className, parent);
    if (enable) {
      // Attach initial mousedown listener to initiate new selection.
      this.listener = this.mouseEvent();
      this.el.addEventListener("mousedown", this.listener);
    } else {
      this.hide();
    }
  }

  /**
   * Hides the new selection element.
   */
  public hide(): void {
    this.el.style.display = "none";
  }

  /**
   * Shows the new selection element.
   */
  public show(): void {
    this.el.style.display = "block";
  }

  /**
   * Removes the new selection element from the DOM and cleans up event listeners.
   */
  public destroy(): void {
    if (this.listener) {
      this.el.removeEventListener("mousedown", this.listener);
    }
    this.el.remove();
  }

  /**
   * Creates and returns a mousedown event handler that initiates the new selection process.
   *
   * When the user presses the mouse button down, mousemove and mouseup listeners are attached
   * to track the selection process.
   *
   * @returns A mousedown event handler function.
   */
  private mouseEvent(): (e: MouseEvent) => void {
    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      // Attach mousemove and mouseup listeners to the document.
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      // Save the starting mouse coordinates.
      this.startMouse = { mouseX: e.clientX, mouseY: e.clientY };
      this.newBoxCreated = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      if (this.newBoxCreated) {
        // Notify parent that the selection is being adjusted.
        const data = { x: e.clientX, y: e.clientY };
        this.eventBus({ type: "handlemove", data });
      } else {
        // Attempt to create a new crop box if the mouse has moved.
        this.tryToCreateNewBox(e.clientX, e.clientY);
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      // Remove the document-level mouse event listeners.
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // If a new box was created, notify parent that the selection process has ended.
      if (this.newBoxCreated) {
        this.eventBus({ type: "handleend" });
      }
    };

    return onMouseDown;
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
  private tryToCreateNewBox(mouseX: number, mouseY: number): void {
    // Do nothing if the mouse hasn't moved.
    if (mouseX === this.startMouse.mouseX || mouseY === this.startMouse.mouseY) {
      return;
    }

    // Determine if the new box is drawn from the left/top or right/bottom.
    const leftMovable = mouseX < this.startMouse.mouseX;
    const topMovable = mouseY < this.startMouse.mouseY;

    // Calculate the top-left coordinates and dimensions of the new crop box.
    const [x, width] = leftMovable
      ? [mouseX, this.startMouse.mouseX - mouseX]
      : [this.startMouse.mouseX, mouseX - this.startMouse.mouseX];
    const [y, height] = topMovable
      ? [mouseY, this.startMouse.mouseY - mouseY]
      : [this.startMouse.mouseY, mouseY - this.startMouse.mouseY];

    // Prepare data for the new crop box.
    const data = {
      coordinates: { x, y },
      size: { width, height },
      leftMovable,
      topMovable,
    };

    // Notify parent to create a new crop box and record the result.
    this.newBoxCreated = this.eventBus({ type: "createnewbox", data });
  }
}