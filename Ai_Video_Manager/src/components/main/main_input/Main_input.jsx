import React, { useState } from "react";
import styles from "./Main_input.module.css";
import axios from "axios";

function Main_input() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const user = localStorage.getItem("user");
  const currentUser = user ? JSON.parse(user) : null;

  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);

  const [result, setResult] = useState(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [keyDecisions, setKeyDecisions] = useState("");
  const [unsolvedQuestions, setUnsolvedQuestions] = useState("");

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a video or audio file.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);
    setAnswers(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      if (currentUser) {
        formData.append("user_email", currentUser.email);
      }

      let response;

      if (!currentUser) {
        response = await axios.post(
          `${import.meta.env.VITE_URL_PYTHON}/unsigned/process_video`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_URL_PYTHON}/signed/process_video`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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

      if (currentUser) {
        await axios.post(
          `${import.meta.env.VITE_URL_NODEL}/save_video_data`,
          {
            user_email: currentUser.email,
            title: response.data.title,
            summary: response.data.summary,
            action_items: response.data.action_items,
            key_decisions: response.data.key_decisions,
            questions: response.data.questions,
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

    setAsking(true);
    setError("");

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

      await axios.post(
        `${import.meta.env.VITE_URL_NODEL}/save_video_data/history`,
        {
          user_email: currentUser.email,
          title,
          question,
          answer: response.data.answer,
        }
      );
    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response.data);
      }

      setError("Something went wrong.");
    } finally {
      setAsking(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.container}>
        <input
          type="file"
          accept="video/*,audio/*"
          disabled={loading}
          onChange={(e) => setFile(e.target.files[0])}
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
            "Upload & Process"
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
            disabled={asking}
            onChange={(e) => setQuestion(e.target.value)}
            className={styles.input}
          />

          <button
            type="submit"
            className={styles.button}
            disabled={asking || !question.trim()}
          >
            {asking ? (
              <>
                <span className={styles.loader}></span>
                Asking...
              </>
            ) : (
              "Ask"
            )}
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