module("jqm/engine", {});

test ( "jqmData" , function () {
	var elem2 = document.getElementById("elem2");

	equal($(elem2).jqmData('role'), 'button', "jqmData get");
	$(elem2).jqmData('role2', 'button2')
	equal($(elem2).jqmData('role2'), 'button2', "jqmData set");
	equal($(':jqmData(role=button)').length, 1, ":jqmData() selector");
});
