"use client";

import Modal from "@/components/Modal";
import PanModal from "@/components/PanModal";
import Player from "@/components/Player";
import { cardsCounter, shuffle } from "@/libs/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [panUsed, setPanUsed] = useState(null);
  const [matchLog, setMatchLog] = useState([]);

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

  let CARDS = ["rock", "paper", "scissors"];

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
      setGameState({ ...gameState });
    }
  }

  function roundSetup() {
    gameState.round += 1;
    for (let i = 0; i < gameState.startingCards; i++) {
      drawCard("player1");
      drawCard("player2");
    }
    setGameState({ ...gameState });
  }

  /// Game Initialization

  useEffect(() => {
    if (gameState.round === 0 && gameState.player1.deck.length === 10) {
      gameState.player1.deck = shuffle(gameState.player1.deck);

      gameState.player2.deck = shuffle(gameState.player2.deck);
      roundSetup();
    }

    if (gameState.player1.health <= 0) {
      alert("Player 2 wins!");
      resetGame();
    } else if (gameState.player2.health <= 0) {
      alert("Player 1 wins!");
      resetGame();
    }

    function resetGame() {
      setGameState(initialGameState);
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
    let player1Card = gameState.player1.activeCard;
    let player2Card = gameState.player2.activeCard;

    // Check if both players have selected a card
    if (player1Card && player2Card) {
      if (player2Card === "shoot" && gameState.player1.hand.includes("pan")) {
        document.getElementById("panModal").showModal();
        if (panUsed === false || panUsed === true) {
          if (panUsed === false) playRound(player1Card, player2Card);
          if (panUsed === true) {
            let indexOfPan = gameState.player1.hand.indexOf("pan");
            gameState.player1.hand.splice(indexOfPan, 1);
            gameState.player1.hand.unshift(player1Card);
            setGameState({...gameState, player1: {...gameState.player1, hand: gameState.player1.hand}});
            playRound("pan", "shoot");
          }
        }
      } else if (
        player1Card === "shoot" &&
        gameState.player2.hand.includes("pan")
      ) {
        let index = gameState.player2.hand.indexOf("pan");
        let newHand = gameState.player2.hand.splice(index, 1);
        gameState.player2.hand.unshift(player2Card);
        setGameState((prevState) => {
          return {
            ...prevState,
            player2: {
              ...prevState.player2,
              hand: newHand,
            },
          };
        });
        playRound("shoot", "pan");
      } else {
        playRound(player1Card, player2Card);
      }
    }
  }, [gameState.player1.activeCard, gameState.player2.activeCard, panUsed]);

  const handleCardSelection = (player, cardIndex) => {
    // Remove the played card from the player's hand and set it as the active card
    if (player === 1) {
      setGameState((prevState) => {
        const newHand = prevState.player1.hand.filter(
          (_, index) => index !== cardIndex
        );
        return {
          ...prevState,
          player1: {
            ...prevState.player1,
            hand: newHand,
            activeCard: gameState.player1.hand[cardIndex],
          },
        };
      });
    } else {
      setGameState((prevState) => {
        const newHand = prevState.player2.hand.filter(
          (_, index) => index !== cardIndex
        );
        return {
          ...prevState,
          player2: {
            ...prevState.player2,
            hand: newHand,
            activeCard: gameState.player2.hand[cardIndex],
          },
        };
      });
    }
  };

  function playRound(player1Card, player2Card) {
    matchLog.push(
      "Round " + gameState.round + ": " + player1Card + " vs. " + player2Card
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
      newGameState.player1.health -= 1;
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
    }, 2000);
    console.log(
      "player1 hand",
      gameState.player1.hand,
      "player2 hand",
      gameState.player2.hand
    );
  }

  function handleCardEffect(player, card, index) {
    if (card === "dinner") {
      if (player === 1) {
        let { health, hand } = gameState.player1;
        health += 2;
        drawCard("player1");
        hand = hand.filter((_, i) => i !== index);
        gameState.player1 = { ...gameState.player1, health, hand };
        setGameState({ ...gameState });
      } else {
        let { health, hand } = gameState.player1;
        health += 2;
        drawCard("player2");
        hand = hand.filter((_, i) => i !== index);
        gameState.player2 = { ...gameState.player2, health, hand };
        setGameState({ ...gameState });
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center">
        {matchLog.map((match, i) => (
          <h3 key={i}>{match}</h3>
        ))}
      </div>
      <div className="z-10 w-full max-w-5xl items-center justify-between lg:flex flex-col">
        <Modal
          selectedPowerCards={selectedPowerCards}
          setSelectedPowerCards={setSelectedPowerCards}
          PowerCARDS={PowerCARDS}
          gameState={gameState}
          setGameState={setGameState}
        />
        <PanModal
          panUsed={panUsed}
          setPanUsed={setPanUsed}
          hand={gameState.player1.hand}
          setGameState={setGameState}
        />
        <div>
          <h1 className="text-5xl font-bold">Rock, Paper, Scissors, Shoot!</h1>
          <h2 className="text-3xl font-bold">Round {gameState.round}</h2>
        </div>
        <section className="field relative w-[70vw] aspect-[1.54/1] border-4 border-white/80">
          <Image
            src="/field.svg"
            alt="field"
            fill
            className="object-contain absolute top-0 left-0 z-0"
          />
          <div className="">
            <Player
              player={1}
              gameState={gameState}
              playerState={gameState.player1}
              opponentDiscard={gameState.player2.discard}
              handleCardSelection={handleCardSelection}
              handleCardEffect={handleCardEffect}
              setGameState={setGameState}
            />
            <Player
              player={2}
              gameState={gameState}
              playerState={gameState.player2}
              opponentHealth={gameState.player1.health}
              opponentDiscard={gameState.player1.discard}
              handleCardSelection={handleCardSelection}
              setGameState={setGameState}
            />
          </div>
        </section>
        {roundWinner &&
          (roundWinner === "tie" ? (
            <h1 className="text-3xl">It's a tie!</h1>
          ) : (
            <h1 className="text-3xl">{roundWinner} wins this round!</h1>
          ))}
      </div>
    </main>
  );
}
