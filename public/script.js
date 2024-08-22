document.addEventListener('DOMContentLoaded', () => {
    const playerCardsElement = document.getElementById('player-cards');
    const dealerCardsElement = document.getElementById('dealer-cards');
    const playerScoreElement = document.getElementById('player-score');
    const dealerScoreElement = document.getElementById('dealer-score');
    const cashElement = document.getElementById('cash');
    const betAmountInput = document.getElementById('bet-amount');
    const placeBetButton = document.getElementById('place-bet');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const doubleButton = document.getElementById('double');
    const gameStatusElement = document.getElementById('game-status'); 

    let deck = [];
    let playerCards = [];
    let dealerCards = [];
    let playerScore = 0;
    let dealerScore = 0;
    let cash = 100;
    let currentBet = 0;
    let gameState = "waiting for bet"; 

    function generateDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                let card = {
                    suit: suit,
                    rank: rank
                };
                deck.push(card);
            }
        }
        shuffleDeck();
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function drawCard() {
        return deck.pop();
    }

    function calculateScore(cards) {
        let score = 0;
        let hasAce = false;
        for (let card of cards) {
            if (card.rank === 'A') {
                hasAce = true;
            }
            score += cardValue(card.rank);
        }
        if (hasAce && score + 10 <= 21) {
            score += 10;
        }
        return score;
    }

    function cardValue(rank) {
        switch (rank) {
            case 'A':
                return 1;
            case '2':
                return 2;
            case '3':
                return 3;
            case '4':
                return 4;
            case '5':
                return 5;
            case '6':
                return 6;
            case '7':
                return 7;
            case '8':
                return 8;
            case '9':
                return 9;
            default:
                return 10;
        }
    }

    function updateScores() {
        playerScore = calculateScore(playerCards);
        dealerScore = calculateScore(dealerCards);
        playerScoreElement.textContent = `Score: ${playerScore}`;
        dealerScoreElement.textContent = `Score: ${dealerScore}`;
    }

    function renderCards() {
        playerCardsElement.innerHTML = '';
        dealerCardsElement.innerHTML = '';
        playerCards.forEach(card => renderCard(card, playerCardsElement));
        dealerCards.forEach(card => renderCard(card, dealerCardsElement));
    }

    function renderCard(card, element) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = `${card.rank} ${card.suit.charAt(0)}`;
        element.appendChild(cardElement);
    }

    function startGame() {
        if (currentBet === 0) {
            alert('Place your bet first.');
            return;
        }
        generateDeck();
        playerCards = [drawCard(), drawCard()];
        dealerCards = [drawCard(), drawCard()];
        updateScores();
        renderCards();
        hitButton.disabled = false;
        standButton.disabled = false;
        doubleButton.disabled = false;
        placeBetButton.disabled = true;
        betAmountInput.disabled = true;

        if (playerScore === 21) {
            gameStatusElement.textContent = "Player Blackjack!";
            cash += currentBet * 1.5;
            cashElement.textContent = `Cash: $${cash}`;
            endGame();
        } else {
            updateGameState("in-game");
        }
    }

    function endGame() {
        hitButton.disabled = true;
        standButton.disabled = true;
        doubleButton.disabled = true;
        placeBetButton.disabled = false;
        betAmountInput.disabled = false;
        playerCards = [];
        dealerCards = [];
        currentBet = 0;
    }

    function updateGameState(state) {
        gameState = state;
        updateGameStatus();
    }

    function updateGameStatus() {
        gameStatusElement.textContent = gameState;
    }

    
    hitButton.addEventListener('click', () => {
        playerCards.push(drawCard());
        updateScores();
        renderCards();
        if (playerScore > 21) {
            gameStatusElement.textContent = "Player busts! Dealer wins.";
            cash -= currentBet;
            cashElement.textContent = `Cash: $${cash}`;
            endGame();
        }
    });

   
    standButton.addEventListener('click', () => {
        while (dealerScore < 17) {
            dealerCards.push(drawCard());
            updateScores();
            renderCards();
        }
        if (dealerScore > 21 || playerScore > dealerScore) {
            gameStatusElement.textContent = "Player wins!";
            cash += currentBet;
        } else if (playerScore < dealerScore) {
            gameStatusElement.textContent = "Dealer wins!";
            cash -= currentBet;
        } else {
            gameStatusElement.textContent = "Push!";
        }
        cashElement.textContent = `Cash: $${cash}`;
        endGame();
    });

   
    doubleButton.addEventListener('click', () => {
        if (cash >= currentBet * 2) {
            currentBet *= 2;
            playerCards.push(drawCard());
            updateScores();
            renderCards();
            if (playerScore > 21) {
                gameStatusElement.textContent = "Player busts! Dealer wins.";
                cash -= currentBet;
                cashElement.textContent = `Cash: $${cash}`;
            } else {
                while (dealerScore < 17) {
                    dealerCards.push(drawCard());
                    updateScores();
                    renderCards();
                }
                if (dealerScore > 21 || playerScore > dealerScore) {
                    gameStatusElement.textContent = "Player wins!";
                    cash += currentBet;
                } else if (playerScore < dealerScore) {
                    gameStatusElement.textContent = "Dealer wins!";
                    cash -= currentBet;
                } else {
                    gameStatusElement.textContent = "Push!";
                }
                cashElement.textContent = `Cash: $${cash}`;
            }
            endGame();
        } else {
            alert('Not enough cash to double down.');
        }
    });

    
    placeBetButton.addEventListener('click', () => {
        currentBet = parseInt(betAmountInput.value);
        if (isNaN(currentBet) || currentBet <= 0 || currentBet > cash) {
            alert('Invalid bet amount.');
            return;
        }
        placeBetButton.disabled = true;
        betAmountInput.disabled = true;
        startGame();
    });

    // Inicjalne wyświetlenie ilości gotówki
    cashElement.textContent = `Cash: $${cash}`;
    gameStatusElement.textContent = "Waiting for Bet"; // Ustawienie początkowego statusu gry
});
