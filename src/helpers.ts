import { CONSTANTS } from "./constant";
import { TrueCropperHtmlError, TrueCropperImageError } from "./errors";
import {
  ActiveHandleDataType,
  Coordinates,
  InitQuerySelectorOrHtmlElementType,
} from "./types";
import {
  BoxInitInterface,
  ContainerToMaxMinSize,
  Idd2,
  Size,
  SizeUnit,
  SizeWithUnit,
  StartSize,
} from "./types";

/**
 * Retrieves HTML elements based on the provided element query or type.
 *
 * @param {InitQuerySelectorOrHtmlElementType} element - The element query or type.
 * @returns {[HTMLImageElement, HTMLDivElement]} The retrieved image element and its parent div.
 */
export const getHTMLelements = (
  element: InitQuerySelectorOrHtmlElementType,
) => {
  let el = null;
  if (typeof element === "string") {
    el = document.querySelector(element);
    if (el === null) {
      throw new TrueCropperHtmlError("elementNotFound");
    }
  } else {
    el = element;
  }
  if (!(el instanceof HTMLImageElement)) {
    throw new TrueCropperHtmlError("srcEmpty");
  }
  // if (el.getAttribute("src") === null) {
  //   throw new TrueCropperHtmlError("srcEmpty");
  // }
  const parent = el.parentElement as HTMLDivElement;
  if (!parent || !parent.classList.contains(CONSTANTS.base)) {
    throw new TrueCropperHtmlError("parentNotContainDiv");
  }
  return [el, parent] as const;
};

/**
 * Creates a new div element with the specified class name and appends it to a parent element if provided.
 *
 * @param {string} className - The class name for the new div element.
 * @param {HTMLElement | undefined} parent - The optional parent element to append the new div to.
 * @returns {HTMLDivElement} The newly created div element.
 */
export const createDiv = (
  className: string,
  parent: HTMLElement | undefined = undefined,
) => {
  const el = document.createElement("div");
  el.className = className;
  if (parent) {
    parent.appendChild(el);
  }
  return el;
};

/**
 * Calculate point based on mouse position and active handle
 * @param {number} mouse - Current mouse position
 * @param {ActiveHandleDataType} handle - Active handle data
 * @returns {Object} - Object containing flipped flag and data with values and new point
 */
const calculatePointBasedOnMouse = (
  mousePosition: number,
  activeHandle: ActiveHandleDataType,
) => {
  // If handle is not active, return points
  if (activeHandle.savedCoordinate < 0) {
    return { flipped: false, coordinate: null, size: null, point: 0.5 };
  }

  // Determine if mouse is to the left of the saved coordinate
  const isMouseLeft = mousePosition < activeHandle.savedCoordinate;

  // Check if handle is flipped
  const flipped = activeHandle.left !== isMouseLeft;
  const coordinate = activeHandle.savedCoordinate;
  const size = Math.abs(activeHandle.savedCoordinate - mousePosition);
  const point = Number(isMouseLeft);

  return {
    flipped,
    coordinate,
    size,
    point,
  };
};

/**
 * Calculates the points based on the mouse coordinates and handles.
 *
 * @param {Coordinates} mouse - The mouse coordinates.
 * @param {ActiveHandleDataType} handleX - The handle for the X coordinate.
 * @param {ActiveHandleDataType} handleY - The handle for the Y coordinate.
 * @returns {Object} The calculated points based on the mouse and handles.
 */
export const calculatePointsBasedOnMouse = (
  mouse: Coordinates,
  handleX: ActiveHandleDataType,
  handleY: ActiveHandleDataType,
) => {
  const aX = calculatePointBasedOnMouse(mouse.x, handleX);
  const aY = calculatePointBasedOnMouse(mouse.y, handleY);
  return {
    flipped: { x: aX.flipped, y: aY.flipped },
    newBox: {
      coordinates: { x: aX.coordinate, y: aY.coordinate },
      size: { width: aX.size, height: aY.size },
      points: { x: aX.point, y: aY.point },
    },
  };
};

