//HEADER

const header = document.querySelector('.header-text');
header.textContent = 'Древний Ужас';

// MAIN

//ancients

import AncientsData from './data/ancients.js';
const ancientSBlock = document.querySelector('.ancients');
const levelsBlock = document.querySelector('.levels');
let currentAncient = {};
let ancients = [];

AncientsData.forEach(el => {
    const img = document.createElement("img");
    img.src = el.cardSrc;
    const block = document.createElement("div");
    block.classList.add('ancient');
    ancients = [...ancients, block];
    ancientSBlock.append(block);
    block.append(img);
    block.onclick = function (event) {
        currentAncient = el;
        deleteClassCurrent(ancients, 'current-block');
        block.classList.add('current-block');
        levelsBlock.classList.add('active');
    };
});


function deleteClassCurrent(allBlocks, classname) {
    allBlocks.forEach(el => {
        el.classList.remove(classname);
    })
}

// Game level

import Difficulties from './data/difficulties.js';
const mixButton = document.querySelector('.mix-button');
let currentDifficult = '';
let levels = []


Difficulties.forEach(el => {
    const lvlBlock = document.createElement("div");
    lvlBlock.classList.add('level');
    levels = [...levels, lvlBlock];
    lvlBlock.textContent = el.name;
    levelsBlock.append(lvlBlock);
    lvlBlock.onclick = function (event) {
        currentDifficult = el.id;
        deleteClassCurrent(levels, 'current-block');
        lvlBlock.classList.add('current-block');
        mixButton.classList.add('active');
    };
});

//Mix-button

mixButton.textContent = "Смешать колоду";
const gameScheme = document.querySelector('.game-scheme');
const cards = document.querySelector('.cards');
const deckBlock = document.querySelector('.deck-background');
const cardBlock = document.querySelector('.card');
let gameSchemeOgj = {};

mixButton.onclick = function (event) {
    createGame(currentAncient, currentDifficult);
    gameScheme.classList.add('active');
    cards.classList.add('active');
};

function createGame(ancient, difficult) {
    deckBlock.innerHTML = '';
    cardBlock.innerHTML = '';
    gameSchemeOgj = createGameScheme(ancient);
    createScheme(gameSchemeOgj);
    let deck = createCardDeck(ancient, difficult);
    showDeck(deck);

};

//Game scheme
const s1_green = document.querySelector('.first-stage .green-cards');
const s1_brown = document.querySelector('.first-stage .brown-cards');
const s1_blue = document.querySelector('.first-stage .blue-cards');

const s2_green = document.querySelector('.second-stage .green-cards');
const s2_brown = document.querySelector('.second-stage .brown-cards');
const s2_blue = document.querySelector('.second-stage .blue-cards');

const s3_green = document.querySelector('.third-stage .green-cards');
const s3_brown = document.querySelector('.third-stage .brown-cards');
const s3_blue = document.querySelector('.third-stage .blue-cards');



function createGameScheme(ancient) {
    let gameSchemeObj = {
        firstStage: {},
        secondStage: {},
        thirdStage: {}
    };
    Object.assign(gameSchemeObj.firstStage, ancient.firstStage);
    Object.assign(gameSchemeObj.secondStage, ancient.secondStage);
    Object.assign(gameSchemeObj.thirdStage, ancient.thirdStage);
    return gameSchemeObj;
};

function createScheme(gameSchemeObj) {
    s1_green.textContent = gameSchemeObj.firstStage.greenCards;
    s1_brown.textContent = gameSchemeObj.firstStage.brownCards;
    s1_blue.textContent = gameSchemeObj.firstStage.blueCards;

    s2_green.textContent = gameSchemeObj.secondStage.greenCards;
    s2_brown.textContent = gameSchemeObj.secondStage.brownCards;
    s2_blue.textContent = gameSchemeObj.secondStage.blueCards;

    s3_green.textContent = gameSchemeObj.thirdStage.greenCards;
    s3_brown.textContent = gameSchemeObj.thirdStage.brownCards;
    s3_blue.textContent = gameSchemeObj.thirdStage.blueCards;

}

// Create deck

import GreenCards from './data/mythicCards/green/index.js';
import BrownCards from './data/mythicCards/brown/index.js';
import BlueCards from './data/mythicCards/blue/index.js';

let firstStageCards = [];
let secondStageCards = [];
let thirdStageCards = [];


function createCardDeck(ancient, difficult) {
    const needGreenCards = ancient.firstStage.greenCards + ancient.secondStage.greenCards + ancient.thirdStage.greenCards;
    const needBrownCards = ancient.firstStage.brownCards + ancient.secondStage.brownCards + ancient.thirdStage.brownCards;
    const needBlueCards = ancient.firstStage.blueCards + ancient.secondStage.blueCards + ancient.thirdStage.blueCards;

    const greenCards = getCardsByDifficult(GreenCards, difficult, needGreenCards);
    const brownCards = getCardsByDifficult(BrownCards, difficult, needBrownCards);
    const blueCards = getCardsByDifficult(BlueCards, difficult, needBlueCards);

    firstStageCards = [...getRandomCards(greenCards, ancient.firstStage.greenCards), ...getRandomCards(brownCards, ancient.firstStage.brownCards), ...getRandomCards(blueCards, ancient.firstStage.blueCards)];
    secondStageCards = [...getRandomCards(greenCards, ancient.secondStage.greenCards), ...getRandomCards(brownCards, ancient.secondStage.brownCards), ...getRandomCards(blueCards, ancient.secondStage.blueCards)];
    thirdStageCards = [...greenCards, ...brownCards, ...blueCards];

    shuffle(firstStageCards);
    shuffle(secondStageCards);
    shuffle(thirdStageCards);

    let deck = [...firstStageCards, ...secondStageCards, ...thirdStageCards];
    return deck;
}

