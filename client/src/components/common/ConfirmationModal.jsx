import { memo, useRef } from "react";
import SubmitButton from "../common/SubmitButton";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import useEscape from "../../hooks/useEscape";

export default memo(function ConfirmationModal({ modalData, setModal }) {
  const modalRef = useRef();

  const modalHandler = () => {
    setTimeout(() => setModal(false), 300);
  };

  useOnClickOutside(modalRef, modalHandler);
  useEscape(modalRef, modalHandler);

  return (
    <div>
      <div ref={modalRef}>
        <h2>{modalData?.text1}</h2>

        <p>{modalData?.text2}</p>

        <div>
          <SubmitButton
            customClasses="text-black rounded-md font-semibold"
            type="submit"
            onclick={modalData?.btn1Handler}
            disabled={false}
            text={modalData?.btn1Text}
          />

          <button
            className="cursor-pointer rounded-md py-[8px] px-[20px] font-semibold"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
});
