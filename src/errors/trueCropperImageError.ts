import { TrueCropperErrorData, TrueCropperImageErrorData } from "../types";

/**
 * Represents an error related to image processing in TrueCropper.
 *
 * @extends Error
 */
export class TrueCropperImageError extends Error {
  /**
   * Additional data related to the image error.
   */
  public data: TrueCropperErrorData;
  /**
   * A unique identifier for the error message.
   */
  public messageId: number;

  /**
   * Creates an instance of TrueCropperImageError.
   *
   * @param message - The error message.
   * @param data - Additional data associated with the image error.
   * @param messageId - A unique identifier for the error message.
   */
  public constructor(
    message: string,
    data: TrueCropperImageErrorData,
    messageId: number,
  ) {
    super(message);

    // Restore prototype chain for custom error subclass.
    Object.setPrototypeOf(this, TrueCropperImageError.prototype);

    this.name = "TrueCropperImageError";
    this.data = {
      target: data.target,
      targetCoordinates: data.coordinates ? { ...data.coordinates } : undefined,
      targetSize: { ...data.targetSize },
      source: data.source,
      sourceSize: { ...data.sourceSize },
    };
    this.messageId = messageId;
  }

  /**
   * Creates a new TrueCropperImageError instance for a start size issue.
   *
   * @param target - The target element identifier.
   * @param coordinates - The coordinates related to the error.
   * @param targetSize - The dimensions of the target element.
   * @param source - The source element identifier.
   * @param sourceSize - The dimensions of the source element.
   * @returns A new instance of TrueCropperImageError.
   */
  public static startSize(
    target: string,
    coordinates: { x: number; y: number },
    targetSize: { width: number; height: number },
    source: string,
    sourceSize: { width: number; height: number },
  ): TrueCropperImageError {
    const message = `The ${target} (${coordinates.x}x${coordinates.y}:${targetSize.width}x${targetSize.height}) exceeds the ${source} (${sourceSize.width}x${sourceSize.height})`;
    const data = {
      target,
      coordinates,
      targetSize,
      source,
      sourceSize,
    };
    return new this(message, data, 6);
  }

  /**
   * Creates a new TrueCropperImageError instance for a size issue.
   *
   * @param target - The target element identifier.
   * @param targetSize - The dimensions of the target element.
   * @param source - The source element identifier.
   * @param sourceSize - The dimensions of the source element.
   * @returns A new instance of TrueCropperImageError.
   */
  public static size(
    target: string,
    targetSize: { width: number; height: number },
    source: string,
    sourceSize: { width: number; height: number },
  ): TrueCropperImageError {
    const message = `The ${target} (${targetSize.width}x${targetSize.height}) exceeds the ${source} (${sourceSize.width}x${sourceSize.height})`;
    const data = {
      target,
      coordinates: undefined,
      targetSize,
      source,
      sourceSize,
    };
    return new this(message, data, 7);
  }
}