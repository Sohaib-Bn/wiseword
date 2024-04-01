// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/UseUrlPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_API = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const { createCity, isLoading } = useCities();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  const { mapLat, mapLng } = useUrlPosition();

  const navigate = useNavigate();

  const handleSubmit = async function (e) {
    e.preventDefault();

    const newCity = {
      cityName,
      country,
      date,
      notes,
      emoji,
      position: { lat: mapLat, lng: mapLng },
    };
    await createCity(newCity);
    navigate("/app/cities");
  };

  useEffect(() => {
    if (!mapLat || !mapLng) return;

    async function fetchCity() {
      try {
        setIsLoadingCity(true);
        setGeocodingError("");
        const res = await fetch(
          `${BASE_API}?latitude=${mapLat}&longitude=${mapLng}`
        );
        const data = await res.json();
        if (!data.countryName)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 😉"
          );

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingCity(false);
      }
    }
    fetchCity();
  }, [mapLat, mapLng]);

  if (isLoadingCity) return <Spinner />;

  if (geocodingError) return <Message message={geocodingError} />;

  if (!mapLat || !mapLng)
    return <Message message="Start by clicking on the map" />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          type="back"
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
