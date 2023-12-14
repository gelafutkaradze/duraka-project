import { Deck } from "./deck.js";
import { User } from "./user.js";
import { Table } from "./table.js";

const w = window;
const d = document;

const opponent = "opponent";
const you = "you";

const opponentCard = "opponentCard";
const myCard = "myCard";

const cardDistributionId = "cardDistribution";
const retryDistributionId = "retryDistribution";
const suppliesId = "supplies";

const deckTableId = "deckTable";

const deckTableCardsOpponentId = "deckTableCardsOpponent";
const opponentCardsId = "opponentCards";

const yourCardsId = "yourCards";
const deckTableCardsMeId = "deckTableCardsMe";

const whosTurnId = 'whosTurn'
const whoCutsId = 'whoCuts'

const takeCardsId = 'takeCards'
const clearTableId = 'clearTable'

const actionButtonsId = "actionButtons"

const cardDistribution = d.getElementById(cardDistributionId);
const retryDistribution = d.getElementById(retryDistributionId);

const deckTable = d.getElementById(deckTableId);

const deckTableCardsOpponent = d.getElementById(deckTableCardsOpponentId);
const handTableCardsOpponent = d.getElementById(opponentCardsId);

const deckTableCardsMe = d.getElementById(deckTableCardsMeId);
const handTableCardsMe = d.getElementById(yourCardsId);

const whosTurn = d.getElementById(whosTurnId);
const whoCuts = d.getElementById(whoCutsId);

const takeCards = d.getElementById(takeCardsId);
const clearTable = d.getElementById(clearTableId);

const actionButtons = d.getElementById(actionButtonsId);


const user1 = new User("Jano Gazashvili", "opponent");
const user2 = new User("Toka Kartsivadze", "you");
const deck = new Deck();
const table = new Table([user1, user2]);

//default value of deck table
deckTable.style.display = "none";

cardDistribution.addEventListener("click", () => {
  deck.generateCards(user1, opponentCardsId, deckTableCardsOpponentId);
  deck.generateCards(
    user2,
    yourCardsId,
    deckTableCardsMeId,
    deck.getHandQuantity
  );
  deck.generateTrumpCard(suppliesId);

  table.getWhoStarts(deck.trump, user2.getHand(), user1.getHand());
  table.saveTrump(deck.trump)
  table.updateWhoCuts(table.getTurn() === you ? opponent : you)

  cardDistribution.disabled = true;
  retryDistribution.disabled = false;
  deckTable.style.display = "flex";
  actionButtons.style.display = 'flex'
});

w.addEventListener("click", function (event) {
  const targetId = event.target.id;
  const isMyCardClicked = event.target.className.includes(myCard);
  const isOpponentCardClicked = event.target.className.includes(opponentCard);

  if (isMyCardClicked && table.getTurn() === you) {
    table.getWhoCuts() === you 
    ? table.cut(user2, targetId, deckTableCardsMe, handTableCardsMe)
    : table.move(user2, targetId, deckTableCardsMe, handTableCardsMe, 'attack')

  }

  if (isOpponentCardClicked && table.getTurn() === opponent) {
    table.getWhoCuts() === opponent 
    ? table.cut(user1, targetId, deckTableCardsOpponent, handTableCardsOpponent)
    : table.move(user1, targetId, deckTableCardsOpponent, handTableCardsOpponent, 'attack')

  }

  if(table.getWhoCuts() === opponent) {
    deckTableCardsOpponent.classList.add('cutting-opponent')
    deckTableCardsMe.classList.remove('cutting-you')
  } else {
    deckTableCardsMe.classList.add('cutting-you')
    deckTableCardsOpponent.classList.remove('cutting-opponent')
  }

  whosTurn.innerHTML = `სვლა: ${table.getTurn()}`
  whoCuts.innerHTML = `ჭრის: ${table.getWhoCuts()}`

  takeCards.innerHTML = `აღება`
  clearTable.innerHTML = `წავიდა`
});



retryDistribution.addEventListener("click", () => {
  d.getElementById(suppliesId).innerHTML = "";
  handTableCardsOpponent.innerHTML = "";
  handTableCardsMe.innerHTML = "";
  deckTableCardsOpponent.innerHTML = "";
  deckTableCardsMe.innerHTML = "";
  whosTurn.innerHTML = ""
  whoCuts.innerHTML = ""
  takeCards.innerHTML = ""
  clearTable.innerHTML = ""
  

  user1.reset();
  user2.reset();
  deck.reset();
  deck.shuffle();
  table.reset();

  cardDistribution.disabled = false;
  retryDistribution.disabled = true;
  deckTable.style.display = "none";
  actionButtons.style.display = 'none'
});
