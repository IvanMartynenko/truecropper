import {
  BoxInitInterface,
  BoxProps,
  Coordinates,
  Idd,
  Idd2,
  Points,
  Size,
} from "./types";
import { adjustToAspectRatio, containerToMaxMinSize } from "./helpers";

/**
 * Box component
 */
export default class Box {
  private coordinates: Coordinates;
  private size: Size;
  private minSize: Size;
  private maxSize: Size;
  private imgSize: Size;
  private aspectRatio: number;

  /**
   * Creates a new Box instance.
   * @constructor
   * @param {BoxInitInterface} - Initialization parameters.
   */
  public constructor({
    coordinates,
    size,
    minSize,
    maxSize,
    imgProps,
    aspectRatio,
  }: BoxInitInterface) {
    this.coordinates = { ...coordinates };
    this.size = { ...size };
    this.minSize = { ...minSize };
    this.maxSize = { ...maxSize };
    this.imgSize = { ...imgProps };
    this.aspectRatio = aspectRatio;
  }

  /**
   * Moves the box to the specified coordinates within the boundaries of the image.
   * @param {Coordinates} coordinates - The new x and y coordinates for the box.
   * @returns {void}
   */
  public move(coordinates: Coordinates) {
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
   * @param {Size} size - The new size for the box.
   * @param {Points} points - The relative points for resizing.
   * @returns {void}
   */
  public resize(size: Size, points: Points) {
    const fromX = this.coordinates.x + this.size.width * points.x;
    const fromY = this.coordinates.y + this.size.height * points.y;

    this.coordinates = {
      x: fromX - size.width * points.x,
      y: fromY - size.height * points.y,
    };
    this.size = { width: size.width, height: size.height };
  }

  /**
   * Scales the box by a factor and relative points.
   * @param {number} factor - The scaling factor.
   * @param {Points} points - The relative points for scaling.
   * @returns {void}
   */
  public scale(factor: number, points: Points) {
    const width = this.size.width * factor;
    const height = this.size.height * factor;
    this.resize({ width, height }, points);
  }

  /**
   * Retrieves the current coordinates of the box.
   * @returns {Coordinates} The current x and y coordinates of the box.
   */
  public getCoourdinates(): Coordinates {
    return { x: this.coordinates.x, y: this.coordinates.y };
  }

  /**
   * Retrieves the current box.
   * @returns {BoxProps} The current x and y coordinates, width, and height of the box.
   */
  public getValue(): BoxProps {
    return {
      x: this.coordinates.x,
      y: this.coordinates.y,
      width: this.size.width,
      height: this.size.height,
    };
  }

  /**
   * Retrieves the current real(natural) value of the box including coordinates, width, and height.
   * @returns {BoxProps} The current x and y coordinates, width, and height of the box.
   */
  public getValueReal(): BoxProps {
    return this.getValue();
  }

  /**
   * Retrieves the current value of the box relative to a specified width and height.
   * @param {Size} size - The width and height for calculating relative values.
   * @returns {BoxProps} The current x and y coordinates, width, and height of the box relative to the specified width and height.
   */
  public getValueRelative({ width, height }: Size): BoxProps {
    return {
      x: this.coordinates.x * width,
      y: this.coordinates.y * height,
      width: this.size.width * width,
      height: this.size.height * height,
    };
  }

  /**
   * Retrieves the current value of the box as a percentage of the image size.
   * @returns {BoxProps} The current x and y coordinates, width, and height of the box as a percentage of the image size.
   */
  public getValuePercent(): BoxProps {
    return {
      x: (this.coordinates.x / this.imgSize.width) * 100,
      y: (this.coordinates.y / this.imgSize.height) * 100,
      width: (this.size.width / this.imgSize.width) * 100,
      height: (this.size.height / this.imgSize.height) * 100,
    };
  }

  /**
   * Calculates the coordinates of the opposite corner of the box based on relative points.
   * @param {Points} points - The relative points determining the opposite corner.
   * @returns {Coordinates} The calculated x and y coordinates of the opposite corner.
   */
  public getOppositeCornerCoordinates(points: Points): Coordinates {
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
   * @param {Idd} newBox - The new box data to apply.
   * @returns {boolean} Returns true if the new size and coordinates were successfully applied, false otherwise.
   */
  public prepareAndApplyNewSizeAndCoordinates(newBox: Idd) {
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
   * @param {Idd} newBox - The new box data to calculate size and coordinates for.
   * @returns {Idd2} An object containing the calculated size, coordinates, and other relevant properties.
   */
  private prepareSizeAndCoordinates(newBox: Idd): Idd2 {
    const size = {
      width: newBox.size.width ?? this.size.width,
      height: newBox.size.height ?? this.size.height,
    };
    const coordinates = {
      x: newBox.coordinates.x ?? this.coordinates.x + this.size.width / 2,
      y: newBox.coordinates.y ?? this.coordinates.y + this.size.height / 2,
    };
    const isVerticalMovement = newBox.coordinates.y !== null;
    const isMultuAxis = isVerticalMovement && newBox.coordinates.x !== null;
    return {
      size,
      coordinates,
      isVerticalMovement,
      isMultuAxis,
      points: newBox.points,
    };
  }

  /**
   * Adjusts and calculates the size based on aspect ratio and constraints for the new box.
   * @param {Idd2} data - The data containing coordinates, size, and other parameters for adjustment.
   * @returns {Size} The adjusted size within the constraints of aspect ratio, min size, and max size.
   */
  private adjustAndCalculateSize(data: Idd2): Size {
    const size = adjustToAspectRatio(data, this.imgSize, this.aspectRatio);
    return containerToMaxMinSize({
      size,
      minSize: this.minSize,
      maxSize: this.maxSize,
      aspectRatio: this.aspectRatio,
    });
  }

  /**
   * Adjusts and calculates the new coordinates based on the input coordinates, size, and points.
   * @param {Coordinates} coordinates - The original coordinates.
   * @param {Size} size - The size to adjust the coordinates.
   * @param {Points} points - The points to calculate the adjustment.
   * @returns {Coordinates} The adjusted coordinates based on the size and points.
   */
  private adjustAndCalculateCoordinate(
    coordinates: Coordinates,
    size: Size,
    points: Points,
  ): Coordinates {
    return {
      x: coordinates.x - size.width * points.x,
      y: coordinates.y - size.height * points.y,
    };
  }
}
