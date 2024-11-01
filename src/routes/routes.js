const { Router } = require("express");
const express = require("express");
const router = express.Router();
const pokemonData = require("../data/pokemonData");

router.get("/", (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const result = pokemonData.slice(startIndex, endIndex);

  res.status(200).json(result);
});

router.get("/search", (req, res) => {
  const query = req.query.q.toLowerCase();
  console.log(">>>query", query);
  const nameResult = pokemonData.filter((pokemon) =>
    pokemon.Name.toLowerCase().includes(query)
  );
  res.send(nameResult);
});

router.get("/type", (req, res) => {
  const query = req.query.q.charAt(0).toUpperCase() + req.query.q.slice(1);
  const typeResult = pokemonData.filter((pokemon) =>
    pokemon.types.includes(query)
  );
  res.send(typeResult);
});

router.get("/:pokemonId", (req, res) => {
  const pokemonId = Number(req.params.pokemonId);
  console.log(pokemonId, "pokemonID");
  const pokemonIndex = pokemonData.findIndex(
    (pokemon) => pokemon.id === pokemonId
  );
  if (pokemonIndex !== -1) {
    const result = [
      pokemonData[
        pokemonIndex + 1 >= pokemonData.length ? 0 : pokemonIndex + 1
      ],
      pokemonData[pokemonIndex],
      pokemonData[
        pokemonIndex - 1 < 0 ? pokemonData.length - 1 : pokemonIndex - 1
      ],
    ].filter(Boolean);
    res.send(result);
  } else {
    res.status(404).send("No pokemon found");
  }
});

module.exports = router;
