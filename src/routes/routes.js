const { Router } = require("express");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const pokemonData = require("../data/pokemonData");
const pokemonTypes = require("../data/pokemonTypes");
const paginationMW = require("../middleware/pagination");

router.get("/pokemons", paginationMW(pokemonData), (req, res) => {
  res.status(200).json(res.paginationMW);
});

router.get("/search/name", (req, res) => {
  const query = req.query.q.toLowerCase();
  const nameResult = pokemonData.filter((pokemon) =>
    pokemon.Name.toLowerCase().includes(query)
  );
  res.send(nameResult);
});

router.get("/search/type", (req, res) => {
  const query = req.query.q.charAt(0).toUpperCase() + req.query.q.slice(1);
  const typeResult = pokemonData.filter((pokemon) =>
    pokemon.types.includes(query)
  );
  res.send(typeResult);
});

router.get("/pokemons/:pokemonId", (req, res) => {
  const pokemonId = Number(req.params.pokemonId);
  const pokemonIndex = pokemonData.findIndex(
    (pokemon) => pokemon.id === pokemonId
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
  "/create",
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
    res.status(200).json({ success: "Successful Create Pokemon!" });
  }
);

router.put(
  "/update/:pokemonId",
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
    const pokemonId = Number(req.params.pokemonId);
    console.log(">>> pokemon id", pokemonId);
    const findPokemon = pokemonData.filter((p) => p.id === pokemonId);
    res.status(200).json(findPokemon);
  }
);
module.exports = router;
