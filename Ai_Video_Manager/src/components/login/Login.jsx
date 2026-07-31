import React from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const API_URL = import.meta.env.VITE_URL_NODEL;

function Login() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("API_URL:", API_URL);
      console.log("Google Response:", credentialResponse);
      console.log("Credential:", credentialResponse.credential);

      const response = await axios.post(
        `${API_URL}/api/auth/google`,
        {
          credential: credentialResponse.credential,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Backend Response:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful!");

      navigate("/");
    } catch (error) {
      console.error("=========== LOGIN ERROR ===========");

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response Data:", error.response.data);
        console.error("Headers:", error.response.headers);

        alert(
          `Login Failed\nStatus: ${error.response.status}\n${
            error.response.data?.message ||
            JSON.stringify(error.response.data)
          }`
        );
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert("Server is not responding.");
      } else {
        console.error("Error:", error.message);
        alert(error.message);
      }

      console.error(error);
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
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