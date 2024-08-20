"use client";

import EndGameModal from "@/components/EndGameModal";
import Modal from "@/components/Modal";
import PanModal from "@/components/PanModal";
import Player from "@/components/Player";
import { cardsCounter, shuffle } from "@/libs/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CARDS } from "@/libs/cards";
import Card from "@/components/animata/Card";
import { ubuntu } from "./font";
import clsx from "clsx";
import { fusionCards } from "@/libs/cards";

import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [panUsed, setPanUsed] = useState(null);
  const [matchLog, setMatchLog] = useState([]);
  const [initialAIPowerCards, setInitialAIPowerCards] = useState([]);

  const [gameWinner, setGameWinner] = useState("");

  const [revealed, setRevealed] = useState(false);

  /// Power Cards logic

  const PowerCARDS = ["shoot", "pan"];

  function selectAIPowerCards() {
    let AIPowerCards = [];

    for (let i = 0; i < 4; i++) {
      if (cardsCounter(AIPowerCards)[PowerCARDS[i]] < 3) {
        AIPowerCards.push(PowerCARDS[Math.floor(Math.random() * 2)]);
      }
    }
    return AIPowerCards;
  }

  const [selectedPowerCards, setSelectedPowerCards] = useState([]);

  // Normal cards logic

  const initializeDeck = () => {
    let deck = [...CARDS, ...CARDS];
    shuffle(deck);
    return deck;
  };

  let initialGameState = {
    round: 0,
    startingCards: 3,
    player1: {
      hand: [],
      deck: initializeDeck(),
      discard: [],
      activeCard: null,
      health: 5,
    },
    player2: {
      hand: [],
      deck: initializeDeck(),
      discard: [],
      activeCard: null,
      health: 5,
    },
  };

  const [gameState, setGameState] = useState(initialGameState);

  function drawCard(player) {
    if (gameState[player].deck.length > 0) {
      let card = gameState[player].deck.pop();
      gameState[player].hand.push(card);
      setGameState((prevState) => {
        return {
          ...prevState,
          [player]: {
            ...prevState[player],
            hand: gameState[player].hand,
          },
        };
      });
    }

    // if (player === "player1") {
    //   console.log(
    //     "from after drawCard Fn \n",
    //     "hand:",
    //     gameState.player1.hand,
    //     "\n deck:",
    //     gameState.player1.deck
    //   );
    // }
  }

  function roundSetup() {
    gameState.round += 1;
    for (let i = 0; i < gameState.startingCards; i++) {
      drawCard("player1");
      drawCard("player2");
    }
  }

  /// Game Initialization

  useEffect(() => {
    if (
      gameState.round === 0 &&
      gameState.player1.deck.length === 10 &&
      gameState.player2.deck.length === 10
    ) {
      gameState.player1.deck = shuffle(gameState.player1.deck);

      gameState.player2.deck = shuffle(gameState.player2.deck);
      roundSetup();
    }

    if (gameState.player1.health <= 0) {
      setGameWinner("Player 2");
      document.getElementById("endGameModal").showModal();
    } else if (gameState.player2.health <= 0) {
      setGameWinner("Player 1");
      document.getElementById("endGameModal").showModal();
    }
  }, [
    gameState.round,
    gameState.player1.health,
    gameState.player2.health,
    gameState.player1.deck.length,
  ]);

  // Round Playing logic after selecting active cards

  const [roundWinner, setRoundWinner] = useState(null);

  useEffect(() => {
    // console.log("from before playRound and pan used: \n", gameState.player1.hand);

    let player1Card = gameState.player1.activeCard;
    let player2Card = gameState.player2.activeCard;

    // Check if both players have selected a card
    if (player1Card && player2Card) {
      if (
        player2Card === "shoot" &&
        gameState.player1.hand.includes("pan") &&
        gameState.player1.activeCard !== "pan"
      ) {
        setRevealed(true);
        setTimeout(() => handlePanCounter(1), 3000);
      } else if (
        player1Card === "shoot" &&
        gameState.player2.hand.includes("pan")
      ) {
        setRevealed(true);
        setTimeout(() => handlePanCounter(2), 3000);
      } else {
        setRevealed(true);
        setTimeout(() => playRound(player1Card, player2Card), 3000);
      }
    }
    if (player1Card && !player2Card) {
      setRevealed(true);
      setTimeout(() => {
        setTimeout(() => {
          matchLog.push(
            "Round " +
              gameState.round +
              ": " +
              player1Card +
              " vs. Player 2 Pass"
          );
          setMatchLog(matchLog);

          // let newGameState = { ...gameState };

          if (player1Card === "rifle") {
            gameState.player2.health -= 3;
          } else if (player1Card.includes("shoot") && player1Card.length > 5) {
            gameState.player2.health -= 2;
          } else {
            gameState.player2.health -= 1;
          }
          setRoundWinner("player 1");

          gameState.round += 1;

          // Remove the cards from the active cards
          gameState.player1.activeCard = null;

          // Add the cards to the discard pile
          gameState.player1.discard.push(player1Card);

          drawCard("player1");
          drawCard("player2");

          setTimeout(() => {
            setGameState({ ...gameState });
            setRoundWinner(null);
            setRevealed(false);
          }, 1500);
        }, 1000);
      }, 3000);
    }
  }, [gameState.player1.activeCard, gameState.player2.activeCard]);

  function handlePanCounter(player) {
    if (player === 1) {
      document.getElementById("panModal").showModal();
    } else if (player === 2) {
      gameState.player2.hand.unshift(gameState.player2.activeCard);
      setGameState((prevState) => {
        return {
          ...prevState,
          player2: {
            ...prevState.player2,
            hand: gameState.player2.hand,
            activeCard: null,
          },
        };
      });
      handleCardSelection(2, gameState.player2.hand.indexOf("pan"));

      // setPanUsed(null)
    }
  }

  useEffect(() => {
    if (panUsed) {
      gameState.player1.hand.unshift(gameState.player1.activeCard);
      gameState.player1.activeCard = null;
      setGameState((prevState) => {
        return {
          ...prevState,
          player1: {
            ...prevState.player1,
            hand: gameState.player1.hand,
            activeCard: gameState.player1.activeCard,
          },
        };
      });
      handleCardSelection(1, gameState.player1.hand.indexOf("pan"));

      // setPanUsed(null);
    } else if (panUsed === false) {
      playRound(gameState.player1.activeCard, gameState.player2.activeCard);
      setPanUsed(null);
    }
  }, [panUsed]);

  const handleCardSelection = (player, cardIndex) => {
    // Remove the played card from the player's hand and set it as the active card
    if (player === 1) {
      gameState.player1.activeCard = gameState.player1.hand[cardIndex];
      gameState.player1.hand = gameState.player1.hand.filter(
        (_, index) => index !== cardIndex
      );
      setGameState({
        ...gameState,
      });
      // console.log(
      //   "from after handleCardSelection Fn \n",
      //   "hand:",
      //   gameState.player1.hand,
      //   "\n deck:",
      //   gameState.player1.deck
      // );
    } else {
      console.log("handling card selection for player 2");

      gameState.player2.activeCard = gameState.player2.hand[cardIndex];
      gameState.player2.hand = gameState.player2.hand.filter(
        (_, index) => index !== cardIndex
      );
      setGameState({
        ...gameState,
        player2: {
          ...gameState.player2,
          hand: gameState.player2.hand,
          activeCard: gameState.player2.activeCard,
        },
      });

      console.log(
        "handled card selection for player 2",
        gameState.player2.activeCard
      );
    }
  };

  function playRound(player1Card, player2Card) {
    // console.log(
    //   "from before playRound Fn \n",
    //   "hand:",
    //   gameState.player1.hand,
    //   "\n deck:",
    //   gameState.player1.deck
    // );

    let player1CardLogDisplay = fusionCards[player1Card]?.name
      ? fusionCards[player1Card].name
      : player1Card;

    let player2CardLogDisplay = fusionCards[player2Card]?.name
      ? fusionCards[player2Card].name
      : player2Card;

    matchLog.push(
      "Round #" +
        gameState.round +
        ": " +
        player1CardLogDisplay +
        " vs. " +
        player2CardLogDisplay
    );

    setMatchLog(matchLog);

    let newGameState = { ...gameState };
    if (
      player1Card === player2Card ||
      (player1Card === "rifle" &&
        player2Card.includes("pan") &&
        player2Card.length > 3)
    ) {
      console.log("It's a tie!");
      setRoundWinner("tie");
    } else if (
      (player1Card === "rock" && player2Card === "scissors") ||
      (player1Card === "scissors" && player2Card === "paper") ||
      (player1Card === "paper" && player2Card === "rock") ||
      (player1Card === "shoot" && player2Card === "rock") ||
      (player1Card === "shoot" && player2Card === "paper") ||
      (player1Card === "shoot" && player2Card === "scissors") ||
      (player1Card === "pan" && player2Card === "shoot") ||
      (player1Card === "rifle" && player2Card === "rock") ||
      (player1Card === "rifle" && player2Card === "paper") ||
      (player1Card === "rifle" && player2Card === "scissors") ||
      (player1Card === "rifle" && player2Card === "pan") ||
      (player1Card === "rifle" && player2Card.includes("shoot")) ||
      (player1Card.includes("shoot") &&
        player1Card.length > 5 &&
        player2Card === "rock") ||
      (player1Card.includes("shoot") &&
        player1Card.length > 5 &&
        player2Card === "paper") ||
      (player1Card.includes("shoot") &&
        player1Card.length > 5 &&
        player2Card === "scissors") ||
      (player1Card.includes("shoot") &&
        player1Card.length > 5 &&
        player2Card === "shoot") ||
      (player1Card.includes("shoot") &&
        player1Card.length > 5 &&
        player2Card === "pan") ||
      (player1Card === "rockshoot" && player2Card === "scissorsshoot") ||
      (player1Card === "scissorsshoot" && player2Card === "papershoot") ||
      (player1Card === "papershoot" && player2Card === "rockshoot") ||
      (player1Card.includes("pan") &&
        player1Card.length > 3 &&
        player2Card === "rock") ||
      (player1Card.includes("pan") &&
        player1Card.length > 3 &&
        player2Card === "paper") ||
      (player1Card.includes("pan") &&
        player1Card.length > 3 &&
        player2Card === "scissors") ||
      (player1Card.includes("pan") &&
        player1Card.length > 3 &&
        player2Card === "shoot") ||
      (player1Card.includes("pan") &&
        player1Card.length > 3 &&
        player2Card === "pan") ||
      (player1Card.includes("pan") &&
        player1Card.length > 3 &&
        player2Card.includes("shoot") &&
        player2Card.length > 5) ||
      (player1Card === "rockpan" && player2Card === "scissorspan") ||
      (player1Card === "scissorspan" && player2Card === "paperpan") ||
      (player1Card === "paperpan" && player2Card === "rockpan")
    ) {
      if (player1Card === "rifle") {
        newGameState.player2.health -= 3;
      } else if (player1Card.includes("shoot") && player1Card.length > 5) {
        newGameState.player2.health -= 2;
      } else {
        newGameState.player2.health -= 1;
      }
      setRoundWinner("player 1");
    } else {
      if (player2Card === "rifle") {
        newGameState.player1.health -= 3;
      } else if (player2Card.includes("shoot") && player2Card.length > 5) {
        newGameState.player1.health -= 2;
      } else {
        newGameState.player1.health -= 1;
      }
      setRoundWinner("player 2");
    }

    newGameState.round += 1;

    // Remove the cards from the active cards
    newGameState.player1.activeCard = null;
    newGameState.player2.activeCard = null;

    // Add the cards to the discard pile
    newGameState.player1.discard.push(player1Card);
    newGameState.player2.discard.push(player2Card);

    drawCard("player1");
    drawCard("player2");

    setTimeout(() => {
      setGameState(newGameState);
      setRoundWinner(null);
      setRevealed(false);
    }, 1500);
    // console.log(
    //   "player1 hand",
    //   gameState.player1.hand,
    //   "player2 hand",
    //   gameState.player2.hand
    // );
  }

  function handleCardEffect(player, card, index) {
    if (card === "dinner") {
      if (player === 1) {
        let { health, hand, discard } = gameState.player1;
        health += 2;
        drawCard("player1");
        hand = hand.filter((_, i) => i !== index);
        discard.push(card);
        gameState.player1 = { ...gameState.player1, health, hand, discard };
        setGameState({ ...gameState });
      } else {
        let { health, hand, discard } = gameState.player2;
        health += 2;
        drawCard("player2");
        hand = hand.filter((_, i) => i !== index);
        discard.push(card);
        gameState.player2 = { ...gameState.player2, health, hand, discard };
        setGameState({ ...gameState });
      }
    }
  }

  // FUSION FUNCTIONS END

  const [fusionState, setFusionState] = useState({
    player1: false,
    player2: false,
  });
  const [fusionMaterial, setFusionMaterial] = useState({
    player1: {},
    player2: {},
  });

  async function endFusion(e, index, player) {
    console.log("endFusion TRIGGERED ****************");
    // console.log(e?.target.alt);
    let card2 =
      player === 1
        ? { card: e?.target.alt, index: index }
        : { card: e, index: index };
    const card1 =
      player === 1 ? fusionMaterial.player1 : fusionMaterial.player2;
    if (card1.index !== index) {
      // Dinner or Rifle fusion
      if (card1.card === card2.card) {
        if (card1.card === "pan" || card1.card === "shoot") {
          if (player === 1) {
            gameState.player1.hand = gameState.player1.hand.filter(
              (card, i) => i !== card1.index && i !== card2.index
            );
            card1.card === "pan"
              ? gameState.player1.hand.push("dinner")
              : gameState.player1.hand.push("rifle");
          } else if (player === 2) {
            gameState.player2.hand = gameState.player2.hand.filter(
              (card, i) => i !== card1.index && i !== card2.index
            );
            card1.card === "pan"
              ? gameState.player2.hand.push("dinner")
              : gameState.player2.hand.push("rifle");
          }
        }
        setFusionState({ player1: false, player2: false });
        setFusionMaterial({});
      }

      // pan + basic card fusion
      else if (
        (card1.card === "pan" &&
          (card2.card === "rock" ||
            card2.card === "paper" ||
            card2.card === "scissors")) ||
        (card2.card === "pan" &&
          (card1.card === "rock" ||
            card1.card === "paper" ||
            card1.card === "scissors"))
      ) {
        console.log("PAN FUSION TRIGGERED ****************");
        player === 1
          ? (gameState.player1.hand = gameState.player1.hand.filter(
              (card, i) => i !== card1.index && i !== card2.index
            ))
          : (gameState.player2.hand = gameState.player2.hand.filter(
              (card, i) => i !== card1.index && i !== card2.index
            ));
        if (
          card1.card === "pan" &&
          (card2.card === "rock" ||
            card2.card === "paper" ||
            card2.card === "scissors")
        ) {
          console.log("PAN FUSION TRIGGERED 2222 ****************");
          player === 1
            ? gameState.player1.hand.push(card2.card + "pan")
            : gameState.player2.hand.push(card2.card + "pan");
        } else {
          console.log("PAN FUSION TRIGGERED 3333 ****************");

          player === 1
            ? gameState.player1.hand.push(card1.card + "pan")
            : gameState.player2.hand.push(card1.card + "pan");
        }

        setFusionMaterial({});
      }

      // shoot + basic card fusion
      else if (
        (card1.card === "shoot" &&
          (card2.card === "rock" ||
            card2.card === "paper" ||
            card2.card === "scissors")) ||
        (card2.card === "shoot" &&
          (card1.card === "rock" ||
            card1.card === "paper" ||
            card1.card === "scissors"))
      ) {
        player === 1
          ? (gameState.player1.hand = gameState.player1.hand.filter(
              (card, i) => i !== card1.index && i !== card2.index
            ))
          : (gameState.player2.hand = gameState.player2.hand.filter(
              (card, i) => i !== card1.index && i !== card2.index
            ));
        if (
          card1.card === "shoot" &&
          (card2.card === "rock" ||
            card2.card === "paper" ||
            card2.card === "scissors")
        ) {
          player === 1
            ? gameState.player1.hand.push(card2.card + "shoot")
            : gameState.player2.hand.push(card2.card + "shoot");
        } else {
          player === 1
            ? gameState.player1.hand.push(card1.card + "shoot")
            : gameState.player2.hand.push(card1.card + "pan");
        }

        setFusionMaterial({});
      }

      player === 1 &&
        setGameState({
          ...gameState,
          player1: {
            ...gameState.player1,
            hand: gameState.player1.hand,
          },
        });
      player === 2 &&
        (await setGameState({
          ...gameState,
          player2: {
            ...gameState.player2,
            hand: gameState.player2.hand,
          },
        }));

      setFusionMaterial({});
      setTimeout(
        () => setFusionState({ player1: false, player2: false }),
        1000
      );
    }
  }

  const [passedTurn, setPassedTurn] = useState(false);
  function passTurn() {
    setPassedTurn(true);
    let newGameState = { ...gameState };
    setTimeout(() => {
      if (gameState.player2.activeCard) {
        let player2CardLogDisplay = fusionCards[gameState.player2.activeCard]
          ?.name
          ? fusionCards[gameState.player2.activeCard].name
          : gameState.player2.activeCard;

        matchLog.push(
          "Round #" +
            gameState.round +
            ": Player 1 Pass vs. " +
            player2CardLogDisplay
        );
        setMatchLog(matchLog);

        if (gameState.player2.activeCard === "rifle") {
          newGameState.player1.health -= 3;
        } else if (
          gameState.player2.activeCard.includes("shoot") &&
          gameState.player2.activeCard.length > 5
        ) {
          newGameState.player1.health -= 2;
        } else {
          newGameState.player1.health -= 1;
        }
        setRoundWinner("player 2");

        // Add the cards to the discard pile
        newGameState.player2.discard.push(gameState.player2.activeCard);

        // Remove the cards from the active cards
        newGameState.player2.activeCard = null;
      } else if (!gameState.player2.activeCard) {
        matchLog.push(
          "Round " + gameState.round + ": Player 1 Pass vs.Player 2 Pass"
        );

        setMatchLog(matchLog);

        setRoundWinner("It's a tie!");
      }

      newGameState.round += 1;

      drawCard("player1");
      drawCard("player2");
      setTimeout(() => {
        setGameState(newGameState);
        setRoundWinner(null);
        setPassedTurn(false);
        setRevealed(false);
      }, 1500);
    }, 3000);
  }

  useEffect(() => {
    if (passedTurn) {
      setRevealed(true);
    }
  }, [passedTurn]);

  return (
    <main className="flex w-full min-h-screen items-center justify-center bg-primary/25 p-2">
      <div className="z-10 w-full items-center justify-center lg:flex flex-col">
        <Modal
          selectedPowerCards={selectedPowerCards}
          setSelectedPowerCards={setSelectedPowerCards}
          PowerCARDS={PowerCARDS}
          gameState={gameState}
          setGameState={setGameState}
          initialAIPowerCards={initialAIPowerCards}
          setInitialAIPowerCards={setInitialAIPowerCards}
        />
        <PanModal
          panUsed={panUsed}
          setPanUsed={setPanUsed}
          hand={gameState.player1.hand}
          setGameState={setGameState}
        />
        <div>
          <h1
            className={clsx(ubuntu.className, "game-title text-5xl font-bold ")}
          >
            Rock, Paper, Scissors, SHOOT!
          </h1>
          <h2 className="text-3xl font-bold">Round {gameState.round}</h2>
        </div>
        <div className="flex w-full h-fit items-center justify-around">
          <div className="w-[25vw] min-h-[44.45vw] z-10 flex flex-col items-center justify-center gap-2">
            <h2
              className={clsx(
                ubuntu.className,
                "font-bold text-[1.75vw] px-5 py-2 bg-white/5 rounded-full text-center flex gap-3"
              )}
            >
              Game Log <Image src="/log.svg" alt="log" width={35} height={35} />
            </h2>
            <div className="flex w-full min-h-[42.45vw] flex-col gap-1 mt-2">
              {matchLog.map((match, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={i}
                  className="w-full flex h-10 rounded-full overflow-hidden"
                >
                  <div className="w-1/4 h-full scale-[2] -translate-x-1/4 -translate-y-2 bg-[#75ccda] rotate-12 z-10 border-r-2 "></div>

                  <div
                    className={clsx(
                      "w-full h-full  flex items-center justify-start",
                      {
                        "bg-[#406E75]/40": i % 2 === 0,
                        "bg-[#406E75]/80": i % 2 !== 0,
                      }
                    )}
                  >
                    <span className="-translate-x-[4.2vw] text-[1.05vw] z-20 font-extrabold text-[#1d464c]">
                      {match.split(":")[0]}
                    </span>
                    <span className="text-[1.15vw] h-full text-center flex items-center capitalize">
                      {match.split(":")[1]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <section className="field relative w-[70vw] aspect-[1.54/1] border-4 border-white/80 overflow-hidden bg-black">
            <AnimatePresence>
              {roundWinner && (
                <motion.div
                  className="absolute bg-black/50 w-full h-full flex items-center justify-center z-[49]"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {roundWinner === "tie" ? (
                      <h1 className="text-[2.75vw] font-bold capitalize">It's a tie!</h1>
                    ) : (
                      <h1 className="text-[2.75vw] font-bold capitalize">
                        {roundWinner} wins this round!
                      </h1>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <Image
              src="/field.svg"
              alt="field"
              fill
              className="object-contain absolute top-0 left-0 z-0 "
            />
            <div className="">
              <div className="absolute top-1/2 -translate-y-1/2 right-[15px] z-30">
                <button
                  className="btn btn-neutral"
                  onClick={() => passTurn()}
                  disabled={passedTurn}
                >
                  Pass turn
                </button>
              </div>
              <Player
                player={1}
                gameState={gameState}
                playerState={gameState.player1}
                opponentDiscard={gameState.player2.discard}
                handleCardSelection={handleCardSelection}
                handleCardEffect={handleCardEffect}
                setGameState={setGameState}
                endFusion={endFusion}
                fusionState={fusionState}
                setFusionState={setFusionState}
                fusionMaterial={fusionMaterial}
                setFusionMaterial={setFusionMaterial}
                revealed={revealed}
              />
              <Player
                player={2}
                gameState={gameState}
                playerState={gameState.player2}
                opponentHealth={gameState.player1.health}
                opponentDiscard={gameState.player1.discard}
                handleCardSelection={handleCardSelection}
                setGameState={setGameState}
                endFusion={endFusion}
                fusionState={fusionState}
                setFusionState={setFusionState}
                fusionMaterial={fusionMaterial}
                setFusionMaterial={setFusionMaterial}
                initialAIPowerCards={initialAIPowerCards}
                setInitialAIPowerCards={setInitialAIPowerCards}
                revealed={revealed}
              />
            </div>
          </section>
        </div>

        <EndGameModal
          gameState={gameState}
          setGameState={setGameState}
          gameWinner={gameWinner}
          setGameWinner={setGameWinner}
          initializeDeck={initializeDeck}
          matchLog={matchLog}
          setMatchLog={setMatchLog}
        />
      </div>
    </main>
  );
}
