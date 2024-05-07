export class TrueCropperOptionsError extends Error {
  public data: null;
  public constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, TrueCropperOptionsError.prototype);

    this.name = "TrueCropperOptionsError";
    this.data = null;
  }

  public static aspectRatio(
    name: string,
    calculatedAspectRatio: number,
    aspectRatio: number,
    epsilon: number,
  ) {
    const message = `The specified aspect ratio (${aspectRatio}) and calculated ${name} dimensions (width/height = ${calculatedAspectRatio}) are greater than (${epsilon}). This might be due to a rounding error on the server side or incorrect minimum sizes.`;
    return new this(message);
  }

  public static new(name: string, object: string, positive = true) {
    const message = positive
      ? `${name} must be of type ${object}`
      : `${name} must not be ${object}`;
    return new this(message);
  }
}
