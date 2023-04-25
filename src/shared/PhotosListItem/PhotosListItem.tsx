import { useEffect, useRef, useState } from "react";
import styles from "./photoslistitem.module.css";
import { PhotoFullscreen } from "./PhotoFullscreen";
import axios from "axios";

interface IPhotosListItem {
  botId: string;
  item: string;
}

export function PhotosListItem({ item, botId }: IPhotosListItem) {
  const ref = useRef<HTMLButtonElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [copied, setCopied] = useState(false);
  const [toChat, setToChat] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [toChatError, setToChatError] = useState(false);
  const [isFullscreenPhoto, setIsFullscreenPhoto] = useState(false);

  const tg = window.Telegram.WebApp;

  async function saveImage(element: any) {
    setCopyError(false);

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
        navigator.clipboard
          .write([
            new ClipboardItem({
              [res.data.type]: res.data,
            }),
          ])
          .then(() => {
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          })
          .catch((err) => {
            setCopyError(true);
          });
      })
      .catch((err) => {
        setCopyError(true);
      });
  }

  function handleClickToChat() {
    setToChatError(false);

    axios
      .post(
        `${process.env.REACT_APP_SERVER_HOST}/tochat`,
        {
          userId:
            tg?.initDataUnsafe?.user?.id ||
            `${process.env.REACT_APP_TELEGRAM_ID}`,
          fileId: item[2],
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(() => {
        setToChat(true);
        setTimeout(() => {
          setToChat(false);
        }, 2000);
      })
      .catch(() => setToChatError(true));
  }

  function modalOpen(value: boolean) {
    setIsFullscreenPhoto(value);
  }

  function handleClick() {
    setIsFullscreenPhoto(true);
    document.body.classList.add("bodyNoScroll");
  }

  return (
    <li
      className={styles.item}
      itemScope
      itemType="https://schema.org/ImageObject"
    >
      <meta itemProp="name" content="Пингвины"></meta>
      <img
        className={styles.image}
        src={`https://api.telegram.org/file/bot${botId}/${item[0]}`}
        itemProp="contentUrl"
        alt="картинка случайная"
        ref={image}
        onClick={handleClick}
      />
      <p className={styles.tag} itemProp="description">
        {item[1] === null ? "без тега" : item[1].toLowerCase().trim()}
      </p>
      <div className={styles.btnBox}>
        <button
          className={
            copied ? `${styles.btn} ${styles.btnActive}` : `${styles.btn}`
          }
          onClick={() =>
            image.current !== null ? saveImage(image.current) : null
          }
          ref={ref}
        >
          {copied ? (copyError ? "Error" : "Copied") : "Copy"}
        </button>
        <button
          className={
            toChat ? `${styles.btn} ${styles.btnActive}` : `${styles.btn}`
          }
          onClick={handleClickToChat}
        >
          {toChat ? (toChatError ? "Error" : "Sent") : "To chat"}
        </button>
      </div>
      {isFullscreenPhoto && (
        <PhotoFullscreen
          img={`https://api.telegram.org/file/bot${botId}/${item[0]}`}
          modalOpen={modalOpen}
        />
      )}
    </li>
  );
}
