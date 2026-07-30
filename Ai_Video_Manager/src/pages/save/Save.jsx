import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Save.module.css";

function Save() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_NODEL}/save_video_data/${user.email}`
        );

        setVideos(response.data.videos);
      } catch (err) {
        console.error(err);
        setError("Failed to load saved videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading saved videos...
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
        Saved Videos
      </h1>

      {videos.length === 0 ? (
        <div className={styles.empty}>
          No saved videos found.
        </div>
      ) : (
        <div className={styles.list}>
          {videos.map((video) => (
            <div
              key={video._id}
              className={styles.card}
              onClick={() => navigate(`/save/${video._id}`)}
            >
              <h2>{video.title}</h2>

              <p>
                {new Date(video.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Save;