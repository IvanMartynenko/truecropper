import TrueCropperCore from "./trueCropper";

export type InitQuerySelectorOrHtmlElementType = HTMLImageElement | string;

export const SIZE_UNIT = ["real", "relative", "percent"] as const;
export type SizeUnit = (typeof SIZE_UNIT)[number];

export interface Coordinates {
  x: number;
  y: number;
}
export interface Points {
  x: number; // 1 move to left, 0 move to right, 0.5 move from center
  y: number; // 1 move to top, 0 move to bottom, 0.5 move from center
}
export interface Size {
  width: number;
  height: number;
}
export interface UnitProps {
  unit: SizeUnit;
}
export interface BoxProps extends Coordinates, Size {}
export interface SizeWithUnit extends Size, UnitProps {}

export interface StartSizeProps extends Coordinates, Partial<Size>, UnitProps {}
export interface StartSize extends Coordinates, Size, UnitProps {
  centeredX: boolean;
  centeredY: boolean;
  allowChange: boolean;
}

export type CallbackType<T, K> = (klass: T, values: K) => void;
export type CallbackOnCrop = CallbackType<TrueCropperCore, BoxProps>;
export interface ImageError {
  target: string;
  source: string;
  targetSize: Size;
  sourceSize: Size;
}
export interface CallbackError {
  type: string;
  message: string;
  data: null | ImageError;
}
export type CallbackOnError = CallbackType<TrueCropperCore, CallbackError>;

export interface OptionsPropsValuesType {
  aspectRatio: number;
  maxSize: Partial<SizeWithUnit>;
  minSize: Partial<SizeWithUnit>;
  startSize: Partial<StartSizeProps>;
  defaultSize: Partial<StartSizeProps>;
  returnMode: SizeUnit;
  allowFlip: boolean;
  allowNewSelection: boolean;
  allowMove: boolean;
  allowResize: boolean;
  onInitialize: CallbackOnCrop;
  onCropStart: CallbackOnCrop;
  onCropMove: CallbackOnCrop;
  onCropEnd: CallbackOnCrop;
  onError: CallbackOnError;
}

export interface TrueCropperCoreHandleStartEvent {
  type: "handlestart";
  data: ActiveHandleType;
}

export interface TrueCropperCoreHandleMoveEvent {
  type: "handlemove";
  data: Coordinates;
}

export interface TrueCropperCoreHandleEndEvent {
  type: "handleend";
  data?: null;
}

export interface TrueCropperCoreRegionMoveEvent {
  type: "regionstart" | "regionmove" | "regionend";
  data: Coordinates;
}

export interface CreateNewBoxTypeEvent {
  coordinates: Coordinates;
  size: Size;
  leftMovable: boolean;
  topMovable: boolean;
}

export interface TrueCropperCoreCreateNewBoxEvent {
  type: "createnewbox";
  data: CreateNewBoxTypeEvent;
}

export interface ActiveHandleDataType {
  left: boolean;
  savedCoordinate: number;
}
export interface ActiveHandleType {
  points: Points;
}

export type TrueCropperCoreCallbackEvent =
  | TrueCropperCoreHandleStartEvent
  | TrueCropperCoreHandleMoveEvent
  | TrueCropperCoreHandleEndEvent
  | TrueCropperCoreRegionMoveEvent
  | TrueCropperCoreCreateNewBoxEvent;
export type TrueCropperCoreCallbackEventFunction = ({
  type,
  data,
}: TrueCropperCoreCallbackEvent) => boolean;

export enum Status {
  "waiting" = "waiting",
  "ready" = "ready",
  "reloading" = "reloading",
  "error" = "error",
}

export interface Icallback {
  onInitialize?: CallbackOnCrop;
  onCropStart?: CallbackOnCrop;
  onCropMove?: CallbackOnCrop;
  onCropEnd?: CallbackOnCrop;
  onError?: CallbackOnError;
}

export interface ContainerToMaxMinSize {
  size: Size;
  minSize?: Size;
  maxSize?: Size;
  aspectRatio: number;
}

export interface IimageErrorData {
  target: string;
  coordinates?: Coordinates;
  targetSize: Size;
  source: string;
  sourceSize: Size;
}

export interface Idd {
  coordinates: { x: number | null; y: number | null };
  size: { width: number | null; height: number | null };
  points: Points;
}
export interface Idd2 {
  coordinates: Coordinates;
  size: Size;
  points: Points;
  isVerticalMovement: boolean;
  isMultuAxis: boolean;
}
/**
 * Represents the initialization interface for Box.
 * @interface
 */
export interface BoxInitInterface {
  coordinates: Coordinates;
  size: Size;
  minSize: Size;
  maxSize: Size;
  imgProps: Size;
  aspectRatio: number;
}
