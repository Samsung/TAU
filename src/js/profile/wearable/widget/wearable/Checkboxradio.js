/*global define */
/*jslint nomen: true */
/**
 * # Checkbox and radio button
 * Shows a list of options where 1 or more can be selected.
 *
 * ## Default selectors
 *
 * You can use the check box and radio box widgets to create selectable list items:
 *
 * The check box widget shows on the screen a list of options where 1 or more can be selected. To add a check box widget to the application, use the following code:
 *
 *      @example
 *      <input type="checkbox" name="myCheck" id="check-test" checked="checked"/>
 *      <label for="check-test">Checkbox</label>
 *
 * The radio widget shows a list of options on the screen where only 1 option can be selected. To add a radio check box widget to the application, use the following code:
 *
 *      @example
 *      <input type="radio" name="radioSet" id="radio-1" />
 *      <label for="radio-1">Radio</label>
 *
 * To add a check box or radio box to a list, use the following code:
 *
 *      @example
 *      <ul class="ui-listview">
 *          <li class="li-has-radio">
 *              <label>
 *                  Ringtones 1
 *                  <input type="radio"name="radioSet" id="radio-1"checked="checked" />
 *              </label>
 *          </li>
 *          <li class="li-has-radio">
 *              <label>
 *                  Ringtones 2
 *                  <input type="radio"name="radioSet" id="radio-2" />
 *              </label>
 *          </li>
 *      </ul>
 *
 * Use the following code in the *style.css* file of your application to support a wide label tap area:
 *
 *      @example
 *          .ui-listview li input[type="checkbox"],
 *          .ui-listview li input[type="radio"] {
 *              position: absolute;
 *              right: 8px;
 *              top: 0px;
 *              margin-top: 19px;
 *          }
 *          .ui-listview li.li-has-checkbox label,
 *          .ui-listview li.li-has-radio label {
 *              display: block;
 *              padding: 21px 64px 21px 16px;
 *              margin: -21px -16px -21px -16px;
 *          }
 *
 * ## JavaScript API
 *
 * Checkboxradio widget hasn't JavaScript API.
 * @class ns.widget.wearable.Checkboxradio
 */

// empty to ensure requirejs does not add anything own
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
define(function () {
	"use strict";
	return;
});
//>>excludeEnd("tauBuildExclude");

