import { useRef, useState } from "react";
import styles from "./photoslistitem.module.css";
import { PhotoFullscreen } from "./PhotoFullscreen";
import axios from "axios";

interface IPhotosListItem {
  botId: string;
  item: string;
}

export function PhotosListItem({ item, botId }: IPhotosListItem) {
  const image = useRef<HTMLImageElement>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreenPhoto, setIsFullscreenPhoto] = useState(false);
  const [copiedError, setCopiedError] = useState(false);

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
      .then((res) => {
        navigator.clipboard.write([
          new ClipboardItem({
            [res.data.type]: res.data,
          }),
        ]);
      })
      .catch((err) => setCopiedError(true));

    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
        src={`https://api.telegram.org/file/bot${botId}/${item}`}
        alt=""
        ref={image}
        onClick={handleClick}
      />
      <button
        className={
          copied ? `${styles.btn} ${styles.btnActive}` : `${styles.btn}`
        }
        onClick={() =>
          image.current !== null ? saveImage(image.current) : null
        }
      >
        {copied ? (copiedError ? "Error" : "Copied") : "Copy"}
      </button>
      {isFullscreenPhoto && (
        <PhotoFullscreen
          img={`https://api.telegram.org/file/bot${botId}/${item}`}
          modalOpen={modalOpen}
        />
      )}
    </li>
  );
}
