/**
 * Parse user options
 */

// Tolerance value for floating-point comparison
// const EPSILON = 0.05;

import { CONSTANTS } from "./constant";
import { TrueCropperOptionsError } from "./errors";
import { TrueCropperOptions, TRUECROPPER_SIZE_UNITS, TrueCropperSizeUnit } from "./types";

const PREFIX = CONSTANTS.base;

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Checks if a value is undefined or null.
 * @param {unknown} val - The value to check.
 * @returns {boolean} True if the value is undefined or null, false otherwise.
 */
function isNil(val: unknown) {
  return val === undefined || val === null;
}

/**
 * Checks if a value is a valid number.
 * @param {string} name - The name of the value being checked.
 * @param {unknown} val - The value to check.
 * @param {number} defaultValue - The default value to return if val is null or undefined.
 * @param {boolean} [allowZero=false] - Whether to allow zero as a valid number.
 * @returns {number} The valid number or the default value.
 * @throws {TrueCropperOptionsError} if the value is not a number, is NaN, or is not positive.
 */
function isNumber(
  name: string,
  val: unknown,
  defaultValue: number,
  allowZero: boolean = false,
  allowFractional: boolean = false,
) {
  if (isNil(val)) {
    return defaultValue;
  }
  if (typeof val !== "number") {
    throw TrueCropperOptionsError.new(name, "number");
  }
  if (Number.isNaN(val)) {
    throw TrueCropperOptionsError.new(name, "NaN", false);
  }
  if (allowZero ? val < 0 : val <= 0) {
    throw TrueCropperOptionsError.new(name, "positive");
  }
  if (!allowFractional && val > 0 && val < 1) {
    throw TrueCropperOptionsError.new(name, "fractional");
  }

  return val;
}

/**
 * Checks if a value is a valid boolean.
 * @param {string} name - The name of the value being checked.
 * @param {unknown} val - The value to check.
 * @param {boolean} defaultVal - The default value to return if val is null or undefined.
 * @returns {boolean} The valid boolean or the default value.
 * @throws {TrueCropperOptionsError} if the value is not a boolean.
 */
function isBoolean(name: string, val: unknown, defaultVal: boolean) {
  if (isNil(val)) {
    return defaultVal;
  }
  if (typeof val !== "boolean") {
    throw TrueCropperOptionsError.new(name, "boolean");
  }
  return val;
}

/**
 * Checks if a value is a valid SizeUnit.
 * @param {string} name - The name of the value being checked.
 * @param {unknown} val - The value to check.
 * @param {TrueCropperSizeUnit} defaultValue - The default value to return if val is null or undefined.
 * @returns {TrueCropperSizeUnit} The valid SizeUnit or the default value.
 * @throws {TrueCropperOptionsError} if the value is not a valid SizeUnit.
 */
function isSizeUnit(
  name: string,
  val: unknown,
  defaultValue: TrueCropperSizeUnit,
): TrueCropperSizeUnit {
  if (isNil(val)) {
    return defaultValue;
  }
  if (typeof val !== "string" || !TRUECROPPER_SIZE_UNITS.includes(val as TrueCropperSizeUnit)) {
    throw TrueCropperOptionsError.new(name, "SizeUnit");
  }
  return val as TrueCropperSizeUnit;
}

/**
 * Parses the options for the TrueCropper instance.
 * @param {DOMStringMap} dataset - The dataset of the TrueCropper container element.
 * @param {Partial<TrueCropperOptions> | undefined} options - The options object passed to the TrueCropper constructor.
 * @returns {TrueCropperOptions} The parsed options object.
 * @throws {TrueCropperOptionsError} if the options object is not of type 'object'.
 */
