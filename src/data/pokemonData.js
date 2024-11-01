const fs = require("fs");
let pokemonData;

const data = fs.readFileSync("src/data/data.json", "utf8");
pokemonData = JSON.parse(data).data;

module.exports = pokemonData;
