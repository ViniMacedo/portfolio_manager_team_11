import { useEffect, useState } from "react";
import axios from "axios";
import { testApi } from "./services/api";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleCreateEntry = async () => {
    try {
      setLoading(true);
      await testApi.create(`Test entry ${Date.now()}`);
      const response = await testApi.list();
      setEntries(response.data);
    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListEntries = async () => {
    try {
      setLoading(true);
      const response = await testApi.list();
      setEntries(response.data);
    } catch (error) {
      console.error('Error listing entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearEntries = async () => {
    try {
      setLoading(true);
      await testApi.clear();
      setEntries([]);
    } catch (error) {
      console.error('Error clearing entries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Flask Template</h1>
      </header>
      <main className="app-main">
        <div className="content">
          <p>{message}</p>
          
          <div className="db-test-section">
            <h2>Database Test</h2>
            <div className="button-group">
              <button onClick={handleCreateEntry} disabled={loading}>Create Test Entry</button>
              <button onClick={handleListEntries} disabled={loading}>List Entries</button>
              <button onClick={handleClearEntries} disabled={loading}>Clear Entries</button>
            </div>
            
            {entries.length > 0 && (
              <div className="entries-list">
                <h3>Database Entries:</h3>
                <ul>
                  {entries.map(entry => (
                    <li key={entry.id}>
                      {entry.content} (Created: {new Date(entry.created_at).toLocaleString()})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
