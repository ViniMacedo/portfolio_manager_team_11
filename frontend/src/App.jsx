import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hello")
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        setMessage("Error connecting to server");
      });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Flask Template</h1>
      </header>
      <main className="app-main">
        <div className="content">
          <p>{message}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
