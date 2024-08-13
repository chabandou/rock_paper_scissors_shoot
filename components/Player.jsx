import { cardsCounter } from "@/libs/utils";
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
  endFusion,
  fusionState,
  setFusionState,
  fusionMaterial,
  setFusionMaterial,
  initialAIPowerCards,
}) {
  let {
    hand,
    deck,
    discard: playerDiscard,
    activeCard,
    health,
  } = player === 1 ? gameState.player1 : gameState.player2;

  let { round } = gameState;

  // FUSION FUNCTIONS //

  function startFusion(card, index, player) {
    if (player === 1) {
      setFusionState({ player1: true, player2: false });
      setFusionMaterial({ player1: { card: card, index: index }, player2: {} });
    } else if (player === 2) {
      fusionMaterial.player2 = {
        card: card,
        index: index,
      };
      setFusionState({ player1: false, player2: true });
      setFusionMaterial({ player1: {}, player2: fusionMaterial.player2 });
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
            switchStrategy();
            switch (currentStrategy) {
              case "random":
                return randomStrategy(hand);
              case "counter":
                return counterStrategy();
              case "probability":
                return probabilityStrategy();
              default:
                return probabilityStrategy();
            }
        }, 2000);
      }

      // AI strategy functions
      function randomStrategy(hand) {

        // Power Card + Basic Card AI Fusion

        let randomNum = Number(Math.random());

        if (
          (gameState.player2.hand.includes("pan") || gameState.player2.hand.includes("shoot")) &&
          (gameState.player2.hand.includes("rock") ||
            gameState.player2.hand.includes("scissors") ||
            gameState.player2.hand.includes("paper")) &&
          randomNum <= 0.5
        ) {
          let indexOfFusionCard1 = gameState.player2.hand.includes("pan")
            ? gameState.player2.hand.indexOf("pan")
            : gameState.player2.hand.indexOf("shoot");
          function getCard2Index(hand) {
            let index;
            index = Math.floor(Math.random() * hand.length);
            if (hand[index] === "pan" || hand[index] === "shoot") {
              index = getCard2Index(hand);
            }
            return index;
          }
          let indexOfFusionCard2 = getCard2Index(gameState.player2.hand);
          // console.log(hand[indexOfFusionCard1], hand[indexOfFusionCard2]);

          startFusion(hand[indexOfFusionCard1], indexOfFusionCard1, 2);

          // fusionMaterial.card2 = {
          //   card: hand[indexOfFusionCard2],
          //   index: indexOfFusionCard2,
          // };
          endFusion(gameState.player2.hand[indexOfFusionCard2], indexOfFusionCard2, 2);

          setTimeout(() => selectRandomCard(), 500);
        } else if (cardsCounter(gameState.player2.hand).pan > 1 && randomNum <= 0.5) {
          let fusionCard1Index = gameState.player2.hand.indexOf("pan");
          function getCard2Index(hand) {
            let index = hand.findIndex(
              (card, i) => card === "pan" && i !== fusionCard1Index
            );
            return index;
          }
          let fusionCard2Index = getCard2Index(gameState.player2.hand);
          startFusion(gameState.player2.hand[fusionCard1Index], fusionCard1Index, 2);
          endFusion(gameState.player2.hand[fusionCard2Index], fusionCard2Index, 2);

          console.log(
            fusionCard1Index,
            gameState.player2.hand[fusionCard1Index],
            fusionCard2Index,
            gameState.player2.hand[fusionCard2Index]
          );

          setTimeout(() => selectRandomCard(), 500);
        } else if (cardsCounter(gameState.player2.hand).shoot > 1 && randomNum <= 0.5) {
          let fusionCard1Index = gameState.player2.hand.indexOf("shoot");
          function getCard2Index(hand) {
            let index = hand.findIndex(
              (card, i) => card === "shoot" && i !== fusionCard1Index
            );
            return index;
          }
          let fusionCard2Index = getCard2Index(gameState.player2.hand);
          startFusion(gameState.player2.hand[fusionCard1Index], fusionCard1Index, 2);
          endFusion(gameState.player2.hand[fusionCard2Index], fusionCard2Index, 2);

          setTimeout(() => selectRandomCard(), 500);
        } else {
          let indexOfCardToSelect = Math.floor(Math.random() * gameState.player2.hand.length);
          if (gameState.player2.hand[indexOfCardToSelect] !== "pan") {
            handleCardSelection(2, indexOfCardToSelect);
          } else {
            randomStrategy(gameState.player2.hand);
          }
        }

        if (gameState.player2.hand.includes("dinner")) {
          let dinnerIndex = gameState.player2.hand.indexOf("dinner");
          handleCardEffect(2, "dinner", dinnerIndex);
        }
      }

      function selectRandomCard() {
        let randIndex = Math.floor(
          Math.random() * gameState.player2.hand.length
        );
        if (
          gameState.player2.hand[randIndex] !== "pan" &&
          gameState.player2.hand[randIndex] !== "dinner"
        ) {
          console.log("selecting random card");
          console.log(gameState.player2.hand[randIndex]);

          handleCardSelection(2, randIndex);
          console.log("selected random card");
        } else {
          selectRandomCard();
        }
      }

      function handleCardEffect(player, card, index) {
        if (card === "dinner") {
          let { health, hand, discard } = gameState.player2;
          health += 2;
          drawCard("player2");
          hand = hand.filter((_, i) => i !== index);
          discard.push(card);
          gameState.player2 = { ...gameState.player2, health, hand, discard };
          setGameState({ ...gameState });
        }
      }

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
      }

      /// ****** AI PROBABILITY STRATEGY  ******* ///

      function probabilityStrategy() {
        // AI Fusion logic

        if (cardsCounter(gameState.player2.hand).pan > 1 && gameState.player2.health < 4) {
          let fusionCard1Index = gameState.player2.hand.indexOf("pan");
          function getCard2Index(hand) {
            let index = hand.findIndex(
              (card, i) => card === "pan" && i !== fusionCard1Index
            );
            return index;
          }
          let fusionCard2Index = getCard2Index(gameState.player2.hand);
          startFusion(
            gameState.player2.hand[fusionCard1Index],
            fusionCard1Index,
            2
          );
          endFusion(
            gameState.player2.hand[fusionCard2Index],
            fusionCard2Index,
            2
          );

          console.log(
            fusionCard1Index,
            gameState.player2.hand[fusionCard1Index],
            fusionCard2Index,
            gameState.player2.hand[fusionCard2Index]
          );

          setTimeout(() => chooseBasedOnProb(), 500);
        } else if (cardsCounter(gameState.player2.hand).shoot > 1) {
          let fusionCard1Index = gameState.player2.hand.indexOf("shoot");
          function getCard2Index(hand) {
            let index = hand.findIndex(
              (card, i) => card === "shoot" && i !== fusionCard1Index
            );
            return index;
          }
          let fusionCard2Index = getCard2Index(gameState.player2.hand);
          startFusion(
            gameState.player2.hand[fusionCard1Index],
            fusionCard1Index,
            2
          );
          endFusion(
            gameState.player2.hand[fusionCard2Index],
            fusionCard2Index,
            2
          );

          setTimeout(() => chooseBasedOnProb(), 500);
        } else if (
          (gameState.player2.hand.includes("pan") || gameState.player2.hand.includes("shoot")) &&
          (gameState.player2.hand.includes("rock") ||
            gameState.player2.hand.includes("scissors") ||
            gameState.player2.hand.includes("paper"))
        ) {
          if (
            gameState.player2.hand.includes("pan") &&
            !(gameState.player2.health < 4 && deck[deck.length - 1] === "pan")
          ) {
            let indexOfFusionCard1 = gameState.player2.hand.indexOf("pan");

            function getCard2Index(hand) {
              let index;
              index = Math.floor(Math.random() * hand.length);
              if (hand[index] === "pan" || hand[index] === "shoot") {
                index = getCard2Index(hand);
              }
              return index;
            }
            let indexOfFusionCard2 = getCard2Index(gameState.player2.hand);
            // console.log(hand[indexOfFusionCard1], hand[indexOfFusionCard2]);

            startFusion(
              gameState.player2.hand[indexOfFusionCard1],
              indexOfFusionCard1,
              2
            );

            endFusion(
              gameState.player2.hand[indexOfFusionCard2],
              indexOfFusionCard2,
              2
            );
          } else if (
            gameState.player2.hand.includes("shoot") &&
            gameState.player2.deck[gameState.player2.deck.length - 1] !== "shoot"
          ) {
            let indexOfFusionCard1 = hand.indexOf("shoot");

            function getCard2Index(hand) {
              let index;
              index = Math.floor(Math.random() * hand.length);
              if (hand[index] === "pan" || hand[index] === "shoot") {
                index = getCard2Index(hand);
              }
              return index;
            }
            let indexOfFusionCard2 = getCard2Index(gameState.player2.hand);
            // console.log(hand[indexOfFusionCard1], hand[indexOfFusionCard2]);

            startFusion(
              gameState.player2.hand[indexOfFusionCard1],
              indexOfFusionCard1,
              2
            );

            endFusion(
              gameState.player2.hand[indexOfFusionCard2],
              indexOfFusionCard2,
              2
            );
          }

          setTimeout(() => chooseBasedOnProb(), 500);
        } else {
          chooseBasedOnProb();
        }

        if (gameState.player2.hand.includes("dinner")) {
          let dinnerIndex = gameState.player2.hand.indexOf("dinner");
          handleCardEffect(2, "dinner", dinnerIndex);
        }

        // Choose the card with the highest winning probability
      }

      function chooseBasedOnProb() {
        const cardProbabilities = calculateProb();
        const { rock, paper, scissors, pan, shoot } = cardProbabilities;

        // Find the card with the highest winning probability
        const winningProbabilities = {
          rock: scissors, // Rock beats Scissors
          paper: rock, // Paper beats Rock
          scissors: paper, // Scissors beat Paper
          shoot: scissors + rock + paper, // Shoot beats all basic cards
          rockpan: 2 * scissors + rock + paper + 2 * shoot + pan, // basic+pan ties with rifle & beats the rest
          paperpan: scissors + 2 * rock + paper + 2 * shoot + pan, // basic+pan ties with rifle & beats the rest
          scissorspan: scissors + rock + 2 * paper + 2 * shoot + pan, // basic+pan ties with Rifle & beats the rest
          rockshoot: scissors + rock + paper + shoot + pan, // basic+shoot beats the rest
          papershoot: scissors + rock + paper + shoot + pan, // basic+shoot beats the rest
          scissorsshoot: scissors + rock + paper + shoot + pan, // basic+shoot beats the rest
          rifle: 2 * (scissors + rock + paper + shoot) + pan, // rifle ties with basic+pan & beats the rest
        };

        // Choose the card with the highest winning probability
        let bestCard =
          gameState.player2.hand[Math.floor(Math.random() * hand.length)];
        if (bestCard === "pan" || bestCard === "dinner") {
          chooseBasedOnProb();
        } else {
          let bestCardProbability = winningProbabilities[bestCard];

          for (const [card, probability] of Object.entries(
            winningProbabilities
          )) {
            if (
              probability > bestCardProbability &&
              gameState.player2.hand.includes(card)
            ) {
              bestCard = `${card}`;
              bestCardProbability = probability;
            }
          }
          console.log(bestCard, bestCardProbability);

          let indexOfCardToSelect = gameState.player2.hand.indexOf(bestCard);
          handleCardSelection(2, indexOfCardToSelect);
        }
      }

      function counterStrategy() {
        // AI Fusion logic

        if (cardsCounter(gameState.player2.hand).pan > 1 && gameState.player2.health < 4) {
          let fusionCard1Index = gameState.player2.hand.indexOf("pan");
          function getCard2Index(hand) {
            let index = hand.findIndex(
              (card, i) => card === "pan" && i !== fusionCard1Index
            );
            return index;
          }
          let fusionCard2Index = getCard2Index(gameState.player2.hand);
          startFusion(
            gameState.player2.hand[fusionCard1Index],
            fusionCard1Index,
            2
          );
          endFusion(
            gameState.player2.hand[fusionCard2Index],
            fusionCard2Index,
            2
          );

          console.log(
            fusionCard1Index,
            hand[fusionCard1Index],
            fusionCard2Index,
            hand[fusionCard2Index]
          );

          setTimeout(() => chooseBasedOnCounter(), 500);
        } else if (cardsCounter(gameState.player2.hand).shoot > 1) {
          let fusionCard1Index = gameState.player2.hand.indexOf("shoot");
          function getCard2Index(hand) {
            let index = hand.findIndex(
              (card, i) => card === "shoot" && i !== fusionCard1Index
            );
            return index;
          }
          let fusionCard2Index = getCard2Index(gameState.player2.hand);
          startFusion(
            gameState.player2.hand[fusionCard1Index],
            fusionCard1Index,
            2
          );
          endFusion(
            gameState.player2.hand[fusionCard2Index],
            fusionCard2Index,
            2
          );

          setTimeout(() => chooseBasedOnCounter(), 500);
        } else if (
          (gameState.player2.hand.includes("pan") || gameState.player2.hand.includes("shoot")) &&
          (gameState.player2.hand.includes("rock") ||
            gameState.player2.hand.includes("scissors") ||
            gameState.player2.hand.includes("paper"))
        ) {
          if (
            hand.includes("pan") &&
            !(gameState.player2.health < 4 && gameState.player2.deck[gameState.player2.deck.length - 1] === "pan")
          ) {
            let indexOfFusionCard1 = gameState.player2.hand.indexOf("pan");

            function getCard2Index(hand) {
              let index;
              index = Math.floor(Math.random() * hand.length);
              if (hand[index] === "pan" || hand[index] === "shoot") {
                index = getCard2Index(hand);
              }
              return index;
            }
            let indexOfFusionCard2 = getCard2Index(gameState.player2.hand);
            // console.log(hand[indexOfFusionCard1], hand[indexOfFusionCard2]);

            startFusion(
              gameState.player2.hand[indexOfFusionCard1],
              indexOfFusionCard1,
              2
            );

            endFusion(
              gameState.player2.hand[indexOfFusionCard2],
              indexOfFusionCard2,
              2
            );
          } else if (
            gameState.player2.hand.includes("shoot") &&
            gameState.player2.deck[gameState.player2.deck.length - 1] !== "shoot"
          ) {
            let indexOfFusionCard1 = gameState.player2.hand.indexOf("shoot");

            function getCard2Index(hand) {
              let index;
              index = Math.floor(Math.random() * hand.length);
              if (hand[index] === "pan" || hand[index] === "shoot") {
                index = getCard2Index(hand);
              }
              return index;
            }
            let indexOfFusionCard2 = getCard2Index(gameState.player2.hand);
            // console.log(hand[indexOfFusionCard1], hand[indexOfFusionCard2]);

            startFusion(
              gameState.player2.hand[indexOfFusionCard1],
              indexOfFusionCard1,
              2
            );

            endFusion(
              gameState.player2.hand[indexOfFusionCard2],
              indexOfFusionCard2,
              2
            );
          }

          setTimeout(() => chooseBasedOnCounter(), 500);
        } else {
          chooseBasedOnCounter();
        }
      }

      function chooseBasedOnCounter() {
        const lastPlayedCard = opponentDiscard[opponentDiscard.length - 1];
        let counterCard;
        if (lastPlayedCard) {
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

            case "pan":
              counterCard = "shoot";
              break;

            case "shoot":
              counterCard =
                "rockshoot" ||
                "papershoot" ||
                "scissorsshoot" ||
                "rockpan" ||
                "paperpan" ||
                "scissorspan" ||
                "rifle";
              break;

            case lastPlayedCard.includes("pan") && lastPlayedCard.length > 3:
              switch (lastPlayedCard) {
                case "rockpan":
                  counterCard = "paperpan";
                  break;
                case "scissorspan":
                  counterCard = "rockpan";
                  break;
                case "paperpan":
                  counterCard = "scissorspan";
                  break;

                default:
                  counterCard = "rifle";
                  break;
              }
              break;

            case lastPlayedCard.includes("shoot") && lastPlayedCard.length > 5:
              switch (lastPlayedCard) {
                case "rockshoot":
                  counterCard = "scissorsshoot" || "scissorspan";
                  break;
                case "papershoot":
                  counterCard = "rockshoot" || "rockpan";
                  break;
                case "scissorsshoot":
                  counterCard = "papershoot" || "paperpan";
                  break;

                default:
                  counterCard = "rifle";
                  break;
              }
              break;

            default:
              counterCard = gameState.player2.hand[Math.floor(Math.random() * gameState.player2.hand.length)];
              break;
          }

          let indexOfCardToSelect = gameState.player2.hand.indexOf(counterCard);
          if (gameState.player2.hand.includes(counterCard)) {
            handleCardSelection(2, indexOfCardToSelect);
          } else {
            selectRandomCard();
          }
        } else {
          selectRandomCard();
        }
      }
      function calculateProb() {
        const totalCards = 10;
        const remainingCards = totalCards - gameState.player1.discard.length;

        const cardCounts = {
          rock: 2,
          paper: 2,
          scissors: 2,
          pan: cardsCounter(initialAIPowerCards)["pan"],
          shoot: cardsCounter(initialAIPowerCards)["shoot"],
        };

        opponentDiscard.forEach((card) => {
          if (card.includes("shoot") && card.length > 5) {
            cardCounts["shoot"] -= 1;
            cardCounts[card.slice(0, -5)] -= 1;
          } else if (card.includes("pan") && card.length > 3) {
            cardCounts["pan"] -= 1;
            cardCounts[card.slice(0, -3)] -= 1;
          } else {
            cardCounts[card] -= 1;
          }
        });

        const cardProbabilities = {
          rock: cardCounts.rock / remainingCards,
          paper: cardCounts.paper / remainingCards,
          scissors: cardCounts.scissors / remainingCards,
          pan: cardCounts.pan / remainingCards,
          shoot: cardCounts.shoot / remainingCards,
        };

        return cardProbabilities;
      }
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
          fusionState.player1 && endFusion(e, index, player);
        }}
      >
        {card}
      </div>
      <ul
        tabIndex={0}
        className={clsx(
          "dropdown-content menu bg-base-100 rounded-box z-[1] w-auto p-2 shadow",
          {
            hidden: fusionState.player1,
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
              startFusion(card, index, player);
            }}
          >
            Fuse
          </a>
        </li>
      </ul>
    </div>
  );
}
