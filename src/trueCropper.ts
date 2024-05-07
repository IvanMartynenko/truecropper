/**
 * Here lies the main logic.
 */

import Box from "./box";
import enableTouch from "./touch";
import Background from "./HTMLelements/background";
import NewSelection from "./HTMLelements/newSelection";
import Selection from "./HTMLelements/selection";
import { calculatePointsBasedOnMouse, getHTMLelements } from "./helpers";
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
} from "./types";
import { parseOptions, prepareOptions } from "./options";
import {
  TrueCropperHtmlError,
  TrueCropperOptionsError,
  TrueCropperImageError,
} from "./errors";
import Handles from "./HTMLelements/handles";
import { CONSTANTS } from "./constant";
import {
  convertToRealPx,
  processingInitialProps,
  validateImageSizes,
} from "./helpers";

/**
 * Core class for TrueCropper containing most of its functional logic.
 */
const defaultSize = { width: 1, height: 1 };
export default class TrueCropper {
  private replaceDOM = false;
  private htmlContainer!: HTMLDivElement;
  private htmlImg!: HTMLImageElement;

  private options!: ReturnType<typeof prepareOptions>;
  private newSelection!: NewSelection;
  private selection!: Selection;
  private handles!: Handles;
  private background!: Background;

  private box!: Box;

  private currentMove!: { offsetX: number; offsetY: number };
  private activeHandle!: {
    x: {
      left: boolean;
      savedCoordinate: number;
    };
    y: {
      left: boolean;
      savedCoordinate: number;
    };
  };

  private real = defaultSize;
  private relative = defaultSize;
  private ratio = defaultSize;
  private firstInit = true;
  private isDomCreated = false;
  public status = Status.waiting;
  public eventBus = this.event.bind(this);
  private observer!: ResizeObserver;

  private callbacks: Icallback = {
    onInitialize: undefined,
    onCropStart: undefined,
    onCropMove: undefined,
    onCropEnd: undefined,
    onError: undefined,
  };

  public constructor(
    element: HTMLImageElement | string,
    optionsProps?: Partial<OptionsPropsValuesType>,
  ) {
    try {
      this.parseCallbackFunctions(optionsProps);
      const [img, container] = getHTMLelements(element);
      this.htmlImg = img;
      if (container) {
        this.htmlContainer = container;
      } else {
        this.replaceDOM = true;
      }
      this.changeStatus(Status.waiting);

      // Parse options
      const rawOptionsData = parseOptions(this.htmlImg.dataset, optionsProps);
      this.options = prepareOptions(rawOptionsData);

      this.initializeCropper();
    } catch (error) {
      if (
        error instanceof TrueCropperHtmlError ||
        error instanceof TrueCropperOptionsError
      ) {
        this.onErrorCallback(error);
      } else {
        throw error;
      }
    }
  }

