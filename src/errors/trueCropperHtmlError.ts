import { TrueCropperErrorData } from "types";

/**
 * Predefined error messages for HTML errors in TrueCropper.
 */
const errorMessage = {
  /**
   * Error when the target element is not found.
   */
  elementNotFound: { text: "Unable to find element", id: 0 },

  /**
   * Error when the image source is not provided.
   */
  srcEmpty: { text: "Image src not provided", id: 1 },

  /**
   * Error when the parent element does not contain the required <div> element.
   */
  parentNotContainDiv: { text: "Parent element can be exists", id: 2 },
};

/**
 * Represents an HTML error specific to TrueCropper.
 *
 * @extends Error
 */
export class TrueCropperHtmlError extends Error {
  /**
   * Additional error data.
   */
  public data: TrueCropperErrorData;
  /**
   * The unique identifier for the error message.
   */
  public messageId: number;

  /**
   * Creates an instance of TrueCropperHtmlError.
   *
   * @param key - The key corresponding to a predefined error message.
   */
  public constructor(key: keyof typeof errorMessage) {
    const message = errorMessage[key];
    super(message.text);

    // Restore prototype chain for custom error subclass.
    Object.setPrototypeOf(this, TrueCropperHtmlError.prototype);

    this.name = "TrueCropperHtmlError";
    this.data = {};
    this.messageId = message.id;
  }
}