import { TrueCropperErrorData } from "types";

/**
 * Represents an error related to invalid options in TrueCropper.
 *
 * @extends Error
 */
export class TrueCropperOptionsError extends Error {
  /**
   * Additional data associated with the options error.
   */
  public data: TrueCropperErrorData;
  /**
   * A unique identifier for the error message.
   */
  public messageId: number;

  /**
   * Creates an instance of TrueCropperOptionsError.
   *
   * @param message - The error message.
   * @param data - Additional error data.
   * @param messageId - A unique identifier for the error message.
   */
  public constructor(
    message: string,
    data: TrueCropperErrorData,
    messageId: number = 0,
  ) {
    super(message);

    // Restore prototype chain for custom error subclass.
    Object.setPrototypeOf(this, TrueCropperOptionsError.prototype);

    this.name = "TrueCropperOptionsError";
    this.data = data;
    this.messageId = messageId;
  }

  /**
   * Factory method for creating an options error related to aspect ratio mismatch.
   *
   * @param name - The name of the property or dimension with the aspect ratio issue.
   * @param calculatedAspectRatio - The calculated aspect ratio based on dimensions.
   * @param aspectRatio - The expected aspect ratio.
   * @param epsilon - The tolerance value for aspect ratio differences.
   * @returns A new instance of TrueCropperOptionsError with aspect ratio error details.
   */
  public static aspectRatio(
    name: string,
    calculatedAspectRatio: number,
    aspectRatio: number,
    epsilon: number,
  ): TrueCropperOptionsError {
    const message = `The specified aspect ratio (${aspectRatio}) and calculated ${name} dimensions (width/height = ${calculatedAspectRatio}) are greater than (${epsilon}). This might be due to a rounding error on the server side or incorrect minimum sizes.`;
    return new this(message, { name }, 5);
  }

  public static widthIsNull(name: string): TrueCropperOptionsError {
    const message = `The width of (${name}) is null`;
    return new this(message, { name }, 8);
  }

  public static heightIsNull(name: string): TrueCropperOptionsError {
    const message = `The height of (${name}) is null`;
    return new this(message, { name }, 9);
  }

  public static badSizeOfPercent(name: string): TrueCropperOptionsError {
    const message = `The percent values of (${name}) > 100`;
    return new this(message, { name }, 10);
  }

  /**
   * Factory method for creating a generic options error.
   *
   * @param name - The name of the option.
   * @param object - The expected or disallowed object description.
   * @param positive - If true, indicates the option must be the specified object; if false, indicates it must not be.
   * @returns A new instance of TrueCropperOptionsError with generic error details.
   */
  public static new(name: string, object: string, positive = true): TrueCropperOptionsError {
    const messageId = positive ? 3 : 4;
    const message = positive
      ? `${name} must be ${object}`
      : `${name} must not be ${object}`;
    return new this(message, { name, object }, messageId);
  }
}
