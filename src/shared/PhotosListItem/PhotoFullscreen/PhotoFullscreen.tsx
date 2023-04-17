import React from "react";
import styles from "./photofullscreen.module.css";
import ReactDOM from "react-dom";

interface IPhotoFullscreen {
  img: string;
  modalOpen: (e: boolean) => void;
}

export function PhotoFullscreen({ img, modalOpen }: IPhotoFullscreen) {
  function handleClick() {
    modalOpen(false);
    document.body.classList.remove("bodyNoScroll");
  }

  const node = document.getElementById("modal-root");
  if (!node) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className={styles.modalPhotoBox}>
      <button className={styles.modalBoxCloseBtn} onClick={handleClick}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.666641 15.3044L15.3333 0.000153846L16 0.695801L1.33331 16L0.666641 15.3044Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.666687 -0.000125032L15.3334 15.3041L14.6667 15.9998L1.94673e-05 0.695522L0.666687 -0.000125032Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <img className={styles.modalPhoto} src={img} alt="" />
    </div>,
    node
  );
}
