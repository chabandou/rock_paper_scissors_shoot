"use client";

import { ubuntu } from "@/app/font";
import { CARDS } from "@/libs/cards";
import { shuffle } from "@/libs/utils";
import clsx from "clsx";
import Image from "next/image";
import Card from "./animata/Card";

export default function EndGameModal({
  setGameState,
  gameState,
  setGameWinner,
  gameWinner,
  initializeDeck,
  matchLog,
  setMatchLog,
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
    setMatchLog([]);

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
        <Image
          src="/header.png"
          alt="header"
          width={1080}
          height={720}
          className="absolute w-[33vw] bottom-[75vh]  z-40"
        />
        <div className="modal-box h-[60vh] px-4 py-0 bg-gradient-to-b from-[#6DBECB] to-[#406E75] overflow-y-auto endGameModelContent">
          <div className="relative space-y-5 m-0 p-4  bg-neutral overflow-y-auto">
            <h3
              className={clsx(
                ubuntu.className,
                "font-bold text-[1.75vw] px-5 py-2 bg-white/5 rounded-full text-center mt-8"
              )}
            >
              {gameWinner === "Player 1" ? "You" : "Player 2"} Won The Game!
            </h3>
            <div className="space-y-5 overflow-y-auto ">
              {gameWinner === "Player 1" ? (
                <div>
                  <p className="font-bold">Well Played, Congratulations.</p>{" "}
                  <p>
                    Make sure to leave your opinion on the game and share it
                    with friends!
                  </p>{" "}
                </div>
              ) : (
                <div>
                  <p>
                    Your opponent won the game. Try again and see if you can
                    win.
                  </p>{" "}
                  {/* <p>Here's a Tip: {tips[0]}</p> */}
                </div>
              )}

              <p className="">During the game You played these cards:</p>
              <div className="flex items-center gap-3 overflow-x-auto [scrollbar-width:none]">
                {gameState.player1.discard.map((card, i) => {
                  return <Card name={card} revealed={true} index={i} />;
                })}
              </div>
              <p className="">And your opponent played these cards:</p>
              <div className="flex items-center gap-3 overflow-x-auto [scrollbar-width:none]">
                {gameState.player2.discard.map((card, i) => {
                  return <Card name={card} revealed={true} index={i} />;
                })}
              </div>
            </div>
            <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold my-3">Final Match Log</h2>
              {matchLog.map((match, i) => (
                <div
                  className={clsx("w-full py-[2px] flex items-center justify-between", {
                    "bg-neutral/10": i  % 2 === 0,
                    "bg-white/10": i  % 2 !== 0,
                  })}
                >
                  <span className="text-[1.3vw] font-normal" key={i}>{match.split(":")[0]}</span>
                  <span className="text-[1.3vw] font-semibold text-[#73c8d5]" key={i}>{match.split(":")[1]}</span>
                </div>
              ))}
            </div>

            <div className="modal-action">
              <form method="dialog">
                <button
                  className="btn hover:bg-[#62abb6] hover:text-neutral"
                  onClick={() => resetGame()}
                >
                  Play New Game
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
