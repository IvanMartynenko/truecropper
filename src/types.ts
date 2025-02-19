import TrueCropperCore from "./trueCropper";

/**
 * Represents an HTMLImageElement or a CSS selector string.
 */
export type TrueCropperImageElementOrSelector = HTMLImageElement | string;

/**
 * Array of allowed size units.
 */
export const TRUECROPPER_SIZE_UNITS = ["real", "relative", "percent"] as const;

/**
 * A union type representing allowed units for sizing.
 */
export type TrueCropperSizeUnit = (typeof TRUECROPPER_SIZE_UNITS)[number];

/**
 * Represents a point in 2D space.
 */
export interface TrueCropperCoordinates {
  /** The x-coordinate. */
  x: number;
  /** The y-coordinate. */
  y: number;
}

/**
 * Represents directional points used for positioning handles or regions.
 *
 * @remarks
 * - For the x property: use `1` for left, `0` for right, and `0.5` for centered horizontally.
 * - For the y property: use `1` for top, `0` for bottom, and `0.5` for centered vertically.
 */
export interface TrueCropperPoints {
  x: number;
  y: number;
}

/**
 * Represents dimensions with width and height.
 */
export interface TrueCropperSize {
  /** The width dimension. */
  width: number;
  /** The height dimension. */
  height: number;
}

/**
 * Provides a size unit property.
 */
export interface TrueCropperUnitProps {
  /** The unit used for sizing. */
  unit: TrueCropperSizeUnit;
}

/**
 * Combines position and size properties.
 */
export interface TrueCropperBoxProps extends TrueCropperCoordinates, TrueCropperSize {}

/**
 * Represents a size value along with its associated unit.
 */
export interface TrueCropperSizeWithUnit extends TrueCropperSize, TrueCropperUnitProps {}

/**
 * Initial sizing properties used during setup.
 *
 * @remarks
 * The size values (width and height) are optional.
 */
export interface TrueCropperInitialSizeProps
  extends TrueCropperCoordinates,
    Partial<TrueCropperSize>,
    TrueCropperUnitProps {}

/**
 * The complete initial size configuration.
 */
export interface TrueCropperInitialSize extends TrueCropperCoordinates, TrueCropperSize, TrueCropperUnitProps {
  /** Whether the crop box is centered horizontally. */
  centeredX: boolean;
  /** Whether the crop box is centered vertically. */
  centeredY: boolean;
  /** Whether the crop box size can be changed after initialization. */
  allowChange: boolean;
}

/**
 * A generic callback type.
 *
 * @param instance - The instance of TrueCropperCore.
 * @param values - The associated values passed to the callback.
 */
export type TrueCropperCallback<T, K> = (instance: T, values: K) => void;

/**
 * Callback invoked during cropping events.
 *
 * @see {@link TrueCropperCallback}
 */
export type TrueCropperCropCallback = TrueCropperCallback<TrueCropperCore, TrueCropperBoxProps>;

/**
 * Data structure for details about an error during cropping.
 */
export interface TrueCropperErrorData {
  /** The target element identifier (if applicable). */
  target?: string;
  /** The size of the target element (if applicable). */
  targetSize?: TrueCropperSize;
  /** The coordinates of the target element (if applicable). */
  targetCoordinates?: TrueCropperCoordinates;
  /** The source element identifier (if applicable). */
  source?: string;
  /** The size of the source element (if applicable). */
  sourceSize?: TrueCropperSize;
  /** An optional error name. */
  name?: string;
  /** An optional object identifier related to the error. */
  object?: string;
}

/**
 * Represents an error that occurred during the cropping process.
 */
export interface TrueCropperError {
  /** The error name. */
  name: string;
  /** The error message. */
  message: string;
  /** An error message identifier. */
  messageId: number;
  /** Additional data related to the error. */
  data: TrueCropperErrorData;
}

/**
 * Callback invoked when an error occurs during cropping.
 *
 * @see {@link TrueCropperCallback}
 */
