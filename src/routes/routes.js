const { Router } = require("express");
const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const pokemonData = require("../data/pokemonData");
const pokemonTypes = require("../data/pokemonTypes.common");
const paginationMW = require("../middleware/pagination");

router.get("/pokemons", paginationMW(pokemonData), (req, res) => {
  res.status(200).json(res.paginationMW);
});

router.get("/search", (req, res) => {
  const query = req.query.q.toLowerCase();

  const nameOrIdResult = pokemonData.filter((pokemon) => {
    const nameMatch = pokemon.Name.toLowerCase().includes(query);
    const idMatch = pokemon.id.toString().includes(query);
    return nameMatch || idMatch;
  });

  res.send(nameOrIdResult);
});

router.get("/type", (req, res) => {
  const query = req.query.q.charAt(0).toUpperCase() + req.query.q.slice(1);
  const typeResult = pokemonData.filter((pokemon) =>
    pokemon.types.includes(query)
  );
  res.send(typeResult);
});

router.get("/pokemons/:pokemonId", (req, res) => {
  const pokemonIndex = pokemonData.findIndex(
    (pokemon) => pokemon.id === parseInt(req.params.pokemonId)
  );
  if (pokemonIndex !== -1) {
    const pokemon = {
      previousPokemon:
        pokemonData[
          pokemonIndex - 1 < 0 ? pokemonData.length - 1 : pokemonIndex - 1
        ],
      pokemon: pokemonData[pokemonIndex],
      nextPokemon:
        pokemonData[
          pokemonIndex + 1 >= pokemonData.length ? 0 : pokemonIndex + 1
        ],
    };
    res.json(pokemon);
  } else {
    res.status(404).send("No pokemon found");
  }
});

router.post(
  "/pokemons",
  body("id", "Pokemon id is required")
    .notEmpty()
    .isInt()
    .withMessage("ID must be integer")
    .custom(async (value) => {
      const pokemon = await pokemonData.some((p) => p.id === value);
      if (pokemon) {
        throw new Error("Pokemon ID already in use");
      }
    }),
  body("name", "Pokemon name is required")
    .notEmpty()
    .custom(async (value) => {
      const pokemon = await pokemonData.some((p) => p.Name === value);
      if (pokemon) {
        throw new Error("Pokemon name already in use");
      }
    }),
  body("types", "Pokemon type is required")
    .notEmpty()
    .isArray({
      min: 1,
      max: 2,
    })
    .withMessage("Pokémon can only have one or two types.")
    .custom(async (value) => {
      const pokemon = await pokemonTypes.some((p) => p.includes(value));
      if (pokemon) {
        throw new Error("Pokemon type already in use");
      }
    }),
  body("url", "Pokemon image is required")
    .notEmpty()
    .isURL()
    .withMessage("Not a valid image address"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newPokemon = req.body;
    pokemonData.push(newPokemon);
    res
      .status(201)
      .json({ success: "Successful Create Pokemon!", pokemon: newPokemon });
  }
);

router.delete(
  "/pokemons/:pokemonId",
  param("pokemonId", "Pokemon type is required")
    .notEmpty()
    .custom(async (value) => {
      const isExisted = await pokemonData.some((p) => p.id === parseInt(value));
      if (!isExisted) {
        throw new Error("Pokemon ID is not available");
      }
    }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const deletedItemIndex = pokemonData.findIndex(
      (p) => p.id === parseInt(req.params.pokemonId)
    );
    pokemonData.splice(deletedItemIndex);
    res
      .status(201)
      .json({ success: "Successful Delete Pokemon!", data: pokemonData });
  }
);

module.exports = router;
