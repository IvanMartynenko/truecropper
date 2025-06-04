/**
 * Predefined error messages for HTML errors in TrueCropper.
 */
declare const errorMessage: {
    /**
     * Error when the target element is not found.
     */
    elementNotFound: {
        text: string;
        id: number;
    };
    /**
     * Error when the image source is not provided.
     */
    srcEmpty: {
        text: string;
        id: number;
    };
    /**
     * Error when the parent element does not contain the required <div> element.
     */
    parentNotContainDiv: {
        text: string;
        id: number;
    };
};

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
    status: TrueCropperStatus;
    eventBus: ({ type, data }: TrueCropperEvent) => boolean;
    private observer;
    private preventDoubleLoad?;
    private callbacks;
    constructor(element: HTMLImageElement | string, optionsProps?: Partial<TrueCropperOptions>);
    getImagePreview(): HTMLCanvasElement | null;
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
     * @param {TrueCropperCoordinates} coordinates
     */
    moveTo(coordinates: TrueCropperCoordinates, mode?: TrueCropperSizeUnit | undefined): void;
    /**
     * Resizes the crop region to a specified width and height.
     * @param {SiTrueCropperSizeze} size
     * @param {TrueCropperPoints} points
     */
    resizeTo(size: TrueCropperSize, points?: TrueCropperPoints, mode?: TrueCropperSizeUnit | undefined): {
        ok: boolean;
        message: string;
    } | undefined;
    /**
     * Scale the crop region by a factor.
     * @param {Number} factor
     * @param {TrueCropperPoints} points
     */
    scaleBy(factor: number, points?: TrueCropperPoints): {
        ok: boolean;
        message: string;
    };
    /**
     * Sets the value of a box.
     * @param {TrueCropperBoxProps} box - The box object containing properties to set.
     * @public
     */
    setValue(box: TrueCropperBoxProps, mode?: TrueCropperSizeUnit | undefined): {
        ok: boolean;
        message: string;
    };
    /**
     * Get the value of the crop region.
     * @param {TrueCropperSizeUnit | undefined} mode - The mode of return value type. If null, defaults to the return mode set in returnMode options.
     * @returns {number} - The value of the crop region.
     */
    getValue(mode?: TrueCropperSizeUnit | undefined): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Retrieves the image properties.
     * @returns {real: TrueCropperSize, relative: TrueCropperSize} An object containing the real and relative properties.
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
      * @returns {TrueCropperStatus} The status of the instance.
      */
     getStatus(): TrueCropperStatus;
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
     protected onCropChangeCallback(): void;
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
      * @param {TrueCropperRegionMoveEvent["data"]} data - contains the raw mouseX, mouseY coordinate
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
     /**
      * Converts a single numeric value from a given mode ("relative", "percent", or "real")
      * into its corresponding real value.
      *
      * @param value - The original value to convert.
      * @param ratio - The reference ratio (e.g., this.ratio.width or this.ratio.height) used for relative conversion.
      * @param total - The total dimension (from the image size) used for percent conversion.
      * @param mode - The conversion mode.
      * @returns The converted value.
      */
     private getConvertedValue;
     /**
      * Converts coordinate values (x and y) into their real equivalents based on the specified mode.
      *
      * @param coordinates - The coordinates to convert.
      * @param mode - The conversion mode ("relative", "percent", or "real").
      *               Defaults to `this.options.returnMode` if not provided.
      * @returns The converted coordinates.
      */
     private coordinatesToReal;
     /**
      * Converts size values (width and height) into their real equivalents based on the specified mode.
      *
      * @param size - The size object to convert.
      * @param mode - The conversion mode ("relative", "percent", or "real").
      *               Defaults to `this.options.returnMode` if not provided.
      * @returns The converted size object.
      */
     private sizeToReal;
     /**
      * Converts a box's properties (both position and size) into their real equivalents
      * based on the specified mode.
      *
      * @param box - The box properties to convert.
      * @param mode - The conversion mode ("relative", "percent", or "real").
      *               Defaults to `this.options.returnMode` if not provided.
      * @returns The converted box properties.
      */
     private boxToReal;
    }
    export default TrueCropper;

    /**
     * Array of allowed size units.
     */
    declare const TRUECROPPER_SIZE_UNITS: readonly ["real", "relative", "percent"];

    /**
     * Represents an active handle with its directional points.
     */
    declare interface TrueCropperActiveHandle {
        /** The directional points for the active handle. */
        points: TrueCropperPoints;
    }

    /**
     * Combines position and size properties.
     */
    declare interface TrueCropperBoxProps extends TrueCropperCoordinates, TrueCropperSize {
    }

    /**
     * A generic callback type.
     *
     * @param instance - The instance of TrueCropperCore.
     * @param values - The associated values passed to the callback.
     */
    declare type TrueCropperCallback<T, K> = (instance: T, values: K) => void;

    /**
     * Represents a point in 2D space.
     */
    declare interface TrueCropperCoordinates {
        /** The x-coordinate. */
        x: number;
        /** The y-coordinate. */
        y: number;
    }

    /**
     * Represents a point in 2D space.
     */
    declare interface TrueCropperCoordinates_2 {
        /** The x-coordinate. */
        x: number;
        /** The y-coordinate. */
        y: number;
    }

    /**
     * Callback invoked during cropping events.
     *
     * @see {@link TrueCropperCallback}
     */
    declare type TrueCropperCropCallback = TrueCropperCallback<TrueCropper, TrueCropperBoxProps>;

    /**
     * Represents an error that occurred during the cropping process.
     */
    declare interface TrueCropperError {
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
    declare type TrueCropperErrorCallback = TrueCropperCallback<TrueCropper, TrueCropperError>;

    /**
     * Data structure for details about an error during cropping.
     */
    declare interface TrueCropperErrorData {
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
     * Data structure for details about an error during cropping.
     */
    declare interface TrueCropperErrorData_2 {
        /** The target element identifier (if applicable). */
        target?: string;
        /** The size of the target element (if applicable). */
        targetSize?: TrueCropperSize_2;
        /** The coordinates of the target element (if applicable). */
        targetCoordinates?: TrueCropperCoordinates_2;
        /** The source element identifier (if applicable). */
        source?: string;
        /** The size of the source element (if applicable). */
        sourceSize?: TrueCropperSize_2;
        /** An optional error name. */
        name?: string;
        /** An optional object identifier related to the error. */
        object?: string;
    }

    /**
     * Union type for all TrueCropper events.
     */
    declare type TrueCropperEvent = TrueCropperHandleStartEvent | TrueCropperHandleMoveEvent | TrueCropperHandleEndEvent | TrueCropperRegionMoveEvent | TrueCropperNewBoxEvent;

    /**
     * Event fired when a handle movement ends.
     */
    declare interface TrueCropperHandleEndEvent {
        /** The event type identifier. */
        type: "handleend";
        /** No additional data is provided on handle end. */
        data?: null;
    }

    /**
     * Event fired during handle movement.
     */
    declare interface TrueCropperHandleMoveEvent {
        /** The event type identifier. */
        type: "handlemove";
        /** The current coordinates of the handle. */
        data: TrueCropperCoordinates;
    }

    /**
     * Event fired when a handle starts moving.
     */
    declare interface TrueCropperHandleStartEvent {
        /** The event type identifier. */
        type: "handlestart";
        /** Data associated with the active handle. */
        data: TrueCropperActiveHandle;
    }

    /**
     * Represents an HTML error specific to TrueCropper.
     *
     * @extends Error
     */
    declare class TrueCropperHtmlError extends Error {
        /**
         * Additional error data.
         */
        data: TrueCropperErrorData_2;
        /**
         * The unique identifier for the error message.
         */
        messageId: number;
        /**
         * Creates an instance of TrueCropperHtmlError.
         *
         * @param key - The key corresponding to a predefined error message.
         */
        constructor(key: keyof typeof errorMessage);
    }

    /**
     * Represents an error related to image processing in TrueCropper.
     *
     * @extends Error
     */
    declare class TrueCropperImageError extends Error {
        /**
         * Additional data related to the image error.
         */
        data: TrueCropperErrorData;
        /**
         * A unique identifier for the error message.
         */
        messageId: number;
        /**
         * Creates an instance of TrueCropperImageError.
         *
         * @param message - The error message.
         * @param data - Additional data associated with the image error.
         * @param messageId - A unique identifier for the error message.
         */
        constructor(message: string, data: TrueCropperImageErrorData, messageId: number);
        /**
         * Creates a new TrueCropperImageError instance for a start size issue.
         *
         * @param target - The target element identifier.
         * @param coordinates - The coordinates related to the error.
         * @param targetSize - The dimensions of the target element.
         * @param source - The source element identifier.
         * @param sourceSize - The dimensions of the source element.
         * @returns A new instance of TrueCropperImageError.
         */
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
        /**
         * Creates a new TrueCropperImageError instance for a size issue.
         *
         * @param target - The target element identifier.
         * @param targetSize - The dimensions of the target element.
         * @param source - The source element identifier.
         * @param sourceSize - The dimensions of the source element.
         * @returns A new instance of TrueCropperImageError.
         */
        static size(target: string, targetSize: {
            width: number;
            height: number;
        }, source: string, sourceSize: {
            width: number;
            height: number;
        }): TrueCropperImageError;
    }

    /**
     * Error data specific to image issues.
     */
    declare interface TrueCropperImageErrorData {
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
     * Initial sizing properties used during setup.
     *
     * @remarks
     * The size values (width and height) are optional.
     */
    declare interface TrueCropperInitialSizeProps extends TrueCropperCoordinates, Partial<TrueCropperSize>, TrueCropperUnitProps {
    }

    /**
     * Event fired when a new crop box is created.
     */
    declare interface TrueCropperNewBoxEvent {
        /** The event type identifier. */
        type: "createnewbox";
        /** Data associated with the new crop box. */
        data: TrueCropperNewBoxEventData;
    }

    /**
     * Data structure for creating a new crop box.
     */
    declare interface TrueCropperNewBoxEventData {
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
     * Options to configure the TrueCropper instance.
     */
    declare interface TrueCropperOptions {
        /** The desired aspect ratio for the crop box. */
        aspectRatio: number;
        /** The epsilon value used for calculations (tolerance). */
        epsilon: number;
        /** Maximum allowed size for the crop box. */
        maxSize: Partial<TrueCropperSizeWithUnit>;
        /** Minimum allowed size for the crop box. */
        minSize: Partial<TrueCropperSizeWithUnit>;
        /** The starting size properties for the crop box. */
        startSize: Partial<TrueCropperInitialSizeProps>;
        /** The default size properties for the crop box. */
        defaultSize: Partial<TrueCropperInitialSizeProps>;
        /** The unit mode to use when returning size values. */
        returnMode: TrueCropperSizeUnit;
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

    /**
     * Represents an error related to invalid options in TrueCropper.
     *
     * @extends Error
     */
    declare class TrueCropperOptionsError extends Error {
        /**
         * Additional data associated with the options error.
         */
        data: TrueCropperErrorData_2;
        /**
         * A unique identifier for the error message.
         */
        messageId: number;
        /**
         * Creates an instance of TrueCropperOptionsError.
         *
         * @param message - The error message.
         * @param data - Additional error data.
         * @param messageId - A unique identifier for the error message.
         */
        constructor(message: string, data: TrueCropperErrorData_2, messageId?: number);
        /**
         * Factory method for creating an options error related to aspect ratio mismatch.
         *
         * @param name - The name of the property or dimension with the aspect ratio issue.
         * @param calculatedAspectRatio - The calculated aspect ratio based on dimensions.
         * @param aspectRatio - The expected aspect ratio.
         * @param epsilon - The tolerance value for aspect ratio differences.
         * @returns A new instance of TrueCropperOptionsError with aspect ratio error details.
         */
        static aspectRatio(name: string, calculatedAspectRatio: number, aspectRatio: number, epsilon: number): TrueCropperOptionsError;
        static widthIsNull(name: string): TrueCropperOptionsError;
        static heightIsNull(name: string): TrueCropperOptionsError;
        static badSizeOfPercent(name: string): TrueCropperOptionsError;
        /**
         * Factory method for creating a generic options error.
         *
         * @param name - The name of the option.
         * @param object - The expected or disallowed object description.
         * @param positive - If true, indicates the option must be the specified object; if false, indicates it must not be.
         * @returns A new instance of TrueCropperOptionsError with generic error details.
         */
        static new(name: string, object: string, positive?: boolean): TrueCropperOptionsError;
    }

    /**
     * Represents directional points used for positioning handles or regions.
     *
     * @remarks
     * - For the x property: use `1` for left, `0` for right, and `0.5` for centered horizontally.
     * - For the y property: use `1` for top, `0` for bottom, and `0.5` for centered vertically.
     */
    declare interface TrueCropperPoints {
        x: number;
        y: number;
    }

    /**
     * Event fired during region movement (start, move, or end).
     */
    declare interface TrueCropperRegionMoveEvent {
        /** The event type identifier; can be 'regionstart', 'regionmove', or 'regionend'. */
        type: "regionstart" | "regionmove" | "regionend";
        /** The current coordinates of the region. */
        data: TrueCropperCoordinates;
    }

    /**
     * Represents dimensions with width and height.
     */
    declare interface TrueCropperSize {
        /** The width dimension. */
        width: number;
        /** The height dimension. */
        height: number;
    }

    /**
     * Represents dimensions with width and height.
     */
    declare interface TrueCropperSize_2 {
        /** The width dimension. */
        width: number;
        /** The height dimension. */
        height: number;
    }

    /**
     * A union type representing allowed units for sizing.
     */
    declare type TrueCropperSizeUnit = (typeof TRUECROPPER_SIZE_UNITS)[number];

    /**
     * Represents a size value along with its associated unit.
     */
    declare interface TrueCropperSizeWithUnit extends TrueCropperSize, TrueCropperUnitProps {
    }

    /**
     * The possible statuses of the TrueCropper.
     */
    declare enum TrueCropperStatus {
        /** The cropper is waiting for initialization. */
        Waiting = "waiting",
        /** The cropper is ready for user interaction. */
        Ready = "ready",
        /** The cropper is in the process of reloading. */
        Reloading = "reloading",
        /** An error has occurred in the cropper. */
        Error = "error"
    }

    /**
     * Provides a size unit property.
     */
    declare interface TrueCropperUnitProps {
        /** The unit used for sizing. */
        unit: TrueCropperSizeUnit;
    }

    export { }
