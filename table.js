import { tableCardNamingHelper } from "./utils.js";
import { deckCardNamingHelper } from "./utils.js";
export class Table {
  constructor(table = []) {
    this.table = [
      ...table.map((tableUser) => ({
        fullName: tableUser.getFullName(),
        cards: [],
      })),
    ];
    this.turn = null;
    this.isEmpty = true;
    this.whoCuts = null;
  }

  reset() {
    this.table = [
      ...this.table.map((tableUser) => ({ ...tableUser, cards: [] })),
    ];
    this.turn = null;
    this.isEmpty = true;
    this.whoCuts = null;
  }

  move(user, cardValue, deckLocation, handLocation, status) {
    const makeAction = () => {
      deckLocation.appendChild(user.move(cardValue));
      handLocation.removeChild(card);

      this.updateTable(user, cardValue);

      this.turn = this.turn == "opponent" ? "you" : "opponent";
    }

    const card = document.getElementById(cardValue);

    if (status === "attack") {
      if (this.isEmpty) {
        makeAction()
      } else {
        const value = parseInt(
          tableCardNamingHelper[cardValue.split(cardValue.at(-1))[0]].text
        );
        let isCardExistsOnTable = false

        this.table.forEach((tableUser) => {
          if(tableUser.cards.map(card => parseInt(tableCardNamingHelper[card.split(card.at(-1))[0]].text)).includes(value)){
            isCardExistsOnTable = true
          }
        })

        if(isCardExistsOnTable) {
          makeAction()
        }else{
          card.style.border = "3px solid red";
          setTimeout(() => {
            card.style.border = "none";
          }, 1000);
        }

      }
    } else {
      makeAction()
    }
  }

  cut(user, cardValue, deckLocation, handLocation) {
    const value = parseInt(
      tableCardNamingHelper[cardValue.split(cardValue.at(-1))[0]].text
    );
    const suit = String(cardValue.at(-1));

    this.table.forEach((tableUser) => {
      if (tableUser.fullName != user.getFullName()) {
        const card = document.getElementById(cardValue);

        const tableCardValue = tableUser.cards.at(-1);
        const tableValue = parseInt(
          tableCardNamingHelper[tableCardValue.split(tableCardValue.at(-1))[0]]
            .text
        );
        const tableSuit = String(tableCardValue.at(-1));

        // ცვეტის და პრიორიტეტის შედარება
        if (suit === tableSuit && value > tableValue) {
          this.move(user, cardValue, deckLocation, handLocation, "defense");
        }
        // კოზირის შედარება
        else if (suit !== tableSuit && suit === this.trumpSuit) {
          this.move(user, cardValue, deckLocation, handLocation, "defense");
        } else {
          card.style.border = "3px solid red";
          setTimeout(() => {
            card.style.border = "none";
          }, 1000);
        }
      }
    });
  }

  saveTrump(trumpSuit) {
    this.trumpSuit = trumpSuit;
  }

  updateWhoCuts(who) {
    this.whoCuts = who;
  }

  updateTable(user, card) {
    this.isEmpty = false;
    this.table.forEach((tableUser) => {
      if (tableUser.fullName == user.getFullName()) {
        tableUser.cards = [...tableUser.cards, card];
        return tableUser;
      }
      return tableUser;
    });
  }

  getWhoStarts(trump, your_hand, opponent_hand) {
    let your_trumps = [];
    let opponent_trumps = [];

    your_hand.forEach((handCard) => {
      if (handCard.includes(trump))
        your_trumps = [
          ...your_trumps,
          parseInt(tableCardNamingHelper[handCard.slice(0, -1)].text),
        ];
    });

    opponent_hand.forEach((handCard) => {
      if (handCard.includes(trump))
        opponent_trumps = [
          ...opponent_trumps,
          parseInt(tableCardNamingHelper[handCard.slice(0, -1)].text),
        ];
    });

    if (your_trumps.length > 0 || opponent_trumps.length > 0) {
      if (your_trumps.length > 0 && opponent_trumps.length > 0) {
        const your_smallest_trump = Math.min.apply(Math, your_trumps);
        const opponent_smallest_trump = Math.min.apply(Math, opponent_trumps);

        if (your_smallest_trump < opponent_smallest_trump) this.turn = "you";
        else this.turn = "opponent";
      }
      if (your_trumps.length == 0) this.turn = "opponent";
      if (opponent_trumps.length == 0) this.turn = "you";
    } else this.turn = "opponent";
  }

  getWhoCuts() {
    return this.whoCuts;
  }

  getTable() {
    return this.table;
  }

  getTurn() {
    return this.turn;
  }
}
