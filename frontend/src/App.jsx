import { useEffect, useState } from "react";
import { getHealth } from "./services/api";

function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await getHealth();
        setHealth(data);
      } catch (error) {
        setError(error.message);
      }
    };

    checkBackend();
  }, []);

  return (
    <div>
      <h1>DevMentor AI</h1>

      {health && (
        <p>
          {health.message}
        </p>
      )}

      {error && (
        <p>
          Backend connection failed: {error}
        </p>
      )}

      {!health && !error && (
        <p>Checking backend connection...</p>
      )}
    </div>
  );
}

export default App;