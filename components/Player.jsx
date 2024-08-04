import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function Player({
  player,
  hand,
  deck,
  playerDiscard,
  opponentDiscard,
  activeCard,
  health,
  opponentHealth,
  round,
  handleCardSelection,
}) {
  // AI player
  if (player === 2) {
    const [currentStrategy, setCurrentStrategy] = useState("random");

    function switchStrategy() {
      if (round % 2 === 0) {
        setCurrentStrategy("probability");
      } else if (opponentHealth <= 3) {
        setCurrentStrategy("counter");
      } else if (health <= 3) {
        setCurrentStrategy("random");
      }
    }
    useEffect(() => {
      // get all cards in hand

      // If AI has cards, AI will calculate the probability of remaining opponent cards
      if (hand.length > 0 && !activeCard) {
        setTimeout(() => {
          switchStrategy();

          switch (currentStrategy) {
            case "random":
              return randomStrategy(hand); 
            case "counter":
              return counterStrategy();
            case "probability":
              return probabilityStrategy();
            default:
              return randomStrategy(hand);
          }
        }, 2000);
      }

      // AI strategy functions
      function randomStrategy(hand) {
        let indexOfCardToSelect = Math.floor(Math.random() * hand.length);
        handleCardSelection(2, indexOfCardToSelect);
      }
  
      function probabilityStrategy() {
        const cardProbabilities = calculateProb();
        const { rock, paper, scissors } = cardProbabilities;
  
        // Find the card with the highest winning probability
        const winningProbabilities = {
          rock: scissors, // Rock beats Scissors
          paper: rock, // Paper beats Rock
          scissors: paper, // Scissors beat Paper
        };
  
        // Choose the card with the highest winning probability
        let bestCard = hand[0];
        let bestProbability = winningProbabilities[bestCard];
  
        hand.forEach((card) => {
          if (winningProbabilities[card] > bestProbability) {
            bestCard = card;
            bestProbability = winningProbabilities[card];
          }
        });
  
        let indexOfCardToSelect = hand.indexOf(bestCard);
        handleCardSelection(2, indexOfCardToSelect);
      }
  
      function counterStrategy() {
        const lastPlayedCard = opponentDiscard[opponentDiscard.length - 1];
        let counterCard;
  
        switch (lastPlayedCard) {
          case "rock":
            counterCard = "paper";
            break;
  
          case "paper":
            counterCard = "scissors";
            break;
  
          case "scissors":
            counterCard = "rock";
            break;
  
          default:
            counterCard = hand[Math.floor(Math.random() * hand.length)];
            break;
        }
  
        let indexOfCardToSelect = hand.indexOf(counterCard);
        handleCardSelection(2, indexOfCardToSelect);
      }

      function calculateProb() {
        const totalCards = 6;
        const remainingCards = totalCards - opponentDiscard.length;

        const cardCounts = {
          rock: 2,
          paper: 2,
          scissors: 2,
        };

        opponentDiscard.forEach((card) => {
          cardCounts[card] -= 1;
        });

        const cardProbabilities = {
          rock: cardCounts.rock / remainingCards,
          paper: cardCounts.paper / remainingCards,
          scissors: cardCounts.scissors / remainingCards,
        };

        return cardProbabilities;
      }
    }, [hand, activeCard, handleCardSelection]);
  }
  // const cardRefs = hand.map((_, i) => useRef());

  return (
    <>
      <div
        className={clsx(
          "activeCard absolute top-1/2 translate-y-[-50%] translate-x-[-50%] border-2 border-red-300",
          {
            "right-[30%]": player === 2,
            "left-1/3": player === 1,
          }
        )}
      >
        {activeCard}
      </div>

      <div
        className={clsx("deck absolute right-0", {
          "top-0": player === 2,
          "bottom-0": player === 1,
        })}
      >
        {deck.length}
      </div>
      <div
        className={clsx(
          "absolute player left-1/2 translate-x-[-50%] flex items-center justify-center",
          {
            "top-0": player === 2,
            "bottom-0": player === 1,
          }
        )}
      >
        <div className="hand flex items-center justify-center gap-2">
          {hand.map((card, index) => (
            <div
              key={index}
              //   ref={cardRefs[index]}
              className="card cursor-pointer"
              onClick={() => handleCardSelection(player, index)}
            >
              {card}
            </div>
          ))}
        </div>
      </div>
      <div
        className={clsx("health absolute left-1/4", {
          "top-0": player === 2,
          "bottom-0": player === 1,
        })}
      >
        {health}
      </div>
      <div
        className={clsx("playerDiscard absolute left-0", {
          "top-0": player === 2,
          "bottom-0": player === 1,
        })}
      >
        {playerDiscard.length}
      </div>
    </>
  );
}
