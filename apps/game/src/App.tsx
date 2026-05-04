import "./styles.css";

import { productName } from "@airline-career-sim/shared";

export function App() {
  return (
    <main className="game-shell">
      <section className="ops-header">
        <p>Founder Operations Desk</p>
        <h1>{productName}</h1>
      </section>
      <section className="placeholder-panel">
        <h2>Game client placeholder</h2>
        <p>
          Large-screen simulator UI will be added after the core trunk systems are designed and
          tested.
        </p>
      </section>
    </main>
  );
}
