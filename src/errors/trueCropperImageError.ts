import { IimageErrorData } from "../types";

export class TrueCropperImageError extends Error {
  public data;
  public constructor(message: string, data: IimageErrorData) {
    super(message);

    Object.setPrototypeOf(this, TrueCropperImageError.prototype);

    this.name = "TrueCropperImageError";
    this.data = {
      target: data.target,
      coordinates: data.coordinates ? { ...data.coordinates } : undefined,
      targetSize: { ...data.targetSize },
      source: data.source,
      sourceSize: { ...data.sourceSize },
    };
  }

  public static startSize(
    target: string,
    coordinates: { x: number; y: number },
    targetSize: { width: number; height: number },
    source: string,
    sourceSize: { width: number; height: number },
  ) {
    const message = `The ${target} (${coordinates.x}x${coordinates.y}:${targetSize.width}x${targetSize.height}) exceeds the ${source} (${sourceSize.width}x${sourceSize.height})`;
    const data = {
      target,
      coordinates,
      targetSize,
      source,
      sourceSize,
    };
    return new this(message, data);
  }

  public static size(
    target: string,
    targetSize: { width: number; height: number },
    source: string,
    sourceSize: { width: number; height: number },
  ) {
    const message = `The ${target} (${targetSize.width}x${targetSize.height}) exceeds the ${source} (${sourceSize.width}x${sourceSize.height})`;
    const data = {
      target,
      coordinates: undefined,
      targetSize,
      source,
      sourceSize,
    };
    return new this(message, data);
  }
}
