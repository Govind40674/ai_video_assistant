import React from "react";
import { Link } from "react-router-dom";
import styles from "./Not_found.module.css";

function Not_found() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>

        <h2 className={styles.title}>
          Page Not Found
        </h2>

        <p className={styles.description}>
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className={styles.button}
        >
          Go To Home
        </Link>
      </div>
    </div>
  );
}

export default Not_found;