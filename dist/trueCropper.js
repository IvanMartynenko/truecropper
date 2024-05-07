(function(d,l){typeof exports=="object"&&typeof module<"u"?module.exports=l():typeof define=="function"&&define.amd?define(l):(d=typeof globalThis<"u"?globalThis:d||self,d.trueCropper=l())})(this,function(){"use strict";var mt=Object.defineProperty;var pt=(d,l,v)=>l in d?mt(d,l,{enumerable:!0,configurable:!0,writable:!0,value:v}):d[l]=v;var h=(d,l,v)=>(pt(d,typeof l!="symbol"?l+"":l,v),v);const d="truecropper",l={base:d,img:`${d}__image`,background:`${d}__background`,new:`${d}__new-selection`,selection:`${d}__selection`,handle:`${d}__handle`,hanleds:`${d}__handles`,valueX:`${d}X`,valueY:`${d}Y`,valueWidth:`${d}Width`,valueHeight:`${d}Height`,valueStatus:`${d}Status`},v={srcEmpty:"Image src not provided",elementNotFound:"Unable to find element",parentNotContainDiv:"parent element can be exists"};class y extends Error{constructor(e){const i=v[e];super(i);h(this,"data");Object.setPrototypeOf(this,y.prototype),this.name="TrueCropperHtmlError",this.data=null}}class S extends Error{constructor(e,i){super(e);h(this,"data");Object.setPrototypeOf(this,S.prototype),this.name="TrueCropperImageError",this.data={target:i.target,coordinates:i.coordinates?{...i.coordinates}:void 0,targetSize:{...i.targetSize},source:i.source,sourceSize:{...i.sourceSize}}}static startSize(e,i,s,o,r){const a=`The ${e} (${i.x}x${i.y}:${s.width}x${s.height}) exceeds the ${o} (${r.width}x${r.height})`,c={target:e,coordinates:i,targetSize:s,source:o,sourceSize:r};return new this(a,c)}static size(e,i,s,o){const r=`The ${e} (${i.width}x${i.height}) exceeds the ${s} (${o.width}x${o.height})`,a={target:e,coordinates:void 0,targetSize:i,source:s,sourceSize:o};return new this(r,a)}}class g extends Error{constructor(e){super(e);h(this,"data");Object.setPrototypeOf(this,g.prototype),this.name="TrueCropperOptionsError",this.data=null}static aspectRatio(e,i,s){const o=`The specified aspect ratio (${i}) and calculated minimum dimensions (width/height = ${e}) are greater than (${s}). This might be due to a rounding error on the server side or incorrect minimum sizes.`;return new this(o)}static new(e,i,s=!0){const o=s?`${e} must be of type ${i}`:`${e} must not be of type ${i}`;return new this(o)}}const _=n=>{let t=null;if(typeof n=="string"){if(t=document.querySelector(n),t===null)throw new y("elementNotFound")}else t=n;if(!(t instanceof HTMLImageElement))throw new y("srcEmpty");const e=t.parentElement;if(!e||!e.classList.contains(l.base))throw new y("parentNotContainDiv");return[t,e]},C=(n,t=void 0)=>{const e=document.createElement("div");return e.className=n,t&&t.appendChild(e),e},L=(n,t)=>{if(t.savedCoordinate<0)return{flipped:!1,coordinate:null,size:null,point:.5};const e=n<t.savedCoordinate,i=t.left!==e,s=t.savedCoordinate,o=Math.abs(t.savedCoordinate-n),r=Number(e);return{flipped:i,coordinate:s,size:o,point:r}},P=(n,t,e)=>{const i=L(n.x,t),s=L(n.y,e);return{flipped:{x:i.flipped,y:s.flipped},newBox:{coordinates:{x:i.coordinate,y:s.coordinate},size:{width:i.size,height:s.size},points:{x:i.point,y:s.point}}}},q=(n,t,e,i,s)=>{const o=(f,p,z)=>z==="relative"?f*s[p]:z==="percent"?f>=1?i[p]*(f/100):i[p]*f:f,r={width:o(t.width,"width",t.unit),height:o(t.height,"height",t.unit)},a={width:o(e.width,"width",e.unit),height:o(e.height,"height",e.unit)},c={x:o(n.x,"width",n.unit),y:o(n.y,"height",n.unit)},u={width:o(n.width,"width",n.unit),height:o(n.height,"height",n.unit)};return{coordinates:c,size:u,minSize:r,maxSize:a}},Z=(n,t,e,i,s)=>{const o=B(n.minSize,{width:1,height:1},e);let r=B(n.maxSize,t,e),a=B(n.size,t,e);r=K(r,t,e);let c=n.coordinates;if(i){const u=Q(c,a,o,r,t,e,s.x,s.y);c=u.coordinates,a=u.size}return{coordinates:c,size:a,minSize:o,maxSize:r,imgProps:t,aspectRatio:e}},G=({coordinates:n,minSize:t,maxSize:e,size:i,imgProps:s})=>{const o=(r,a,c,u)=>{if(r.width>a.width||r.height>a.height)throw S.size(c,r,u,a)};if(o(t,s,"minSize","imageSize"),o(t,e,"minSize","maxSize"),o(t,i,"minSize","startSize"),n.x+i.width>s.width||n.y+i.height>s.height)throw S.startSize("startSize",n,i,"imageSize",s)},I=({size:n,minSize:t,maxSize:e,aspectRatio:i})=>{const s={...n};return e&&(s.width>e.width&&(s.width=e.width,s.height=i?e.width/i:s.height),s.height>e.height&&(s.width=i?e.height*i:s.width,s.height=e.height)),t&&(s.width<t.width&&(s.width=t.width,s.height=i?t.width/i:s.height),s.height<t.height&&(s.width=i?t.height*i:s.width,s.height=t.height)),s},D=(n,t,e)=>{const i=n*t;return{width:i,height:i/e}},H=(n,t,e)=>{const i=n*t;return{width:i*e,height:i}},J=(n,t,e)=>{let i={...n.size};if(e===0)return i;const s=n.isMultuAxis?i.height*e>=i.width:n.isVerticalMovement,o=n.points.x===1||n.points.x===0?1:2,r=n.points.y===1||n.points.y===0?1:2;return s?i={width:i.height*e,height:i.height}:i={width:i.width,height:i.width/e},n.coordinates.x+i.width*(1-n.points.x)>t.width&&(i=D(t.width-n.coordinates.x,o,e)),n.coordinates.y+i.height*(1-n.points.y)>t.height&&(i=H(t.height-n.coordinates.y,r,e)),n.coordinates.x-i.width*n.points.x<0&&(i=D(n.coordinates.x,o,e)),n.coordinates.y-i.height*n.points.y<0&&(i=H(n.coordinates.y,r,e)),i},B=(n,t,e)=>{const i={...n};return e&&!i.width&&!i.height&&(e>1?i.height=t.height:i.width=t.width),i.width||(i.width=e?i.height*e:t.width),i.height||(i.height=e?i.width/e:t.height),i},K=(n,t,e)=>{let i={...n};return e&&(i.width>i.height*e?i.width=i.height*e:i.height=i.width/e),i=I({size:i,maxSize:t,aspectRatio:e}),i},Q=(n,t,e,i,s,o,r,a)=>{const c={...t},u={...n},f=Math.min(i.width,s.width-n.x),p=Math.min(i.height,s.height-n.y),z=I({size:c,maxSize:{width:f,height:p},minSize:e,aspectRatio:o});return c.width=z.width,c.height=z.height,u.x=r?(s.width-c.width)/2:n.x,u.y=a?(s.height-c.height)/2:n.y,{coordinates:u,size:c}};class tt{constructor({coordinates:t,size:e,minSize:i,maxSize:s,imgProps:o,aspectRatio:r}){h(this,"coordinates");h(this,"size");h(this,"minSize");h(this,"maxSize");h(this,"imgSize");h(this,"aspectRatio");this.coordinates={...t},this.size={...e},this.minSize={...i},this.maxSize={...s},this.imgSize={...o},this.aspectRatio=r}move(t){this.coordinates.x=Math.min(Math.max(t.x,0),this.imgSize.width-this.size.width),this.coordinates.y=Math.min(Math.max(t.y,0),this.imgSize.height-this.size.height)}resize(t,e){const i=this.coordinates.x+this.size.width*e.x,s=this.coordinates.y+this.size.height*e.y;this.coordinates={x:i-t.width*e.x,y:s-t.height*e.y},this.size={width:t.width,height:t.height}}scale(t,e){const i=this.size.width*t,s=this.size.height*t;this.resize({width:i,height:s},e)}getCoourdinates(){return{x:this.coordinates.x,y:this.coordinates.y}}getValue(){return{x:this.coordinates.x,y:this.coordinates.y,width:this.size.width,height:this.size.height}}getValueReal(){return this.getValue()}getValueRelative({width:t,height:e}){return{x:this.coordinates.x*t,y:this.coordinates.y*e,width:this.size.width*t,height:this.size.height*e}}getValuePercent(){return{x:this.coordinates.x/this.imgSize.width*100,y:this.coordinates.y/this.imgSize.height*100,width:this.size.width/this.imgSize.width*100,height:this.size.height/this.imgSize.height*100}}getOppositeCornerCoordinates(t){const e=t.x===.5?-1:this.coordinates.x+this.size.width*(1-t.x),i=t.y===.5?-1:this.coordinates.y+this.size.height*(1-t.y);return{x:e,y:i}}prepareAndApplyNewSizeAndCoordinates(t){const e=this.prepareSizeAndCoordinates(t);return e.size.width===0||e.size.height===0?!1:(this.size=this.adjustAndCalculateSize(e),this.coordinates=this.adjustAndCalculateCoordinate(e.coordinates,this.size,e.points),!0)}prepareSizeAndCoordinates(t){const e={width:t.size.width??this.size.width,height:t.size.height??this.size.height},i={x:t.coordinates.x??this.coordinates.x+this.size.width/2,y:t.coordinates.y??this.coordinates.y+this.size.height/2},s=t.coordinates.y!==null,o=s&&t.coordinates.x!==null;return{size:e,coordinates:i,isVerticalMovement:s,isMultuAxis:o,points:t.points}}adjustAndCalculateSize(t){const e=J(t,this.imgSize,this.aspectRatio);return I({size:e,minSize:this.minSize,maxSize:this.maxSize,aspectRatio:this.aspectRatio})}adjustAndCalculateCoordinate(t,e,i){return{x:t.x-e.width*i.x,y:t.y-e.height*i.y}}}function et(n){n.addEventListener("touchstart",N),n.addEventListener("touchend",N),n.addEventListener("touchmove",N)}function N(n){n.preventDefault();const t=n,e=t.changedTouches[0];e.target.dispatchEvent(new MouseEvent(it(t.type),{bubbles:!0,cancelable:!0,view:window,clientX:e.clientX,clientY:e.clientY,screenX:e.screenX,screenY:e.screenY}))}function it(n){switch(n){case"touchstart":return"mousedown";case"touchmove":return"mousemove";default:return"mouseup"}}class st{constructor(t,e){h(this,"nested",[]);for(let i=0;i<4;i++){const s=C(`${e}-${i}`,t);this.nested.push(s)}}hide(){for(const t of this.nested)t.style.display="none"}show(){for(const t of this.nested)t.style.display="block"}destroy(){for(const t of this.nested)t.remove()}transform(t){const e=t.x+t.width,i=t.y+t.height;this.nested[0].style.height=`${t.y}px`,this.nested[0].style.left=`${t.x}px`,this.nested[0].style.width=`${t.width}px`,this.nested[1].style.left=`${e}px`,this.nested[2].style.left=`${t.x}px`,this.nested[2].style.width=`${t.width}px`,this.nested[2].style.top=`${i}px`,this.nested[3].style.width=`${t.x}px`}}class nt{constructor(t,e,i,s){h(this,"eventBus");h(this,"el");h(this,"startMouse",{mouseX:0,mouseY:0});h(this,"newBoxCreated",!1);h(this,"listener");this.eventBus=i,this.el=C(e,t),s?(this.listener=this.mouseEvent(),this.el.addEventListener("mousedown",this.listener),this.mouseEvent()):this.hide()}hide(){this.el.style.display="none"}show(){this.el.style.display="block"}destroy(){this.listener&&this.el.removeEventListener("mousedown",this.listener),this.el.remove()}mouseEvent(){const t=s=>{s.stopPropagation(),document.addEventListener("mousemove",e),document.addEventListener("mouseup",i),this.startMouse={mouseX:s.clientX,mouseY:s.clientY},this.newBoxCreated=!1},e=s=>{if(s.stopPropagation(),this.newBoxCreated){const o={x:s.clientX,y:s.clientY};this.eventBus({type:"handlemove",data:o})}else this.tryToCreateNewBox(s.clientX,s.clientY)},i=s=>{s.stopPropagation(),document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",i),this.newBoxCreated&&this.eventBus({type:"handleend"})};return t}tryToCreateNewBox(t,e){if(t===this.startMouse.mouseX||e===this.startMouse.mouseY)return;const i=t<this.startMouse.mouseX,s=e<this.startMouse.mouseY,[o,r]=i?[t,this.startMouse.mouseX-t]:[this.startMouse.mouseX,t-this.startMouse.mouseX],[a,c]=s?[e,this.startMouse.mouseY-e]:[this.startMouse.mouseY,e-this.startMouse.mouseY],u={coordinates:{x:o,y:a},size:{width:r,height:c},leftMovable:i,topMovable:s};this.newBoxCreated=this.eventBus({type:"createnewbox",data:u})}}class ot{constructor(t,e,i,s){h(this,"eventBus");h(this,"el");h(this,"enable");h(this,"listener");this.eventBus=i,this.el=C(e,t),this.enable=s,s?(this.listener=this.mouseEvent(),this.el.addEventListener("mousedown",this.listener)):this.el.style.cursor="default"}transform(t){this.el.style.transform=`translate(${t.x}px, ${t.y}px)`,this.el.style.width=`${t.width}px`,this.el.style.height=`${t.height}px`}hide(){this.el.style.display="none",this.el.style.cursor="default"}show(){this.el.style.display="block",this.el.style.cursor="move"}destroy(){this.listener&&this.el.removeEventListener("mousedown",this.listener),this.el.remove()}mouseEvent(){const t=s=>{if(s.stopPropagation(),!this.enable)return;document.addEventListener("mousemove",e),document.addEventListener("mouseup",i);const o={x:s.clientX,y:s.clientY};this.eventBus({type:"regionstart",data:o})},e=s=>{s.stopPropagation();const o={x:s.clientX,y:s.clientY};this.eventBus({type:"regionmove",data:o})},i=s=>{s.stopPropagation(),document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",i);const o={x:s.clientX,y:s.clientY};this.eventBus({type:"regionend",data:o})};return t}}const ht=["real","relative","percent"];var m=(n=>(n.waiting="waiting",n.ready="ready",n.reloading="reloading",n.error="error",n))(m||{});const k=1e-4,rt="cropper";function at(n){return n.charAt(0).toUpperCase()+n.slice(1)}function x(n){return n==null}function w(n,t,e,i=!1){if(x(t))return e;if(typeof t!="number")throw g.new(n,"number");if(Number.isNaN(t))throw g.new(n,"NaN",!1);if(i?t<0:t<=0)throw g.new(n,"positive");return t}function $(n,t,e){if(x(t))return e;if(typeof t!="boolean")throw g.new(n,"boolean");return t}function M(n,t,e){if(x(t))return e;if(typeof t!="string"||!ht.includes(t))throw g.new(n,"SizeUnit");return t}const lt=(n,t)=>{var s,o,r,a,c,u,f,p,z,T,Y,O,V,R,W,U;const e=t||{};if(typeof e!="object"||e===null)throw g.new("options","object");const i=(ft,j)=>{const b=n[`${rt}${at(ft)}`];if(!b)return j;const E=b.toLowerCase();if(E==="null"||E==="undefined"||E==="nil")return j;const F=Number.parseFloat(b);return F.toString()===b?F:E==="true"?!0:E==="false"?!1:b};return{aspectRatio:i("aspectRatio",e.aspectRatio),allowFlip:i("allowFlip",e.allowFlip),allowNewSelection:i("allowNewSelection",e.allowNewSelection),allowMove:i("allowMove",e.allowMove),allowResize:i("allowResize",e.allowResize),returnMode:i("returnMode",e.returnMode),minSize:{width:i("minSizeWidth",(s=e.minSize)==null?void 0:s.width),height:i("minSizeHeight",(o=e.minSize)==null?void 0:o.height),unit:i("minSizeUnit",(r=e.minSize)==null?void 0:r.unit)},maxSize:{width:i("maxSizeWidth",(a=e.maxSize)==null?void 0:a.width),height:i("maxSizeHeight",(c=e.maxSize)==null?void 0:c.height),unit:i("maxSizeUnit",(u=e.maxSize)==null?void 0:u.unit)},startSize:{x:i("startSizeX",(f=e.startSize)==null?void 0:f.x),y:i("startSizeY",(p=e.startSize)==null?void 0:p.y),width:i("startSizeWidth",(z=e.startSize)==null?void 0:z.width),height:i("startSizeHeight",(T=e.startSize)==null?void 0:T.height),unit:i("startSizeUnit",(Y=e.startSize)==null?void 0:Y.unit)},defaultSize:{x:i("defaultSizeX",(O=e.defaultSize)==null?void 0:O.x),y:i("defaultSizeY",(V=e.defaultSize)==null?void 0:V.y),width:i("defaultSizeWidth",(R=e.defaultSize)==null?void 0:R.width),height:i("defaultSizeHeight",(W=e.defaultSize)==null?void 0:W.height),unit:i("defaultSizeUnit",(U=e.defaultSize)==null?void 0:U.unit)}}},A=(n,t,e)=>Math.abs(n-t)<e,dt=n=>{var r;const t=w("aspectRatio",n.aspectRatio,0),e={width:w("minSizeWidth",n.minSize.width,0),height:w("minSizeHeight",n.minSize.height,0),unit:M("minSizeUnit",(r=n.minSize)==null?void 0:r.unit,"real")},i={width:w("maxSizeWidth",n.maxSize.width,0),height:w("maxSizeHeight",n.maxSize.height,0),unit:M("maxSizeUnit",n.maxSize.unit,"real")},s={x:w("startSizeX",n.startSize.x,0,!0),y:w("startSizeY",n.startSize.y,0,!0),width:w("startSizeWidth",n.startSize.width,0),height:w("startSizeHeight",n.startSize.height,0),unit:M("startSizeUnit",n.startSize.unit,"real"),centeredX:x(n.startSize.x),centeredY:x(n.startSize.y),allowChange:!1};s.allowChange=s.width===0&&s.height===0;const o={x:w("defaultSizeX",n.defaultSize.x,0,!0),y:w("defaultSizeY",n.defaultSize.y,0,!0),width:w("defaultSizeWidth",n.defaultSize.width,0),height:w("defaultSizeHeight",n.defaultSize.height,0),unit:M("defaultSizeUnit",n.defaultSize.unit,"real"),centeredX:x(n.defaultSize.x),centeredY:x(n.defaultSize.y),allowChange:!1};if(o.allowChange=o.width===0&&o.height===0,t){if(e.width&&e.height){const a=e.width/e.height;if(!A(a,t,k))throw g.aspectRatio(a,t,k)}if(s.width&&s.height){const a=s.width/s.height;if(!A(a,t,k))throw g.aspectRatio(a,t,k)}}return{aspectRatio:t,allowFlip:$("allowFlip",n.allowFlip,!0),allowNewSelection:$("allowNewSelection",n.allowNewSelection,!0),allowMove:$("allowMove",n.allowMove,!0),allowResize:$("allowResize",n.allowResize,!0),returnMode:M("returnMode",n.returnMode,"real"),minSize:e,maxSize:i,firstInitSize:s,startSize:o}};class ct{constructor(t,e,i,s,o){h(this,"position");h(this,"eventBus");h(this,"el");h(this,"enable");h(this,"listener");this.position=i.position,this.eventBus=s,this.enable=o,this.el=C(e,t),this.el.style.cursor=i.cursor,o?(this.listener=this.mouseEvent(),this.el.addEventListener("mousedown",this.listener)):this.hide()}show(){this.el.style.display="block"}hide(){this.el.style.display="none"}destroy(){this.listener&&this.el.removeEventListener("mousedown",this.listener),this.el.remove()}transform(t){const e=this.el.offsetWidth,i=this.el.offsetHeight,s=t.x+t.width*this.position.x-e/2,o=t.y+t.height*this.position.y-i/2;this.el.style.transform=`translate(${s}px, ${o}px)`}getData(){return{points:{...this.position}}}mouseEvent(){const t=s=>{if(s.stopPropagation(),!this.enable)return;document.addEventListener("mousemove",e),document.addEventListener("mouseup",i);const o=this.getData();this.eventBus({type:"handlestart",data:o})},e=s=>{s.stopPropagation();const o={x:s.clientX,y:s.clientY};this.eventBus({type:"handlemove",data:o})},i=s=>{s.stopPropagation(),document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",i),this.eventBus({type:"handleend"})};return t}}const ut=[{position:{x:0,y:0},cursor:"nw-resize"},{position:{x:.5,y:0},cursor:"n-resize"},{position:{x:1,y:0},cursor:"ne-resize"},{position:{x:1,y:.5},cursor:"e-resize"},{position:{x:1,y:1},cursor:"se-resize"},{position:{x:.5,y:1},cursor:"s-resize"},{position:{x:0,y:1},cursor:"sw-resize"},{position:{x:0,y:.5},cursor:"w-resize"}];class wt{constructor(t,e,i,s,o){h(this,"el");h(this,"handles",[]);this.el=C(e,t);for(const r of ut){const a=new ct(this.el,o,r,i,s);this.handles.push(a)}}hide(){for(const t of this.handles)t.hide()}show(){for(const t of this.handles)t.show()}destroy(){for(const t of this.handles)t.destroy();this.el.remove()}transform(t){for(const e of this.handles)e.transform(t)}handleByMovableType(t,e){return t?e?this.handles[0]:this.handles[6]:e?this.handles[2]:this.handles[4]}}const X={width:1,height:1};class gt{constructor(t,e){h(this,"htmlContainer");h(this,"htmlImg");h(this,"options");h(this,"newSelection");h(this,"selection");h(this,"handles");h(this,"background");h(this,"box");h(this,"currentMove");h(this,"activeHandle");h(this,"real",X);h(this,"relative",X);h(this,"ratio",X);h(this,"firstInit",!0);h(this,"isDomCreated",!1);h(this,"status",m.waiting);h(this,"eventBus",this.event.bind(this));h(this,"observer");h(this,"callbacks",{onInitialize:void 0,onCropStart:void 0,onCropMove:void 0,onCropEnd:void 0,onError:void 0});try{this.parseCallbackFunctions(e);const i=_(t);this.htmlImg=i[0],this.htmlContainer=i[1],this.changeStatus(m.waiting);const s=lt(this.htmlImg.dataset,e);this.options=dt(s),this.initializeCropper()}catch(i){if(i instanceof y||i instanceof g)this.onErrorCallback(i);else throw i}}getImagePreview(){if(this.status!=="ready")return;const t=document.createElement("canvas");t.setAttribute("crossorigin","anonymous");const e=t.getContext("2d");if(!e)return;const i=this.getValue("real");return t.width=i.width,t.height=i.height,e.drawImage(this.htmlImg,i.x,i.y,i.width,i.height,0,0,i.width,i.height),t}setImage(t){this.htmlImg.src=t}reset(){try{this.destroy(),this.initialize()}catch(t){if(t instanceof y||t instanceof g||t instanceof S)this.onErrorCallback(t);else throw t}}destroy(){this.isDomCreated&&(this.newSelection.destroy(),this.handles.destroy(),this.selection.destroy(),this.background.destroy()),this.isDomCreated=!1}moveTo(t){this.box.move(t),this.redraw(),this.onCropEndCallback()}resizeTo(t,e={x:.5,y:.5}){this.box.resize(t,e),this.redraw(),this.onCropEndCallback()}scaleBy(t,e={x:.5,y:.5}){this.box.scale(t,e),this.redraw(),this.onCropEndCallback()}onInitializeCallback(){this.callbacks.onInitialize&&this.callbacks.onInitialize(this,this.getValue())}onCropStartCallback(){this.callbacks.onCropStart&&this.callbacks.onCropStart(this,this.getValue())}onCropMoveCallback(){this.callbacks.onCropMove&&this.callbacks.onCropMove(this,this.getValue())}onCropEndCallback(){const t=this.getValue();this.setDatasetCropValues(t),this.callbacks.onCropEnd&&this.callbacks.onCropEnd(this,t)}onErrorCallback(t){this.changeStatus(m.error);const e={type:t.name,message:t.message,data:t.data};if(this.destroy(),this.callbacks.onError)this.callbacks.onError(this,e);else throw t}getValue(t=void 0){const e=t||this.options.returnMode,s=e==="relative"?this.box.getValueRelative(this.ratio):e==="percent"?this.box.getValuePercent():this.box.getValueReal();return{x:Math.round(s.x),y:Math.round(s.y),width:Math.round(s.width),height:Math.round(s.height)}}initializeObserver(){this.observer=new ResizeObserver(t=>{for(const e of t){const i=e.target;i===this.htmlImg&&i.complete&&i.width!==0&&(this.updateRelativeSize(),this.redraw())}})}initializeCropper(){this.initializeObserver(),this.htmlImg.width!==0&&this.htmlImg.height!==0&&this.initialize(),this.htmlImg.onload=()=>{this.changeStatus(this.status===m.waiting?m.waiting:m.reloading),this.observer.unobserve(this.htmlImg),this.initialize()}}initialize(){try{this.createDOM(),this.calcContainerProps(),this.updateRelativeSize(),this.createNewBox(),this.onInitializeCallback(),this.observer.observe(this.htmlImg),this.changeStatus(m.ready),this.onCropEndCallback()}catch(t){if(t instanceof S)this.onErrorCallback(t);else throw t}}createDOM(){if(this.isDomCreated)return;const t=this.htmlContainer;et(t),this.htmlImg.classList.add(l.img),this.background=new st(t,l.background),this.newSelection=new nt(t,l.new,this.eventBus,this.options.allowNewSelection),this.selection=new ot(t,l.selection,this.eventBus,this.options.allowMove),this.handles=new wt(t,l.hanleds,this.eventBus,this.options.allowResize,l.handle),this.isDomCreated=!0}calcContainerProps(){this.real={width:this.htmlImg.naturalWidth,height:this.htmlImg.naturalHeight}}createNewBox(){let t=this.options.startSize;this.firstInit&&(this.firstInit=!1,t=this.options.firstInitSize);const e={x:t.centeredX,y:t.centeredX},i=t.allowChange,s=q(t,this.options.minSize,this.options.maxSize,this.real,this.ratio),o=Z(s,this.real,this.options.aspectRatio,i,e);G(o),this.box=new tt(o)}updateRelativeSize(){const{width:t,height:e}=this.htmlImg.getBoundingClientRect();this.htmlImg.offsetWidth===0||this.htmlImg.offsetHeight===0?this.relative={width:this.real.width,height:this.real.height}:this.relative={width:t,height:e},this.ratio={width:this.relative.width/this.real.width,height:this.relative.height/this.real.height}}changeStatus(t){this.status=t,this.htmlImg&&this.setDataset(l.valueStatus,t)}redraw(){const t=this.box.getValueRelative(this.ratio);this.selection.transform(t),this.background.transform(t),this.handles.transform(t)}event({type:t,data:e}){switch(t){case"handlestart":this.onHandleMoveStart(e);break;case"handlemove":this.onHandleMoveMoving(e);break;case"handleend":this.onHandleMoveEnd();break;case"regionstart":this.onRegionMoveStart(e);break;case"regionmove":this.onRegionMoveMoving(e);break;case"regionend":this.onRegionMoveEnd();break;case"createnewbox":return this.tryToCreateNewBox(e)}return!0}tryToCreateNewBox({coordinates:t,size:e,leftMovable:i,topMovable:s}){const o=this.handles.handleByMovableType(i,s).getData(),a={coordinates:this.mouseCoordinates(t),size:e,points:o.points};return this.box.prepareAndApplyNewSizeAndCoordinates(a)?(this.redraw(),this.onHandleMoveStart(o),!0):!1}onHandleMoveStart(t){const{x:e,y:i}=this.box.getOppositeCornerCoordinates(t.points);this.activeHandle={x:{left:t.points.x===0,savedCoordinate:e},y:{left:t.points.y===0,savedCoordinate:i}},this.onCropStartCallback()}onHandleMoveMoving(t){const e=this.mouseCoordinates(t),i=P(e,this.activeHandle.x,this.activeHandle.y);!this.options.allowFlip&&(i.flipped.x||i.flipped.y)||(this.box.prepareAndApplyNewSizeAndCoordinates(i.newBox)&&this.redraw(),this.onCropMoveCallback())}onHandleMoveEnd(){this.onCropEndCallback()}onRegionMoveStart(t){const{x:e,y:i}=this.mouseCoordinates(t),s=this.box.getCoourdinates();this.currentMove={offsetX:e-s.x,offsetY:i-s.y},this.onCropStartCallback()}onRegionMoveMoving(t){const{offsetX:e,offsetY:i}=this.currentMove,{x:s,y:o}=this.mouseCoordinates(t);this.box.move({x:s-e,y:o-i}),this.redraw(),this.onCropMoveCallback()}onRegionMoveEnd(){this.onCropEndCallback()}mouseCoordinates(t){const e=this.htmlImg.getBoundingClientRect();let i=t.x-e.left,s=t.y-e.top;return i=Math.min(Math.max(i,0),this.relative.width)/this.ratio.width,s=Math.min(Math.max(s,0),this.relative.height)/this.ratio.height,{x:i,y:s}}setDataset(t,e){this.htmlImg.dataset[t]=e.toString()}parseCallbackFunctions(t){t&&(t.onError&&typeof t.onError=="function"&&(this.callbacks.onError=t.onError),t.onInitialize&&typeof t.onInitialize=="function"&&(this.callbacks.onInitialize=t.onInitialize),t.onCropStart&&typeof t.onCropStart=="function"&&(this.callbacks.onCropStart=t.onCropStart),t.onCropMove&&typeof t.onCropMove=="function"&&(this.callbacks.onCropMove=t.onCropMove),t.onCropEnd&&typeof t.onCropEnd=="function"&&(this.callbacks.onCropEnd=t.onCropEnd))}setDatasetCropValues(t){const e=t||this.getValue();this.setDataset(l.valueX,e.x),this.setDataset(l.valueY,e.y),this.setDataset(l.valueWidth,e.width),this.setDataset(l.valueHeight,e.height)}}return gt});
//# sourceMappingURL=trueCropper.js.map
