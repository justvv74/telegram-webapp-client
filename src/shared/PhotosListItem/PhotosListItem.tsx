import { useRef, useState } from "react";
import styles from "./photoslistitem.module.css";
import { PhotoFullscreen } from "./PhotoFullscreen";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import img from "../../assets/img/magnifyingglass.svg";

interface IPhotosListItem {
  botId: string;
  item: string;
}

export function PhotosListItem({ item, botId }: IPhotosListItem) {
  const ref = useRef<HTMLButtonElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreenPhoto, setIsFullscreenPhoto] = useState(false);
  const [copiedError, setCopiedError] = useState(false);
  const [copiedErrorValue, setCopiedErrorValue] = useState("");

  async function saveImage(element: HTMLImageElement) {
    setCopied(true);
    setCopiedError(false);
    axios
      .post(
        `${process.env.REACT_APP_SERVER_HOST}/photo`,
        {
          url: element.src,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          responseType: "blob",
        }
      )
      .then(async (res) => {
        await navigator.clipboard.write([
          new ClipboardItem({
            [res.data.type]: res.data,
          }),
        ]);
      })
      .catch((err) => {
        setCopiedErrorValue(String(err));
        setCopiedError(true);
      });

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  function modalOpen(value: boolean) {
    setIsFullscreenPhoto(value);
  }

  function handleClick() {
    setIsFullscreenPhoto(true);
    document.body.classList.add("bodyNoScroll");
  }

  return (
    <li className={styles.item}>
      <img
        className={styles.image}
        src={`https://api.telegram.org/file/bot${botId}/${item[0]}`}
        alt=""
        ref={image}
        onClick={handleClick}
      />
      {/* <p className={styles.tag}>{item[1] === null ? "без тега" : item[1]}</p> */}
      <p className={styles.tag}>
        {copiedError
          ? copiedErrorValue
          : item[1] === null
          ? "без тега"
          : item[1]}
      </p>
      <button
        className={
          copied ? `${styles.btn} ${styles.btnActive}` : `${styles.btn}`
        }
        onClick={() =>
          image.current !== null ? saveImage(image.current) : null
        }
        ref={ref}
      >
        {copied ? (copiedError ? "Error" : "Copied") : "Copy"}
      </button>
      {isFullscreenPhoto && (
        <PhotoFullscreen
          img={`https://api.telegram.org/file/bot${botId}/${item[0]}`}
          modalOpen={modalOpen}
        />
      )}
    </li>
  );
}
