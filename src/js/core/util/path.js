/*global window, ns, define, RegExp */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Path Utility
 * Object helps work with paths.
 * @class ns.util.path
 * @static
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
			"./object",
			"./selectors",
			"./DOM/attributes"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				/**
				 * Local alias for ns.util.selectors
				 * @property {Object} utilsSelectors Alias for {@link ns.util.selectors}
				 * @member ns.util.path
				 * @static
				 * @private
				 */
				utilsSelectors = ns.util.selectors,
				/**
				 * Local alias for ns.util.DOM
				 * @property {Object} utilsDOM Alias for {@link ns.util.DOM}
				 * @member ns.util.path
				 * @static
				 * @private
				 */
				utilsDOM = ns.util.DOM,
				/**
				 * Cache for document base element
				 * @member ns.util.path
				 * @property {HTMLBaseElement} base
				 * @static
				 * @private
				 */
				base,
				/**
				 * location object
				 * @property {Object} location
				 * @static
				 * @private
				 * @member ns.util.path
				 */
				location = {},
				path = {
					/**
					 * href part for mark state
					 * @property {string} [uiStateKey="&ui-state"]
					 * @static
					 * @member ns.util.path
					 */
					uiStateKey: "&ui-state",

					// This scary looking regular expression parses an absolute URL or its relative
					// variants (protocol, site, document, query, and hash), into the various
					// components (protocol, host, path, query, fragment, etc that make up the
					// URL as well as some other commonly used sub-parts. When used with RegExp.exec()
					// or String.match, it parses the URL into a results array that looks like this:
					//
					//	[0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#
					//       msg-content?param1=true&param2=123
					//	[1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
					//	[2]: http://jblas:password@mycompany.com:8080/mail/inbox
					//	[3]: http://jblas:password@mycompany.com:8080
					//	[4]: http:
					//	[5]: //
					//	[6]: jblas:password@mycompany.com:8080
					//	[7]: jblas:password
					//	[8]: jblas
					//	[9]: password
					//	[10]: mycompany.com:8080
					//	[11]: mycompany.com
					//	[12]: 8080
					//	[13]: /mail/inbox
					//	[14]: /mail/
					//	[15]: inbox
					//	[16]: ?msg=1234&type=unread
					//	[17]: #msg-content?param1=true&param2=123
					//	[18]: #msg-content
					//	[19]: ?param1=true&param2=123
					//
					/**
					 * @property {RegExp} urlParseRE Regular expression for parse URL
					 * @member ns.util.path
					 * @static
					 */
					urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)((#[^\?]*)(\?.*)?)?/,

					/**
					 * Abstraction to address xss (Issue #4787) by removing the authority in
					 * browsers that auto decode it. All references to location.href should be
					 * replaced with a call to this method so that it can be dealt with properly here
					 * @method getLocation
					 * @param {string|Object} [url]
					 * @return {string}
					 * @member ns.util.path
					 */
					getLocation: function (url) {
						var uri = this.parseUrl(url || window.location.href),
							hash = uri.hash,
							search = uri.hashSearch;
						// mimic the browser with an empty string when the hash and hashSearch are empty

						hash = hash === "#" && !search ? "" : hash;
						location = uri;
						// Make sure to parse the url or the location object for the hash because using
						// location.hash is automatically decoded in firefox, the rest of the url should be from the
						// object (location unless we're testing) to avoid the inclusion of the authority
						return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash + search;
					},

					/**
					 * Return the original document url
					 * @method getDocumentUrl
					 * @member ns.util.path
					 * @param {boolean} [asParsedObject=false]
					 * @return {string|Object}
					 * @static
					 */
					getDocumentUrl: function (asParsedObject) {
						return asParsedObject ? utilsObject.copy(path.documentUrl) : path.documentUrl.href;
					},

					/**
					 * Parse a location into a structure
					 * @method parseLocation
					 * @return {Object}
					 * @member ns.util.path
					 */
					parseLocation: function () {
						return this.parseUrl(this.getLocation());
					},

					/**
					 * Parse a URL into a structure that allows easy access to
					 * all of the URL components by name.
					 * If we're passed an object, we'll assume that it is
					 * a parsed url object and just return it back to the caller.
					 * @method parseUrl
					 * @member ns.util.path
					 * @param {string|Object} url
					 * @return {Object} uri record
					 * @return {string} return.href
					 * @return {string} return.hrefNoHash
					 * @return {string} return.hrefNoSearch
					 * @return {string} return.domain
					 * @return {string} return.protocol
					 * @return {string} return.doubleSlash
					 * @return {string} return.authority
					 * @return {string} return.username
					 * @return {string} return.password
					 * @return {string} return.host
					 * @return {string} return.hostname
					 * @return {string} return.port
					 * @return {string} return.pathname
					 * @return {string} return.directory
					 * @return {string} return.filename
					 * @return {string} return.search
					 * @return {string} return.hash
					 * @return {string} return.hashSearch
					 * @static
					 */
					parseUrl: function (url) {
						var matches;

						if (typeof url === "object") {
							return url;
						}
						matches = path.urlParseRE.exec(url || "") || [];

						// Create an object that allows the caller to access the sub-matches
						// by name. Note that IE returns an empty string instead of undefined,
						// like all other browsers do, so we normalize everything so its consistent
						// no matter what browser we're running on.
						return {
							href: matches[0] || "",
							hrefNoHash: matches[1] || "",
							hrefNoSearch: matches[2] || "",
							domain: matches[3] || "",
							protocol: matches[4] || "",
							doubleSlash: matches[5] || "",
							authority: matches[6] || "",
							username: matches[8] || "",
							password: matches[9] || "",
							host: matches[10] || "",
							hostname: matches[11] || "",
							port: matches[12] || "",
							pathname: matches[13] || "",
							directory: matches[14] || "",
							filename: matches[15] || "",
							search: matches[16] || "",
							hash: matches[18] || "",
							hashSearch: matches[19] || ""
						};
					},

					/**
					 * Turn relPath into an absolute path. absPath is
					 * an optional absolute path which describes what
					 * relPath is relative to.
					 * @method makePathAbsolute
					 * @member ns.util.path
					 * @param {string} relPath
					 * @param {string} [absPath=""]
					 * @return {string}
					 * @static
					 */
					makePathAbsolute: function (relPath, absPath) {
						var absStack,
							relStack,
							directory,
							i;

						if (relPath && relPath.charAt(0) === "/") {
							return relPath;
						}

						relPath = relPath || "";
						absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";

						absStack = absPath ? absPath.split("/") : [];
						relStack = relPath.split("/");
						for (i = 0; i < relStack.length; i++) {
							directory = relStack[i];
							switch (directory) {
								case ".":
									break;
								case "..":
									if (absStack.length) {
										absStack.pop();
									}
									break;
								default:
									absStack.push(directory);
									break;
							}
						}
						return "/" + absStack.join("/");
					},

					/**
					 * Returns true if both urls have the same domain.
					 * @method isSameDomain
					 * @member ns.util.path
					 * @param {string|Object} absUrl1
					 * @param {string|Object} absUrl2
					 * @return {boolean}
					 * @static
					 */
					isSameDomain: function (absUrl1, absUrl2) {
						return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
					},

					/**
					 * Returns true for any relative variant.
					 * @method isRelativeUrl
					 * @member ns.util.path
					 * @param {string|Object} url
					 * @return {boolean}
					 * @static
					 */
					isRelativeUrl: function (url) {
						// All relative Url variants have one thing in common, no protocol.
						return path.parseUrl(url).protocol === "";
					},

					/**
					 * Returns true for an absolute url.
					 * @method isAbsoluteUrl
					 * @member ns.util.path
					 * @param {string} url
					 * @return {boolean}
					 * @static
					 */
					isAbsoluteUrl: function (url) {
						return path.parseUrl(url).protocol !== "";
					},

					/**
					 * Turn the specified relative URL into an absolute one. This function
					 * can handle all relative variants (protocol, site, document, query, fragment).
					 * @method makeUrlAbsolute
					 * @member ns.util.path
					 * @param {string} relUrl
					 * @param {string} absUrl
					 * @return {string}
					 * @static
					 */
					makeUrlAbsolute: function (relUrl, absUrl) {
						var relObj,
							absObj,
							protocol,
							doubleSlash,
							authority,
							hasPath,
							pathname,
							search,
							hash;

						if (!path.isRelativeUrl(relUrl)) {
							return relUrl;
						}

						relObj = path.parseUrl(relUrl);
						absObj = path.parseUrl(absUrl);
						protocol = relObj.protocol || absObj.protocol;
						doubleSlash = relObj.protocol ? relObj.doubleSlash : (relObj.doubleSlash || absObj.doubleSlash);
						authority = relObj.authority || absObj.authority;
						hasPath = relObj.pathname !== "";
						pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname);
						search = relObj.search || (!hasPath && absObj.search) || "";
						hash = relObj.hash;

						return protocol + doubleSlash + authority + pathname + search + hash;
					},

					/**
					 * Add search (aka query) params to the specified url.
					 * If page is embedded page, search query will be added after
					 * hash tag. It's allowed to add query content for both external
					 * pages and embedded pages.
					 * Examples:
					 * http://domain/path/index.html#embedded?search=test
					 * http://domain/path/external.html?s=query#embedded?s=test
					 * @method addSearchParams
					 * @member ns.util.path
					 * @param {string|Object} url
					 * @param {Object|string} params
					 * @return {string}
					 */
					addSearchParams: function (url, params) {
						var urlObject = path.parseUrl(url),
							paramsString = (typeof params === "object") ? this.getAsURIParameters(params) : params,
							searchChar,
							urlObjectHash = urlObject.hash;

						if (path.isEmbedded(url) && paramsString.length > 0) {
							searchChar = urlObject.hashSearch || "?";
							return urlObject.hrefNoHash + (urlObjectHash || "") + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString;
						}

						searchChar = urlObject.search || "?";
						return urlObject.hrefNoSearch + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString + (urlObjectHash || "");
					},

					/**
					 * Add search params to the specified url with hash
					 * @method addHashSearchParams
					 * @member ns.util.path
					 * @param {string|Object} url
					 * @param {Object|string} params
					 * @return {string}
					 */
					addHashSearchParams: function (url, params) {
						var urlObject = path.parseUrl(url),
							paramsString = (typeof params === "object") ? path.getAsURIParameters(params) : params,
							hash = urlObject.hash,
							searchChar = hash ? (hash.indexOf("?") < 0 ? hash + "?" : hash + "&") : "#?";

						return urlObject.hrefNoHash + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString;
					},

					/**
					 * Convert absolute Url to data Url
					 * - for embedded pages strips parameters
					 * - for the same domain as document base remove domain
					 * otherwise returns decoded absolute Url
					 * @method convertUrlToDataUrl
					 * @member ns.util.path
					 * @param {string} absUrl
					 * @param {boolean} dialogHashKey
					 * @param {Object} documentBase uri structure
					 * @return {string}
					 * @static
					 */
					convertUrlToDataUrl: function (absUrl, dialogHashKey, documentBase) {
						var urlObject = path.parseUrl(absUrl);

						if (path.isEmbeddedPage(urlObject, !!dialogHashKey)) {
							// Keep hash and search data for embedded page
							return path.getFilePath(urlObject.hash + urlObject.hashSearch, dialogHashKey);
						}
						documentBase = documentBase || path.documentBase;
						if (path.isSameDomain(urlObject, documentBase)) {
							return urlObject.hrefNoHash.replace(documentBase.domain, "");
						}

						return window.decodeURIComponent(absUrl);
					},

					/**
					 * Get path from current hash, or from a file path
					 * @method get
					 * @member ns.util.path
					 * @param {string} newPath
					 * @return {string}
					 */
					get: function (newPath) {
						if (newPath === undefined) {
							newPath = this.parseLocation().hash;
						}
						return this.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, "");
					},

					/**
					 * Test if a given url (string) is a path
					 * NOTE might be exceptionally naive
					 * @method isPath
					 * @member ns.util.path
					 * @param {string} url
					 * @return {boolean}
					 * @static
					 */
					isPath: function (url) {
						return (/\//).test(url);
					},

					/**
					 * Return a url path with the window's location protocol/hostname/pathname removed
					 * @method clean
					 * @member ns.util.path
					 * @param {string} url
					 * @param {Object} documentBase  uri structure
					 * @return {string}
					 * @static
					 */
					clean: function (url, documentBase) {
						return url.replace(documentBase.domain, "");
					},

					/**
					 * Just return the url without an initial #
					 * @method stripHash
					 * @member ns.util.path
					 * @param {string} url
					 * @return {string}
					 * @static
					 */
					stripHash: function (url) {
						return url.replace(/^#/, "");
					},

					/**
					 * Return the url without an query params
					 * @method stripQueryParams
					 * @member ns.util.path
					 * @param {string} url
					 * @return {string}
					 * @static
					 */
					stripQueryParams: function (url) {
						return url.replace(/\?.*$/, "");
					},

					/**
					 * Validation proper hash
					 * @method isHashValid
					 * @member ns.util.path
					 * @param {string} hash
					 * @static
					 */
					isHashValid: function (hash) {
						return (/^#[^#]+$/).test(hash);
					},

					/**
					 * Check whether a url is referencing the same domain, or an external domain or different
					 * protocol could be mailto, etc
					 * @method isExternal
					 * @member ns.util.path
					 * @param {string|Object} url
					 * @param {Object} documentUrl uri object
					 * @return {boolean}
					 * @static
					 */
					isExternal: function (url, documentUrl) {
						var urlObject = path.parseUrl(url);

						return urlObject.protocol && urlObject.domain !== documentUrl.domain ? true : false;
					},

					/**
					 * Check if the url has protocol
					 * @method hasProtocol
					 * @member ns.util.path
					 * @param {string} url
					 * @return {boolean}
					 * @static
					 */
					hasProtocol: function (url) {
						return (/^(:?\w+:)/).test(url);
					},

					/**
					 * Check if the url refers to embedded content
					 * @method isEmbedded
					 * @member ns.util.path
					 * @param {string} url
					 * @return {boolean}
					 * @static
					 */
					isEmbedded: function (url) {
						var urlObject = path.parseUrl(url);

						if (urlObject.protocol !== "") {
							return (!path.isPath(urlObject.hash) && !!urlObject.hash && (urlObject.hrefNoHash === path.parseLocation().hrefNoHash));
						}
						return (/\?.*#|^#/).test(urlObject.href);
					},

					/**
					 * Get the url as it would look squashed on to the current resolution url
					 * @method squash
					 * @member ns.util.path
					 * @param {string} url
					 * @param {string} [resolutionUrl=undefined]
					 * @return {string}
					 */
					squash: function (url, resolutionUrl) {
						var href,
							cleanedUrl,
							search,
							stateIndex,
							isPath = this.isPath(url),
							uri = this.parseUrl(url),
							preservedHash = uri.hash,
							uiState = "";

						// produce a url against which we can resole the provided path
						resolutionUrl = resolutionUrl || (path.isPath(url) ? path.getLocation() : path.getDocumentUrl());

						// If the url is anything but a simple string, remove any preceding hash
						// eg #foo/bar -> foo/bar
						//	#foo -> #foo
						cleanedUrl = isPath ? path.stripHash(url) : url;

						// If the url is a full url with a hash check if the parsed hash is a path
						// if it is, strip the #, and use it otherwise continue without change
						cleanedUrl = path.isPath(uri.hash) ? path.stripHash(uri.hash) : cleanedUrl;

						// Split the UI State keys off the href
						stateIndex = cleanedUrl.indexOf(this.uiStateKey);

						// store the ui state keys for use
						if (stateIndex > -1) {
							uiState = cleanedUrl.slice(stateIndex);
							cleanedUrl = cleanedUrl.slice(0, stateIndex);
						}

						// make the cleanedUrl absolute relative to the resolution url
						href = path.makeUrlAbsolute(cleanedUrl, resolutionUrl);

						// grab the search from the resolved url since parsing from
						// the passed url may not yield the correct result
						search = this.parseUrl(href).search;

						// @TODO all this crap is terrible, clean it up
						if (isPath) {
							// reject the hash if it's a path or it's just a dialog key
							if (path.isPath(preservedHash) || preservedHash.replace("#", "").indexOf(this.uiStateKey) === 0) {
								preservedHash = "";
							}

							// Append the UI State keys where it exists and it's been removed
							// from the url
							if (uiState && preservedHash.indexOf(this.uiStateKey) === -1) {
								preservedHash += uiState;
							}

							// make sure that pound is on the front of the hash
							if (preservedHash.indexOf("#") === -1 && preservedHash !== "") {
								preservedHash = "#" + preservedHash;
							}

							// reconstruct each of the pieces with the new search string and hash
							href = path.parseUrl(href);
							href = href.protocol + "//" + href.host + href.pathname + search + preservedHash;
						} else {
							href += href.indexOf("#") > -1 ? uiState : "#" + uiState;
						}

						return href;
					},

					/**
					 * Check if the hash is preservable
					 * @method isPreservableHash
					 * @member ns.util.path
					 * @param {string} hash
					 * @return {boolean}
					 */
					isPreservableHash: function (hash) {
						return hash.replace("#", "").indexOf(this.uiStateKey) === 0;
					},

					/**
					 * Escape weird characters in the hash if it is to be used as a selector
					 * @method hashToSelector
					 * @member ns.util.path
					 * @param {string} hash
					 * @return {string}
					 * @static
					 */
					hashToSelector: function (hash) {
						var hasHash = (hash.substring(0, 1) === "#");

						if (hasHash) {
							hash = hash.substring(1);
						}
						return (hasHash ? "#" : "") + hash.replace(new RegExp("([!\"#$%&'()*+,./:;<=>?@[\\]^`{|}~])", "g"), "\\$1");
					},

					/**
					 * Check if the specified url refers to the first page in the main application document.
					 * @method isFirstPageUrl
					 * @member ns.util.path
					 * @param {string} url
					 * @param {HTMLElement} firstPageElement first page element
					 * @param {string} documentBase uri structure
					 * @param {boolean} documentBaseDiffers
					 * @param {Object} documentUrl uri structure
					 * @return {boolean}
					 * @static
					 */
					isFirstPageUrl: function (url, firstPageElement, documentBase, documentBaseDiffers, documentUrl) {
						var urlStructure,
							samePath,
							firstPageId,
							hash;

						documentBase = documentBase === undefined ? path.documentBase : documentBase;
						documentBaseDiffers = documentBaseDiffers === undefined ? path.documentBaseDiffers : documentBaseDiffers;
						documentUrl = documentUrl === undefined ? path.documentUrl : documentUrl;

						// We only deal with absolute paths.
						urlStructure = path.parseUrl(path.makeUrlAbsolute(url, documentBase));

						// Does the url have the same path as the document?
						samePath = urlStructure.hrefNoHash === documentUrl.hrefNoHash || (documentBaseDiffers && urlStructure.hrefNoHash === documentBase.hrefNoHash);

						// Get the id of the first page element if it has one.
						firstPageId = firstPageElement && firstPageElement.id || false;
						hash = urlStructure.hash;

						// The url refers to the first page if the path matches the document and
						// it either has no hash value, or the hash is exactly equal to the id of the
						// first page element.
						return samePath && (!hash || hash === "#" || (firstPageId && hash.replace(/^#/, "") === firstPageId));
					},

					/**
					 * Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
					 * requests if the document doing the request was loaded via the file:// protocol.
					 * This is usually to allow the application to "phone home" and fetch app specific
					 * data. We normally let the browser handle external/cross-domain urls, but if the
					 * allowCrossDomainPages option is true, we will allow cross-domain http/https
					 * requests to go through our page loading logic.
					 * @method isPermittedCrossDomainRequest
					 * @member ns.util.path
					 * @param {Object} docUrl
					 * @param {string} reqUrl
					 * @return {boolean}
					 * @static
					 */
					isPermittedCrossDomainRequest: function (docUrl, reqUrl) {
						return ns.getConfig("allowCrossDomainPages", false) &&
							docUrl.protocol === "file:" &&
							reqUrl.search(/^https?:/) !== -1;
					},

					/**
					 * Convert a object data to URI parameters
					 * @method getAsURIParameters
					 * @member ns.util.path
					 * @param {Object} data
					 * @return {string}
					 * @static
					 */
					getAsURIParameters: function (data) {
						var url = "",
							key;

						for (key in data) {
							if (data.hasOwnProperty(key)) {
								url += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&";
							}
						}
						return url.substring(0, url.length - 1);
					},

					/**
					 * Document Url
					 * @member ns.util.path
					 * @property {string|null} documentUrl
					 */
					documentUrl: null,

					/**
					 * The document base differs
					 * @member ns.util.path
					 * @property {boolean} documentBaseDiffers
					 */
					documentBaseDiffers: false,

					/**
					 * Set location hash to path
					 * @method set
					 * @member ns.util.path
					 * @param {string} path
					 * @static
					 */
					set: function (path) {
						location.hash = path;
					},

					/**
					 * Return the substring of a file path before the sub-page key,
					 * for making a server request
					 * @method getFilePath
					 * @member ns.util.path
					 * @param {string} path
					 * @param {string} dialogHashKey
					 * @return {string}
					 * @static
					 */
					getFilePath: function (path, dialogHashKey) {
						var splitKey = "&" + ns.getConfig("subPageUrlKey", "");

						return path && path.split(splitKey)[0].split(dialogHashKey)[0];
					},

					/**
					 * Remove the preceding hash, any query params, and dialog notations
					 * @method cleanHash
					 * @member ns.util.path
					 * @param {string} hash
					 * @param {string} dialogHashKey
					 * @return {string}
					 * @static
					 */
					cleanHash: function (hash, dialogHashKey) {
						return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
					},

					/**
					 * Check if url refers to the embedded page
					 * @method isEmbeddedPage
					 * @member ns.util.path
					 * @param {string} url
					 * @param {boolean} allowEmbeddedOnlyBaseDoc
					 * @return {boolean}
					 * @static
					 */
					isEmbeddedPage: function (url, allowEmbeddedOnlyBaseDoc) {
						var urlObject = path.parseUrl(url);

						//if the path is absolute, then we need to compare the url against
						//both the documentUrl and the documentBase. The main reason for this
						//is that links embedded within external documents will refer to the
						//application document, whereas links embedded within the application
						//document will be resolved against the document base.
						if (urlObject.protocol !== "") {
							return (urlObject.hash &&
							(allowEmbeddedOnlyBaseDoc ?
								urlObject.hrefNoHash === path.documentUrl.hrefNoHash :
								urlObject.hrefNoHash === path.parseLocation().hrefNoHash));
						}
						return (/^#/).test(urlObject.href);
					}
				};

			path.documentUrl = path.parseLocation();

			base = document.querySelector("base");

			/**
			 * The document base URL for the purposes of resolving relative URLs,
			 * and the name of the default browsing context for the purposes of
			 * following hyperlinks
			 * @member ns.util.path
			 * @property {Object} documentBase uri structure
			 * @static
			 */
			path.documentBase = base ? path.parseUrl(path.makeUrlAbsolute(base.getAttribute("href"),
				path.documentUrl.href)) : path.documentUrl;

			path.documentBaseDiffers = (path.documentUrl.hrefNoHash !== path.documentBase.hrefNoHash);

			/**
			 * Get document base
			 * @method getDocumentBase
			 * @member ns.util.path
			 * @param {boolean} [asParsedObject=false]
			 * @return {string|Object}
			 * @static
			 */
			path.getDocumentBase = function (asParsedObject) {
				return asParsedObject ? utilsObject.copy(path.documentBase) : path.documentBase.href;
			};

			/**
			 * Find the closest page and extract out its url
			 * @method getClosestBaseUrl
			 * @member ns.util.path
			 * @param {HTMLElement} element
			 * @param {string} selector
			 * @return {string}
			 * @static
			 */
			path.getClosestBaseUrl = function (element, selector) {
				// Find the closest page and extract out its url.
				var url = utilsDOM.getNSData(utilsSelectors.getClosestBySelector(element, selector), "url"),
					baseUrl = path.documentBase.hrefNoHash;

				if (!ns.getConfig("dynamicBaseEnabled", true) || !url || !path.isPath(url)) {
					url = baseUrl;
				}

				return path.makeUrlAbsolute(url, baseUrl);
			};

			ns.util.path = path;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return path;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