  public getImagePreview() {
    if (this.status !== "ready") {
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.setAttribute("crossorigin", "anonymous");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const val = this.getValue("real");
    canvas.width = val.width;
    canvas.height = val.height;
    ctx.drawImage(
      this.htmlImg,
      val.x,
      val.y,
      val.width,
      val.height,
      0,
      0,
      val.width,
      val.height,
    );

    return canvas;
  }

  /**
   * Changes the image src.
   * @param {String} src
   */
  public setImage(src: string) {
    if (src && src.length !== 0) {
      this.firstInit = false;
      this.htmlImg.src = src;
    }
  }

  /**
   * Resets the crop region to the initial settings.
   */
  public reset() {
    try {
      this.firstInit = false;
      this.destroy();
      this.initializeCropper();
    } catch (error) {
      if (
        error instanceof TrueCropperHtmlError ||
        error instanceof TrueCropperOptionsError ||
        error instanceof TrueCropperImageError
      ) {
        this.onErrorCallback(error);
      } else {
        throw error;
      }
    }
  }

  /**
   * Destroy the TrueCropper instance and replace with the original element.
   */
  public destroy() {
    if (this.isDomCreated) {
      this.observer.unobserve(this.htmlImg);
      this.newSelection.destroy();
      this.handles.destroy();
      this.selection.destroy();
      this.background.destroy();
      if (this.replaceDOM) {
        if (this.htmlContainer.parentElement) {
          this.htmlContainer.parentElement.replaceChild(
            this.htmlImg,
            this.htmlContainer,
          );
        }
      }
    }
    this.isDomCreated = false;
  }

  /**
   * Moves the crop region to a specified coordinate.
   * @param {Coordinates} coordinates
   */
  public moveTo(coordinates: Coordinates) {
    this.box.move(coordinates);
    this.redraw();

    // Call the callback
    this.onCropEndCallback();
  }

  /**
   * Resizes the crop region to a specified width and height.
   * @param {Size} size
   * @param {Points} points
   */
  public resizeTo(size: Size, points: Points = { x: 0.5, y: 0.5 }) {
    this.box.resize(size, points);
    this.redraw();

    // Call the callback
    this.onCropEndCallback();
  }

  /**
   * Scale the crop region by a factor.
   * @param {Number} factor
   * @param {Points} points
   */
  public scaleBy(factor: number, points: Points = { x: 0.5, y: 0.5 }) {
    this.box.scale(factor, points);
    this.redraw();

    // Call the callback
    this.onCropEndCallback();
  }

  /**
   * Get the value of the crop region.
   * @param {SizeUnit | undefined} mode - The mode of return value type. If null, defaults to the return mode set in returnMode options.
   * @returns {number} - The value of the crop region.
   */
  public getValue(mode: SizeUnit | undefined = undefined) {
    const calculationMode = mode || this.options.returnMode;

    const notRoundedValues = () => {
      if (calculationMode === "relative") {
        return this.box.getValueRelative(this.ratio);
      }
      if (calculationMode === "percent") {
        return this.box.getValuePercent();
      }

      return this.box.getValueReal();
    };

    const values = notRoundedValues();
    return {
      x: Math.round(values.x),
      y: Math.round(values.y),
      width: Math.round(values.width),
      height: Math.round(values.height),
    };
  }

  /**
   * Retrieves the image properties.
   * @returns {real: Size, relative: Size} An object containing the real and relative properties.
   * @public
   */
  public getImageProps() {
    return { real: this.real, relative: this.relative };
  }

  /**
   * Handles the callback when after initialization.
   */
  protected onInitializeCallback() {
    if (this.callbacks.onInitialize) {
      this.callbacks.onInitialize(this, this.getValue());
    }
  }

  /**
   * Handles the callback when cropping starts.
   */
  protected onCropStartCallback() {
    if (this.callbacks.onCropStart) {
      this.callbacks.onCropStart(this, this.getValue());
    }
  }

  /**
   * Handles the callback when cropping is in progress.
   */
  protected onCropMoveCallback() {
    if (this.callbacks.onCropMove) {
      this.callbacks.onCropMove(this, this.getValue());
    }
  }

  /**
   * Handles the callback when cropping ends.
   */
  protected onCropEndCallback() {
    const val = this.getValue();
    // Set dataset properties for cropping dimensions
    this.setDatasetCropValues(val);

    if (this.callbacks.onCropEnd) {
      this.callbacks.onCropEnd(this, val);
    }
  }

  /**
   * Handles errors encountered during operations.
   * @param {TrueCropperHtmlError | TrueCropperImageError | TrueCropperOptionsError} error - The error object containing information about the error.
   */
  protected onErrorCallback(
    error:
      | TrueCropperHtmlError
      | TrueCropperImageError
      | TrueCropperOptionsError,
  ) {
    // Change dataset properties status to error
    this.changeStatus(Status.error);
    const value = {
      type: error.name,
      message: error.message,
      data: error.data,
    };
    // Destroy instance
    this.destroy();
    // If onError callback is provided, invoke it with the error object; otherwise, throw the error
    if (this.callbacks.onError) {
      this.callbacks.onError(this, value);
    } else {
      throw error;
    }
  }

  /** ==============
   *
   *
   *  Private methods
   *
   *
   * ==============
   */

  private initializeObserver() {
    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLImageElement;
        if (target === this.htmlImg && target.complete && target.width !== 0) {
          this.updateRelativeSize();
          this.redraw();
        }
      }
    });
  }

  private initializeCropper() {
    this.initializeObserver();
    // Wait until image is loaded before proceeding
    if (this.htmlImg.width !== 0 && this.htmlImg.height !== 0) {
      this.initialize();
    }

    this.htmlImg.onload = () => {
      this.changeStatus(
        this.status === Status.waiting ? Status.waiting : Status.reloading,
      );
      this.observer.unobserve(this.htmlImg);
      this.initialize();
    };
  }
  private initialize() {
    try {
      this.createDOM();
      this.calcContainerProps();
      this.updateRelativeSize();
      this.createNewBox();
      this.onInitializeCallback();
      this.observer.observe(this.htmlImg);
      this.changeStatus(Status.ready);
      this.onCropEndCallback();
    } catch (error) {
      if (error instanceof TrueCropperImageError) {
        this.onErrorCallback(error);
      } else {
        throw error;
      }
    }
  }

  private createDOM() {
    if (this.isDomCreated) {
      return;
    }

    if (this.replaceDOM) {
      this.htmlContainer = document.createElement("div");
      this.htmlContainer.classList.add(CONSTANTS.base);
      if (this.htmlImg.parentElement) {
        this.htmlImg.parentElement.replaceChild(
          this.htmlContainer,
          this.htmlImg,
        );
      }
      this.htmlContainer.appendChild(this.htmlImg);
    }
    const base = this.htmlContainer;
    enableTouch(base);

    this.htmlImg.classList.add(CONSTANTS.img);
    this.background = new Background(base, CONSTANTS.background);
    this.newSelection = new NewSelection(
      base,
      CONSTANTS.new,
      this.eventBus,
      this.options.allowNewSelection,
    );
    this.selection = new Selection(
      base,
      CONSTANTS.selection,
      this.eventBus,
      this.options.allowMove,
    );
    this.handles = new Handles(
      base,
      CONSTANTS.hanleds,
      this.eventBus,
      this.options.allowResize,
      CONSTANTS.handle,
    );
    this.isDomCreated = true;
  }

  private calcContainerProps() {
    this.real = {
      width: this.htmlImg.naturalWidth,
      height: this.htmlImg.naturalHeight,
    };
  }

  protected createNewBox() {
    let startSizeProps = this.options.startSize;
    if (this.firstInit) {
      this.firstInit = false;
      startSizeProps = this.options.firstInitSize;
    }

    const centered = {
      x: startSizeProps.centeredX,
      y: startSizeProps.centeredX,
    };
    const allowChange = startSizeProps.allowChange;
    const realData = convertToRealPx(
      startSizeProps,
      this.options.minSize,
      this.options.maxSize,
      this.real,
      this.ratio,
    );
    const props = processingInitialProps(
      realData,
      this.real,
      this.options.aspectRatio,
      allowChange,
      centered,
    );

    validateImageSizes(props);

    this.box = new Box(props);
  }

  private updateRelativeSize() {
    const { width, height } = this.htmlImg.getBoundingClientRect();
    if (this.htmlImg.offsetWidth === 0 || this.htmlImg.offsetHeight === 0) {
      this.relative = { width: this.real.width, height: this.real.height };
    } else {
      this.relative = { width, height };
    }

    this.ratio = {
      width: this.relative.width / this.real.width,
      height: this.relative.height / this.real.height,
    };
  }

  private changeStatus(status: Status) {
    this.status = status;
    if (this.htmlImg) {
      this.setDataset(CONSTANTS.valueStatus, status);
    }
  }

  /**
   * Draw visuals (border, handles, etc) for the current box.
   */
  private redraw() {
    const box = this.box.getValueRelative(this.ratio);

    this.selection.transform(box);
    this.background.transform(box);
    this.handles.transform(box);
  }

  private event({ type, data }: TrueCropperCoreCallbackEvent) {
    switch (type) {
      case "handlestart":
        this.onHandleMoveStart(data);
        break;
      case "handlemove":
        this.onHandleMoveMoving(data);
        break;
      case "handleend":
        this.onHandleMoveEnd();
        break;
      case "regionstart":
        this.onRegionMoveStart(data);
        break;
      case "regionmove":
        this.onRegionMoveMoving(data);
        break;
      case "regionend":
        this.onRegionMoveEnd();
        break;
      case "createnewbox":
        return this.tryToCreateNewBox(data);
    }
    return true;
  }

  private tryToCreateNewBox({
    coordinates,
    size,
    leftMovable,
    topMovable,
  }: TrueCropperCoreCreateNewBoxEvent["data"]) {
    // Get handle data based on movable types
    const handleData = this.handles
      .handleByMovableType(leftMovable, topMovable)
      .getData();

    // Calculate new mouse coordinates
    const boxCoordinates = this.mouseCoordinates(coordinates);

    // Define movement coordinates for x and y axes
    const newBox = {
      coordinates: boxCoordinates,
      size,
      points: handleData.points,
    };

    // Move the box using the calculated movement, and if unsuccessful, return false
    if (!this.box.prepareAndApplyNewSizeAndCoordinates(newBox)) {
      return false;
    }

    // Redraw the box
    this.redraw();

    // Trigger handle move start event
    this.onHandleMoveStart(handleData);

    // Return true to indicate successful box creation
    return true;
  }

  /**
   * Executes when user begins dragging a handle.
   */
  private onHandleMoveStart(data: TrueCropperCoreHandleStartEvent["data"]) {
    const { x, y } = this.box.getOppositeCornerCoordinates(data.points);
    this.activeHandle = {
      x: {
        left: data.points.x === 0,
        savedCoordinate: x,
      },
      y: {
        left: data.points.y === 0,
        savedCoordinate: y,
      },
    };

    // Trigger callback
    this.onCropStartCallback();
  }

  /**
   * Executes on handle move. Main logic to manage the movement of handles.
   */
  private onHandleMoveMoving(absMouse: TrueCropperCoreHandleMoveEvent["data"]) {
    // Calculate mouse's position in relative to the container
    const coordinates = this.mouseCoordinates(absMouse);

    // получаем левый угол и длину
    // point == 1 значит мы меняем левый угол
    // point == 0 значит мы меняем правый угол
    // point == 0.5 значит мы меняем и левый и правый угол (относительно центра).
    // в этом случае значение x == null (берем из текещего box)
    const newBox = calculatePointsBasedOnMouse(
      coordinates,
      this.activeHandle.x,
      this.activeHandle.y,
    );
    // const aY = calculatePointBasedOnMouse(mouseY, this.activeHandle.y);

    // Disable flipped crop
    if (!this.options.allowFlip && (newBox.flipped.x || newBox.flipped.y)) {
      return;
    }

    if (this.box.prepareAndApplyNewSizeAndCoordinates(newBox.newBox)) {
      this.redraw();
    }

    // Trigger callback
    this.onCropMoveCallback();
  }
  /**
   *  Executes when the handle move ends.
   */
  private onHandleMoveEnd() {
    this.onCropEndCallback();
  }

  /**
   * Executes when user starts moving the crop region.
   * @param {TrueCropperCoreRegionMoveEvent["data"]} data - contains the raw mouseX, mouseY coordinate
   */
  private onRegionMoveStart(absMouse: TrueCropperCoreRegionMoveEvent["data"]) {
    const { x, y } = this.mouseCoordinates(absMouse);
    const box = this.box.getCoourdinates();

    this.currentMove = { offsetX: x - box.x, offsetY: y - box.y };

    // Trigger callback
    this.onCropStartCallback();
  }

  /**
   * Executes when user moves the crop region.
   */
  private onRegionMoveMoving(absMouse: TrueCropperCoreRegionMoveEvent["data"]) {
    const { offsetX, offsetY } = this.currentMove;

    // Calculate mouse's position in relative to the container
    const { x, y } = this.mouseCoordinates(absMouse);
    this.box.move({ x: x - offsetX, y: y - offsetY });

    // Update visuals
    this.redraw();

    // Trigger callback
    this.onCropMoveCallback();
  }

  /**
   * Executes when user stops moving the crop region (mouse up).
   */
  private onRegionMoveEnd() {
    this.onCropEndCallback();
  }

  /**
   * Get the real(natural) mouse coordinates within the image container.
   * @param {number} absMouseX - The absolute X coordinate of the mouse.
   * @param {number} absMouseY - The absolute Y coordinate of the mouse.
   * @returns {[number, number]} - The real(natural) X and Y coordinates within the image container.
   */
  private mouseCoordinates(absMouse: { x: number; y: number }) {
    const container = this.htmlImg.getBoundingClientRect();
    let x = absMouse.x - container.left;
    let y = absMouse.y - container.top;
    x = Math.min(Math.max(x, 0), this.relative.width) / this.ratio.width;
    y = Math.min(Math.max(y, 0), this.relative.height) / this.ratio.height;
    return { x, y };
  }

  /**
   * Sets a value to a dataset attribute of an HTML image element.
   * @param {string} name - The name of the dataset attribute.
   * @param {string | number} value - The value to set for the dataset attribute.
   */
  private setDataset(name: string, value: string | number) {
    this.htmlImg.dataset[name] = value.toString();
  }

  // to helpers
  private parseCallbackFunctions(
    optionsProps?: Partial<OptionsPropsValuesType>,
  ) {
    if (!optionsProps) {
      return;
    }
    if (optionsProps.onError && typeof optionsProps.onError === "function") {
      this.callbacks.onError = optionsProps.onError;
    }
    if (
      optionsProps.onInitialize &&
      typeof optionsProps.onInitialize === "function"
    ) {
      this.callbacks.onInitialize = optionsProps.onInitialize;
    }
    if (
      optionsProps.onCropStart &&
      typeof optionsProps.onCropStart === "function"
    ) {
      this.callbacks.onCropStart = optionsProps.onCropStart;
    }
    if (
      optionsProps.onCropMove &&
      typeof optionsProps.onCropMove === "function"
    ) {
      this.callbacks.onCropMove = optionsProps.onCropMove;
    }
    if (
      optionsProps.onCropEnd &&
      typeof optionsProps.onCropEnd === "function"
    ) {
      this.callbacks.onCropEnd = optionsProps.onCropEnd;
    }
  }

  private setDatasetCropValues(value?: BoxProps) {
    const val = value || this.getValue();
    this.setDataset(CONSTANTS.valueX, val.x);
    this.setDataset(CONSTANTS.valueY, val.y);
    this.setDataset(CONSTANTS.valueWidth, val.width);
    this.setDataset(CONSTANTS.valueHeight, val.height);
  }
}
