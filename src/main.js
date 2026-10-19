import { getSession, saveSession, clearSession, getRanking, saveResults } from './utils/storage.js';
import { getPokemon, getRandomPokemon } from './services/pokeapi.js';

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
    renderRanking(); 
    const profile = getSession();
    if (profile !== null) {
        sectionLogin.style.display = 'none';
        sectionGame.style.display = 'block';
        sectionRanking.style.display = 'block';
        userBar.style.display = 'block';
        userNameSpan.textContent = profile.username;
        if (profile.pokemon && profile.pokemon.image){
            userPokemonFavDiv.innerHTML = `<img src="${profile.pokemon.image}" alt="${profile.pokemon.name}" title="${profile.pokemon.name}" width="35">`;
        } else {
            userPokemonFavDiv.innerHTML = '';
        }
    } else {
        sectionLogin.style.display = 'block';
        sectionGame.style.display = 'none';
        sectionRanking.style.display = 'none';
        userBar.style.display = 'none';
    }
}

init();
//===============================
//    Manejo de envio del form 
//===============================

profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const pokemonQuery = pokemonSearchInput.value.trim();

    if (!username || !pokemonQuery) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const pokemon = await getPokemon(pokemonQuery);

    if (!pokemon) {
        alert('No se encontró el Pokémon. Por favor, intenta con otro nombre o ID.');
        return;
    }

    saveSession({ 
        username: username, 
        pokemon: pokemon
    });

    profileForm.reset();
    init();

})

pokemonSearchInput.addEventListener('change', async () => {
    const query = pokemonSearchInput.value.trim();
    if (!query) {
        return;
    }

    const pokemon = await getPokemon(query);
    if (pokemon) {
        namePokemonSpan.textContent = `Pokemon: ${pokemon.name}`;
        pokemonImgPreview.src = pokemon.image;
        pokemonImgPreview.alt = pokemon.name;
    } else {
        namePokemonSpan.textContent = 'Pokemon: No encontrado';
        pokemonImgPreview.src = '';
    }
});

logoutBtn.addEventListener('click', () => {
    clearSession();
    init();
});

//===============================
//           Botones
//===============================

startGameBtn.addEventListener('click', async() => {
    resetGameLogic();
    const cardCount = parseInt(cardCountInput.value);
    if (!cardCount || cardCount < 2 || cardCount % 2 !== 0) {
        alert('Por favor, ingresa un número par válido (mínimo 2).');
        return;
    }

    const uniquePokemons = await getRandomPokemon(cardCount / 2);

    const cardsData = [...uniquePokemons, ...uniquePokemons]

    cardsData.sort(() => Math.random() - 0.5);

    
    gameBoard.innerHTML = '';
    
    cardsData.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.pokemonId = pokemon.id;

        card.innerHTML = `<img src="${pokemon.image}" alt="${pokemon.name}">`;

        card.addEventListener('click', () => {
            flipCards(card, cardCount / 2, handleWin);
        });
        gameBoard.appendChild(card);
    });

    startTimer();

});

resetGameBtn.addEventListener('click', () =>{
    clearInterval(timerInterval);

    timerSpan.textContent = '00:00';
    resetGameLogic();

    gameBoard.innerHTML = '';
});

// ========================
// Variables para el timer

let timerInterval = null;
let secondsElapsed = 0;

function startTimer() {
    clearInterval(timerInterval);

    secondsElapsed = 0;
    timerSpan.textContent = '00:00';

    timerInterval = setInterval(() => {
        secondsElapsed++;
        const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2,'0');
        const seconds = String(secondsElapsed % 60).padStart(2, '0');
        timerSpan.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function handleWin() {
    clearInterval(timerInterval);

    const finalTime = timerSpan.textContent;
    const session = getSession();
    const cardCount = parseInt(cardCountInput.value);

    // guardamos el resultado en localStorage
    saveResults({
        username : session?.username || 'Anonymous',
        pokemonFav : session?.pokemonFav || null,
        time : finalTime,
        cardCount : cardCount,
        date : new Date().toLocaleString()
    });

    renderRanking();

    alert(`¡Felicidades! Has encontrado todas la parejas en ${finalTime}.`)
}

function renderRanking () {
    const rankingData = getRanking();
    //comprobamos si hy registros
    if (!rankingData || rankingData === 0) {
        emptyRankingMsg.style.display = 'block';
        rankingTable.style.display = 'none';
        return;
    }
    //si hay datos, mostramos la tabla 
    emptyRankingMsg.style.display = 'none';
    rankingBody.style.display = 'table';
    rankingBody.innerHTML = '';

    rankingData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.username}</td>
            <td>${item.pokemonFav ? `<img src="\${item.pokemonFav}" width="30">` : '-'}</td>
            <td>${item.time}</td>
            <td>${item.date}</td>
            `;
            rankingBody.appendChild(tr);
    });
}