export const parseOptions = (
  dataset: DOMStringMap,
  options: Partial<TrueCropperOptions> | undefined,
) => {
  const opts = options || {};
  if (typeof opts !== "object" || opts === null) {
    throw TrueCropperOptionsError.new("options", "object");
  }

  /**
   * Retrieves the value for a specific option from the dataset.
   * @param {string} name - The name of the option.
   * @param {unknown} val - The value for the options.
   * @returns {unknown} The parsed value for the options.
   */
  const getValue = (name: string, val: unknown) => {
    // Get the raw value from the dataset
    const value = dataset[`${PREFIX}${capitalizeFirstLetter(name)}`];

    // If the value is null or undefined, return val
    if (!value) {
      return val;
    }

    const lower = value.toLowerCase();
    if (lower === "null" || lower === "undefined" || lower === "nil") {
      return val;
    }

    // If the value can be parsed as a number, return it as a number
    // const numberValue = Number.parseFloat(value);
    // if (numberValue.toString() === value) {
    //   return numberValue;
    // }
    if (value.trim().length !== 0 && !Number.isNaN(Number(value))) {
      return Number(value);
    }

    // If the value is "true" (case-insensitive), return true
    if (lower === "true") {
      return true;
    }

    // If the value is "false" (case-insensitive), return false
    if (lower === "false") {
      return false;
    }

    // Otherwise, return the value as-is
    return value;
  };

  const returnValue = {
    aspectRatio: getValue("aspectRatio", opts.aspectRatio),
    epsilon: getValue("epsilon", opts.epsilon),
    allowFlip: getValue("allowFlip", opts.allowFlip),
    allowNewSelection: getValue("allowNewSelection", opts.allowNewSelection),
    allowMove: getValue("allowMove", opts.allowMove),
    allowResize: getValue("allowResize", opts.allowResize),
    returnMode: getValue("returnMode", opts.returnMode),
    minSize: {
      width: getValue("minSizeWidth", opts.minSize?.width),
      height: getValue("minSizeHeight", opts.minSize?.height),
      unit: getValue("minSizeUnit", opts.minSize?.unit),
    },
    maxSize: {
      width: getValue("maxSizeWidth", opts.maxSize?.width),
      height: getValue("maxSizeHeight", opts.maxSize?.height),
      unit: getValue("maxSizeUnit", opts.maxSize?.unit),
    },
    startSize: {
      x: getValue("startSizeX", opts.startSize?.x),
      y: getValue("startSizeY", opts.startSize?.y),
      width: getValue("startSizeWidth", opts.startSize?.width),
      height: getValue("startSizeHeight", opts.startSize?.height),
      unit: getValue("startSizeUnit", opts.startSize?.unit),
    },
    defaultSize: {
      x: getValue("defaultSizeX", opts.defaultSize?.x),
      y: getValue("defaultSizeY", opts.defaultSize?.y),
      width: getValue("defaultSizeWidth", opts.defaultSize?.width),
      height: getValue("defaultSizeHeight", opts.defaultSize?.height),
      unit: getValue("defaultSizeUnit", opts.defaultSize?.unit),
    },
  };
  if (isNil(returnValue.startSize.x) && isNil(returnValue.startSize.y) && isNil(returnValue.startSize.width) && isNil(returnValue.startSize.height)) {
    returnValue.startSize = returnValue.defaultSize;
  }
  return returnValue;
};

/**
 * Checks if two numbers are approximately equal within a tolerance.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @param {number} epsilon - Tolerance value for floating-point comparison.
 * @returns {boolean} True if the numbers are approximately equal, false otherwise.
 */
const checkAspectRatio = (a: number, b: number, epsilon: number) =>
  Math.abs(a - b) < epsilon;

/**
 * Prepares the options for the TrueCropper instance.
 * @param {ReturnType<typeof parseOptions>} options - The parsed options object.
 * @returns {PreparedOptions} The prepared options object.
 * @throws {TrueCropperOptionsError} if there are issues with the options.
 */
