import {
  TrueCropperBoxInitConfig,
  TrueCropperBoxProps,
  TrueCropperCoordinates,
  TrueCropperNullableBoxData,
  TrueCropperDragData,
  TrueCropperPoints,
  TrueCropperSize,
} from "./types";
import { adjustToAspectRatio, containerToMaxMinSize } from "./helpers";

/**
 * Box component
 */
export default class Box {
  private coordinates: TrueCropperCoordinates;
  private size: TrueCropperSize;
  private minSize: TrueCropperSize;
  private maxSize: TrueCropperSize;
  private imgSize: TrueCropperSize;
  private aspectRatio: number;
  private epsilon: number;

  /**
   * Creates a new Box instance.
   * @constructor
   * @param {TrueCropperBoxInitConfig} - Initialization parameters.
   */
  public constructor({
    coordinates,
    size,
    minSize,
    maxSize,
    imgProps,
    aspectRatio,
    epsilon,
  }: TrueCropperBoxInitConfig) {
    this.coordinates = { ...coordinates };
    this.size = { ...size };
    this.minSize = { ...minSize };
    this.maxSize = { ...maxSize };
    this.imgSize = { ...imgProps };
    this.aspectRatio = aspectRatio;
    this.epsilon = epsilon;
  }

  /**
   * Sets the value of coordinates and size properties based on the provided BoxProps object.
   * @param {TrueCropperBoxProps} box - The BoxProps object containing x, y, width, and height properties.
   * @returns {void}
   */
  public setValue(box: TrueCropperBoxProps) {
    if (box.width < this.minSize.width || box.height < this.minSize.height) {
      return { ok: false, message: '' };
    }
    if (box.width > this.maxSize.width || box.height > this.maxSize.height) {
      return { ok: false, message: '' };
    }
    if (this.aspectRatio && box.width / box.height - this.aspectRatio > this.epsilon) {
      return { ok: false, message: '' };
    }
    if (box.x < 0 || box.x > this.imgSize.width || box.y < 0 || box.y > this.imgSize.height) {
      return { ok: false, message: '' };
    }
    if (box.x + box.width > this.imgSize.width || box.y + box.height > this.imgSize.height) {
      return { ok: false, message: '' };
    }

    this.coordinates = { x: box.x, y: box.y };
    this.size = { width: box.width, height: box.height };
    return { ok: true, message: '' };
  }

  /**
   * Moves the box to the specified coordinates within the boundaries of the image.
   * @param {TrueCropperCoordinates} coordinates - The new x and y coordinates for the box.
   * @returns {void}
   */
  public move(coordinates: TrueCropperCoordinates) {
    // Ensure box is within the boundaries
    this.coordinates.x = Math.min(
      Math.max(coordinates.x, 0),
      this.imgSize.width - this.size.width,
    );
    this.coordinates.y = Math.min(
      Math.max(coordinates.y, 0),
      this.imgSize.height - this.size.height,
    );
  }

  /**
   * Resizes the box to a new size.
   * @param {TrueCropperSize} size - The new size for the box.
   * @param {TrueCropperPoints} points - The relative points for resizing.
   * @returns {void}
   */
  public resize(size: TrueCropperSize, points: TrueCropperPoints) {
    if (points.x < 0 || points.x > 1 || points.y < 0 || points.y > 1) {
      return { ok: false, message: '' };
    }
    const fromX = this.coordinates.x + this.size.width * points.x;
    const fromY = this.coordinates.y + this.size.height * points.y;


    const x = fromX - size.width * points.x;
    const y = fromY - size.height * points.y;


    return this.setValue({ x, y, width: size.width, height: size.height });
  }

  /**
   * Scales the box by a factor and relative points.
   * @param {number} factor - The scaling factor.
   * @param {TrueCropperPoints} points - The relative points for scaling.
   * @returns {void}
   */
  public scale(factor: number, points: TrueCropperPoints) {
    const width = this.size.width * factor;
    const height = this.size.height * factor;
    return this.resize({ width, height }, points);
  }

  /**
   * Retrieves the current dimensions of the box.
   * @returns {TrueCropperSize} The width and height of the box.
   */
  public getBoxSize() {
    return { ...this.imgSize };
  }

  /**
   * Retrieves the current coordinates of the box.
   * @returns {TrueCropperCoordinates} The current x and y coordinates of the box.
   */
  public getCoourdinates(): TrueCropperCoordinates {
    return { x: this.coordinates.x, y: this.coordinates.y };
  }

  /**
   * Retrieves the current box.
   * @returns {TrueCropperBoxProps} The current x and y coordinates, width, and height of the box.
   */
  public getValue(): TrueCropperBoxProps {
    return {
      x: this.coordinates.x,
      y: this.coordinates.y,
      width: this.size.width,
      height: this.size.height,
    };
  }

  /**
   * Retrieves the current real(natural) value of the box including coordinates, width, and height.
   * @returns {TrueCropperBoxProps} The current x and y coordinates, width, and height of the box.
   */
  public getValueReal(): TrueCropperBoxProps {
    return this.getValue();
  }

