import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";

function Profile() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_NODEL}/profile/${currentUser.email}`
      );

      setUser(response.data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();

    navigate("/");
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_URL_NODEL}/delete_account`,
        {
          data: {
            email: currentUser.email,
          },
        }
      );

      localStorage.clear();

      alert("Account deleted successfully.");

      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Unable to delete account.");
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading...
      </div>
    );
  }

  return (
    <>
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.menuContainer}>
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowModal(true);
                }}
              >
                Delete Account
              </button>
            </div>
          )}
        </div>

        <img
          src={
            user.picture ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(user.name)
          }
          alt="profile"
          className={styles.image}
        />

        <h2>{user.name}</h2>

        <p className={styles.email}>
          {user.email}
        </p>

        <p className={styles.joined}>
          Joined:
          {" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <button
          className={styles.logout}
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Delete Account?</h2>

            <p>
              This action cannot be undone.
              <br />
              All your saved videos,
              history and vector database
              will be permanently deleted.
            </p>

            <div className={styles.modalButtons}>
              <button
                className={styles.cancel}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className={styles.delete}
                onClick={deleteAccount}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
}

export default Profile;