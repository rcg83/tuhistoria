import { useEffect, useState } from "react";

function App() {
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setApiMessage(data.mensaje || data.message || "API funcionando");
      } catch (err: any) {
        setError("API no disponible");
        console.error(err);
      }
    };

    checkAPI();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>TuHistoria Frontend</h1>
      {apiMessage && <p>API responde: {apiMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;