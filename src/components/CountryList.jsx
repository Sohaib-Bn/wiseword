import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Click on the map to select a city" />;

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((item) => item.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else {
      return arr;
    }
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
