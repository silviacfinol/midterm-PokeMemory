const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export async function getPokemon(pokemonSelected) {
    try {
        //para limpiar el parámetro de entrada
        const pokemonFormatted = String(pokemonSelected).toLowerCase().trim();
        //pedimos la respuesta a la API
        const response = await fetch(`${BASE_URL}/${pokemonFormatted}`)
        if (!response.ok) {
            return null;
        }
        const fullData = await response.json();
        return {
            id: fullData.id,
            name: fullData.name,
            image: fullData.sprites.other[`official-artwork`].front_default || fullData.sprites.front_default
        };
    } catch (error) {
        console.error('Error al obtener el pokemon', error);
        return null;
    }
}

export async function getRandomPokemon(count) {
    const pokemons = [];
    while (pokemons.length < count) {
        const randomId = Math.floor(Math.random() * 151) +1;
        const pokemon = await getPokemon(randomId);
        if (pokemon && !pokemons.some(p => p.id === pokemon.id)) {
            pokemons.push(pokemon);
        }
    }
    return pokemons;
}
        