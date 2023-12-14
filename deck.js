import { deckCardNamingHelper } from "./utils.js";

export class Deck {
  #trump = null;

  constructor(deck = [], handQuantity = 6) {
    this.handQuantity = handQuantity;
    this.deck = deck;
    this.reset();
    this.shuffle();
  }

  reset() {
    this.deck = [];

    const suits = ["♠", "♦", "♣", "♥"];
    const values = [14, 6, 7, 8, 9, 10, 11, 12, 13];

    for (let suit in suits) {
      for (let value in values) {
        this.deck.push(
          `${deckCardNamingHelper[values[value]].text}${suits[suit]}`
        );
      }
    }
  }

  shuffle() {
    const { deck } = this;
    let m = deck.length,
      i;

    while (m) {
      i = Math.floor(Math.random() * m--);

      [deck[m], deck[i]] = [deck[i], deck[m]];
    }

    return this;
  }

  setDeck(newDeck) {
    this.deck = newDeck;
  }

  getTrumpSuit(card) {
    if (card.includes("♦")) return "♦";
    else if (card.includes("♥")) return "♥";
    else if (card.includes("♣")) return "♣";
    else return "♠";
  }

  generateTrumpCard(trumpCardLocationId) {
    const trumpCardLocation = document.getElementById(trumpCardLocationId);
    const trumpCard = this.deck[0];

    const singleCard = document.createElement("div");
    singleCard.classList.add("cardStyle");
    singleCard.setAttribute("id", trumpCard);
    singleCard.textContent = trumpCard;
    trumpCardLocation.appendChild(singleCard);

    if (trumpCard.includes("♦") || trumpCard.includes("♥")) {
      singleCard.style.color = "red";
    }
    this.setDeck(this.deck.filter((card) => card !== trumpCard));
    this.#trump = this.getTrumpSuit(trumpCard);
  }

  generateCards(user, userDeckLocation = "", userDeckTableLocation = "", startIndex = 0) {
    const userHandLocation = document.getElementById(userDeckLocation);
    const userTableLocation = document.getElementById(userDeckTableLocation);
    const userDeck = this.deck.slice(
      startIndex,
      startIndex + this.handQuantity
    );


    for (let i = 0; i < userDeck.length; i++) {
      const singleCard = document.createElement("div");
      singleCard.classList.add('cardStyle');
      singleCard.classList.add(user.getRole() == 'opponent' ? 'opponentCard' : 'myCard');
      singleCard.setAttribute("id", userDeck[i]);
      singleCard.textContent = userDeck[i];
      userHandLocation.appendChild(singleCard);

      if (userDeck[i].includes("♦") || userDeck[i].includes("♥")) {
        singleCard.style.color = "red";
      }

      user.updateUserHand(userDeck[i]);

      this.setDeck(this.deck.filter((card) => card !== userDeck[i]));
    }
  }

  get getHandQuantity() {
    return this.handQuantity;
  }

  get trump() {
    return this.#trump;
  }
}
