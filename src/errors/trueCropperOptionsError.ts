import { TrueCropperErrorData } from "types";

export class TrueCropperOptionsError extends Error {
  public data: TrueCropperErrorData;
  public messageId: number;
  public constructor(
    message: string,
    data: TrueCropperErrorData,
    messageId: number = 0,
  ) {
    super(message);

    Object.setPrototypeOf(this, TrueCropperOptionsError.prototype);

    this.name = "TrueCropperOptionsError";
    this.data = data;
    this.messageId = messageId;
  }

  public static aspectRatio(
    name: string,
    calculatedAspectRatio: number,
    aspectRatio: number,
    epsilon: number,
  ) {
    const message = `The specified aspect ratio (${aspectRatio}) and calculated ${name} dimensions (width/height = ${calculatedAspectRatio}) are greater than (${epsilon}). This might be due to a rounding error on the server side or incorrect minimum sizes.`;
    return new this(message, { name }, 5);
  }

  public static new(name: string, object: string, positive = true) {
    const messageId = positive ? 3 : 4;
    const message = positive
      ? `${name} must be ${object}`
      : `${name} must not be ${object}`;
    return new this(message, { name, object }, messageId);
  }
}
