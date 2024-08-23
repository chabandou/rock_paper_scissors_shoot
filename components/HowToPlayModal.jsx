import { ubuntu } from "@/app/font";
import { cn } from "@/libs/utils";
import Image from "next/image";

export default function HowToPlayModal() {
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="group relative btn bg-[#18626d] hover:bg-[#1b525b]  btn-lg h-[6vw] w-[30vw] text-start"
        onClick={() => document.getElementById("HowToPlayModal").showModal()}
      >
        <div className="w-full mx-3 flex items-center justify-between">
          <span className="text-[1.5vw] font-extrabold">How to Play</span>{" "}
          <Image
            src="/question-dice.svg"
            alt="question-dice"
            className="group-hover:scale-125 w-[4.7vw] origin-bottom group-hover:rotate-12 group-hover:-translate-y-4 transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1);]"
            width={70}
            height={70}
          />
        </div>
      </button>
      <dialog id="HowToPlayModal" className="modal">
        <div className="modal-box max-w-[55vw]">
          <div className="flex items-center justify-center gap-4">
            <h1
              className={cn(
                ubuntu.className,
                "font-bold text-[3.25vw] text-center bg-gradient-to-r from-[#6DBECB] to-[#46777e] bg-clip-text text-transparent"
              )}
            >
              How To Play
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={80}
              height={89}
              fill="none"
              className="rotate-12 origin-bottom"
            >
              <path
                fill="url(#a)"
                d="M39.944.764c-1.3 0-2.6.291-3.607.874L4.187 20.235c-2.014 1.165-2.014 3.008 0 4.173l32.15 18.597c2.014 1.165 5.199 1.165 7.213 0L75.7 24.408c2.014-1.165 2.014-3.008 0-4.173L43.55 1.638c-1.007-.583-2.307-.874-3.606-.874Zm-.174 11.178c1.897.02 3.603.455 5.117 1.303 1.035.58 1.713 1.243 2.034 1.987.31.738.328 1.71.055 2.918l-.337 1.2c-.223.86-.27 1.478-.139 1.855.12.371.417.69.893.956l.713.4-6.995 3.919-.777-.435c-.867-.486-1.42-1.034-1.659-1.646-.25-.618-.208-1.6.125-2.948l.32-1.21c.188-.72.206-1.31.056-1.771-.138-.468-.45-.839-.936-1.11-.74-.415-1.626-.564-2.658-.448-1.043.111-2.12.478-3.23 1.1a12.4 12.4 0 0 0-2.853 2.201 13.492 13.492 0 0 0-2.228 3.008l-4.977-2.79a35.49 35.49 0 0 1 3.299-2.949c1.08-.842 2.221-1.6 3.422-2.273 3.152-1.766 6.084-2.816 8.794-3.15.675-.085 1.33-.124 1.962-.117Zm10.683 11.934 5.644 3.162-6.995 3.919-5.644-3.162 6.995-3.92ZM2.04 27.93c-1.21-.033-2.034.912-2.034 2.584v33.19c0 2.327 1.593 5.086 3.607 6.25l30.925 17.857c2.014 1.163 3.607.244 3.607-2.082V52.539c0-2.326-1.593-5.085-3.607-6.249L3.613 28.433c-.566-.328-1.1-.49-1.573-.503Zm75.932 0c-.474.013-1.007.175-1.573.502L45.474 46.291c-2.015 1.163-3.608 3.923-3.608 6.249v33.19c0 2.326 1.593 3.246 3.608 2.082l30.925-17.857c2.014-1.163 3.607-3.922 3.607-6.248V30.516c0-1.672-.823-2.617-2.034-2.585ZM10.296 41.349c1.38.287 2.64.64 3.78 1.055 1.139.416 2.24.93 3.3 1.542 2.78 1.606 4.9 3.435 6.36 5.49 1.458 2.04 2.188 4.218 2.188 6.532 0 1.187-.222 2.125-.667 2.813-.445.676-1.203 1.244-2.274 1.703l-1.094.405c-.775.303-1.283.616-1.522.938-.24.31-.359.737-.359 1.282v.818l-6.172-3.564v-.89c0-.993.188-1.763.564-2.309.376-.558 1.169-1.082 2.377-1.572l1.094-.422c.65-.254 1.123-.575 1.42-.96.306-.38.46-.849.46-1.406 0-.848-.273-1.666-.82-2.454-.548-.8-1.311-1.484-2.291-2.05a9.567 9.567 0 0 0-2.993-1.11 10.76 10.76 0 0 0-3.35-.135v-5.706Zm56.73 1.811c.32 0 .618.035.891.104 1.46.357 2.189 1.692 2.189 4.006 0 1.187-.223 2.382-.667 3.583-.445 1.19-1.203 2.633-2.274 4.33L66.07 56.85c-.774 1.198-1.282 2.097-1.521 2.695-.24.587-.359 1.152-.359 1.697v.818l-6.172 3.564v-.89c0-.994.188-1.981.564-2.961.377-.993 1.169-2.431 2.377-4.316l1.094-1.686c.65-1.005 1.123-1.871 1.42-2.6.306-.735.46-1.38.46-1.938 0-.848-.273-1.35-.82-1.507-.547-.168-1.311.03-2.291.596-.924.533-1.92 1.315-2.992 2.346-1.072 1.018-2.189 2.263-3.351 3.733v-5.706c1.379-1.304 2.638-2.407 3.778-3.308 1.14-.9 2.24-1.656 3.3-2.268 2.26-1.305 4.083-1.958 5.47-1.959Zm-53.19 19.893 6.172 3.563v6.47l-6.172-3.564v-6.469Zm50.354 1.696v6.47l-6.172 3.563v-6.469l6.172-3.564Z"
              />
              <defs>
                <linearGradient
                  id="a"
                  x1={40.006}
                  x2={40.006}
                  y1={0.764}
                  y2={88.316}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6DBECB" />
                  <stop offset={1} stopColor="#46777e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="py-4 w-[75ch]">
            Rock, Paper, Scissors, SHOOT! is a twist on the classic game of
            Rock, Paper, Scissors. So the same rules you already know apply in
            this game too.
          </p>
          <Image
            src="/how-to-play/classic-rps.svg"
            alt="classic rps"
            className="mx-auto"
            width={350}
            height={350}
          />
          <h2
            className={cn(
              ubuntu.className,
              "border-l-8 border-[#6DBECB] pl-2 font-bold text-[2vw] leading-snug"
            )}
          >
            It's Card Game:
          </h2>
          <p className="w-[75ch] py-4">
            In this game each player gets a deck of 10 cards:
          </p>
          <ul className="">
            <li className="group flex items-start py-1 ms-3">
              <svg
                width={3}
                height={24}
                className="mr-2 text-white overflow-visible"
                viewBox="0 -9 3 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={1.5}
                  d="m0 0 3 3-3 3"
                />
              </svg>
              6 of them are the classic (Basic) Rock, Paper, Scissors, two of
              each represented as playing cards
            </li>
            <li className="group flex items-start py-1 ms-3">
              <svg
                width={3}
                height={24}
                className="mr-2 text-white overflow-visible"
                viewBox="0 -9 3 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={1.5}
                  d="m0 0 3 3-3 3"
                />
              </svg>
              The 4 others are special cards called Power-Cards that are
              specific to this game.
            </li>
          </ul>
          <p className="w-[75ch] py-4"></p>
          <Image
            src="/how-to-play/deck-compo.svg"
            alt="deck compo"
            className="mx-auto"
            width={700}
            height={350}
          />
          <h2
            className={cn(
              ubuntu.className,
              "border-l-8 border-[#6DBECB] pl-2 font-bold text-[2vw] leading-snug mt-8"
            )}
          >
            The ❝Power❞ of the Power-Cards:
          </h2>
          <p className="py-4 w-[75ch]">
            Power-Cards can be two types "Shoot" & "Pan" (yes, the kitchen
            utensil, clearly I was hungry when I came up with this). <br />{" "}
            Shoot card can beat all basic RPS cards, but you have to be carful
            because it can be countered by the Pan card and causes reverse
            damage.
          </p>
          <Image
            src="/how-to-play/RPSS-dynamics.svg"
            alt="RPSS dynamics"
            className="mx-auto"
            width={450}
            height={450}
          />
          <h2
            className={cn(
              ubuntu.className,
              "border-l-8 border-[#6DBECB] pl-2 font-bold text-[2vw] leading-snug mt-8"
            )}
          >
            Flow of the Game & Goal:
          </h2>
          <p className="py-4 w-[75ch]">
            The game plays in rounds, each round the player and their opponent
            both choose a card to play (choose the play button on a card's menu
            to play it) similar to choosing a rock, paper or scissors in classic
            RPS, the cards are then revealed on the field and the player with
            the more poweful card wins that round and deals damage to the
            loser's health points.
            <br />
            <br />
            Most cards deal 1 damage but "Shoot" fusions (more on fusions below)
            deal 2 or more damage.
            <br />
            The game is won if you deplete your opponent's health to 0 or get
            them to run out of cards.
          </p>
          <h2
            className={cn(
              ubuntu.className,
              "border-l-8 border-[#6DBECB] pl-2 font-bold text-[2vw] leading-snug mt-8"
            )}
          >
            Fusions:
          </h2>
          <p className="py-4 w-[75ch]">
            Power Cards have one more cool feature: they can be fused with basic
            Rock, Paper, Scissors cards to make even more powerful cards, the
            resulting cards from the fusion inherit the power of the materials
            they were made from. You can experiment with them and mix and match
            to reveal them all.
            <br />
            To fuse cards click the fuse button from the card menu and then
            click on the second card you want to fuse with.
          </p>
          <Image
            src="/how-to-play/fusions-enter.svg"
            alt="fusion enter"
            className="mx-auto"
            width={700}
            height={350}
          />
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
