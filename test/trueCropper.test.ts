import TrueCropper from "../src/trueCropper";
import { JSDOM } from "jsdom";
import { TrueCropperOptions } from "../src/types";
import { parseOptions, prepareOptions } from "../src/options";
global.ResizeObserver = require('resize-observer-polyfill');

/**
 * Helper function to test that an invalid option value triggers an error via onError,
 * and does not throw a synchronous exception.
 *
 * @param {string} optionKey - The option key to test (e.g., "aspectRatio", "epsilon").
 * @param {*} value - The invalid value to test.
 */
function expectInvalidOption(optionKey, value, image) {
  const init = () => prepareOptions(parseOptions(image.dataset, { [optionKey]: value, }));
  expect(init).toThrow();
}

// Function to generate all variants (Cartesian product) from an object of arrays.
function generateVariants(obj) {
  const keys = Object.keys(obj);
  const variants = [];

  function recurse(index, current) {
    if (index === keys.length) {
      variants.push({ ...current });
      return;
    }
    const key = keys[index];
    for (const value of obj[key]) {
      current[key] = value;
      recurse(index + 1, current);
    }
  }
  recurse(0, {});
  return variants;
}

describe("TrueCropper", () => {
  let mockDivElement: HTMLDivElement;
  let mockImageElement: HTMLImageElement;
  let mockOptions: TrueCropperOptions | undefined;

  beforeEach(() => {
    // Create a container to hold our image (simulate a DOM element)
    mockDivElement = document.createElement("div") as HTMLDivElement;
    mockDivElement.classList.add("truecropper"); // Update with your base class
    mockDivElement.id = 'cropper-container';
    mockDivElement.style.width = '512px';
    mockDivElement.style.height = '512px';
    document.body.appendChild(mockDivElement);


    // Create an image element to be cropped.
    mockImageElement = document.createElement('img');
    mockImageElement.id = "truecropperImage";
    mockImageElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEklEQVR42mP8/5+hP6MQwAEuAPGkK49OgAAAABJRU5ErkJggg==';

    Object.defineProperty(mockImageElement, "naturalWidth", {
      value: 1024,
    });
    Object.defineProperty(mockImageElement, "naturalHeight", {
      value: 1024,
    });
    Object.defineProperty(mockImageElement, "width", {
      value: 512,
    });
    Object.defineProperty(mockImageElement, "height", {
      value: 512,
    });
    Object.defineProperty(mockImageElement, "offsetWidth", {
      value: 512,
    });
    Object.defineProperty(mockImageElement, "offsetHeight", {
      value: 512,
    });
    jest.spyOn(mockImageElement, 'getBoundingClientRect').mockImplementation(() => ({
      x: 0,
      y: 0,
      width: 512,
      height: 512,
      top: 0,
      left: 0,
      right: 512,
      bottom: 512,
      toJSON() { },
    }));

    mockDivElement.appendChild(mockImageElement);

    mockOptions = undefined;
  });

  afterEach(() => {
    document.body.removeChild(mockDivElement);
  });

  // describe("Image", () => {
  //   it("image size is 512", () => {
  //     expect(mockImageElement.getBoundingClientRect().width).toBe(512);
  //     expect(mockImageElement.getBoundingClientRect().height).toBe(512);
  //   });
  // });


  // describe("Constructor", () => {
  //   it("should initialize without throwing", () => {
  //     expect(() => new TrueCropper(mockImageElement)).not.toThrow();
  //   });

  //   it("should handle invalid element input", () => {
  //     const init = () => new TrueCropper("#nonexistent", mockOptions);
  //     expect(init).toThrow();
  //   });

  //   it("should handle invalid options", () => {
  //     const init = () => new TrueCropper(mockImageElement, { aspectRatio: 0 });
  //     expect(init).toThrow();
  //   });
  // });

  // describe('AspectRatio', () => {
  //   test.each([
  //     [-1, false],
  //     [0, false],
  //     [0.3, true],
  //     ['asdas', false],
  //     [null, true],
  //     [undefined, true],
  //     [{}, false],
  //   ])('AspectRatio %p is %p', (value, expected) => {
  //     const init = () => new TrueCropper(mockImageElement, { aspectRatio: value });
  //     if (expected)
  //       expect(init).not.toThrow();
  //     else
  //       expect(init).toThrow();
  //   });
  // });

  // describe('Epsilon', () => {
  //   test.each([
  //     [-1, false],
  //     [0, true],
  //     [0.3, true],
  //     ['asdas', false],
  //     [null, true],
  //     [undefined, true],
  //     [{}, false],
  //   ])('Epsilon %p is %p', (value, expected) => {
  //     const init = () => new TrueCropper(mockImageElement, { epsilon: value });
  //     if (expected)
  //       expect(init).not.toThrow();
  //     else
  //       expect(init).toThrow();
  //   });
  // });

  describe('Bad options', () => {
    // Invalid values
    const badAspectRatio = [-1, 0, 'string'];
    const badEpsilon = [-1, 'string'];

    const badStartSize = {
      x: [-1, 0.3, 'string'],
      y: [-1, 0.3, 'string'],
      width: [-1, 0, 0.3, 'string', null, undefined],
      height: [-1, 0, 0.3, 'string', null, undefined],
      unit: ['real', 'relative', 'percent', 'string']
    };
    const badStartSize2 = {
      x: [null, undefined],
      y: [null, undefined],
      width: [-1, 0, 0.3, 'string'],
      height: [-1, 0, 0.3, 'string'],
      unit: ['real', 'relative', 'percent']
    };
    const badStartSize3 = {
      x: [50],
      y: [50],
      width: [60, 500],
      height: [60, 500],
      unit: ['percent']
    };
    const badStartSize4 = {
      x: [null, undefined],
      y: [null, undefined],
      width: [500],
      height: [500],
      unit: ['percent']
    };

    const badSize = {
      width: [-1, 0, 0.3, 'string'],
      height: [-1, 0, 0.3, 'string'],
      unit: ['string', 'real', 'percent', undefined]
    };

    const booleanVariants = [-1, 0, 1, 'string'];

    // Generate variant arrays (assuming generateVariants is defined elsewhere)
    const startSizeVariants = [
      ...generateVariants(badStartSize),
      ...generateVariants(badStartSize2),
      ...generateVariants(badStartSize3),
      ...generateVariants(badStartSize4)
    ];
    const sizeVariants = generateVariants(badSize);

    // Map option names to their invalid values
    const testCases = [
      { name: 'aspectRatio', values: badAspectRatio },
      { name: 'epsilon', values: badEpsilon },
      { name: 'maxSize', values: sizeVariants },
      { name: 'minSize', values: sizeVariants },
      { name: 'startSize', values: startSizeVariants },
      { name: 'defaultSize', values: startSizeVariants },
      { name: 'allowFlip', values: booleanVariants },
      { name: 'allowNewSelection', values: booleanVariants },
      { name: 'allowMove', values: booleanVariants },
      { name: 'allowResize', values: booleanVariants },
    ];

    // Loop over each test case and generate tests
    testCases.forEach(({ name, values }) => {
      test.each(values)(`invalid ${name}: %p`, (value) => {
        expectInvalidOption(name, value, mockImageElement);
      });
    });
  });

  describe('DefaultSize', () => {
    // const coordinates = [[-1, false], [0, true], [0.3, false], [10, true], [100, true], [null, true], [undefined, true]]
    // const sizes = [[-1, false], [0, false], [0.3, false], [10, true], [100, true], [null, true], [undefined, true]]

    // const res = coordinates.flatMap(x =>
    //   coordinates.flatMap(y =>
    //     sizes.flatMap(width =>
    //       sizes.map(height => {
    //         const val = x[1] && y[1] && width[1] && height[1];
    //         return [{ x: x[0], y: y[0], width: width[0], height: height[0] }, val]
    //       })
    //     )
    //   )
    // );
    // res.push([undefined, true], [null, true]);

    // test.each(res)('DefaultSize %p is %p', (value, expected) => {
    //   let error = false;
    //   let missingError = false;
    //   try {
    //     new TrueCropper(mockImageElement, {
    //       defaultSize: value,
    //       onError: () => { error = true; }
    //     });
    //   } catch (e) {
    //     missingError = true;
    //   }
    //   expect(!error).toEqual(expected);
    //   expect(missingError).toEqual(false);
    // });


    // const good_sizes = [10, 100, null, undefined]
    // const good_coordinates = [...good_sizes, 0]

    // const good_res = good_coordinates.flatMap(x =>
    //   good_coordinates.flatMap(y =>
    //     good_sizes.flatMap(width =>
    //       good_sizes.map(height => {
    //         return { x, y, width, height }
    //       })
    //     )
    //   )
    // );
    // good_res.push(undefined, null);

    // test.each(good_res)('DefaultSize %p is %p', (value) => {
    //   let error = false;
    //   let missingError = false;
    //   try {
    //     new TrueCropper(mockImageElement, {
    //       defaultSize: value,
    //       onError: () => { error = true; }
    //     });
    //   } catch (e) {
    //     missingError = true;
    //   }
    //   expect(error).toEqual(false);
    //   expect(missingError).toEqual(false);
    // });
    // test.each(good_res)('startSize %p is %p', (value) => {
    //   let error = "";
    //   let missingError = false;
    //   try {
    //     new TrueCropper(mockImageElement, {
    //       startSize: value,
    //       onError: (klass, e) => { error = e.message }
    //     });
    //   } catch (e) {
    //     missingError = true;
    //   }
    //   expect(error).toEqual("");
    //   expect(missingError).toEqual(false);
    // });
  })


  // describe("reset", () => {
  //   let croppr: TrueCropper;

  //   beforeEach(() => {
  //     croppr = new TrueCropper(mockImageElement);
  //   });

  //   it("should reset properly under normal conditions", () => {
  //     expect(() => croppr.reset()).not.toThrow();
  //   });

  //   it("should call the destroy method during reset", () => {
  //     const destroyMock = jest.fn();
  //     croppr.destroy = destroyMock;
  //     croppr.reset();
  //     expect(destroyMock).toHaveBeenCalled();
  //   });
  // });

  // describe("setImage", () => {
  //   let croppr: TrueCropper;

  //   beforeEach(() => {
  //     croppr = new TrueCropper(mockImageElement);
  //   });

  //   it("should setImage src is equal to image src", () => {
  //     const src = "http://localhost/mockImageElement.png";
  //     croppr.setImage(src);
  //     expect(mockImageElement.src).toBe(src);
  //   });
  // });

  // describe("moveTo", () => {
  //   let croppr: TrueCropper;

  //   beforeEach(() => {
  //     croppr = new TrueCropper(mockImageElement);
  //   });

  //   it("should moveTo", () => {
  //     croppr.resizeTo({ width: 100, height: 100 });
  //     croppr.moveTo({ x: 10, y: 10 });
  //     const data = croppr.getValue();
  //     expect(data).toEqual({
  //       x: 10,
  //       y: 10,
  //       width: 100,
  //       height: 100,
  //     });
  //   });
  // });

  // describe("resizeTo", () => {
  //   let croppr: TrueCropper;

  //   beforeEach(() => {
  //     croppr = new TrueCropper(mockImageElement);
  //   });

  //   it("should resizeTo", () => {
  //     croppr.resizeTo({ width: 100, height: 100 }, { x: 0, y: 0 });
  //     const data = croppr.getValue();
  //     expect(data).toEqual({
  //       x: 0,
  //       y: 0,
  //       width: 100,
  //       height: 100,
  //     });
  //   });
  // });

  // describe("scaleBy", () => {
  //   let croppr: TrueCropper;

  //   beforeEach(() => {
  //     croppr = new TrueCropper(mockImageElement);
  //   });

  //   it("should scaleBy", () => {
  //     croppr.scaleBy(0.5, { x: 0, y: 0 });
  //     const data = croppr.getValue();
  //     expect(data).toEqual({
  //       x: 0,
  //       y: 0,
  //       width: 512,
  //       height: 512,
  //     });
  //   });
  // });

  // describe("getValue", () => {
  //   let croppr: TrueCropper;

  //   beforeEach(() => {
  //     croppr = new TrueCropper(mockImageElement);
  //   });

  //   it("should getValue", () => {
  //     croppr.setValue({ x: 10, y: 10, width: 50, height: 50 });
  //     const data = croppr.getValue();
  //     expect(data).toEqual({
  //       x: 10,
  //       y: 10,
  //       width: 50,
  //       height: 50,
  //     });
  //   });
  // });

  // describe("getImageProps", () => {
  //   let croppr: TrueCropper;

  //   beforeEach(() => {
  //     croppr = new TrueCropper(mockImageElement);
  //   });

  //   it("should getImageProps", () => {
  //     const data = croppr.getImageProps();
  //     expect(data).toEqual({
  //       real: {
  //         width: 1024,
  //         height: 1024,
  //       },
  //       relative: {
  //         width: 512,
  //         height: 512,
  //       },
  //     });
  //   });
  // });

  // describe("getStatus", () => {
  //   let croppr: TrueCropper;

  //   beforeEach(() => {
  //     croppr = new TrueCropper(mockImageElement);
  //   });

  //   it("should getStatus", () => {
  //     const data = croppr.getStatus();
  //     expect(data).toBe("ready");
  //   });
  // });
});
