import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";
import Pagenav from "../components/Pagenav";
import { useFakeAuth } from "../contexts/FakeAuthContext";

export default function Homepage() {
  const { isAuthenticated } = useFakeAuth();
  return (
    <main className={styles.homepage}>
      <Pagenav />
      <section>
        <h1>
          You travel the world.
          <br />
          WorldWise keeps track of your adventures.
        </h1>
        <h2>
          A world map that tracks your footsteps into every city you can think
          of. Never forget your wonderful experiences, and show your friends how
          you have wandered the world.
        </h2>
        <Link to={`${isAuthenticated ? "app" : "login"}`} className="cta">
          Start tracking now
        </Link>
      </section>
    </main>
  );
}