/**
 * Converts sizes from real or relative or percent units to real pixel values based on provided parameters.
 * @param {StartSize} start The starting size in real or relative or percent units.
 * @param {SizeWithUnit} min The minimum size in real or relative or percent units.
 * @param {SizeWithUnit} max The maximum size in real orrelative or percent units.
 * @param {Size} real The real image size in pixels. Need for percent values.
 * @param {Size} ratio The ratio of conversion from relative to real pixels.
 * @returns Object containing converted sizes.
 */
export const convertToRealPx = (
  start: StartSize,
  min: SizeWithUnit,
  max: SizeWithUnit,
  real: Size,
  ratio: Size,
) => {
  // Function to convert a value from relative or percent units to real pixels
  const toPx = (val: number, type: keyof Size, unit: SizeUnit) => {
    if (unit === "relative") {
      return val * ratio[type];
    }
    if (unit === "percent") {
      return val >= 1 ? real[type] * (val / 100) : real[type] * val;
    }
    // If the unit is already in pixels, return the value as is
    return val;
  };

  const newMinSize = {
    width: toPx(min.width, "width", min.unit),
    height: toPx(min.height, "height", min.unit),
  };
  const newMaxSize = {
    width: toPx(max.width, "width", max.unit),
    height: toPx(max.height, "height", max.unit),
  };
  // Convert starting coordinates to real pixel values
  const coordinates = {
    x: toPx(start.x, "width", start.unit),
    y: toPx(start.y, "height", start.unit),
  };
  // Convert starting size to real pixel values
  const size = {
    width: toPx(start.width, "width", start.unit),
    height: toPx(start.height, "height", start.unit),
  };
  return { coordinates, size, minSize: newMinSize, maxSize: newMaxSize };
};

/**
 * Processes the initial props for the TrueCropper instance.
 *
 * @param {ReturnType<typeof convertToRealPx>} data - The converted real pixel data.
 * @param {Size} imgProps - The image size.
 * @param {number} aspectRatio - The aspect ratio.
 * @param {boolean} allowChangeStartProps - Flag indicating if start props can be changed.
 * @param {{ x: boolean; y: boolean }} centered - Flag indicating start props coordinates can be changed.
 * @returns {BoxInitInterface} The processed initial props.
 */
export const processingInitialProps = (
  data: ReturnType<typeof convertToRealPx>,
  imgProps: Size,
  aspectRatio: number,
  allowChangeStartProps: boolean,
  centered: { x: boolean; y: boolean },
): BoxInitInterface => {
  const minSize = adjustSizeProps(
    data.minSize,
    { width: 1, height: 1 },
    aspectRatio,
  );
  let maxSize = adjustSizeProps(data.maxSize, imgProps, aspectRatio);
  let size = adjustSizeProps(data.size, imgProps, aspectRatio);

  maxSize = calculateAdjustedMaxSize(maxSize, imgProps, aspectRatio);

  let coordinates = data.coordinates;
  if (allowChangeStartProps) {
    const tmp = adjustStartProps(
      coordinates,
      size,
      minSize,
      maxSize,
      imgProps,
      aspectRatio,
      centered.x,
      centered.y,
    );
    coordinates = tmp.coordinates;
    size = tmp.size;
  }

  return { coordinates, size, minSize, maxSize, imgProps, aspectRatio };
};

/**
 * Validates the image sizes based on various criteria.
 *
 * @param {BoxInitInterface} options - The box initialization interface.
 */
export const validateImageSizes = ({
  coordinates,
  minSize,
  maxSize,
  size,
  imgProps,
}: BoxInitInterface) => {
  const checkDimensions = (
    first: Size,
    second: Size,
    firstName: string,
    secondName: string,
  ) => {
    if (first.width > second.width || first.height > second.height) {
      throw TrueCropperImageError.size(firstName, first, secondName, second);
    }
  };

  // Perform size validations
  // Check minimum size dimensions
  checkDimensions(minSize, imgProps, "minSize", "imageSize");
  // Validate if the minimum size exceeds the maximum size
  checkDimensions(minSize, maxSize, "minSize", "maxSize");
  // Check start size dimensions
  checkDimensions(minSize, size, "minSize", "startSize");
  if (
    coordinates.x + size.width > imgProps.width ||
    coordinates.y + size.height > imgProps.height
  ) {
    throw TrueCropperImageError.startSize(
      "startSize",
      coordinates,
      size,
      "imageSize",
      imgProps,
    );
  }
};

