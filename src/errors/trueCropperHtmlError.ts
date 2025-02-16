import { TrueCropperErrorData } from "types";

const errorMessage = {
  elementNotFound: { text: "Unable to find element", id: 0 },
  srcEmpty: { text: "Image src not provided", id: 1 },
  parentNotContainDiv: { text: "Parent element can be exists", id: 2 },
};

export class TrueCropperHtmlError extends Error {
  public data: TrueCropperErrorData;
  public messageId: number;
  public constructor(key: keyof typeof errorMessage) {
    const message = errorMessage[key];
    super(message.text);

    Object.setPrototypeOf(this, TrueCropperHtmlError.prototype);

    this.name = "TrueCropperHtmlError";
    this.data = {};
    this.messageId = message.id;
  }
}
