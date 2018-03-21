const filterize = require("./filterizer.js");
const filters = require("./filters.js");

const xml = filterize(filters);
console.log(xml);