export type TrueCropperErrorCallback = TrueCropperCallback<TrueCropperCore, TrueCropperError>;

/**
 * Options to configure the TrueCropper instance.
 */
export interface TrueCropperOptions {
  /** The desired aspect ratio for the crop box. */
  aspectRatio: number; // [0,1]
  /** The epsilon value used for calculations (tolerance). */
  epsilon: number; // > 0
  /** Maximum allowed size for the crop box. */
  maxSize: Partial<TrueCropperSizeWithUnit>; // x,y,width,height
  /** Minimum allowed size for the crop box. */
  minSize: Partial<TrueCropperSizeWithUnit>; // x,y,width,height
  /** The starting size properties for the crop box. */
  startSize: Partial<TrueCropperInitialSizeProps>; // x,y,width,height
  /** The default size properties for the crop box. */
  defaultSize: Partial<TrueCropperInitialSizeProps>; // x,y,width,height
  /** The unit mode to use when returning size values. */
  returnMode: TrueCropperSizeUnit; // real,persent,relative
  /** Whether the crop box can be flipped. */
  allowFlip: boolean;
  /** Whether a new selection (crop box) can be created. */
  allowNewSelection: boolean;
  /** Whether the crop box is movable. */
  allowMove: boolean;
  /** Whether the crop box is resizable. */
  allowResize: boolean;
  /** Callback invoked upon initialization. */
  onInitialize: TrueCropperCropCallback;
  /** Callback invoked when cropping starts. */
  onCropStart: TrueCropperCropCallback;
  /** Callback invoked during cropping movement. */
  onCropChange: TrueCropperCropCallback;
  /** Callback invoked when cropping ends. */
  onCropEnd: TrueCropperCropCallback;
  /** Callback invoked when an error occurs. */
  onError: TrueCropperErrorCallback;
}

/* ────── Event Types ────── */

/**
 * Event fired when a handle starts moving.
 */
export interface TrueCropperHandleStartEvent {
  /** The event type identifier. */
  type: "handlestart";
  /** Data associated with the active handle. */
  data: TrueCropperActiveHandle;
}

/**
 * Event fired during handle movement.
 */
export interface TrueCropperHandleMoveEvent {
  /** The event type identifier. */
  type: "handlemove";
  /** The current coordinates of the handle. */
  data: TrueCropperCoordinates;
}

/**
 * Event fired when a handle movement ends.
 */
export interface TrueCropperHandleEndEvent {
  /** The event type identifier. */
  type: "handleend";
  /** No additional data is provided on handle end. */
  data?: null;
}

/**
 * Event fired during region movement (start, move, or end).
 */
export interface TrueCropperRegionMoveEvent {
  /** The event type identifier; can be 'regionstart', 'regionmove', or 'regionend'. */
  type: "regionstart" | "regionmove" | "regionend";
  /** The current coordinates of the region. */
  data: TrueCropperCoordinates;
}

/**
 * Data structure for creating a new crop box.
 */
export interface TrueCropperNewBoxEventData {
  /** The starting coordinates for the new crop box. */
  coordinates: TrueCropperCoordinates;
  /** The initial size for the new crop box. */
  size: TrueCropperSize;
  /** Indicates if the left side of the crop box can be moved. */
  leftMovable: boolean;
  /** Indicates if the top side of the crop box can be moved. */
  topMovable: boolean;
}

/**
 * Event fired when a new crop box is created.
 */
export interface TrueCropperNewBoxEvent {
  /** The event type identifier. */
  type: "createnewbox";
  /** Data associated with the new crop box. */
  data: TrueCropperNewBoxEventData;
}

/**
 * Additional data for active handles.
 */
export interface TrueCropperActiveHandleData {
  /** Indicates if the left side is active. */
  left: boolean;
  /** The saved coordinate value used during the handle's movement. */
  savedCoordinate: number;
}

/**
 * Represents an active handle with its directional points.
 */
export interface TrueCropperActiveHandle {
  /** The directional points for the active handle. */
  points: TrueCropperPoints;
}

