import { ubuntu } from "@/app/font";
import { cardsCounter } from "@/libs/utils";
import clsx from "clsx";
import { useEffect } from "react";
import Card from "./animata/Card";

export default function Modal({
  selectedPowerCards,
  setSelectedPowerCards,
  PowerCARDS,
  setGameState,
  gameState,
  setInitialAIPowerCards,
  gameStarted
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
    if (gameState.round === 0 && gameStarted) {
      setTimeout(() => document.getElementById("my_modal_1").showModal(), 600);
    }
  }, [gameState.round, gameStarted]);

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
        <div className="modal-box px-4 py-0 bg-gradient-to-b from-[#6DBECB] to-[#406E75]">
          <div className="space-y-8 m-0 p-4 bg-neutral">

            <h3
              className={clsx(
                ubuntu.className,
                "font-bold text-[1.75vw] px-5 py-2 bg-white/5 rounded-full text-center"
              )}
            >
              Select Your Power Cards
            </h3>
            <p className="">
              Select up to 4 Power Cards you want to add to your Deck. Only 3 cards of each type can be selected.
            </p>
            <div className="flex items-center justify-center gap-7">
              {PowerCARDS.map((powerCard) => (
                <button
                  className="btn leading-normal scale-[1.15] h-fit p-0 rounded-2xl"
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
                  <Card name={powerCard} revealed={true} />
                </button>
              ))}
            </div>
            <div>
              <span className="capitalize">Selected Cards: {selectedPowerCards.join(", ")}</span>
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
                  className="btn hover:bg-[#62abb6] hover:text-neutral"
                  onClick={handleAddingPCards}
                  disabled={selectedPowerCards.length < 4}
                >
                  Start Game
                </button>
              </form>
            </div>
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
