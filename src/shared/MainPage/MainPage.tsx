import { ChangeEvent, useEffect, useState } from "react";
import styles from "./mainpage.module.css";
import axios from "axios";
import useDebounce from "../../hooks/useDebounce";
import { PhotosListItem } from "../PhotosListItem";
import { nanoid } from "nanoid";

export function MainPage() {
  const [botId, setBotId] = useState("");
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceGetPhotosList = useDebounce(getPhotosList, 500);

  const tg = window.Telegram.WebApp;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  useEffect(() => {
    debounceGetPhotosList(value);
  }, [value]);

  function getPhotosList() {
    setLoading(true);

    axios
      .post(
        `${process.env.REACT_APP_SERVER_HOST}/search`,
        {
          userId: tg?.initDataUnsafe?.user?.id || "1308147330",
          tag: value,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        setBotId(res.data.botId);
        setList(res.data.photosList);
      })
      .catch((err) => {
        setError(String(err));
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className={styles.mainBox}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search"
      />
      {!error && (
        <ul className={styles.list}>
          {list.map((item) => (
            <PhotosListItem botId={botId} item={item} key={nanoid()} />
          ))}
        </ul>
      )}
      {loading && <div className={styles.spinner}></div>}
      {error && <p className={styles.error}>{`Ошибка: ${error}`}</p>}
      {list.length === 0 && !error && !loading && <p>{"Фотографий нет:("}</p>}
    </div>
  );
}
