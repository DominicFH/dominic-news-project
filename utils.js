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
