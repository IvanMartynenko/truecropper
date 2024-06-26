declare interface ActiveHandleType {
    points: Points;
}

declare interface BoxProps extends Coordinates, Size {
}

declare interface CallbackError {
    name: string;
    message: string;
    messageId: number;
    data: CallbackErrorData;
}

declare interface CallbackErrorData {
    target?: string;
    targetSize?: Size;
    targetCoordinates?: Coordinates;
    source?: string;
    sourceSize?: Size;
    name?: string;
    object?: string;
}

declare interface CallbackErrorData_2 {
    target?: string;
    targetSize?: Size_2;
    targetCoordinates?: Coordinates_2;
    source?: string;
    sourceSize?: Size_2;
    name?: string;
    object?: string;
}

declare type CallbackOnCrop = CallbackType<TrueCropper, BoxProps>;

declare type CallbackOnError = CallbackType<TrueCropper, CallbackError>;

declare type CallbackType<T, K> = (klass: T, values: K) => void;

declare interface Coordinates {
    x: number;
    y: number;
}

declare interface Coordinates_2 {
    x: number;
    y: number;
}

declare interface CreateNewBoxTypeEvent {
    coordinates: Coordinates;
    size: Size;
    leftMovable: boolean;
    topMovable: boolean;
}

declare const errorMessage: {
    elementNotFound: {
        text: string;
        id: number;
    };
    srcEmpty: {
        text: string;
        id: number;
    };
    parentNotContainDiv: {
        text: string;
        id: number;
    };
};

declare interface IimageErrorData {
    target: string;
    coordinates?: Coordinates;
    targetSize: Size;
    source: string;
    sourceSize: Size;
}

declare interface OptionsPropsValuesType {
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

declare interface Points {
    x: number;
    y: number;
}

declare interface Size {
    width: number;
    height: number;
}

declare interface Size_2 {
    width: number;
    height: number;
}

declare const SIZE_UNIT: readonly ["real", "relative", "percent"];

declare type SizeUnit = (typeof SIZE_UNIT)[number];

declare interface SizeWithUnit extends Size, UnitProps {
}

declare interface StartSizeProps extends Coordinates, Partial<Size>, UnitProps {
}

declare enum Status {
    "waiting" = "waiting",
    "ready" = "ready",
    "reloading" = "reloading",
    "error" = "error"
}

declare class TrueCropper {
    private replaceDOM;
    private htmlContainer;
    private htmlImg;
    private options;
    private newSelection;
    private selection;
    private handles;
    private background;
    private box;
    private currentMove;
    private activeHandle;
    private real;
    private relative;
    private ratio;
    private firstInit;
    private isDomCreated;
    status: Status;
    eventBus: ({ type, data }: TrueCropperCoreCallbackEvent) => boolean;
    private observer;
    private preventDoubleLoad?;
    private callbacks;
    constructor(element: HTMLImageElement | string, optionsProps?: Partial<OptionsPropsValuesType>);
    getImagePreview(): HTMLCanvasElement | undefined;
    /**
     * Changes the image src.
     * @param {String} src
     */
    setImage(src: string): void;
    /**
     * Resets the crop region to the initial settings.
     */
    reset(): void;
    /**
     * Destroy the TrueCropper instance and replace with the original element.
     */
    destroy(): void;
    /**
     * Moves the crop region to a specified coordinate.
     * @param {Coordinates} coordinates
     */
    moveTo(coordinates: Coordinates): void;
    /**
     * Resizes the crop region to a specified width and height.
     * @param {Size} size
     * @param {Points} points
     */
    resizeTo(size: Size, points?: Points): void;
    /**
     * Scale the crop region by a factor.
     * @param {Number} factor
     * @param {Points} points
     */
    scaleBy(factor: number, points?: Points): void;
    /**
     * Sets the value of a box.
     * @param {BoxProps} box - The box object containing properties to set.
     * @public
     */
    setValue(box: BoxProps): void;
    /**
     * Get the value of the crop region.
     * @param {SizeUnit | undefined} mode - The mode of return value type. If null, defaults to the return mode set in returnMode options.
     * @returns {number} - The value of the crop region.
     */
    getValue(mode?: SizeUnit | undefined): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Retrieves the image properties.
     * @returns {real: Size, relative: Size} An object containing the real and relative properties.
         * @public
         */
     getImageProps(): {
         real: {
             width: number;
             height: number;
         };
         relative: {
             width: number;
             height: number;
         };
     };
     /**
      * Retrieves the status of the instance.
      * @returns {Status} The status of the instance.
      */
     getStatus(): Status;
     /**
      * Handles the callback when after initialization.
      */
     protected onInitializeCallback(): void;
     /**
      * Handles the callback when cropping starts.
      */
     protected onCropStartCallback(): void;
     /**
      * Handles the callback when cropping is in progress.
      */
     protected onCropMoveCallback(): void;
     /**
      * Handles the callback when cropping ends.
      */
     protected onCropEndCallback(): void;
     /**
      * Handles errors encountered during operations.
      * @param {TrueCropperHtmlError | TrueCropperImageError | TrueCropperOptionsError} error - The error object containing information about the error.
      */
     protected onErrorCallback(error: TrueCropperHtmlError | TrueCropperImageError | TrueCropperOptionsError): void;
     /** ==============
      *
      *
      *  Private methods
      *
      *
      * ==============
      */
     private initializeObserver;
     private initializeCropper;
     private initialize;
     private createDOM;
     private calcContainerProps;
     protected createNewBox(): void;
     private updateRelativeSize;
     private changeStatus;
     /**
      * Draw visuals (border, handles, etc) for the current box.
      */
     private redraw;
     private event;
     private tryToCreateNewBox;
     /**
      * Executes when user begins dragging a handle.
      */
     private onHandleMoveStart;
     /**
      * Executes on handle move. Main logic to manage the movement of handles.
      */
     private onHandleMoveMoving;
     /**
      *  Executes when the handle move ends.
      */
     private onHandleMoveEnd;
     /**
      * Executes when user starts moving the crop region.
      * @param {TrueCropperCoreRegionMoveEvent["data"]} data - contains the raw mouseX, mouseY coordinate
      */
     private onRegionMoveStart;
     /**
      * Executes when user moves the crop region.
      */
     private onRegionMoveMoving;
     /**
      * Executes when user stops moving the crop region (mouse up).
      */
     private onRegionMoveEnd;
     /**
      * Get the real(natural) mouse coordinates within the image container.
      * @param {number} absMouseX - The absolute X coordinate of the mouse.
      * @param {number} absMouseY - The absolute Y coordinate of the mouse.
      * @returns {[number, number]} - The real(natural) X and Y coordinates within the image container.
      */
     private mouseCoordinates;
     /**
      * Sets a value to a dataset attribute of an HTML image element.
      * @param {string} name - The name of the dataset attribute.
      * @param {string | number} value - The value to set for the dataset attribute.
      */
     private setDataset;
     private parseCallbackFunctions;
     private setDatasetCropValues;
    }
    export default TrueCropper;

