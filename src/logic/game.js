let flippedCards = [];

let matchedPairs = 0;

let lockBoard = false;

export function resetGameLogic() {
        flippedCards = [],
        matchedPairs = 0,
        lockBoard = false
}

export function flipCards(card, totalPairs, onWin) {
    if (lockBoard == true || flippedCards.includes(card)) {
        return;
    }
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch(totalPairs, onWin);
    }
}

export function checkMatch(totalPairs, onWin) {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.pokemonId === card2.dataset.pokemonId;

    if (isMatch) {
        //si coinciden
        card1.classList.add('matched');
        card2.classList.add('matched');

        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === totalPairs && typeof onWin === 'function') {
            onWin();
        }
    } else {
        //si no coinciden
        lockBoard = true;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');

            flippedCards = [];
            lockBoard = false;}, 1000);
    }
} 