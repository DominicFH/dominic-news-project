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

//Util function to confirm if requested data exists in database
exports.validateQueryOutput = (queryOutput) => {
	if (!queryOutput[0]) {
		return Promise.reject({
			status: 404,
			message: "No article found",
		});
	} else {
		return queryOutput;
	}
};

// Util function to confirm if request body is valid
exports.validateReqBody = (queryOutput, reqBody) => {
	if (!reqBody) {
		return Promise.reject({
			status: 400,
			message: "Invalid input",
		});
	}
	return queryOutput;
};
