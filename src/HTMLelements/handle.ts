/**
 * Handle component for cropping operations.
 *
 * This class represents an interactive handle used to adjust the crop boundaries.
 */
import { createDiv } from "../helpers";
import { TrueCropperBoxProps, TrueCropperEventHandler } from "../types";
import { HandlesType } from "./handles";

export default class Handle {
  /**
   * The normalized position of the handle (values between 0 and 1).
   */
  public position: { x: number; y: number };

  /**
   * Event bus function used to emit handle events.
   */
  private eventBus: TrueCropperEventHandler;

  /**
   * The HTML element representing the handle.
   */
  public el!: HTMLDivElement;

  /**
   * Flag indicating whether the handle is enabled.
   */
  private enable: boolean;

  /**
   * The event listener function for handling mouse events.
   */
  private listener?: (e: MouseEvent) => void;

  /**
   * Creates an instance of the Handle.
   *
   * @param parent - The parent HTMLDivElement to which the handle element is appended.
   * @param className - The CSS class name to assign to the handle element.
   * @param item - The handle configuration object, including its position and cursor style.
   * @param eventBus - A callback function to handle events emitted by the handle.
   * @param enable - Determines whether the handle is enabled.
   */
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
      // Attach initial mouse down listener.
      this.listener = this.mouseEvent();
      this.el.addEventListener("mousedown", this.listener);
    } else {
      this.hide();
    }
  }

  /**
   * Displays the handle element.
   */
  public show(): void {
    this.el.style.display = "block";
  }

  /**
   * Hides the handle element.
   */
  public hide(): void {
    this.el.style.display = "none";
  }

  /**
   * Destroys the handle by removing event listeners and detaching it from the DOM.
   */
  public destroy(): void {
    if (this.listener) {
      this.el.removeEventListener("mousedown", this.listener);
    }
    this.el.remove();
  }

  /**
   * Transforms the handle's position based on the provided crop box properties.
   *
   * @param box - The crop box properties (x, y, width, height).
   */
  public transform(box: TrueCropperBoxProps): void {
    const handleWidth = this.el.offsetWidth;
    const handleHeight = this.el.offsetHeight;
    const left = box.x + box.width * this.position.x - handleWidth / 2;
    const top = box.y + box.height * this.position.y - handleHeight / 2;

    this.el.style.transform = `translate(${left}px, ${top}px)`;
  }

  /**
   * Retrieves data associated with the handle.
   *
   * @returns An object containing the handle's normalized position.
   */
  public getData() {
    return {
      points: { ...this.position },
    };
  }

  /**
   * Creates and returns a mouse event handler for the handle.
   *
   * This function attaches mousemove and mouseup listeners to the document when a mousedown event is detected.
   *
   * @returns The mousedown event handler function.
   */
  private mouseEvent() {
    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      if (!this.enable) {
        return;
      }
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      // Notify parent that handle interaction has started.
      const data = this.getData();
      this.eventBus({ type: "handlestart", data });
    };

    const onMouseMove = (e: MouseEvent) => {
      e.stopPropagation();

      // Notify parent of handle movement.
      const data = { x: e.clientX, y: e.clientY };
      this.eventBus({ type: "handlemove", data });
    };

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Notify parent that handle interaction has ended.
      this.eventBus({ type: "handleend" });
    };

    return onMouseDown;
  }
}