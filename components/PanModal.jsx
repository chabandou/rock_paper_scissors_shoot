import { cardsCounter } from "@/libs/utils";
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
        <div className="modal-box space-y-4">
          <h3 className="font-bold text-lg">
            Do you want to use your Pan as a counter?
          </h3>
          <p className="">
            Your opponent just played a powerful Shoot card. Do you want to use
            your Pan card to counter this?
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
