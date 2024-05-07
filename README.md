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
- error: Error initializing. Ekg minSize > maxSize or other. See errors section.


## Options

_The options can be loaded from data attribute of image._

#### **aspectRatio**

Constrain the crop region to an aspect ratio.

- Type: `Number`
- Default: `null`
- Example: `aspectRatio: 1` (Square)

#### **maxSize**

Constrain the crop region to a maximum size.

- Type: `[width, height, unit?]`
- Default: `null`
- Example: `maxSize: [50, 50, 'percent']` (A maximum size of 50% of the image size)

_Note: `unit` accepts a value of **'real'** or **'percent'** or **'relative'**. Defaults to **'real'**._

#### **minSize**

Constrain the crop region to a minimum size.

- Type: `[width, height, unit?]`
- Default: `null`
- Example: `minSize: [20, 20, 'real']` (A minimum width and height of 20px)

_Note: `unit` accepts a value of **'real'** or **'percent'** or **'relative'**. Defaults to **'real'**._

#### **startSize**

The starting size of the crop region when it is **first** initialized.

- Type: `[x, y, width, height, unit?]`
- Default: `[0, 0, 100, 100, 'percent']` (A starting crop region as large as possible)
- Example: `startSize: [0, 0, 50, 50, "real"]` (A starting crop region on 0x0:50x50)

_Note: `unit` accepts a value of **'real'** or **'percent'** or **'relative'**. Defaults to **'real'**._

#### **defaultSize**

The starting size of the crop region when it is **not first** initialized. Such as, `instance.setImage()` is called.

- Type: `[x, y, width, height, unit?]`
- Default: `[0, 0, 100, 100, 'percent']` (A starting crop region as large as possible)
- Example: `defaultSize: [50, 50]` (A starting crop region of 50% of the image size)

_Note: `unit` accepts a value of **'real'** or **'percent'** or **'relative'**. Defaults to **'real'**._

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

#### **returnMode**

Define how the crop region should be calculated.

- Type: `String`
- Default: `"real"`
- Possible values: `"real"`, `"percent"` or `"relative"`
  - `real` returns the crop region values based on the size of the image's actual sizes. This ensures that the crop region values are the same regardless if the TrueCropper element is scaled or not.
  - `percent` returns the crop region values as a ratio. e.g. For example, an `x, y` position at the center will be `{x: 50, y: 50}`.
  - `relative` returns the crop region values as is based on the size of the TrueCropper element.

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

Get status of realcropper instance.

#### setValue({ x: number, y: number, width: number, height: number })

Set the crop region by properties.
---
