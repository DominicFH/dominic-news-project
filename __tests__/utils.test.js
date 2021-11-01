const { extractData } = require("../utils");

describe("extractData", () => {
	it("If passed an empty array, returns an empty array", () => {
		const input = [];
		const expected = [];
		const actual = extractData(input);
		expect(actual).toEqual(expected);
	});
	it("Input array is not mutated", () => {
		const input = [
			{
				description: "The man, the Mitch, the legend",
				slug: "mitch",
			},
		];
		extractData(input, ["description", "slug"]);
		expect(input).toEqual([
			{
				description: "The man, the Mitch, the legend",
				slug: "mitch",
			},
		]);
	});
	it("If only passed one value, extract only that single value", () => {
		const input = [
			{
				description: "The man, the Mitch, the legend",
				slug: "mitch",
			},
		];
		const expected = [["mitch"]];
		const actual = extractData(input, ["slug"]);
		expect(actual).toEqual(expected);
	});
	it("If passed multiple values, extracts those values", () => {
		const inputData = [
			{
				description: "The man, the Mitch, the legend",
				slug: "mitch",
			},
		];
		const valuesToExtract = ["description", "slug"];
		const expected = [["The man, the Mitch, the legend", "mitch"]];
		const actual = extractData(inputData, valuesToExtract);
		expect(actual).toEqual(expected);
	});
	it("Function works if passed data array with several objects", () => {
		const inputData = [
			{
				description: "The man, the Mitch, the legend",
				slug: "mitch",
			},
			{
				description: "Not dogs",
				slug: "cats",
			},
		];
		const valuesToExtract = ["description", "slug"];
		const expected = [
			["The man, the Mitch, the legend", "mitch"],
			["Not dogs", "cats"],
		];
		const actual = extractData(inputData, valuesToExtract);
		expect(actual).toEqual(expected);
	});
});
