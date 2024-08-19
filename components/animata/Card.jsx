import { ubuntu } from "@/app/font";
import { fusionCards } from "@/libs/cards";
import clsx from "clsx";
import Image from "next/image";

export default function Card({ name, position, revealed, index }) {
  console.log(revealed);

  const rotationClasses = ["group-hover:rotate-15", " group-hover:rotate-30", " group-hover:rotate-45"];

  return (
    <div

      className={clsx(
        "w-[7.6vw] aspect-[2/3] [prespective:1000px] transition-all duration-500 ease-in-out flex-shrink-0 origin-bottom",
        {
          "absolute": position === "discard",
          "drawAnim ": position === "hand",
        },
        position === "discard" && rotationClasses[index % 3]
      )}
    >
      <div
        className={clsx(
          "relative w-full h-full [transform-style:preserve-3d] shadow-xl transition duration-500 ease-in-out delay-[2000ms]",
          {
            "": position === "activeCard",
          },
          revealed ? "[transform:rotateY(0deg)]" : "[transform:rotateY(180deg)]"
        )}
      >
        <div className="front absolute top-0 left-0 [backface-visibility:hidden] w-full h-full">
          <Image
            src={`/card-${name}.svg`}
            alt={name}
            fill
            className="object-contain absolute top-0 left-0 z-10"
          />
          <div className={clsx("absolute top-[66%] left-1/2 -translate-x-1/2 z-20 capitalize w-full text-center", 
          {
            "top-[64%]": position === "hand",
          }
          )}>
            <h2
              className={clsx(ubuntu.className,
                "text-[1.34vw] w-full font-bold text-transparent bg-gradient-to-t bg-clip-text",
                {
                  "from-gray-500 to-white": name !== "shoot" && name !== "pan" && !name.includes("shoot") && !name.includes("pan"),
                  "from-[#673D1D] to-[#D57E3C]": name === "shoot",
                  "from-[#424A4A] to-[#E97451]": name.includes("shoot") && name.length > 5,
                  "from-[#1B5E4A] to-[#3FD4A7]": name === "pan",
                  "from-[#424A4A] to-[#3ED3A6]": name.includes("pan") && name.length > 3,
                }
              )}
            >
              {fusionCards[name]?.name ? fusionCards[name].name : name}
            </h2>
          </div>
          <div className={clsx("absolute top-[79%] left-1/2 -translate-x-1/2 z-20 w-full text-center px-2", {
            "top-[84%]": name.includes("shoot"),
          })}>
            <p
              className={clsx(
                "text-[0.66vw] w-full font-medium text-white/80",
              )}
            >
              {fusionCards[name]?.effect ? fusionCards[name].effect : ""}
            </p>
          </div>
        </div>
        <div className="back absolute top-0 left-0 [transform:rotateY(180deg)] [backface-visibility:hidden] w-full h-full">
          <Image
            src="/card-back2.svg"
            alt="card-back"
            fill
            className="object-contain absolute top-0 left-0 z-0"
          />
        </div>
      </div>
    </div>
  );
}

//group-hover:[transform:rotateY(180deg)]
