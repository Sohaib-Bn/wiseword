import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();

const BASE_API = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currCity: {},
  error: "",
};

const reducer = function (state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };

    case "city/loaded": {
      return {
        ...state,
        currCity: action.payload,
        isLoading: false,
      };
    }

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currCity: action.payload,
      };

    case "city/deleted": {
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    }

    case "rejected":
      return {
        ...state,
        isLoading: false,
      };

    default:
      alert("There was a error, try again");
  }
};

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currCity, setCurrCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_API}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({ type: "rejected" });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_API}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
        if (res.status === 404) throw new Error("Faild to Fetch the city");
      } catch (err) {
        dispatch({ type: "rejected" });
      }
    },
    [currCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_API}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({ type: "rejected" });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_API}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "rejected" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

const useCities = function () {
  const value = useContext(CitiesContext);
  if (value === undefined)
    throw new Error("useCities have been used out of the context provider");
  return value;
};

export { CitiesProvider, useCities };
