var trueCropper=function(){"use strict";var ft=Object.defineProperty;var pt=(c,l,v)=>l in c?ft(c,l,{enumerable:!0,configurable:!0,writable:!0,value:v}):c[l]=v;var o=(c,l,v)=>(pt(c,typeof l!="symbol"?l+"":l,v),v);const c="truecropper",l={base:c,img:`${c}__image`,background:`${c}__background`,new:`${c}__new-selection`,selection:`${c}__selection`,handle:`${c}__handle`,hanleds:`${c}__handles`,valueX:`${c}X`,valueY:`${c}Y`,valueWidth:`${c}Width`,valueHeight:`${c}Height`,valueStatus:`${c}Status`},v={elementNotFound:{text:"Unable to find element",id:0},srcEmpty:{text:"Image src not provided",id:1},parentNotContainDiv:{text:"Parent element can be exists",id:2}};class y extends Error{constructor(e){const i=v[e];super(i.text);o(this,"data");o(this,"messageId");Object.setPrototypeOf(this,y.prototype),this.name="TrueCropperHtmlError",this.data={},this.messageId=i.id}}class S extends Error{constructor(e,i,s){super(e);o(this,"data");o(this,"messageId");Object.setPrototypeOf(this,S.prototype),this.name="TrueCropperImageError",this.data={target:i.target,targetCoordinates:i.coordinates?{...i.coordinates}:void 0,targetSize:{...i.targetSize},source:i.source,sourceSize:{...i.sourceSize}},this.messageId=s}static startSize(e,i,s,h,r){const a=`The ${e} (${i.x}x${i.y}:${s.width}x${s.height}) exceeds the ${h} (${r.width}x${r.height})`,d={target:e,coordinates:i,targetSize:s,source:h,sourceSize:r};return new this(a,d,6)}static size(e,i,s,h){const r=`The ${e} (${i.width}x${i.height}) exceeds the ${s} (${h.width}x${h.height})`,a={target:e,coordinates:void 0,targetSize:i,source:s,sourceSize:h};return new this(r,a,7)}}class g extends Error{constructor(e,i,s=0){super(e);o(this,"data");o(this,"messageId");Object.setPrototypeOf(this,g.prototype),this.name="TrueCropperOptionsError",this.data=i,this.messageId=s}static aspectRatio(e,i,s,h){const r=`The specified aspect ratio (${s}) and calculated ${e} dimensions (width/height = ${i}) are greater than (${h}). This might be due to a rounding error on the server side or incorrect minimum sizes.`;return new this(r,{name:e},5)}static new(e,i,s=!0){const h=s?3:4,r=s?`${e} must be ${i}`:`${e} must not be ${i}`;return new this(r,{name:e,object:i},h)}}const _=n=>{let t=null;if(typeof n=="string"){if(t=document.querySelector(n),t===null)throw new y("elementNotFound")}else t=n;if(!(t instanceof HTMLImageElement))throw new y("srcEmpty");let e=t.parentElement;if(!e)throw new y("parentNotContainDiv");return e.classList.contains(l.base)||(e=null),[t,e]},M=(n,t=void 0)=>{const e=document.createElement("div");return e.className=n,t&&t.appendChild(e),e},X=(n,t)=>{if(t.savedCoordinate<0)return{flipped:!1,coordinate:null,size:null,point:.5};const e=n<t.savedCoordinate,i=t.left!==e,s=t.savedCoordinate,h=Math.abs(t.savedCoordinate-n),r=Number(e);return{flipped:i,coordinate:s,size:h,point:r}},P=(n,t,e)=>{const i=X(n.x,t),s=X(n.y,e);return{flipped:{x:i.flipped,y:s.flipped},newBox:{coordinates:{x:i.coordinate,y:s.coordinate},size:{width:i.size,height:s.size},points:{x:i.point,y:s.point}}}},q=(n,t,e,i,s)=>{const h=(m,p,z)=>z==="relative"?m*s[p]:z==="percent"?m>=1?i[p]*(m/100):i[p]*m:m,r={width:h(t.width,"width",t.unit),height:h(t.height,"height",t.unit)},a={width:h(e.width,"width",e.unit),height:h(e.height,"height",e.unit)},d={x:h(n.x,"width",n.unit),y:h(n.y,"height",n.unit)},u={width:h(n.width,"width",n.unit),height:h(n.height,"height",n.unit)};return{coordinates:d,size:u,minSize:r,maxSize:a}},Z=(n,t,e,i,s)=>{const h=B(n.minSize,{width:1,height:1},e);let r=B(n.maxSize,t,e),a=B(n.size,t,e);r=K(r,t,e);let d=n.coordinates;if(i){const u=Q(d,a,h,r,t,e,s.x,s.y);d=u.coordinates,a=u.size}return{coordinates:d,size:a,minSize:h,maxSize:r,imgProps:t,aspectRatio:e}},G=({coordinates:n,minSize:t,maxSize:e,size:i,imgProps:s})=>{const h=(r,a,d,u)=>{if(r.width>a.width||r.height>a.height)throw S.size(d,r,u,a)};if(h(t,s,"minSize","imageSize"),h(t,e,"minSize","maxSize"),h(t,i,"minSize","startSize"),n.x+i.width>s.width||n.y+i.height>s.height)throw S.startSize("startSize",n,i,"imageSize",s)},$=({size:n,minSize:t,maxSize:e,aspectRatio:i})=>{const s={...n};return e&&(s.width>e.width&&(s.width=e.width,s.height=i?e.width/i:s.height),s.height>e.height&&(s.width=i?e.height*i:s.width,s.height=e.height)),t&&(s.width<t.width&&(s.width=t.width,s.height=i?t.width/i:s.height),s.height<t.height&&(s.width=i?t.height*i:s.width,s.height=t.height)),s},A=(n,t,e)=>{const i=n*t;return{width:i,height:i/e}},H=(n,t,e)=>{const i=n*t;return{width:i*e,height:i}},J=(n,t,e)=>{let i={...n.size};if(e===0)return i;const s=n.isMultuAxis?i.height*e>=i.width:n.isVerticalMovement,h=n.points.x===1||n.points.x===0?1:2,r=n.points.y===1||n.points.y===0?1:2;return s?i={width:i.height*e,height:i.height}:i={width:i.width,height:i.width/e},n.coordinates.x+i.width*(1-n.points.x)>t.width&&(i=A(t.width-n.coordinates.x,h,e)),n.coordinates.y+i.height*(1-n.points.y)>t.height&&(i=H(t.height-n.coordinates.y,r,e)),n.coordinates.x-i.width*n.points.x<0&&(i=A(n.coordinates.x,h,e)),n.coordinates.y-i.height*n.points.y<0&&(i=H(n.coordinates.y,r,e)),i},B=(n,t,e)=>{const i={...n};return e&&!i.width&&!i.height&&(e>1?i.height=t.height:i.width=t.width),i.width||(i.width=e?i.height*e:t.width),i.height||(i.height=e?i.width/e:t.height),i},K=(n,t,e)=>{let i={...n};return e&&(i.width>i.height*e?i.width=i.height*e:i.height=i.width/e),i=$({size:i,maxSize:t,aspectRatio:e}),i},Q=(n,t,e,i,s,h,r,a)=>{const d={...t},u={...n},m=Math.min(i.width,s.width-n.x),p=Math.min(i.height,s.height-n.y),z=$({size:d,maxSize:{width:m,height:p},minSize:e,aspectRatio:h});return d.width=z.width,d.height=z.height,u.x=r?(s.width-d.width)/2:n.x,u.y=a?(s.height-d.height)/2:n.y,{coordinates:u,size:d}};class tt{constructor({coordinates:t,size:e,minSize:i,maxSize:s,imgProps:h,aspectRatio:r}){o(this,"coordinates");o(this,"size");o(this,"minSize");o(this,"maxSize");o(this,"imgSize");o(this,"aspectRatio");this.coordinates={...t},this.size={...e},this.minSize={...i},this.maxSize={...s},this.imgSize={...h},this.aspectRatio=r}setValue(t){this.coordinates={x:t.x,y:t.y},this.size={width:t.width,height:t.height}}move(t){this.coordinates.x=Math.min(Math.max(t.x,0),this.imgSize.width-this.size.width),this.coordinates.y=Math.min(Math.max(t.y,0),this.imgSize.height-this.size.height)}resize(t,e){const i=this.coordinates.x+this.size.width*e.x,s=this.coordinates.y+this.size.height*e.y;this.coordinates={x:i-t.width*e.x,y:s-t.height*e.y},this.size={width:t.width,height:t.height}}scale(t,e){const i=this.size.width*t,s=this.size.height*t;this.resize({width:i,height:s},e)}getCoourdinates(){return{x:this.coordinates.x,y:this.coordinates.y}}getValue(){return{x:this.coordinates.x,y:this.coordinates.y,width:this.size.width,height:this.size.height}}getValueReal(){return this.getValue()}getValueRelative({width:t,height:e}){return{x:this.coordinates.x*t,y:this.coordinates.y*e,width:this.size.width*t,height:this.size.height*e}}getValuePercent(){return{x:this.coordinates.x/this.imgSize.width*100,y:this.coordinates.y/this.imgSize.height*100,width:this.size.width/this.imgSize.width*100,height:this.size.height/this.imgSize.height*100}}getOppositeCornerCoordinates(t){const e=t.x===.5?-1:this.coordinates.x+this.size.width*(1-t.x),i=t.y===.5?-1:this.coordinates.y+this.size.height*(1-t.y);return{x:e,y:i}}prepareAndApplyNewSizeAndCoordinates(t){const e=this.prepareSizeAndCoordinates(t);return e.size.width===0||e.size.height===0?!1:(this.size=this.adjustAndCalculateSize(e),this.coordinates=this.adjustAndCalculateCoordinate(e.coordinates,this.size,e.points),!0)}prepareSizeAndCoordinates(t){const e={width:t.size.width??this.size.width,height:t.size.height??this.size.height},i={x:t.coordinates.x??this.coordinates.x+this.size.width/2,y:t.coordinates.y??this.coordinates.y+this.size.height/2},s=t.coordinates.y!==null,h=s&&t.coordinates.x!==null;return{size:e,coordinates:i,isVerticalMovement:s,isMultuAxis:h,points:t.points}}adjustAndCalculateSize(t){const e=J(t,this.imgSize,this.aspectRatio);return $({size:e,minSize:this.minSize,maxSize:this.maxSize,aspectRatio:this.aspectRatio})}adjustAndCalculateCoordinate(t,e,i){return{x:t.x-e.width*i.x,y:t.y-e.height*i.y}}}function et(n){n.addEventListener("touchstart",N),n.addEventListener("touchend",N),n.addEventListener("touchmove",N)}function N(n){n.preventDefault();const t=n,e=t.changedTouches[0];e.target.dispatchEvent(new MouseEvent(it(t.type),{bubbles:!0,cancelable:!0,view:window,clientX:e.clientX,clientY:e.clientY,screenX:e.screenX,screenY:e.screenY}))}function it(n){switch(n){case"touchstart":return"mousedown";case"touchmove":return"mousemove";default:return"mouseup"}}class st{constructor(t,e){o(this,"nested",[]);for(let i=0;i<4;i++){const s=M(`${e}-${i}`,t);this.nested.push(s)}}hide(){for(const t of this.nested)t.style.display="none"}show(){for(const t of this.nested)t.style.display="block"}destroy(){for(const t of this.nested)t.remove()}transform(t){const e=t.x+t.width,i=t.y+t.height;this.nested[0].style.height=`${t.y}px`,this.nested[0].style.left=`${t.x}px`,this.nested[0].style.width=`${t.width}px`,this.nested[1].style.left=`${e}px`,this.nested[2].style.left=`${t.x}px`,this.nested[2].style.width=`${t.width}px`,this.nested[2].style.top=`${i}px`,this.nested[3].style.width=`${t.x}px`}}class nt{constructor(t,e,i,s){o(this,"eventBus");o(this,"el");o(this,"startMouse",{mouseX:0,mouseY:0});o(this,"newBoxCreated",!1);o(this,"listener");this.eventBus=i,this.el=M(e,t),s?(this.listener=this.mouseEvent(),this.el.addEventListener("mousedown",this.listener),this.mouseEvent()):this.hide()}hide(){this.el.style.display="none"}show(){this.el.style.display="block"}destroy(){this.listener&&this.el.removeEventListener("mousedown",this.listener),this.el.remove()}mouseEvent(){const t=s=>{s.stopPropagation(),document.addEventListener("mousemove",e),document.addEventListener("mouseup",i),this.startMouse={mouseX:s.clientX,mouseY:s.clientY},this.newBoxCreated=!1},e=s=>{if(s.stopPropagation(),this.newBoxCreated){const h={x:s.clientX,y:s.clientY};this.eventBus({type:"handlemove",data:h})}else this.tryToCreateNewBox(s.clientX,s.clientY)},i=s=>{s.stopPropagation(),document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",i),this.newBoxCreated&&this.eventBus({type:"handleend"})};return t}tryToCreateNewBox(t,e){if(t===this.startMouse.mouseX||e===this.startMouse.mouseY)return;const i=t<this.startMouse.mouseX,s=e<this.startMouse.mouseY,[h,r]=i?[t,this.startMouse.mouseX-t]:[this.startMouse.mouseX,t-this.startMouse.mouseX],[a,d]=s?[e,this.startMouse.mouseY-e]:[this.startMouse.mouseY,e-this.startMouse.mouseY],u={coordinates:{x:h,y:a},size:{width:r,height:d},leftMovable:i,topMovable:s};this.newBoxCreated=this.eventBus({type:"createnewbox",data:u})}}class ht{constructor(t,e,i,s){o(this,"eventBus");o(this,"el");o(this,"enable");o(this,"listener");this.eventBus=i,this.el=M(e,t),this.enable=s,s?(this.listener=this.mouseEvent(),this.el.addEventListener("mousedown",this.listener)):this.el.style.cursor="default"}transform(t){this.el.style.transform=`translate(${t.x}px, ${t.y}px)`,this.el.style.width=`${t.width}px`,this.el.style.height=`${t.height}px`}hide(){this.el.style.display="none",this.el.style.cursor="default"}show(){this.el.style.display="block",this.el.style.cursor="move"}destroy(){this.listener&&this.el.removeEventListener("mousedown",this.listener),this.el.remove()}mouseEvent(){const t=s=>{if(s.stopPropagation(),!this.enable)return;document.addEventListener("mousemove",e),document.addEventListener("mouseup",i);const h={x:s.clientX,y:s.clientY};this.eventBus({type:"regionstart",data:h})},e=s=>{s.stopPropagation();const h={x:s.clientX,y:s.clientY};this.eventBus({type:"regionmove",data:h})},i=s=>{s.stopPropagation(),document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",i);const h={x:s.clientX,y:s.clientY};this.eventBus({type:"regionend",data:h})};return t}}const ot=["real","relative","percent"];var f=(n=>(n.waiting="waiting",n.ready="ready",n.reloading="reloading",n.error="error",n))(f||{});const C=1e-4,rt=l.base;function at(n){return n.charAt(0).toUpperCase()+n.slice(1)}function x(n){return n==null}function w(n,t,e,i=!1){if(x(t))return e;if(typeof t!="number")throw g.new(n,"number");if(Number.isNaN(t))throw g.new(n,"NaN",!1);if(i?t<0:t<=0)throw g.new(n,"positive");return t}function k(n,t,e){if(x(t))return e;if(typeof t!="boolean")throw g.new(n,"boolean");return t}function b(n,t,e){if(x(t))return e;if(typeof t!="string"||!ot.includes(t))throw g.new(n,"SizeUnit");return t}const lt=(n,t)=>{var s,h,r,a,d,u,m,p,z,Y,T,O,V,R,W,U;const e=t||{};if(typeof e!="object"||e===null)throw g.new("options","object");const i=(mt,F)=>{const E=n[`${rt}${at(mt)}`];if(!E)return F;const I=E.toLowerCase();if(I==="null"||I==="undefined"||I==="nil")return F;const j=Number.parseFloat(E);return j.toString()===E?j:I==="true"?!0:I==="false"?!1:E};return{aspectRatio:i("aspectRatio",e.aspectRatio),allowFlip:i("allowFlip",e.allowFlip),allowNewSelection:i("allowNewSelection",e.allowNewSelection),allowMove:i("allowMove",e.allowMove),allowResize:i("allowResize",e.allowResize),returnMode:i("returnMode",e.returnMode),minSize:{width:i("minSizeWidth",(s=e.minSize)==null?void 0:s.width),height:i("minSizeHeight",(h=e.minSize)==null?void 0:h.height),unit:i("minSizeUnit",(r=e.minSize)==null?void 0:r.unit)},maxSize:{width:i("maxSizeWidth",(a=e.maxSize)==null?void 0:a.width),height:i("maxSizeHeight",(d=e.maxSize)==null?void 0:d.height),unit:i("maxSizeUnit",(u=e.maxSize)==null?void 0:u.unit)},startSize:{x:i("startSizeX",(m=e.startSize)==null?void 0:m.x),y:i("startSizeY",(p=e.startSize)==null?void 0:p.y),width:i("startSizeWidth",(z=e.startSize)==null?void 0:z.width),height:i("startSizeHeight",(Y=e.startSize)==null?void 0:Y.height),unit:i("startSizeUnit",(T=e.startSize)==null?void 0:T.unit)},defaultSize:{x:i("defaultSizeX",(O=e.defaultSize)==null?void 0:O.x),y:i("defaultSizeY",(V=e.defaultSize)==null?void 0:V.y),width:i("defaultSizeWidth",(R=e.defaultSize)==null?void 0:R.width),height:i("defaultSizeHeight",(W=e.defaultSize)==null?void 0:W.height),unit:i("defaultSizeUnit",(U=e.defaultSize)==null?void 0:U.unit)}}},D=(n,t,e)=>Math.abs(n-t)<e,dt=n=>{var r;const t=w("aspectRatio",n.aspectRatio,0),e={width:w("minSizeWidth",n.minSize.width,0),height:w("minSizeHeight",n.minSize.height,0),unit:b("minSizeUnit",(r=n.minSize)==null?void 0:r.unit,"real")},i={width:w("maxSizeWidth",n.maxSize.width,0),height:w("maxSizeHeight",n.maxSize.height,0),unit:b("maxSizeUnit",n.maxSize.unit,"real")},s={x:w("startSizeX",n.startSize.x,0,!0),y:w("startSizeY",n.startSize.y,0,!0),width:w("startSizeWidth",n.startSize.width,0),height:w("startSizeHeight",n.startSize.height,0),unit:b("startSizeUnit",n.startSize.unit,"real"),centeredX:x(n.startSize.x),centeredY:x(n.startSize.y),allowChange:!1};s.allowChange=s.width===0&&s.height===0;const h={x:w("defaultSizeX",n.defaultSize.x,0,!0),y:w("defaultSizeY",n.defaultSize.y,0,!0),width:w("defaultSizeWidth",n.defaultSize.width,0),height:w("defaultSizeHeight",n.defaultSize.height,0),unit:b("defaultSizeUnit",n.defaultSize.unit,"real"),centeredX:x(n.defaultSize.x),centeredY:x(n.defaultSize.y),allowChange:!1};if(h.allowChange=h.width===0&&h.height===0,t){if(e.width&&e.height){const a=e.width/e.height;if(!D(a,t,C))throw g.aspectRatio("minimum",a,t,C)}if(s.width&&s.height){const a=s.width/s.height;if(!D(a,t,C))throw g.aspectRatio("startSize",a,t,C)}if(h.width&&h.height){const a=h.width/h.height;if(!D(a,t,C))throw g.aspectRatio("defaultSize",a,t,C)}}return{aspectRatio:t,allowFlip:k("allowFlip",n.allowFlip,!0),allowNewSelection:k("allowNewSelection",n.allowNewSelection,!0),allowMove:k("allowMove",n.allowMove,!0),allowResize:k("allowResize",n.allowResize,!0),returnMode:b("returnMode",n.returnMode,"real"),minSize:e,maxSize:i,firstInitSize:s,startSize:h}};class ct{constructor(t,e,i,s,h){o(this,"position");o(this,"eventBus");o(this,"el");o(this,"enable");o(this,"listener");this.position=i.position,this.eventBus=s,this.enable=h,this.el=M(e,t),this.el.style.cursor=i.cursor,h?(this.listener=this.mouseEvent(),this.el.addEventListener("mousedown",this.listener)):this.hide()}show(){this.el.style.display="block"}hide(){this.el.style.display="none"}destroy(){this.listener&&this.el.removeEventListener("mousedown",this.listener),this.el.remove()}transform(t){const e=this.el.offsetWidth,i=this.el.offsetHeight,s=t.x+t.width*this.position.x-e/2,h=t.y+t.height*this.position.y-i/2;this.el.style.transform=`translate(${s}px, ${h}px)`}getData(){return{points:{...this.position}}}mouseEvent(){const t=s=>{if(s.stopPropagation(),!this.enable)return;document.addEventListener("mousemove",e),document.addEventListener("mouseup",i);const h=this.getData();this.eventBus({type:"handlestart",data:h})},e=s=>{s.stopPropagation();const h={x:s.clientX,y:s.clientY};this.eventBus({type:"handlemove",data:h})},i=s=>{s.stopPropagation(),document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",i),this.eventBus({type:"handleend"})};return t}}const ut=[{position:{x:0,y:0},cursor:"nw-resize"},{position:{x:.5,y:0},cursor:"n-resize"},{position:{x:1,y:0},cursor:"ne-resize"},{position:{x:1,y:.5},cursor:"e-resize"},{position:{x:1,y:1},cursor:"se-resize"},{position:{x:.5,y:1},cursor:"s-resize"},{position:{x:0,y:1},cursor:"sw-resize"},{position:{x:0,y:.5},cursor:"w-resize"}];class gt{constructor(t,e,i,s,h){o(this,"el");o(this,"handles",[]);this.el=M(e,t);for(const r of ut){const a=new ct(this.el,h,r,i,s);this.handles.push(a)}}hide(){for(const t of this.handles)t.hide()}show(){for(const t of this.handles)t.show()}destroy(){for(const t of this.handles)t.destroy();this.el.remove()}transform(t){for(const e of this.handles)e.transform(t)}handleByMovableType(t,e){return t?e?this.handles[0]:this.handles[6]:e?this.handles[2]:this.handles[4]}}const L={width:0,height:0};class wt{constructor(t,e){o(this,"replaceDOM",!1);o(this,"htmlContainer");o(this,"htmlImg");o(this,"options");o(this,"newSelection");o(this,"selection");o(this,"handles");o(this,"background");o(this,"box");o(this,"currentMove");o(this,"activeHandle");o(this,"real",L);o(this,"relative",L);o(this,"ratio",L);o(this,"firstInit",!0);o(this,"isDomCreated",!1);o(this,"status",f.waiting);o(this,"eventBus",this.event.bind(this));o(this,"observer");o(this,"callbacks",{onInitialize:void 0,onCropStart:void 0,onCropMove:void 0,onCropEnd:void 0,onError:void 0});try{this.parseCallbackFunctions(e);const[i,s]=_(t);this.htmlImg=i,s?this.htmlContainer=s:this.replaceDOM=!0,this.changeStatus(f.waiting);const h=lt(this.htmlImg.dataset,e);this.options=dt(h),this.initializeCropper()}catch(i){if(i instanceof y||i instanceof g)this.onErrorCallback(i);else throw i}}getImagePreview(){if(this.status!=="ready")return;const t=document.createElement("canvas");t.setAttribute("crossorigin","anonymous");const e=t.getContext("2d");if(!e)return;const i=this.getValue("real");return t.width=i.width,t.height=i.height,e.drawImage(this.htmlImg,i.x,i.y,i.width,i.height,0,0,i.width,i.height),t}setImage(t){t&&t.length!==0&&(this.firstInit=!1,this.htmlImg.src=t)}reset(){try{this.firstInit=!1,this.destroy(),this.initializeCropper()}catch(t){if(t instanceof y||t instanceof g||t instanceof S)this.onErrorCallback(t);else throw t}}destroy(){this.isDomCreated&&(this.observer.unobserve(this.htmlImg),this.newSelection.destroy(),this.handles.destroy(),this.selection.destroy(),this.background.destroy(),this.replaceDOM&&this.htmlContainer.parentElement&&this.htmlContainer.parentElement.replaceChild(this.htmlImg,this.htmlContainer)),this.isDomCreated=!1}moveTo(t){this.box.move(t),this.redraw(),this.onCropEndCallback()}resizeTo(t,e={x:.5,y:.5}){this.box.resize(t,e),this.redraw(),this.onCropEndCallback()}scaleBy(t,e={x:.5,y:.5}){this.box.scale(t,e),this.redraw(),this.onCropEndCallback()}setValue(t){this.box.setValue(t),this.onCropEndCallback()}getValue(t=void 0){const e=t||this.options.returnMode,s=e==="relative"?this.box.getValueRelative(this.ratio):e==="percent"?this.box.getValuePercent():this.box.getValueReal();return{x:Math.round(s.x),y:Math.round(s.y),width:Math.round(s.width),height:Math.round(s.height)}}getImageProps(){return{real:this.real,relative:this.relative}}getStatus(){return this.status}onInitializeCallback(){this.callbacks.onInitialize&&this.callbacks.onInitialize(this,this.getValue())}onCropStartCallback(){this.callbacks.onCropStart&&this.callbacks.onCropStart(this,this.getValue())}onCropMoveCallback(){this.callbacks.onCropMove&&this.callbacks.onCropMove(this,this.getValue())}onCropEndCallback(){const t=this.getValue();this.setDatasetCropValues(t),this.callbacks.onCropEnd&&this.callbacks.onCropEnd(this,t)}onErrorCallback(t){this.changeStatus(f.error);const e={name:t.name,message:t.message,messageId:t.messageId,data:t.data};if(this.destroy(),this.callbacks.onError)this.callbacks.onError(this,e);else throw t}initializeObserver(){this.observer=new ResizeObserver(t=>{for(const e of t){const i=e.target;i===this.htmlImg&&i.complete&&i.width!==0&&(this.updateRelativeSize(),this.redraw())}})}initializeCropper(){this.initializeObserver(),this.htmlImg.width!==0&&this.htmlImg.height!==0&&this.initialize(),this.htmlImg.onload=()=>{this.changeStatus(this.status===f.waiting?f.waiting:f.reloading),this.observer.unobserve(this.htmlImg),this.initialize()}}initialize(){try{this.createDOM(),this.calcContainerProps(),this.updateRelativeSize(),this.createNewBox(),this.onInitializeCallback(),this.observer.observe(this.htmlImg),this.changeStatus(f.ready),this.onCropEndCallback()}catch(t){if(t instanceof S)this.onErrorCallback(t);else throw t}}createDOM(){if(this.isDomCreated)return;this.replaceDOM&&(this.htmlContainer=document.createElement("div"),this.htmlContainer.classList.add(l.base),this.htmlImg.parentElement&&this.htmlImg.parentElement.replaceChild(this.htmlContainer,this.htmlImg),this.htmlContainer.appendChild(this.htmlImg));const t=this.htmlContainer;et(t),this.htmlImg.classList.add(l.img),this.background=new st(t,l.background),this.newSelection=new nt(t,l.new,this.eventBus,this.options.allowNewSelection),this.selection=new ht(t,l.selection,this.eventBus,this.options.allowMove),this.handles=new gt(t,l.hanleds,this.eventBus,this.options.allowResize,l.handle),this.isDomCreated=!0}calcContainerProps(){this.real={width:this.htmlImg.naturalWidth,height:this.htmlImg.naturalHeight}}createNewBox(){let t=this.options.startSize;this.firstInit&&(this.firstInit=!1,t=this.options.firstInitSize);const e={x:t.centeredX,y:t.centeredX},i=t.allowChange,s=q(t,this.options.minSize,this.options.maxSize,this.real,this.ratio),h=Z(s,this.real,this.options.aspectRatio,i,e);G(h),this.box=new tt(h)}updateRelativeSize(){const{width:t,height:e}=this.htmlImg.getBoundingClientRect();this.htmlImg.offsetWidth===0||this.htmlImg.offsetHeight===0?this.relative={width:this.real.width,height:this.real.height}:this.relative={width:t,height:e},this.ratio={width:this.relative.width/this.real.width,height:this.relative.height/this.real.height}}changeStatus(t){this.status=t,this.htmlImg&&this.setDataset(l.valueStatus,t)}redraw(){const t=this.box.getValueRelative(this.ratio);this.selection.transform(t),this.background.transform(t),this.handles.transform(t)}event({type:t,data:e}){switch(t){case"handlestart":this.onHandleMoveStart(e);break;case"handlemove":this.onHandleMoveMoving(e);break;case"handleend":this.onHandleMoveEnd();break;case"regionstart":this.onRegionMoveStart(e);break;case"regionmove":this.onRegionMoveMoving(e);break;case"regionend":this.onRegionMoveEnd();break;case"createnewbox":return this.tryToCreateNewBox(e)}return!0}tryToCreateNewBox({coordinates:t,size:e,leftMovable:i,topMovable:s}){const h=this.handles.handleByMovableType(i,s).getData(),a={coordinates:this.mouseCoordinates(t),size:e,points:h.points};return this.box.prepareAndApplyNewSizeAndCoordinates(a)?(this.redraw(),this.onHandleMoveStart(h),!0):!1}onHandleMoveStart(t){const{x:e,y:i}=this.box.getOppositeCornerCoordinates(t.points);this.activeHandle={x:{left:t.points.x===0,savedCoordinate:e},y:{left:t.points.y===0,savedCoordinate:i}},this.onCropStartCallback()}onHandleMoveMoving(t){const e=this.mouseCoordinates(t),i=P(e,this.activeHandle.x,this.activeHandle.y);!this.options.allowFlip&&(i.flipped.x||i.flipped.y)||(this.box.prepareAndApplyNewSizeAndCoordinates(i.newBox)&&this.redraw(),this.onCropMoveCallback())}onHandleMoveEnd(){this.onCropEndCallback()}onRegionMoveStart(t){const{x:e,y:i}=this.mouseCoordinates(t),s=this.box.getCoourdinates();this.currentMove={offsetX:e-s.x,offsetY:i-s.y},this.onCropStartCallback()}onRegionMoveMoving(t){const{offsetX:e,offsetY:i}=this.currentMove,{x:s,y:h}=this.mouseCoordinates(t);this.box.move({x:s-e,y:h-i}),this.redraw(),this.onCropMoveCallback()}onRegionMoveEnd(){this.onCropEndCallback()}mouseCoordinates(t){const e=this.htmlImg.getBoundingClientRect();let i=t.x-e.left,s=t.y-e.top;return i=Math.min(Math.max(i,0),this.relative.width)/this.ratio.width,s=Math.min(Math.max(s,0),this.relative.height)/this.ratio.height,{x:i,y:s}}setDataset(t,e){this.htmlImg.dataset[t]=e.toString()}parseCallbackFunctions(t){t&&(t.onError&&typeof t.onError=="function"&&(this.callbacks.onError=t.onError),t.onInitialize&&typeof t.onInitialize=="function"&&(this.callbacks.onInitialize=t.onInitialize),t.onCropStart&&typeof t.onCropStart=="function"&&(this.callbacks.onCropStart=t.onCropStart),t.onCropMove&&typeof t.onCropMove=="function"&&(this.callbacks.onCropMove=t.onCropMove),t.onCropEnd&&typeof t.onCropEnd=="function"&&(this.callbacks.onCropEnd=t.onCropEnd))}setDatasetCropValues(t){const e=t||this.getValue();this.setDataset(l.valueX,e.x),this.setDataset(l.valueY,e.y),this.setDataset(l.valueWidth,e.width),this.setDataset(l.valueHeight,e.height)}}return wt}();
//# sourceMappingURL=trueCropper.iife.js.map
