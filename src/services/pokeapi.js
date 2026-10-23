const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export async function getPokemon(pokemonSelected) {
    try {
        //to clean the input parameter 
        const pokemonFormatted = String(pokemonSelected).toLowerCase().trim();
        
        //we ask for the api response
        if (!pokemonFormatted) {
            return null;
        }
        const response = await fetch(`${BASE_URL}/${pokemonFormatted}`);
        
        if (!response.ok) {
            return null;
        }
        const fullData = await response.json();
        return {
            id: fullData.id,
            name: fullData.name,
            image: fullData.sprites.other[`official-artwork`]?.front_default || fullData.sprites.front_default
        };
    } catch (error) {
        console.error('Error al obtener el pokemon', error);
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
        