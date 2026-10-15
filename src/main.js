import { getSession, saveSession, clearSession, getRanking, saveResults } from './utils/storage';
import { getPokemon, getRandomPokemon } from './services/pokeapi';

//===============================
// Seleccion de elementos del DOM
//===============================

//Secciones principales
const sectionLogin = document.getElementById('section-login');
const sectionGame = document.getElementById('section-game');
const sectionRanking = document.getElementById('section-ranking');

//Header
const userBar = document.getElementById('user-bar');
const userNameSpan = document.getElementById('user-name');
const userPokemonFavDiv = document.getElementById('user-pokemon-fav');
const logoutBtn = document.getElementById('logout-btn');

//Formulario de login
const profileForm = document.getElementById('profile-form');
const usernameInput = document.getElementById('username');
const pokemonSelectInput = document.getElementById('pokemon-search');
const pokemonMarchesUl = document.getElementById('pokemon-matches');
const namePokemonSpan = document.getElementById('name-pokemon');
const pokemonImgPreview = document.getElementById('pokemon-img-preview');

//Panel de juego
const cardCountInput = document.getElementById('card-count');
const startGameBtn = document.getElementById('start-game-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const timerSpan = document.getElementById('timer');
const gameBoard = document.getElementById('game-board');

//Tabla de ranking
const emptyRankingMsg = document.getElementById('empty-ranking-msg');
const rankingTable = document.getElementById('ranking-table');
const rankingBody = document.getElementById('ranking-body');

//===============================
//   Inicialización de la app
//===============================

init();

function init() {
    const profile = getSession();
    if (profile !== null) {
        sectionLogin.style.display = 'none';
        sectionGame.style.display = 'block';
        sectionRanking.style.display = 'block';
        userBar.style.display = 'block';
        userNameSpan.textContent = profile.username;
        userPokemonFavDiv.innerHTML = `<img src="${profile.pokemon.image}" alt="${profile.pokemon.name}" title="${profile.pokemon.name}" width="35">`;
        // renderRanking(); 
    } else {
        sectionLogin.style.display = 'block';
        sectionGame.style.display = 'none';
        sectionRanking.style.display = 'none';
        userBar.style.display = 'none';
    }
}


const profile = {
    username: usernameProfile,
    pokemon: pokemonSelected
}; 


formProfile.addEventListener('submit', (event)) => {
    event.preventDefault();
}

const usernameProfile = document.getElementById('username').value.trim();


