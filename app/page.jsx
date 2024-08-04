"use client";

import Player from "@/components/Player";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  let CARDS = ["rock", "paper", "scissors"];
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const initializeDeck = () => {
    let deck = [...CARDS, ...CARDS];
    shuffle(deck);
    return deck;
  };

  let initalGameState = {
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

  const [gameState, setGameState] = useState(initalGameState);

  function drawCard(player) {
    if (gameState[player].deck.length > 0) {
      let card = gameState[player].deck.pop();
      gameState[player].hand.push(card);
      setGameState({ ...gameState });
    }
  }

  function roundSetup() {
    for (let i = 0; i < gameState.startingCards; i++) {
      drawCard("player1");
      drawCard("player2");
    }
  }

  useEffect(() => {
    if (gameState.round === 0) {
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
      setGameState(initalGameState);
    }
  }, [gameState.round, gameState.player1.health, gameState.player2.health]);

  useEffect(() => {
    let player1Card = gameState.player1.activeCard;
    let player2Card = gameState.player2.activeCard;

    // Check if both players have selected a card
    if (player1Card && player2Card) {
      playRound(player1Card, player2Card);
    }
  }, [gameState.player1.activeCard, gameState.player2.activeCard]);

  const handleCardSelection = (player, cardIndex) => {
    // Remove the card from the player's hand and set it as the active card
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
    let newGameState = { ...gameState };
    if (player1Card === player2Card) {
      console.log("It's a tie!");
    } else if (
      (player1Card === "rock" && player2Card === "scissors") ||
      (player1Card === "scissors" && player2Card === "paper") ||
      (player1Card === "paper" && player2Card === "rock")
    ) {
      newGameState.player2.health -= 1;
      console.log("Player 1 wins this round!");
    } else {
      newGameState.player1.health -= 1;
      console.log("Player 2 wins this round!");
    }

    newGameState.round += 1;

    console.log(newGameState.round);
    
    // Remove the cards from the active cards
    newGameState.player1.activeCard = null;
    newGameState.player2.activeCard = null;

    // Add the cards to the discard pile
    newGameState.player1.discard.push(player1Card);
    newGameState.player2.discard.push(player2Card);

    drawCard("player1");
    drawCard("player2");

    setGameState(newGameState);
    console.log(gameState.player1.hand, gameState.player2.hand);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <section className="field relative w-[70vw] aspect-[1.54/1] border-4 border-white/80">
        <Image
          src="/field.svg"
          alt="field"
          fill
          className="object-contain absolute top-0 left-0"
        />
        <div className="">
          <Player
            player={1}
            hand={gameState.player1.hand}
            deck={gameState.player1.deck}
            playerDiscard={gameState.player1.discard}
            opponentDiscard={gameState.player2.discard}
            activeCard={gameState.player1.activeCard}
            health={gameState.player1.health}
            handleCardSelection={handleCardSelection}
          />
          <Player
            player={2}
            hand={gameState.player2.hand}
            deck={gameState.player2.deck}
            playerDiscard={gameState.player2.discard}
            opponentDiscard={gameState.player1.discard}
            activeCard={gameState.player2.activeCard}
            health={gameState.player2.health}
            opponentHealth={gameState.player1.health}
            round={gameState.round}
            handleCardSelection={handleCardSelection}
          />
        </div>
      </section>
    </main>
  );
}
