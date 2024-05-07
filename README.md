![TrueCropper.js](https://raw.githubusercontent.com/IvanMartynenko/truecropper/main/static/logo.svg)

### A vanilla JavaScript image cropper that's lightweight, awesome, and has absolutely zero dependencies.

* Made only with native, delicious vanilla JS
* Zero dependencies
* No z-index, make modals easy
* Work with real image pixel size
* Supports touch devices

**[Try it out in the demo →](https://ivanmartynenko.github.io/truecropper/)**

## Installation

**Via NPM:**

```bash
npm install truecropper
```

```javascript
import TrueCropper from 'truecropper';
```
_Note: Don't forget to bundle or include trueCropper.css!_

**Via script tag:**

```html
<link href="path/to/truecropper.css" rel="stylesheet"/>
<script src="path/to/truecropper.js"></script>
```


## Basic Usage

**In your HTML document:**

```html
<div class="truecropper"><img src="path/to/image.jpg" id="truecropper"/></div>
```

**In your JavaScript file:**

```javascript
var cropInstance = new TrueCropper('#truecropper', {
  // ...options
});
```

_Protip: You can also pass an `Element` object directly instead of a selector._

**To retrieve crop region:**

```javascript
var data = cropInstance.getValue();
// data = {x: 20, y: 20: width: 120, height: 120}
```



## Options

#### **aspectRatio**

Constrain the crop region to an aspect ratio.

* Type: `Number`
* Default: `null`
* Example: `aspectRatio: 1` (Square)



#### **maxSize**

Constrain the crop region to a maximum size.

* Type: `[width, height, unit?]`
* Default: `null`
* Example: `maxSize: [50, 50, '%']` (A maximum size of 50% of the image size)

_Note: `unit` accepts a value of **'px'** or **'%'**. Defaults to **'px'**._



#### **minSize**

Constrain the crop region to a minimum size.

- Type: `[width, height, unit?]`
- Default: `null`
- Example: `minSize: [20, 20, 'px']` (A minimum width and height of 20px)

_Note: `unit` accepts a value of **'px'** or **'%'**. Defaults to **'px'**._



#### **startSize**

The starting size of the crop region when it is initialized.

- Type: `[width, height, unit?]`
- Default: `[100, 100, '%']` (A starting crop region as large as possible)
- Example: `startSize: [50, 50]` (A starting crop region of 50% of the image size)

_Note: `unit` accepts a value of **'px'** or **'%'**. Defaults to **'%'**._



#### **onCropStart**

A callback function that is called when the user starts modifying the crop region.

* Type: `Function`
* Arguments: `data = {x, y, width, height}`
* Example:
```javascript
onCropStart: function(data) {
  console.log(data.x, data.y, data.width, data.height);
}
```

#### **onCropMove**

A callback function that is called when the crop region changes.

* Type: `Function`
* Arguments: `data = {x, y, width, height}`
* Example:
```javascript
onCropMove: function(data) {
  console.log(data.x, data.y, data.width, data.height);
}
```

#### **onCropEnd**

A callback function that is called when the user stops modifying the crop region.

* Type: `Function`
* Arguments: `data = {x, y, width, height}`
* Example:
```javascript
onCropEnd: function(data) {
  console.log(data.x, data.y, data.width, data.height);
}
```

#### onInitialize

A callback function that is called when the TrueCropper instance is fully initialized.

* Type: `Function`
* Arguments: The TrueCropper instance
* Example:
```javascript
onInitialize: function(instance) {
  // do things here
}
```


#### **returnMode**

Define how the crop region should be calculated.

* Type: `String`
* Default: `"real"`
* Possible values: `"real"`, `"ratio"` or `"raw"`
  * `real` returns the crop region values based on the size of the image's actual sizes. This ensures that the crop region values are the same regardless if the TrueCropper element is scaled or not.
  * `ratio` returns the crop region values as a ratio between 0 to 1. e.g. For example, an `x, y` position at the center will be `{x: 0.5, y: 0.5}`.
  * `raw` returns the crop region values as is based on the size of the TrueCropper element.



## Methods

#### getValue(_returnMode?: string_)

Returns the value of the crop region. `returnMode` inherits from options by default. Refer to [returnMode](#returnmode) for possible values.

```javascript
var value = cropInstance.getValue();
// value = {x: 21, y: 63: width: 120, height: 120}

var ratio = cropInstance.getValue('ratio');
// value = {x: 0.1, y: 0.3: width: 0.57, height: 0.57}
```

#### destroy()

Destroys the TrueCropper instance and restores the original `img` element.

#### setImage(src: string)

Changes the image src. Returns the TrueCropper instance.

#### moveTo(x: number, y: number)

Moves the crop region to the specified coordinates. Returns the TrueCropper instance.

#### resizeTo(width: number, height: number, _origin?: Array_)

Resizes the crop region to the specified size. `origin` is an optional argument that specifies the origin point (in ratio) to resize from in the format of `[x, y]`. Defaults to `[0.5, 0.5]` (center). Returns the TrueCropper instance.

#### scaleBy(factor: number, _origin?: Array_)

Scales the crop region by a factor. `origin` is an optional argument that specifies the origin point (in ratio) to resize from in the format of `[x, y]`. Defaults to `[0.5, 0.5]` (center). Returns the TrueCropper instance.

#### reset()

Resets the crop region to its original position and size. Returns the TrueCropper instance.

- - -
