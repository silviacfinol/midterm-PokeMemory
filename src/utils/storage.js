const SESSION_KEY = 'poke_session';
const RANKING_KEY = 'poke_ranking';

//Bloque de gestion de la sesion activa
export function saveSession(profile) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
}

export function getSession() {
    const data =sessionStorage.getItem(SESSION_KEY);
    if (data != null) {
        return JSON.parse(data);
    }
    return null;
}

export function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}

//Bloque de gestion del ranking e historial
export function getRanking() {
    const data = localStorage.getItem(RANKING_KEY);
    if (data != null) {
        return JSON.parse(data);
    }
    return null;
}

export function saveResults(gameData) {
    const ranking = getRanking();
    ranking.push(gameData);
    localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
}