/**
 * Union type for all TrueCropper events.
 */
export type TrueCropperEvent =
  | TrueCropperHandleStartEvent
  | TrueCropperHandleMoveEvent
  | TrueCropperHandleEndEvent
  | TrueCropperRegionMoveEvent
  | TrueCropperNewBoxEvent;

/**
 * The event handler function type for TrueCropper events.
 *
 * @param event - The event object.
 * @returns A boolean indicating whether the event was handled.
 */
export type TrueCropperEventHandler = (event: TrueCropperEvent) => boolean;

/* ────── Enums & Callback Collections ────── */

/**
 * The possible statuses of the TrueCropper.
 */
export enum TrueCropperStatus {
  /** The cropper is waiting for initialization. */
  Waiting = "waiting",
  /** The cropper is ready for user interaction. */
  Ready = "ready",
  /** The cropper is in the process of reloading. */
  Reloading = "reloading",
  /** An error has occurred in the cropper. */
  Error = "error",
}

/**
 * Collection of optional callback handlers for TrueCropper events.
 */
export interface TrueCropperCallbacks {
  /** Callback invoked upon initialization. */
  onInitialize?: TrueCropperCropCallback;
  /** Callback invoked when cropping starts. */
  onCropStart?: TrueCropperCropCallback;
  /** Callback invoked during cropping changes. */
  onCropChange?: TrueCropperCropCallback;
  /** Callback invoked when cropping ends. */
  onCropEnd?: TrueCropperCropCallback;
  /** Callback invoked when an error occurs. */
  onError?: TrueCropperErrorCallback;
}

/* ────── Additional Data Structures ────── */

/**
 * Defines container size constraints along with its aspect ratio.
 */
export interface TrueCropperContainerSizeConstraints {
  /** The container size. */
  size: TrueCropperSize;
  /** The minimum allowed container size (if applicable). */
  minSize?: TrueCropperSize;
  /** The maximum allowed container size (if applicable). */
  maxSize?: TrueCropperSize;
  /** The aspect ratio of the container. */
  aspectRatio: number;
}

/**
 * Error data specific to image issues.
 */
export interface TrueCropperImageErrorData {
  /** The target image identifier. */
  target: string;
  /** The coordinates related to the error (if applicable). */
  coordinates?: TrueCropperCoordinates;
  /** The size of the target image. */
  targetSize: TrueCropperSize;
  /** The source image identifier. */
  source: string;
  /** The size of the source image. */
  sourceSize: TrueCropperSize;
}

/**
 * Box data that may contain nullable values.
 */
export interface TrueCropperNullableBoxData {
  coordinates: { x: number | null; y: number | null };
  size: { width: number | null; height: number | null };
  points: TrueCropperPoints;
}

/**
 * Data related to dragging or resizing operations.
 */
export interface TrueCropperDragData {
  /** The current coordinates during the drag or resize operation. */
  coordinates: TrueCropperCoordinates;
  /** The current size during the drag or resize operation. */
  size: TrueCropperSize;
  /** The directional points associated with the operation. */
  points: TrueCropperPoints;
  /** Whether the movement is primarily vertical. */
  isVerticalMovement: boolean;
  /** Whether the movement affects multiple axes. */
  isMultiAxis: boolean;
}

/**
 * Represents the initialization configuration for a crop box.
 */
export interface TrueCropperBoxInitConfig {
  /** The starting coordinates of the crop box. */
  coordinates: TrueCropperCoordinates;
  /** The initial size of the crop box. */
  size: TrueCropperSize;
  /** The minimum allowed size for the crop box. */
  minSize: TrueCropperSize;
  /** The maximum allowed size for the crop box. */
  maxSize: TrueCropperSize;
  /** The properties of the image (dimensions) being cropped. */
  imgProps: TrueCropperSize;
  /** The desired aspect ratio for the crop box. */
  aspectRatio: number;
  /** The epsilon value used for calculations (tolerance). */
  epsilon: number;
}
