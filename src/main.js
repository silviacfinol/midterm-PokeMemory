import { getSession, saveSession, clearSession, getRanking, saveResults } from './utils/storage.js';
import { getPokemon, getRandomPokemon } from './services/pokeapi.js';
import { flipCards, resetGameLogic } from './logic/game.js';

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
const selectedPokemonPreview = document.getElementById('selected-pokemon-preview');
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

// Variables para el timer
let timerInterval = null;
let secondsElapsed = 0;

//===============================
//   Inicialización de la app
//===============================

init();

function init() {
    renderRanking(); 
    const profile = getSession();
    if (profile !== null) {
        sectionLogin.classList.add('hidden');
        sectionGame.classList.remove('hidden');
        sectionRanking.classList.remove('hidden');
        userBar.classList.remove('hidden');

        userNameSpan.textContent = profile.username;

        if (profile.pokemon && profile.pokemon.image){
            userPokemonFavDiv.innerHTML = `<img src="${profile.pokemon.image}" alt="${profile.pokemon.name}" title="${profile.pokemon.name}" width="35">`;
        } else {
            userPokemonFavDiv.innerHTML = '';
        }
    } else {
        sectionLogin.classList.remove('hidden');
        sectionGame.classList.add('hidden');
        sectionRanking.classList.add('hidden'); 
        userBar.classList.add('hidden');
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
    
    if (selectedPokemonPreview) {
        selectedPokemonPreview.classList.add('hidden');
    }

    init();

})

pokemonSearchInput.addEventListener('input', async () => {
    const query = pokemonSearchInput.value.trim();
    if (!query) {
        namePokemonSpan.textContent = '';
        pokemonImgPreview.src = '';
        if (selectedPokemonPreview) {
            selectedPokemonPreview.classList.add('hidden');
            return;
        }
        return;
    }

    const pokemon = await getPokemon(query);

    if (pokemon) {
        namePokemonSpan.textContent = pokemon.name;
        pokemonImgPreview.src = pokemon.image;
        pokemonImgPreview.alt = pokemon.name;
        if (selectedPokemonPreview) {
            selectedPokemonPreview.classList.remove('hidden');
        }
    } else {
        namePokemonSpan.textContent = 'Pokemon: No encontrado';
        pokemonImgPreview.src = '';
        if (selectedPokemonPreview) {
            selectedPokemonPreview.classList.add('hidden');
        }
    }
});

logoutBtn.addEventListener('click', () => {
    clearSession();
    init();
});

//===============================
//       Event Delegation
//===============================
gameBoard.addEventListener('click', (e) => {
    const card = e.target.closest('.card');

    if (!card || gameBoard.contains(card)) return;

    flipCards(card, currentPairs, handleWin);
});

//===============================
//      Buttons management
//===============================

startGameBtn.addEventListener('click', async() => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    resetGameLogic();

    const cardCount = parseInt(cardCountInput.value, 10);
    if (!cardCount || cardCount < 2 || cardCount % 2 !== 0) {
        alert('Por favor, ingresa un número par válido (mínimo 2).');
        return;
    }

    currentPairs = cardCount / 2;

    const uniquePokemons = await getRandomPokemon(currentPairs);
    if (!uniquePokemons || uniquePokemons.length === 0) {
        alert('Ocurrió un error al cargar las cartas. Intenta de nuevo.');
        return;
    }

    const cardsData = [...uniquePokemons, ...uniquePokemons];
    cardsData.sort(() => Math.random() - 0.5);

    
    gameBoard.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    cardsData.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.pokemonId = pokemon.id;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-font">?</div>
                <div class="card-back">
                    <img src="${pokemon.image}" alt="${pokemon.name}">
                </div>
            </div>
        `;

        fragment.appendChild(card);
    });

    gameBoard.appendChild(fragment);

    startTimer();
});

resetGameBtn.addEventListener('click', () =>{
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerSpan.textContent = '00:00';
    resetGameLogic();

    gameBoard.innerHTML = '';
});

//===============================
//            Timer
//===============================
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

//===============================
//         End of game
//===============================

function handleWin() {
    clearInterval(timerInterval);

    const finalTime = timerSpan.textContent;
    const session = getSession();
    const cardCount = parseInt(cardCountInput.value, 10);

    // guardamos el resultado en localStorage
    saveResults({
        username : session?.username || 'Anonymous',
        pokemonFav : session?.pokemon || null,
        time : finalTime,
        cardCount : cardCount,
        date : new Date().toLocaleString()
    });

    renderRanking();

    alert(`¡Felicidades! Has encontrado todas la parejas en ${finalTime}.`)
}
//===============================
//           Ranking
//===============================

function renderRanking () {
    const rankingData = getRanking();
    //comprobamos si hy registros
    if (!rankingData || rankingData.length === 0) {
        emptyRankingMsg.classList.remove('hidden');
        rankingTable.classList.add('hidden');
        return;
    }
    //si hay datos, mostramos la tabla 
    emptyRankingMsg.classList.add('hidden');
    rankingBody.classList.remove('hidden');
    rankingBody.innerHTML = '';

    rankingData.forEach(item, index => {
        const tr = document.createElement('tr');
        const pokemonImg = item.pokemon?.image ? `<img src="${item.pokemon.image}" alt="${item.pokemon.name}" width="30">` : '-';
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${index.username}<td>
            <td>${pokemonImg}</td>
            <td>${item.time}</td>
            <td>${item.cardCount}</td>
            `;
            rankingBody.appendChild(tr);
    });
}


