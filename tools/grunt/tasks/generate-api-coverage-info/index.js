exports.scanObject = (obj) => {
	const collected = [],
		traverse = (location, currentObj) => {

			for (const key of Object.keys(currentObj)) {
				const value = currentObj[key];

				if (key.startsWith('_') || !value) {
					continue;
				}

				switch (typeof value) {
					case "object":
						traverse([...location, key], value);
						break;
					case "function":
						collected.push({
							name: key,
							type: "function",
							location
						});
						break;
					default:
						collected.push({
							name: key,
							type: "option",
							location
						})
						break;
				}
			}
		};

	traverse(["tau"], obj);
	return collected;
}

exports.generateCSV = (data) => {
	const csvContent = "name,type,location\n";

	return csvContent + data.map((elem) => {
		return [elem.name, elem.type, elem.location.join(".")].join(",")
	}
	).join("\n");
}
