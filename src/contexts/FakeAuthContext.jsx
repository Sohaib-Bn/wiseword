import { createContext, useContext, useReducer } from "react";

const FakeAuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

const reducer = function (state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    default:
      throw new Error("Unknown action");
  }
};

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const FakeAuthProvider = function ({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const login = function (email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  };
  const logout = function () {
    dispatch({ type: "logout" });
  };
  return (
    <FakeAuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </FakeAuthContext.Provider>
  );
};

const useFakeAuth = function () {
  const context = useContext(FakeAuthContext);
  if (context === undefined)
    throw new Error("Can not useFakeAuth outside the FakeAuthContext Provider");

  return context;
};

export { FakeAuthProvider, useFakeAuth };
