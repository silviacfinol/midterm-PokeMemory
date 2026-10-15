import { getSession, saveSession, clearSession, getRanking, saveResults } from './utils/storage';
import { getPokemon, getRandomPokemon } from './services/pokeapi';

formProfile.addEventListener('submit', (event)) => {
    event.preventDefault();
}

const usernameProfile = document.getElementById('username').value.trim();


const profile = {
    username: usernameProfile,
    pokemon: pokemonSelected
}; 