/**
 * Converts the container size to the maximum and minimum size.
 *
 * @param {ContainerToMaxMinSize} options - The container size and constraints.
 * @returns {Size} The new size after applying maximum and minimum constraints.
 */
export const containerToMaxMinSize = ({
  size,
  minSize,
  maxSize,
  aspectRatio,
}: ContainerToMaxMinSize) => {
  const newSize = { ...size };
  if (maxSize) {
    if (newSize.width > maxSize.width) {
      newSize.width = maxSize.width;
      newSize.height = aspectRatio
        ? maxSize.width / aspectRatio
        : newSize.height;
    }

    if (newSize.height > maxSize.height) {
      newSize.width = aspectRatio
        ? maxSize.height * aspectRatio
        : newSize.width;
      newSize.height = maxSize.height;
    }
  }

  if (minSize) {
    if (newSize.width < minSize.width) {
      newSize.width = minSize.width;
      newSize.height = aspectRatio
        ? minSize.width / aspectRatio
        : newSize.height;
    }

    if (newSize.height < minSize.height) {
      newSize.width = aspectRatio
        ? minSize.height * aspectRatio
        : newSize.width;
      newSize.height = minSize.height;
    }
  }

  return newSize;
};

/**
 * Adjusts the width of a size nox based on a width adjustment, a point, and an aspect ratio.
 * @param {number} widthAdjustment The amount to adjust the width by.
 * @param {number} point The point to use in the adjustment.
 * @param {number} aspectRatio The aspect ratio to use in the adjustment.
 * @returns {Size} The adjusted size box.
 */
const adjustWidth = (
  widthAdjustment: number,
  point: number,
  aspectRatio: number,
): Size => {
  const newWidth = widthAdjustment * point;
  return { width: newWidth, height: newWidth / aspectRatio };
};

/**
 * Adjusts the height of a size box based on a height adjustment, a point, and an aspect ratio.
 * @param {number} heightAdjustment The amount to adjust the height by.
 * @param {number} point The point to use in the adjustment.
 * @param {number} aspectRatio The aspect ratio to use in the adjustment.
 * @returns {Size} The adjusted size box.
 */
const adjustHeight = (
  heightAdjustment: number,
  point: number,
  aspectRatio: number,
): Size => {
  const newHeight = heightAdjustment * point;
  return { width: newHeight * aspectRatio, height: newHeight };
};

/**
 * Adjusts a size box to match a specified aspect ratio.
 * @param {Idd2} data The data box containing the size, coordinates, and points.
 * @param {Size} maxSize The maximum size of the box.
 * @param {number} aspectRatio The aspect ratio to adjust to.
 * @returns The adjusted size box.
 */
export const adjustToAspectRatio = (
  data: Idd2,
  maxSize: Size,
  aspectRatio: number,
): Size => {
  let newSize = { ...data.size };
  if (aspectRatio === 0) {
    return newSize;
  }

  const vertiacal = data.isMultuAxis
    ? newSize.height * aspectRatio >= newSize.width
    : data.isVerticalMovement;
  const pointX = data.points.x === 1 || data.points.x === 0 ? 1 : 2;
  const pointY = data.points.y === 1 || data.points.y === 0 ? 1 : 2;
  if (vertiacal) {
    newSize = { width: newSize.height * aspectRatio, height: newSize.height };
  } else {
    newSize = { width: newSize.width, height: newSize.width / aspectRatio };
  }

  // Check if the coordinates do not exceed the image boundaries in width
  if (
    data.coordinates.x + newSize.width * (1 - data.points.x) >
    maxSize.width
  ) {
    newSize = adjustWidth(
      maxSize.width - data.coordinates.x,
      pointX,
      aspectRatio,
    );
  }

  // Check if the coordinates do not exceed the image boundaries in height
  if (
    data.coordinates.y + newSize.height * (1 - data.points.y) >
    maxSize.height
  ) {
    newSize = adjustHeight(
      maxSize.height - data.coordinates.y,
      pointY,
      aspectRatio,
    );
  }

  // Check if the coordinates do not exceed the image boundaries in width (left)
  if (data.coordinates.x - newSize.width * data.points.x < 0) {
    newSize = adjustWidth(data.coordinates.x, pointX, aspectRatio);
  }

  // Check if the coordinates do not exceed the image boundaries in height (top)
  if (data.coordinates.y - newSize.height * data.points.y < 0) {
    newSize = adjustHeight(data.coordinates.y, pointY, aspectRatio);
  }

  return newSize;
};

