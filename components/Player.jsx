import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function Player({
  player,
  gameState,
  playerState,
  opponentDiscard,
  opponentHealth,
  handleCardSelection,
  handleCardEffect,
  setGameState,
}) {
  let { hand, deck, discard: playerDiscard, activeCard, health } = playerState;

  let { round } = gameState;
  const [fusionState, setFusionState] = useState(false);
  const [fusionMaterial, setFusionMaterial] = useState({});

  // FUSION FUNCTIONS //

  function startFusion(card, index) {
    setFusionState(true);
    setFusionMaterial({
      ...fusionMaterial,
      card1: { card: card, index: index },
    });
  }

  function endFusion(e, index, player) {
    let card2 =
      player === 1
        ? { card: e.target.innerText, index: index }
        : { card: e, index: index };
    const { card1 } = fusionMaterial;
    if (card1.index !== index) {
      // Dinner or Rifle fusion
      if (card1.card === card2.card) {
        if (card1.card === "pan" || card1.card === "shoot") {
          hand = hand.filter((card, i) => i !== card1.index && i !== index);
          card1.card === "pan" ? hand.push("dinner") : hand.push("rifle");
        }
        setFusionState(false);
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
        hand = hand.filter((card, i) => i !== card1.index && i !== index);
        if (
          card1.card === "pan" &&
          (card2.card === "rock" ||
            card2.card === "paper" ||
            card2.card === "scissors")
        ) {
          hand.push(card2.card + "pan");
        } else {
          hand.push(card1.card + "pan");
        }

        setFusionState(false);
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
        hand = hand.filter((card, i) => i !== card1.index && i !== index);
        if (
          card1.card === "shoot" &&
          (card2.card === "rock" ||
            card2.card === "paper" ||
            card2.card === "scissors")
        ) {
          hand.push(card2.card + "shoot");
        } else {
          hand.push(card1.card + "pan");
        }

        setFusionState(false);
        setFusionMaterial({});
      }

      setGameState(
        player === 1
          ? {
              ...gameState,
              player1: {
                ...gameState.player1,
                hand: hand,
              },
            }
          : {
              ...gameState,
              player2: {
                ...gameState.player2,
                hand: hand,
              },
            }
      );
    }
  }

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
          //   switchStrategy();
          //   switch (currentStrategy) {
          //     case "random":
          //       return randomStrategy(hand);
          //     case "counter":
          //       return counterStrategy();
          //     case "probability":
          //       return probabilityStrategy();
          //     default:
          //       return randomStrategy(hand);
          //   }
          randomStrategy(hand);
        }, 2000);
      }

      // AI strategy functions
      function randomStrategy(hand) {
        // let indexOfCardToSelect = Math.floor(Math.random() * hand.length);
        // if (hand[indexOfCardToSelect] !== "pan") {
        //   handleCardSelection(2, indexOfCardToSelect);
        // } else {
        //   randomStrategy(hand);
        // }

        if (
          hand.includes("pan") &&
          (hand.includes("rock") ||
            hand.includes("scissors" || hand.includes("paper")))
        ) {
          let indexOfFusionCard1 = hand.indexOf("pan");
          function getCard2Index(hand) {
            let index;
            index = Math.floor(Math.random() * hand.length);
            if (hand[index] === "pan" || hand[index] === "shoot") {
              index = getCard2Index(hand);
            }
            return index;
          }
          let indexOfFusionCard2 = getCard2Index(hand);
          console.log(hand[indexOfFusionCard1], hand[indexOfFusionCard2]);

          startFusion(hand[indexOfFusionCard1], indexOfFusionCard1);
          fusionMaterial.card1 = {
            card: hand[indexOfFusionCard1],
            index: indexOfFusionCard1,
          };
          fusionMaterial.card2 = {
            card: hand[indexOfFusionCard2],
            index: indexOfFusionCard2,
          };
          console.log(fusionMaterial);
          endFusion(fusionMaterial.card2.card, fusionMaterial.card2.index, 2);

          setGameState({
            ...gameState,
            player2: {
              ...gameState.player2,
              hand: hand,
            },
          })
          let randIndex = Math.floor(Math.random() * hand.length);
          if (hand[randIndex] !== "pan") {
            handleCardSelection(2, randIndex);
          } else {
            randomStrategy(hand);
          }
        } else {
          let indexOfCardToSelect = Math.floor(Math.random() * hand.length);
          if (hand[indexOfCardToSelect] !== "pan") {
            handleCardSelection(2, indexOfCardToSelect);
          } else {
            randomStrategy(hand);
          }
        }
      }

      //   function probabilityStrategy() {
      //     const cardProbabilities = calculateProb();
      //     const { rock, paper, scissors } = cardProbabilities;

      //     // Find the card with the highest winning probability
      //     const winningProbabilities = {
      //       rock: scissors, // Rock beats Scissors
      //       paper: rock, // Paper beats Rock
      //       scissors: paper, // Scissors beat Paper
      //     };

      //     // Choose the card with the highest winning probability
      //     let bestCard = hand[0];
      //     let bestProbability = winningProbabilities[bestCard];

      //     hand.forEach((card) => {
      //       if (winningProbabilities[card] > bestProbability) {
      //         bestCard = card;
      //         bestProbability = winningProbabilities[card];
      //       }
      //     });

      //     let indexOfCardToSelect = hand.indexOf(bestCard);
      //     handleCardSelection(2, indexOfCardToSelect);
      //   }

      //   function counterStrategy() {
      //     const lastPlayedCard = opponentDiscard[opponentDiscard.length - 1];
      //     let counterCard;

      //     switch (lastPlayedCard) {
      //       case "rock":
      //         counterCard = "paper";
      //         break;

      //       case "paper":
      //         counterCard = "scissors";
      //         break;

      //       case "scissors":
      //         counterCard = "rock";
      //         break;

      //       default:
      //         counterCard = hand[Math.floor(Math.random() * hand.length)];
      //         break;
      //     }

      //     let indexOfCardToSelect = hand.indexOf(counterCard);
      //     handleCardSelection(2, indexOfCardToSelect);
      //   }

      //   function calculateProb() {
      //     const totalCards = 6;
      //     const remainingCards = totalCards - opponentDiscard.length;

      //     const cardCounts = {
      //       rock: 2,
      //       paper: 2,
      //       scissors: 2,
      //     };

      //     opponentDiscard.forEach((card) => {
      //       cardCounts[card] -= 1;
      //     });

      //     const cardProbabilities = {
      //       rock: cardCounts.rock / remainingCards,
      //       paper: cardCounts.paper / remainingCards,
      //       scissors: cardCounts.scissors / remainingCards,
      //     };

      //     return cardProbabilities;
      //   }
    }, [round]);
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
              className={clsx("card", {
                "cursor-pointer": card !== "pan",
              })}
            >
              <Dropdown
                card={card}
                handleCardSelection={handleCardSelection}
                player={player}
                index={index}
                hand={hand}
                fusionState={fusionState}
                setFusionState={setFusionState}
                fusionMaterial={fusionMaterial}
                setFusionMaterial={setFusionMaterial}
                handleCardEffect={handleCardEffect}
                setGameState={setGameState}
                gameState={gameState}
                startFusion={startFusion}
                endFusion={endFusion}
              />
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

function Dropdown({
  card,
  handleCardSelection,
  player,
  index,
  hand,
  fusionState,
  setFusionState,
  fusionMaterial,
  setFusionMaterial,
  handleCardEffect,
  setGameState,
  gameState,
  startFusion,
  endFusion,
}) {
  return (
    <div className="dropdown dropdown-top dropdown-hover">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1"
        onClick={(e) => {
          fusionState && endFusion(e, index, player);
        }}
      >
        {card}
      </div>
      <ul
        tabIndex={0}
        className={clsx(
          "dropdown-content menu bg-base-100 rounded-box z-[1] w-auto p-2 shadow",
          {
            hidden: fusionState,
          }
        )}
      >
        <li>
          <button
            onClick={() => {
              card !== "pan" &&
                card !== "dinner" &&
                handleCardSelection(player, index);
              card === "dinner" ? handleCardEffect(player, card, index) : null;
            }}
            className={clsx({ "btn-disabled text-slate-600": card === "pan" })}
          >
            Play
          </button>
        </li>
        <li>
          <a
            onClick={() => {
              startFusion(card, index);
            }}
          >
            Fuse
          </a>
        </li>
      </ul>
    </div>
  );
}
