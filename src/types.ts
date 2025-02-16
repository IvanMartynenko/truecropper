import TrueCropperCore from "./trueCropper";

// Represents an HTMLImageElement or a selector string.
export type TrueCropperImageElementOrSelector = HTMLImageElement | string;

// Allowed units for sizing.
export const TRUECROPPER_SIZE_UNITS = ["real", "relative", "percent"] as const;
export type TrueCropperSizeUnit = (typeof TRUECROPPER_SIZE_UNITS)[number];

/** Represents a point in 2D space. */
export interface TrueCropperCoordinates {
  x: number;
  y: number;
}

/**
 * Describes directional points.
 * @property x - 1 for left, 0 for right, 0.5 for centered horizontally.
 * @property y - 1 for top, 0 for bottom, 0.5 for centered vertically.
 */
export interface TrueCropperPoints {
  x: number;
  y: number;
}

/** Represents width and height dimensions. */
export interface TrueCropperSize {
  width: number;
  height: number;
}

/** Additional properties indicating a size unit. */
export interface TrueCropperUnitProps {
  unit: TrueCropperSizeUnit;
}

/** Combines position and size data. */
export interface TrueCropperBoxProps extends TrueCropperCoordinates, TrueCropperSize {}

/** Represents a size value along with its unit. */
export interface TrueCropperSizeWithUnit extends TrueCropperSize, TrueCropperUnitProps {}

/**
 * Initial sizing properties (with optional size values) used during setup.
 */
export interface TrueCropperInitialSizeProps extends TrueCropperCoordinates, Partial<TrueCropperSize>, TrueCropperUnitProps {}

/**
 * The complete initial size configuration.
 */
export interface TrueCropperInitialSize extends TrueCropperCoordinates, TrueCropperSize, TrueCropperUnitProps {
  centeredX: boolean;
  centeredY: boolean;
  allowChange: boolean;
}

/**
 * A generic callback type.
 * @param instance - The TrueCropperCore instance.
 * @param values - Associated values.
 */
export type TrueCropperCallback<T, K> = (instance: T, values: K) => void;
export type TrueCropperCropCallback = TrueCropperCallback<TrueCropperCore, TrueCropperBoxProps>;

/**
 * Data structure for error details during cropping.
 */
export interface TrueCropperErrorData {
  target?: string;
  targetSize?: TrueCropperSize;
  targetCoordinates?: TrueCropperCoordinates;
  source?: string;
  sourceSize?: TrueCropperSize;
  name?: string;
  object?: string;
}

/** Represents an error during the cropping process. */
export interface TrueCropperError {
  name: string;
  message: string;
  messageId: number;
  data: TrueCropperErrorData;
}

export type TrueCropperErrorCallback = TrueCropperCallback<TrueCropperCore, TrueCropperError>;

/**
 * Options to configure the TrueCropper.
 */
export interface TrueCropperOptions {
  aspectRatio: number;
  epsilon: number;
  maxSize: Partial<TrueCropperSizeWithUnit>;
  minSize: Partial<TrueCropperSizeWithUnit>;
  startSize: Partial<TrueCropperInitialSizeProps>;
  defaultSize: Partial<TrueCropperInitialSizeProps>;
  returnMode: TrueCropperSizeUnit;
  allowFlip: boolean;
  allowNewSelection: boolean;
  allowMove: boolean;
  allowResize: boolean;
  onInitialize: TrueCropperCropCallback;
  onCropStart: TrueCropperCropCallback;
  onCropMove: TrueCropperCropCallback;
  onCropEnd: TrueCropperCropCallback;
  onError: TrueCropperErrorCallback;
}

/* ────── Event Types ────── */

/** Event fired when a handle starts moving. */
export interface TrueCropperHandleStartEvent {
  type: "handlestart";
  data: TrueCropperActiveHandle;
}

/** Event fired during handle movement. */
export interface TrueCropperHandleMoveEvent {
  type: "handlemove";
  data: TrueCropperCoordinates;
}

/** Event fired when a handle movement ends. */
export interface TrueCropperHandleEndEvent {
  type: "handleend";
  data?: null;
}

/** Event fired during region movement (start, move, or end). */
export interface TrueCropperRegionMoveEvent {
  type: "regionstart" | "regionmove" | "regionend";
  data: TrueCropperCoordinates;
}

/** Data for creating a new crop box. */
export interface TrueCropperNewBoxEventData {
  coordinates: TrueCropperCoordinates;
  size: TrueCropperSize;
  leftMovable: boolean;
  topMovable: boolean;
}

/** Event fired when a new crop box is created. */
export interface TrueCropperNewBoxEvent {
  type: "createnewbox";
  data: TrueCropperNewBoxEventData;
}

/** Additional data for active handles. */
export interface TrueCropperActiveHandleData {
  left: boolean;
  savedCoordinate: number;
}

/** Represents an active handle with its directional points. */
export interface TrueCropperActiveHandle {
  points: TrueCropperPoints;
}

/** A union type for all TrueCropper events. */
export type TrueCropperEvent =
  | TrueCropperHandleStartEvent
  | TrueCropperHandleMoveEvent
  | TrueCropperHandleEndEvent
  | TrueCropperRegionMoveEvent
  | TrueCropperNewBoxEvent;

/** The event handler function type for TrueCropper events. */
export type TrueCropperEventHandler = (event: TrueCropperEvent) => boolean;

/* ────── Enums & Callback Collections ────── */

/** The possible statuses of the TrueCropper. */
export enum TrueCropperStatus {
  Waiting = "waiting",
  Ready = "ready",
  Reloading = "reloading",
  Error = "error",
}

/** Collection of optional callback handlers for TrueCropper events. */
export interface TrueCropperCallbacks {
  onInitialize?: TrueCropperCropCallback;
  onCropStart?: TrueCropperCropCallback;
  onCropMove?: TrueCropperCropCallback;
  onCropEnd?: TrueCropperCropCallback;
  onError?: TrueCropperErrorCallback;
}

/* ────── Additional Data Structures ────── */

/**
 * Defines container size constraints along with its aspect ratio.
 */
export interface TrueCropperContainerSizeConstraints {
  size: TrueCropperSize;
  minSize?: TrueCropperSize;
  maxSize?: TrueCropperSize;
  aspectRatio: number;
}

/**
 * Error data specific to image issues.
 */
export interface TrueCropperImageErrorData {
  target: string;
  coordinates?: TrueCropperCoordinates;
  targetSize: TrueCropperSize;
  source: string;
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
  coordinates: TrueCropperCoordinates;
  size: TrueCropperSize;
  points: TrueCropperPoints;
  isVerticalMovement: boolean;
  isMultiAxis: boolean;
}

/**
 * Represents the initialization configuration for a crop box.
 */
export interface TrueCropperBoxInitConfig {
  coordinates: TrueCropperCoordinates;
  size: TrueCropperSize;
  minSize: TrueCropperSize;
  maxSize: TrueCropperSize;
  imgProps: TrueCropperSize;
  aspectRatio: number;
  epsilon: number;
}