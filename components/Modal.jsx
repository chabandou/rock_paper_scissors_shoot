import { cardsCounter } from "@/libs/utils";
import { useEffect } from "react";

export default function Modal({
  selectedPowerCards,
  setSelectedPowerCards,
  PowerCARDS,
  setGameState,
  gameState,
  initialAIPowerCards,
  setInitialAIPowerCards,
}) {
  function selectAIPowerCards() {
    let AIPowerCards = [];
    let cardsCounter = { shoot: 0, pan: 0 };
    while (AIPowerCards.length < 4) {
      let rand = Math.floor(Math.random() * 2);
      let SelectedCard = PowerCARDS[rand];
      console.log(SelectedCard);
      if (SelectedCard === "shoot") {
        cardsCounter.shoot += 1;
      } else {
        cardsCounter.pan += 1;
      }
      let SelectedCardCount = cardsCounter[SelectedCard];

      if (SelectedCardCount < 4) {
        AIPowerCards.push(SelectedCard);
      }
    }
    // console.log("cardsCounter", cardsCounter);
    // console.log(AIPowerCards);

    return AIPowerCards;
  }
  useEffect(() => {
    if (gameState.round === 0) {
      document.getElementById("my_modal_1").showModal();
    }
  }, [gameState.round]);

  function handleAddingPCards() {
    gameState.player1.deck = [...gameState.player1.deck, ...selectedPowerCards];
    gameState.player2.deck = [
      ...gameState.player2.deck,
      ...selectAIPowerCards(),
    ];
    setInitialAIPowerCards(gameState.player2.deck.slice(-4));
    setGameState((prevState) => {
      return {
        ...prevState,
        player1: {
          ...prevState.player1,
          deck: gameState.player1.deck,
        },
        player2: {
          ...prevState.player2,
          deck: gameState.player2.deck,
        },
      };
    });
    // console.log(gameState.player2.deck);
    setSelectedPowerCards([]);
    document.getElementById("my_modal_1").close();
  }

  return (
    <>
      <button
        className="btn z-10 hidden"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        open modal
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box space-y-4">
          <h3 className="font-bold text-lg">Power Cards</h3>
          <p className="">
            Select up to 4 power cards you want to use. Only 3 cards of each
            type can be selected.
          </p>
          <div className="flex gap-2">
            {PowerCARDS.map((powerCard) => (
              <button
                className="btn"
                key={powerCard}
                onClick={() =>
                  setSelectedPowerCards((powerCards) => [
                    ...powerCards,
                    powerCard,
                  ])
                }
                disabled={
                  cardsCounter(selectedPowerCards)[powerCard] === 4 ||
                  selectedPowerCards.length === 4
                }
              >
                {powerCard}
              </button>
            ))}
          </div>
          <div>
            <span>Selected Cards: {selectedPowerCards.join(", ")}</span>
          </div>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => setSelectedPowerCards([])}
              disabled={selectedPowerCards.length === 0}
            >
              Reset
            </button>
            <form method="dialog">
              <button
                className="btn"
                onClick={handleAddingPCards}
                disabled={selectedPowerCards.length < 4}
              >
                Start Game
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

{
  /* Open the modal using document.getElementById('ID').showModal() method */
}
{
  /* if there is a button in form, it will close the modal */
}