export const prepareOptions = (options: ReturnType<typeof parseOptions>) => {
  const aspectRatio = isNumber("aspectRatio", options.aspectRatio, 0, false, true);
  const epsilon = isNumber("epsilon", options.epsilon, CONSTANTS.epsilon, true, true);
  const minSize = {
    width: isNumber("minSizeWidth", options.minSize.width, 0),
    height: isNumber("minSizeHeight", options.minSize.height, 0),
    unit: isSizeUnit("minSizeUnit", options.minSize?.unit, "real"),
  };
  const maxSize = {
    width: isNumber("maxSizeWidth", options.maxSize.width, 0),
    height: isNumber("maxSizeHeight", options.maxSize.height, 0),
    unit: isSizeUnit("maxSizeUnit", options.maxSize.unit, "real"),
  };
  const firstInitSize = {
    x: isNumber("startSizeX", options.startSize.x, 0, true),
    y: isNumber("startSizeY", options.startSize.y, 0, true),
    width: isNumber("startSizeWidth", options.startSize.width, 0),
    height: isNumber("startSizeHeight", options.startSize.height, 0),
    unit: isSizeUnit("startSizeUnit", options.startSize.unit, "real"),
    centeredX: isNil(options.startSize.x),
    centeredY: isNil(options.startSize.y),
    allowChange: false,
  };
  firstInitSize.allowChange =
    firstInitSize.width === 0 && firstInitSize.height === 0;

  const startSize = {
    x: isNumber("defaultSizeX", options.defaultSize.x, 0, true),
    y: isNumber("defaultSizeY", options.defaultSize.y, 0, true),
    width: isNumber("defaultSizeWidth", options.defaultSize.width, 0),
    height: isNumber("defaultSizeHeight", options.defaultSize.height, 0),
    unit: isSizeUnit("defaultSizeUnit", options.defaultSize.unit, "real"),
    centeredX: isNil(options.defaultSize.x),
    centeredY: isNil(options.defaultSize.y),
    allowChange: false,
  };
  startSize.allowChange = startSize.width === 0 && startSize.height === 0;

  if (aspectRatio) {
    if (minSize.width && minSize.height) {
      const calculatedAspectRatio = minSize.width / minSize.height;
      if (!checkAspectRatio(calculatedAspectRatio, aspectRatio, epsilon)) {
        throw TrueCropperOptionsError.aspectRatio(
          "minimum",
          calculatedAspectRatio,
          aspectRatio,
          epsilon,
        );
      }
    }
    if (startSize.width && startSize.height) {
      const calculatedAspectRatio = startSize.width / startSize.height;
      if (!checkAspectRatio(calculatedAspectRatio, aspectRatio, epsilon)) {
        throw TrueCropperOptionsError.aspectRatio(
          "defaultSize",
          calculatedAspectRatio,
          aspectRatio,
          epsilon,
        );
      }
    }
    if (firstInitSize.width && firstInitSize.height) {
      const calculatedAspectRatio = firstInitSize.width / firstInitSize.height;
      if (!checkAspectRatio(calculatedAspectRatio, aspectRatio, epsilon)) {
        throw TrueCropperOptionsError.aspectRatio(
          "startSize",
          calculatedAspectRatio,
          aspectRatio,
          epsilon,
        );
      }
    }
  }

  if (!firstInitSize.centeredX && firstInitSize.width === 0) {
    throw TrueCropperOptionsError.widthIsNull("firstInitSize");
  }
  if (!firstInitSize.centeredY && firstInitSize.height === 0) {
    throw TrueCropperOptionsError.heightIsNull("firstInitSize");
  }

  if (!startSize.centeredX && startSize.width === 0) {
    throw TrueCropperOptionsError.widthIsNull("startSize");
  }
  if (!startSize.centeredY && startSize.height === 0) {
    throw TrueCropperOptionsError.heightIsNull("startSize");
  }

  if (startSize.unit === 'percent' && (startSize.x + startSize.width > 100 || startSize.y + startSize.height > 100)) {
    throw TrueCropperOptionsError.badSizeOfPercent("startSize");
  }
  if (firstInitSize.unit === 'percent' && (firstInitSize.x + firstInitSize.width > 100 || firstInitSize.y + firstInitSize.height > 100)) {
    throw TrueCropperOptionsError.badSizeOfPercent("firstInitSize");
  }

  if (minSize.unit === 'percent' && (minSize.width > 100 || minSize.height > 100)) {
    throw TrueCropperOptionsError.badSizeOfPercent("minSize");
  }

  if (maxSize.unit === 'percent' && (maxSize.width > 100 || maxSize.height > 100)) {
    throw TrueCropperOptionsError.badSizeOfPercent("maxSize");
  }

  return {
    aspectRatio,
    epsilon,
    allowFlip: isBoolean("allowFlip", options.allowFlip, true),
    allowNewSelection: isBoolean("allowNewSelection", options.allowNewSelection, true,),
    allowMove: isBoolean("allowMove", options.allowMove, true),
    allowResize: isBoolean("allowResize", options.allowResize, true),
    returnMode: isSizeUnit("returnMode", options.returnMode, "real"),
    minSize,
    maxSize,
    firstInitSize,
    startSize,
  } as const;
};
