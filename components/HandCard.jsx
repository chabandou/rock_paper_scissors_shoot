import { useState } from "react";
import { motion } from "framer-motion";
import Card from "./animata/Card";
import clsx from "clsx";


export default function HandCard({
    card,
    index,
    player,
    hand,
    fusionState,
    handleCardSelection,
    handleCardEffect,
    startFusion,
    endFusion,
    activeCard,
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
  
    const [willReveal, setWillReveal] = useState(false);
  
    setTimeout(() => {
      if (player === 1) {
        setWillReveal(true);
      }
    }, (hand.length - index - 1) * 400 + 150);
  
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
          transition: {
            duration:
              round === 1 && !activeCard
                ? 0.3 + 0.2 * (hand.length - index - 1)
                : 0.3,
            ease: "easeOut",
            delay: round === 1 && 0.3 * (hand.length - index - 1),
          },
        }}
        // exit={{
        //   scale: 1,
        //   right: player === 1 ? `calc(50% + 7.5vw)` : `calc(50% - 15vw)`,
        //   top: player === 2 && "50%",
        //   bottom: player === 1 && "50%",
        //   translateY: player === 1 ? "50%" : "-50%",
        //   translateX: player === 1 ? "50%" : "-50%",
        //   rotateY: player === 1 ? "180deg" : "0deg",
        //   transition: { duration: 0.2, ease: "linear" },
        // }}
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
          <Card name={card} revealed={willReveal} position={"hand"} />
        </div>
        <ul
          tabIndex={0}
          className={clsx(
            "dropdown-content menu w-full bg-base-100 rounded-box p-1 shadow z-50",
            {
              hidden: fusionState.player1 || activeCard,
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