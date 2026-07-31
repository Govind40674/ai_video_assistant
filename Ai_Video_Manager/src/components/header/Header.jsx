import React from "react";
import styles from "./Header.module.css";
import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function Header() {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <h1>
        <PlayCircle className={styles.icon} size={40} />
        AI Video Manager
      </h1>

      <div className={styles.header__right}>
        <button
          className={styles.header__button}
          disabled={!user}
          onClick={() => navigate("/save")}
        >
          Save
        </button>

        <button
          className={styles.header__button}
          disabled={!user}
          onClick={() => navigate("/history")}
        >
          History
        </button>

        {!user ? (
          <button
            className={styles.header__button}
            onClick={() => navigate("/login")}
          >
            <FcGoogle size={20} style={{ marginRight: "8px" }} />
          </button>
        ) : (
          <button
            className={styles.profileButton}
            onClick={() => navigate("/profile")}
          >
            <img src={JSON.parse(user).picture} alt="profile" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