function getCardsByDifficult(cards, difficult, needNumOfCards) {

    //VERY EASY
    if (difficult == 'very_easy') {
        let tempDeck = [];

        for (const key in cards) {
            if (cards[key].difficulty == 'easy') {
                tempDeck = [...tempDeck, cards[key]];
            }
        }

        if (needNumOfCards < tempDeck.length) {
            return getRandomCards(tempDeck, needNumOfCards);
        } else if (needNumOfCards > tempDeck.length) {
            let mediumCards = [];
            for (const key in cards) {
                if (cards[key].difficulty == 'normal') {
                    mediumCards = [...mediumCards, cards[key]];
                }
            }
            return [...tempDeck, ...getRandomCards(mediumCards, needNumOfCards - tempDeck.length)];
        } else {
            return tempDeck;
        }
    }

    //EASY
    if (difficult == 'easy') {
        let tempDeck = [];
        for (const key in cards) {
            if (cards[key].difficulty != 'hard') {
                tempDeck = [...tempDeck, cards[key]];
            }
        }
        return getRandomCards(tempDeck, needNumOfCards);
    }

    //Normal
    if (difficult == 'normal') {
        return getRandomCards(cards, needNumOfCards);
    }

    // Hard
    if (difficult == 'hard') {
        let tempDeck = [];
        for (const key in cards) {
            if (cards[key].difficulty != 'easy') {
                tempDeck = [...tempDeck, cards[key]];
            }
        }
        return getRandomCards(tempDeck, needNumOfCards);
    }

    //very hard

    if (difficult == 'very_hard') {
        let tempDeck = [];

        for (const key in cards) {
            if (cards[key].difficulty == 'hard') {
                tempDeck = [...tempDeck, cards[key]];
            }
        }

        if (needNumOfCards < tempDeck.length) {
            return getRandomCards(tempDeck, needNumOfCards);
        } else if (needNumOfCards > tempDeck.length) {
            let mediumCards = [];
            for (const key in cards) {
                if (cards[key].difficulty == 'normal') {
                    mediumCards = [...mediumCards, cards[key]];
                }
            }
            return [...tempDeck, ...getRandomCards(mediumCards, needNumOfCards - tempDeck.length)];
        } else {
            return tempDeck;
        }
    }
}

function getRandomCards(cards, needNumOfCards) {
    let result = [];
    for (let i = 0; i < needNumOfCards; i++) {
        let rand = Math.floor(Math.random() * cards.length);
        let tempEl = cards[rand];
        result = [...result, tempEl];
        cards.splice(rand, 1);
    }
    return result;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Add cards

function showDeck(deck) {
    const img = document.createElement("img");
    img.src = './assets/mythicCardBackground.png';
    deckBlock.append(img);
    img.onclick = function (event) {
        showCard(deck);
    };
}

function showCard(deck) {
    cardBlock.innerHTML = '';
    const currentCard = deck.shift();
    const img = document.createElement("img");
    img.src = currentCard == null ? "" : currentCard.cardSrc;
    cardBlock.append(img);
    img.onclick = function (event) {
        showCard(deck);
    };
    if (currentCard != null) {
        const currentColor = currentCard.color;
        if (currentColor == 'green') {
            if (gameSchemeOgj.firstStage.greenCards > 0) {
                gameSchemeOgj.firstStage.greenCards = --gameSchemeOgj.firstStage.greenCards;
            } else if (gameSchemeOgj.secondStage.greenCards > 0) {
                gameSchemeOgj.secondStage.greenCards = --gameSchemeOgj.secondStage.greenCards;
            } else if (gameSchemeOgj.thirdStage.greenCards > 0) {
                gameSchemeOgj.thirdStage.greenCards = --gameSchemeOgj.thirdStage.greenCards;
            }
        }
        if (currentColor == 'brown') {
            if (gameSchemeOgj.firstStage.brownCards > 0) {
                gameSchemeOgj.firstStage.brownCards = --gameSchemeOgj.firstStage.brownCards;
            } else if (gameSchemeOgj.secondStage.brownCards > 0) {
                gameSchemeOgj.secondStage.brownCards = --gameSchemeOgj.secondStage.brownCards;
            } else if (gameSchemeOgj.thirdStage.brownCards > 0) {
                gameSchemeOgj.thirdStage.brownCards = --gameSchemeOgj.thirdStage.brownCards;
            }
        }
        if (currentColor == 'blue') {
            if (gameSchemeOgj.firstStage.blueCards > 0) {
                gameSchemeOgj.firstStage.blueCards = --gameSchemeOgj.firstStage.blueCards;
            } else if (gameSchemeOgj.secondStage.blueCards > 0) {
                gameSchemeOgj.secondStage.blueCards = --gameSchemeOgj.secondStage.blueCards;
            } else if (gameSchemeOgj.thirdStage.blueCards > 0) {
                gameSchemeOgj.thirdStage.blueCards = --gameSchemeOgj.thirdStage.blueCards;
            }
        }
        createScheme(gameSchemeOgj);
    } 

    if (deck.length == 0) {
        deckBlock.innerHTML = '';
    }
}

console.log('git-hub - https://github.com/sashkill94/codejam-eldritch');