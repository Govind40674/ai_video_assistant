import React, { useState } from "react";
import styles from "./Main_input.module.css";
import axios from "axios";

function Main_input() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const user = localStorage.getItem("user");
  const currentUser = user ? JSON.parse(user) : null;

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [keyDecisions, setKeyDecisions] = useState("");
  const [unsolvedQuestions, setUnsolvedQuestions] = useState("");

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(null);

  const isValidUrl = (value) => {
    try {
      const parsed = new URL(value);

      return (
        parsed.protocol === "http:" ||
        parsed.protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let response;

      if (!currentUser) {
        setResult(null);
        response = await axios.get(
          `${import.meta.env.VITE_URL_PYTHON}/unsigned/process_video`,
          {
            params: {
              url,
            },
          }
        );
      } else {
        setResult(null);
        setAnswers(null);
        response = await axios.get(
          `${import.meta.env.VITE_URL_PYTHON}/signed/process_video`,
          {
            params: {
              user_email: currentUser.email,
              url,
            },
          }
        );
      }

      setResult(response.data);

      setTitle(response.data.title);
      setSummary(response.data.summary);
      setActionItems(response.data.action_items);
      setKeyDecisions(response.data.key_decisions);
      setUnsolvedQuestions(response.data.questions);

      if(currentUser && result){

      const savedData = await axios.post(
        `${import.meta.env.VITE_URL_NODEL}/save_video_data`,
        {
          user_email: currentUser.email,
          title,
          summary,
          action_items: actionItems,
          key_decisions: keyDecisions,
          questions: unsolvedQuestions,
        }
      );
    }

      console.log(response.data);
    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response.data);
      }

      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestion = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_PYTHON}/signed/ask_question`,
        {
          params: {
            user_email: currentUser.email,
            title,
            question,
          },
        }
      );

      setAnswers(response.data.answer);
      const savedhistory= await axios.post(
        `${import.meta.env.VITE_URL_NODEL}/save_video_data/history`,
        {
          user_email: currentUser.email,
          title,
          
  
          questions: question,
          answer: response.data.answer,
        }
      );
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.container}>
        <input
          type="url"
          placeholder="Paste video URL..."
          value={url}
          disabled={loading}
          onChange={(e) => setUrl(e.target.value)}
          className={styles.input}
          required
        />

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className={styles.loader}></span>
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {result && (
        <div className={styles.result}>
          <h2 className={styles.title}>{title}</h2>

          <p className={styles.summary}>{summary}</p>

          <h3 className={styles.subtitle}>Action Items</h3>
          <p>{actionItems}</p>

          <h3 className={styles.subtitle}>Key Decisions</h3>
          <p>{keyDecisions}</p>

          <h3 className={styles.subtitle}>Unsolved Questions</h3>
          <p>{unsolvedQuestions}</p>
        </div>
      )}

      {result && currentUser && (
        <form
          onSubmit={handleQuestion}
          className={styles.result}
        >
          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={styles.input}
          />

          <button
            type="submit"
            className={styles.button}
          >
            Ask
          </button>

          {answers && (
            <p className={styles.answer}>{answers}</p>
          )}
        </form>
      )}
    </div>
  );
}

export default Main_input;