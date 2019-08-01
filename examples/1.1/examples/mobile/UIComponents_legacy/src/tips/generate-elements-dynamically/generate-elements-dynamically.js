/*global $ */
$(document).one("pagecreate", "#dynamical-elements-demo", function () {
	var myArray = [];

	function addCheckbox() {
		var newhtml,
			i = myArray.length;

		myArray[myArray.length] = "Item - " + myArray.length;
		newhtml = "<input type=\"checkbox\" name=\"checkbox-" + i + "a\" id=\"checkbox-" + i + "a\" class=\"custom\" />";
		newhtml += "<label for=\"checkbox-" + i + "a\">" + myArray[i] + "</label>";
		$("#checkboxItems").append(newhtml).trigger("create");
	}


	$("#bAdd").on("vclick", function () {
		addCheckbox();
		return false;
	});

	$("#ButtonAdd").on("vclick", function () {
		/* Append new button */
		var buttonTemplate = "<div data-role='button' data-inline='true' " +
				"data-icon='call' data-style='circle' " +
				"data-theme='s' class='newbutton'></div>";

		$(buttonTemplate).buttonMarkup().appendTo("#buttonItems");
		$("#buttonItems").append(" ");
		return false;
		/* Same works */
		/*$("#buttonItems").trigger("create");*/
	});

	$("#ListAdd").on("vclick", function () {
		var listTemplate = "<li>Appended New Item</li>";

		$("#listview").append(listTemplate).listview("refresh");
		return false;
	});
});
