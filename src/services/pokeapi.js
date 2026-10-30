const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
let pokemonNames = null;

export async function getPokemon(pokemonSelected) {
    //to clean the input parameter 
    const pokemonFormatted = String(pokemonSelected).toLowerCase().trim();
    
    //we ask for the api response
    if (!pokemonFormatted) {
        return null;
    }

    try {
        return fetch(`${BASE_URL}/${pokemonFormatted}`)
            .then(async (response) => {
                if (response.status == 200) {
                        const fullData = await response.json();
                        return {
                            id: fullData.id,
                            name: fullData.name,
                            image: fullData.sprites.other[`official-artwork`]?.front_default || fullData.sprites.front_default
                        };
                }
            })
            .catch((error) => console.error(error));
    } catch (error) {
        console.error('Error getting pokemon', error);
        return null;
    }
}

export async function getRandomPokemon(count) {   
    const randomId = new Set ();
    while (randomId.size < count) {
        randomId.add(Math.floor(Math.random() * 151) + 1);
    }
    const promises = Array.from(randomId).map(id => getPokemon(id));
    const pokemons = await Promise.all(promises);

    return pokemons.filter(pokemon => pokemon !== null);
}

export async function loadPokemonNames() {
    if (pokemonNames?.length) return pokemonNames;
    try {
        const response = await fetch(`${BASE_URL}?limit=151`);
        if (!response.ok) {
            throw new Error('Error al cargarr la lista de pokemons');
        }

        const data = await response.json();
        pokemonNames = data.results.map(pokemon => pokemon.name);
        return pokemonNames;
    } catch (error) {
        console.error('Error al obtener la lista de nombres de los pokemons', error);
        return [];
    } 

}