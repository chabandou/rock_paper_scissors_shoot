import { ubuntu } from "@/app/font";
import { cardsCounter } from "@/libs/utils";
import clsx from "clsx";
import { useEffect } from "react";

export default function PanModal({ panUsed, setPanUsed }) {
  function handleUsePan() {
    setPanUsed(true);
  }

  return (
    <>
      <button
        className="btn z-10 hidden"
        onClick={() => document.getElementById("panModal").showModal()}
      >
        open modal
      </button>
      <dialog id="panModal" className="modal">
        <div className="modal-box px-4 py-0 bg-gradient-to-b from-[#6DBECB] to-[#406E75] ">
          <div className="space-y-5 m-0 p-4 bg-neutral">
            <h3
              className={clsx(
                ubuntu.className,
                "font-bold text-[1.75vw] px-5 py-2 bg-black/40 rounded-full text-center"
              )}
            >
              Use your Pan as a counter?
            </h3>

            <p className="">
              Your opponent just played a powerful Shoot card. Do you want to
              use your Pan card to counter this?
            </p>

            <form method="dialog">
              <button className="btn" onClick={() => handleUsePan()}>
                Use it!
              </button>
              <button className="btn" onClick={() => setPanUsed(false)}>
                Not now.
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

{
  /* Open the modal using document.getElementById('ID').showModal() method */
}
{
  /* if there is a button in form, it will close the modal */
}
