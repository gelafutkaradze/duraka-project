export class User {
  constructor(fullName,role, hand = []) {
    this.hand = hand;
    this.fullName = fullName;
    this.role = role
  }

  reset(hand = []) {
    this.hand = hand;
  }

  updateUserHand = (hand) => {
    this.hand = [...this.hand, hand];
  };

  deleteCardFromHand(card) {
    this.hand = this.hand.filter((handCard) => handCard != card);
  }

  move (card) {
    const singleCard = document.createElement("div");
    const headerDiv = document.createElement("div")
    const footerDiv = document.createElement("div")

    singleCard.classList.add("deck-card-style");
    singleCard.setAttribute("id", `deckTable${card}`);
    singleCard.textContent = card
    
    headerDiv.classList.add('card-header')
    footerDiv.classList.add('card-footer')
    headerDiv.textContent = card
    footerDiv.textContent = card

    singleCard.appendChild(headerDiv)
    singleCard.appendChild(footerDiv)

    if (card.includes("♦") || card.includes("♥")) {
      singleCard.style.color = "red";
    }
    this.deleteCardFromHand(card)
    return singleCard;
  };

  getFullName() {
    return this.fullName;
  }

  getHand() {
    return this.hand;
  }

  getRole() {
    return this.role
  }
}
