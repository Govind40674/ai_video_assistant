import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./History.module.css";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_NODEL}/save_video_data/history/${user.email}`
        );

        setHistory(response.data.history);
      } catch (err) {
        console.error(err);
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading history...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Question History
      </h1>

      {history.length === 0 ? (
        <div className={styles.empty}>
          No history found.
        </div>
      ) : (
        history.map((item) => (
          <div
            className={styles.card}
            key={item._id}
          >
            <h2 className={styles.title}>
              {item.title}
            </h2>

            <div className={styles.section}>
              <h3>Question</h3>
              <p>{item.question}</p>
            </div>

            <div className={styles.section}>
              <h3>Answer</h3>
              <p>{item.answer}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default History;