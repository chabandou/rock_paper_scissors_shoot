"use client";

import { CARDS } from "@/libs/cards";
import { shuffle } from "@/libs/utils";

export default function EndGameModal({
  setGameState,
  gameState,
  setGameWinner,
  gameWinner,
  initializeDeck,
}) {
  function resetGame() {
    gameState.round = 0;
    gameState.player1 = {
      hand: [],
      deck: initializeDeck(),
      discard: [],
      activeCard: null,
      health: 5,
    };
    gameState.player2 = {
      hand: [],
      deck: initializeDeck(),
      discard: [],
      activeCard: null,
      health: 5,
    };
    setGameState({ ...gameState });
    setGameWinner("");

    document.getElementById("endGameModal").close();
  }

  // const tips = [
  //   "Unless you have a specific reason not to, Always go for fusions!",
  //   "Check your oppenent's discard often to predict their next move.",
  //   "Pay close attention to your oppenent's initial Power Cards selection and track when those cards are played",
  //   "Rifle can deal up to 60% damage to full health which makes it a massive threat to your opponent",
  //   "\n Some Basic fusions are: \n - Pan + Pan = Dinner, \n - Shoot + Shoot = Rifle, \n - Pan + Basic Card = Defensive Cards, \n - Shoot + Basic Card = Offensive Cards",
  //   "All Shoot + Basic Cards fusions will deal double damage.",
  // ];

  // const displayedTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <>
      <button
        className="btn z-10 hidden"
        onClick={() => document.getElementById("endGameModal").showModal()}
      >
        open modal
      </button>
      <dialog id="endGameModal" className="modal">
        <div className="modal-box space-y-4">
          <h3 className="font-bold text-lg text-center">
            {gameWinner === "Player 1" ? "You" : "Player 2"} Won The Game!
          </h3>

          {gameWinner === "Player 1" ? (
            <div>
              <p>Well Played, Congratulations.</p>{" "}
              <p>
                Make sure to leave your opinion on the game and share it with
                friends!
              </p>{" "}
            </div>
          ) : (
            <div>
              <p>
                Your opponent won the game. Try again and see if you can win.
              </p>{" "}
              {/* <p>Here's a Tip: {tips[0]}</p> */}
            </div>
          )}

          <p className="">
            {gameWinner === "Player 1" ? "You" : "Your opponent"} played these
            cards:
          </p>
          <div className="flex gap-2">
            {gameWinner === "Player 1"
              ? gameState.player1.discard.map((card, index) => (
                  <span key={index}>{card}</span>
                ))
              : gameState.player2.discard.map((card, index) => (
                  <span key={index}>{card}</span>
                ))}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => resetGame()}>
                Play New Game
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
