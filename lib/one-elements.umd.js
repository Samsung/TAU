(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.uc = {}));
}(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const t$1=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e$3=Symbol(),n$5=new WeakMap;class s$3{constructor(t,n,s){if(this._$cssResult$=!0,s!==e$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n;}get styleSheet(){let e=this.o;const s=this.t;if(t$1&&void 0===e){const t=void 0!==s&&1===s.length;t&&(e=n$5.get(s)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&n$5.set(s,e));}return e}toString(){return this.cssText}}const o$4=t=>new s$3("string"==typeof t?t:t+"",void 0,e$3),r$2=(t,...n)=>{const o=1===t.length?t[0]:n.reduce(((e,n,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[s+1]),t[0]);return new s$3(o,t,e$3)},i$3=(e,n)=>{t$1?e.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((t=>{const n=document.createElement("style"),s=window.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,e.appendChild(n);}));},S$1=t$1?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return o$4(e)})(t):t;

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */var s$2;const e$2=window.trustedTypes,r$1=e$2?e$2.emptyScript:"",h$1=window.reactiveElementPolyfillSupport,o$3={toAttribute(t,i){switch(i){case Boolean:t=t?r$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},n$4=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:o$3,reflect:!1,hasChanged:n$4};class a$1 extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;null!==(i=this.h)&&void 0!==i||(this.h=[]),this.h.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(S$1(i));}else void 0!==i&&s.push(S$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return i$3(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e,r;const h=this.constructor._$Ep(t,s);if(void 0!==h&&!0===s.reflect){const n=(null!==(r=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==r?r:o$3.toAttribute)(i,s.type);this._$El=t,null==n?this.removeAttribute(h):this.setAttribute(h,n),this._$El=null;}}_$AK(t,i){var s,e;const r=this.constructor,h=r._$Ev.get(t);if(void 0!==h&&this._$El!==h){const t=r.getPropertyOptions(h),n=t.converter,l=null!==(e=null!==(s=null==n?void 0:n.fromAttribute)&&void 0!==s?s:"function"==typeof n?n:null)&&void 0!==e?e:o$3.fromAttribute;this._$El=h,this[h]=l(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||n$4)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}}a$1.finalized=!0,a$1.elementProperties=new Map,a$1.elementStyles=[],a$1.shadowRootOptions={mode:"open"},null==h$1||h$1({ReactiveElement:a$1}),(null!==(s$2=globalThis.reactiveElementVersions)&&void 0!==s$2?s$2:globalThis.reactiveElementVersions=[]).push("1.3.3");

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    var t;const i$2=globalThis.trustedTypes,s$1=i$2?i$2.createPolicy("lit-html",{createHTML:t=>t}):void 0,e$1=`lit$${(Math.random()+"").slice(9)}$`,o$2="?"+e$1,n$3=`<${o$2}>`,l$1=document,h=(t="")=>l$1.createComment(t),r=t=>null===t||"object"!=typeof t&&"function"!=typeof t,d=Array.isArray,u=t=>{var i;return d(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},c=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,a=/>/g,f=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,_=/'/g,m=/"/g,g=/^(?:script|style|textarea|title)$/i,p=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),$=p(1),b=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),T=new WeakMap,x=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N(i.insertBefore(h(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l},A=l$1.createTreeWalker(l$1,129,null,!1),C=(t,i)=>{const o=t.length-1,l=[];let h,r=2===i?"<svg>":"",d=c;for(let i=0;i<o;i++){const s=t[i];let o,u,p=-1,$=0;for(;$<s.length&&(d.lastIndex=$,u=d.exec(s),null!==u);)$=d.lastIndex,d===c?"!--"===u[1]?d=v:void 0!==u[1]?d=a:void 0!==u[2]?(g.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=f):void 0!==u[3]&&(d=f):d===f?">"===u[0]?(d=null!=h?h:c,p=-1):void 0===u[1]?p=-2:(p=d.lastIndex-u[2].length,o=u[1],d=void 0===u[3]?f:'"'===u[3]?m:_):d===m||d===_?d=f:d===v||d===a?d=c:(d=f,h=void 0);const y=d===f&&t[i+1].startsWith("/>")?" ":"";r+=d===c?s+n$3:p>=0?(l.push(o),s.slice(0,p)+"$lit$"+s.slice(p)+e$1+y):s+e$1+(-2===p?(l.push(void 0),i):y);}const u=r+(t[o]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==s$1?s$1.createHTML(u):u,l]};class E{constructor({strings:t,_$litType$:s},n){let l;this.parts=[];let r=0,d=0;const u=t.length-1,c=this.parts,[v,a]=C(t,s);if(this.el=E.createElement(v,n),A.currentNode=this.el.content,2===s){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(e$1)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(e$1),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?M:"?"===i[1]?H:"@"===i[1]?I:S});}else c.push({type:6,index:r});}for(const i of t)l.removeAttribute(i);}if(g.test(l.tagName)){const t=l.textContent.split(e$1),s=t.length-1;if(s>0){l.textContent=i$2?i$2.emptyScript:"";for(let i=0;i<s;i++)l.append(t[i],h()),A.nextNode(),c.push({type:2,index:++r});l.append(t[s],h());}}}else if(8===l.nodeType)if(l.data===o$2)c.push({type:2,index:r});else {let t=-1;for(;-1!==(t=l.data.indexOf(e$1,t+1));)c.push({type:7,index:r}),t+=e$1.length-1;}r++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function P(t,i,s=t,e){var o,n,l,h;if(i===b)return i;let d=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const u=r(i)?void 0:i._$litDirective$;return (null==d?void 0:d.constructor)!==u&&(null===(n=null==d?void 0:d._$AO)||void 0===n||n.call(d,!1),void 0===u?d=void 0:(d=new u(t),d._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Cl)&&void 0!==l?l:h._$Cl=[])[e]=d:s._$Cu=d),void 0!==d&&(i=P(t,d._$AS(t,i.values),d,e)),i}class V{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:l$1).importNode(s,!0);A.currentNode=o;let n=A.nextNode(),h=0,r=0,d=e[0];for(;void 0!==d;){if(h===d.index){let i;2===d.type?i=new N(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new L(n,this,t)),this.v.push(i),d=e[++r];}h!==(null==d?void 0:d.index)&&(n=A.nextNode(),h++);}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=P(this,t,i),r(t)?t===w||null==t||""===t?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==b&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):u(t)?this.S(t):this.$(t);}M(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t));}$(t){this._$AH!==w&&r(this._$AH)?this._$AA.nextSibling.data=t:this.k(l$1.createTextNode(t)),this._$AH=t;}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=E.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else {const t=new V(o,this),i=t.p(this.options);t.m(s),this.k(i),this._$AH=t;}}_$AC(t){let i=T.get(t.strings);return void 0===i&&T.set(t.strings,i=new E(t)),i}S(t){d(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.M(h()),this.M(h()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class S{constructor(t,i,s,e,o){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=P(this,t,i,0),n=!r(t)||t!==this._$AH&&t!==b,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=P(this,e[s+l],i,l),h===b&&(h=this._$AH[l]),n||(n=!r(h)||h!==this._$AH[l]),h===w?t=w:t!==w&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.C(t);}C(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class M extends S{constructor(){super(...arguments),this.type=3;}C(t){this.element[this.name]=t===w?void 0:t;}}const k=i$2?i$2.emptyScript:"";class H extends S{constructor(){super(...arguments),this.type=4;}C(t){t&&t!==w?this.element.setAttribute(this.name,k):this.element.removeAttribute(this.name);}}class I extends S{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=P(this,t,i,0))&&void 0!==s?s:w)===b)return;const e=this._$AH,o=t===w&&e!==w||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==w&&(e===w||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class L{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t);}}const z=window.litHtmlPolyfillSupport;null==z||z(E,N),(null!==(t=globalThis.litHtmlVersions)&&void 0!==t?t:globalThis.litHtmlVersions=[]).push("2.2.6");

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */var l,o$1;class s extends a$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=x(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return b}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n$2=globalThis.litElementPolyfillSupport;null==n$2||n$2({LitElement:s});(null!==(o$1=globalThis.litElementVersions)&&void 0!==o$1?o$1:globalThis.litElementVersions=[]).push("3.2.1");

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const n$1=n=>e=>"function"==typeof e?((n,e)=>(window.customElements.define(n,e),e))(n,e):((n,e)=>{const{kind:t,elements:i}=e;return {kind:t,elements:i,finisher(e){window.customElements.define(n,e);}}})(n,e);

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const i$1=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}};function e(e){return (n,t)=>void 0!==t?((i,e,n)=>{e.constructor.createProperty(n,i);})(e,n,t):i$1(e,n)}

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const o=({finisher:e,descriptor:t})=>(o,n)=>{var r;if(void 0===n){const n=null!==(r=o.originalKey)&&void 0!==r?r:o.key,i=null!=t?{kind:"method",placement:"prototype",key:n,descriptor:t(o.key)}:{...o,key:n};return null!=e&&(i.finisher=function(t){e(t,n);}),i}{const r=o.constructor;void 0!==t&&Object.defineProperty(o,n,t(n)),null==e||e(r,n);}};

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function i(i,n){return o({descriptor:o=>{const t={get(){var o,n;return null!==(n=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==n?n:null},enumerable:!0,configurable:!0};if(n){const n="symbol"==typeof o?Symbol():"__"+o;t.get=function(){var o,t;return void 0===this[n]&&(this[n]=null!==(t=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==t?t:null),this[n]};}return t}})}

    /**
     * @license
     * Copyright 2021 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */var n;null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

    exports.OneCircle = class OneCircle extends s {
        static get styles() {
            return r$2 `
      :host {
        display: flex;
        position: relative;
        width: 360px;
        height: 360px;
        background-color: black;
        color: white;
        clip-path: circle(180px at center);
        justify-content: center;
        align-items: center;
        overflow: auto;
      }
    `;
        }
        render() {
            return $ `
    <div ?radius="${this.radius}">
      <slot @slotchange="${this.slotChange}"></slot>
    </div>
    `;
        }
        connectedCallback() {
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
        }
        slotChange() {
            this.requestUpdate();
        }
        updated() {
            if (this.radius) {
                this.style.width = `${this.radius * 2}px`;
                this.style.height = `${this.radius * 2}px`;
                this.style.clipPath = `circle(${this.radius}px at center)`;
            }
        }
    };
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Number)
    ], exports.OneCircle.prototype, "radius", void 0);
    exports.OneCircle = __decorate([
        n$1('one-circle')
    ], exports.OneCircle);

    exports.OneSquare = class OneSquare extends s {
        static get styles() {
            return r$2 `
      :host {
        display: flex;
        position: relative;
        width: 360px;
        height: 360px;
        background-color: black;
        color: white;
        clip-path: inset(0% 0% 0% 0%);
        justify-content: center;
        align-items: center;
        overflow: auto;
      }
    `;
        }
        render() {
            return $ `
    <div ?width="${this.width}" ?height="${this.height}">
      <slot @slotchange="${this.slotChange}"></slot>
    </div>
    `;
        }
        connectedCallback() {
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
        }
        slotChange() {
            this.requestUpdate();
        }
        updated() {
            if (this.width || this.height) {
                this.style.width = `${this.width}px`;
                this.style.height = `${this.height}px`;
            }
        }
    };
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Number)
    ], exports.OneSquare.prototype, "width", void 0);
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Number)
    ], exports.OneSquare.prototype, "height", void 0);
    exports.OneSquare = __decorate([
        n$1('one-square')
    ], exports.OneSquare);

    const BaseCSS = r$2 `
:host {
  opacity: 0;
  color: white;
}
:host(.one-rendered) {
  opacity: 1;
}
#overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -10;
}
svg {
  display: block;
}
path {
  stroke: currentColor;
  stroke-width: 0.7;
  fill: transparent;
}
.hidden {
  display: none !important;
}
`;
    class OneBase extends s {
        constructor() {
            super(...arguments);
            this.lastSize = [0, 0];
        }
        updated(_changed) {
            this.oneRender();
        }
        oneRender(force = false) {
            if (this.svg) {
                const size = this.canvasSize();
                if ((!force) && (size[0] === this.lastSize[0]) && (size[1] === this.lastSize[1])) {
                    return;
                }
                while (this.svg.hasChildNodes()) {
                    this.svg.removeChild(this.svg.lastChild);
                }
                this.svg.setAttribute('width', `${size[0]}`);
                this.svg.setAttribute('height', `${size[1]}`);
                this.draw(this.svg, size);
                this.lastSize = size;
                this.classList.add('one-rendered');
            }
        }
        fire(name, detail) {
            fireEvent(this, name, detail);
        }
    }
    __decorate([
        i('svg'),
        __metadata("design:type", SVGSVGElement)
    ], OneBase.prototype, "svg", void 0);
    function fireEvent(e, name, detail) {
        e.dispatchEvent(new CustomEvent(name, {
            composed: true,
            bubbles: true,
            detail
        }));
    }

    const __curveStepCount = 19;
    class OnePath {
        constructor() {
            this.p = '';
        }
        get value() {
            return this.p.trim();
        }
        moveTo(x, y) {
            this.p = `${this.p}M ${x} ${y}`;
        }
        lineTo(x, y) {
            this.p = `${this.p}L ${x} ${y}`;
        }
        bcurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
            this.p += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y} `;
        }
    }
    function svgNode(tagName, attributes) {
        const ns = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        if (attributes) {
            for (const attr in attributes) {
                ns.setAttributeNS(null, attr, attributes[attr]);
            }
        }
        return ns;
    }
    function _line(x1, y1, x2, y2, existingPath) {
        const path = existingPath || new OnePath();
        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
        path.moveTo(x2, y2);
        return path;
    }
    function line(parent, x1, y1, x2, y2) {
        const path = _line(x1, y1, x2, y2);
        const node = svgNode('path', { d: path.value });
        parent.appendChild(node);
        return node;
    }
    function rectangle(parent, x, y, width, height) {
        let path = _line(x, y, x + width, y);
        path = _line(x + width, y, x + width, y + height, path);
        path = _line(x + width, y + height, x, y + height, path);
        path = _line(x, y + height, x, y, path);
        const node = svgNode('path', { d: path.value });
        parent.appendChild(node);
        return node;
    }
    function _curve(vertArray, existingPath) {
        const vertArrayLength = vertArray.length;
        let path = existingPath || new OnePath();
        if (vertArrayLength > 3) {
            const b = [];
            path.moveTo(vertArray[1][0], vertArray[1][1]);
            for (let i = 1; (i + 2) < vertArrayLength; i++) {
                const cachedVertArray = vertArray[i];
                b[0] = [cachedVertArray[0], cachedVertArray[1]];
                b[1] = [cachedVertArray[0] + (vertArray[i + 1][0] - vertArray[i - 1][0]) / 6, cachedVertArray[1] + (vertArray[i + 1][1] - vertArray[i - 1][1]) / 6];
                b[2] = [vertArray[i + 1][0] + (vertArray[i][0] - vertArray[i + 2][0]) / 6, vertArray[i + 1][1] + (vertArray[i][1] - vertArray[i + 2][1]) / 6];
                b[3] = [vertArray[i + 1][0], vertArray[i + 1][1]];
                path.bcurveTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
            }
        }
        else if (vertArrayLength === 3) {
            path.moveTo(vertArray[0][0], vertArray[0][1]);
            path.bcurveTo(vertArray[1][0], vertArray[1][1], vertArray[2][0], vertArray[2][1], vertArray[2][0], vertArray[2][1]);
        }
        else if (vertArrayLength === 2) {
            path = _line(vertArray[0][0], vertArray[0][1], vertArray[1][0], vertArray[1][1], path);
        }
        return path;
    }
    function _ellipse(ellipseInc, cx, cy, rx, ry, existingPath) {
        const points = [];
        points.push([
            cx + 0.9 * rx * Math.cos(ellipseInc),
            cy + 0.9 * ry * Math.sin(ellipseInc)
        ]);
        for (let angle = 0; angle < (Math.PI * 2); angle = angle + ellipseInc) {
            points.push([
                cx + rx * Math.cos(angle),
                cy + ry * Math.sin(angle)
            ]);
        }
        points.push([
            cx + rx * Math.cos(Math.PI * 2),
            cy + ry * Math.sin(Math.PI * 2)
        ]);
        points.push([
            cx + 0.98 * rx * Math.cos(Math.PI * 2),
            cy + 0.98 * ry * Math.sin(Math.PI * 2)
        ]);
        return _curve(points, existingPath);
    }
    function ellipse(parent, x, y, width, height) {
        width = Math.max(width > 10 ? width - 4 : width - 1, 1);
        height = Math.max(height > 10 ? height - 4 : height - 1, 1);
        const ellipseInc = (Math.PI * 2) / __curveStepCount;
        let rx = Math.abs(width / 2);
        let ry = Math.abs(height / 2);
        let path = _ellipse(ellipseInc, x, y, rx, ry);
        const node = svgNode('path', { d: path.value });
        parent.appendChild(node);
        return node;
    }
    function _continousLine(x1, y1, x2, y2, move, path) {
        path = path || new OnePath();
        if (move) {
            path.moveTo(x1, y1);
        }
        path.lineTo(x2, y2);
        return path;
    }
    function polygon(parent, verties) {
        let path = null;
        const vCount = verties.length;
        if (vCount > 2) {
            for (let i = 0; i < vCount; i++) {
                let move = true;
                for (let i = 1; i < vCount; i++) {
                    path = _continousLine(verties[i - 1][0], verties[i - 1][1], verties[i][0], verties[i][1], move, path);
                    move = false;
                }
                path = _continousLine(verties[vCount - 1][0], verties[vCount - 1][1], verties[0][0], verties[0][1], move, path);
            }
        }
        else if (vCount === 2) {
            path = _line(verties[0][0], verties[0][1], verties[1][0], verties[1][1]);
        }
        else {
            path = new OnePath();
        }
        const node = svgNode('path', { d: `${path === null || path === void 0 ? void 0 : path.value}` });
        parent.appendChild(node);
        return node;
    }
    function hasCircleContainer(element) {
        let parentElement = element.parentElement;
        while (parentElement) {
            if (parentElement.tagName === 'ONE-CIRCLE') {
                return true;
            }
            parentElement = parentElement === null || parentElement === void 0 ? void 0 : parentElement.parentElement;
        }
        return false;
    }

    const theme = {
        primary: 'rgb(25, 118, 210)',
        secondary: 'rgb(156, 39, 176)',
        success: 'rgb(46, 125, 50)',
        error: 'rgb(211, 47, 47)'
    };

    exports.OneButton = class OneButton extends OneBase {
        constructor() {
            super();
            this.icon = false;
            this.disabled = false;
            this.variant = 'contained';
            this.color = null;
            this.size = 'medium';
            this.elevation = 1;
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        font-size: 14px;
      }
      path {
        transition: transform 0.05s ease;
      }
      button {
        position: relative;
        user-select: none;
        border: none;
        background: none;        
        font-family: inherit;
        font-size: inherit;
        cursor: pointer;
        letter-spacing: 1.25px;
        text-align: center;
        padding: 10px;
        color: inherit;
        outline: none;
      }
      button[icon] {
        border-radius: 50%;
      }
      button[disabled] {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      button:active path {
        transform: scale(0.97) translate(1.5%, 1.5%);
      }
      button:focus path {
        stroke-width: 1.5;
      }
      `
            ];
        }
        render() {
            return $ `
    <button
      ?icon="${this.icon}"
      ?disabled="${this.disabled}"
      ?variant="${this.variant}"
      ?color="${this.color}"
      ?size="${this.size}"
    >
      <slot @slotchange="${this.oneRender}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `;
        }
        focus() {
            if (this.button) {
                this.button.focus();
            }
            else {
                super.focus();
            }
        }
        updated() {
            super.updated();
        }
        canvasSize() {
            if (this.button) {
                const size = this.button.getBoundingClientRect();
                const elevation = Math.min(Math.max(1, this.elevation), 5);
                const width = size.width + ((elevation - 1) * 2);
                const height = size.height + ((elevation - 1) * 2);
                return [Math.round(width), Math.round(height)];
            }
            return this.lastSize;
        }
        draw(svg, size) {
            var _a, _b, _c, _d;
            if (this.icon) {
                this.style.color = (_a = this.color) !== null && _a !== void 0 ? _a : 'white';
                const min = Math.min(size[0], size[1]);
                svg.setAttribute('width', `${min}`);
                svg.setAttribute('height', `${min}`);
            }
            else {
                if (this.size === 'small') {
                    this.style.fontSize = '12px';
                }
                else if (this.size === 'large') {
                    this.style.fontSize = '16px';
                }
                if (this.variant === 'text') {
                    this.style.color = (_b = this.color) !== null && _b !== void 0 ? _b : 'inherit';
                    return;
                }
                const elevation = Math.min(Math.max(1, this.elevation), 5);
                const s = {
                    width: size[0] - ((elevation - 1) * 2),
                    height: size[1] - ((elevation - 1) * 2)
                };
                const rectangle = polygon(svg, [[0, 0], [s.width, 0], [s.width, s.height], [0, s.height]]);
                if (this.variant === 'contained') {
                    rectangle.style.fill = (_c = this.color) !== null && _c !== void 0 ? _c : theme.primary;
                }
                else if (this.variant === 'outlined') {
                    this.style.color = (_d = this.color) !== null && _d !== void 0 ? _d : 'white';
                }
                for (let i = 1; i < elevation; i++) {
                    line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2));
                    line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2);
                    line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2));
                    line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2);
                }
            }
        }
    };
    __decorate([
        e({ type: Boolean }),
        __metadata("design:type", Object)
    ], exports.OneButton.prototype, "icon", void 0);
    __decorate([
        e({ type: Boolean, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneButton.prototype, "disabled", void 0);
    __decorate([
        e({ type: String, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneButton.prototype, "variant", void 0);
    __decorate([
        e({ type: String, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneButton.prototype, "color", void 0);
    __decorate([
        e({ type: String, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneButton.prototype, "size", void 0);
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Object)
    ], exports.OneButton.prototype, "elevation", void 0);
    __decorate([
        i('button'),
        __metadata("design:type", HTMLButtonElement)
    ], exports.OneButton.prototype, "button", void 0);
    exports.OneButton = __decorate([
        n$1('one-button'),
        __metadata("design:paramtypes", [])
    ], exports.OneButton);

    exports.OneCard = class OneCard extends OneBase {
        constructor() {
            super();
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
        :host {
          display: inline-block;
          position: relative;
          padding: 0 10px;
        }
        :host(.circle) {
          padding: 0 50px !important;
        }
        path {
          stroke: var(--one-card-background-fill, currentColor);
        }
      `
            ];
        }
        render() {
            return $ `
    <div id="overlay"><svg></svg></div>
    <div style="position: relative;">
      <slot @slotchange="${this.oneRender}"></slot>
    </div>
    `;
        }
        updated(changed) {
            if (hasCircleContainer(this)) {
                if (!this.classList.contains('circle')) {
                    this.classList.add('circle');
                }
            }
            const force = changed.has('fill');
            super.oneRender(force);
        }
        canvasSize() {
            const size = this.getBoundingClientRect();
            return [size.width, size.height];
        }
        draw(svg, size) {
            const s = {
                width: size[0],
                height: size[1]
            };
            rectangle(svg, 2, 2, s.width - 4, s.height - 4);
        }
    };
    exports.OneCard = __decorate([
        n$1('one-card'),
        __metadata("design:paramtypes", [])
    ], exports.OneCard);

    exports.OneCheckbox = class OneCheckbox extends s {
        constructor() {
            super(...arguments);
            this.checked = false;
            this.disabled = false;
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        font-family: inherit;
        opacity: 0;
      }
      :host(.one-disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      span {
        margin-left: 1.5ex;
        line-height: 24px;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: currentColor;
        stroke-width: 0.7;
      }
      g path {
        stroke-width: 2.5;
      }
    `
            ];
        }
        render() {
            return $ `
    <label id="container">
      <input type="checkbox"
        .checked="${this.checked}"
        @change="${this.onChange}"
      >
      <span><slot></slot></span>
      <div id="overlay"><svg id="svg"></svg></div>
    </label>
    `;
        }
        updated(changed) {
            if (changed.has('disabled')) {
                this.refreshDisabledState();
            }
            const svg = this.shadowRoot.getElementById('svg');
            while (svg.hasChildNodes()) {
                svg.removeChild(svg.lastChild);
            }
            const size = [24, 24];
            rectangle(svg, 0, 0, size[0], size[1]);
            this.svgCheck = svgNode('g');
            svg.appendChild(this.svgCheck);
            line(this.svgCheck, size[0] * 0.3, size[1] * 0.4, size[0] * 0.5, size[1] * 0.7);
            line(this.svgCheck, size[0] * 0.5, size[1] * 0.7, size[0] + 5, -5);
            this.refreshCheckVisibility();
            this.classList.add('one-rendered');
        }
        onChange() {
            this.checked = this.input.checked;
            this.refreshCheckVisibility();
            fireEvent(this, 'change', { checked: this.checked });
        }
        refreshCheckVisibility() {
            if (this.svgCheck) {
                this.svgCheck.style.display = this.checked ? '' : 'none';
            }
        }
        refreshDisabledState() {
            if (this.disabled) {
                this.classList.add('one-disabled');
            }
            else {
                this.classList.remove('one-disabled');
            }
        }
    };
    __decorate([
        e({ type: Boolean, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneCheckbox.prototype, "checked", void 0);
    __decorate([
        e({ type: Boolean, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneCheckbox.prototype, "disabled", void 0);
    __decorate([
        i('input'),
        __metadata("design:type", HTMLInputElement)
    ], exports.OneCheckbox.prototype, "input", void 0);
    exports.OneCheckbox = __decorate([
        n$1('one-checkbox')
    ], exports.OneCheckbox);

    exports.OneInput = class OneInput extends OneBase {
        constructor() {
            super(...arguments);
            this.checked = false;
            this.type = 'text';
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: inherit;
        width: 150px;
        outline: none;
      }
      input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        outline: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        padding: 6px;
      }
    `
            ];
        }
        oneRender(force = false) {
            super.oneRender(force);
        }
        render() {
            return $ `
    <input type="${this.type}" size="${this.size}">
    <div id="overlay">
      <svg></svg>
    </div>
    `;
        }
        canvasSize() {
            const size = this.getBoundingClientRect();
            return [size.width, size.height];
        }
        draw(svg, size) {
            rectangle(svg, 2, 2, size[0] - 2, size[1] - 2);
        }
    };
    __decorate([
        e({ type: Boolean }),
        __metadata("design:type", Object)
    ], exports.OneInput.prototype, "checked", void 0);
    __decorate([
        e({ type: Boolean }),
        __metadata("design:type", Object)
    ], exports.OneInput.prototype, "type", void 0);
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Number)
    ], exports.OneInput.prototype, "size", void 0);
    exports.OneInput = __decorate([
        n$1('one-input')
    ], exports.OneInput);

    exports.OneRadio = class OneRadio extends OneBase {
        constructor() {
            super(...arguments);
            this.checked = false;
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        font-family: inherit;
      }
      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      span {
        margin-left: 1.5ex;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: currentColor;
        stroke-width: 0.7;
      }
      g path {
        stroke-width: 0;
        fill: currentColor;
      }
    `
            ];
        }
        oneRender(force = false) {
            super.oneRender(force);
            this.refreshCheckVisibility();
        }
        render() {
            return $ `
    <label id="container">
      <input type="checkbox" .checked="${this.checked}"
        @change="${this.onChange}"
      >
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    </label>
    `;
        }
        canvasSize() {
            return [24, 24];
        }
        draw(svg, size) {
            ellipse(svg, size[0] / 2, size[1] / 2, size[0], size[1]);
            this.svgCheck = svgNode('g');
            svg.appendChild(this.svgCheck);
            const iw = Math.max(size[0] * 0.6, 5);
            const ih = Math.max(size[1] * 0.6, 5);
            ellipse(this.svgCheck, size[0] / 2, size[1] / 2, iw, ih);
        }
        onChange() {
            this.checked = this.input.checked;
            this.refreshCheckVisibility();
            this.fire('change', { checked: this.checked });
        }
        refreshCheckVisibility() {
            if (this.svgCheck) {
                this.svgCheck.style.display = this.checked ? '' : 'none';
            }
        }
    };
    __decorate([
        e({ type: Boolean }),
        __metadata("design:type", Object)
    ], exports.OneRadio.prototype, "checked", void 0);
    __decorate([
        e({ type: String }),
        __metadata("design:type", String)
    ], exports.OneRadio.prototype, "name", void 0);
    __decorate([
        i('input'),
        __metadata("design:type", HTMLInputElement)
    ], exports.OneRadio.prototype, "input", void 0);
    exports.OneRadio = __decorate([
        n$1('one-radio')
    ], exports.OneRadio);

    exports.OneRadioGroup = class OneRadioGroup extends s {
        constructor() {
            super(...arguments);
            this.radioNodes = [];
            this.checkListener = this.handleChecked.bind(this);
        }
        static get styles() {
            return r$2 `
      :host {
        display: inline-block;
        font-family: inherit;
        outline: none;
      }
    `;
        }
        render() {
            return $ `
      <slot id="slot" @slotchange="${this.slotChange}"></slot>
    `;
        }
        connectedCallback() {
            super.connectedCallback();
            this.addEventListener('change', this.checkListener);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener('change', this.checkListener);
        }
        slotChange() {
            this.requestUpdate();
        }
        firstUpdated() {
            this.setAttribute('role', 'radiogroup');
            this.tabIndex = +(this.getAttribute('tabindex') || 0);
            this.addEventListener('keydown', event => {
                switch (event.keyCode) {
                    case 37:
                    case 38:
                        event.preventDefault();
                        this.selectPrevious();
                        break;
                    case 39:
                    case 40:
                        event.preventDefault();
                        this.selectNext();
                        break;
                }
            });
        }
        updated() {
            const slot = this.shadowRoot.getElementById('slot');
            const nodes = slot.assignedNodes();
            this.radioNodes = [];
            if (nodes && nodes.length) {
                for (let i = 0; i < nodes.length; i++) {
                    const element = nodes[i];
                    if (element.tagName === 'ONE-RADIO') {
                        this.radioNodes.push(element);
                        const name = element.name || '';
                        if (this.selected && (name === this.selected)) {
                            element.checked = true;
                        }
                        else {
                            element.checked = false;
                        }
                    }
                }
            }
        }
        selectPrevious() {
            const list = this.radioNodes;
            if (list.length) {
                let radio = null;
                let index = -1;
                if (this.selected) {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].name === this.selected) {
                            index = i;
                            break;
                        }
                    }
                    if (index < 0) {
                        radio = list[0];
                    }
                    else {
                        index--;
                        if (index < 0) {
                            index = list.length - 1;
                        }
                        radio = list[index];
                    }
                }
                else {
                    radio = list[0];
                }
                if (radio) {
                    radio.focus();
                    this.selected = radio.name;
                    this.fireSelected();
                }
            }
        }
        selectNext() {
            const list = this.radioNodes;
            if (list.length) {
                let radio = null;
                let index = -1;
                if (this.selected) {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].name === this.selected) {
                            index = i;
                            break;
                        }
                    }
                    if (index < 0) {
                        radio = list[0];
                    }
                    else {
                        index++;
                        if (index >= list.length) {
                            index = 0;
                        }
                        radio = list[index];
                    }
                }
                else {
                    radio = list[0];
                }
                if (radio) {
                    radio.focus();
                    this.selected = radio.name;
                    this.fireSelected();
                }
            }
        }
        handleChecked(event) {
            const checked = event.detail.checked;
            const item = event.target;
            const name = item.name || '';
            if (!checked) {
                item.checked = true;
            }
            else {
                this.selected = (checked && name) || '';
                this.fireSelected();
            }
        }
        fireSelected() {
            fireEvent(this, 'selected', { selected: this.selected });
        }
    };
    __decorate([
        e({ type: String, reflect: true }),
        __metadata("design:type", String)
    ], exports.OneRadioGroup.prototype, "selected", void 0);
    exports.OneRadioGroup = __decorate([
        n$1('one-radio-group')
    ], exports.OneRadioGroup);

    exports.OneProgress = class OneProgress extends OneBase {
        constructor() {
            super(...arguments);
            this.value = 0;
            this.min = 0;
            this.max = 100;
            this.percentage = false;
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        position: relative;
        width: 200px;
        height: 42px;
        font-family: sans-serif;
      }
      .labelContainer {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .progressLabel {
        color: var(--one-progress-label-color, currentColor);
        font-size: var(--one-progress-font-size, 14px);
        background: var(--one-progress-label-background, #000);
        letter-spacing: 1.25px;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        pointer-events: none;
      }
      .progressbox {
        stroke: var(--one-progress-color, rgba(255, 255, 255, 0.8));
        stroke-width: 2.75;
        fill: white;
      }
    `
            ];
        }
        oneRender(force = false) {
            super.oneRender(force);
            this.refreshProgressFill();
        }
        render() {
            return $ `
    <div id="overlay" class="overlay">
      <svg></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this.getProgressLabel()}</div>
    </div>
    `;
        }
        canvasSize() {
            const s = this.getBoundingClientRect();
            return [s.width, s.height];
        }
        draw(svg, size) {
            rectangle(svg, 2, 2, size[0] - 2, size[1] - 2);
        }
        getProgressLabel() {
            if (this.percentage) {
                if (this.max === this.min) {
                    return '%';
                }
                else {
                    const pct = Math.floor(((this.value - this.min) / (this.max - this.min)) * 100);
                    return pct + '%';
                }
            }
            else {
                return '' + this.value;
            }
        }
        refreshProgressFill() {
            if (this.progressBox) {
                if (this.progressBox.parentElement) {
                    this.progressBox.parentElement.removeChild(this.progressBox);
                }
                this.progressBox = undefined;
            }
            if (this.svg) {
                let percentage = 0;
                const size = this.getBoundingClientRect();
                if (this.max > this.min) {
                    percentage = (this.value - this.min) / (this.max - this.min);
                    const progressWidth = size.width * Math.max(0, Math.min(percentage, 100));
                    this.progressBox = polygon(this.svg, [
                        [0, 0],
                        [progressWidth, 0],
                        [progressWidth, size.height],
                        [0, size.height]
                    ]);
                    this.svg.appendChild(this.progressBox);
                    this.progressBox.classList.add('progressbox');
                }
            }
        }
    };
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Object)
    ], exports.OneProgress.prototype, "value", void 0);
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Object)
    ], exports.OneProgress.prototype, "min", void 0);
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Object)
    ], exports.OneProgress.prototype, "max", void 0);
    __decorate([
        e({ type: Boolean }),
        __metadata("design:type", Object)
    ], exports.OneProgress.prototype, "percentage", void 0);
    exports.OneProgress = __decorate([
        n$1('one-progress')
    ], exports.OneProgress);

    exports.OneToggle = class OneToggle extends OneBase {
        constructor() {
            super(...arguments);
            this.checked = false;
            this.disabled = false;
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        cursor: pointer;
        position: relative;
        outline: none;
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
        opacity: 0;
      }
      .knob {
        transition: transform 0.3s ease;
      }
      .knob path {
        stroke-width: 0.7;
        fill: currentColor;
      }
      .knob.checked {
        transform: translateX(48px);
      }
      .knob.checked path {
        fill: var(--one-toggle-on-color, blue);
      }
      .knob.unchecked path {
        fill: var(--one-toggle-off-color, gray);
      }
    `
            ];
        }
        oneRender(force = false) {
            super.oneRender(force);
            this.refreshKnob();
        }
        render() {
            return $ `
    <div style="position: relative;">
      <svg></svg>
      <input type="checkbox" .checked="${this.checked}" ?disabled="${this.disabled}" @change="${this.onChange}">
    </div>
    `;
        }
        canvasSize() {
            return [80, 34];
        }
        draw(svg, size) {
            const rect = rectangle(svg, 16, 8, size[0] - 32, 18);
            rect.classList.add('toggle-bar');
            this.knob = svgNode('g');
            this.knob.classList.add('knob');
            svg.appendChild(this.knob);
            ellipse(this.knob, 16, 16, 32, 32);
        }
        onChange() {
            this.checked = this.input.checked;
            this.refreshKnob();
            this.fire('change', { checked: this.checked });
        }
        refreshKnob() {
            if (this.knob) {
                const classList = this.knob.classList;
                if (this.checked) {
                    classList.remove('unchecked');
                    classList.add('checked');
                }
                else {
                    classList.remove('checked');
                    classList.add('unchecked');
                }
            }
        }
    };
    __decorate([
        e({ type: Boolean }),
        __metadata("design:type", Object)
    ], exports.OneToggle.prototype, "checked", void 0);
    __decorate([
        e({ type: Boolean, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneToggle.prototype, "disabled", void 0);
    __decorate([
        i('input'),
        __metadata("design:type", HTMLInputElement)
    ], exports.OneToggle.prototype, "input", void 0);
    exports.OneToggle = __decorate([
        n$1('one-toggle')
    ], exports.OneToggle);

    exports.OneSlider = class OneSlider extends OneBase {
        constructor() {
            super(...arguments);
            this.min = 0;
            this.max = 100;
            this.step = 1;
            this.disabled = false;
            this.canvasWidth = 300;
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        position: relative;
        width: 300px;
        box-sizing: border-box;
      }
      :host([disabled]) {
        opacity: 0.45 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.07);
        border-radius: 5px;
      }
      input[type=range] {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        margin: 0;
        -webkit-appearance: none;
        background: transparent;
        outline: none;
        position: relative;
      }
      input[type=range]:focus {
        outline: none;
      }
      input[type=range]::-ms-track {
        width: 100%;
        cursor:pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
      }
      input[type=range]::-moz-range-thumb {
        border-radius: 50px;
        background: none;
        cursor: pointer;
        border: none;
        margin: 0;
        height: 24px;
        width: 24px;
        line-height: 1;
      }
      input[type=range]::-moz-focus-outer {
        outline: none;
        border: 0;
      }
      input[type=range]::-moz-range-thumb {
        border-radius: 50px;
        background: none;
        cursor: pointer;
        border: none;
        height: 24px;
        width: 24px;
        line-height: 1;
      }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border-radius: 50px;
        background: none;
        cursor: pointer;
        border: none;
        height: 24px;
        width: 24px;
        margin: 0;
        line-height: 1;
      }
      .bar {
        stroke: rgb(255, 255, 255);
        stroke-width: 1;
      }
      .knob {
        fill: rgb(51, 103, 214);
        stroke: rgb(51, 103, 214);
      }
      input:focus + div svg .knob {
        stroke: rgb(0, 0, 0);
        fill-opacity: 0.8;
      }
    `
            ];
        }
        get value() {
            if (this.input) {
                return +this.input.value;
            }
            return this.min;
        }
        set value(v) {
            if (this.input) {
                this.input.value = `${v}`;
            }
            else {
                this.pendingValue = v;
            }
            this.updateThumbPosition();
        }
        oneRender(force = false) {
            super.oneRender(force);
            this.updateThumbPosition();
        }
        firstUpdated() {
            this.value = this.pendingValue || +(this.getAttribute('value') || this.value || this.min);
            delete this.pendingValue;
        }
        render() {
            return $ `
    <div id="container">
      <input type="range"
        min="${this.min}"
        max="${this.max}"
        step="${this.step}"
        ?disabled="${this.disabled}"
        @input="${this.onInput}">
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    `;
        }
        focus() {
            if (this.input) {
                this.input.focus();
            }
            else {
                super.focus();
            }
        }
        onInput(e) {
            e.stopPropagation();
            this.updateThumbPosition();
            if (this.input) {
                this.fire('change', { value: +this.input.value });
            }
        }
        canvasSize() {
            const size = this.getBoundingClientRect();
            return [size.width, size.height];
        }
        draw(svg, size) {
            this.canvasWidth = size[0];
            const midY = Math.round(size[1] / 2);
            line(svg, 0, midY, size[0], midY).classList.add('bar');
            this.knob = ellipse(svg, 12, midY, 24, 24);
            this.knob.classList.add('knob');
        }
        updateThumbPosition() {
            if (this.input) {
                const value = +this.input.value;
                const delta = Math.max(this.step, this.max - this.min);
                const pct = (value - this.min) / delta;
                if (this.knob) {
                    this.knob.style.transform = `translateX(${pct * (this.canvasWidth - 24)}px)`;
                }
            }
        }
    };
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Object)
    ], exports.OneSlider.prototype, "min", void 0);
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Object)
    ], exports.OneSlider.prototype, "max", void 0);
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Object)
    ], exports.OneSlider.prototype, "step", void 0);
    __decorate([
        e({ type: Boolean, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneSlider.prototype, "disabled", void 0);
    __decorate([
        i('input'),
        __metadata("design:type", HTMLInputElement)
    ], exports.OneSlider.prototype, "input", void 0);
    exports.OneSlider = __decorate([
        n$1('one-slider')
    ], exports.OneSlider);

    exports.OneSpinner = class OneSpinner extends OneBase {
        constructor() {
            super(...arguments);
            this.spinning = false;
            this.duration = 1500;
            this.value = 0;
            this.timerstart = 0;
            this.frame = 0;
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        position: relative;
      }
      path {
        stroke: currentColor;
        stroke-opacity: 0.65;
        storke-width: 1.5;
        fill: none;
      }
      .knob {
        stroke-width: 2.8 !important;
        stroke-opacity: 1;
        fill: currentColor;
      }
    `
            ];
        }
        oneRender(force = false) {
            super.oneRender(force);
        }
        render() {
            return $ `
      <svg></svg>
    `;
        }
        canvasSize() {
            return [76, 76];
        }
        draw(svg, size) {
            ellipse(svg, size[0] / 2, size[1] / 2, Math.floor(size[0] * 0.8), Math.floor(0.8 * size[1]));
            this.knob = ellipse(svg, 0, 0, 20, 20);
            this.knob.classList.add('knob');
            svg.appendChild(this.knob);
            this.updateCursor();
        }
        updateCursor() {
            if (this.knob) {
                const position = [
                    Math.round(38 + 25 * Math.cos(this.value * Math.PI * 2)),
                    Math.round(38 + 25 * Math.sin(this.value * Math.PI * 2))
                ];
                this.knob.style.transform = `translate3d(${position[0]}px, ${position[1]}px, 0) rotateZ(${Math.round(this.value * 360 * 2)}deg)`;
            }
        }
        updated() {
            super.updated();
            if (this.spinning) {
                this.startSpinner();
            }
            else {
                this.stopSpinner();
            }
        }
        startSpinner() {
            this.stopSpinner();
            this.value = 0;
            this.timerstart = 0;
            this.nextTick();
        }
        stopSpinner() {
            if (this.frame) {
                window.cancelAnimationFrame(this.frame);
                this.frame = 0;
            }
        }
        nextTick() {
            this.frame = window.requestAnimationFrame((t) => this.tick(t));
        }
        tick(t) {
            if (this.spinning) {
                if (!this.timerstart) {
                    this.timerstart = t;
                }
                this.value = Math.min(1, (t - this.timerstart) / this.duration);
                this.updateCursor();
                if (this.value >= 1) {
                    this.value = 0;
                    this.timerstart = 0;
                }
                this.nextTick();
            }
            else {
                this.frame = 0;
            }
        }
    };
    __decorate([
        e({ type: Boolean }),
        __metadata("design:type", Object)
    ], exports.OneSpinner.prototype, "spinning", void 0);
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Object)
    ], exports.OneSpinner.prototype, "duration", void 0);
    exports.OneSpinner = __decorate([
        n$1('one-spinner')
    ], exports.OneSpinner);

    exports.OneItem = class OneItem extends OneBase {
        constructor() {
            super(...arguments);
            this.value = '';
            this.name = '';
            this.selected = false;
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        font-size: 14px;
        text-align: left;
      }
      button {
        cursor: pointer;
        outline: none;
        overflow: hidden;
        color: inherit;
        user-select: none;
        position: relative;
        font-family: inherit;
        text-align: inherit;
        font-size: inherit;
        letter-spacing: 1.25px;
        padding: 1px 10px;
        min-height: 36px;
        text-transform: inherit;
        background: none;
        border: none;
        transition: background-color 0.3s ease, color 0.3s ease;
        width: 100%;
        box-sizing: border-box;
        white-space: nowrap;
      }
      button.selected {
        color: var(--one-item-selected-color, #fff);
      }
      button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: currentColor;
        opacity: 0;
      }
      button span {
        display: inline-block;
        transition: transform 0.2s ease;
        position: relative;
      }
      button:active span {
        transform: scale(1.02);
      }
      #overlay {
        display: none;
      }
      button.selected #overlay {
        display: block;
      }
      svg path {
        stroke: var(--one-item-selected-bg, #000);
        stroke-width: 2.75;
        fill: transparent;
        transition: transform 0.05s ease;
      }
      @media (hover: hover) {
        button:hover::before {
          opacity: 0.05;
        }
      }
      `
            ];
        }
        render() {
            return $ `
    <button class="${this.selected ? 'selected' : ''}">
      <div id="overlay"><svg></svg></div>
      <span><slot></slot></span>
    </button>`;
        }
        canvasSize() {
            const s = this.getBoundingClientRect();
            return [s.width, s.height];
        }
        draw(svg, size) {
            const rectangle = polygon(svg, [[0, 0], [size[0], 0], [size[0], size[1]], [0, size[1]]]);
            rectangle.style.fill = 'red';
        }
    };
    __decorate([
        e(),
        __metadata("design:type", Object)
    ], exports.OneItem.prototype, "value", void 0);
    __decorate([
        e(),
        __metadata("design:type", Object)
    ], exports.OneItem.prototype, "name", void 0);
    __decorate([
        e({ type: Boolean }),
        __metadata("design:type", Object)
    ], exports.OneItem.prototype, "selected", void 0);
    exports.OneItem = __decorate([
        n$1('one-item')
    ], exports.OneItem);

    exports.OneListbox = class OneListbox extends OneBase {
        constructor() {
            super(...arguments);
            this.itemNodes = [];
            this.itemClickHandler = this.onItemClick.bind(this);
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
        :host {
          display: inline-block;
          position: relative;
          font-family: inherit;
          padding: 5px;
          outline: none;
        }
        :host(:focus) path {
          stroke-width: 1.5;
        }
        ::slotted(one-item) {
          display: block;
        }
      `
            ];
        }
        render() {
            return $ `
    <slot id="slot" @slotchange="${() => this.requestUpdate()}"></slot>
    <div id="overlay">
        <svg id="svg"></svg>
    </div>
    `;
        }
        firstUpdated() {
            this.setAttribute('role', 'listbox');
            this.tabIndex = +((this.getAttribute('tabindex') || 0));
            // FIXME: delay the selection to refresh correctly
            setTimeout(() => {
                this.refreshSelection();
            }, 100);
            this.addEventListener('click', this.itemClickHandler);
        }
        updated() {
            super.updated();
            if (!this.itemNodes.length) {
                this.itemNodes = [];
                const nodes = this.shadowRoot.getElementById('slot').assignedNodes();
                if (nodes === null || nodes === void 0 ? void 0 : nodes.length) {
                    for (let i = 0; i < nodes.length; i++) {
                        const element = nodes[i];
                        if (element.tagName === 'ONE-ITEM') {
                            element.setAttribute('role', 'option');
                            this.itemNodes.push(element);
                        }
                    }
                }
            }
        }
        onItemClick(event) {
            event.stopPropagation();
            this.selected = event.target.value;
            this.refreshSelection();
            this.fireSelected();
        }
        fireSelected() {
            this.fire('selected', { selected: this.selected });
        }
        refreshSelection() {
            if (this.lastSelectedItem) {
                this.lastSelectedItem.selected = false;
                this.lastSelectedItem.removeAttribute('aria-selected');
            }
            const slot = this.shadowRoot.getElementById('slot');
            const nodes = slot.assignedNodes();
            if (nodes) {
                let selectedItem = null;
                for (let i = 0; i < nodes.length; i++) {
                    const element = nodes[i];
                    if (element.tagName === 'ONE-ITEM') {
                        const value = element.value || '';
                        if (this.selected && (value === this.selected)) {
                            selectedItem = element;
                            break;
                        }
                    }
                }
                this.lastSelectedItem = selectedItem || undefined;
                if (this.lastSelectedItem) {
                    this.lastSelectedItem.selected = true;
                    this.lastSelectedItem.setAttribute('aria-selected', 'true');
                }
                if (selectedItem) {
                    this.value = {
                        value: selectedItem.value || '',
                        text: selectedItem.textContent || ''
                    };
                }
                else {
                    this.value = undefined;
                }
            }
        }
        canvasSize() {
            const size = this.getBoundingClientRect();
            return [size.width, size.height];
        }
        draw(svg, size) {
            rectangle(svg, 0, 0, size[0], size[1]);
        }
    };
    __decorate([
        e({ type: Object }),
        __metadata("design:type", Object)
    ], exports.OneListbox.prototype, "value", void 0);
    __decorate([
        e({ type: String }),
        __metadata("design:type", String)
    ], exports.OneListbox.prototype, "selected", void 0);
    exports.OneListbox = __decorate([
        n$1('one-listbox')
    ], exports.OneListbox);

    exports.OneCombo = class OneCombo extends s {
        constructor() {
            super(...arguments);
            this.disabled = false;
            this.cardShowing = false;
            this.itemNodes = [];
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        outline: none;
        opacity: 0;
      }
      :host(.one-disabled) {
        opacity: 0.5 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.02);
      }
      :host(.one-rendered) {
        opacity: 1;
      }
      :host(:focus) path {
        stroke-width: 1.5;
      }
      #container {
        white-space: nowrap;
        position: relative;
      }
      .inline {
        display: inline-block;
        vertical-align: top
      }
      #textPanel {
        min-width: 90px;
        min-height: 18px;
        padding: 8px;
      }    
      #dropPanel {
        width: 34px;
        cursor: pointer;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
      svg {
        display: block;
      }    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }
      #card {
        display: block;
        position: absolute;
        z-index: 1;
        box-shadow: 1px 5px 15px -6px rgba(1, 1, 1, 0.8);
        padding: 8px;
        border: 1px solid white;
      }  
      ::slotted(one-item) {
        display: block;
      }
    `
            ];
        }
        render() {
            return $ `
    <div id="container" @click="${this.onCombo}">
      <div id="textPanel" class="inline">
        <span>${this.value && this.value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg></svg>
      </div>
    </div>
    <one-card id="card" tabindex="-1" role="listbox" @click="${this.onItemClick}" @mousedown="${this.onItemClick}" @touchstart="${this.onItemClick}" style="display: none;">
      <slot id="slot"></slot>
    </one-card>
    `;
        }
        firstUpdated() {
            this.setAttribute('role', 'combobox');
            this.setAttribute('aria-haspopup', 'listbox');
            this.refreshSelection();
        }
        refreshDisabledState() {
            if (this.disabled) {
                this.classList.add('one-disabled');
            }
            else {
                this.classList.remove('one-disabled');
            }
        }
        updated(changed) {
            if (changed) {
                this.refreshDisabledState();
            }
            const svg = this.svg;
            while (svg.hasChildNodes()) {
                svg.removeChild(svg.lastChild);
            }
            const s = this.shadowRoot.getElementById('container').getBoundingClientRect();
            svg.setAttribute('width', `${s.width}`);
            svg.setAttribute('height', `${s.height}`);
            const textBounds = this.shadowRoot.getElementById('textPanel').getBoundingClientRect();
            this.shadowRoot.getElementById('dropPanel').style.minHeight = textBounds.height + 'px';
            rectangle(svg, 0, 0, textBounds.width, textBounds.height);
            const dropX = textBounds.width;
            rectangle(svg, dropX, 0, 34, textBounds.height);
            const dropOffset = Math.max(0, Math.abs((textBounds.height - 24) / 2));
            const poly = polygon(svg, [
                [dropX + 8, 5 + dropOffset],
                [dropX + 26, 5 + dropOffset],
                [dropX + 17, dropOffset + Math.min(textBounds.height, 18)]
            ]);
            poly.style.fill = 'currentColor';
            poly.style.cursor = 'pointer';
            this.classList.add('one-rendered');
            this.setAttribute('aria-expanded', `${this.cardShowing}`);
            if (!this.itemNodes.length) {
                this.itemNodes = [];
                const nodes = this.shadowRoot.getElementById('slot').assignedNodes();
                if (nodes && nodes.length) {
                    for (let i = 0; i < nodes.length; i++) {
                        const element = nodes[i];
                        if (element.tagName === 'ONE-ITEM') {
                            element.setAttribute('role', 'option');
                            this.itemNodes.push(element);
                        }
                    }
                }
            }
        }
        refreshSelection() {
            if (this.lastSelectedItem) {
                this.lastSelectedItem.selected = false;
                this.lastSelectedItem.removeAttribute('aria-selected');
            }
            setTimeout(() => {
                const slot = this.shadowRoot.getElementById('slot');
                const nodes = slot.assignedNodes();
                if (nodes) {
                    let selectedItem = null;
                    for (let i = 0; i < nodes.length; i++) {
                        const element = nodes[i];
                        if (element.tagName === 'ONE-ITEM') {
                            const value = element.value || element.getAttribute('value') || '';
                            if (this.selected && (value === this.selected)) {
                                selectedItem = element;
                                break;
                            }
                        }
                    }
                    this.lastSelectedItem = selectedItem || undefined;
                    if (this.lastSelectedItem) {
                        this.lastSelectedItem.selected = true;
                        this.lastSelectedItem.setAttribute('aria-selected', 'true');
                    }
                    if (selectedItem) {
                        this.value = {
                            value: selectedItem.value || '',
                            text: selectedItem.textContent || ''
                        };
                        this.selected = selectedItem.value;
                    }
                    else {
                        this.value = undefined;
                    }
                }
            }, 10);
        }
        setCardShowing(showing) {
            if (this.card) {
                this.cardShowing = showing;
                this.card.style.display = showing ? '' : 'none';
                if (showing) {
                    setTimeout(() => {
                        const nodes = this.shadowRoot.getElementById('slot').assignedNodes().filter((d) => {
                            return d.nodeType === Node.ELEMENT_NODE;
                        });
                        nodes.forEach(node => {
                            const e = node;
                            if (e.requestUpdate) {
                                e.requestUpdate();
                            }
                        });
                    }, 10);
                }
                this.setAttribute('aria-expanded', `${this.cardShowing}`);
            }
        }
        onItemClick(event) {
            event.stopPropagation();
            this.selected = event.target.value;
            this.refreshSelection();
            setTimeout(() => {
                this.setCardShowing(false);
            });
        }
        onCombo(event) {
            event.stopPropagation();
            this.setCardShowing(!this.cardShowing);
        }
    };
    __decorate([
        e({ type: Object }),
        __metadata("design:type", Object)
    ], exports.OneCombo.prototype, "value", void 0);
    __decorate([
        e({ type: String, reflect: true }),
        __metadata("design:type", String)
    ], exports.OneCombo.prototype, "selected", void 0);
    __decorate([
        e({ type: Boolean, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneCombo.prototype, "disabled", void 0);
    __decorate([
        i('svg'),
        __metadata("design:type", SVGSVGElement)
    ], exports.OneCombo.prototype, "svg", void 0);
    __decorate([
        i('#card'),
        __metadata("design:type", HTMLDivElement)
    ], exports.OneCombo.prototype, "card", void 0);
    exports.OneCombo = __decorate([
        n$1('one-combo')
    ], exports.OneCombo);

    exports.OneTextarea = class OneTextarea extends OneBase {
        constructor() {
            super(...arguments);
            this.placeholder = '';
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: inline-block;
        position: relative;
        font-family: sans-serif;
        width: 200px;
        outline: none;
        padding: 4px;
      }
      textarea {
        position: relative;
        outline: none;
        border: none;
        resize: none;
        background: inherit;
        color: inherit;
        width: 100%;
        font-size: inherit;
        line-height: inherit;
        text-align: inherit;
        padding: 10px;
        box-sizing: border-box;
      }
    `
            ];
        }
        render() {
            return $ `
    <textarea id="textarea" placeholder="${this.placeholder}"></textarea>
    <div id="overlay">
      <svg></svg>
    </div>
    `;
        }
        get textarea() {
            return this.textareaInput;
        }
        canvasSize() {
            const size = this.getBoundingClientRect();
            return [size.width, size.height];
        }
        draw(svg, size) {
            rectangle(svg, 4, 4, size[0] - 4, size[1] - 4);
        }
    };
    __decorate([
        e({ type: String }),
        __metadata("design:type", Object)
    ], exports.OneTextarea.prototype, "placeholder", void 0);
    __decorate([
        i('textarea'),
        __metadata("design:type", HTMLTextAreaElement)
    ], exports.OneTextarea.prototype, "textareaInput", void 0);
    exports.OneTextarea = __decorate([
        n$1('one-textarea')
    ], exports.OneTextarea);

    exports.OneDivider = class OneDivider extends OneBase {
        constructor() {
            super();
            this.elevation = 1;
            this.roAttached = false;
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
      :host {
        display: block;
        position: relative;
      }
      `
            ];
        }
        render() {
            return $ `<svg></svg>`;
        }
        canvasSize() {
            const size = this.getBoundingClientRect();
            const elev = Math.min(Math.max(1, this.elevation), 5);
            return [size.width, elev * 6];
        }
        draw(svg, size) {
            const elev = Math.min(Math.max(1, this.elevation), 5);
            for (let i = 0; i < elev; i++) {
                line(svg, 0, (i * 6) + 3, size[0], (i * 6) + 3);
            }
        }
        updated() {
            super.updated();
            this.attachResizeListener();
        }
        disconnectedCallback() {
            this.detachResizeListener();
        }
        attachResizeListener() {
            if (!this.roAttached) {
                if (this.resizeObserver) {
                    this.resizeObserver.observe(this);
                }
                else if (!this.windowResizeHandler) {
                    this.windowResizeHandler = () => this.oneRender();
                    window.addEventListener('resize', this.windowResizeHandler, { passive: true });
                }
                this.roAttached = true;
            }
        }
        detachResizeListener() {
            if (this.resizeObserver) {
                this.resizeObserver.unobserve(this);
            }
            if (this.windowResizeHandler) {
                window.removeEventListener('resize', this.windowResizeHandler);
            }
            this.roAttached = false;
        }
    };
    __decorate([
        e({ type: Number }),
        __metadata("design:type", Object)
    ], exports.OneDivider.prototype, "elevation", void 0);
    exports.OneDivider = __decorate([
        n$1('one-divider'),
        __metadata("design:paramtypes", [])
    ], exports.OneDivider);

    exports.OneDialog = class OneDialog extends s {
        constructor() {
            super(...arguments);
            this.open = false;
        }
        static get styles() {
            return r$2 `
      #container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: var(--one-dialog-z-index, 100);
      }
      #container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      #overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transform: translateY(150px);
        transition: transform 0.5s ease, opacity 0.5s ease;
      }
      .content {
        text-align: center;
        padding: 50px;
        overflow-y: visible;
        overflow-x: hidden;
      }
      :host([open]) #container {
        pointer-events: auto;
        background: rgba(0, 0, 0, 1);
      }
      :host([open]) #container::before {
        opacity: 1;
      }
      :host([open]) #overlay {
        opacity: 1;
        transform: none;
      }
    `;
        }
        render() {
            return $ `
      <div id="container">
        <div id="overlay" class="vertical layout">
          <div class="flex"></div>
          <div class="content">
            <one-card><slot></slot></one-card>
          </div>
          <div class="flex"></div>
        </div>
      </div>
    `;
        }
        updated() {
            if (this.card) {
                this.card.oneRender(true);
            }
        }
    };
    __decorate([
        e({ type: Boolean, reflect: true }),
        __metadata("design:type", Object)
    ], exports.OneDialog.prototype, "open", void 0);
    __decorate([
        i('one-card'),
        __metadata("design:type", exports.OneCard)
    ], exports.OneDialog.prototype, "card", void 0);
    exports.OneDialog = __decorate([
        n$1('one-dialog')
    ], exports.OneDialog);

    exports.OneTab = class OneTab extends OneBase {
        constructor() {
            super(...arguments);
            this.name = '';
            this.label = '';
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
      `
            ];
        }
        render() {
            return $ `
      <div>
        <slot @slotchange="${this.oneRender}"></slot>
      </div>
      <div id="overlay"><svg></svg></div>
    `;
        }
        canvasSize() {
            const s = this.getBoundingClientRect();
            return [s.width, s.height];
        }
        draw(svg, s) {
            rectangle(svg, 2, 2, s[0] - 4, s[1] - 4);
        }
    };
    __decorate([
        e({ type: String }),
        __metadata("design:type", Object)
    ], exports.OneTab.prototype, "name", void 0);
    __decorate([
        e({ type: String }),
        __metadata("design:type", Object)
    ], exports.OneTab.prototype, "label", void 0);
    exports.OneTab = __decorate([
        n$1('one-tab')
    ], exports.OneTab);

    exports.OneTabs = class OneTabs extends s {
        constructor() {
            super(...arguments);
            this.pages = [];
            this.pageMap = new Map();
        }
        static get styles() {
            return [
                BaseCSS,
                r$2 `
        :host {
          display: block;
          opacity: 1;
        }
        ::slotted(.hidden) {
          display: none !important;
        }
        :host ::slotted(.hidden) {
          display: none !important;
        }
        :host(.circle) {
          position: absolute;
          top: 50px;
          left: 0;
          padding: 0 50px;
        }
        #bar {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
          justify-content: center;
        }
      `
            ];
        }
        render() {
            return $ `
      <div id="bar">
        ${this.pages.map((p) => $ `
          <one-item role="tab" .value="${p.name}" .selected="${p.name === this.selected}" ?aria-selected="${p.name === this.selected}"
            @click="${() => this.selected = p.name}">${p.label || p.name}</one-item>
        `)}
      </div>
      <div>
        <slot @slotchange="${this.mapPages}"></slot>
      </div>
    `;
        }
        mapPages() {
            this.pages = [];
            this.pageMap.clear();
            if (this.slotElement) {
                const assigned = this.slotElement.assignedNodes();
                if (assigned && assigned.length) {
                    for (let i = 0; i < assigned.length; i++) {
                        const n = assigned[i];
                        if (n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() === 'one-tab') {
                            const e = n;
                            this.pages.push(e);
                            const name = e.getAttribute('name') || '';
                            if (name) {
                                name.trim().split(' ').forEach((nameSegment) => {
                                    if (nameSegment) {
                                        this.pageMap.set(nameSegment, e);
                                    }
                                });
                            }
                        }
                    }
                    if (!this.selected) {
                        if (this.pages.length) {
                            this.selected = this.pages[0].name;
                        }
                    }
                    this.requestUpdate();
                }
            }
        }
        firstUpdated() {
            this.mapPages();
            this.tabIndex = +((this.getAttribute('tabIndex') || 0));
        }
        updated() {
            if (hasCircleContainer(this)) {
                if (!this.classList.contains('circle')) {
                    this.classList.add('circle');
                }
            }
            const newPage = this.getElement();
            for (let i = 0; i < this.pages.length; i++) {
                const p = this.pages[i];
                if (p === newPage) {
                    p.classList.remove('hidden');
                }
                else {
                    p.classList.add('hidden');
                }
            }
            this.current = newPage || undefined;
            if (this.current && this.current.oneRender) {
                requestAnimationFrame(() => requestAnimationFrame(() => this.current.oneRender()));
            }
        }
        getElement() {
            let e = undefined;
            if (this.selected) {
                e = this.pageMap.get(this.selected);
            }
            if (!e) {
                e = this.pages[0];
            }
            return e || null;
        }
    };
    __decorate([
        e({ type: String }),
        __metadata("design:type", String)
    ], exports.OneTabs.prototype, "selected", void 0);
    __decorate([
        i('slot'),
        __metadata("design:type", HTMLSlotElement)
    ], exports.OneTabs.prototype, "slotElement", void 0);
    exports.OneTabs = __decorate([
        n$1('one-tabs')
    ], exports.OneTabs);

    Object.defineProperty(exports, '__esModule', { value: true });

})));
