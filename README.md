## RealCropper.js

### A vanilla JavaScript image cropper that's lightweight, awesome, and has absolutely zero dependencies.

- Made only with native, delicious vanilla JS
- Zero dependencies
- No z-index, make modals easy
- Work with real image pixel size
- Supports touch devices

**[Try it out in the demo →](https://ivanmartynenko.github.io/truecropper/)**

## Installation

**Via NPM:**

```bash
npm install truecropper
```

```javascript
import TrueCropper from "truecropper";
```

_Note: Don't forget to bundle or include trueCropper.css!_

**Via script tag:**

```html
<link href="path/to/truecropper.css" rel="stylesheet" />
<script src="path/to/truecropper.js"></script>
```

## Basic Usage

**In your HTML document:**

```html
<img src="path/to/image.jpg" id="imageid" />
```

or to prevent img replacement

```html
<div class="truecropper"><img src="path/to/image.jpg" id="imageid" /></div>
```

**In your JavaScript file:**

```javascript
var cropInstance = new TrueCropper("#imageid", {
  // ...options
});
```

_Protip: You can also pass an `Element` object directly instead of a selector._

**To retrieve crop region:**

```javascript
var data = cropInstance.getValue();
// data = {x: 20, y: 20: width: 120, height: 120}
```

## Statuses

- waiting: Waiting to initialize
- ready: Ready to work
- reloading: Image uploading in progress
- error: Error initializing. See errors section.

## Options

_The options can be loaded from data attribute of image._

#### **aspectRatio**

Constrain the crop region to an aspect ratio.

- Type: `Number`
- Default: `null`
- Example: `aspectRatio: 1` (Square)
- Dataset attribute name: [`truecropper-aspect-ratio`]

#### **maxSize**

Constrain the crop region to a maximum size.

- Type: `[width, height, unit?]`
- Default: `null`
- Example: `maxSize: [50, 50, 'percent']` (A maximum size of 50% of the image size)
- Dataset attribute names: [`truecropper-max-size-width`, `truecropper-max-size-height`, `truecropper-max-size-unit`]

_Note: `unit` accepts a value of **'real'** or **'percent'** or **'relative'**. Defaults to **'real'**._

#### **minSize**

Constrain the crop region to a minimum size.

- Type: `[width, height, unit?]`
- Default: `null`
- Example: `minSize: [20, 20, 'real']` (A minimum width and height of 20px)
- Dataset attribute names: [`truecropper-min-size-width`, `truecropper-min-size-height`, `truecropper-min-size-unit`]

_Note: `unit` accepts a value of **'real'** or **'percent'** or **'relative'**. Defaults to **'real'**._

#### **startSize**

The starting size of the crop region when it is **first** initialized.

- Type: `[x, y, width, height, unit?]`
- Default: `[0, 0, 100, 100, 'percent']` (A starting crop region as large as possible)
- Example: `startSize: [0, 0, 50, 50, "real"]` (A starting crop region on 0x0:50x50)
- Dataset attribute names: [`truecropper-start-size-x`, `truecropper-start-size-y`, `truecropper-start-size-width`, `truecropper-max-start-height`, `truecropper-start-size-unit`]

_Note: `unit` accepts a value of **'real'** or **'percent'** or **'relative'**. Defaults to **'real'**._

#### **defaultSize**

The starting size of the crop region when it is **not first** initialized. Such as, `instance.setImage()` is called.

- Type: `[x, y, width, height, unit?]`
- Default: `[0, 0, 100, 100, 'percent']` (A starting crop region as large as possible)
- Example: `defaultSize: [50, 50]` (A starting crop region of 50% of the image size)
- Dataset attribute names: [`truecropper-default-size-x`, `truecropper-default-size-y`, `truecropper-default-size-width`, `truecropper-max-default-height`, `truecropper-default-size-unit`]

_Note: `unit` accepts a value of **'real'** or **'percent'** or **'relative'**. Defaults to **'real'**._

#### **returnMode**

Define how the crop region should be calculated.

- Type: `String`
- Default: `"real"`
- Possible values: `"real"`, `"percent"` or `"relative"`
  - `real` returns the crop region values based on the size of the image's actual sizes. This ensures that the crop region values are the same regardless if the TrueCropper element is scaled or not.
  - `percent` returns the crop region values as a ratio. e.g. For example, an `x, y` position at the center will be `{x: 50, y: 50}`.
  - `relative` returns the crop region values as is based on the size of the TrueCropper element.
- Dataset attribute name: [`truecropper-return-mode`]

#### **allowFlip**

Allow crop region to flip.

- Type: `Boolean`
- Default: `true`
- Example: `allowFlip: false`
- Dataset attribute name: [`truecropper-allow-flip`]

#### **allowNewSelection**

Allow create new crop region.

- Type: `Boolean`
- Default: `true`
- Example: `allowNewSelection: false`
- Dataset attribute name: [`truecropper-allow-allow-new-selection`]

#### **allowMove**

Allow crop region to move.

- Type: `Boolean`
- Default: `true`
- Example: `allowMove: true`
- Dataset attribute name: [`truecropper-allow-move`]

#### **allowResize**

Allow crop region to resize.

- Type: `Boolean`
- Default: `true`
- Example: `allowResize: true`
- Dataset attribute name: [`truecropper-allow-resize`]

## Options callback functions

#### onInitialize

A callback function that is called before when the TrueCropper instance draw the html object.

- Type: `Function`
- Arguments: `instance = this, data = {x, y, width, height}`
- Example:

```javascript
onInitialize: function(instance, data) {
  // do things here
}
```

- Dataset attribute name: no implementation

#### **onCropStart**

A callback function that is called when the user starts modifying the crop region.

- Type: `Function`
- Arguments: `instance = this, data = {x, y, width, height}`
- Example:

```javascript
onCropStart: function(instance, data) {
  console.log(data.x, data.y, data.width, data.height);
}
```

- Dataset attribute name: no implementation

#### **onCropMove**

A callback function that is called when the crop region changes.

- Type: `Function`
- Arguments: `instance = this, data = {x, y, width, height}`
- Example:

```javascript
onCropMove: function(instance, data) {
  console.log(data.x, data.y, data.width, data.height);
}
```

- Dataset attribute name: no implementation

#### **onCropEnd**

A callback function that is called when the user stops modifying the crop region.

- Type: `Function`
- Arguments: `instance = this, data = {x, y, width, height}`
- Example:

```javascript
onCropEnd: function(instance, data) {
  console.log(data.x, data.y, data.width, data.height);
}
```

- Dataset attribute name: no implementation

#### **onError**

A callback function that is called when an error occurs during initialization. See errors section.

- Type: `Function`
- Arguments: `instance = this, data = { type: string, message: string, data: { null | target: string, coordinates?: { x: number; y: number; }, targetSize: { width: number; height: number; }, source: string; sourceSize: { width: number; height: number; }; }  }`
- Example:

```javascript
onError: function(instance, data) {
  console.error(data.message);
}
```
- Dataset attribute name: no implementation

## Methods

#### getValue(_returnMode?: string_)

Returns the value of the crop region. `returnMode` inherits from options by default. Refer to [returnMode](#returnmode) for possible values.

```javascript
var value = cropInstance.getValue();
// value = {x: 21, y: 63: width: 120, height: 120}

var ratio = cropInstance.getValue("ratio");
// value = {x: 10, y: 30: width: 57, height: 57}
```

#### destroy()

Destroys the TrueCropper instance and restores the original `img` element.

#### setImage(src: string)

Changes the image src.

#### moveTo({ x: number, y: number })

Moves the crop region to the specified coordinates.

#### resizeTo({ width: number, height: number }, _origin?: Array_)

Resizes the crop region to the specified size. `origin` is an optional argument that specifies the origin point (in ratio) to resize from in the format of `[x, y]`. Defaults to `[0.5, 0.5]` (center).

#### scaleBy(factor: number, _origin?: Array_)

Scales the crop region by a factor. `origin` is an optional argument that specifies the origin point (in ratio) to resize from in the format of `[x, y]`. Defaults to `[0.5, 0.5]` (center).

#### reset()

Resets the crop region to default position and size. Returns the TrueCropper instance.

#### getImageProps()

Return the image props in format: `{ real: { width, height }, relative: { width, height } }`. If status is not `ready` return zero or previus image value on width and height props.

#### getStatus()

Get status of truecropper instance.

#### setValue({ x: number, y: number, width: number, height: number })

Set the crop region by properties.


## Errors

When an image is initialized or reloaded, this cropper checks the initialization parameters. If an error occurs, it fires the onError callback if it is set. Otherwise, the error will spread further.

List of possible errors:

| type: string            | message: string                                                                                                                                                                                                                                                     | data: null \| Object                                                                                                                                                            | description                                                                                                                                                      |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TrueCropperHtmlError    | Unable to find element                                                                                                                                                                                                                                              | null                                                                                                                                                                            | DOM element specified in selector not found                                                                                                                      |
| TrueCropperHtmlError    | Image src not provided                                                                                                                                                                                                                                              | null                                                                                                                                                                            | The DOM element is not an image element                                                                                                                          |
| TrueCropperHtmlError    | Parent element can be exists                                                                                                                                                                                                                                        | null                                                                                                                                                                            | A DOM element has no parent DOM element. Most likely you won't see this error at all because the element will at least be in the body tag                        |
| TrueCropperOptionsError | ${option} must be of type ${optionType}                                                                                                                                                                                                                             | null                                                                                                                                                                            | The type of configuration parameters or data set does not match the required data type                                                                           |
| TrueCropperOptionsError | ${option} must not be ${optionType}                                                                                                                                                                                                                                 | null                                                                                                                                                                            | The type from the configuration parameters or data set must not have the specified value. For example, passing NaN instead of one of the possible numeric values |
| TrueCropperOptionsError | The specified aspect ratio (${aspectRatio}) and calculated ${minimum/StartSize/DefaultSize} dimensions (width/height = ${calculatedAspectRatio}) are greater than (${epsilon}). This might be due to a rounding error on the server side or incorrect minimum sizes | null                                                                                                                                                                            | Checking for possible floating point rounding errors in aspect rati                                                                                              |
| TrueCropperImageError   | The startSize (${x}x${y}:${width}x${height}) exceeds the imageSize (${imageSize.width}x${imageSize.height})                                                                                                                                                         | { target: "startSize", coordinates: {x:number, y:number}, targetSize: {width:number, height: number}, source: "imageSize", sourceSize: {width: number, height: number} }        | The stating or default crop settings are not suitable for the current image. Checked when loading or reloading an image                                          |
| TrueCropperImageError   | The minSize (${x}x${y}:${width}x${height}) exceeds the ${source} (${source.width}x${source.height})                                                                                                                                                                 | { target: "minSize", coordinates: undefined, targetSize: {width:number, height: number}, source: "imageSize\|maxSize\|startSize", sourceSize: {width: number, height: number} } | We check that imageSize\|maxSize\|startSize is greater than minSize. Checked when loading or reloading an image                                                  |