/**
 * Adjusts the size properties by removing empty values and adjusting based on aspect ratio.
 *
 * @param {Size} sizeProps - The size properties to adjust.
 * @param {Size} defaultVal - The default size values.
 * @param {number} aspectRatio - The aspect ratio to consider.
 * @returns {Size} The adjusted size.
 */
const adjustSizeProps = (
  sizeProps: Size,
  defaultVal: Size,
  aspectRatio: number,
): Size => {
  const size = { ...sizeProps };
  // Adjust size based on aspect ratio if necessary
  if (aspectRatio && !size.width && !size.height) {
    if (aspectRatio > 1) {
      size.height = defaultVal.height;
    } else {
      size.width = defaultVal.width;
    }
  }

  if (!size.width) {
    size.width = aspectRatio ? size.height * aspectRatio : defaultVal.width;
  }

  if (!size.height) {
    size.height = aspectRatio ? size.width / aspectRatio : defaultVal.height;
  }

  return size;
};

/**
 * Calculates the adjusted maximum size based on image size and aspect ratio.
 *
 * @param {Size} maxSizeProps - The maximum size properties.
 * @param {Size} image - The image size to consider.
 * @param {number} aspectRatio - The aspect ratio to apply.
 * @returns {Size} The calculated maximum size.
 */
const calculateAdjustedMaxSize = (
  maxSizeProps: Size,
  image: Size,
  aspectRatio: number,
) => {
  let maxSize = { ...maxSizeProps };
  if (aspectRatio) {
    if (maxSize.width > maxSize.height * aspectRatio) {
      maxSize.width = maxSize.height * aspectRatio;
    } else {
      maxSize.height = maxSize.width / aspectRatio;
    }
  }
  // Adjust maximum size if necessary
  maxSize = containerToMaxMinSize({
    size: maxSize,
    maxSize: image,
    aspectRatio,
  });
  return maxSize;
};

/**
 * Adjusts the start coordinates and size based on constraints and centering options.
 *
 * @param {Coordinates} coordinates - The initial coordinates.
 * @param {Size} startSize - The initial start size.
 * @param {Size} minSize - The minimum size constraints.
 * @param {Size} maxSize - The maximum size constraints.
 * @param {Size} image - The image size to consider.
 * @param {number} aspectRatio - The aspect ratio to apply.
 * @param {boolean} centeredX - Flag for centering horizontally.
 * @param {boolean} centeredY - Flag for centering vertically.
 * @returns {AdjustedStartProps} The adjusted start coordinates and size.
 */
const adjustStartProps = (
  coordinates: Coordinates,
  startSize: Size,
  minSize: Size,
  maxSize: Size,
  image: Size,
  aspectRatio: number,
  centeredX: boolean,
  centeredY: boolean,
) => {
  const startSizeProps = { ...startSize };
  const newCoordinates = { ...coordinates };

  const maxX = Math.min(maxSize.width, image.width - coordinates.x);
  const maxY = Math.min(maxSize.height, image.height - coordinates.y);
  // Adjust maximum size if necessary
  const newSize = containerToMaxMinSize({
    size: startSizeProps,
    maxSize: { width: maxX, height: maxY },
    minSize,
    aspectRatio,
  });
  startSizeProps.width = newSize.width;
  startSizeProps.height = newSize.height;

  newCoordinates.x = centeredX
    ? (image.width - startSizeProps.width) / 2
    : coordinates.x;
  newCoordinates.y = centeredY
    ? (image.height - startSizeProps.height) / 2
    : coordinates.y;

  return { coordinates: newCoordinates, size: startSizeProps };
};
