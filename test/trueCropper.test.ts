import Box from "../src/box";
import enableTouch from "../src/touch";
import Background from "../src/HTMLelements/background";
import NewSelection from "../src/HTMLelements/newSelection";
import Selection from "../src/HTMLelements/selection";
import { calculatePointsBasedOnMouse, getHTMLelements } from "../src/helpers";
import {
  BoxProps,
  Coordinates,
  TrueCropperCoreCallbackEvent,
  TrueCropperCoreCreateNewBoxEvent,
  TrueCropperCoreHandleMoveEvent,
  TrueCropperCoreHandleStartEvent,
  TrueCropperCoreRegionMoveEvent,
  Icallback,
  OptionsPropsValuesType,
  Points,
  Size,
  SizeUnit,
  Status,
} from "../src/types";
import { parseOptions, prepareOptions } from "../src/options";
import {
  TrueCropperHtmlError,
  TrueCropperOptionsError,
  TrueCropperImageError,
} from "../src/errors";
import Handles from "../src/HTMLelements/handles";
import { CONSTANTS } from "../src/constant";
import {
  convertToRealPx,
  processingInitialProps,
  validateImageSizes,
} from "../src/helpers";
import TrueCropper from "../src/trueCropper";
import { JSDOM } from "jsdom";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("TrueCropper", () => {
  let mockImageElement: HTMLImageElement;
  let mockDivElement: HTMLDivElement;
  // let instance: TrueCropper;
  const mockOptions = {};

  beforeEach(() => {
    window.ResizeObserver = ResizeObserver;
    mockImageElement = new Image();
    mockImageElement.id = "truecropperImage";
    // Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', { get: () => 120 });
    Object.defineProperty(mockImageElement, "naturalWidth", {
      value: 512,
    });
    Object.defineProperty(mockImageElement, "width", {
      value: 512,
    });
    Object.defineProperty(mockImageElement, "naturalHeight", {
      value: 512,
    });
    Object.defineProperty(mockImageElement, "height", {
      value: 512,
    });
    mockDivElement = document.createElement("div") as HTMLDivElement;
    mockDivElement.classList.add("truecropper"); // Update with your base class
    mockDivElement.appendChild(mockImageElement);
    document.body.appendChild(mockDivElement);
    // instance = new TrueCropper(mockImageElement);
  });

  // afterEach(() => {
  //   document.body.removeChild(mockDivElement);
  // });

  describe("Constructor", () => {
    it("should initialize without throwing", () => {
      expect(() => new TrueCropper(mockImageElement)).not.toThrow();
    });

    it("should handle invalid element input", () => {
      const init = () => new TrueCropper("#nonexistent", mockOptions);
      expect(init).toThrow();
    });

    it("should handle invalid options", () => {
      const init = () => new TrueCropper(mockImageElement, { aspectRatio: 0 });
      expect(init).toThrow();
    });
  });

  describe("reset", () => {
    let croppr: TrueCropper;

    beforeEach(() => {
      croppr = new TrueCropper(mockImageElement);
    });

    it("should reset properly under normal conditions", () => {
      expect(() => croppr.reset()).not.toThrow();
    });

    it("should call the destroy method during reset", () => {
      const destroyMock = jest.fn();
      croppr.destroy = destroyMock;
      croppr.reset();
      expect(destroyMock).toHaveBeenCalled();
    });
  });

  describe("setImage", () => {
    let croppr: TrueCropper;

    beforeEach(() => {
      croppr = new TrueCropper(mockImageElement);
    });

    it("should setImage src is equal to image src", () => {
      const src = "http://localhost/mockImageElement.png";
      croppr.setImage(src);
      expect(mockImageElement.src).toBe(src);
    });
  });

  describe("moveTo", () => {
    let croppr: TrueCropper;

    beforeEach(() => {
      croppr = new TrueCropper(mockImageElement);
    });

    it("should moveTo", () => {
      croppr.resizeTo({ width: 100, height: 100 });
      croppr.moveTo({ x: 10, y: 10 });
      const data = croppr.getValue();
      expect(data).toEqual({
        x: 10,
        y: 10,
        width: 100,
        height: 100,
      });
    });
  });

  describe("resizeTo", () => {
    let croppr: TrueCropper;

    beforeEach(() => {
      croppr = new TrueCropper(mockImageElement);
    });

    it("should resizeTo", () => {
      croppr.resizeTo({ width: 100, height: 100 }, { x: 0, y: 0 });
      const data = croppr.getValue();
      expect(data).toEqual({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });
    });
  });

  describe("scaleBy", () => {
    let croppr: TrueCropper;

    beforeEach(() => {
      croppr = new TrueCropper(mockImageElement);
    });

    it("should scaleBy", () => {
      croppr.scaleBy(0.5, { x: 0, y: 0 });
      const data = croppr.getValue();
      expect(data).toEqual({
        x: 0,
        y: 0,
        width: 256,
        height: 256,
      });
    });
  });

  describe("getValue", () => {
    let croppr: TrueCropper;

    beforeEach(() => {
      croppr = new TrueCropper(mockImageElement);
    });

    it("should getValue", () => {
      croppr.setValue({ x: 10, y: 10, width: 50, height: 50 });
      const data = croppr.getValue();
      expect(data).toEqual({
        x: 10,
        y: 10,
        width: 50,
        height: 50,
      });
    });
  });

  describe("getImageProps", () => {
    let croppr: TrueCropper;

    beforeEach(() => {
      croppr = new TrueCropper(mockImageElement);
    });

    it("should getImageProps", () => {
      const data = croppr.getImageProps();
      expect(data).toEqual({
        real: {
          width: 512,
          height: 512,
        },
        relative: {
          width: 512,
          height: 512,
        },
      });
    });
  });

  describe("getStatus", () => {
    let croppr: TrueCropper;

    beforeEach(() => {
      croppr = new TrueCropper(mockImageElement);
    });

    it("should getStatus", () => {
      const data = croppr.getStatus();
      expect(data).toBe("ready");
    });
  });

  // it("should have a method getImagePreview()", () => {
  //   // instance.getImagePreview();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method setImage()", () => {
  //   // instance.setImage(src);
  //   expect(false).toBeTruthy();
  // });

  // // it("should have a method reset()", () => {
  // //   // instance.reset();
  // //   expect(false).toBeTruthy();
  // // });

  // it("should have a method destroy()", () => {
  //   // instance.destroy();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method moveTo()", () => {
  //   // instance.moveTo(coordinates);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method resizeTo()", () => {
  //   // instance.resizeTo(size,points);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method scaleBy()", () => {
  //   // instance.scaleBy(factor,points);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onInitializeCallback()", () => {
  //   // instance.onInitializeCallback();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onCropStartCallback()", () => {
  //   // instance.onCropStartCallback();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onCropMoveCallback()", () => {
  //   // instance.onCropMoveCallback();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onCropEndCallback()", () => {
  //   // instance.onCropEndCallback();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onErrorCallback()", () => {
  //   // instance.onErrorCallback(error);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method getValue()", () => {
  //   // instance.getValue(mode);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method initializeObserver()", () => {
  //   // instance.initializeObserver();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method initializeCropper()", () => {
  //   // instance.initializeCropper();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method initialize()", () => {
  //   // instance.initialize();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method createDOM()", () => {
  //   // instance.createDOM();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method calcContainerProps()", () => {
  //   // instance.calcContainerProps();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method createNewBox()", () => {
  //   // instance.createNewBox();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method updateRelativeSize()", () => {
  //   // instance.updateRelativeSize();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method changeStatus()", () => {
  //   // instance.changeStatus(status);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method redraw()", () => {
  //   // instance.redraw();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method event()", () => {
  //   // instance.event();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method tryToCreateNewBox()", () => {
  //   // instance.tryToCreateNewBox();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onHandleMoveStart()", () => {
  //   // instance.onHandleMoveStart(data);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onHandleMoveMoving()", () => {
  //   // instance.onHandleMoveMoving(absMouse);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onHandleMoveEnd()", () => {
  //   // instance.onHandleMoveEnd();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onRegionMoveStart()", () => {
  //   // instance.onRegionMoveStart(absMouse);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onRegionMoveMoving()", () => {
  //   // instance.onRegionMoveMoving(absMouse);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method onRegionMoveEnd()", () => {
  //   // instance.onRegionMoveEnd();
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method mouseCoordinates()", () => {
  //   // instance.mouseCoordinates(absMouse);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method setDataset()", () => {
  //   // instance.setDataset(name,value);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method parseCallbackFunctions()", () => {
  //   // instance.parseCallbackFunctions(optionsProps);
  //   expect(false).toBeTruthy();
  // });

  // it("should have a method setDatasetCropValues()", () => {
  //   // instance.setDatasetCropValues(value);
  //   expect(false).toBeTruthy();
  // });
});
