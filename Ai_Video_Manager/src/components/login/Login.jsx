import React from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const API_URL = import.meta.env.VITE_URL_NODEL; // Use the environment variable for the API URL

function Login() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("Google Response:", credentialResponse);

      const response = await axios.post(
        `${API_URL}/api/auth/google`,
        {
          credential: credentialResponse.credential,
        }
      );

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful!");

      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };

  const handleError = () => {
    console.log("Google Login Failed");
    alert("Google Login Failed");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Welcome Back 👋</h1>
        <p>Sign in to continue using AI Video Manager</p>

        <div className={styles.googleButton}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
            width="320"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;