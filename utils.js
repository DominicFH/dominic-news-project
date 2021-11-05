// Take array of objects and turn into usable INSERT array
// For each object in the array, store its values in a nested array
exports.extractData = (dataArray, arrayOfValueNames) => {
	const formattedData = [];
	dataArray.forEach((indObject) => {
		formattedObj = [];
		arrayOfValueNames.forEach((value) => {
			formattedObj.push(indObject[value]);
		});
		formattedData.push(formattedObj);
	});
	return formattedData;
};

//Util function to confirm if requested data is found in database
exports.validateQueryOutput = (queryOutput) => {
	if (!queryOutput[0]) {
		return Promise.reject({
			status: 404,
			message: "No data found",
		});
	} else {
		return queryOutput;
	}
};

// Util function to respond to an invalid request made on a valid path
exports.forbiddenMethod = (req, res) => {
	res.status(405).send({ message: "Method not available" });
};