  /**
   * Retrieves the current value of the box relative to a specified width and height.
   * @param {TrueCropperSize} size - The width and height for calculating relative values.
   * @returns {TrueCropperBoxProps} The current x and y coordinates, width, and height of the box relative to the specified width and height.
   */
  public getValueRelative({ width, height }: TrueCropperSize): TrueCropperBoxProps {
    return {
      x: this.coordinates.x * width,
      y: this.coordinates.y * height,
      width: this.size.width * width,
      height: this.size.height * height,
    };
  }

  /**
   * Retrieves the current value of the box as a percentage of the image size.
   * @returns {TrueCropperBoxProps} The current x and y coordinates, width, and height of the box as a percentage of the image size.
   */
  public getValuePercent(): TrueCropperBoxProps {
    return {
      x: (this.coordinates.x / this.imgSize.width) * 100,
      y: (this.coordinates.y / this.imgSize.height) * 100,
      width: (this.size.width / this.imgSize.width) * 100,
      height: (this.size.height / this.imgSize.height) * 100,
    };
  }

  /**
   * Calculates the coordinates of the opposite corner of the box based on relative points.
   * @param {TrueCropperPoints} points - The relative points determining the opposite corner.
   * @returns {TrueCropperCoordinates} The calculated x and y coordinates of the opposite corner.
   */
  public getOppositeCornerCoordinates(points: TrueCropperPoints): TrueCropperCoordinates {
    const x =
      points.x === 0.5
        ? -1
        : this.coordinates.x + this.size.width * (1 - points.x);
    const y =
      points.y === 0.5
        ? -1
        : this.coordinates.y + this.size.height * (1 - points.y);
    return { x, y };
  }

  /**
   * Prepares and applies new size and coordinates for the box based on the provided data.
   * @param {TrueCropperNullableBoxData} newBox - The new box data to apply.
   * @returns {boolean} Returns true if the new size and coordinates were successfully applied, false otherwise.
   */
  public prepareAndApplyNewSizeAndCoordinates(newBox: TrueCropperNullableBoxData) {
    const data = this.prepareSizeAndCoordinates(newBox);
    if (data.size.width === 0 || data.size.height === 0) {
      return false;
    }

    this.size = this.adjustAndCalculateSize(data);
    this.coordinates = this.adjustAndCalculateCoordinate(
      data.coordinates,
      this.size,
      data.points,
    );

    return true;
  }

  /**
   * Prepares and calculates the size and coordinates for the new box based on the provided data.
   * @param {TrueCropperNullableBoxData} newBox - The new box data to calculate size and coordinates for.
   * @returns {TrueCropperDragData} An object containing the calculated size, coordinates, and other relevant properties.
   */
  private prepareSizeAndCoordinates(newBox: TrueCropperNullableBoxData): TrueCropperDragData {
    const size = {
      width: newBox.size.width ?? this.size.width,
      height: newBox.size.height ?? this.size.height,
    };
    const coordinates = {
      x: newBox.coordinates.x ?? this.coordinates.x + this.size.width / 2,
      y: newBox.coordinates.y ?? this.coordinates.y + this.size.height / 2,
    };
    const isVerticalMovement = newBox.coordinates.y !== null;
    const isMultiAxis = isVerticalMovement && newBox.coordinates.x !== null;
    return {
      size,
      coordinates,
      isVerticalMovement,
      isMultiAxis,
      points: newBox.points,
    };
  }

  /**
   * Adjusts and calculates the size based on aspect ratio and constraints for the new box.
   * @param {TrueCropperDragData} data - The data containing coordinates, size, and other parameters for adjustment.
   * @returns {TrueCropperSize} The adjusted size within the constraints of aspect ratio, min size, and max size.
   */
  private adjustAndCalculateSize(data: TrueCropperDragData): TrueCropperSize {
    const size = adjustToAspectRatio(data, this.imgSize, this.aspectRatio);
    const value = containerToMaxMinSize({
      size,
      minSize: this.minSize,
      maxSize: this.maxSize,
      aspectRatio: this.aspectRatio,
    });
    return value;
  }

  /**
   * Adjusts and calculates the new coordinates based on the input coordinates, size, and points.
   * @param {TrueCropperCoordinates} coordinates - The original coordinates.
   * @param {TrueCropperSize} size - The size to adjust the coordinates.
   * @param {TrueCropperPoints} points - The points to calculate the adjustment.
   * @returns {TrueCropperCoordinates} The adjusted coordinates based on the size and points.
   */
  private adjustAndCalculateCoordinate(
    coordinates: TrueCropperCoordinates,
    size: TrueCropperSize,
    points: TrueCropperPoints,
  ): TrueCropperCoordinates {
    return {
      x: coordinates.x - size.width * points.x,
      y: coordinates.y - size.height * points.y,
    };
  }
}