    declare type TrueCropperCoreCallbackEvent = TrueCropperCoreHandleStartEvent | TrueCropperCoreHandleMoveEvent | TrueCropperCoreHandleEndEvent | TrueCropperCoreRegionMoveEvent | TrueCropperCoreCreateNewBoxEvent;

    declare interface TrueCropperCoreCreateNewBoxEvent {
        type: "createnewbox";
        data: CreateNewBoxTypeEvent;
    }

    declare interface TrueCropperCoreHandleEndEvent {
        type: "handleend";
        data?: null;
    }

    declare interface TrueCropperCoreHandleMoveEvent {
        type: "handlemove";
        data: Coordinates;
    }

    declare interface TrueCropperCoreHandleStartEvent {
        type: "handlestart";
        data: ActiveHandleType;
    }

    declare interface TrueCropperCoreRegionMoveEvent {
        type: "regionstart" | "regionmove" | "regionend";
        data: Coordinates;
    }

    declare class TrueCropperHtmlError extends Error {
        data: CallbackErrorData_2;
        messageId: number;
        constructor(key: keyof typeof errorMessage);
    }

    declare class TrueCropperImageError extends Error {
        data: CallbackErrorData;
        messageId: number;
        constructor(message: string, data: IimageErrorData, messageId: number);
        static startSize(target: string, coordinates: {
            x: number;
            y: number;
        }, targetSize: {
            width: number;
            height: number;
        }, source: string, sourceSize: {
            width: number;
            height: number;
        }): TrueCropperImageError;
        static size(target: string, targetSize: {
            width: number;
            height: number;
        }, source: string, sourceSize: {
            width: number;
            height: number;
        }): TrueCropperImageError;
    }

    declare class TrueCropperOptionsError extends Error {
        data: CallbackErrorData_2;
        messageId: number;
        constructor(message: string, data: CallbackErrorData_2, messageId?: number);
        static aspectRatio(name: string, calculatedAspectRatio: number, aspectRatio: number, epsilon: number): TrueCropperOptionsError;
        static new(name: string, object: string, positive?: boolean): TrueCropperOptionsError;
    }

    declare interface UnitProps {
        unit: SizeUnit;
    }

    export { }
