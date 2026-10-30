BY: SILVIA DANIELA CASTILLO FINOL

# PokeMemory

PokeMemory is a browser-based Pokémon memory game built with vanilla JavaScript and Vite. Create a player profile with a favorite Pokémon, choose an even number of cards, and find all matching pairs as quickly as you can. Completed games are saved in a local ranking.

## Features

- Create a player profile with a username and a favorite Pokémon.
- Look up Pokémon by name or Pokédex ID.
- Play a memory game using randomly selected Pokémon from the first 151 Pokémon.
- Choose the number of cards for a game (an even number, with a minimum of 2).
- Track elapsed time and restart a game.
- View completed results in a ranking stored in the browser.
- Keep the active profile for the current browser session.

## Requirements

- Node.js and npm
- An internet connection to load Pokémon data and artwork from [PokéAPI](https://pokeapi.co/)

## Getting started

Install the project dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |

## How to play

1. Enter a username and search for a favorite Pokémon to create your profile.
2. Enter an even card count and select **Comenzar**.
3. Turn over two cards at a time and match each Pokémon pair.
4. Find all pairs to finish the game and save your time to the ranking.

Use **Reiniciar** to clear the current board, or log out to return to profile creation.

## Data and services

Pokémon details and artwork are fetched from the PokéAPI Pokémon endpoint. The app stores the active profile in `sessionStorage` and completed game results in `localStorage`; this data stays in the current browser and is not sent to a project backend.

## Project structure

```text
src/
├── logic/game.js          # Card flipping and pair matching
├── services/pokeapi.js    # Pokémon API requests
├── utils/storage.js       # Session and ranking storage
├── main.js                # App markup, events, timer, and ranking UI
├── style.css              # Main stylesheet entry point
└── ui/styles.css          # UI styles
index.html                 # HTML entry point
```

App: https://midterm-poke-memory.vercel.app/
Video (demo): https://youtu.be/xtMsPPZRswg
