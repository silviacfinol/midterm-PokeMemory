const SESSION_KEY = 'poke_session';
const RANKING_KEY = 'poke_ranking';

//Bloque de gestion de la sesion activa
export function saveSession(profile) {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    } catch (error) { 
        console.error('Error al guardar la sesión en sessionStorage', error);
    }
}

export function getSession() {
    try {
        const data =sessionStorage.getItem(SESSION_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error al guardar la sesión en sessionStorage', error);
    } 
    return null;
}

export function clearSession() {
    try {
        sessionStorage.removeItem(SESSION_KEY);
    } catch (error) {
        console.error('Error al eliminar la sesión:', error);
    }
}

//Bloque de gestion del ranking e historial
export function getRanking() {
    try {
        const data = localStorage.getItem(RANKING_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error al obtener el ranking de localStorage:', error);
    }
    return [];
}

export function sortedData() {
    const rankingData = getRanking();
    //to order the results
    const sortData = [...rankingData].sort((a, b) => {
        if (b.cardCount !== a.cardCount) {
            return b.cardCount - a.cardCount;
        }
        return a.time - b.time;
    });
    return sortData;
}

export function saveResults(gameData) {
    try{
        const ranking = getRanking();
        ranking.push({
            ...gameData,
            id: gameData.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
        });
        localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));

    } catch (error) {
        console.error('Error al guardar el resultado en el ranking:', error);
    }
}
