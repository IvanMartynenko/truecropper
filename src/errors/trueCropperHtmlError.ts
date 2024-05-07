const errorMessage = {
  srcEmpty: "Image src not provided",
  elementNotFound: "Unable to find element",
  parentNotContainDiv: "Parent element can be exists",
};

export class TrueCropperHtmlError extends Error {
  public data: null;
  public constructor(key: keyof typeof errorMessage) {
    const message = errorMessage[key];
    super(message);

    Object.setPrototypeOf(this, TrueCropperHtmlError.prototype);

    this.name = "TrueCropperHtmlError";
    this.data = null;
  }
}
