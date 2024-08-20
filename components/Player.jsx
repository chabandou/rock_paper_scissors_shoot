import { cardsCounter, cn } from "@/libs/utils";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Card from "./animata/Card";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ubuntu } from "@/app/font";

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
  revealed,
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
          (gameState.player2.hand.includes("pan") ||
            gameState.player2.hand.includes("shoot")) &&
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
          endFusion(
            gameState.player2.hand[indexOfFusionCard2],
            indexOfFusionCard2,
            2
          );

          setTimeout(() => selectRandomCard(), 500);
        } else if (
          cardsCounter(gameState.player2.hand).pan > 1 &&
          randomNum <= 0.5
        ) {
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

          setTimeout(() => selectRandomCard(), 500);
        } else if (
          cardsCounter(gameState.player2.hand).shoot > 1 &&
          randomNum <= 0.5
        ) {
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

          setTimeout(() => selectRandomCard(), 500);
        } else {
          let indexOfCardToSelect = Math.floor(
            Math.random() * gameState.player2.hand.length
          );
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

        if (
          cardsCounter(gameState.player2.hand).pan > 1 &&
          gameState.player2.health < 4
        ) {
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
          (gameState.player2.hand.includes("pan") ||
            gameState.player2.hand.includes("shoot")) &&
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
            gameState.player2.deck[gameState.player2.deck.length - 1] !==
              "shoot"
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

        if (
          cardsCounter(gameState.player2.hand).pan > 1 &&
          gameState.player2.health < 4
        ) {
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
          (gameState.player2.hand.includes("pan") ||
            gameState.player2.hand.includes("shoot")) &&
          (gameState.player2.hand.includes("rock") ||
            gameState.player2.hand.includes("scissors") ||
            gameState.player2.hand.includes("paper"))
        ) {
          if (
            hand.includes("pan") &&
            !(
              gameState.player2.health < 4 &&
              gameState.player2.deck[gameState.player2.deck.length - 1] ===
                "pan"
            )
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
            gameState.player2.deck[gameState.player2.deck.length - 1] !==
              "shoot"
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
              counterCard =
                gameState.player2.hand[
                  Math.floor(Math.random() * gameState.player2.hand.length)
                ];
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
  let deckSrc =
    deck.length >= 3
      ? "/card-deck.svg"
      : deck.length === 2
      ? "/card-deck-only2.svg"
      : "/card-back2.svg";

  return (
    <>
      <div
        className={clsx(
          "activeCard absolute top-1/2 translate-y-[-50%] -translate-x-1/2 z-0",
          {
            "left-[calc(50%+calc(10vw*0.74))]": player === 2,
            "left-[calc(50%-calc(10vw*0.74))]": player === 1,
          }
        )}
      >
        {player === 1
          ? gameState.player1.activeCard && (
              <Card
                name={activeCard}
                position={"activeCard"}
                revealed={revealed}
              />
            )
          : gameState.player2.activeCard && (
              <Card
                name={activeCard}
                position={"activeCard"}
                revealed={revealed}
              />
            )}
      </div>

      <div
        className={cn("deck absolute aspect-[2/3] right-[calc(0.7vw)]", {
          "top-[calc(0.7vw)]": player === 2,
          "bottom-[calc(0.7vw)]": player === 1,
          "aspect-[2.15/3] w-[9vw]": deckSrc === "/card-deck.svg",
          "w-[7.6vw]": deckSrc !== "/card-deck.svg",
        })}
      >
        {deck.length > 0 && (
          <Image
            src={deckSrc}
            alt="card-back"
            fill
            className="object-contain absolute top-0 left-0 z-0 "
          />
        )}
        <span
          className={clsx("absolute top-1/2 -translate-y-1/2 left-1/2 ", {
            "-translate-x-1/2": deckSrc !== "/card-deck.svg",
          })}
        >
          {deck.length}
        </span>
      </div>
      <div
        className={clsx(
          "absolute w-full h-full player left-1/2 translate-x-[-50%] flex items-center justify-center z-10",
          {
            "top-0": player === 2,
            "bottom-0 z-20": player === 1,
          }
        )}
      >
        <div className="hand flex items-center justify-center gap-2">
          <AnimatePresence mode="sync">
            <motion.div
              animate={{
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              }}
            >
              {hand.map((card, index) => (
                <Dropdown
                  key={index}
                  card={card}
                  index={index}
                  player={player}
                  hand={hand}
                  handleCardSelection={handleCardSelection}
                  handleCardEffect={handleCardEffect}
                  startFusion={startFusion}
                  endFusion={endFusion}
                  fusionState={fusionState}
                  round={round}
                />
              ))}
            </motion.div>
          </AnimatePresence>
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
        className={clsx(
          "playerDiscard group absolute w-[7.6vw] aspect-[2/3] left-[calc(0.7vw)] origin-bottom transition-all duration-500 ease-in-out hover:-rotate-[15deg] z-10",
          {
            "top-[calc(0.7vw)]": player === 2,
            "top-[calc(100%-0.7vw-11.25vw)]": player === 1,
          }
        )}
        onClick={() =>
          document
            .getElementById(player === 1 ? "my_modal_3" : "my_modal_2")
            .showModal()
        }
      >
        <span className={clsx("absolute top-1 left-2 z-[5]")}>
          {playerDiscard.length}
        </span>

        {playerDiscard.map((card, i) => {
          return (
            <Card name={card} position={"discard"} revealed={true} index={i} />
          );
        })}
        <dialog
          id={player === 1 ? "my_modal_3" : "my_modal_2"}
          className="modal"
        >
          <div className="modal-box px-4 py-0 bg-gradient-to-b from-[#6DBECB] to-[#406E75] ">
            <div className="space-y-5 m-0 p-4 bg-neutral">
              <h3
                className={clsx(
                  ubuntu.className,
                  "font-bold text-[1.75vw] px-5 py-2 bg-black/40 rounded-full text-center"
                )}
              >
                {player === 1 ? "Player 1" : "Opponent"} Discarded Cards
              </h3>

              <p className="py-4">
                These are the cards that{" "}
                {player === 1 ? "You" : "Your Oppenent"} have played:
              </p>
              <div className="flex items-center gap-3 overflow-x-auto">
                {playerDiscard.map((card, i) => {
                  return <Card name={card} revealed={true} index={i} />;
                })}
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </>
  );
}

function Dropdown({
  card,
  index,
  player,
  hand,
  fusionState,
  handleCardSelection,
  handleCardEffect,
  startFusion,
  endFusion,
  round,
  key,
}) {
  const fieldWidth =
    (document.querySelector(".field")?.offsetWidth * 7.5) / 112;
  console.log(fieldWidth);
  const cardWidth = 10;
  const cardGap = 0;
  let cardSpace = hand.length * cardWidth + cardGap * (hand.length - 1);
  let card1Right = (fieldWidth - cardSpace) / 2;
  return (
    <motion.div
      key={key}
      whileHover={{
        scale: 1.3,
        translateY: player === 1 ? "15%" : "25%",
        transition: { duration: 0.1, ease: "linear" },
      }}
      // whileTap={{ scale: 0.9 }}
      initial={{
        position: "absolute",
        scale: 1.1,
        translateY: 0,
        right: "0.7vw",
        bottom: player === 1 && "0.7vw",
        top: player === 2 && "0.7vw",
      }}
      animate={{
        scale: 1.2,
        translateY: player === 1 ? "50%" : "-50%",
        right:
          index === hand.length - 1
            ? `${card1Right}vw`
            : `${
                card1Right + (cardWidth + cardGap) * (hand.length - index - 1)
              }vw`,
        transition: { duration: 0.3, ease: "easeOut", delay: round === 1 && (0.3 * (hand.length - index - 1)) },
      }}
      exit={{
        scale: 1,
        right: player === 1 ? `calc(50% + 7.5vw)` : `calc(50% - 15vw)`,
        top: player === 2 && "50%",
        bottom: player === 1 && "50%",
        translateY: player === 1 ? "50%" : "-50%",
        translateX: player === 1 ? "50%" : "-50%",
        rotateY: player === 1 ? "180deg" : "0deg",
        transition: { duration: 0.2, ease: "linear" },
      }}
      className={clsx(
        "dropdown dropdown-top dropdown-hover transition-all duration-300 ease-in-out z-50"
      )}
    >
      <div
        className=""
        role="button"
        onClick={(e) => {
          endFusion(e, index, player);
        }}
      >
        <Card name={card} revealed={player === 1 && true}  position={"hand"} />
      </div>
      <ul
        tabIndex={0}
        className={clsx(
          "dropdown-content menu bg-base-100 rounded-box w-auto p-2 shadow z-50",
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
                handleCardSelection(player, index),
                card === "dinner"
                  ? handleCardEffect(player, card, index)
                  : null;
            }}
            className={clsx({
              "btn-disabled text-slate-600": card === "pan",
            })}
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
    </motion.div>
  );
}
