import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./VideoDetails.module.css";

function VideoDetails() {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(true);

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [asking, setAsking] = useState(false);

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL_NODEL}/save_video_data/details/${id}`
      );

      setVideo(res.data.video);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    setAsking(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_PYTHON}/signed/ask_question`,
        {
          params: {
            user_email: user.email,
            title: video.title,
            question,
          },
        }
      );

      setAnswer(response.data.answer);

      await axios.post(
        `${import.meta.env.VITE_URL_NODEL}/save_video_data/history`,
        {
          user_email: user.email,
          title: video.title,
          question,
          answer: response.data.answer,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading...
      </div>
    );
  }

  if (!video) {
    return (
      <div className={styles.loading}>
        Video not found.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {video.title}
      </h1>

      <div className={styles.card}>
        <h3>Summary</h3>
        <p>{video.summary}</p>
      </div>

      <div className={styles.card}>
        <h3>Action Items</h3>
        <p>{video.action_items}</p>
      </div>

      <div className={styles.card}>
        <h3>Key Decisions</h3>
        <p>{video.key_decisions}</p>
      </div>

      <div className={styles.card}>
        <h3>Unsolved Questions</h3>
        <p>{video.questions}</p>
      </div>

      <form
        onSubmit={askQuestion}
        className={styles.askBox}
      >
        <input
          type="text"
          placeholder="Ask anything about this video..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={styles.input}
        />

        <button
          className={styles.button}
          disabled={asking}
        >
          {asking ? "Thinking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className={styles.answer}>
          <h3>Answer</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default VideoDetails;
